import 'dotenv/config';
import crypto from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

const PORT = Number(process.env.PORT || 3001);
const DEMO_MODE = process.env.MOMO_DEMO_MODE !== 'false';
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
const TARGET_ENVIRONMENT = process.env.MOMO_TARGET_ENVIRONMENT || 'sandbox';
const BASE_URLS = {
  sandbox: 'https://sandbox.momodeveloper.mtn.com',
  'mtn-ghana': 'https://proxy.momoapi.mtn.com',
};
const MOMO_BASE_URL = BASE_URLS[TARGET_ENVIRONMENT];
const CURRENCY = 'GHS';
const MAX_AMOUNT_MINOR = 500000;
const PHONE_REGEX = /^233(?:20|23|24|25|26|27|28|50|53|54|55|59)\d{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFERENCE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEMO_AUTO_APPROVE_MS = 4000;
const REQUEST_TIMEOUT_MS = 12000;
const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.MOMO_DATABASE_PATH
  ? path.resolve(process.env.MOMO_DATABASE_PATH)
  : path.join(SERVER_DIR, 'data', 'payments.sqlite3');

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be a valid TCP port.');
}
if (process.env.MOMO_DEMO_MODE && !['true', 'false'].includes(process.env.MOMO_DEMO_MODE)) {
  throw new Error('MOMO_DEMO_MODE must be true or false.');
}
if (!MOMO_BASE_URL) {
  throw new Error('MOMO_TARGET_ENVIRONMENT must be "sandbox" or "mtn-ghana".');
}
if (process.env.NODE_ENV === 'production' && DEMO_MODE) {
  throw new Error('MOMO_DEMO_MODE must be false in production.');
}
if (process.env.TRUST_PROXY && !['true', 'false'].includes(process.env.TRUST_PROXY)) {
  throw new Error('TRUST_PROXY must be true or false.');
}
if (!DEMO_MODE && (!process.env.MOMO_SUBSCRIPTION_KEY || !process.env.MOMO_API_USER || !process.env.MOMO_API_KEY)) {
  throw new Error('MTN credentials are required when MOMO_DEMO_MODE=false.');
}
if (!DEMO_MODE && TARGET_ENVIRONMENT === 'sandbox' && process.env.NODE_ENV === 'production') {
  throw new Error('Production deployment must use MOMO_TARGET_ENVIRONMENT=mtn-ghana.');
}
if (process.env.MOMO_CALLBACK_URL) {
  const callback = new URL(process.env.MOMO_CALLBACK_URL);
  if (callback.protocol !== 'https:' || !callback.pathname.endsWith('/api/webhooks/mtn')) {
    throw new Error('MOMO_CALLBACK_URL must be an HTTPS URL ending in /api/webhooks/mtn.');
  }
}

