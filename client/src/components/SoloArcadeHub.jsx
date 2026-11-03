import React from 'react';
import { soundManager } from '../utils/sound';

const SOLO_CABINETS = [
  {
    code: 'CABINET 00',
    tag: '[UNTIMED // DEEP BoK STUDY]',
    tagColor: '#10b981',
    accent: '#38bdf8',
    iconBg: 'rgba(56, 189, 248, 0.1)',
    btnBg: '#38bdf8',
    btnBorder: '#38bdf8',
    btnColor: '#090d16',
    emoji: '🎓',
    title: 'Classic Self-Paced Practice',
    subtitle: 'UNTIMED BOK CITATIONS & HINTS',
    description: 'Zero timer pressure. Filter by Domains 1, 2, or 3 with detailed explanations, distractor traps, and instant Body of Knowledge citations.',
    difficulty: '★☆☆☆☆',
    mode: 'CLASSIC'
  },
  {
    code: 'CABINET 01',
    tag: '[DELEGATE ROULETTE // AI BOTS]',
    tagColor: '#fbbf24',
    accent: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    btnBg: '#d97706',
    btnBorder: '#f59e0b',
    btnColor: '#ffffff',
    emoji: '🥔',
    title: 'Solo Hot Potato Syndicate',
    subtitle: 'SPAR WITH ADA, DEVIN & JORDAN',
    description: 'Pass hot accessibility tickets before the timer triggers! Delegate to AI bot peers, answer when drafted, and bank social dividends.',
    difficulty: '★★★☆☆',
    mode: 'HOT_POTATO'
  },
  {
    code: 'CABINET 02',
    tag: '[3-GEAR SPEEDWAY // GHOST RACE]',
    tagColor: '#f87171',
    accent: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    btnBg: '#dc2626',
    btnBorder: '#ef4444',
    btnColor: '#ffffff',
    emoji: '🏎️',
    title: 'Solo Grand Prix Racer',
    subtitle: 'RACE GHOSTS OF TINA & SAL',
    description: 'Shift gears across a 100m sprint: 1st Gear (Single-A safety), 2nd Gear (Double-A speedway), 3rd Gear (Triple-A nitro). Pit stops clear stalls!',
    difficulty: '★★★★☆',
    mode: 'GRAND_PRIX'
  },
  {
    code: 'CABINET 03',
    tag: '[CHIP WAGERING // RISK MATRIX]',
    tagColor: '#e9d5ff',
    accent: '#c084fc',
    iconBg: 'rgba(192, 132, 252, 0.1)',
    btnBg: '#7e22ce',
    btnBorder: '#a855f7',
    btnColor: '#ffffff',
    emoji: '🎰',
    title: 'Solo High-Roller Gauntlet',
    subtitle: 'WAGER AGAINST AI BETTORS',
    description: 'Wager chips on tricky screen reader nuances (NVDA, JAWS, VoiceOver), Braille displays, and hardware workflows. Call bot bluffs!',
    difficulty: '★★★★★',
    mode: 'HIGH_ROLLER'
  },
  {
    code: 'CABINET 04',
    tag: '[HEATMAP SNIPING // VPAT AUDIT]',
    tagColor: '#7dd3fc',
    accent: '#38bdf8',
    iconBg: 'rgba(56, 189, 248, 0.1)',
    btnBg: '#0284c7',
    btnBorder: '#38bdf8',
    btnColor: '#ffffff',
    emoji: '🎯',
    title: 'Solo Flaw Finder',
    subtitle: 'LEGAL POLICY LOOPHOLE SNIPING',
    description: 'Audit authentic corporate policies, VPATs & contracts. Snipe the legal loophole before Safe Sal issues a conservative audit halt.',
    difficulty: '★★★☆☆',
    mode: 'FLAW_FINDER'
  },
  {
    code: 'CABINET 05',
    tag: '[ARIA HEIST // CODE RESCUE]',
    tagColor: '#f87171',
    accent: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    btnBg: '#dc2626',
    btnBorder: '#ef4444',
    btnColor: '#ffffff',
    emoji: '🕵️',
    title: 'Solo Saboteur in Server Room',
    subtitle: 'RESOURCE HEIST & CODE RESCUE',
    description: 'A rogue bot has injected broken ARIA roles & keyboard traps! Fix anomalies, restore compliance, and outwit the imposter.',
    difficulty: '★★★★☆',
    mode: 'SABOTEUR'
  },
  {
    code: 'CABINET 06',
    tag: '[2X2 QUADRANT // TERRITORY DEBATE]',
    tagColor: '#fbbf24',
    accent: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    btnBg: '#d97706',
    btnBorder: '#f59e0b',
    btnColor: '#ffffff',
    emoji: '⚖️',
    title: 'Solo Boundary Line Brawl',
    subtitle: '2X2 MATRIX SPATIAL DEBATE',
    description: 'Map edge-case scenarios onto the 2×2 matrix and slap debate challenges against 3 AI compliance specialists!',
    difficulty: '★★★★☆',
    mode: 'BOUNDARY_BRAWL'
  },
  {
    code: 'CABINET 07',
    tag: '[TECH TREE // GIGACORP MONOLITH]',
    tagColor: '#e9d5ff',
    accent: '#a855f7',
    iconBg: 'rgba(168, 85, 247, 0.1)',
    btnBg: '#7e22ce',
    btnBorder: '#a855f7',
    btnColor: '#ffffff',
    emoji: '👾',
    title: 'Solo Enterprise Boss Raid',
    subtitle: 'CO-OP AI SQUAD & TECH TREE',
    description: 'Raid the GigaCorp Compliance Monolith! Navigate the accessible tech tree, unlock squad buffs with AI bots Ada, Alex & Tina, and crack 3 elemental shields.',
    difficulty: '★★★★★',
    mode: 'BOSS_RAID'
  }
];

