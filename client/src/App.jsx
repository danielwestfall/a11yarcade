import React, { useState } from 'react';
import A11yHeader from './components/A11yHeader';
import LiveMode from './components/LiveMode';
import PracticeMode from './components/PracticeMode';
import SoloHotPotato from './components/SoloHotPotato';
import SoloGrandPrix from './components/SoloGrandPrix';
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
              <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
                <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem 1.5rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖🎓</div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                    Solo Practice & AI Bot Tournaments
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
                    Play anytime on your own schedule. Sharpen your exam readiness solo or test your reflexes against simulated peers!
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                  {/* Option 1: Classic Solo Practice */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', border: '2px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Classic Self-Paced Practice</h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                        Zero timer pressure. Filter by Domains 1, 2, or 3 with detailed explanations and instant BoK citations.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => { soundManager.playClick(); setSoloSubMode('CLASSIC'); }}
                      style={{ width: '100%' }}
                    >
                      <span>Start Practice</span>
                    </button>
                  </div>

                  {/* Option 2: Solo Hot Potato with AI Peers */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', border: '2px solid #f59e0b' }}>
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥔🤖</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem' }}>Solo Hot Potato Syndicate</h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                        Play with 3 AI study peers (Ada, Devin, Jordan). Pass to bots or answer when drafted. Collect Social Dividends!
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => { soundManager.playClick(); setSoloSubMode('HOT_POTATO'); }}
                      style={{ width: '100%', background: '#d97706', borderColor: '#f59e0b' }}
                    >
                      <span>Play Hot Potato</span>
                    </button>
                  </div>

                  {/* Option 3: Solo Grand Prix with Bot Racers */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', border: '2px solid #ef4444' }}>
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏎️⚡</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', marginBottom: '0.5rem' }}>Solo Grand Prix Racer</h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                        Race against 3 AI ghost cars (Safe Sal, Balanced Bea, Turbo Tina) across a 100m sprint with gear shifts & pit stops!
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => { soundManager.playClick(); setSoloSubMode('GRAND_PRIX'); }}
                      style={{ width: '100%', background: '#dc2626', borderColor: '#ef4444' }}
                    >
                      <span>Start Grand Prix</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {soloSubMode === 'CLASSIC' && (
              <div>
                <button
                  type="button"
                  onClick={() => setSoloSubMode('MENU')}
                  style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  ← Back to Solo Hub
                </button>
                <PracticeMode />
              </div>
            )}

            {soloSubMode === 'HOT_POTATO' && (
              <SoloHotPotato onBack={() => setSoloSubMode('MENU')} />
            )}

            {soloSubMode === 'GRAND_PRIX' && (
              <SoloGrandPrix onBack={() => setSoloSubMode('MENU')} />
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
          Built for workplace accessibility education based on the <strong>IAAP CPACC Body of Knowledge</strong>.
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          Designed with ❤️ for screen readers, keyboard-only warriors, and high-contrast champions.
        </p>
      </footer>
    </div>
  );
}
