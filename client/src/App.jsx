import React, { useState } from 'react';
import A11yHeader from './components/A11yHeader';
import LiveMode from './components/LiveMode';
import PracticeMode from './components/PracticeMode';
import SoloHotPotato from './components/SoloHotPotato';
import SoloGrandPrix from './components/SoloGrandPrix';
import SoloHighRoller from './components/SoloHighRoller';
import SoloFlawFinder from './components/SoloFlawFinder';
import SoloSaboteur from './components/SoloSaboteur';
import SoloBoundaryBrawl from './components/SoloBoundaryBrawl';
import SoloBossRaid from './components/SoloBossRaid';
import WeeklyLeaderboard from './components/WeeklyLeaderboard';
import MissedQuestionsReview from './components/MissedQuestionsReview';
import QuestionBankExplorer from './components/QuestionBankExplorer';
import { Users, GraduationCap, Trophy, BookOpen, Library, Bot, Zap } from 'lucide-react';
import { soundManager } from './utils/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState('LIVE'); // 'LIVE' | 'SOLO_HUB' | 'LEADERBOARD' | 'STUDY' | 'EXPLORER'
  const [soloSubMode, setSoloSubMode] = useState('MENU'); // 'MENU' | 'CLASSIC' | 'HOT_POTATO' | 'GRAND_PRIX'

  const handleTabChange = (tab) => {
    soundManager.playClick();
    setActiveTab(tab);
    if (tab === 'SOLO_HUB') {
      setSoloSubMode('MENU');
    }
  };

  return (
    <div className="app-container">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          background: '#38bdf8',
          color: '#000000',
          padding: '8px 16px',
          fontWeight: 800,
          borderRadius: '4px',
          textDecoration: 'none'
        }}
        onFocus={(e) => e.target.classList.remove('sr-only')}
        onBlur={(e) => e.target.classList.add('sr-only')}
      >
        Skip to main game content
      </a>

      {/* Global Header & A11y Toolbar */}
      <A11yHeader activeMode={activeTab} setActiveMode={setActiveTab} />

      {/* Navigation Mode Tabs */}
      <nav role="tablist" aria-label="Game Mode Navigation" className="mode-tabs">
        <button
          type="button"
          role="tab"
          id="tab-live"
          aria-selected={activeTab === 'LIVE'}
          aria-controls="panel-live"
          className={`mode-tab ${activeTab === 'LIVE' ? 'active' : ''}`}
          onClick={() => handleTabChange('LIVE')}
        >
          <Users size={18} />
          <span>Live Meeting Mode</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-solo"
          aria-selected={activeTab === 'SOLO_HUB'}
          aria-controls="panel-solo"
          className={`mode-tab ${activeTab === 'SOLO_HUB' ? 'active' : ''}`}
          onClick={() => handleTabChange('SOLO_HUB')}
        >
          <GraduationCap size={18} />
          <span>Solo & AI Bots</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-leaderboard"
          aria-selected={activeTab === 'LEADERBOARD'}
          aria-controls="panel-leaderboard"
          className={`mode-tab ${activeTab === 'LEADERBOARD' ? 'active' : ''}`}
          onClick={() => handleTabChange('LEADERBOARD')}
        >
          <Trophy size={18} />
          <span>Leaderboard</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-study"
          aria-selected={activeTab === 'STUDY'}
          aria-controls="panel-study"
          className={`mode-tab ${activeTab === 'STUDY' ? 'active' : ''}`}
          onClick={() => handleTabChange('STUDY')}
        >
          <BookOpen size={18} />
          <span>Missed Questions</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-explorer"
          aria-selected={activeTab === 'EXPLORER'}
          aria-controls="panel-explorer"
          className={`mode-tab ${activeTab === 'EXPLORER' ? 'active' : ''}`}
          onClick={() => handleTabChange('EXPLORER')}
        >
          <Library size={18} />
          <span>Question Bank</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main id="main-content" className="main-stage">
        {/* TAB 1: LIVE MEETING MODE */}
        {activeTab === 'LIVE' && (
          <div role="tabpanel" id="panel-live" aria-labelledby="tab-live">
            <LiveMode />
          </div>
        )}

        {/* TAB 2: SOLO & AI BOT MODES */}
        {activeTab === 'SOLO_HUB' && (
          <div role="tabpanel" id="panel-solo" aria-labelledby="tab-solo">
            {soloSubMode === 'MENU' && (
              <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
                {/* Marquee Hero Header */}
                <section aria-labelledby="solo-marquee-title" className="marquee-hero-card">
                  <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
                  <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>✓</span>
                        <span>[DOM-1/2/3 HYBRID]</span>
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)' }}>
                        [BOT CPU MATRIX // TURING V4.2]
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>🛡️</span>
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

                {/* 7 Solo Arcade Cabinets */}
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
                    {/* Cabinet 00: Classic Self-Paced Practice */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#38bdf8' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#38bdf8' }}>
                            CABINET 00
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#10b981' }}>
                            [UNTIMED // DEEP BoK STUDY]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(56, 189, 248, 0.1)', border: '2px solid #38bdf8', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            🎓
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Classic Self-Paced Practice
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8', display: 'block', marginTop: '0.15rem' }}>
                              UNTIMED BOK CITATIONS & HINTS
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Zero timer pressure. Filter by Domains 1, 2, or 3 with detailed explanations, distractor traps, and instant Body of Knowledge citations.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★☆☆☆☆
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('CLASSIC'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800 }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>

                    {/* Cabinet 01: Solo Hot Potato Syndicate */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#f59e0b' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#f59e0b' }}>
                            CABINET 01
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#fbbf24' }}>
                            [DELEGATE ROULETTE // AI BOTS]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(245, 158, 11, 0.1)', border: '2px solid #f59e0b', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            🥔
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo Hot Potato Syndicate
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#f59e0b', display: 'block', marginTop: '0.15rem' }}>
                              SPAR WITH ADA, DEVIN & JORDAN
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Pass hot accessibility tickets before the timer triggers! Delegate to AI bot peers, answer when drafted, and bank social dividends.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★☆☆
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('HOT_POTATO'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#d97706', borderColor: '#f59e0b' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>

                    {/* Cabinet 02: Solo Grand Prix Racer */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#ef4444' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#ef4444' }}>
                            CABINET 02
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#f87171' }}>
                            [3-GEAR SPEEDWAY // GHOST RACE]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            🏎️
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo Grand Prix Racer
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#ef4444', display: 'block', marginTop: '0.15rem' }}>
                              RACE GHOSTS OF TINA & SAL
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Shift gears across a 100m sprint: 1st Gear (Single-A safety), 2nd Gear (Double-A speedway), 3rd Gear (Triple-A nitro). Pit stops clear stalls!
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★★☆
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('GRAND_PRIX'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#dc2626', borderColor: '#ef4444' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>

                    {/* Cabinet 03: Solo High-Roller Gauntlet */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#c084fc' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#c084fc' }}>
                            CABINET 03
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#e9d5ff' }}>
                            [CHIP WAGERING // RISK MATRIX]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(192, 132, 252, 0.1)', border: '2px solid #c084fc', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            🎰
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo High-Roller Gauntlet
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#c084fc', display: 'block', marginTop: '0.15rem' }}>
                              WAGER AGAINST AI BETTORS
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Wager chips on tricky screen reader nuances (NVDA, JAWS, VoiceOver), Braille displays, and hardware workflows. Call bot bluffs!
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★★★
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('HIGH_ROLLER'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#7e22ce', borderColor: '#a855f7' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>

                    {/* Cabinet 04: Solo Flaw Finder */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#38bdf8' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#38bdf8' }}>
                            CABINET 04
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#7dd3fc' }}>
                            [HEATMAP SNIPING // VPAT AUDIT]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(56, 189, 248, 0.1)', border: '2px solid #38bdf8', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            🎯
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo Flaw Finder
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8', display: 'block', marginTop: '0.15rem' }}>
                              LEGAL POLICY LOOPHOLE SNIPING
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Audit authentic corporate policies, VPATs & contracts. Snipe the legal loophole before Safe Sal issues a conservative audit halt.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★☆☆
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('FLAW_FINDER'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#0284c7', borderColor: '#38bdf8' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>

                    {/* Cabinet 05: Solo Saboteur */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#ef4444' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#ef4444' }}>
                            CABINET 05
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#f87171' }}>
                            [ARIA HEIST // CODE RESCUE]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            🕵️
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo Saboteur in Server Room
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#ef4444', display: 'block', marginTop: '0.15rem' }}>
                              RESOURCE HEIST & CODE RESCUE
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          A rogue bot has injected broken ARIA roles & keyboard traps! Fix anomalies, restore compliance, and outwit the imposter.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★★☆
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('SABOTEUR'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#dc2626', borderColor: '#ef4444' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>

                    {/* Cabinet 06: Solo Boundary Line Brawl */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#f59e0b' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#f59e0b' }}>
                            CABINET 06
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#fbbf24' }}>
                            [2X2 QUADRANT // TERRITORY DEBATE]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(245, 158, 11, 0.1)', border: '2px solid #f59e0b', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            ⚖️
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo Boundary Line Brawl
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#f59e0b', display: 'block', marginTop: '0.15rem' }}>
                              2X2 MATRIX SPATIAL DEBATE
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Map edge-case scenarios onto the 2×2 matrix and slap debate challenges against 3 AI compliance specialists!
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★★☆
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('BOUNDARY_BRAWL'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#d97706', borderColor: '#f59e0b' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>
                    {/* Cabinet 07: Solo Enterprise Boss Raid */}
                    <article className="arcade-cabinet-card" style={{ borderColor: '#a855f7' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#c084fc' }}>
                            CABINET 07
                          </span>
                          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#e9d5ff' }}>
                            [TECH TREE // GIGACORP MONOLITH]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', background: 'rgba(168, 85, 247, 0.1)', border: '2px solid #a855f7', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            👾
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                              Solo Enterprise Boss Raid
                            </h3>
                            <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: '#c084fc', display: 'block', marginTop: '0.15rem' }}>
                              CO-OP AI SQUAD & TECH TREE
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                          Raid the GigaCorp Compliance Monolith! Navigate the accessible tech tree, unlock squad buffs with AI bots Ada, Alex & Tina, and crack 3 elemental shields.
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          Difficulty: ★★★★★
                        </span>
                        <button
                          type="button"
                          className="btn-primary arcade-btn-primary"
                          onClick={() => { soundManager.playClick(); setSoloSubMode('BOSS_RAID'); }}
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#7e22ce', borderColor: '#a855f7' }}
                        >
                          LAUNCH SOLO DRILL
                        </button>
                      </div>
                    </article>
                  </div>
                </section>

                {/* Bottom Arcade Dock */}
                <aside aria-label="Solo training control deck" className="arcade-dock">
                  <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981' }}>
                        <span>🛡️</span>
                        <span>Zero Timer Pressure Options Available</span>
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
                        <span>✓</span>
                        <span>Full IAAP BoK Coverage (CPACC · WAS · ADS)</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#facc15' }}>
                        <span>🤖</span>
                        <span>4 AI Bot Personas Active</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-primary arcade-btn-primary"
                      onClick={() => { soundManager.playClick(); setSoloSubMode('CLASSIC'); }}
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
            )}

            {soloSubMode === 'CLASSIC' && (
              <PracticeMode onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'HOT_POTATO' && (
              <SoloHotPotato onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'GRAND_PRIX' && (
              <SoloGrandPrix onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'HIGH_ROLLER' && (
              <SoloHighRoller onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'FLAW_FINDER' && (
              <SoloFlawFinder onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'SABOTEUR' && (
              <SoloSaboteur onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'BOUNDARY_BRAWL' && (
              <SoloBoundaryBrawl onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'BOSS_RAID' && (
              <SoloBossRaid onBack={() => setSoloSubMode('MENU')} />
            )}
          </div>
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'LEADERBOARD' && (
          <div role="tabpanel" id="panel-leaderboard" aria-labelledby="tab-leaderboard">
            <WeeklyLeaderboard />
          </div>
        )}

        {/* TAB 4: MISSED QUESTIONS */}
        {activeTab === 'STUDY' && (
          <div role="tabpanel" id="panel-study" aria-labelledby="tab-study">
            <MissedQuestionsReview />
          </div>
        )}

        {/* TAB 5: QUESTION BANK */}
        {activeTab === 'EXPLORER' && (
          <div role="tabpanel" id="panel-explorer" aria-labelledby="tab-explorer">
            <QuestionBankExplorer />
          </div>
        )}
      </main>

      {/* Footer with A11y & Attribution */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <p>
          Built for workplace accessibility education based on <strong>Digital Accessibility IAAP Certifications (CPACC · WAS · ADS) Body of Knowledge</strong>.
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          Designed with ❤️ for screen readers, keyboard-only warriors, and high-contrast champions.
        </p>
      </footer>
    </div>
  );
}
