import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import A11yHeader from './components/A11yHeader';
import SoloArcadeHub from './components/SoloArcadeHub';
import { Users, GraduationCap, Trophy, BookOpen, Library, Bot, Loader2 } from 'lucide-react';
import { soundManager } from './utils/sound';

// Lazy-load game modes and heavy sub-views to optimize bundle size and startup performance
const LiveMode = lazy(() => import('./components/LiveMode'));
const PracticeMode = lazy(() => import('./components/PracticeMode'));
const SoloHotPotato = lazy(() => import('./components/SoloHotPotato'));
const SoloGrandPrix = lazy(() => import('./components/SoloGrandPrix'));
const SoloHighRoller = lazy(() => import('./components/SoloHighRoller'));
const SoloFlawFinder = lazy(() => import('./components/SoloFlawFinder'));
const SoloSaboteur = lazy(() => import('./components/SoloSaboteur'));
const SoloBoundaryBrawl = lazy(() => import('./components/SoloBoundaryBrawl'));
const SoloBossRaid = lazy(() => import('./components/SoloBossRaid'));
const WeeklyLeaderboard = lazy(() => import('./components/WeeklyLeaderboard'));
const MissedQuestionsReview = lazy(() => import('./components/MissedQuestionsReview'));
const QuestionBankExplorer = lazy(() => import('./components/QuestionBankExplorer'));
const LearningModulesAcademy = lazy(() => import('./components/academy/LearningModulesAcademy'));

const NAV_TABS = [
  { id: 'ACADEMY', tabId: 'tab-academy', panelId: 'panel-academy', label: 'Learning Modules', title: 'Learning Modules Academy', Icon: GraduationCap },
  { id: 'LIVE', tabId: 'tab-live', panelId: 'panel-live', label: 'Live Meeting Mode', title: 'Live Meeting Mode', Icon: Users },
  { id: 'SOLO_HUB', tabId: 'tab-solo', panelId: 'panel-solo', label: 'Solo & AI Bots', title: 'Solo Drills & AI Cadets', Icon: Bot },
  { id: 'LEADERBOARD', tabId: 'tab-leaderboard', panelId: 'panel-leaderboard', label: 'Leaderboard', title: 'Weekly Leaderboard', Icon: Trophy },
  { id: 'STUDY', tabId: 'tab-study', panelId: 'panel-study', label: 'Missed Questions', title: 'Missed Questions Review', Icon: BookOpen },
  { id: 'EXPLORER', tabId: 'tab-explorer', panelId: 'panel-explorer', label: 'Question Bank', title: 'Question Bank Explorer', Icon: Library }
];

