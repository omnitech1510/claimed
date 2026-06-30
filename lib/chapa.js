const CHAPA_BASE = "https://api.chapa.co/v1";

// One-time payment: returns a checkout_url to redirect the customer to.
export async function initChapaPayment({
  amount,
  currency,
  email,
  first_name,
  last_name,
  tx_ref,
  callback_url,
  return_url,
}) {
  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      email,
      first_name,
      last_name,
      tx_ref,
      callback_url,
      return_url,
    }),
  });
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Chapa could not start this payment.");
  }
  return data.data.checkout_url;
}

// Recurring payment: subscribes the customer's email to a plan you create once
// in the Chapa dashboard (Plans > New plan), id stored in CHAPA_MONTHLY_PLAN_ID.
export async function initChapaSubscription({ email, first_name, last_name, tx_ref }) {
  const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name,
      last_name,
      tx_ref,
      plan: process.env.CHAPA_MONTHLY_PLAN_ID,
    }),
  });
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Chapa could not start this subscription.");
  }
  return data.data.checkout_url;
}

export async function verifyChapaTransaction(tx_ref) {
  const res = await fetch(`${CHAPA_BASE}/transaction/verify/${tx_ref}`, {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
  });
  return res.json();
}
