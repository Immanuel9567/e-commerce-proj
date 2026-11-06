// POST /api/paystack-webhook
//
// The belt to verify-payment's braces.
//
// A shopper can pay and then close the tab before the browser's callback runs.
// The money has moved; the order would never be recorded. Paystack therefore
// also calls this endpoint directly, server to server, and this is the more
// trustworthy of the two paths: there is no browser involved at all.
//
// Security: every request carries an x-paystack-signature header, which is an
// HMAC-SHA512 of the raw body keyed with the Paystack secret key. If the
// signature does not match, the request is discarded. Without this check
// anyone could POST a fake "payment succeeded" to this URL.

const crypto = require('node:crypto');

// Vercel's Node runtime parses JSON bodies by default, which destroys the exact
// byte sequence the signature covers. With bodyParser disabled the body arrives
// as a stream, so it is collected here. The other shapes are handled too, so the
// endpoint still works if it is ever mounted on a different host.
async function readRawBody(request) {
  if (Buffer.isBuffer(request.body)) return request.body;
  if (typeof request.body === 'string') return request.body;
  if (request.body && typeof request.body === 'object' && typeof request.body.pipe !== 'function') {
    // Already parsed by the platform: the raw bytes are gone. Hashing a
    // re-serialised copy would never match, so fail loudly rather than silently
    // rejecting every real webhook.
    throw new Error('Body was pre-parsed; the raw bytes needed for signature checking are unavailable.');
  }
  if (!request || typeof request.pipe !== 'function') {
    throw new Error('No readable request body.');
  }
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function readEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ success: false, message: 'Use POST.' });
  }

  const secretKey = readEnv('PAYSTACK_SECRET_KEY');
  if (!secretKey) {
    // Without a key there is no way to prove a request came from Paystack, so
    // nothing may be trusted. Answer 503 so Paystack retries later.
    return response.status(503).json({ success: false, message: 'Webhook is not configured.' });
  }

  // The signature is computed over the EXACT bytes Paystack sent. Re-serialising
  // a parsed body would change key order and whitespace and break the match, so
  // this endpoint turns Vercel's body parser off (see `config` at the bottom)
  // and reads the stream itself.
  let rawBody;
  try {
    rawBody = await readRawBody(request);
  } catch (_) {
    return response.status(400).json({ success: false, message: 'The request body could not be read.' });
  }

  const signature = String(request.headers['x-paystack-signature'] || '');
  const expected = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');

  // Constant-time comparison: a timing difference here would let an attacker
  // discover the expected signature byte by byte.
  const signatureBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const authentic = signatureBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!authentic) {
    return response.status(401).json({ success: false, message: 'Signature mismatch.' });
  }

  let event;
  try {
    event = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  } catch (_) {
    return response.status(400).json({ success: false, message: 'Body was not JSON.' });
  }

  // Only charge successes matter here. Every other event is acknowledged so
  // Paystack stops retrying it — an unanswered webhook is retried for days.
  if (!event || event.event !== 'charge.success' || !event.data) {
    return response.status(200).json({ success: true, ignored: true });
  }

  const transaction = event.data;

  // Re-verify rather than trusting the payload: the signature proves Paystack
  // sent it, but re-checking the transaction catches a replayed or edited body
  // and confirms the amount at the same moment the order is fulfilled.
  let verification;
  try {
    const verifiedResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(transaction.reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    verification = await verifiedResponse.json();
  } catch (_) {
    // Ask for a retry rather than acknowledging something unconfirmed.
    return response.status(502).json({ success: false, message: 'Could not re-verify the transaction.' });
  }

  if (!verification || verification.status !== true || !verification.data || verification.data.status !== 'success') {
    return response.status(200).json({ success: true, confirmed: false });
  }

  // A real store records the order in a database here, idempotently keyed by
  // reference, so a webhook retry cannot create a duplicate order. This
  // repository has no database yet (see docs/PAYMENTS.md), so the honest
  // behaviour is to log the confirmed payment and report that persistence is
  // not wired up — never to claim an order was saved when it was not.
  const confirmed = {
    reference: verification.data.reference,
    amountKobo: Number(verification.data.amount),
    currency: verification.data.currency,
    paidAt: verification.data.paid_at || null,
    customer: verification.data.customer ? verification.data.customer.email : null
  };

  console.log('[paystack-webhook] confirmed payment', JSON.stringify(confirmed));

  return response.status(200).json({
    success: true,
    confirmed: true,
    reference: confirmed.reference,
    persisted: false,
    note: 'Payment confirmed. Order persistence is not configured on this deployment.'
  });
};

// Vercel: do not parse this body. The signature is computed over the raw bytes.
module.exports.config = { api: { bodyParser: false } };
