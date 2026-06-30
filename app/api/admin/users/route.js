import { createAdminClient } from "@/lib/supabase/admin";
import { getAccessStatus, daysLeftInTrial } from "@/lib/access";

export async function GET() {
  const admin = createAdminClient();

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data: goals } = await admin.from("goals").select("user_id");
  const goalCounts = {};
  (goals || []).forEach((g) => {
    goalCounts[g.user_id] = (goalCounts[g.user_id] || 0) + 1;
  });

  const users = profiles.map((p) => ({
    ...p,
    access_status: getAccessStatus(p),
    trial_days_left: daysLeftInTrial(p),
    goal_count: goalCounts[p.id] || 0,
  }));

  return Response.json({ users });
}
