import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPushToUser } from "@/lib/push";

export async function POST(request, { params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Not signed in." }, { status: 401 });

  const { amount, note } = await request.json();
  if (!amount || Number(amount) <= 0) {
    return Response.json({ error: "Enter a real amount." }, { status: 400 });
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("*")
    .eq("id", params.id)
    .single();
  if (goalError || !goal) return Response.json({ error: "Goal not found." }, { status: 404 });

  const { error: logError } = await supabase
    .from("savings_logs")
    .insert({ goal_id: params.id, amount, note: note || null });
  if (logError) return Response.json({ error: logError.message }, { status: 500 });

  const newSaved = Number(goal.saved_amount) + Number(amount);
  const justReached = newSaved >= Number(goal.target_amount) && goal.status === "active";

  const { data: updatedGoal, error: updateError } = await supabase
    .from("goals")
    .update({
      saved_amount: newSaved,
      status: justReached ? "reached" : goal.status,
    })
    .eq("id", params.id)
    .select()
    .single();
  if (updateError) return Response.json({ error: updateError.message }, { status: 500 });

  if (justReached) {
    const admin = createAdminClient();
    await sendPushToUser(admin, user.id, {
      title: "You can afford it now.",
      body: `"${goal.title}" is fully funded — go get it.`,
      url: `/goal/${goal.id}`,
    });
  }

  return Response.json({ goal: updatedGoal, justReached });
}
