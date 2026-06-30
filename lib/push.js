import webpush from "web-push";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  webpush.setVapidDetails(
    "mailto:hello@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  configured = true;
}

export async function sendPushToUser(supabaseAdmin, userId, payload) {
  if (!process.env.VAPID_PRIVATE_KEY) return; // not set up yet — skip quietly
  ensureConfigured();

  const { data: subs } = await supabaseAdmin
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (!subs || subs.length === 0) return;

  await Promise.all(
    subs.map((row) =>
      webpush.sendNotification(row.subscription, JSON.stringify(payload)).catch(async (err) => {
        // 410 / 404 means the browser unsubscribed — clean it up.
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin.from("push_subscriptions").delete().eq("id", row.id);
        }
      })
    )
  );
}
