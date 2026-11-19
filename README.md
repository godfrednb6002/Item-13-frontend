# Item13 MTN MoMo Collection integration

The payment page is available at `/payment` and uses MTN's direct Collection
`RequestToPay` flow. Payment credentials are held by the Node server only. No
wallet PIN or OTP is collected by the website. In a real transaction, MTN
delivers the authorization prompt to the payer's phone.

## Run the safe demo

From `frontend/`, install dependencies and start the API and Vite in separate
terminals:

```powershell
npm install
npm run server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`) and select
**Pay with MoMo** in the top navigation. The API listens on
`http://127.0.0.1:3001`; Vite proxies `/api` requests to it. Demo mode is on by
default and automatically approves the simulated payment after a few seconds.
It never contacts MTN and never moves money. Payment/order records and
redacted event logs are persisted in the ignored local SQLite database at
`server/data/payments.sqlite3`.

## Configure MTN sandbox

Copy `.env.example` to `.env` and set credentials created in the MTN developer
portal. Never paste credentials into source code, browser code, or a chat.

```dotenv
MOMO_DEMO_MODE=false
MOMO_TARGET_ENVIRONMENT=sandbox
MOMO_SUBSCRIPTION_KEY=your_collection_subscription_key
MOMO_API_USER=your_sandbox_api_user_uuid
MOMO_API_KEY=your_sandbox_api_key
MOMO_CALLBACK_URL=https://your-public-host.example/api/webhooks/mtn
```

Restart `npm run server` after changing environment variables. The sandbox
callback URL is optional; when configured it must be public HTTPS. The page
polls the server for status whether or not a callback is configured. In
production, set `NODE_ENV=production`, `MOMO_DEMO_MODE=false`, and
`MOMO_TARGET_ENVIRONMENT=mtn-ghana`; use the production credentials and the
public webhook URL issued for the merchant.

## Payment API

`POST /api/payments` validates the amount, customer fields, Ghanaian phone
format, and MTN network; checks MTN account-holder activation; creates an
order and UUID reference; then either returns a clearly marked demo intent or
calls MTN's Collection API from the server. Example:

```http
POST /api/payments
Content-Type: application/json

{
  "amount": "12.00",
  "phoneNumber": "024 000 0000",
  "customerName": "Ama Mensah",
  "customerEmail": "ama@example.com",
  "network": "MTN"
}
```

Accepted payments return HTTP `202` and a merchant reference:

```json
{
  "reference": "9b931f13-71dc-4a14-8c44-95e829e16ab0",
  "orderId": "c0f6c41b-22cf-4cb0-9721-efdf7fa31f58",
  "amount": "12.00",
  "currency": "GHS",
  "network": "MTN",
  "status": "PENDING",
  "demoMode": false,
  "message": "Payment request sent. Approve it in the MTN MoMo prompt on your phone."
}
```

The server generates the transaction UUID and uses it for MTN's
`X-Reference-Id` and `externalId`. `GET /api/payments/:reference` polls and
independently verifies the MTN status, GHS amount, and payer number before
updating the payment and order records. `POST /api/webhooks/mtn` treats webhook
payloads only as notifications and verifies the transaction with MTN before
changing status; repeated events are safe to process.

This is the immediate `RequestToPay` flow. MTN's invoice product is a separate
pay-later API; it is not called here because the reference is for a real-time
payment prompt. This avoids treating an unverified or nonexistent invoice
response as a payment.

## Security and operations

- Keep `.env` out of source control. `.env.example` contains placeholders only.
- Terminate TLS at a trusted HTTPS reverse proxy in production. Set
  `TRUST_PROXY` only when the server is behind a trusted proxy; configure the
  proxy to overwrite forwarded IP headers.
- Use MTN production credentials and the MTN Ghana target environment only in
  production. Never use demo mode to fulfill orders.
- The server limits payment attempts, caps requests, validates Ghana numbers,
  and never logs customer phone, name, email, wallet credentials, or raw
  webhook payloads.
- The local SQLite database contains customer contact details and must be
  backed up, access-controlled, and covered by an appropriate retention
  policy. Replace it with managed transactional storage for multi-instance
  deployments.
- Fulfillment must use the server-side `PAID` order state returned only after
  status verification. Do not fulfill from a browser redirect, client claim,
  webhook body alone, or demo payment.
- Telecel Cash and AirtelTigo Money are shown as planned networks but rejected
  by the API until a separate provider integration is implemented.
- QR is not enabled; this integration uses MTN's direct phone prompt.

## Official references

- [MTN MoMo API tutorials](https://momo.mtn.com/api/) — including sandbox users,
  API keys, RequestToPay, transaction status, and user status.
- [MTN MoMo API portal](https://momodeveloper.mtn.com/) — API subscription,
  sandbox credentials, and product documentation.
- [MTN API integration hub](https://momodevelopercommunity.mtn.com/p/api-integration-hub)
- [Flutterwave Ghana Mobile Money](https://developer.flutterwave.com/docs/ghana)
  — alternative aggregator flow, not used by this direct-MTN implementation.
- [Hubtel developer portal](https://developers.hubtel.com/) — optional
  alternative provider for account/network checks.
