"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) return setError(error.message);

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      // Email confirmation is on for this Supabase project — that's fine,
      // just tell them to check their inbox.
      setSentConfirmation(true);
    }
  }

  if (sentConfirmation) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="ticket w-full max-w-sm px-8 py-10 text-center">
          <p className="font-mono text-xs text-ink-soft mb-1">ALMOST THERE</p>
          <h1 className="text-xl font-extrabold mb-3">Check your email</h1>
          <p className="text-ink-soft text-sm">
            We sent a confirmation link to {email}. Your 3-day trial starts the
            moment you confirm it.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="ticket w-full max-w-sm px-8 py-10">
        <p className="font-mono text-xs text-ink-soft mb-1">No.0001</p>
        <h1 className="text-2xl font-extrabold mb-1">Start your first goal</h1>
        <p className="text-sm text-ink-soft mb-6">Free for 3 days. No card needed.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="name" type="text" value={fullName} onChange={setFullName} />
          <Field label="email" type="email" value={email} onChange={setEmail} />
          <Field label="password" type="password" value={password} onChange={setPassword} />
          {error && <p className="text-stamp text-sm font-mono">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stamp text-paper rounded-sm font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "setting up…" : "start free trial"}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline">
            Log in
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
        minLength={type === "password" ? 6 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 focus:border-ink outline-none"
      />
    </label>
  );
}
