"use client";

// Wraps text so each letter pops on hover, but words never break mid-letter.
// Use on plain copy only — never inside <a> or <button>.
export default function BubbleText({ text, as: Tag = "span", className = "" }) {
  const words = text.split(" ");
  return (
    <Tag className={`bubble-text ${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, li) => (
            <span
              key={li}
              className="letter"
              style={{ transitionDelay: `${(wi * 3 + li) * 10}ms` }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
