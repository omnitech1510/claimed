import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SavingsLog from "./SavingsLog";

export default async function GoalPage({ params }) {
  const supabase = createClient();

  const { data: goal } = await supabase.from("goals").select("*").eq("id", params.id).single();
  if (!goal) notFound();

  const { data: logs } = await supabase
    .from("savings_logs")
    .select("*")
    .eq("goal_id", params.id)
    .order("created_at", { ascending: false });

  const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));
  const claimed = goal.status !== "active";

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="font-mono text-xs text-ink-soft hover:text-stamp">
        ← back
      </Link>

      <div className="ticket px-8 py-8 mt-4 mb-10">
        <div className="flex justify-between items-start mb-2">
          <p className="font-mono text-xs text-ink-soft">
            GOAL No.{String(goal.id).slice(0, 4).toUpperCase()}
          </p>
          {goal.product_url && (
            <a
              href={goal.product_url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs underline text-ink-soft hover:text-ink"
            >
              view item
            </a>
          )}
        </div>
        <h1 className="text-2xl font-extrabold mb-6">{goal.title}</h1>

        <div className="ticket-divider mb-6" />

        {claimed ? (
          <div className="flex justify-center py-4">
            <span className="stamp-claimed px-6 py-2 text-base font-semibold uppercase rounded-sm">
              {goal.status}
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between font-mono text-sm text-ink-soft mb-2">
              <span>SAVED ${Number(goal.saved_amount).toFixed(2)}</span>
              <span>OF ${Number(goal.target_amount).toFixed(2)}</span>
            </div>
            <div className="h-4 bg-paper-dim rounded-sm overflow-hidden">
              <div className="h-full bg-claim" style={{ width: `${pct}%` }} />
            </div>
            <p className="font-mono text-xs text-ink-soft mt-2">{pct}% there</p>
          </>
        )}
      </div>

      <SavingsLog goalId={goal.id} logs={logs} />
    </div>
  );
}
