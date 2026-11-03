import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CircleAlert,
  Clock3,
  Copy,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const GHANA_PHONE_PATTERN = /^(?:(?:\+?233)|0)(?:20|23|24|25|26|27|28|50|53|54|55|59)\d{7}$/;
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

const formatGhs = (value) => Number(value || 0).toLocaleString('en-GH', {
  style: 'currency',
  currency: 'GHS',
  minimumFractionDigits: 2,
});

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(12000),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error?.message || 'Payment service is unavailable. Please try again.');
    error.code = body?.error?.code;
    throw error;
  }
  return body;
}

export default function MomoPaymentPage({ onBack, checkoutOrder }) {
  const [values, setValues] = useState({
    amount: checkoutOrder ? checkoutOrder.total.toFixed(2) : '',
    phoneNumber: checkoutOrder?.mobileMoneyNumber || '',
    customerName: checkoutOrder?.customer.name || '',
    customerEmail: checkoutOrder?.customer.email || '',
    network: 'MTN',
  });
  const [demoMode, setDemoMode] = useState(null);
  const [paymentState, setPaymentState] = useState('idle');
  const [payment, setPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedReference, setCopiedReference] = useState(false);
  const pollTimer = useRef(null);
  const pollCount = useRef(0);
  const idempotencyKey = useRef(crypto.randomUUID());

  useEffect(() => {
    let active = true;
    requestJson('/api/payments/config')
      .then((config) => {
        if (active) setDemoMode(config.demoMode);
      })
      .catch(() => {
        if (active) setErrorMessage('Payment service is not running. Start the backend server and try again.');
      });
    return () => {
      active = false;
      window.clearTimeout(pollTimer.current);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(pollTimer.current), []);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrorMessage('');
  };

  const pollPayment = async (reference) => {
    try {
      const current = await requestJson(`/api/payments/${encodeURIComponent(reference)}`);
      setPayment(current);
      if (current.status === 'SUCCESSFUL' && current.orderStatus === 'PAID') {
        setPaymentState('success');
        idempotencyKey.current = crypto.randomUUID();
        return;
      }
      if (['FAILED', 'REJECTED', 'EXPIRED'].includes(current.status)) {
        setPaymentState('failed');
        idempotencyKey.current = crypto.randomUUID();
        setErrorMessage('The payment was not approved. Check your MoMo balance and number, then try again.');
        return;
      }
      pollCount.current += 1;
      if (pollCount.current >= MAX_POLL_ATTEMPTS) {
        setPaymentState('timeout');
        return;
      }
      pollTimer.current = window.setTimeout(() => pollPayment(reference), POLL_INTERVAL_MS);
    } catch (error) {
      setPaymentState('timeout');
      setErrorMessage(error.message || 'Could not check the payment status. Retry the status check.');
    }
  };

  const startPayment = async (event) => {
    event.preventDefault();
    window.clearTimeout(pollTimer.current);
    setErrorMessage('');
    setPayment(null);
    setPaymentState('loading');

    if (!GHANA_PHONE_PATTERN.test(values.phoneNumber.replace(/[\s()-]/g, ''))) {
      setPaymentState('idle');
      setErrorMessage('Enter a valid Ghanaian MTN number, for example 024 000 0000.');
      return;
    }

    try {
      const created = await requestJson('/api/payments', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey.current },
        body: JSON.stringify({
          amount: values.amount,
          phoneNumber: values.phoneNumber,
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          network: values.network,
        }),
      });
      pollCount.current = 0;
      setPayment(created);
      setPaymentState('pending');
      pollTimer.current = window.setTimeout(() => pollPayment(created.reference), POLL_INTERVAL_MS);
    } catch (error) {
      if (error.code === 'PAYMENT_REQUEST_FAILED') idempotencyKey.current = crypto.randomUUID();
      setPaymentState('failed');
      setErrorMessage(error.message || 'Could not start the payment. Please try again.');
    }
  };

  const retryStatusCheck = () => {
    if (!payment?.reference) return;
    setErrorMessage('');
    setPaymentState('pending');
    pollCount.current = 0;
    pollTimer.current = window.setTimeout(() => pollPayment(payment.reference), 0);
  };

  const copyReference = async () => {
    if (!payment?.reference || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(payment.reference);
      setCopiedReference(true);
      window.setTimeout(() => setCopiedReference(false), 1800);
    } catch {
      setErrorMessage('Could not copy the reference. You can select and copy it manually.');
    }
  };

  const resetForm = () => {
    window.clearTimeout(pollTimer.current);
    setPayment(null);
    setPaymentState('idle');
    setErrorMessage('');
    pollCount.current = 0;
    idempotencyKey.current = crypto.randomUUID();
  };

  const isPending = paymentState === 'pending' || paymentState === 'loading';

  return (
    <main className="momo-page">
      <header className="momo-header">
        <button type="button" className="momo-brand" onClick={onBack} aria-label="Return to Item13">
          <img src="/item13Logo-trimmed.png" alt="Item13" />
          <span>ITEM13 <small>THE UNEXPECTED ESSENTIAL</small></span>
        </button>
        <div className="momo-header-actions">
          <ThemeToggle />
          <button type="button" className="momo-back-link" onClick={onBack}>
            <ArrowLeft size={16} /> Store
          </button>
        </div>
      </header>

      <div className="momo-layout">
        <section className="momo-main-card" aria-labelledby="momo-title">
          <div className="momo-heading">
            <span className="momo-eyebrow"><LockKeyhole size={14} /> SECURE GHANA PAYMENTS</span>
              <h1 id="momo-title">Pay with <span>MTN MoMo</span></h1>
              <p>{checkoutOrder
                ? 'Review your checkout amount and approve the payment request on your MTN MoMo phone. Your PIN stays private.'
                : 'Enter your payment details and approve the request on your MTN MoMo phone. Your PIN stays private.'}</p>
          </div>

          {demoMode === true && (
            <div className="momo-mode-banner demo" role="status">
              <ShieldCheck size={18} />
              <span><strong>Safe demo mode</strong> — payments are simulated; no money moves.</span>
            </div>
          )}
          {demoMode === false && (
            <div className="momo-mode-banner live" role="status">
              <LockKeyhole size={18} />
              <span><strong>MTN sandbox/live API</strong> — only continue if you initiated this payment.</span>
            </div>
          )}
          {demoMode === null && (
            <div className="momo-mode-banner warning" role="status">
              <CircleAlert size={18} />
              <span>Connecting securely to the payment service…</span>
            </div>
          )}

          <form className="momo-form" onSubmit={startPayment}>
            <label className="momo-field" htmlFor="momo-amount">
              <span>Amount <small>(GHS)</small></span>
              <div className="momo-input-wrap amount">
                <Banknote size={18} aria-hidden="true" />
                <span>GH₵</span>
                <input
                  id="momo-amount"
                  name="amount"
                  type="number"
                  min="1"
                  max="5000"
                  step="0.01"
                  value={values.amount}
                  onChange={updateValue}
                  placeholder="0.00"
                  required
                  readOnly={Boolean(checkoutOrder)}
                  disabled={isPending || paymentState === 'success'}
                />
              </div>
              <small>{checkoutOrder ? 'Amount is the total from your Item13 checkout.' : 'Enter an amount between GH₵1.00 and GH₵5,000.00.'}</small>
            </label>

            <label className="momo-field" htmlFor="momo-name">
              <span>Customer name</span>
              <input
                id="momo-name"
                name="customerName"
                type="text"
                autoComplete="name"
                maxLength="120"
                value={values.customerName}
                onChange={updateValue}
                placeholder="Ama Mensah"
                required
                disabled={isPending || paymentState === 'success'}
              />
            </label>

            <label className="momo-field" htmlFor="momo-email">
              <span>Email address</span>
              <input
                id="momo-email"
                name="customerEmail"
                type="email"
                autoComplete="email"
                maxLength="254"
                value={values.customerEmail}
                onChange={updateValue}
                placeholder="ama@example.com"
                required
                disabled={isPending || paymentState === 'success'}
              />
            </label>

            <label className="momo-field" htmlFor="momo-phone">
              <span>MTN MoMo number</span>
              <div className="momo-input-wrap">
                <Smartphone size={17} aria-hidden="true" />
                <input
                  id="momo-phone"
                  name="phoneNumber"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={values.phoneNumber}
                  onChange={updateValue}
                  placeholder="+233 24 000 0000"
                  aria-describedby="momo-phone-hint"
                  required
                  disabled={isPending || paymentState === 'success'}
                />
              </div>
              <small id="momo-phone-hint">Use a Ghana number registered for MTN Mobile Money.</small>
            </label>

            <fieldset className="momo-network-fieldset" disabled={isPending || paymentState === 'success'}>
              <legend>Mobile money network</legend>
              <label className="momo-network-option selected">
                <input type="radio" name="network" value="MTN" checked={values.network === 'MTN'} onChange={updateValue} />
                <span className="momo-network-mark">M</span>
                <span><strong>MTN MoMo</strong><small>Available now</small></span>
                <Check size={17} aria-hidden="true" />
              </label>
              <label className="momo-network-option future">
                <input type="radio" name="network" value="Telecel" disabled />
                <span className="momo-network-mark telecel">T</span>
                <span><strong>Telecel Cash</strong><small>Planned</small></span>
              </label>
              <label className="momo-network-option future">
                <input type="radio" name="network" value="AirtelTigo" disabled />
                <span className="momo-network-mark airtel">A</span>
                <span><strong>AirtelTigo Money</strong><small>Planned</small></span>
              </label>
            </fieldset>

            {errorMessage && (
              <p className="momo-error" role="alert"><CircleAlert size={17} />{errorMessage}</p>
            )}

            {!payment || ['failed', 'timeout'].includes(paymentState) ? (
              <button
                className="momo-pay-button"
                type="submit"
                disabled={demoMode === null || isPending}
              >
                {paymentState === 'loading'
                  ? <><LoaderCircle size={18} className="momo-spinner" /> Starting secure request…</>
                  : <>Pay with MTN MoMo <ArrowRight size={17} /></>}
              </button>
            ) : null}
          </form>

          {isPending && (
            <section className="momo-payment-status pending" aria-live="polite">
              <span className="momo-status-icon"><LoaderCircle size={21} className="momo-spinner" /></span>
              <div>
                <h2>Check your phone</h2>
                <p>{demoMode ? 'Demo payment is being approved automatically.' : 'We sent a payment request to your MTN MoMo number. Approve it on your phone to continue.'}</p>
                <p className="momo-pin-reminder">Open the MTN MoMo prompt and authorize with your MoMo PIN. Never share your PIN or OTP here.</p>
              </div>
            </section>
          )}

          {paymentState === 'timeout' && (
            <section className="momo-payment-status pending" aria-live="polite">
              <span className="momo-status-icon"><Clock3 size={21} /></span>
              <div>
                <h2>Still waiting for confirmation</h2>
                <p>Do not pay again yet. Check the original request status or confirm the prompt on your phone.</p>
                <button type="button" className="momo-inline-button" onClick={retryStatusCheck}>Check status again</button>
              </div>
            </section>
          )}

          {paymentState === 'success' && (
            <section className="momo-payment-status success" aria-live="polite">
              <span className="momo-status-icon"><Check size={22} /></span>
              <div>
                <h2>{demoMode ? 'Demo payment approved' : 'Payment confirmed'}</h2>
                <p>{formatGhs(payment.amount)} received in {payment.currency} via MTN MoMo.</p>
                {demoMode && <p className="momo-pin-reminder">This was only a simulation. No money moved and no order was fulfilled.</p>}
                <div className="momo-reference">
                  <span>TRANSACTION REFERENCE</span>
                  <code>{payment.reference}</code>
                  <button type="button" onClick={copyReference} aria-label="Copy transaction reference">
                    <Copy size={15} /> {copiedReference ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <button type="button" className="momo-inline-button" onClick={resetForm}>Make another payment</button>
              </div>
            </section>
          )}

          <div className="momo-safety-note">
            <ShieldCheck size={17} />
            <p>Item13 will never ask for your MoMo PIN or OTP on this page. Only approve a request you recognize in your official MTN channel.</p>
          </div>
        </section>

        <aside className="momo-side-column">
          <section className="momo-info-card">
            <span className="momo-side-icon"><Smartphone size={20} /></span>
            <p className="momo-side-eyebrow">HOW IT WORKS</p>
            <h2>Approve on your phone</h2>
            <ol className="momo-steps">
              <li><span>1</span><p>Enter your details and request a payment.</p></li>
              <li><span>2</span><p>Wait for the MTN MoMo prompt on your phone.</p></li>
              <li><span>3</span><p>Review the amount and approve in the official MoMo menu.</p></li>
              <li><span>4</span><p>We verify the result with MTN before marking it paid.</p></li>
            </ol>
          </section>

          <section className="momo-info-card momo-monitor-card">
            <span className="momo-side-icon"><Clock3 size={20} /></span>
            <p className="momo-side-eyebrow">PAYMENT MONITOR</p>
            <h2>Transaction status</h2>
            <div className="momo-monitor-row"><span>Network</span><strong>MTN MoMo</strong></div>
            <div className="momo-monitor-row"><span>Currency</span><strong>GHS</strong></div>
            <div className="momo-monitor-row"><span>Current status</span><strong className={`momo-monitor-state ${payment?.status?.toLowerCase() || 'ready'}`}>{payment?.status || 'Ready'}</strong></div>
            {payment?.reference && <div className="momo-monitor-row"><span>Reference</span><code>{payment.reference.slice(0, 13)}…</code></div>}
            <p className="momo-monitor-caption">Status is checked with the payment service. A browser redirect or screenshot is not proof of payment.</p>
          </section>

          <details className="momo-docs-card">
            <summary><span>Integration details &amp; API example</span><ArrowRight size={16} /></summary>
            <p>MTN direct Collection API requests are made only from the server. An unguessable UUID is created as the merchant transaction reference and sent as both <code>X-Reference-Id</code> and <code>externalId</code>.</p>
            <pre>{`POST /collection/v1_0/requesttopay
X-Reference-Id: <server-generated UUID>
X-Target-Environment: sandbox
Ocp-Apim-Subscription-Key: <server secret>

{
  "amount": "12.00",
  "currency": "GHS",
  "externalId": "<same UUID>",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "233240000000"
  }
}`}</pre>
            <p>MTN responds <code>202 Accepted</code> for a request in progress. The server then polls <code>GET /collection/v1_0/requesttopay/&lt;reference&gt;</code> and only marks it paid after independently verifying status, amount, currency, and payer.</p>
            <p>For immediate push payments, this integration uses the Collection <code>RequestToPay</code> operation and its UUID reference. MTN's invoice product is a separate pay-later flow, so no undocumented invoice endpoint is called.</p>
            <a href="https://momo.mtn.com/api/" target="_blank" rel="noreferrer">MTN MoMo API tutorials <ArrowRight size={14} /></a>
          </details>

          <div className="momo-qr-note">
            <span className="momo-side-icon"><Smartphone size={19} /></span>
            <div><strong>Phone prompt enabled</strong><p>This direct Collection setup uses request-to-pay. QR checkout is not enabled in this integration.</p></div>
          </div>
        </aside>
      </div>

      <footer className="momo-footer">
        <span><ShieldCheck size={15} /> Encrypted connection · MTN MoMo Collection</span>
        <button type="button" onClick={onBack}>Return to Item13 <ArrowRight size={15} /></button>
      </footer>
    </main>
  );
}