export default function SoloArcadeHub({ onSelectMode }) {
  const handleLaunch = (mode) => {
    soundManager.playClick();
    onSelectMode(mode);
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
      {/* Marquee Hero Header */}
      <section aria-labelledby="solo-marquee-title" className="marquee-hero-card">
        <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span aria-hidden="true">✓</span>
              <span>[DOM-1/2/3 HYBRID]</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)' }}>
              [BOT CPU MATRIX // TURING V4.2]
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span aria-hidden="true">🛡️</span>
              <span>WCAG 2.2 AAA VERIFIED</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #334155', color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: '#0b1326' }}>
              [OFFLINE CACHE READY]
            </span>
          </div>

          <h1 id="solo-marquee-title" style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            SOLO DRILLS & SIMULATED AI CADETS
          </h1>
          <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: '#94a3b8', maxWidth: '850px', lineHeight: 1.5 }}>
            Sharpen your Digital Accessibility IAAP certification muscle memory (CPACC · WAS · ADS) without peer pressure! Spar against simulated neural bot peers: <strong style={{ color: '#38bdf8' }}>Ada Lovelace Bot</strong> (relentless logic & criteria recall), <strong style={{ color: '#ef4444' }}>Turbo Tina</strong> (speed demon & timer rusher), and <strong style={{ color: '#10b981' }}>Safe Sal</strong> (risk-averse legal compliance counsel). Every cartridge simulates realistic exam curveballs.
          </p>

          {/* Bot Roster Quick-Preview Bar */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1', fontWeight: 800 }}>
              SIMULATED PEER ROSTER:
            </span>
            <span style={{ background: '#0b1326', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: "'Space Mono', monospace" }}>
              🤖 Ada Lovelace [ARIA Core • 99.4% Acc]
            </span>
            <span style={{ background: '#0b1326', border: '1px solid #ef4444', color: '#f87171', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: "'Space Mono', monospace" }}>
              🏎️ Turbo Tina [Speed Demon • 4.2s Avg]
            </span>
            <span style={{ background: '#0b1326', border: '1px solid #10b981', color: '#6ee7b7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: "'Space Mono', monospace" }}>
              🛡️ Safe Sal [VPAT Shield • Risk Aversion]
            </span>
            <span style={{ background: '#0b1326', border: '1px solid #c084fc', color: '#e9d5ff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontFamily: "'Space Mono', monospace" }}>
              🎨 Dana Design [UD Cartographer]
            </span>
          </div>
        </div>
      </section>

      {/* 8 Solo Arcade Cabinets */}
      <section aria-labelledby="solo-cabinets-title">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8', fontWeight: 800 }}>
              [ACTIVE CARTRIDGE SELECTION]
            </span>
          </div>
          <h2 id="solo-cabinets-title" style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            SOLO DIGITAL ACCESSIBILITY TRAINING CARTRIDGES (CPACC · WAS · ADS)
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
            Drop a virtual token into any solo arcade cabinet to begin training against AI simulated peers:
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {SOLO_CABINETS.map((cab) => (
            <article key={cab.code} className="arcade-cabinet-card" style={{ borderColor: cab.accent }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: cab.accent }}>
                    {cab.code}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: cab.tagColor }}>
                    {cab.tag}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: cab.iconBg,
                      border: `2px solid ${cab.accent}`,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0
                    }}
                  >
                    {cab.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {cab.title}
                    </h3>
                    <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: cab.accent, display: 'block', marginTop: '0.15rem' }}>
                      {cab.subtitle}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                  {cab.description}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                  Difficulty: {cab.difficulty}
                </span>
                <button
                  type="button"
                  className="btn-primary arcade-btn-primary"
                  aria-label={`LAUNCH SOLO DRILL: ${cab.title}`}
                  onClick={() => handleLaunch(cab.mode)}
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.8rem',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 800,
                    background: cab.btnBg,
                    borderColor: cab.btnBorder,
                    color: cab.btnColor
                  }}
                >
                  LAUNCH SOLO DRILL
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Arcade Dock */}
      <aside aria-label="Solo training control deck" className="arcade-dock">
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981' }}>
              <span aria-hidden="true">🛡️</span>
              <span>Zero Timer Pressure Options Available</span>
            </span>
            <span aria-hidden="true">•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
              <span aria-hidden="true">✓</span>
              <span>Full IAAP BoK Coverage (CPACC · WAS · ADS)</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#facc15' }}>
              <span aria-hidden="true">🤖</span>
              <span>4 AI Bot Personas Active</span>
            </span>
          </div>

          <button
            type="button"
            className="btn-primary arcade-btn-primary"
            onClick={() => handleLaunch('CLASSIC')}
            style={{
              fontSize: '1rem',
              padding: '0.65rem 1.75rem',
              background: '#38bdf8',
              borderColor: '#38bdf8',
              color: '#090d16',
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            <span>▶ QUICK START: UNTIMED PRACTICE</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
