"use client";
import { useState } from "react";

export default function PayButton({ plan, label }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/chapa/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) return setError(data.error);
    window.location.href = data.checkout_url;
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full px-5 py-3 bg-stamp text-ink rounded-sm font-mono text-sm disabled:opacity-50"
      >
        {loading ? "redirecting…" : label}
      </button>
      {error && <p className="text-stamp text-sm font-mono mt-2">{error}</p>}
    </div>
  );
}
