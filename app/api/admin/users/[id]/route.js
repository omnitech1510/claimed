import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { action } = await request.json();
  const admin = createAdminClient();

  let update = {};
  if (action === "extend_trial") {
    const newDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    update = { trial_ends_at: newDate, subscription_status: "trial" };
  } else if (action === "mark_paid") {
    update = { is_subscribed: true, subscription_status: "active", plan: "lifetime" };
  } else if (action === "lock") {
    update = { is_subscribed: false, subscription_status: "canceled" };
  } else {
    return Response.json({ error: "Unknown action." }, { status: 400 });
  }

  const { data, error } = await admin
    .from("profiles")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ profile: data });
}