function ModeLoadingFallback({ label = 'Loading module...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '280px',
        gap: '1rem',
        color: 'var(--text-muted)',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.9rem'
      }}
    >
      <Loader2 size={32} className="animate-spin" color="var(--arcade-cyan)" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('ACADEMY');
  const [soloSubMode, setSoloSubMode] = useState('MENU');
  const tabRefs = useRef([]);

  // WCAG 2.4.2 Page Titled: Keep document.title synchronized with active SPA view
  useEffect(() => {
    const current = NAV_TABS.find((t) => t.id === activeTab);
    if (current) {
      document.title = `${current.title} | A11y Arcade`;
    }
  }, [activeTab, soloSubMode]);

  const handleTabChange = (tab) => {
    soundManager.playClick();
    setActiveTab(tab);
    if (tab === 'SOLO_HUB') {
      setSoloSubMode('MENU');
    }
  };

  // WAI-ARIA APG 1.2 Roving TabIndex Keyboard Navigation for Main Mode Tabs
  const handleTabKeyDown = (e, idx) => {
    const count = NAV_TABS.length;
    let nextIdx = idx;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIdx = (idx + 1) % count;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIdx = (idx - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = count - 1;
    }

    if (nextIdx !== idx) {
      const nextTab = NAV_TABS[nextIdx];
      handleTabChange(nextTab.id);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <div className="app-container">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only"
        style={{
          position: 'fixed',
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
      >
        Skip to main game content
      </a>

      {/* Global Header & A11y Toolbar */}
      <A11yHeader activeMode={activeTab} setActiveMode={setActiveTab} />

      {/* Primary Navigation Landmark containing WAI-ARIA Tablist */}
      <nav aria-label="Primary Game Mode">
        <div role="tablist" aria-label="Game Modes" className="mode-tabs">
          {NAV_TABS.map((tab, idx) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                type="button"
                role="tab"
                id={tab.tabId}
                aria-selected={isSelected}
                aria-controls={tab.panelId}
                tabIndex={isSelected ? 0 : -1}
                className={`mode-tab ${isSelected ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area (tabIndex=-1 allows programmatic skip-link focus) */}
      <main id="main-content" className="main-stage" tabIndex={-1}>
        <Suspense fallback={<ModeLoadingFallback label="Loading game cartridge..." />}>
          {/* TAB 1: LEARNING MODULES ACADEMY */}
          <div role="tabpanel" id="panel-academy" aria-labelledby="tab-academy" tabIndex={0} hidden={activeTab !== 'ACADEMY'}>
            {activeTab === 'ACADEMY' && <LearningModulesAcademy />}
          </div>

          {/* TAB 2: LIVE MEETING MODE */}
          <div role="tabpanel" id="panel-live" aria-labelledby="tab-live" tabIndex={0} hidden={activeTab !== 'LIVE'}>
            {activeTab === 'LIVE' && <LiveMode />}
          </div>

          {/* TAB 3: SOLO & AI BOT MODES */}
          <div role="tabpanel" id="panel-solo" aria-labelledby="tab-solo" tabIndex={0} hidden={activeTab !== 'SOLO_HUB'}>
            {activeTab === 'SOLO_HUB' && (
              <>
                {soloSubMode === 'MENU' && <SoloArcadeHub onSelectMode={setSoloSubMode} />}
                {soloSubMode === 'CLASSIC' && <PracticeMode onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'HOT_POTATO' && <SoloHotPotato onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'GRAND_PRIX' && <SoloGrandPrix onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'HIGH_ROLLER' && <SoloHighRoller onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'FLAW_FINDER' && <SoloFlawFinder onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'SABOTEUR' && <SoloSaboteur onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'BOUNDARY_BRAWL' && <SoloBoundaryBrawl onBack={() => setSoloSubMode('MENU')} />}
                {soloSubMode === 'BOSS_RAID' && <SoloBossRaid onBack={() => setSoloSubMode('MENU')} />}
              </>
            )}
          </div>

          {/* TAB 4: LEADERBOARD */}
          <div role="tabpanel" id="panel-leaderboard" aria-labelledby="tab-leaderboard" tabIndex={0} hidden={activeTab !== 'LEADERBOARD'}>
            {activeTab === 'LEADERBOARD' && <WeeklyLeaderboard />}
          </div>

          {/* TAB 5: MISSED QUESTIONS */}
          <div role="tabpanel" id="panel-study" aria-labelledby="tab-study" tabIndex={0} hidden={activeTab !== 'STUDY'}>
            {activeTab === 'STUDY' && <MissedQuestionsReview />}
          </div>

          {/* TAB 6: QUESTION BANK */}
          <div role="tabpanel" id="panel-explorer" aria-labelledby="tab-explorer" tabIndex={0} hidden={activeTab !== 'EXPLORER'}>
            {activeTab === 'EXPLORER' && <QuestionBankExplorer />}
          </div>
        </Suspense>
      </main>

      {/* Footer with A11y & Attribution */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <p>
          Built for workplace accessibility education based on <strong>Digital Accessibility IAAP Certifications (CPACC · WAS · ADS) Body of Knowledge</strong>.
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          Designed with <span aria-hidden="true">❤️</span><span className="sr-only">love</span> for screen readers, keyboard-only warriors, and high-contrast champions.
        </p>
      </footer>
    </div>
  );
}
