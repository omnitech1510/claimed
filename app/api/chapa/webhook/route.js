import { createAdminClient } from "@/lib/supabase/admin";
import { verifyChapaTransaction } from "@/lib/chapa";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const admin = createAdminClient();

  // Chapa's subscription system disables a plan automatically when a renewal fails.
  if (body.event === "subscription.disable") {
    const txRef = body.tx_ref || body.data?.tx_ref;
    if (txRef) {
      await admin
        .from("profiles")
        .update({ is_subscribed: false, subscription_status: "past_due" })
        .eq("chapa_tx_ref", txRef);
    }
    return Response.json({ received: true });
  }

  const tx_ref = body.tx_ref || body.data?.tx_ref;
  if (!tx_ref) return Response.json({ received: true });

  // Never trust the webhook body alone — ask Chapa directly what actually happened.
  const verified = await verifyChapaTransaction(tx_ref).catch(() => null);
  const success = verified?.status === "success" && verified?.data?.status === "success";

  if (success) {
    const plan = tx_ref.includes("lifetime") ? "lifetime" : "monthly";
    await admin
      .from("profiles")
      .update({ is_subscribed: true, subscription_status: "active", plan })
      .eq("chapa_tx_ref", tx_ref);
  }

  return Response.json({ received: true });
}