const dbDirectory = path.dirname(DB_PATH);
mkdirSync(dbDirectory, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    amount_minor INTEGER NOT NULL,
    currency TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    msisdn TEXT NOT NULL,
    network TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS payments (
    reference TEXT PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
    provider TEXT NOT NULL,
    status TEXT NOT NULL,
    provider_transaction_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS payment_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL,
    event_type TEXT NOT NULL,
    result TEXT NOT NULL,
    provider_transaction_id TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
`);

const insertOrder = db.prepare(`
  INSERT INTO orders (id, idempotency_key, amount_minor, currency, customer_name, customer_email, msisdn, network, status, created_at, updated_at)
  VALUES (@id, @idempotency_key, @amount_minor, @currency, @customer_name, @customer_email, @msisdn, @network, @status, @created_at, @updated_at)
`);
const insertPayment = db.prepare(`
  INSERT INTO payments (reference, order_id, provider, status, created_at, updated_at)
  VALUES (@reference, @order_id, @provider, @status, @created_at, @updated_at)
`);
const updatePaymentStatus = db.transaction((reference, status, transactionId) => {
  const now = new Date().toISOString();
  const result = db.prepare(`
    UPDATE payments SET status = ?, provider_transaction_id = COALESCE(?, provider_transaction_id), updated_at = ?
    WHERE reference = ? AND status = 'PENDING'
  `).run(status, transactionId || null, now, reference);
  if (result.changes > 0) {
    const orderStatus = status === 'SUCCESSFUL' ? 'PAID' : 'PAYMENT_FAILED';
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = (SELECT order_id FROM payments WHERE reference = ?)')
      .run(orderStatus, now, reference);
  }
  return db.prepare(`
    SELECT p.reference, p.order_id, p.status AS payment_status, p.provider_transaction_id,
           o.amount_minor, o.currency, o.msisdn, o.status AS order_status, o.created_at
    FROM payments p JOIN orders o ON o.id = p.order_id WHERE p.reference = ?
  `).get(reference);
});
const findPayment = db.prepare(`
  SELECT p.reference, p.order_id, p.status AS payment_status, p.provider_transaction_id,
         o.amount_minor, o.currency, o.msisdn, o.status AS order_status, o.created_at
  FROM payments p JOIN orders o ON o.id = p.order_id WHERE p.reference = ?
`);
const findPaymentByIdempotencyKey = db.prepare(`
  SELECT p.reference, p.order_id, p.status AS payment_status, p.provider_transaction_id,
         o.amount_minor, o.currency, o.msisdn, o.status AS order_status, o.created_at
  FROM payments p JOIN orders o ON o.id = p.order_id WHERE o.idempotency_key = ?
`);
const logPaymentEvent = db.prepare(`
  INSERT OR IGNORE INTO payment_events (reference, event_type, result, provider_transaction_id, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

let cachedAccessToken = null;
let cachedTokenExpiresAt = 0;

function logEvent(reference, eventType, result, transactionId = null) {
  logPaymentEvent.run(reference, eventType, result, transactionId, new Date().toISOString());
  console.info(JSON.stringify({
    event: 'momo_payment_event',
    reference,
    eventType,
    result,
    transactionId: transactionId || undefined,
    at: new Date().toISOString(),
  }));
}

function normalizeGhanaPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) return `233${digits.slice(1)}`;
  if (digits.startsWith('233') && digits.length === 12) return digits;
  return null;
}

function jsonResponse(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function providerFetch(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
}

async function getAccessToken(forceRefresh = false) {
  if (!forceRefresh && cachedAccessToken && cachedTokenExpiresAt > Date.now() + 30000) {
    return cachedAccessToken;
  }
  const basic = Buffer.from(`${process.env.MOMO_API_USER}:${process.env.MOMO_API_KEY}`).toString('base64');
  const response = await providerFetch(`${MOMO_BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
    },
  });
  if (!response.ok) {
    console.error(JSON.stringify({ event: 'momo_token_error', status: response.status }));
    throw new Error('MTN_TOKEN_REQUEST_FAILED');
  }
  const token = await response.json();
  if (!token.access_token || !Number.isFinite(Number(token.expires_in))) {
    throw new Error('MTN_TOKEN_RESPONSE_INVALID');
  }
  cachedAccessToken = token.access_token;
  cachedTokenExpiresAt = Date.now() + Number(token.expires_in) * 1000;
  return cachedAccessToken;
}

async function requestProviderStatus(payment, retryAuth = true) {
  const accessToken = await getAccessToken();
  const response = await providerFetch(
    `${MOMO_BASE_URL}/collection/v1_0/requesttopay/${encodeURIComponent(payment.reference)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
        'X-Target-Environment': TARGET_ENVIRONMENT,
      },
    },
  );
  if (response.status === 401 && retryAuth) {
    cachedAccessToken = null;
    cachedTokenExpiresAt = 0;
    return requestProviderStatus(payment, false);
  }
  if (response.status === 404) return { status: 'PENDING' };
  if (!response.ok) {
    console.error(JSON.stringify({ event: 'momo_status_error', reference: payment.reference, status: response.status }));
    throw new Error('MTN_STATUS_REQUEST_FAILED');
  }
  return response.json();
}

async function checkMtnAccountHolder(msisdn, retryAuth = true) {
  const accessToken = await getAccessToken();
  const response = await providerFetch(
    `${MOMO_BASE_URL}/collection/v1_0/accountholder/MSISDN/${encodeURIComponent(msisdn)}/active`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
        'X-Target-Environment': TARGET_ENVIRONMENT,
      },
    },
  );
  if (response.status === 401 && retryAuth) {
    cachedAccessToken = null;
    cachedTokenExpiresAt = 0;
    return checkMtnAccountHolder(msisdn, false);
  }
  if (response.status === 404) return false;
  if (!response.ok) {
    console.error(JSON.stringify({ event: 'momo_account_check_error', status: response.status }));
    throw new Error('MTN_ACCOUNT_CHECK_FAILED');
  }
  return true;
}

