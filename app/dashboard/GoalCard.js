"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GoalCard({ goal }) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));
  const claimed = goal.status !== "active";

  async function handleLog(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!amount || saving) return;
    setSaving(true);
    await fetch(`/api/goals/${goal.id}/savings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });
    setAmount("");
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="ticket is-hoverable px-6 py-6 transition-transform">
      <a href={`/goal/${goal.id}`} className="block">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-ink-soft mb-1">
              GOAL No.{String(goal.id).slice(0, 4).toUpperCase()}
            </p>
            <p className="font-bold truncate">{goal.title}</p>
          </div>
          <p className="font-mono text-sm whitespace-nowrap ml-3">
            ${Number(goal.target_amount).toFixed(2)}
          </p>
        </div>

        <div className="ticket-divider mb-4" />

        {claimed && (
          <div className="flex justify-center py-2">
            <span className="stamp-claimed px-4 py-1 text-sm font-semibold uppercase rounded-sm">
              {goal.status}
            </span>
          </div>
        )}

        {!claimed && (
          <div className="flex justify-between font-mono text-xs text-ink-soft mb-2">
            <span>SAVED ${Number(goal.saved_amount).toFixed(2)}</span>
            <span>{pct}%</span>
          </div>
        )}
        {!claimed && (
          <div className="h-3 bg-paper-dim rounded-sm overflow-hidden mb-4">
            <div className="h-full bg-claim bar-fill" style={{ width: `${pct}%` }} />
          </div>
        )}
      </a>

      {!claimed && (
        <form onSubmit={handleLog} className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="add savings"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-paper border border-ink-soft/40 rounded-sm px-3 py-1.5 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-1.5 bg-claim text-paper rounded-sm font-mono text-xs disabled:opacity-50"
          >
            {saving ? "…" : "log it"}
          </button>
        </form>
      )}
    </div>
  );
}
