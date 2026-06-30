"use client";

// Wraps text in per-letter spans so each letter can pop independently on hover.
// Only use this on plain copy (headings, paragraphs) — never inside links or buttons,
// where a hover effect should mean "this is clickable," not "this text wiggles."
export default function BubbleText({ text, as: Tag = "span", className = "" }) {
  return (
    <Tag className={`bubble-text ${className}`}>
      {text.split("").map((char, i) => (
        <span key={i} className="letter">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