function providerResultMatchesPayment(result, payment) {
  const resultAmount = Math.round(Number(result.amount) * 100);
  const resultPhone = normalizeGhanaPhone(result.payer?.partyId);
  return result.currency === payment.currency
    && Number.isFinite(resultAmount)
    && resultAmount === payment.amount_minor
    && resultPhone === payment.msisdn
    && (!result.externalId || result.externalId === payment.reference);
}

async function verifyAndUpdatePayment(payment) {
  const providerResult = await requestProviderStatus(payment);
  const providerStatus = String(providerResult.status || '').toUpperCase();
  if (providerStatus === 'SUCCESSFUL') {
    if (!providerResultMatchesPayment(providerResult, payment)) {
      logEvent(payment.reference, 'provider_status_verified', 'verification_mismatch', providerResult.financialTransactionId);
      return updatePaymentStatus(payment.reference, 'FAILED', providerResult.financialTransactionId);
    }
    logEvent(payment.reference, 'provider_status_verified', 'successful', providerResult.financialTransactionId);
    return updatePaymentStatus(payment.reference, 'SUCCESSFUL', providerResult.financialTransactionId);
  }
  if (['FAILED', 'REJECTED', 'EXPIRED'].includes(providerStatus)) {
    logEvent(payment.reference, 'provider_status_verified', providerStatus.toLowerCase(), providerResult.financialTransactionId);
    return updatePaymentStatus(payment.reference, providerStatus, providerResult.financialTransactionId);
  }
  logEvent(payment.reference, 'provider_status_checked', 'pending');
  return payment;
}

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '16kb' }));

const paymentRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many payment attempts. Wait a minute and try again.' } },
});
const statusRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

app.get('/api/payments/config', (_req, res) => {
  res.json({ demoMode: DEMO_MODE, network: 'MTN', currency: CURRENCY });
});

