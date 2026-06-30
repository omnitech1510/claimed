"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="ticket w-full max-w-sm px-8 py-10">
        <p className="font-mono text-xs text-ink-soft mb-1">WELCOME BACK</p>
        <h1 className="text-2xl font-extrabold mb-6">Log in to claimed.</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="email" type="email" value={email} onChange={setEmail} />
          <Field label="password" type="password" value={password} onChange={setPassword} />
          {error && <p className="text-stamp text-sm font-mono">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ink text-paper rounded-sm font-mono text-sm hover:bg-stamp transition-colors disabled:opacity-50"
          >
            {loading ? "checking…" : "log in"}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6">
          New here?{" "}
          <Link href="/signup" className="text-ink underline">
            Start your first goal
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="block font-mono text-xs text-ink-soft mb-1">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 focus:border-ink outline-none"
      />
    </label>
  );
}
