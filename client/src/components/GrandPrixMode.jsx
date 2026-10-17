import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Gauge,
  Flame,
  Wrench,
  AlertTriangle,
  Award,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  Flag
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

export default function GrandPrixMode({ socket, role, roomPin, onLeave }) {
  // Multiplayer State
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, RACING, PODIUM
  const [telemetry, setTelemetry] = useState({ players: [], commentary: '', raceLeaderId: null });
  const [podiumData, setPodiumData] = useState([]);
  const [targetDistance, setTargetDistance] = useState(100);

  // Player Dashboard State
  const [playerDistance, setPlayerDistance] = useState(0);
  const [playerGear, setPlayerGear] = useState(1);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [inPit, setInPit] = useState(false);
  const [pitTimeLeft, setPitTimeLeft] = useState(0);
  const [pitTotalTime, setPitTotalTime] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [allowPitStop, setAllowPitStop] = useState(true);
  const [answerFeedback, setAnswerFeedback] = useState(null); // { isCorrect, delta, explanation }
  const [hasFinished, setHasFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Race started
    socket.on('gp-race-started', (data) => {
      setGameState('RACING');
      setTargetDistance(data.targetDistance || 100);
      setPlayerDistance(0);
      setPlayerGear(1);
      setPlayerStreak(0);
      setInPit(false);
      setCurrentQuestion(null);
      setAnswerFeedback(null);
      setHasFinished(false);

      soundManager.playEngineRev();
      setLiveAnnouncement('The Grand Prix has started! Select your gear!');
    });

    // Telemetry updates
    socket.on('gp-telemetry-update', (data) => {
      setTelemetry(data);

      // Sync self state if in player list
      const self = data.players.find(p => p.id === socket.id);
      if (self) {
        setPlayerDistance(self.distance);
        setPlayerStreak(self.streak);
        if (self.finished) {
          setHasFinished(true);
        }
      }
    });

    // Question served
    socket.on('gp-question-served', (data) => {
      setCurrentQuestion(data.question);
      setPlayerGear(data.gear);
      setAllowPitStop(data.allowPitStop);
      setAnswerFeedback(null);
      setErrorMessage('');

      soundManager.playTick(1);
      setLiveAnnouncement(`Gear ${data.gear} selected. Question loaded.`);
    });

    // Pit stop ticks
    socket.on('gp-pit-tick', ({ pitTimeLeft }) => {
      setPitTimeLeft(pitTimeLeft);
      soundManager.playPitStop();
    });

    socket.on('gp-pit-complete', () => {
      setInPit(false);
      setPitTimeLeft(0);
      soundManager.playEngineRev();
      setLiveAnnouncement('Pit stop complete! Back on track.');
    });

    // Race finished
    socket.on('gp-race-finished', ({ podium, allPlayers }) => {
      setPodiumData(podium);
      setGameState('PODIUM');
      soundManager.playFanfare();
      confetti({ particleCount: 150, spread: 80 });
    });

    return () => {
      socket.off('gp-race-started');
      socket.off('gp-telemetry-update');
      socket.off('gp-question-served');
      socket.off('gp-pit-tick');
      socket.off('gp-pit-complete');
      socket.off('gp-race-finished');
    };
  }, [socket]);

  // Actions
  const handleSelectGear = (gear) => {
    if (inPit || hasFinished) return;
    setErrorMessage('');
    soundManager.playClick();

    socket.emit('gp-select-gear', { gear }, (res) => {
      if (res && !res.success) {
        setErrorMessage(res.error || 'Cannot select this gear.');
        soundManager.playIncorrect();
      }
    });
  };

  const handleSubmitAnswer = (choiceId) => {
    if (!currentQuestion) return;
    soundManager.playClick();

    socket.emit('gp-submit-answer', { choiceId }, (res) => {
      if (res && res.success) {
        setAnswerFeedback(res);
        setCurrentQuestion(null);

        if (res.isCorrect) {
          soundManager.playCorrect();
          if (res.streak % 3 === 0) {
            soundManager.playDriftBoost();
          }
        } else {
          soundManager.playSpinOut();
        }
      }
    });
  };

  const handleTakePitStop = () => {
    if (!currentQuestion || !allowPitStop) return;
    soundManager.playClick();

    socket.emit('gp-pit-stop', {}, (res) => {
      if (res && res.success) {
        setInPit(true);
        setPitTimeLeft(res.freezeTime);
        setPitTotalTime(res.freezeTime);
        setCurrentQuestion(null);
        soundManager.playPitStop();
      } else if (res && !res.success) {
        setErrorMessage(res.error || 'Pit stop unavailable.');
      }
    });
  };

  // Keyboard shortcut for answers & gears
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toUpperCase();

      // If choosing gear
      if (!currentQuestion && !inPit && !hasFinished) {
        if (key === '1') handleSelectGear(1);
        if (key === '2') handleSelectGear(2);
        if (key === '3') handleSelectGear(3);
      } else if (currentQuestion && !hasFinished) {
        if (key === '1' || key === 'A') handleSubmitAnswer('A');
        if (key === '2' || key === 'B') handleSubmitAnswer('B');
        if (key === '3' || key === 'C') handleSubmitAnswer('C');
        if (key === '4' || key === 'D') handleSubmitAnswer('D');
        if (key === 'P' || key === ' ') handleTakePitStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, inPit, hasFinished]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="assertive">
        {liveAnnouncement}
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: 'var(--bg-surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.6rem' }}>🏎️</span>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>The Grand Prix: Apex Gambler</h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>100m Strategic Sprint • Room PIN: <strong style={{ color: '#38bdf8' }}>{roomPin}</strong></span>
          </div>
        </div>

        {role === 'PLAYER' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56, 189, 248, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '9999px', border: '1px solid #38bdf8' }}>
              <Gauge size={16} color="#38bdf8" />
              <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>{playerDistance} / {targetDistance}m</span>
            </div>

            {playerStreak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '9999px', border: '1px solid #f59e0b' }}>
                <Flame size={16} color="#f59e0b" />
                <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.9rem' }}>Streak: {playerStreak}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 2D RACETRACK VISUALIZATION (VISIBLE ON HOST & PLAYER) */}
      {/* ==================================================== */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#090d16', border: '2px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
          <span>START (0m)</span>
          <span style={{ color: '#f59e0b' }}>🏁 Hairpin (25m)</span>
          <span style={{ color: '#38bdf8' }}>🌪️ Slipstream (50m)</span>
          <span style={{ color: '#ef4444' }}>⚡ Final Stretch (80m)</span>
          <span style={{ color: '#10b981' }}>🏆 FINISH (100m)</span>
        </div>

        {/* Milestone Tracks */}
        <div style={{ position: 'relative', background: '#111827', borderRadius: 'var(--radius-md)', padding: '0.5rem', overflow: 'hidden' }}>
          {/* Milestone Boundary Vertical Markers */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', width: '2px', background: 'rgba(245, 158, 11, 0.4)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(56, 189, 248, 0.4)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '80%', width: '2px', background: 'rgba(239, 68, 68, 0.4)', zIndex: 1 }} />

          {/* Racetrack Lanes */}
          {telemetry.players.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
              Waiting for drivers to start their engines...
            </div>
          ) : (
            telemetry.players.map((p, idx) => {
              const pct = Math.min(100, Math.max(0, (p.distance / targetDistance) * 100));
              const isSelf = p.id === socket?.id;

              return (
                <div
                  key={p.id}
                  style={{
                    position: 'relative',
                    height: '38px',
                    margin: '4px 0',
                    background: isSelf ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '6px',
                    border: isSelf ? '1px solid #38bdf8' : '1px solid #1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px'
                  }}
                >
                  {/* Name tag */}
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelf ? '#38bdf8' : '#e2e8f0', minWidth: '100px', whiteSpace: 'nowrap', zIndex: 2 }}>
                    P{p.rank} {p.nickname} {p.inPit ? '🔧' : ''}
                  </span>

                  {/* Car progress icon */}
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
                    <span>{p.avatar || '🏎️'}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#000000', color: '#ffffff', padding: '1px 4px', borderRadius: '4px' }}>
                      {p.distance}m
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live Race Commentary Ticker */}
        {telemetry.commentary && (
          <div style={{ marginTop: '0.75rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '3px solid #38bdf8' }}>
            <span style={{ fontWeight: 800, color: '#38bdf8' }}>BROADCAST:</span>
            <span>{telemetry.commentary}</span>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 0. LOBBY VIEW */}
      {/* ==================================================== */}
      {gameState === 'LOBBY' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏎️🏁</div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Engines Idling on the Starting Grid!
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Waiting for the green flag. Get ready to shift gears (1st, 2nd, 3rd) and watch out for the 25m Hairpin Turn!
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.9rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span>Ready in Room PIN: {roomPin}</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* RACER CONTROLLER DASHBOARD (PLAYER VIEW) */}
      {/* ==================================================== */}
      {role === 'PLAYER' && gameState === 'RACING' && (
        <div>
          {/* Pit Stop Freeze Screen */}
          {inPit && (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔧⏱️</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444', marginBottom: '0.5rem' }}>
                IN THE PIT LANE (FROZEN)
              </h3>
              <p style={{ color: '#fca5a5', marginBottom: '1.5rem' }}>
                You successfully passed and avoided meter loss, but tires are being changed!
              </p>

              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
                {pitTimeLeft}s
              </div>

              <div style={{ width: '100%', maxWidth: '400px', height: '10px', background: '#334155', borderRadius: '9999px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#ef4444', width: `${((pitTotalTime - pitTimeLeft) / pitTotalTime) * 100}%`, transition: 'width 1s linear' }} />
              </div>
            </div>
          )}

          {/* Finished Screen */}
          {hasFinished && (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏁🏆</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399' }}>
                RACE COMPLETED!
              </h3>
              <p style={{ color: '#a7f3d0', fontSize: '1.1rem' }}>
                You have crossed the finish line! Watch the big screen as other drivers complete the course.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              {errorMessage}
            </div>
          )}

          {/* Stage 1: Gear Selection */}
          {!currentQuestion && !inPit && !hasFinished && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                ⚙️ Choose Your Next Gear
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Higher gears grant turbo acceleration, but spun-out wrong answers slide you backwards!
              </p>

              {/* Warning for Hairpin Turn */}
              {playerDistance >= 25 && playerDistance < 35 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontWeight: 700, display: 'inline-block' }}>
                  ⚠️ Hairpin Turn Active! 3rd Gear is locked out.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {/* 1st Gear */}
                <button
                  type="button"
                  className="card"
                  onClick={() => handleSelectGear(1)}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '2px solid #059669',
                    padding: '1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>1st Gear (Safe)</span>
                    <span style={{ background: '#059669', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>Easy</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                    +10m / -10m
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Pit Stop freeze: 5s • Quick facts & standard acronyms
                  </div>
                </button>

                {/* 2nd Gear */}
                <button
                  type="button"
                  className="card"
                  onClick={() => handleSelectGear(2)}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '2px solid #d97706',
                    padding: '1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>2nd Gear (Cruise)</span>
                    <span style={{ background: '#d97706', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>Medium</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                    +25m / -25m
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Pit Stop freeze: 10s • Multi-factor scenarios & models
                  </div>
                </button>

                {/* 3rd Gear */}
                <button
                  type="button"
                  disabled={playerDistance >= 25 && playerDistance < 35}
                  onClick={() => handleSelectGear(3)}
                  className="card"
                  style={{
                    background: playerDistance >= 25 && playerDistance < 35 ? 'rgba(51, 65, 85, 0.4)' : 'var(--bg-surface-elevated)',
                    border: `2px solid ${playerDistance >= 25 && playerDistance < 35 ? '#475569' : '#e11d48'}`,
                    padding: '1.5rem',
                    textAlign: 'left',
                    cursor: playerDistance >= 25 && playerDistance < 35 ? 'not-allowed' : 'pointer',
                    opacity: playerDistance >= 25 && playerDistance < 35 ? 0.5 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f43f5e' }}>3rd Gear (Turbo)</span>
                    <span style={{ background: '#e11d48', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>Hard</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                    +50m / -50m
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Pit Stop freeze: 20s • Tricky regulatory edge cases
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Question Active */}
          {currentQuestion && !inPit && !hasFinished && (
            <div>
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ background: '#38bdf8', color: '#000000', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    Gear {playerGear} • {playerGear === 1 ? 'Safe (+10m)' : playerGear === 2 ? 'Cruise (+25m)' : 'Turbo (+50m)'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {currentQuestion.domainName}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.5rem' }}>
                  {currentQuestion.question}
                </h3>

                {/* Choices */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {currentQuestion.choices.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSubmitAnswer(c.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface-elevated)',
                        color: '#ffffff',
                        border: '2px solid var(--border-color)',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      <span style={{ background: 'rgba(0,0,0,0.3)', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 900 }}>
                        {SHAPE_ICONS[c.shape] || c.id}
                      </span>
                      <span>{c.text}</span>
                    </button>
                  ))}
                </div>

                {/* Emergency Pit Stop Pass Button */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Unsure or suspect a trap? Take the Pit Stop to save your meters.
                  </div>

                  <button
                    type="button"
                    disabled={!allowPitStop}
                    onClick={handleTakePitStop}
                    style={{
                      background: allowPitStop ? 'rgba(239, 68, 68, 0.2)' : 'rgba(51, 65, 85, 0.5)',
                      color: allowPitStop ? '#fca5a5' : '#64748b',
                      border: `1px solid ${allowPitStop ? '#ef4444' : '#475569'}`,
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      cursor: allowPitStop ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Wrench size={16} />
                    <span>{allowPitStop ? `Take Pit Stop (${playerGear === 1 ? '5s' : playerGear === 2 ? '10s' : '20s'} Freeze)` : 'Pit Closed on Final Stretch'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback after answer */}
          {answerFeedback && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderLeft: `4px solid ${answerFeedback.isCorrect ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: answerFeedback.isCorrect ? '#34d399' : '#f87171', marginBottom: '0.5rem' }}>
                {answerFeedback.isCorrect ? `✓ Clean Shift! +${answerFeedback.delta} Meters!` : `💥 Spun Out! ${answerFeedback.delta} Meters!`}
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {answerFeedback.explanation}
              </p>
              {answerFeedback.funNote && (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                  💡 {answerFeedback.funNote}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* PODIUM FINISH */}
      {/* ==================================================== */}
      {gameState === 'PODIUM' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🏎️</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Grand Prix Apex Winners!
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
            Calculated gearing and shrewd pit lane strategy take the championship podium!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {podiumData.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: `2px solid ${idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#b45309'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  minWidth: '180px',
                  order: idx === 0 ? 2 : idx === 1 ? 1 : 3
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{p.avatar}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{p.nickname}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: idx === 0 ? '#fbbf24' : '#f8fafc', marginTop: '0.5rem' }}>
                  {p.distance}m
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem', fontWeight: 700 }}>
                  {idx === 0 ? '🥇 Grand Champion' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onLeave}
            style={{ padding: '0.75rem 2rem' }}
          >
            <RotateCcw size={18} />
            <span>Return to Lobby</span>
          </button>
        </div>
      )}
    </div>
  );
}
