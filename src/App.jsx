import { useState, useEffect } from "react";

// ── Inject CSS animations ───────────────────────────────────────────────────
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 8px rgba(74,144,217,0.2), 0 2px 12px rgba(0,0,0,0.08); }
    50% { box-shadow: 0 0 20px rgba(74,144,217,0.4), 0 4px 20px rgba(0,0,0,0.12); }
  }
  @keyframes countdown-tick {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .draw-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    cursor: pointer;
  }
  .draw-card:hover {
    /* Keep card in place on hover to avoid layout jump */
    transform: none;
    box-shadow: 0 4px 16px rgba(74,144,217,0.18), 0 2px 8px rgba(0,0,0,0.08) !important;
  }
  .draw-card:hover .icon-area {
    /* Preserve the same white/blue split background on hover */
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #4578ad 40%, #4578ad 100%) !important;
  }
  .draw-card:hover .product-icon {
    /* Disable float animation so the icon doesn't shift */
    animation: none;
  }
  .draw-card:hover .bet-btn {
    background: linear-gradient(90deg, #3a7fc8, #5b9de8, #3a7fc8) !important;
    background-size: 200% 100% !important;
    animation: shimmer 1.5s ease-in-out infinite !important;
  }
  .bet-btn {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .bet-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .bet-btn:hover::after {
    left: 100%;
  }
  .countdown-num {
    background: linear-gradient(135deg, #1a2744 0%, #294d7a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .result-row:hover {
    background: #f8fafd !important;
    transition: background 0.2s ease;
  }
  @keyframes brand-fade {
    0% { opacity: 0; transform: scale(0.85); }
    15% { opacity: 1; transform: scale(1); }
    85% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.85); }
  }
  .brand-slot {
    animation: brand-fade 3s ease-in-out infinite;
  }

  /* Flip animation for enlarged card */
  @keyframes flip-in {
    0% {
      transform: rotateY(90deg) scale(0.9);
      opacity: 0;
    }
    60% {
      transform: rotateY(-10deg) scale(1.02);
      opacity: 1;
    }
    100% {
      transform: rotateY(0deg) scale(1);
      opacity: 1;
    }
  }
  .flip-card {
    perspective: 1200px;
  }
  .flip-card-inner {
    transform-origin: center;
    animation: flip-in 450ms ease-out forwards;
    transform-style: preserve-3d;
  }

  /* Small card flip when clicked */
  @keyframes card-flip {
    0% {
      transform: rotateY(0deg);
      opacity: 1;
    }
    40% {
      transform: rotateY(90deg);
      opacity: 0;
    }
    100% {
      transform: rotateY(180deg);
      opacity: 0;
    }
  }
  .draw-card-flip {
    animation: card-flip 400ms ease-out forwards;
    transform-style: preserve-3d;
  }

  /* Winner block hover lift */
  .result-block-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .result-block-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  }
  /* Responsive layout helpers */
  .nav-button {
    white-space: nowrap;
  }
  .carousel-card {
    scroll-snap-align: start;
  }

  @media (max-width: 960px) {
    .topbar-inner {
      flex-wrap: wrap !important;
    }
    .nav-inner {
      flex-wrap: wrap !important;
      justify-content: center !important;
      gap: 6px !important;
      padding: 6px 10px !important;
    }
    .nav-button {
      padding: 10px 14px !important;
      font-size: 11px !important;
    }
    .brand-strip {
      flex-wrap: wrap !important;
    }
    .footer-cols {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 24px !important;
    }
    .footer-icons {
      flex-wrap: wrap !important;
      gap: 16px !important;
    }
    .draw-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .howto-row {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .howto-hero {
      text-align: left !important;
      margin-left: 0 !important;
      margin-top: 16px !important;
    }
    .howto-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .account-tabs {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }

  @media (max-width: 640px) {
    .topbar-inner {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 10px !important;
    }
    .topbar-actions {
      width: 100% !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
    }
    .topbar-input {
      width: 100% !important;
      flex: 1 1 100% !important;
    }
    .hero-content {
      text-align: center !important;
      margin-left: 0 !important;
      margin-top: 0 !important;
    }
    .hero-title {
      font-size: 22px !important;
    }
    .hero-subtitle {
      font-size: 12px !important;
    }
    .hero-curve {
      display: none !important;
    }
    .nav-button {
      padding: 8px 10px !important;
      font-size: 10px !important;
      letter-spacing: 0.3px !important;
    }
    .carousel-nav {
      display: none !important;
    }
    .carousel-viewport {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
    }
    .carousel-track {
      transform: none !important;
    }
    .carousel-card {
      width: 80% !important;
      padding: 0 8px !important;
    }
    .brand-strip {
      gap: 10px !important;
      justify-content: center !important;
    }
    .result-row {
      grid-template-columns: 1fr !important;
    }
    .draw-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .filter-row {
      flex-direction: column !important;
    }
    .form-card {
      padding: 24px 18px !important;
    }
    .account-tabs {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .account-form-row {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 6px !important;
    }
    .account-form-row label {
      width: auto !important;
    }
    .footer-cols {
      grid-template-columns: 1fr !important;
    }
    .footer-icons {
      justify-content: center !important;
    }
    .results-actions {
      flex-direction: column !important;
    }
  }

  @media (max-width: 420px) {
    .draw-grid {
      grid-template-columns: 1fr !important;
    }
    .carousel-card {
      width: 92% !important;
    }
    .hero-title {
      font-size: 20px !important;
    }
    .topbar-actions button {
      flex: 1 1 100% !important;
    }
  }
`;
if (!document.getElementById("lpcx-styles")) {
  styleSheet.id = "lpcx-styles";
  document.head.appendChild(styleSheet);
}

// ── Palette matched to PDF ──────────────────────────────────────────────────
const C = {
  navyDark: "#1a2744",
  navy: "#1e3a5f",
  navyMid: "#294d7a",
  blueMid: "#3b7dbd",
  blueAccent: "#4a90d9",
  blueLight: "#6dc8e8",
  heroBg: "#ffffff",
  white: "#ffffff",
  offWhite: "#ffffff",
  greyBg: "#e8ecf2",
  textDark: "#1a2744",
  textMuted: "#7a8fa8",
  textGrey: "#96a5b8",
  border: "#d0dae6",
  borderLight: "#e2e8f0",
  cardBorder: "#cdd8e5",
  footerBg: "#1e3050",
  footerDark: "#162540",
};

// Two fonts: main (headings, primary) and subject (secondary/meta)
const FONT_MAIN = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_SUBJECT = 'Tahoma, Geneva, Verdana, sans-serif';

// ── Data ─────────────────────────────────────────────────────────────────────
// Draw cards. For popup stats you can add: participants, totalEntries, priceCap, topPrize, nextDrawAt (or load from API when card is opened).
const DRAWS = [
  { name: "Prize Pop", icon: "car", points: 10, image: "/draw-card-images/1.png", participants: 40000 },
  { name: "The Winning Up", icon: "scooty", points: 50, image: "/draw-card-images/2.png", participants: 10000 },
  { name: "Thanks Giving", icon: "tv", points: 100, image: "/draw-card-images/3.png", participants: 6500 },
  { name: "Fortune Frenzy", icon: "fan", points: 50, image: "/draw-card-images/4.png", participants: 10000 },
  { name: "Win It All", icon: "laptop", points: 100, image: "/draw-card-images/5.png", participants: 5000 },
  { name: "Value Member Gift", icon: "phone", points: 25, image: "/draw-card-images/6.png", participants: 100000 },
  { name: "Festive Fortune", icon: "camera", points: 250, image: "/draw-card-images/7.png", participants: 4000 },
  { name: "New Year Champ", icon: "watch", points: 500, image: "/draw-card-images/8.png", participants: 15000 },
  { name: "Dream Pick", icon: "bicycle", points: 100, image: "/draw-card-images/9.png", participants: 5000 },
  { name: "Loyalty Loot", icon: "headphones", points: 5, image: "/draw-card-images/10.png", participants: 112000 },
];

const RESULTS = [
  { winnerName: "Priya Sharma", winnerImage: "/winner-images/winner1.jpg", companyName: "Haldiram's", drawnAt: "23 May 2020, 3:30 am" },
  { winnerName: "James Okonkwo", winnerImage: "/winner-images/winner2.jpg", companyName: "Amul", drawnAt: "23 May 2020, 3:30 am" },
  { winnerName: "Ravi Kumar", winnerImage: "/winner-images/winner3.jpg", companyName: "Parle", drawnAt: "22 May 2020, 8:00 pm" },
  { winnerName: "Elena Petrova", winnerImage: "/winner-images/winner4.jpg", companyName: "Britannia", drawnAt: "22 May 2020, 3:30 am" },
  { winnerName: "Wei Chen", winnerImage: "/winner-images/winner5.jpg", companyName: "Haldiram's", drawnAt: "21 May 2020, 3:30 am" },
  { winnerName: "Maria Santos", winnerImage: "/winner-images/winner6.jpg", companyName: "Amul", drawnAt: "21 May 2020, 8:00 pm" },
  { winnerName: "David Miller", winnerImage: "/winner-images/winner7.jpg", companyName: "Parle", drawnAt: "20 May 2020, 3:30 am" },
  { winnerName: "Sofia García", winnerImage: "/winner-images/winner8.jpg", companyName: "Britannia", drawnAt: "20 May 2020, 3:30 am" },
  { winnerName: "Ahmed Hassan", winnerImage: "/winner-images/winner9.jpg", companyName: "Haldiram's", drawnAt: "19 May 2020, 8:00 pm" },
  { winnerName: "Lakshmi Nair", winnerImage: "/winner-images/winner10.jpg", companyName: "Amul", drawnAt: "19 May 2020, 3:30 am" },
];

// ── Product Icons (Hi-fi SVG illustrations with gradients & detail) ──────────
function ProductIcon({ icon, size = 62 }) {
  const icons = {
    car: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e74c3c"/>
            <stop offset="100%" stopColor="#c0392b"/>
          </linearGradient>
          <linearGradient id="car-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8e6ff"/>
            <stop offset="100%" stopColor="#74c0e8"/>
          </linearGradient>
          <radialGradient id="car-wheel">
            <stop offset="0%" stopColor="#555"/>
            <stop offset="50%" stopColor="#333"/>
            <stop offset="80%" stopColor="#222"/>
            <stop offset="100%" stopColor="#111"/>
          </radialGradient>
          <filter id="car-shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/></filter>
        </defs>
        <g filter="url(#car-shadow)">
          <path d="M14 42 Q14 36 20 36 L24 28 Q26 22 32 22 L48 22 Q54 22 56 28 L60 36 Q66 36 66 42 L66 50 Q66 52 64 52 L16 52 Q14 52 14 50 Z" fill="url(#car-body)"/>
          <path d="M26 28 Q28 23 32 23 L48 23 Q52 23 54 28 L58 36 L22 36 Z" fill="url(#car-glass)" opacity="0.9"/>
          <line x1="40" y1="23" x2="40" y2="36" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
          <rect x="12" y="40" width="8" height="4" rx="2" fill="#ffd700"/>
          <rect x="60" y="40" width="8" height="4" rx="2" fill="#ff6b6b"/>
          <rect x="20" y="45" width="40" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
        </g>
        <circle cx="26" cy="54" r="7" fill="url(#car-wheel)"/>
        <circle cx="26" cy="54" r="3.5" fill="#888"/>
        <circle cx="26" cy="54" r="1.5" fill="#bbb"/>
        <circle cx="54" cy="54" r="7" fill="url(#car-wheel)"/>
        <circle cx="54" cy="54" r="3.5" fill="#888"/>
        <circle cx="54" cy="54" r="1.5" fill="#bbb"/>
      </svg>
    ),
    scooty: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="sc-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7"/>
            <stop offset="100%" stopColor="#7c3aed"/>
          </linearGradient>
          <radialGradient id="sc-whl">
            <stop offset="0%" stopColor="#555"/><stop offset="100%" stopColor="#1a1a1a"/>
          </radialGradient>
          <filter id="sc-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#sc-sh)">
          <circle cx="20" cy="56" r="9" fill="url(#sc-whl)"/>
          <circle cx="20" cy="56" r="4.5" fill="#777"/>
          <circle cx="20" cy="56" r="2" fill="#aaa"/>
          <circle cx="58" cy="56" r="9" fill="url(#sc-whl)"/>
          <circle cx="58" cy="56" r="4.5" fill="#777"/>
          <circle cx="58" cy="56" r="2" fill="#aaa"/>
          <path d="M22 52 L30 30 Q32 26 36 26 L48 26 Q52 26 52 30 L52 36 Q52 40 48 42 L38 46 L56 52" stroke="url(#sc-body)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="30" y="24" width="24" height="8" rx="4" fill="url(#sc-body)"/>
          <rect x="48" y="16" width="4" height="12" rx="2" fill="url(#sc-body)"/>
          <rect x="44" y="14" width="14" height="4" rx="2" fill="#333"/>
          <ellipse cx="36" cy="32" rx="6" ry="4" fill="rgba(255,255,255,0.15)"/>
        </g>
      </svg>
    ),
    tv: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="tv-scr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="50%" stopColor="#818cf8"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
          <linearGradient id="tv-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#374151"/>
            <stop offset="100%" stopColor="#1f2937"/>
          </linearGradient>
          <filter id="tv-glow"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#60a5fa" floodOpacity="0.4"/></filter>
        </defs>
        <rect x="10" y="16" width="60" height="40" rx="4" fill="url(#tv-body)"/>
        <rect x="14" y="19" width="52" height="34" rx="3" fill="url(#tv-scr)" filter="url(#tv-glow)"/>
        <rect x="14" y="19" width="52" height="17" rx="3" fill="rgba(255,255,255,0.08)"/>
        <rect x="32" y="58" width="16" height="4" rx="2" fill="#4b5563"/>
        <rect x="24" y="63" width="32" height="4" rx="2" fill="#6b7280"/>
        <circle cx="40" cy="60" r="1" fill="#9ca3af"/>
      </svg>
    ),
    fan: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="fan-bl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8"/>
            <stop offset="100%" stopColor="#0284c7"/>
          </linearGradient>
          <filter id="fan-sh"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#fan-sh)">
          <circle cx="40" cy="38" r="26" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
          <circle cx="40" cy="38" r="24" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
          <ellipse cx="40" cy="16" rx="10" ry="18" fill="url(#fan-bl)" opacity="0.85"/>
          <ellipse cx="40" cy="16" rx="10" ry="18" fill="url(#fan-bl)" opacity="0.75" transform="rotate(72 40 38)"/>
          <ellipse cx="40" cy="16" rx="10" ry="18" fill="url(#fan-bl)" opacity="0.75" transform="rotate(144 40 38)"/>
          <ellipse cx="40" cy="16" rx="10" ry="18" fill="url(#fan-bl)" opacity="0.75" transform="rotate(216 40 38)"/>
          <ellipse cx="40" cy="16" rx="10" ry="18" fill="url(#fan-bl)" opacity="0.75" transform="rotate(288 40 38)"/>
          <circle cx="40" cy="38" r="7" fill="#475569"/>
          <circle cx="40" cy="38" r="4" fill="#64748b"/>
          <circle cx="40" cy="38" r="2" fill="#94a3b8"/>
          <rect x="36" y="66" width="8" height="10" rx="2" fill="#475569"/>
          <rect x="30" y="74" width="20" height="4" rx="2" fill="#64748b"/>
        </g>
      </svg>
    ),
    laptop: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="lp-scr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399"/>
            <stop offset="100%" stopColor="#059669"/>
          </linearGradient>
          <linearGradient id="lp-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5e7eb"/>
            <stop offset="100%" stopColor="#9ca3af"/>
          </linearGradient>
          <filter id="lp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/></filter>
        </defs>
        <g filter="url(#lp-sh)">
          <rect x="14" y="16" width="52" height="34" rx="3" fill="#374151"/>
          <rect x="17" y="19" width="46" height="28" rx="2" fill="url(#lp-scr)"/>
          <rect x="17" y="19" width="46" height="14" rx="2" fill="rgba(255,255,255,0.12)"/>
          <path d="M8 52 L72 52 L68 58 Q67 60 64 60 L16 60 Q13 60 12 58 Z" fill="url(#lp-body)"/>
          <rect x="32" y="50" width="16" height="2" rx="1" fill="#6b7280"/>
          <ellipse cx="40" cy="55" rx="8" ry="1.5" fill="rgba(0,0,0,0.06)"/>
        </g>
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="ph-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#374151"/>
            <stop offset="100%" stopColor="#111827"/>
          </linearGradient>
          <linearGradient id="ph-scr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6"/>
            <stop offset="50%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#fbbf24"/>
          </linearGradient>
          <filter id="ph-sh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#ph-sh)">
          <rect x="22" y="8" width="36" height="64" rx="6" fill="url(#ph-body)"/>
          <rect x="25" y="16" width="30" height="48" rx="3" fill="url(#ph-scr)"/>
          <rect x="25" y="16" width="30" height="24" rx="3" fill="rgba(255,255,255,0.1)"/>
          <rect x="34" y="10" width="12" height="3" rx="1.5" fill="#4b5563"/>
          <circle cx="40" cy="11.5" r="1.5" fill="#6b7280"/>
          <rect x="35" y="66" width="10" height="3" rx="1.5" fill="#4b5563"/>
        </g>
      </svg>
    ),
    camera: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="cam-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4b5563"/>
            <stop offset="100%" stopColor="#1f2937"/>
          </linearGradient>
          <radialGradient id="cam-lens">
            <stop offset="0%" stopColor="#e0f2fe"/>
            <stop offset="30%" stopColor="#7dd3fc"/>
            <stop offset="60%" stopColor="#0ea5e9"/>
            <stop offset="80%" stopColor="#0369a1"/>
            <stop offset="100%" stopColor="#1e3a5a"/>
          </radialGradient>
          <filter id="cam-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#cam-sh)">
          <rect x="26" y="16" width="22" height="10" rx="3" fill="#6b7280"/>
          <rect x="10" y="24" width="60" height="38" rx="5" fill="url(#cam-body)"/>
          <circle cx="40" cy="43" r="14" fill="#1e293b"/>
          <circle cx="40" cy="43" r="12" fill="url(#cam-lens)"/>
          <circle cx="40" cy="43" r="5" fill="#0c4a6e"/>
          <circle cx="40" cy="43" r="2.5" fill="#e0f2fe"/>
          <circle cx="36" cy="39" r="2" fill="rgba(255,255,255,0.4)"/>
          <circle cx="58" cy="30" r="3" fill="#ef4444"/>
          <circle cx="58" cy="30" r="1.5" fill="#fca5a5"/>
          <rect x="14" y="28" width="8" height="3" rx="1" fill="#9ca3af"/>
        </g>
      </svg>
    ),
    watch: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="w-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78716c"/>
            <stop offset="100%" stopColor="#44403c"/>
          </linearGradient>
          <linearGradient id="w-case" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4d4d8"/>
            <stop offset="50%" stopColor="#a1a1aa"/>
            <stop offset="100%" stopColor="#71717a"/>
          </linearGradient>
          <radialGradient id="w-face">
            <stop offset="0%" stopColor="#fafafa"/>
            <stop offset="80%" stopColor="#e4e4e7"/>
            <stop offset="100%" stopColor="#d4d4d8"/>
          </radialGradient>
          <filter id="w-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#w-sh)">
          <rect x="28" y="4" width="24" height="18" rx="5" fill="url(#w-band)"/>
          <rect x="28" y="58" width="24" height="18" rx="5" fill="url(#w-band)"/>
          <circle cx="40" cy="40" r="20" fill="url(#w-case)"/>
          <circle cx="40" cy="40" r="17" fill="url(#w-face)"/>
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
            <line key={i} x1={40+14*Math.cos(i*30*Math.PI/180)} y1={40+14*Math.sin(i*30*Math.PI/180)} x2={40+16*Math.cos(i*30*Math.PI/180)} y2={40+16*Math.sin(i*30*Math.PI/180)} stroke="#a1a1aa" strokeWidth="1.5"/>
          ))}
          <line x1="40" y1="40" x2="40" y2="28" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="40" y1="40" x2="50" y2="36" stroke="#18181b" strokeWidth="2" strokeLinecap="round"/>
          <line x1="40" y1="40" x2="48" y2="44" stroke="#ef4444" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="2" fill="#18181b"/>
          <circle cx="40" cy="40" r="1" fill="#ef4444"/>
          <rect x="60" y="36" width="4" height="8" rx="1" fill="url(#w-case)"/>
        </g>
      </svg>
    ),
    bicycle: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="bk-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <radialGradient id="bk-whl">
            <stop offset="0%" stopColor="#666"/><stop offset="100%" stopColor="#222"/>
          </radialGradient>
          <filter id="bk-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#bk-sh)">
          <circle cx="20" cy="50" r="13" fill="none" stroke="#444" strokeWidth="3"/>
          <circle cx="20" cy="50" r="11" fill="none" stroke="#666" strokeWidth="0.5"/>
          <circle cx="20" cy="50" r="3" fill="url(#bk-whl)"/>
          <circle cx="60" cy="50" r="13" fill="none" stroke="#444" strokeWidth="3"/>
          <circle cx="60" cy="50" r="11" fill="none" stroke="#666" strokeWidth="0.5"/>
          <circle cx="60" cy="50" r="3" fill="url(#bk-whl)"/>
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={`sl${i}`} x1="20" y1="50" x2={20+11*Math.cos(i*45*Math.PI/180)} y2={50+11*Math.sin(i*45*Math.PI/180)} stroke="#888" strokeWidth="0.5"/>
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={`sr${i}`} x1="60" y1="50" x2={60+11*Math.cos(i*45*Math.PI/180)} y2={50+11*Math.sin(i*45*Math.PI/180)} stroke="#888" strokeWidth="0.5"/>
          ))}
          <path d="M20 50 L34 28 L46 28 L60 50" stroke="url(#bk-frame)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="34" y1="28" x2="20" y2="50" stroke="url(#bk-frame)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="46" y1="28" x2="60" y2="50" stroke="url(#bk-frame)" strokeWidth="3" strokeLinecap="round"/>
          <line x1="34" y1="28" x2="46" y2="28" stroke="url(#bk-frame)" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="40" cy="38" r="5" fill="none" stroke="#999" strokeWidth="1"/>
          <circle cx="40" cy="38" r="2" fill="#999"/>
          <rect x="42" y="22" width="14" height="3" rx="1.5" fill="#333"/>
          <line x1="30" y1="24" x2="38" y2="24" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
          <rect x="18" y="42" width="2" height="6" rx="1" fill="#333"/>
        </g>
      </svg>
    ),
    headphones: (
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="hp-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7280"/>
            <stop offset="100%" stopColor="#374151"/>
          </linearGradient>
          <linearGradient id="hp-cup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4b5563"/>
            <stop offset="100%" stopColor="#1f2937"/>
          </linearGradient>
          <linearGradient id="hp-pad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ca3af"/>
            <stop offset="100%" stopColor="#6b7280"/>
          </linearGradient>
          <filter id="hp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/></filter>
        </defs>
        <g filter="url(#hp-sh)">
          <path d="M14 44 C14 26 24 14 40 14 C56 14 66 26 66 44" stroke="url(#hp-band)" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M14 44 C14 26 24 16 40 16 C56 16 66 26 66 44" stroke="#9ca3af" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <rect x="8" y="40" width="14" height="24" rx="6" fill="url(#hp-cup)"/>
          <rect x="10" y="43" width="10" height="18" rx="4" fill="url(#hp-pad)"/>
          <rect x="58" y="40" width="14" height="24" rx="6" fill="url(#hp-cup)"/>
          <rect x="60" y="43" width="10" height="18" rx="4" fill="url(#hp-pad)"/>
          <ellipse cx="15" cy="52" rx="3" ry="6" fill="rgba(255,255,255,0.08)"/>
          <ellipse cx="65" cy="52" rx="3" ry="6" fill="rgba(255,255,255,0.08)"/>
        </g>
      </svg>
    ),
  };
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{icons[icon] || <div style={{ width: size, height: size, borderRadius: "50%", background: "#ddd" }} />}</div>;
}

// ── Flag circles for results section ────────────────────────────────────────
function FlagCircle({ country, size = 64 }) {
  const flagMap = {
    us: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="50" fill="#fff"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={i} y={i*7.69} width="100" height={7.69/2} fill={i%2===0?"#b22234":"#fff"} clipPath="circle(50px at 50px 50px)"/>
        ))}
        <rect width="40" height="53.85" fill="#3c3b6e" clipPath="circle(50px at 50px 50px)"/>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    in: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-in"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-in)">
          <rect width="100" height="33" fill="#ff9933"/>
          <rect y="33" width="100" height="34" fill="#fff"/>
          <rect y="67" width="100" height="33" fill="#138808"/>
          <circle cx="50" cy="50" r="8" fill="none" stroke="#000080" strokeWidth="2"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    lt: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-lt"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-lt)">
          <rect width="100" height="33" fill="#fdb913"/>
          <rect y="33" width="100" height="34" fill="#006a44"/>
          <rect y="67" width="100" height="33" fill="#c1272d"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    mt: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-mt"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-mt)">
          <rect width="50" height="100" fill="#fff"/>
          <rect x="50" width="50" height="100" fill="#cf142b"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    lv: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-lv"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-lv)">
          <rect width="100" height="40" fill="#9e3039"/>
          <rect y="40" width="100" height="20" fill="#fff"/>
          <rect y="60" width="100" height="40" fill="#9e3039"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    gh: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-gh"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-gh)">
          <rect width="100" height="33" fill="#cf142b"/>
          <rect y="33" width="100" height="34" fill="#fcd116"/>
          <rect y="67" width="100" height="33" fill="#006b3f"/>
          <polygon points="50,38 53,46 62,46 55,51 57,59 50,54 43,59 45,51 38,46 47,46" fill="#000"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    sg: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-sg"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-sg)">
          <rect width="100" height="50" fill="#ef3340"/>
          <rect y="50" width="100" height="50" fill="#fff"/>
          <circle cx="35" cy="35" r="12" fill="#fff"/>
          <circle cx="39" cy="35" r="12" fill="#ef3340"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    us2: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="50" fill="#fff"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={i} y={i*7.69} width="100" height={7.69/2} fill={i%2===0?"#b22234":"#fff"} clipPath="circle(50px at 50px 50px)"/>
        ))}
        <rect width="40" height="53.85" fill="#3c3b6e" clipPath="circle(50px at 50px 50px)"/>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    pw: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="50" fill="#fff"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={i} y={i*7.69} width="100" height={7.69/2} fill={i%2===0?"#b22234":"#fff"} clipPath="circle(50px at 50px 50px)"/>
        ))}
        <rect width="40" height="53.85" fill="#3c3b6e" clipPath="circle(50px at 50px 50px)"/>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    es: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-es"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-es)">
          <rect width="100" height="25" fill="#c60b1e"/>
          <rect y="25" width="100" height="50" fill="#ffc400"/>
          <rect y="75" width="100" height="25" fill="#c60b1e"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    dk: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-dk"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-dk)">
          <rect width="100" height="100" fill="#fff"/>
          <rect width="100" height="100" fill="#c8102e"/>
          <rect x="28" width="14" height="100" fill="#fff"/>
          <rect y="40" width="100" height="20" fill="#fff"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
    in2: (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <clipPath id="fc-in2"><circle cx="50" cy="50" r="50"/></clipPath>
        <g clipPath="url(#fc-in2)">
          <rect width="100" height="33" fill="#ff9933"/>
          <rect y="33" width="100" height="34" fill="#fff"/>
          <rect y="67" width="100" height="33" fill="#138808"/>
          <circle cx="50" cy="50" r="8" fill="none" stroke="#000080" strokeWidth="2"/>
        </g>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      </svg>
    ),
  };
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{flagMap[country] || <div style={{ width: size, height: size, borderRadius: "50%", background: "#ddd" }} />}</div>;
}

// Small flag circle for results
function SmallFlag({ country, size = 36 }) {
  return <FlagCircle country={country} size={size} />;
}

// ── Countdown Timer ─────────────────────────────────────────────────────────
function Countdown() {
  const [time, setTime] = useState(12 * 3600); // 12 hours
  useEffect(() => {
    const id = setInterval(() => setTime(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "6px 0", alignItems: "center" }}>
      {[{ v: h, l: "HOUR" }, { v: m, l: "MIN" }, { v: s, l: "SEC" }].map(({ v, l }, idx) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: C.white,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.8)",
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 500,
                marginTop: 1,
              }}
            >
              {l}
            </div>
          </div>
          {idx < 2 && (
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                fontWeight: 300,
                marginTop: -8,
              }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Draw card image or icon (real image from folder when available) ─────────
function DrawCardMedia({ draw, size = 62 }) {
  const [imgError, setImgError] = useState(false);
  const useImage = draw.image && !imgError;
  return useImage ? (
    <img
      src={draw.image}
      alt=""
      style={{ width: size, height: size, objectFit: "cover", borderRadius: "50%" }}
      onError={() => setImgError(true)}
    />
  ) : (
    <ProductIcon icon={draw.icon} size={size} />
  );
}

// ── Draw Card (clickable for details) ──────────────────────────────────────
function DrawCard({ draw, onClick, isFlipping }) {
  return (
    <div
      className={`draw-card${isFlipping ? " draw-card-flip" : ""}`}
      onClick={() => onClick && onClick(draw)}
      style={{
      background: C.white,
      border: `1px solid ${C.cardBorder}`,
      borderRadius: 8,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      maxHeight: '300px',
      boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Top bar with name, points, and info icon */}
      <div style={{
        padding: "10px 12px 8px",
        background: "linear-gradient(135deg, #f8fafd 0%, #ffffff 100%)",
        borderBottom: `1px solid ${C.borderLight}`,
      }}
    >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: C.textDark,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 120,
              letterSpacing: 0.3,
            }}
          >
            {draw.name}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#1a1a0a",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #f4d03f 0%, #d4a017 50%, #b8860b 100%)",
              border: "1px solid rgba(184, 134, 11, 0.6)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              padding: "4px 8px",
              borderRadius: 4,
              display: "inline-block",
            }}
          >
            {draw.points}P
          </span>
        </div>
      </div>

      {/* Middle area: icon straddling white/blue with countdown in blue */}
      <div
        className="icon-area"
        style={{
          padding: "18px 0 3px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          // Top part white, bottom part blue – roughly 40% white, 60% blue
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #4578ad 40%, #4578ad 100%)",
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginTop: 20,
            marginBottom: 12,
          }}
        >
          <div className="product-icon">
            <DrawCardMedia draw={draw} size={90} />
          </div>
        </div>
        <div style={{ marginTop: 4 }}>
          <Countdown />
        </div>
      </div>

      {/* ENROLL NOW button with gradient */}
      <button className="bet-btn" style={{
        width: "100%",
        background: "#173b63",
        color: C.white,
        border: "none",
        padding: "11px 0",
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: 2,
        cursor: "pointer",
        textTransform: "uppercase",
      }}>ENROLL NOW</button>
    </div>
  );
}

// ── Single Result Item ──────────────────────────────────────────────────────
function SingleResult({ item }) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = item.winnerImage || "/winner-images/placeholder.jpg";
  const showImg = !imgError && photoUrl;

  return (
    <div
      className="result-block-hover"
      style={{
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderBottom: `1px solid ${C.borderLight}`,
      fontFamily: FONT_MAIN,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: C.greyBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {showImg ? (
          <img
            src={photoUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textGrey }}>
            {item.winnerName ? item.winnerName.charAt(0) : "?"}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_MAIN, fontWeight: 700, fontSize: 12, color: C.textDark }}>{item.winnerName}</span>
          
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          
          <span style={{ fontFamily: FONT_SUBJECT, fontSize: 11, color: C.textGrey }}>{item.drawnAt || "—"}</span>
          
        </div>
      </div>
      <button style={{
        fontFamily: FONT_MAIN,
        background: C.white,
        border: `1px solid ${C.cardBorder}`,
        color: C.textDark,
        padding: "5px 16px",
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: 0.5,
      }}>{item.companyName}</button>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const inputStyle = {
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 3,
  padding: "8px 14px",
  fontSize: 13,
  width: 140,
  outline: "none",
  color: C.textDark,
  background: C.white,
};

const btnOutline = {
  border: `1px solid ${C.navyDark}`,
  background: C.white,
  color: C.navyDark,
  padding: "8px 20px",
  borderRadius: 3,
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
  letterSpacing: 0.5,
};

const btnPrimary = {
  background: C.blueAccent,
  color: C.white,
  border: "none",
  padding: "8px 20px",
  borderRadius: 3,
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
  letterSpacing: 0.5,
};

// ── Header (Top bar) ────────────────────────────────────────────────────────
function Header({ page, setPage, loggedIn, setLoggedIn }) {
  return (
    <div className="topbar" style={{ background: C.white, borderBottom: `1px solid ${C.borderLight}` }}>
      <div className="topbar-inner" style={{
        maxWidth: 960, margin: "0 auto", padding: "10px 20px",
        display: "flex", alignItems: "center", gap: 14, maxHeight: "20px"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M20 2C14 2 8 8 8 14c0 4 2 7 5 10l7 14 7-14c3-3 5-6 5-10 0-6-6-12-12-12z" fill={C.navyDark} opacity="0.8"/>
            <path d="M16 8c-2 1-3 3-2 5l4 6 4-6c1-2 0-4-2-5-1-1-3-1-4 0z" fill={C.blueAccent}/>
            <path d="M20 6l2 4-2 3-2-3 2-4z" fill="#fff"/>
          </svg>
          <span style={{
            fontWeight: 800, fontSize: 20, color: C.navyDark,
            letterSpacing: 2, fontFamily: "'Georgia', serif",
          }}>LPCX</span>
        </div>
        {!loggedIn ? (
          <div className="topbar-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input className="topbar-input" placeholder="Email" style={{ ...inputStyle, width: 130, padding: "7px 12px" }} />
            <input className="topbar-input" placeholder="Password" type="password" style={{ ...inputStyle, width: 130, padding: "7px 12px" }} />
            <button onClick={() => setLoggedIn(true)} style={{
              ...btnOutline,
              borderColor: C.navyDark,
              padding: "7px 18px",
            }}>Sign In</button>
            <button onClick={() => setPage("register")} style={{
              ...btnPrimary,
              padding: "7px 18px",
            }}>Register</button>
          </div>
        ) : (
          <div className="topbar-actions" style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setPage("account")} style={btnPrimary}>My Account</button>
            <button onClick={() => setLoggedIn(false)} style={btnOutline}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Left curved design for hero (ellipses) ────────────────────────────────────
function LeftCurveDesign() {
  return (
    <div
      className="hero-curve"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "45%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 5,
        background: "#2FA4C9"
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "420px",
          background: "#0f2d52",
          borderRadius: "48%",
          left: "400px",
          top: "-220px",
          zIndex: 12
        }}
      />
      {/* turquoise */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "420px",
          background: "#4F77A6",
          borderRadius: "50%",
          left: "320px",
          top: "-230px",
          
          zIndex: 10
        }}
      />

      {/* dark blue */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "420px",
          background: "#2FA4C9",
          borderRadius: "50%",
          left: "140px",
          top: "-210px",
          
        }}
      />
      

      {/* background blend */}
      <div
        
      />
    </div>
  );
}

// ── Hero Banner ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div
      className="hero"
      style={{
        background: "#0f2d52",
        position: "relative",
        overflow: "hidden",
        padding: "16px 20px", // keep your height
        minHeight: 120,
        
      }}
    >
      <LeftCurveDesign />

      {/* Content only (plain background to restore layout) */}
      <div
        className="hero-content"
        style={{
          maxWidth: 960,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          textAlign: "right",
          marginLeft: 40,
          marginTop: 10,
        }}
      >
        <div
          className="hero-subtitle"
          style={{
            color: "#4577ad",
            fontSize: 14,
            marginBottom: 4,
            fontWeight: 500,
          }}
        >
          Over 8000 lucky draws a week,
        </div>
        <div
          className="hero-title"
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          more chances<br />
          to <span style={{ color: "#4577ad" }}>win</span> big!
        </div>
      </div>
    </div>
  );
}

// ── Nav Bar ─────────────────────────────────────────────────────────────────
function NavBar({ page, setPage }) {
  const items = [
    { label: "HOME", key: "home" },
    { label: "LUCKY WINNERS", key: "lucky-numbers" },
    { label: "NEXT DRAWS", key: "next-draws" },
    { label: "VENDORS", key: "results" },
    { label: "OFFERS", key: "wagers" },
    { label: "HOW TO PLAY", key: "how-to-play" },
  ];
  return (
    <div className="nav" style={{ background: C.offWhite, borderBottom: `1px solid ${C.borderLight}`, padding: '3px' }}>
<div className="nav-inner" style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        {items.map(item => {
          const active = page === item.key;
          return (
            <button key={item.key} className="nav-button" onClick={() => setPage(item.key)} style={{
              background: active ? C.blueAccent : "transparent",
              color: active ? C.white : C.textDark,
              border: "none",
              padding: "13px 22px",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: 0.5,
              cursor: "pointer",
              transition: "background 0.2s",
              borderRadius: active ? "4px 4px 0 0" : 0,
            }}
              onMouseEnter={e => { if (!active) e.target.style.background = "rgba(74,144,217,0.1)"; }}
              onMouseLeave={e => { if (!active) e.target.style.background = "transparent"; }}
            >{item.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Footer (3 info columns + 4 icons + T&C) ────────────────────────────────
function Footer() {
  return (
    <>
      {/* Info columns */}
      <div style={{ background: C.footerBg, padding: "40px 20px" }}>
        <div className="footer-cols" style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
          {[
            {
              title: "HOW TO PLAY THE LPCX",
              text: "Register and pick from our wide range of lucky draws from around the world. New draws run every day so you can play and win any day. Start by choosing a draw and tapping the \"ENROLL NOW\" button."
            },
            {
              title: "PICK YOUR DRAW",
              text: "Improve your odds by predicting 1, 2, 3 or 4 numbers in a draw using the \"BET TYPE\" option. Some draws include a bonus ball. Pick your numbers to match your chosen bet type."
            },
            {
              title: "SUBMIT YOUR BET",
              text: "Enter your stake and place your bet. You will get confirmation by SMS or email. Winners are notified the same way and your slip shows winnings. All draw results are on this site."
            },
          ].map(({ title, text }) => (
            <div key={title}>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 13, marginBottom: 12, letterSpacing: 0.3 }}>{title}</div>
              <div style={{ color: "#8fa3bf", fontSize: 12, lineHeight: 1.75 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Icons row */}
      <div style={{ background: C.footerDark, padding: "30px 20px" }}>
        <div className="footer-icons" style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-around" }}>
          {[
            { icon: "🏛️", label: "Widest Selection" },
            { icon: "🌐", label: "Global Lucky Draws" },
            { icon: "📊", label: "Great Markets" },
            { icon: "✈️", label: "Fast Results" },
          ].map(({ icon, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 8, filter: "grayscale(100%) brightness(2)" }}>{icon}</div>
              <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div style={{
        background: C.white, padding: "14px",
        textAlign: "center", borderTop: `1px solid ${C.borderLight}`,
      }}>
        <span style={{ color: C.textMuted, fontSize: 12, cursor: "pointer" }}>Terms & Conditions</span>
      </div>
    </>
  );
}

// ── Brand Logos Strip ───────────────────────────────────────────────────────
// To use your own logos:
// 1. Put logo files in `public/brand-logos/` (for example: public/brand-logos/haldirams.png).
// 2. Point the `logo` field to `/brand-logos/<file-name>`.
const BRANDS = [
  { name: "Haldiram's", logo: "/brand-logos/haldirams.png", bg: "#c0392b" },
  { name: "Amul", logo: "/brand-logos/amul.png", bg: "#e74c3c" },
  { name: "Bikaji", logo: "/brand-logos/bikaji.png", bg: "#d35400" },
  { name: "Parle", logo: "/brand-logos/parle.png", bg: "#f39c12" },
  { name: "Britannia", logo: "/brand-logos/britannia.png", bg: "#2980b9" },
  { name: "ITC", logo: "/brand-logos/itc.png", bg: "#1a5276" },
  { name: "Dabur", logo: "/brand-logos/dabur.png", bg: "#27ae60" },
  { name: "Godrej", logo: "/brand-logos/godrej.png", bg: "#2c3e50" },
  { name: "Tata", logo: "/brand-logos/tata.png", bg: "#2c3e50" },
  { name: "Pepsi", logo: "/brand-logos/pepsi.png", bg: "#1a5276" },
];

function BrandLogo({ brand, style: extraStyle }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...extraStyle,
      }}
    >
      <div
        style={{
          width: 130,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {!imgError ? (
          <img
            src={brand.logo}
            alt={brand.name}
            onError={() => setImgError(true)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: brand.bg,
            }}
          />
        )}
      </div>
    </div>
  );
}

function BrandLogosStrip() {
  const [slots, setSlots] = useState(() => {
    const initial = [];
    const shuffled = [...BRANDS].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 5; i++) {
      initial.push({ brand: shuffled[i], key: i, delay: i * 0.4 });
    }
    return initial;
  });
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycle(c => c + 1);
      setSlots(prev => {
        const next = [...prev];
        const slotIdx = Math.floor(Math.random() * 5);
        const usedNames = next.map(s => s.brand.name);
        const available = BRANDS.filter(b => !usedNames.includes(b.name));
        if (available.length > 0) {
          const newBrand = available[Math.floor(Math.random() * available.length)];
          next[slotIdx] = { brand: newBrand, key: Date.now() + slotIdx, delay: 0 };
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="brand-strip" style={{
      display: "flex",
      justifyContent: "center",
      gap: 16,
      padding: "10px 0 24px",
      minHeight: 110,
      alignItems: "center",
    }}>
      {slots.map((slot) => (
        <div
          key={slot.key}
          className="brand-slot"
          style={{ animationDelay: `${slot.delay}s` }}
        >
          <BrandLogo brand={slot.brand} />
        </div>
      ))}
    </div>
  );
}

// ── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ onCardClick, flippingDraw }) {
  // Carousel shows 5 cards at a time and slides 1 card per click
  const VISIBLE = 5;
  const [carouselIdx, setCarouselIdx] = useState(0);
  const canPrev = carouselIdx > 0;
  const canNext = carouselIdx < DRAWS.length - VISIBLE;

  return (
    <div>
      {/* ── Upcoming Draws ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 20px 0" }}>
      <h2 style={{
          textAlign: "center",
          color: C.textDark,
          letterSpacing: 1,
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 24,
        }}>UPCOMING DRAWS</h2>

        {/* Carousel - smooth sliding */}
        <div className="carousel-row" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setCarouselIdx(i => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="carousel-nav"
            style={{
              background: "transparent",
              border: "none",
              color: canPrev ? C.textGrey : "#d0dae6",
              cursor: canPrev ? "pointer" : "default",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Previous"
          >
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
              <path d="M28 8L12 24l16 16" />
            </svg>
          </button>

          <div className="carousel-viewport" style={{ flex: 1, overflow: "hidden" }}>
            <div className="carousel-track" style={{
              display: "flex",
              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: `translateX(-${carouselIdx * (100 / VISIBLE)}%)`,
            }}>
              {DRAWS.map((d, i) => (
                <div
                  key={i}
                  className="carousel-card"
                  style={{
                    width: `${100 / VISIBLE}%`,
                    flexShrink: 0,
                    padding: "0 6px",
                    boxSizing: "border-box",
                  }}
                >
                  <DrawCard
                    draw={d}
                    onClick={onCardClick}
                    isFlipping={!!flippingDraw && flippingDraw.name === d.name}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCarouselIdx(i => Math.min(DRAWS.length - VISIBLE, i + 1))}
            disabled={!canNext}
            className="carousel-nav"
            style={{
              background: "transparent",
              border: "none",
              color: canNext ? C.textGrey : "#d0dae6",
              cursor: canNext ? "pointer" : "default",
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Next"
          >
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
              <path d="M12 8l16 16-16 16" />
            </svg>
          </button>
        </div>

        {/* Brand Logos */}
        <BrandLogosStrip />
      </div>

      {/* ── How To Play Mid-Section ── */}
      <div style={{ background: "#112f56", padding: "16px 20px", minHeight: 140, borderTop: `1px solid ${C.borderLight}`, borderBottom: `1px solid ${C.borderLight}` }}>
        <div className="howto-row" style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
          <div>
            <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>HOW TO PLAY THE LPCX</div>
            {[
              { num: 1, text: "Choose your", bold: "lucky draw" },
              { num: 2, text: "Select your", bold: "draw type" },
              { num: 3, text: "Select your", bold: "numbers" },
              { num: 4, text: "Select your", bold: "stake" },
              { num: 5, text: "Select your", bold: "bet" },
            ].map(({ num, text, bold }) => (
              <div key={num} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  background: C.blueAccent, color: C.white,
                  width: 22, height: 22, borderRadius: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{num}</div>
                <span style={{ color: "#e3ecf7", fontSize: 13 }}>
                  {text} <strong style={{ fontWeight: 700, fontStyle: "italic" }}>{bold}</strong>
                </span>
              </div>
            ))}
          </div>
          <div className="howto-hero" style={{ textAlign: "right", minWidth: 240, marginLeft: 40, marginTop: 10 }}>
            <div style={{
              color: "#4577ad", fontSize: 16,
              fontStyle: "italic", marginBottom: 4,
              fontFamily: "'Georgia', serif",
            }}>Over 8000 lucky draws a week,</div>
            <div style={{
              color: "#ffffff", fontSize: 30, fontWeight: 900, lineHeight: 1.15,
              fontFamily: "'Georgia', serif",
            }}>
              more chances<br />to <span style={{ color: "#4577ad" }}>win</span> big!
            </div>
          </div>
        </div>
      </div>

      {/* ── Latest Results ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "30px 20px" }}>
        <h2 style={{
          textAlign: "center", color: C.textDark,
          letterSpacing: 2, fontSize: 18, fontWeight: 800,
          marginBottom: 24, fontFamily: FONT_MAIN,
        }}>WINNER RESULTS</h2>

        <div style={{
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 4,
          overflow: "hidden",
          background: C.white,
        }}>
          {RESULTS.filter((_, i) => i % 2 === 0).map((r, i) => (
            <div key={i} className="result-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <SingleResult item={r} />
              <div>
                <SingleResult item={RESULTS[i * 2 + 1]} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <button style={{ ...btnOutline, padding: "10px 36px", letterSpacing: 1, fontSize: 12 }}>LOAD MORE</button>
          <button style={{ ...btnOutline, padding: "10px 36px", letterSpacing: 1, fontSize: 12 }}>VIEW ALL RESULTS</button>
        </div>
      </div>
    </div>
  );
}

// ── REGISTER PAGE ───────────────────────────────────────────────────────────
function RegisterPage({ setPage, setLoggedIn }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "", over18: false });
  const handle = () => { setLoggedIn(true); setPage("home"); };
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", color: C.textDark, letterSpacing: 2, marginBottom: 30, fontFamily: "'Georgia', serif" }}>REGISTER</h2>
      <div className="form-card" style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 4, padding: "40px 50px" }}>
        {[
          { ph: "Full Name", key: "name", type: "text" },
          { ph: "Email", key: "email", type: "email" },
          { ph: "Password", key: "pass", type: "password" },
        ].map(({ ph, key, type }) => (
          <input key={key} type={type} placeholder={ph}
            value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            style={{ ...inputStyle, width: "100%", marginBottom: 14, boxSizing: "border-box", padding: "12px 14px", fontSize: 14 }} />
        ))}
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: C.textDark }}>
          <input type="checkbox" checked={form.over18} onChange={e => setForm({ ...form, over18: e.target.checked })} />
          18 years
        </label>
        <hr style={{ border: "none", borderTop: `1px solid ${C.borderLight}`, marginBottom: 20 }} />
        <div style={{ textAlign: "center" }}>
          <button onClick={handle} style={{ ...btnPrimary, padding: "12px 40px", fontSize: 13, letterSpacing: 1 }}>REGISTER</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: C.textMuted }}>
          <span style={{ cursor: "pointer", color: C.blueAccent }}>Forgot password</span>
          {" | "}
          <span style={{ cursor: "pointer", color: C.blueAccent }} onClick={() => setPage("home")}>Sign In</span>
        </div>
      </div>
    </div>
  );
}

// ── LUCKY WINNERS PAGE ──────────────────────────────────────────────────────
function LuckyNumbersPage({ onCardClick, flippingDraw }) {  
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [letter, setLetter] = useState("ALL");
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "30px 20px" }}>
      <h2 style={{ textAlign: "center", color: C.textDark, letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>LUCKY WINNERS</h2>
      <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13, maxWidth: 700, margin: "0 auto 24px", lineHeight: 1.6 }}>
        With lucky draws from around the world we give you more choice and more chances to <strong>WIN BIG!</strong> Place a bet on your favourite draw now.
      </p>
      <div className="filter-row" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <select style={{ ...inputStyle, flex: 1 }}><option>Select country</option></select>
        <input placeholder="Search" style={{ ...inputStyle, flex: 2 }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 24 }}>
        {[...alpha, "ALL"].map(l => (
          <button key={l} onClick={() => setLetter(l)} style={{
            padding: "4px 7px", fontSize: 11, fontWeight: 600,
            background: letter === l ? C.blueAccent : C.white,
            color: letter === l ? C.white : C.textDark,
            border: `1px solid ${C.cardBorder}`, borderRadius: 2, cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>
      <div className="draw-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {DRAWS.map((d, i) => (
          <DrawCard
            key={i}
            draw={d}
            onClick={onCardClick}
            isFlipping={!!flippingDraw && flippingDraw.name === d.name}
          />
        ))}
        {DRAWS.map((d, i) => (
          <DrawCard
            key={`r2-${i}`}
            draw={d}
            onClick={onCardClick}
            isFlipping={!!flippingDraw && flippingDraw.name === d.name}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button style={{ ...btnOutline, padding: "10px 40px", letterSpacing: 1 }}>LOAD MORE</button>
      </div>
    </div>
  );
}

// ── NEXT DRAWS PAGE ─────────────────────────────────────────────────────────
function NextDrawsPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "30px 20px" }}>
      <h2 style={{ textAlign: "center", color: C.textDark, letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>UPCOMING DRAWS</h2>
      <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13, maxWidth: 700, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Lucky draws run every day, seven days a week—we keep you updated so you never miss a draw.
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ border: `1px solid ${C.cardBorder}`, borderRadius: 3, padding: "8px 16px", fontSize: 13, color: C.textDark, background: C.white }}>
          Saturday, 23 May 2020
        </div>
      </div>
      <div style={{ border: `1px solid ${C.cardBorder}`, borderRadius: 4, overflow: "hidden", background: C.white }}>
        {RESULTS.filter((_, i) => i % 2 === 0).map((r, i) => (
          <div key={i} className="result-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <SingleResult item={r} />
            <div>
              <SingleResult item={RESULTS[i * 2 + 1]} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button style={{ ...btnOutline, padding: "10px 40px", letterSpacing: 1 }}>LOAD MORE</button>
      </div>
    </div>
  );
}

// ── RESULTS PAGE ────────────────────────────────────────────────────────────
function ResultsPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "30px 20px" }}>
      <h2 style={{ textAlign: "center", color: C.textDark, letterSpacing: 1, marginBottom: 24, fontWeight: 700, fontFamily: FONT_MAIN }}>LATEST RESULTS</h2>
      <div style={{ border: `1px solid ${C.cardBorder}`, borderRadius: 4, overflow: "hidden", background: C.white }}>
        {RESULTS.filter((_, i) => i % 2 === 0).map((r, i) => (
          <div key={i} className="result-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <SingleResult item={r} />
            <div>
              <SingleResult item={RESULTS[i * 2 + 1]} />
            </div>
          </div>
        ))}
      </div>
      <div className="results-actions" style={{ textAlign: "center", marginTop: 20, display: "flex", justifyContent: "center", gap: 12 }}>
        <button style={{ ...btnOutline, padding: "10px 30px" }}>LOAD MORE</button>
        <button style={{ ...btnOutline, padding: "10px 30px" }}>VIEW ALL RESULTS</button>
      </div>
    </div>
  );
}

// ── ACCOUNT PAGE ────────────────────────────────────────────────────────────
function AccountPage() {
  const [tab, setTab] = useState("deposit");
  const tabs = [
    { key: "overview", icon: "⊞", label: "Overview" },
    { key: "deposit", icon: "$", label: "Deposit" },
    { key: "history", icon: "↻", label: "History" },
    { key: "settings", icon: "⚙", label: "Settings" },
    { key: "notifications", icon: "ℹ", label: "Notifications" },
  ];
  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 20px" }}>
      <div className="account-tabs" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: tab === t.key ? C.blueAccent : C.white,
            border: `1px solid ${tab === t.key ? C.blueAccent : C.cardBorder}`,
            borderRadius: 4, padding: "16px 10px", cursor: "pointer",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 20, marginBottom: 6, color: tab === t.key ? C.white : C.textDark }}>{t.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: tab === t.key ? C.white : C.textDark }}>{t.label}</div>
          </button>
        ))}
      </div>
      {tab === "deposit" && (
        <div className="form-card" style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 4, padding: "40px 50px" }}>
          <h3 style={{ textAlign: "center", color: C.textDark, marginBottom: 6 }}>M-Pesa deposit</h3>
          <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13, marginBottom: 24 }}>Enter your details below</p>
          {[
            { label: "Currency", val: "KES" },
            { label: "Amount", val: "10" },
            { label: "First Name", val: "Leonie" },
            { label: "Last Name", val: "" },
            { label: "Email", val: "info@email.com" },
          ].map(({ label, val }) => (
            <div key={label} className="account-form-row" style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${C.borderLight}`, padding: "12px 0" }}>
              <label style={{ width: 120, fontSize: 13, color: C.textDark, fontWeight: 600 }}>{label}</label>
              <input defaultValue={val} placeholder={label} style={{ ...inputStyle, flex: 1, border: "none", outline: "none", background: "transparent" }} />
            </div>
          ))}
          <div style={{ textAlign: "right", marginTop: 24 }}>
            <button style={{ ...btnOutline, padding: "10px 30px", letterSpacing: 1, fontWeight: 800 }}>SUBMIT</button>
          </div>
        </div>
      )}
      {tab !== "deposit" && (
        <div style={{ textAlign: "center", padding: 40, color: C.textMuted, background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 4 }}>
          {tab === "overview" && "Account overview coming soon."}
          {tab === "history" && "No betting history yet."}
          {tab === "settings" && "Settings panel coming soon."}
          {tab === "notifications" && "No notifications."}
        </div>
      )}
    </div>
  );
}

