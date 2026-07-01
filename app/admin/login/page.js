"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) return setError("Wrong password.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="ticket w-full max-w-sm px-8 py-10">
        <p className="font-mono text-xs text-ink-soft mb-1">PRIVATE</p>
        <h1 className="text-2xl font-extrabold mb-6">Control room</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin password"
            className="w-full bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 outline-none focus:border-ink"
          />
          {error && <p className="text-stamp text-sm font-mono">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-claim text-paper rounded-sm font-mono text-sm hover:opacity-80 transition-colors disabled:opacity-50"
          >
            {loading ? "checking…" : "enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
