import { createClient } from "@/lib/supabase/server";
import { initChapaPayment, initChapaSubscription } from "@/lib/chapa";

const PRICES = {
  lifetime: { amount: "29.99", currency: "USD" },
};

export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const { plan } = await request.json();
  if (!["lifetime", "monthly"].includes(plan)) {
    return Response.json({ error: "Unknown plan." }, { status: 400 });
  }

  const fullName = user.user_metadata?.full_name || "claimed";
  const [first_name, last_name = "Customer"] = fullName.split(" ");
  const tx_ref = `claimed-${plan}-${user.id.slice(0, 8)}-${Date.now()}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    let checkout_url;
    if (plan === "lifetime") {
      checkout_url = await initChapaPayment({
        amount: PRICES.lifetime.amount,
        currency: PRICES.lifetime.currency,
        email: user.email,
        first_name,
        last_name,
        tx_ref,
        callback_url: `${site}/api/chapa/webhook`,
        return_url: `${site}/billing?status=pending`,
      });
    } else {
      checkout_url = await initChapaSubscription({
        email: user.email,
        first_name,
        last_name,
        tx_ref,
      });
    }

    await supabase.from("profiles").update({ chapa_tx_ref: tx_ref }).eq("id", user.id);

    return Response.json({ checkout_url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
