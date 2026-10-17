import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gauge, Flame, Wrench, RotateCcw, ArrowRight, Zap, Trophy, Shield } from 'lucide-react';
import { soundManager } from '../utils/sound';
import rawQuestions from '../data/questions.json';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

const BOT_RACERS = [
  { id: 'bot-sal', nickname: 'Safe Sal', avatar: '🚗', gear: 1, dist: 0, streak: 0, inPit: false },
  { id: 'bot-bea', nickname: 'Balanced Bea', avatar: '🏎️', gear: 2, dist: 0, streak: 0, inPit: false },
  { id: 'bot-tina', nickname: 'Turbo Tina', avatar: '🚀', gear: 3, dist: 0, streak: 0, inPit: false }
];

export default function SoloGrandPrix({ onBack }) {
  const [playerDist, setPlayerDist] = useState(0);
  const [playerGear, setPlayerGear] = useState(1);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [inPit, setInPit] = useState(false);
  const [pitTimeLeft, setPitTimeLeft] = useState(0);
  const [pitTotalTime, setPitTotalTime] = useState(10);
  const [bots, setBots] = useState(BOT_RACERS);
  const [currentQ, setCurrentQ] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [raceFinished, setRaceFinished] = useState(false);
  const [commentary, setCommentary] = useState('🚦 Green flag! Choose your gear and race to 100 meters!');

  // Pit Stop countdown
  useEffect(() => {
    if (!inPit) return;
    const interval = setInterval(() => {
      setPitTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setInPit(false);
          soundManager.playEngineRev();
          setCommentary('🔧 Fresh tires fitted! Back on track.');
          return 0;
        }
        soundManager.playPitStop();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [inPit]);

  const selectGear = (gear) => {
    if (inPit || raceFinished) return;
    soundManager.playClick();
    setPlayerGear(gear);

    // Pick question matching gear difficulty
    const targetDiff = gear === 1 ? 'easy' : gear === 2 ? 'medium' : 'hard';
    let pool = rawQuestions.filter(q => q.difficulty === targetDiff);
    if (pool.length === 0) pool = rawQuestions;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    setCurrentQ(chosen);
    setFeedback(null);
    soundManager.playTick(1);
  };

  const handleAnswer = (choiceId) => {
    if (!currentQ) return;
    soundManager.playClick();

    const correctChoice = currentQ.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    const baseReward = playerGear === 1 ? 10 : playerGear === 2 ? 25 : 50;
    let delta = isCorrect ? baseReward : -baseReward;

    // Slipstream at meter 50+
    const maxBotDist = Math.max(...bots.map(b => b.dist));
    let slipstream = false;
    if (isCorrect && playerDist >= 50 && (maxBotDist - playerDist <= 15) && (maxBotDist - playerDist > 0)) {
      delta = Math.round(delta * 1.5);
      slipstream = true;
    }

    // Drift streak
    let drift = false;
    let newStreak = playerStreak;
    if (isCorrect) {
      newStreak += 1;
      if (newStreak % 3 === 0) {
        delta += 10;
        drift = true;
      }
    } else {
      newStreak = 0;
    }

    const newDist = Math.max(0, playerDist + delta);
    setPlayerDist(newDist);
    setPlayerStreak(newStreak);

    if (isCorrect) {
      soundManager.playCorrect();
      if (drift) soundManager.playDriftBoost();
    } else {
      soundManager.playSpinOut();
    }

    // Advance simulated bot racers
    advanceBots();

    setFeedback({
      isCorrect,
      delta,
      explanation: currentQ.explanation,
      funNote: currentQ.funNote
    });
    setCurrentQ(null);

    // Check race completion
    if (newDist >= 100) {
      setRaceFinished(true);
      soundManager.playFanfare();
      confetti({ particleCount: 150 });
      setCommentary('🏁 Checkered flag! You crossed 100m!');
    }
  };

  const handlePitStop = () => {
    if (!currentQ || playerDist >= 80) return;
    const freeze = playerGear === 1 ? 5 : playerGear === 2 ? 10 : 20;
    setInPit(true);
    setPitTimeLeft(freeze);
    setPitTotalTime(freeze);
    setCurrentQ(null);
    soundManager.playPitStop();
    setCommentary(`🔧 You pulled into the Pit Lane (Frozen for ${freeze}s)!`);

    // Bots still advance while you pit
    advanceBots();
  };

  const advanceBots = () => {
    setBots(prev => prev.map(b => {
      let bDelta = 0;
      if (b.id === 'bot-sal') {
        // Safe: 80% correct on 10m
        bDelta = Math.random() < 0.8 ? 10 : -10;
      } else if (b.id === 'bot-bea') {
        // Balanced: 65% correct on 25m
        bDelta = Math.random() < 0.65 ? 25 : -25;
      } else {
        // Turbo: 50% correct on 50m
        bDelta = Math.random() < 0.5 ? 50 : -50;
      }
      const updated = Math.max(0, b.dist + bDelta);
      if (updated >= 100 && !raceFinished) {
        setRaceFinished(true);
        setCommentary(`🏁 ${b.nickname} crossed the finish line!`);
      }
      return { ...b, dist: updated };
    }));
  };

  // Combine all 4 racers for the leaderboard
  const allRacers = [
    { id: 'player', nickname: 'You (Player)', avatar: '👤', dist: playerDist, isPlayer: true },
    ...bots
  ].sort((a, b) => b.dist - a.dist);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: 'var(--bg-surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏎️💨</span>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Solo Grand Prix (AI Bot Racers)</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>100m Sprint Course • Practice Anytime</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#94a3b8', padding: '0.35rem 0.8rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Exit Race
        </button>
      </div>

      {/* 2D RACETRACK */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#090d16', border: '2px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
          <span>START (0m)</span>
          <span style={{ color: '#f59e0b' }}>🏁 Hairpin (25m)</span>
          <span style={{ color: '#38bdf8' }}>🌪️ Slipstream (50m)</span>
          <span style={{ color: '#ef4444' }}>⚡ Final Stretch (80m)</span>
          <span style={{ color: '#10b981' }}>🏆 FINISH (100m)</span>
        </div>

        <div style={{ position: 'relative', background: '#111827', borderRadius: 'var(--radius-md)', padding: '0.5rem', overflow: 'hidden' }}>
          {/* Vertical markers */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: '2px', background: 'rgba(245, 158, 11, 0.4)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(56, 189, 248, 0.4)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '80%', width: '2px', background: 'rgba(239, 68, 68, 0.4)', zIndex: 1 }} />

          {allRacers.map((r, idx) => {
            const pct = Math.min(100, Math.max(0, (r.dist / 100) * 100));
            return (
              <div
                key={r.id}
                style={{
                  position: 'relative',
                  height: '38px',
                  margin: '4px 0',
                  background: r.isPlayer ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '6px',
                  border: r.isPlayer ? '1px solid #38bdf8' : '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: r.isPlayer ? '#38bdf8' : '#e2e8f0', minWidth: '100px', whiteSpace: 'nowrap', zIndex: 2 }}>
                  #{idx + 1} {r.nickname}
                </span>

                <div
                  style={{
                    position: 'absolute',
                    left: `calc(${pct}% - 16px)`,
                    transition: 'left 0.4s ease-out',
                    fontSize: '1.4rem',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span>{r.avatar}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#000000', color: '#ffffff', padding: '1px 4px', borderRadius: '4px' }}>
                    {r.dist}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commentary Ticker */}
        <div style={{ marginTop: '0.75rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#f8fafc', borderLeft: '3px solid #38bdf8' }}>
          <strong>BROADCAST:</strong> {commentary}
        </div>
      </div>

      {/* DASHBOARD CONTROLLER */}
      {!raceFinished ? (
        <div>
          {/* Pit Stop Screen */}
          {inPit && (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔧⏱️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>IN THE PIT LANE (FROZEN)</h3>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', margin: '1rem 0' }}>{pitTimeLeft}s</div>
              <div style={{ width: '100%', maxWidth: '350px', height: '8px', background: '#334155', borderRadius: '9999px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#ef4444', width: `${((pitTotalTime - pitTimeLeft) / pitTotalTime) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Gear Selection */}
          {!currentQ && !inPit && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>⚙️ Choose Your Gear</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Position: {playerDist}m / 100m • Streak: {playerStreak}
              </p>

              {playerDist >= 25 && playerDist < 35 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontWeight: 700 }}>
                  ⚠️ Hairpin Turn Active! 3rd Gear is locked out.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => selectGear(1)}
                  className="card"
                  style={{ background: 'var(--bg-surface-elevated)', border: '2px solid #059669', padding: '1.25rem', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.1rem' }}>1st Gear (Safe)</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>+10m / -10m</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Easy • 5s Pit freeze</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectGear(2)}
                  className="card"
                  style={{ background: 'var(--bg-surface-elevated)', border: '2px solid #d97706', padding: '1.25rem', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.1rem' }}>2nd Gear (Cruise)</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>+25m / -25m</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Medium • 10s Pit freeze</div>
                </button>

                <button
                  type="button"
                  disabled={playerDist >= 25 && playerDist < 35}
                  onClick={() => selectGear(3)}
                  className="card"
                  style={{
                    background: playerDist >= 25 && playerDist < 35 ? 'rgba(51, 65, 85, 0.4)' : 'var(--bg-surface-elevated)',
                    border: `2px solid ${playerDist >= 25 && playerDist < 35 ? '#475569' : '#e11d48'}`,
                    padding: '1.25rem',
                    textAlign: 'left',
                    cursor: playerDist >= 25 && playerDist < 35 ? 'not-allowed' : 'pointer',
                    opacity: playerDist >= 25 && playerDist < 35 ? 0.5 : 1
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#f43f5e', fontSize: '1.1rem' }}>3rd Gear (Turbo)</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>+50m / -50m</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hard • 20s Pit freeze</div>
                </button>
              </div>
            </div>
          )}

          {/* Question Active */}
          {currentQ && !inPit && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ background: '#38bdf8', color: '#000000', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Gear {playerGear}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{currentQ.domainName}</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.25rem' }}>
                {currentQ.question}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {currentQ.choices.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAnswer(c.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-elevated)',
                      color: '#ffffff',
                      border: '2px solid var(--border-color)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ background: 'rgba(0,0,0,0.3)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '1rem', fontWeight: 900 }}>
                      {SHAPE_ICONS[c.shape] || c.id}
                    </span>
                    <span>{c.text}</span>
                  </button>
                ))}
              </div>

              {/* Pit Lane Pass button */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Unsure? Pit stop saves your distance!</span>
                <button
                  type="button"
                  disabled={playerDist >= 80}
                  onClick={handlePitStop}
                  style={{
                    background: playerDist >= 80 ? 'rgba(51, 65, 85, 0.4)' : 'rgba(239, 68, 68, 0.2)',
                    color: playerDist >= 80 ? '#64748b' : '#fca5a5',
                    border: `1px solid ${playerDist >= 80 ? '#475569' : '#ef4444'}`,
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    cursor: playerDist >= 80 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Wrench size={16} />
                  <span>{playerDist >= 80 ? 'Pit Closed on Straightaway' : `Take Pit Stop (${playerGear === 1 ? '5s' : playerGear === 2 ? '10s' : '20s'})`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="card" style={{ padding: '1.25rem', marginTop: '1rem', borderLeft: `4px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontWeight: 800, color: feedback.isCorrect ? '#34d399' : '#f87171', marginBottom: '0.25rem' }}>
                {feedback.isCorrect ? `✓ Clean Shift! +${feedback.delta}m` : `💥 Spun Out! ${feedback.delta}m`}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>
                {feedback.explanation}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Podium View */
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏁🏆</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Grand Prix Finished!</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', maxWidth: '600px', margin: '2rem auto' }}>
            {allRacers.map((r, idx) => (
              <div key={r.id} style={{ background: 'var(--bg-surface-elevated)', border: `2px solid ${idx === 0 ? '#fbbf24' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{r.avatar}</div>
                <div style={{ fontWeight: 800 }}>{r.nickname}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: idx === 0 ? '#fbbf24' : '#38bdf8' }}>{r.dist}m</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{idx === 0 ? '🥇 Champion' : `#${idx + 1}`}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onBack}
            style={{ padding: '0.75rem 2rem' }}
          >
            <RotateCcw size={18} />
            <span>Return to Menu</span>
          </button>
        </div>
      )}
    </div>
  );
}
