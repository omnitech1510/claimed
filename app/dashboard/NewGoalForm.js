"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGoalForm({ locked }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  async function handleParse() {
    if (!url) return;
    setParsing(true);
    setError("");
    try {
      const res = await fetch("/api/parse-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        setExpanded(true);
        setError("Couldn't read that page automatically — fill in the details below.");
      } else {
        setTitle(data.title || "");
        setPrice(data.price ? String(data.price) : "");
        setImage(data.image || "");
        setExpanded(true);
      }
    } catch {
      setExpanded(true);
      setError("Couldn't reach that link — fill in the details below.");
    } finally {
      setParsing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !price) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        target_amount: parseFloat(price),
        product_url: url || null,
        image_url: image || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.error) return setError(data.error);

    setUrl("");
    setTitle("");
    setPrice("");
    setImage("");
    setExpanded(false);
    router.refresh();
  }

  if (locked) {
    return (
      <div className="ticket px-6 py-6 mb-10 text-center">
        <p className="font-mono text-sm text-ink-soft mb-2">YOUR TRIAL HAS ENDED</p>
        <p className="mb-4">Pick a plan to start a new goal.</p>
        <a
          href="/billing"
          className="inline-block px-5 py-2 bg-stamp text-ink rounded-sm font-mono text-sm"
        >
          see plans
        </a>
      </div>
    );
  }

  return (
    <div className="ticket px-6 py-6 mb-10">
      <p className="font-mono text-xs text-ink-soft mb-3">NEW GOAL</p>
      <div className="flex gap-2 mb-2">
        <input
          type="url"
          placeholder="Paste a product link…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={parsing || !url}
          className="px-4 py-2 bg-ink text-paper rounded-sm font-mono text-sm whitespace-nowrap disabled:opacity-50"
        >
          {parsing ? "reading…" : "read link"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="font-mono text-xs text-ink-soft underline mb-3"
      >
        {expanded ? "hide details" : "or enter it by hand"}
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              <span className="block font-mono text-xs text-ink-soft mb-1">what is it</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="block font-mono text-xs text-ink-soft mb-1">price (USD)</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-paper border border-ink-soft/40 rounded-sm px-3 py-2 outline-none focus:border-ink"
              />
            </label>
          </div>
          {error && <p className="text-stamp text-sm font-mono">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-stamp text-ink rounded-sm font-mono text-sm disabled:opacity-50"
          >
            {saving ? "saving…" : "start this goal"}
          </button>
        </form>
      )}
      {!expanded && error && <p className="text-stamp text-sm font-mono mt-2">{error}</p>}
    </div>
  );
}
