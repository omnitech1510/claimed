"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SavingsLog({ goalId, logs }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    setSaving(true);
    const res = await fetch(`/api/goals/${goalId}/savings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), note }),
    });
    const data = await res.json();
    setSaving(false);
    setAmount("");
    setNote("");
    router.refresh();
    if (data.justReached) {
      // The push notification fires server-side too — this is just an in-the-moment nudge.
      alert("You can afford it now. Go get it.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-8">
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 outline-none focus:border-ink w-32"
        />
        <input
          type="text"
          placeholder="note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 outline-none focus:border-ink min-w-[140px]"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-stamp text-paper rounded-sm font-mono text-sm disabled:opacity-50"
        >
          {saving ? "saving…" : "log savings"}
        </button>
      </form>

      <p className="font-mono text-xs text-ink-soft mb-3">DEPOSIT HISTORY</p>
      {(!logs || logs.length === 0) && (
        <p className="text-ink-soft text-sm">Nothing logged yet.</p>
      )}
      <ul className="space-y-2">
        {(logs || []).map((log) => (
          <li
            key={log.id}
            className="flex justify-between text-sm border-b border-ink-soft/10 pb-2"
          >
            <span>{log.note || "—"}</span>
            <span className="font-mono">
              +${Number(log.amount).toFixed(2)} ·{" "}
              {new Date(log.created_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
