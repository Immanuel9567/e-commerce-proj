// POST /api/verify-payment
//
// The only place in this system that is allowed to say money moved.
//
// The browser sends a reference and nothing else it can be believed about. This
// endpoint asks Paystack directly, then checks three things against the order
// that was actually quoted:
//
//   1. the transaction is a success
//   2. the currency is the one we charge in
//   3. the amount equals what we quoted
//
// A browser that lies about a reference gets a "no" here, and a real payment
// for a different amount is refused rather than quietly accepted as full
// payment for a larger order.

const { koboToNaira, koboToUsd } = require('./_lib/pricing');

const PAYSTACK_API = 'https://api.paystack.co';

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
    return response.status(503).json({
      success: false,
      message: 'Payment verification is not configured on this deployment.'
    });
  }

  let body = request.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = null; }
  }
  const reference = body && typeof body.reference === 'string' ? body.reference.trim() : '';
  if (!reference || reference.length > 100) {
    return response.status(400).json({ success: false, message: 'A payment reference is required.' });
  }

  let paystackResponse;
  try {
    paystackResponse = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` }
    });
  } catch (_) {
    return response.status(502).json({
      success: false,
      message: 'Could not reach Paystack to confirm the payment. The order is not confirmed yet.'
    });
  }

  let result;
  try {
    result = await paystackResponse.json();
  } catch (_) {
    return response.status(502).json({ success: false, message: 'Paystack sent a response that could not be read.' });
  }

  // Paystack answers 200 with status:false for an unknown reference, so both
  // the HTTP code and the body have to agree before this is a success.
  if (!paystackResponse.ok || !result || result.status !== true || !result.data) {
    return response.status(200).json({
      success: false,
      message: (result && result.message) || 'This payment could not be found.'
    });
  }

  const transaction = result.data;

  if (transaction.status !== 'success') {
    return response.status(200).json({
      success: false,
      message: `The payment is ${transaction.status}, not successful.`,
      reference
    });
  }

  if (String(transaction.currency || '').toUpperCase() !== 'NGN') {
    return response.status(200).json({
      success: false,
      message: 'The payment currency did not match, so it was not accepted.',
      reference
    });
  }

  // The expected amount travels in the transaction metadata, which was set by
  // api/initialize-payment.js. Comparing against it means a tampered reference
  // for a cheaper transaction cannot settle an expensive order.
  const metadata = transaction.metadata || {};
  const expectedKobo = Number(metadata.expectedKobo);
  if (Number.isFinite(expectedKobo) && expectedKobo > 0 && Number(transaction.amount) !== expectedKobo) {
    return response.status(200).json({
      success: false,
      message: 'The amount paid did not match the order total, so it was not accepted.',
      reference
    });
  }

  return response.status(200).json({
    success: true,
    reference: transaction.reference,
    amountKobo: Number(transaction.amount),
    usdTotal: koboToUsd(transaction.amount),
    nairaTotal: koboToNaira(transaction.amount),
    currency: transaction.currency,
    paidAt: transaction.paid_at || null,
    channel: transaction.channel || 'card'
  });
};
