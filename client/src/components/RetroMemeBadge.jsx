import React from 'react';

/**
 * RetroMemeBadge
 * High-contrast, scalable, retro arcade pixel SVG badge for Coach McGuirk meme quotes.
 * 100% self-contained, offline-ready, responsive, with accessible ARIA semantics.
 */
export default function RetroMemeBadge({ badgeId, isCorrect, size = 64 }) {
  // Color themes
  const borderColor = isCorrect ? '#10b981' : '#f59e0b';
  const glowColor = isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)';
  const bgSurface = '#060e20';

  // Render specific retro pixel artwork based on badgeId
  const renderBadgeArt = () => {
    switch (badgeId) {
      // 1. This Is Fine (Fire Dog)
      case 'this-is-fine':
        return (
          <g>
            <path d="M10 50 Q16 28 20 40 Q26 20 32 38 Q38 18 44 42 Q48 26 54 50 Z" fill="#ef4444" />
            <path d="M14 50 Q20 34 24 44 Q28 26 34 42 Q38 30 42 50 Z" fill="#facc15" />
            <rect x="18" y="44" width="28" height="6" fill="#78350f" />
            <rect x="22" y="36" width="10" height="8" rx="2" fill="#ffffff" />
            <path d="M32 38 Q36 40 32 42" stroke="#ffffff" strokeWidth="2" fill="none" />
            <path d="M25 34 Q26 31 25 28 M29 34 Q30 31 29 28" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="38" cy="22" rx="10" ry="3" fill="#1e293b" />
            <rect x="32" y="14" width="12" height="8" rx="1" fill="#1e293b" />
            <rect x="32" y="20" width="12" height="2" fill="#ef4444" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#1e293b" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">IT'S FINE</text>
          </g>
        );

      // 2. Galaxy Brain
      case 'galaxy-brain':
        return (
          <g>
            <circle cx="32" cy="28" r="22" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
            <circle cx="32" cy="28" r="16" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.8" />
            <path d="M22 46 C22 36 24 28 32 28 C40 28 42 36 42 46" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <path d="M25 25 C23 21 27 16 32 16 C37 16 41 21 39 25 C42 27 39 31 32 31 C25 31 22 27 25 25 Z" fill="#ec4899" />
            <circle cx="28" cy="22" r="2" fill="#ffffff" />
            <circle cx="36" cy="22" r="2" fill="#ffffff" />
            <circle cx="32" cy="25" r="1.5" fill="#facc15" />
            <polygon points="32,8 33.5,12 37.5,13.5 33.5,15 32,19 30.5,15 26.5,13.5 30.5,12" fill="#facc15" />
            <polygon points="15,22 16,24 18,25 16,26 15,28 14,26 12,25 14,24" fill="#38bdf8" />
            <polygon points="49,24 50,26 52,27 50,28 49,30 48,28 46,27 48,26" fill="#38bdf8" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#0b1326" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">GALAXY BRAIN</text>
          </g>
        );

      // 3. Uno Reverse Card
      case 'uno-reverse':
        return (
          <g>
            <rect x="18" y="10" width="28" height="40" rx="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <ellipse cx="32" cy="30" rx="10" ry="15" fill="#047857" transform="rotate(-25 32 30)" />
            <path d="M26 26 A6 6 0 0 1 36 24 L38 21 L39 27 L33 27 L35 25 A4 4 0 0 0 28 26 Z" fill="#ffffff" />
            <path d="M38 34 A6 6 0 0 1 28 36 L26 39 L25 33 L31 33 L29 35 A4 4 0 0 0 36 34 Z" fill="#ffffff" />
            <rect x="14" y="52" width="36" height="10" rx="3" fill="#065f46" stroke="#ffffff" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">REVERSE</text>
          </g>
        );

      // 4. Doge (Such Compliance)
      case 'doge':
        return (
          <g>
            <ellipse cx="32" cy="30" rx="16" ry="14" fill="#f59e0b" />
            <polygon points="18,22 22,12 28,20" fill="#d97706" />
            <polygon points="46,22 42,12 36,20" fill="#d97706" />
            <ellipse cx="32" cy="34" rx="8" ry="6" fill="#fef3c7" />
            <polygon points="30,31 34,31 32,34" fill="#0f172a" />
            <rect x="22" y="24" width="9" height="7" rx="1" fill="#090d16" />
            <rect x="33" y="24" width="9" height="7" rx="1" fill="#090d16" />
            <rect x="30" y="26" width="4" height="2" fill="#090d16" />
            <line x1="23" y1="25" x2="26" y2="30" stroke="#ffffff" strokeWidth="1" />
            <line x1="34" y1="25" x2="37" y2="30" stroke="#ffffff" strokeWidth="1" />
            <text x="48" y="18" fill="#ec4899" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">WOW</text>
            <text x="12" y="20" fill="#38bdf8" fontSize="5.5" fontFamily="'Space Mono', monospace" fontWeight="900">MUCH</text>
            <rect x="15" y="52" width="34" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">SUCH WCAG</text>
          </g>
        );

      // 5. Emotional Damage (Slipper)
      case 'emotional-damage':
        return (
          <g>
            <polygon points="32,8 37,17 48,15 42,24 50,32 39,34 40,45 30,39 21,46 23,35 13,30 22,23 17,14 27,18" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <g transform="rotate(-30 32 26)">
              <ellipse cx="32" cy="26" rx="14" ry="7" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
              <path d="M24 22 Q32 18 40 22" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              <ellipse cx="22" cy="26" rx="4" ry="5" fill="#dc2626" />
            </g>
            <rect x="6" y="52" width="52" height="10" rx="3" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fee2e2" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">EMOTIONAL DAMAGE!</text>
          </g>
        );

      // 6. One Does Not Simply (Boromir Ring)
      case 'one-does-not-simply':
        return (
          <g>
            <circle cx="32" cy="24" r="13" fill="none" stroke="#facc15" strokeWidth="4" />
            <circle cx="32" cy="24" r="10" fill="#060e20" />
            <path d="M26 38 C28 34 32 30 32 28 C32 26 35 26 35 28 C35 30 38 34 40 38" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
            <polygon points="46,14 47,16 49,17 47,18 46,20 45,18 43,17 45,16" fill="#facc15" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fde68a" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">ONE DOES NOT SIMPLY</text>
          </g>
        );

      // 7. DJ Khaled (Suffering From Success)
      case 'dj-khaled':
        return (
          <g>
            <circle cx="32" cy="28" r="15" fill="#f59e0b" stroke="#fde68a" strokeWidth="2" />
            <circle cx="32" cy="28" r="11" fill="#78350f" />
            <text x="32" y="32" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="900" fontFamily="'Space Mono', monospace">#1</text>
            <path d="M14 18 L24 26 M22 24 L24 22 M20 26 L22 24" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="17" r="3" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fde68a" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">ANOTHER ONE!</text>
          </g>
        );

      // 8. It's Over 9000! (Scouter)
      case 'over-9000':
        return (
          <g>
            <path d="M16 32 C16 18 48 18 48 32" fill="none" stroke="#94a3b8" strokeWidth="3" />
            <rect x="44" y="28" width="6" height="10" rx="2" fill="#475569" />
            <polygon points="26,26 44,26 42,38 28,38" fill="rgba(34, 197, 94, 0.4)" stroke="#22c55e" strokeWidth="2" />
            <text x="35" y="34" textAnchor="middle" fill="#ef4444" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">&gt;9000</text>
            <circle cx="35" cy="32" r="3" fill="none" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="1,1" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#064e3b" stroke="#22c55e" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#86efac" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">OVER 9000!</text>
          </g>
        );

      // 9. Butterfly Meme (Is This Feature?)
      case 'butterfly':
        return (
          <g>
            <g transform="translate(14, 8)">
              <ellipse cx="14" cy="12" rx="7" ry="5" fill="#38bdf8" />
              <ellipse cx="24" cy="12" rx="7" ry="5" fill="#38bdf8" />
              <ellipse cx="16" cy="18" rx="5" ry="4" fill="#0284c7" />
              <ellipse cx="22" cy="18" rx="5" ry="4" fill="#0284c7" />
              <line x1="19" y1="8" x2="19" y2="22" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            </g>
            <path d="M16 46 L26 34 L32 36 L24 48 Z" fill="#fde68a" stroke="#78350f" strokeWidth="1" />
            <text x="48" y="24" fill="#facc15" fontSize="12" fontWeight="900" fontFamily="'Space Mono', monospace">?</text>
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#e0f2fe" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">IS THIS A FEATURE?</text>
          </g>
        );

      // 10. Gigachad (<button> Supremacy)
      case 'gigachad':
        return (
          <g>
            <polygon points="32,12 44,18 42,34 32,44 22,34 20,18" fill="#334155" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="32,22 38,24 36,32 32,38 28,32 26,24" fill="#64748b" />
            <polygon points="22,12 26,16 32,10 38,16 42,12 40,8 24,8" fill="#facc15" stroke="#d97706" strokeWidth="1" />
            <polygon points="46,20 47,22 49,23 47,24 46,26 45,24 43,23 45,22" fill="#ffffff" />
            <rect x="6" y="52" width="52" height="10" rx="3" fill="#0f172a" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">&lt;BUTTON&gt; CHAD</text>
          </g>
        );

      // 11. Hulk Absolute Win
      case 'hulk-win':
        return (
          <g>
            <rect x="24" y="24" width="16" height="18" rx="4" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
            <rect x="22" y="14" width="8" height="14" rx="3" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
            <line x1="28" y1="28" x2="38" y2="28" stroke="#14532d" strokeWidth="1.5" />
            <line x1="28" y1="33" x2="38" y2="33" stroke="#14532d" strokeWidth="1.5" />
            <line x1="28" y1="38" x2="38" y2="38" stroke="#14532d" strokeWidth="1.5" />
            <rect x="24" y="40" width="16" height="6" fill="#9333ea" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#86efac" fontSize="6.2" fontFamily="'Space Mono', monospace" fontWeight="900">ABSOLUTE WIN!</text>
          </g>
        );

      // 12. Wall Sword
      case 'wall-sword':
        return (
          <g>
            <g transform="translate(32, 28)">
              <g transform="rotate(45)">
                <rect x="-2" y="-18" width="4" height="24" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                <rect x="-6" y="6" width="12" height="3" fill="#facc15" />
                <rect x="-1.5" y="9" width="3" height="6" fill="#78350f" />
                <circle cx="0" cy="16" r="2.5" fill="#facc15" />
              </g>
              <g transform="rotate(-45)">
                <rect x="-2" y="-18" width="4" height="24" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                <rect x="-6" y="6" width="12" height="3" fill="#facc15" />
                <rect x="-1.5" y="9" width="3" height="6" fill="#78350f" />
                <circle cx="0" cy="16" r="2.5" fill="#facc15" />
              </g>
            </g>
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">WALL SWORD +1</text>
          </g>
        );

      // 13. SpongeBob Chair (Aight Imma Head Out)
      case 'spongebob-chair':
        return (
          <g>
            <line x1="20" y1="46" x2="30" y2="22" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="44" y1="46" x2="34" y2="22" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="22" y="30" width="20" height="4" rx="1" fill="#38bdf8" />
            <line x1="30" y1="22" x2="32" y2="12" stroke="#94a3b8" strokeWidth="2.5" />
            <rect x="36" y="18" width="10" height="8" rx="2" fill="#facc15" stroke="#d97706" strokeWidth="1" />
            <circle cx="39" cy="21" r="1" fill="#d97706" />
            <circle cx="43" cy="23" r="1" fill="#d97706" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#e0f2fe" fontSize="6.2" fontFamily="'Space Mono', monospace" fontWeight="900">AIGHT IMMA HEAD OUT</text>
          </g>
        );

      // 14. Woman Yelling at Cat
      case 'cat-salad':
        return (
          <g>
            <polygon points="22,26 25,14 30,22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <polygon points="42,26 39,14 34,22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <ellipse cx="32" cy="28" rx="12" ry="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="24,24 26,17 29,22" fill="#fca5a5" />
            <polygon points="40,24 38,17 35,22" fill="#fca5a5" />
            <ellipse cx="27" cy="26" rx="3.5" ry="4" fill="#facc15" />
            <circle cx="27" cy="26" r="2" fill="#090d16" />
            <ellipse cx="37" cy="26" rx="3.5" ry="4" fill="#facc15" />
            <circle cx="37" cy="26" r="2" fill="#090d16" />
            <polygon points="31,31 33,31 32,32.5" fill="#f472b6" />
            <ellipse cx="32" cy="42" rx="16" ry="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="30" cy="41" r="2.5" fill="#22c55e" />
            <circle cx="34" cy="40.5" r="2.5" fill="#16a34a" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">CONFUSED CAT</text>
          </g>
        );

      // 15. HTTP 404
      case '404-error':
        return (
          <g>
            <rect x="14" y="12" width="36" height="28" rx="4" fill="#090d16" stroke="#ef4444" strokeWidth="2" />
            <rect x="28" y="40" width="8" height="6" fill="#475569" />
            <rect x="22" y="46" width="20" height="3" rx="1" fill="#64748b" />
            <text x="32" y="27" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="'Space Mono', monospace" fontWeight="900">404</text>
            <text x="32" y="34" textAnchor="middle" fill="#fca5a5" fontSize="4.5" fontFamily="'Space Mono', monospace">NOT FOUND</text>
            <rect x="42" y="22" width="2" height="5" fill="#22c55e" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fee2e2" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">HTTP 404 RIP</text>
          </g>
        );

      // 16. Bernie Mittens
      case 'bernie-mittens':
        return (
          <g>
            <path d="M20 46 C20 32 44 32 44 46 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <rect x="26" y="22" width="12" height="8" rx="2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="28" cy="19" r="3" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="36" cy="19" r="3" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <ellipse cx="28" cy="36" rx="6" ry="5" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <ellipse cx="36" cy="36" rx="6" ry="5" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fef3c7" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">ONCE AGAIN ASKING</text>
          </g>
        );

      // 17. Roll Safe (Thinking Guy)
      case 'roll-safe':
        return (
          <g>
            <circle cx="30" cy="28" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M44 42 L38 32 L34 26 L30 26" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="44" cy="16" r="4" fill="#facc15" />
            <line x1="44" y1="8" x2="44" y2="10" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="50" y1="12" x2="48" y2="14" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="52" y1="16" x2="50" y2="16" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#1e293b" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">ROLL SAFE</text>
          </g>
        );

      // 18. Press F (To Pay Respects)
      case 'press-f':
        return (
          <g>
            <polygon points="18,16 46,16 42,42 22,42" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <polygon points="18,16 46,16 44,12 20,12" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
            <text x="32" y="34" textAnchor="middle" fill="#facc15" fontSize="18" fontFamily="'Space Grotesk', sans-serif" fontWeight="900">F</text>
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#0f172a" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">PRESS F IN CHAT</text>
          </g>
        );

      // 19. Bob Ross (Happy Headings)
      case 'bob-ross':
        return (
          <g>
            <circle cx="32" cy="22" r="15" fill="#78350f" />
            <ellipse cx="32" cy="27" rx="10" ry="9" fill="#fde68a" />
            <path d="M24 28 Q32 38 40 28" fill="#78350f" />
            <ellipse cx="20" cy="40" rx="8" ry="6" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <circle cx="16" cy="39" r="1.5" fill="#38bdf8" />
            <circle cx="20" cy="38" r="1.5" fill="#22c55e" />
            <circle cx="23" cy="41" r="1.5" fill="#ef4444" />
            <polygon points="46,30 42,36 44,36 40,42 48,42" fill="#16a34a" />
            <rect x="43.5" y="42" width="1.5" height="3" fill="#78350f" />
            <rect x="6" y="52" width="52" height="10" rx="3" fill="#451a03" stroke="#fde68a" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fde68a" fontSize="6.2" fontFamily="'Space Mono', monospace" fontWeight="900">HAPPY HEADINGS</text>
          </g>
        );

      // 20. Spiderman Pointing Meme
      case 'spiderman':
        return (
          <g>
            <path d="M12 28 L24 28 L28 26 L24 32 L12 32 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="28" cy="26" r="1.5" fill="#ffffff" />
            <path d="M52 28 L40 28 L36 26 L40 32 L52 32 Z" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
            <circle cx="36" cy="26" r="1.5" fill="#ffffff" />
            <polygon points="32,22 33,25 36,26 33,27 32,30 31,27 28,26 31,25" fill="#facc15" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">IT'S YOU! IT'S ME!</text>
          </g>
        );

      // 21. Houston We Have A Problem
      case 'houston':
        return (
          <g>
            <rect x="24" y="20" width="16" height="14" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
            <rect x="28" y="24" width="8" height="5" fill="#0284c7" />
            <line x1="24" y1="34" x2="16" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="34" x2="48" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="20" x2="30" y2="10" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="30" cy="9" r="2" fill="#ef4444" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fca5a5" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">HOUSTON WE LOST</text>
          </g>
        );

      // 22. Studying / "Cheating"
      case 'studying':
        return (
          <g>
            <path d="M14 38 Q32 44 50 38 L50 20 Q32 26 14 20 Z" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
            <line x1="32" y1="24" x2="32" y2="42" stroke="#64748b" strokeWidth="2" />
            <circle cx="28" cy="24" r="8" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="34" y1="30" x2="42" y2="38" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <rect x="18" y="28" width="28" height="8" rx="2" fill="#ef4444" transform="rotate(-15 32 32)" />
            <text x="32" y="34" textAnchor="middle" fill="#ffffff" fontSize="5.5" fontFamily="'Space Mono', monospace" fontWeight="900" transform="rotate(-15 32 32)">CHEATING!</text>
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fde68a" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">STUDY = CHEAT</text>
          </g>
        );

      // 23. Sweatpants Doctrine
      case 'sweatpants':
        return (
          <g>
            <path d="M20 16 L44 16 L42 42 L34 42 L32 28 L30 42 L22 42 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <line x1="28" y1="16" x2="28" y2="22" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="36" y1="16" x2="36" y2="22" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="44" cy="30" r="4" fill="#facc15" stroke="#b45309" strokeWidth="1" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#ffffff" fontSize="6.2" fontFamily="'Space Mono', monospace" fontWeight="900">SWEATPANTS 2PM</text>
          </g>
        );

      // 24. Granola Bar (1998 Vintage)
      case 'granola-bar':
        return (
          <g>
            <rect x="14" y="22" width="36" height="16" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <path d="M12 20 L16 30 L12 40 M52 20 L48 30 L52 40" stroke="#facc15" strokeWidth="2" fill="none" />
            <rect x="20" y="25" width="24" height="10" rx="1" fill="#78350f" />
            <text x="32" y="32" textAnchor="middle" fill="#fef08a" fontSize="5.5" fontFamily="'Space Mono', monospace" fontWeight="900">1998 SNACK</text>
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fef08a" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">GRANOLA BAR</text>
          </g>
        );

      // 25. Guessing / Dice
      case 'guessing':
        return (
          <g>
            <rect x="16" y="16" width="18" height="18" rx="3" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            <circle cx="21" cy="21" r="1.5" fill="#ffffff" />
            <circle cx="25" cy="25" r="1.5" fill="#ffffff" />
            <circle cx="29" cy="29" r="1.5" fill="#ffffff" />
            <rect x="28" y="24" width="20" height="20" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="34" cy="30" r="1.5" fill="#dc2626" />
            <circle cx="42" cy="30" r="1.5" fill="#dc2626" />
            <circle cx="38" cy="34" r="1.5" fill="#dc2626" />
            <circle cx="34" cy="38" r="1.5" fill="#dc2626" />
            <circle cx="42" cy="38" r="1.5" fill="#dc2626" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fee2e2" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">TACTICAL GUESS</text>
          </g>
        );

      // 26. Laps / Running Shoe
      case 'laps':
        return (
          <g>
            <path d="M16 36 L24 24 L38 24 L48 34 L48 38 L16 38 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <rect x="14" y="38" width="36" height="5" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M26 24 L24 30 L36 30" stroke="#facc15" strokeWidth="2" fill="none" />
            <line x1="8" y1="40" x2="12" y2="40" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="36" x2="11" y2="36" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#e0f2fe" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">RUN 2 LAPS</text>
          </g>
        );

      // 27. High Five
      case 'high-five':
        return (
          <g>
            <path d="M20 40 L20 28 L23 20 L26 28 L26 40" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
            <path d="M44 40 L44 28 L41 20 L38 28 L38 40" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
            <polygon points="32,16 34,22 40,24 34,26 32,32 30,26 24,24 30,22" fill="#facc15" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fef08a" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">NO HIGH FIVES</text>
          </g>
        );

      // 28. Soccer Defense
      case 'soccer-defense':
        return (
          <g>
            <circle cx="32" cy="28" r="14" fill="#ffffff" stroke="#090d16" strokeWidth="2" />
            <polygon points="32,24 36,27 34,31 30,31 28,27" fill="#090d16" />
            <line x1="32" y1="24" x2="32" y2="14" stroke="#090d16" strokeWidth="1.5" />
            <line x1="36" y1="27" x2="44" y2="23" stroke="#090d16" strokeWidth="1.5" />
            <line x1="34" y1="31" x2="41" y2="38" stroke="#090d16" strokeWidth="1.5" />
            <line x1="30" y1="31" x2="23" y2="38" stroke="#090d16" strokeWidth="1.5" />
            <line x1="28" y1="27" x2="20" y2="23" stroke="#090d16" strokeWidth="1.5" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#065f46" stroke="#34d399" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#a7f3d0" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">DEFENSIVE LINE</text>
          </g>
        );

      // 29. Resume Builder
      case 'resume':
        return (
          <g>
            <rect x="20" y="12" width="24" height="32" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="25" y1="18" x2="39" y2="18" stroke="#0284c7" strokeWidth="2" />
            <line x1="25" y1="23" x2="36" y2="23" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="25" y1="28" x2="39" y2="28" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="25" y1="33" x2="33" y2="33" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="38" cy="38" r="5" fill="#facc15" stroke="#d97706" strokeWidth="1" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#075985" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#e0f2fe" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">ON MY RÉSUMÉ</text>
          </g>
        );

      // 30. Captain Now
      case 'captain-now':
        return (
          <g>
            <path d="M16 26 C16 14 48 14 48 26 Z" fill="#ffffff" stroke="#090d16" strokeWidth="2" />
            <rect x="14" y="26" width="36" height="6" fill="#090d16" />
            <path d="M32 20 L32 24 M30 22 L34 22 M29 25 C30 27 34 27 35 25" stroke="#facc15" strokeWidth="1.5" fill="none" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#0f172a" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">I AM CAPTAIN NOW</text>
          </g>
        );

      // 31. Hall of Fame (Trophy)
      case 'hall-of-fame':
        return (
          <g>
            <path d="M22 16 L42 16 L38 32 C38 36 34 38 32 38 C30 38 26 36 26 32 Z" fill="#facc15" stroke="#d97706" strokeWidth="2" />
            <path d="M22 20 C16 20 16 28 24 28" fill="none" stroke="#facc15" strokeWidth="2" />
            <path d="M42 20 C48 20 48 28 40 28" fill="none" stroke="#facc15" strokeWidth="2" />
            <rect x="30" y="38" width="4" height="6" fill="#d97706" />
            <rect x="24" y="44" width="16" height="4" rx="1" fill="#78350f" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fef08a" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">HALL OF FAME</text>
          </g>
        );

      // 32. Diner Economics
      case 'diner':
        return (
          <g>
            <rect x="16" y="14" width="32" height="16" rx="3" fill="#090d16" stroke="#ec4899" strokeWidth="2" />
            <text x="32" y="25" textAnchor="middle" fill="#ec4899" fontSize="7" fontFamily="'Space Grotesk', sans-serif" fontWeight="900">DINER</text>
            <rect x="26" y="34" width="12" height="9" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M38 36 Q42 38 38 41" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#831843" stroke="#f472b6" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fce7f3" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">YOU'RE BUYING</text>
          </g>
        );

      // 33. Cooler Perch Strategy
      case 'cooler':
        return (
          <g>
            <rect x="18" y="22" width="28" height="20" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <rect x="16" y="18" width="32" height="6" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="32" cy="28" r="2" fill="#ffffff" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#e0f2fe" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">COOLER PERCH</text>
          </g>
        );

      // 34. Push vs Pull Crisis
      case 'push-pull':
        return (
          <g>
            <rect x="22" y="12" width="20" height="34" rx="2" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
            <rect x="24" y="24" width="16" height="10" fill="#dc2626" />
            <text x="32" y="31.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">PULL</text>
            <line x1="38" y1="22" x2="38" y2="36" stroke="#090d16" strokeWidth="2" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fee2e2" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">PUSHED A PULL</text>
          </g>
        );

      // 35. You Had One Job
      case 'one-job':
        return (
          <g>
            <polygon points="32,14 42,40 22,40" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
            <polygon points="32,24 38,34 26,34" fill="#ffffff" />
            <rect x="18" y="40" width="28" height="5" rx="1" fill="#ea580c" />
            <text x="32" y="10" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="900">⚠️</text>
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#7c2d12" stroke="#fb923c" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#ffedd5" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">YOU HAD 1 JOB</text>
          </g>
        );

      // 36. Keyboard Focus Trap
      case 'focus-trap':
        return (
          <g>
            <rect x="22" y="26" width="20" height="16" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <path d="M26 26 L26 20 C26 14 38 14 38 20 L38 26" fill="none" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="32" cy="33" r="2" fill="#090d16" />
            <line x1="32" y1="35" x2="32" y2="38" stroke="#090d16" strokeWidth="2" />
            <rect x="10" y="52" width="44" height="10" rx="3" fill="#78350f" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fef08a" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">FOCUS TRAP</text>
          </g>
        );

      // 37. Anakin's High Ground
      case 'high-ground':
        return (
          <g>
            <polygon points="12,46 36,24 48,46" fill="#78350f" />
            <line x1="28" y1="24" x2="28" y2="32" stroke="#fde68a" strokeWidth="2" />
            <circle cx="28" cy="22" r="2.5" fill="#fde68a" />
            <line x1="28" y1="26" x2="38" y2="18" stroke="#38bdf8" strokeWidth="2" />
            <path d="M10 46 Q32 42 54 46" stroke="#ef4444" strokeWidth="3" fill="none" />
            <rect x="8" y="52" width="48" height="10" rx="3" fill="#451a03" stroke="#ef4444" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#fee2e2" fontSize="6" fontFamily="'Space Mono', monospace" fontWeight="900">HIGH GROUND</text>
          </g>
        );

      // Default: Coach McGuirk Baseball Cap & Whistle
      default:
        return (
          <g>
            <path d="M18 28 C18 16 46 16 46 28 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <ellipse cx="36" cy="28" rx="14" ry="4" fill="#991b1b" />
            <g transform="translate(24, 32)">
              <rect x="0" y="4" width="14" height="6" rx="2" fill="#facc15" stroke="#b45309" strokeWidth="1" />
              <circle cx="12" cy="7" r="4" fill="#facc15" stroke="#b45309" strokeWidth="1" />
              <circle cx="12" cy="7" r="1.5" fill="#78350f" />
              <path d="M0 6 L-6 2" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="1,1" />
            </g>
            <path d="M44 36 Q48 38 44 40" stroke="#facc15" strokeWidth="1.5" fill="none" />
            <path d="M47 34 Q52 38 47 42" stroke="#facc15" strokeWidth="1.5" fill="none" />
            <rect x="12" y="52" width="40" height="10" rx="3" fill="#7f1d1d" stroke="#facc15" strokeWidth="1" />
            <text x="32" y="59.5" textAnchor="middle" fill="#facc15" fontSize="6.5" fontFamily="'Space Mono', monospace" fontWeight="900">COACH SAYS</text>
          </g>
        );
    }
  };

  return (
    <div
      className="retro-meme-badge-container"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label={`Retro meme badge: ${badgeId || 'coach-pep-talk'}`}
        style={{
          background: bgSurface,
          borderRadius: '8px',
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 10px ${glowColor}, inset 0 0 6px rgba(0, 0, 0, 0.6)`,
          imageRendering: 'pixelated',
          display: 'block'
        }}
      >
        {renderBadgeArt()}
      </svg>
    </div>
  );
}