// ── HOW TO PLAY PAGE ────────────────────────────────────────────────────────
function HowToPlayPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
      <h2 style={{ textAlign: "center", color: C.textDark, letterSpacing: 1, marginBottom: 40, fontWeight: 700 }}>HOW TO PLAY THE LPCX</h2>
      <div className="howto-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30 }}>
        {[
          { num: 1, title: "HOW TO PLAY THE LPCX", text: "Register and pick from our wide range of lucky draws from around the world. New draws run every day so you can play and win any day. Start by choosing a draw and tapping the \"ENROLL NOW\" button." },
          { num: 2, title: "PICK YOUR DRAW", text: "Improve your odds by predicting 1, 2, 3 or 4 numbers in a draw using the \"BET TYPE\" option. Some draws include a bonus ball. Pick your numbers to match your chosen bet type." },
          { num: 3, title: "SUBMIT YOUR BET", text: "Enter your stake and place your bet. You will get confirmation by SMS or email. Winners are notified the same way and your slip shows winnings. All draw results are on this site." },
        ].map(({ num, title, text }) => (
          <div key={num} style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 6, padding: 28 }}>
            <div style={{ width: 36, height: 36, background: C.blueAccent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 800, fontSize: 16, marginBottom: 14 }}>{num}</div>
            <div style={{ fontWeight: 700, color: C.textDark, marginBottom: 10, fontSize: 13 }}>{title}</div>
            <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [flippingDraw, setFlippingDraw] = useState(null);

  const handleCardClick = (draw) => {
    setFlippingDraw(draw);
    setTimeout(() => {
      setSelectedDraw(draw);
      setFlippingDraw(null);
    }, 400);
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage onCardClick={handleCardClick} flippingDraw={flippingDraw} />;
      case "register": return <RegisterPage setPage={setPage} setLoggedIn={setLoggedIn} />;
      case "lucky-numbers": return <LuckyNumbersPage onCardClick={handleCardClick} flippingDraw={flippingDraw} />;
      case "next-draws": return <NextDrawsPage />;
      case "results": return <ResultsPage />;
      case "account": return <AccountPage />;
      case "how-to-play": return <HowToPlayPage />;
      case "wagers": return <div style={{ textAlign: "center", padding: 60, color: C.textMuted }}>Offers page coming soon.</div>;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: C.offWhite, minHeight: "100vh", position: "relative" }}>
      <Header page={page} setPage={setPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Hero />
      <NavBar page={page} setPage={setPage} />
      <div style={{ minHeight: 400 }}>{renderPage()}</div>
      <Footer />

      {/* Popup with enlarged version of the selected card */}
      {selectedDraw && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedDraw(null)}
        >
          <div
            className="flip-card"
            style={{
              maxWidth: 380,
              width: "92%",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flip-card-inner">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 8,
                  border: `1px solid ${C.cardBorder}`,
                  overflow: "hidden",
                  boxShadow: "0 12px 36px rgba(0,0,0,0.22)",
                }}
              >
                {/* Enlarged card header */}
                <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: C.textDark }}>{selectedDraw.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#1a1a0a", background: "linear-gradient(135deg, #f4d03f 0%, #d4a017 50%, #b8860b 100%)", border: "1px solid rgba(184, 134, 11, 0.6)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", padding: "3px 8px", borderRadius: 4, display: "inline-block" }}>{selectedDraw.points}P</div>
                </div>

                {/* Middle band reusing the same visual structure */}
                <div
                  style={{
                    padding: "12px 0 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    background: "linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #4578ad 40%, #4578ad 100%)",
                  }}
                >
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: "50%",
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                      marginTop: 12,
                      marginBottom: 10,
                    }}
                    >
                    <DrawCardMedia draw={selectedDraw} size={60} />
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <Countdown />
                  </div>
                </div>

                {/* Extra details area – backend-ready: use selectedDraw.participants, totalEntries, priceCap, topPrize, nextDrawAt */}
                {(() => {
                  const participants = selectedDraw.participants ?? 0;
                  const totalEntries = selectedDraw.totalEntries ?? participants;
                  const priceCap = selectedDraw.priceCap ?? "₹ 10,00,000";
                  const topPrize = selectedDraw.topPrize ?? "₹ 5,00,000";
                  const nextDrawAt = selectedDraw.nextDrawAt ?? "Today, 08:30 PM";
                  const statCards = [
                    { label: "Participants", value: participants.toLocaleString(), highlight: true, icon: "👥" },
                    { label: "Total entries", value: totalEntries.toLocaleString(), highlight: false, icon: "📋" },
                    { label: "Price cap", value: priceCap, highlight: false, icon: "🏆" },
                    { label: "Top prize", value: topPrize, highlight: true, icon: "💰" },
                    { label: "Next draw", value: nextDrawAt, highlight: false, icon: "🕐" },
                  ];
                  return (
                    <div style={{ padding: "12px 14px 14px" }}>
                      <div style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: C.blueAccent,
                        marginBottom: 10,
                        borderBottom: `2px solid ${C.blueAccent}`,
                        paddingBottom: 6,
                        display: "inline-block",
                      }}>
                        Draw statistics
                      </div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {statCards.map(({ label, value, highlight, icon }) => (
                          <div
                            key={label}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 10px",
                              background: highlight ? "linear-gradient(135deg, #f0f7ff 0%, #e8f2fc 100%)" : C.white,
                              border: `1px solid ${highlight ? "rgba(74, 144, 217, 0.25)" : C.borderLight}`,
                              borderRadius: 6,
                              boxShadow: highlight ? "0 2px 6px rgba(74, 144, 217, 0.1)" : "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ opacity: 0.9 }}>{icon}</span>
                              {label}
                            </span>
                            <span style={{
                              fontWeight: 800,
                              color: highlight ? C.navyDark : C.textDark,
                              fontSize: highlight ? 13 : 12,
                              letterSpacing: 0.2,
                            }}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Actions */}
                <div style={{ borderTop: `1px solid ${C.borderLight}`, padding: "8px 12px 8px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    style={{
                      ...btnOutline,
                      padding: "6px 14px",
                      fontSize: 12,
                    }}
                    onClick={() => setSelectedDraw(null)}
                  >
                    Close
                  </button>
                  <button
                    style={{
                      ...btnPrimary,
                      padding: "6px 18px",
                      fontSize: 12,
                    }}
                    onClick={() => {}}
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}