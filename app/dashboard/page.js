import { createClient } from "@/lib/supabase/server";
import { getAccessStatus } from "@/lib/access";
import NewGoalForm from "./NewGoalForm";
import GoalCard from "./GoalCard";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  const locked = getAccessStatus(profile) === "locked";

  return (
    <div>
      <NewGoalForm locked={locked} />

      {(!goals || goals.length === 0) && (
        <div className="ticket px-6 py-10 text-center">
          <p className="font-mono text-sm text-ink-soft mb-1">No.0000</p>
          <p className="text-ink-soft">
            Nothing here yet. Paste a link above to start your first ticket.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {(goals || []).map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
