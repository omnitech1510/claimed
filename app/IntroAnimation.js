"use client";
import { useEffect, useState } from "react";

export default function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("claimed_intro_seen")) return;
    setShow(true);
    const t1 = setTimeout(() => setFadeOut(true), 2800);
    const t2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("claimed_intro_seen", "1");
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes introFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes walletBounce {
          0%   { transform: translateY(-30px); opacity: 0; }
          60%  { transform: translateY(4px); opacity: 1; }
          80%  { transform: translateY(-3px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes flapOpen {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-55deg); }
        }
        @keyframes coinH {
          from { transform: translateX(0); }
          to   { transform: translateX(var(--cx)); }
        }
        @keyframes coinV {
          from { transform: translateY(0); }
          to   { transform: translateY(180px); }
        }
        @keyframes coinSpin {
          from { transform: scaleX(1); }
          25%  { transform: scaleX(0.1); }
          50%  { transform: scaleX(1); }
          75%  { transform: scaleX(0.1); }
          to   { transform: scaleX(1); }
        }
        @keyframes jarFill {
          0%   { clip-path: inset(100% 0 0 0); opacity: 0.6; }
          100% { clip-path: inset(0% 0 0 0); opacity: 0.9; }
        }
        @keyframes jarGlow {
          0%   { filter: drop-shadow(0 0 0px #4a90d9); }
          60%  { filter: drop-shadow(0 0 18px #4a90d9); }
          100% { filter: drop-shadow(0 0 8px #4a90d9); }
        }
        @keyframes labelFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "linear-gradient(160deg, #0a1c2e 0%, #0c2340 55%, #091929 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: fadeOut ? "none" : "auto",
          animation: "introFadeIn 0.3s ease both",
        }}
      >
        <div style={{ position: "relative", width: 160, height: 320 }}>
          {/* ── WALLET ── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              animation: "walletBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
            }}
          >
            <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
              {/* wallet body */}
              <rect x="0" y="12" width="80" height="44" rx="8" fill="#16314e" stroke="#4a90d9" strokeWidth="1.5"/>
              {/* wallet flap (animated open) */}
              <g style={{
                transformOrigin: "40px 12px",
                transformBox: "fill-box",
                animation: "flapOpen 0.45s ease 0.65s both",
              }}>
                <path d="M4 12 Q40 -4 76 12 L80 16 Q40 2 0 16 Z" fill="#1e3f60" stroke="#4a90d9" strokeWidth="1.5"/>
              </g>
              {/* card slot line */}
              <rect x="10" y="26" width="40" height="3" rx="1.5" fill="#4a90d9" opacity="0.4"/>
              <rect x="10" y="34" width="28" height="3" rx="1.5" fill="#9fc3e3" opacity="0.25"/>
              {/* clasp circle */}
              <circle cx="62" cy="34" r="8" fill="#142b45" stroke="#4a90d9" strokeWidth="1.5"/>
              <circle cx="62" cy="34" r="3" fill="#4a90d9" opacity="0.8"/>
            </svg>
          </div>

          {/* ── COINS ── */}
          {[
            { delay: 0.9,  cx: "-45px" },
            { delay: 1.05, cx: "-22px" },
            { delay: 1.2,  cx: "5px"   },
            { delay: 1.35, cx: "-55px" },
            { delay: 1.5,  cx: "18px"  },
            { delay: 1.65, cx: "-10px" },
          ].map((coin, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 28,
                left: "50%",
                "--cx": coin.cx,
                animation: `coinH 0.7s ease-in ${coin.delay}s both`,
              }}
            >
              <div style={{
                animation: `coinV 0.7s cubic-bezier(0.3, 0, 0.8, 1) ${coin.delay}s both`,
              }}>
                <div style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #7dbfe8, #4a90d9)",
                  boxShadow: "0 0 6px rgba(74,144,217,0.7)",
                  animation: `coinSpin 0.35s linear ${coin.delay}s 2 both`,
                  opacity: 0,
                  animationFillMode: "both",
                }}
                  // fade in at start
                  ref={el => {
                    if (el) {
                      setTimeout(() => {
                        if (el) el.style.opacity = "1";
                        setTimeout(() => {
                          if (el) el.style.opacity = "0";
                        }, 600);
                      }, coin.delay * 1000);
                    }
                  }}
                />
              </div>
            </div>
          ))}

          {/* ── SAVINGS JAR ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              animation: "jarGlow 0.8s ease 1.9s both",
            }}
          >
            <svg width="72" height="96" viewBox="0 0 72 96" fill="none">
              {/* jar body */}
              <path d="M14 32 Q10 36 8 44 L8 82 Q8 90 16 90 L56 90 Q64 90 64 82 L64 44 Q62 36 58 32 Z" fill="#16314e" stroke="#4a90d9" strokeWidth="1.5"/>
              {/* jar neck */}
              <rect x="20" y="22" width="32" height="12" rx="4" fill="#16314e" stroke="#4a90d9" strokeWidth="1.5"/>
              {/* jar lid */}
              <rect x="16" y="16" width="40" height="10" rx="5" fill="#1e3f60" stroke="#4a90d9" strokeWidth="1.5"/>

              {/* liquid fill — animated */}
              <clipPath id="jarClip">
                <path d="M9 44 L9 82 Q9 89 16 89 L56 89 Q63 89 63 82 L63 44 Z"/>
              </clipPath>
              <g clipPath="url(#jarClip)">
                <rect
                  x="9" y="40" width="54" height="50"
                  fill="#4a90d9"
                  opacity="0.35"
                  style={{ animation: "jarFill 0.6s ease 1.9s both" }}
                />
                {/* liquid surface wave */}
                <path
                  d="M9 70 Q20 65 36 70 Q52 75 63 70 L63 90 L9 90 Z"
                  fill="#4a90d9"
                  opacity="0.5"
                  style={{ animation: "jarFill 0.6s ease 1.9s both" }}
                />
              </g>

              {/* coin slot on lid */}
              <rect x="31" y="17" width="10" height="3" rx="1.5" fill="#4a90d9" opacity="0.8"/>

              {/* shine */}
              <line x1="18" y1="50" x2="18" y2="78" stroke="white" strokeWidth="2" opacity="0.08" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Label */}
        <p
          style={{
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            color: "#4a90d9",
            fontSize: 11,
            letterSpacing: "0.18em",
            marginTop: 28,
            opacity: 0,
            animation: "labelFade 0.4s ease 0.5s both",
          }}
        >
          claimed.
        </p>
      </div>
    </>
  );
}