app.post('/api/payments', paymentRateLimit, asyncRoute(async (req, res) => {
  const idempotencyKey = req.get('Idempotency-Key') || '';
  if (!REFERENCE_REGEX.test(idempotencyKey)) {
    return jsonResponse(res, 400, 'INVALID_IDEMPOTENCY_KEY', 'A valid idempotency key is required.');
  }
  const amountText = String(req.body?.amount ?? '');
  if (!/^\d{1,4}(?:\.\d{1,2})?$/.test(amountText)) {
    return jsonResponse(res, 400, 'INVALID_AMOUNT', 'Enter an amount between GH₵1.00 and GH₵5,000.00.');
  }
  const amount = Number(amountText);
  const amountMinor = Math.round(amount * 100);
  const customerName = String(req.body?.customerName || '').trim();
  const customerEmail = String(req.body?.customerEmail || '').trim().toLowerCase();
  const msisdn = normalizeGhanaPhone(req.body?.phoneNumber);
  const network = String(req.body?.network || '').toUpperCase();

  if (!Number.isFinite(amount) || amountMinor < 100 || amountMinor > MAX_AMOUNT_MINOR) {
    return jsonResponse(res, 400, 'INVALID_AMOUNT', 'Enter an amount between GH₵1.00 and GH₵5,000.00.');
  }
  if (!customerName || customerName.length > 120) {
    return jsonResponse(res, 400, 'INVALID_NAME', 'Enter your name (up to 120 characters).');
  }
  if (!EMAIL_REGEX.test(customerEmail) || customerEmail.length > 254) {
    return jsonResponse(res, 400, 'INVALID_EMAIL', 'Enter a valid email address.');
  }
  if (!msisdn || !PHONE_REGEX.test(msisdn)) {
    return jsonResponse(res, 400, 'INVALID_GHANA_MOMO_NUMBER', 'Enter a valid Ghanaian mobile number.');
  }
  if (network !== 'MTN') {
    return jsonResponse(res, 400, 'UNSUPPORTED_NETWORK', 'MTN MoMo is currently supported. Other networks are planned.');
  }

  const existingPayment = findPaymentByIdempotencyKey.get(idempotencyKey);
  if (existingPayment) {
    return res.status(202).json({
      reference: existingPayment.reference,
      orderId: existingPayment.order_id,
      amount: (existingPayment.amount_minor / 100).toFixed(2),
      currency: existingPayment.currency,
      network: 'MTN',
      status: existingPayment.payment_status,
      orderStatus: existingPayment.order_status,
      demoMode: DEMO_MODE,
      message: 'Returning the existing payment request for this idempotency key.',
    });
  }

  const now = new Date().toISOString();
  const reference = crypto.randomUUID();
  const order = {
    id: crypto.randomUUID(),
    idempotency_key: idempotencyKey,
    amount_minor: amountMinor,
    currency: CURRENCY,
    customer_name: customerName,
    customer_email: customerEmail,
    msisdn,
    network: 'MTN',
    status: 'PENDING_PAYMENT',
    created_at: now,
    updated_at: now,
  };
  const payment = {
    reference,
    order_id: order.id,
    provider: 'MTN_MOMO',
    status: 'PENDING',
    created_at: now,
    updated_at: now,
  };
  db.transaction(() => {
    insertOrder.run(order);
    insertPayment.run(payment);
  })();
  logEvent(reference, 'payment_created', DEMO_MODE ? 'demo_pending' : 'pending');

  if (DEMO_MODE) {
    return res.status(202).json({
      reference,
      orderId: order.id,
      amount: (amountMinor / 100).toFixed(2),
      currency: CURRENCY,
      network: 'MTN',
      status: 'PENDING',
      demoMode: true,
      message: 'Demo only: a simulated MTN approval will complete shortly. No money will move.',
    });
  }

  try {
    const accountIsActive = await checkMtnAccountHolder(msisdn);
    if (!accountIsActive) {
      updatePaymentStatus(reference, 'FAILED', null);
      logEvent(reference, 'account_holder_check', 'inactive');
      return jsonResponse(res, 422, 'MOMO_ACCOUNT_INACTIVE', 'This number is not active for MTN Mobile Money. Check the number or use an active MTN MoMo account.');
    }
    logEvent(reference, 'account_holder_check', 'active');
    const accessToken = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
      'X-Reference-Id': reference,
      'X-Target-Environment': TARGET_ENVIRONMENT,
      'Content-Type': 'application/json',
    };
    if (process.env.MOMO_CALLBACK_URL) headers['X-Callback-Url'] = process.env.MOMO_CALLBACK_URL;
    const response = await providerFetch(`${MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: (amountMinor / 100).toFixed(2),
        currency: CURRENCY,
        externalId: reference,
        payer: { partyIdType: 'MSISDN', partyId: msisdn },
        payerMessage: 'Item13 Mobile Money payment',
        payeeNote: `Item13 order ${order.id}`,
      }),
    });
    if (response.status !== 202) {
      console.error(JSON.stringify({
        event: 'momo_request_error',
        reference,
        status: response.status,
      }));
      updatePaymentStatus(reference, 'FAILED', null);
      logEvent(reference, 'request_to_pay', 'failed');
      return jsonResponse(res, 502, 'PAYMENT_REQUEST_FAILED', 'MTN could not start the payment request. Check the number and try again.');
    }
    logEvent(reference, 'request_to_pay', 'accepted');
    return res.status(202).json({
      reference,
      orderId: order.id,
      amount: (amountMinor / 100).toFixed(2),
      currency: CURRENCY,
      network: 'MTN',
      status: 'PENDING',
      demoMode: false,
      message: 'Payment request sent. Approve it in the MTN MoMo prompt on your phone.',
    });
  } catch (error) {
    updatePaymentStatus(reference, 'FAILED', null);
    logEvent(reference, 'request_to_pay', 'service_error');
    throw error;
  }
}));

app.get('/api/payments/:reference', statusRateLimit, asyncRoute(async (req, res) => {
  if (!REFERENCE_REGEX.test(req.params.reference)) {
    return jsonResponse(res, 400, 'INVALID_REFERENCE', 'The payment reference is invalid.');
  }
  let payment = findPayment.get(req.params.reference);
  if (!payment) return jsonResponse(res, 404, 'PAYMENT_NOT_FOUND', 'No payment was found for this reference.');

  if (payment.payment_status === 'PENDING' && DEMO_MODE) {
    const age = Date.now() - new Date(payment.created_at).getTime();
    if (age >= DEMO_AUTO_APPROVE_MS) {
      logEvent(payment.reference, 'demo_authorization', 'automatic_success');
      payment = updatePaymentStatus(payment.reference, 'SUCCESSFUL', `DEMO-${payment.reference.slice(0, 8)}`);
    }
  } else if (payment.payment_status === 'PENDING') {
    payment = await verifyAndUpdatePayment(payment);
  }

  return res.json({
    reference: payment.reference,
    orderId: payment.order_id,
    amount: (payment.amount_minor / 100).toFixed(2),
    currency: payment.currency,
    status: payment.payment_status,
    orderStatus: payment.order_status,
    transactionId: payment.provider_transaction_id,
    demoMode: DEMO_MODE,
    createdAt: payment.created_at,
  });
}));

app.post('/api/webhooks/mtn', asyncRoute(async (req, res) => {
  const body = req.body || {};
  const reference = String(body.referenceId || body.reference_id || body.externalId || '');
  if (!REFERENCE_REGEX.test(reference)) {
    console.warn(JSON.stringify({ event: 'momo_webhook_rejected', reason: 'invalid_reference' }));
    return jsonResponse(res, 400, 'INVALID_WEBHOOK_REFERENCE', 'A valid payment reference is required.');
  }
  const payment = findPayment.get(reference);
  if (!payment) {
    console.warn(JSON.stringify({ event: 'momo_webhook_rejected', reference, reason: 'unknown_reference' }));
    return jsonResponse(res, 404, 'PAYMENT_NOT_FOUND', 'No payment was found for this reference.');
  }
  logEvent(reference, 'webhook_received', String(body.status || 'notification').slice(0, 40));
  if (!DEMO_MODE && payment.payment_status === 'PENDING') {
    await verifyAndUpdatePayment(payment);
  }
  return res.status(202).json({ received: true });
}));

app.use((error, _req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return jsonResponse(res, 400, 'INVALID_JSON', 'Payment request must contain valid JSON.');
  }
  if (error.type === 'entity.too.large') {
    return jsonResponse(res, 413, 'REQUEST_TOO_LARGE', 'Payment request is too large.');
  }
  const code = error.message && /^[A-Z0-9_]+$/.test(error.message) ? error.message : 'PAYMENT_SERVICE_ERROR';
  console.error(JSON.stringify({ event: 'payment_service_error', code }));
  if (res.headersSent) return next(error);
  return jsonResponse(res, 502, code, 'Payment service is temporarily unavailable. Please try again shortly.');
});

const DIST_DIR = path.resolve(SERVER_DIR, '../dist');
app.use(express.static(DIST_DIR));
app.get(['/', '/{*path}'], (_req, res, next) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'), (error) => {
    if (error) next();
  });
});

const server = app.listen(PORT, HOST, () => {
  console.info(JSON.stringify({
    event: 'payment_server_started',
    port: PORT,
    host: HOST,
    demoMode: DEMO_MODE,
    targetEnvironment: TARGET_ENVIRONMENT,
  }));
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
