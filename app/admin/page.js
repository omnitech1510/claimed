"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (data.error) return setError(data.error);
    setUsers(data.users);
  }

  useEffect(() => {
    load();
  }, []);

  async function runAction(id, action) {
    setBusyId(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
    setBusyId(null);
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs text-ink-soft mb-1">CONTROL ROOM</p>
        <h1 className="text-3xl font-extrabold mb-8">Everyone using claimed.</h1>

        {error && <p className="text-stamp font-mono text-sm mb-4">{error}</p>}
        {!users && !error && <p className="text-ink-soft">Loading…</p>}

        {users && users.length === 0 && <p className="text-ink-soft">No one yet.</p>}

        {users && users.length > 0 && (
          <div className="ticket overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono text-xs text-ink-soft border-b border-ink-soft/20">
                  <th className="px-4 py-3">email</th>
                  <th className="px-4 py-3">status</th>
                  <th className="px-4 py-3">goals</th>
                  <th className="px-4 py-3">joined</th>
                  <th className="px-4 py-3">actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-ink-soft/10">
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <StatusTag status={u.access_status} daysLeft={u.trial_days_left} />
                    </td>
                    <td className="px-4 py-3 font-mono">{u.goal_count}</td>
                    <td className="px-4 py-3 font-mono text-ink-soft">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <ActionButton
                          disabled={busyId === u.id}
                          onClick={() => runAction(u.id, "extend_trial")}
                        >
                          +3 day trial
                        </ActionButton>
                        <ActionButton
                          disabled={busyId === u.id}
                          onClick={() => runAction(u.id, "mark_paid")}
                        >
                          mark paid
                        </ActionButton>
                        <ActionButton
                          disabled={busyId === u.id}
                          onClick={() => runAction(u.id, "lock")}
                        >
                          lock
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusTag({ status, daysLeft }) {
  const styles = {
    active: "bg-claim text-paper",
    trial: "border border-ink-soft/40",
    locked: "bg-stamp text-ink",
  };
  const label = status === "trial" ? `trial (${daysLeft}d)` : status;
  return (
    <span className={`font-mono text-xs px-2 py-1 rounded-sm ${styles[status] || ""}`}>
      {label}
    </span>
  );
}

function ActionButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-mono text-xs px-2 py-1 border border-ink-soft/40 rounded-sm hover:border-ink disabled:opacity-50"
    >
      {children}
    </button>
  );
}
