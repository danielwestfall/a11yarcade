import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Crosshair,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function FlawFinderMode({ socket, role, roomPin, onLeave }) {
  const [stage, setStage] = useState('WAITING'); // 'WAITING', 'SNIPING', 'HEATMAP', 'PODIUM'
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [totalScenarios, setTotalScenarios] = useState(5);
  const [timerLeft, setTimerLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(30);
  const [snipesLocked, setSnipesLocked] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Player state
  const [selectedSentenceId, setSelectedSentenceId] = useState(null);
  const [isSnipeLocked, setIsSnipeLocked] = useState(false);
  const [myResult, setMyResult] = useState(null);

  // Reveal / Heatmap state
  const [revealData, setRevealData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [podiumData, setPodiumData] = useState([]);
  const [activeDebriefSentenceId, setActiveDebriefSentenceId] = useState(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleRoundStarted = (data) => {
      setCurrentScenario(data.scenario);
      setScenarioIndex(data.scenarioIndex);
      setTotalScenarios(data.totalScenarios);
      setTimerLeft(data.timeLimit);
      setTotalTime(data.timeLimit);
      setTotalPlayers(data.totalPlayers);
      setSnipesLocked(0);
      setStage('SNIPING');

      // Reset player selections
      setSelectedSentenceId(null);
      setIsSnipeLocked(false);
      setMyResult(null);
      setRevealData(null);
      setActiveDebriefSentenceId(null);

      soundManager.playTick(1);
      setLiveAnnouncement(`New Scenario: ${data.scenario.title}. Scan the document and find the critical flaw.`);
    };

    const handleTimerTick = ({ timeLeft }) => {
      setTimerLeft(timeLeft);
      if (timeLeft <= 5 && timeLeft > 0) {
        soundManager.playTick(2);
        if (timeLeft === 5) {
          setLiveAnnouncement('5 seconds remaining to lock in your snipe!');
        }
      }
    };

    const handleSnipeCount = ({ snipesLocked: locked, totalPlayers: total }) => {
      setSnipesLocked(locked);
      if (typeof total === 'number') setTotalPlayers(total);
    };

    const handleHeatmapReveal = (data) => {
      setRevealData(data);
      setLeaderboard(data.leaderboard);
      setStage('HEATMAP');
      setActiveDebriefSentenceId(data.flawedSentenceId);

      // Check personal result
      const me = data.results.find(r => r.id === socket.id);
      if (me) {
        setMyResult(me);
        if (me.isCorrect) {
          soundManager.playDirectHit();
          setLiveAnnouncement(`Direct hit! Flaw located. You earned ${me.roundPoints} points!`);
        } else {
          soundManager.playIncorrect();
          setLiveAnnouncement(`Misfire! You did not locate the flaw.`);
        }
      } else {
        soundManager.playClick();
      }
    };

    const handleGameFinished = ({ podium, allPlayers }) => {
      setPodiumData(podium);
      setLeaderboard(allPlayers);
      setStage('PODIUM');
      soundManager.playFanfare();

      const isReducedMotion = document.body.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion && typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    };

    socket.on('ff-round-started', handleRoundStarted);
    socket.on('timer-tick', handleTimerTick);
    socket.on('ff-snipe-count', handleSnipeCount);
    socket.on('ff-heatmap-reveal', handleHeatmapReveal);
    socket.on('ff-game-finished', handleGameFinished);

    return () => {
      socket.off('ff-round-started', handleRoundStarted);
      socket.off('timer-tick', handleTimerTick);
      socket.off('ff-snipe-count', handleSnipeCount);
      socket.off('ff-heatmap-reveal', handleHeatmapReveal);
      socket.off('ff-game-finished', handleGameFinished);
    };
  }, [socket]);

  // Player action: Select sentence
  const handleSelectSentence = (sentenceId) => {
    if (isSnipeLocked || stage !== 'SNIPING') return;
    soundManager.playClick();
    setSelectedSentenceId(sentenceId);
  };

  // Player action: Lock in Snipe
  const handleLockInSnipe = () => {
    if (!selectedSentenceId || isSnipeLocked || stage !== 'SNIPING') return;
    soundManager.playSnipeLock();
    setIsSnipeLocked(true);

    if (navigator.vibrate) {
      navigator.vibrate([30, 40, 50]);
    }

    socket.emit('ff-submit-snipe', { sentenceId: selectedSentenceId }, (res) => {
      if (!res?.success) {
        console.error('Snipe submission failed:', res?.error);
        setIsSnipeLocked(false);
      }
    });
  };

  // Host Action: Next Stage
  const handleHostNext = () => {
    if (!socket || role !== 'HOST') return;
    soundManager.playClick();
    socket.emit('next-stage');
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage !== 'SNIPING' || role !== 'PLAYER' || isSnipeLocked) return;
      if (!currentScenario?.sentences) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= currentScenario.sentences.length) {
        const target = currentScenario.sentences[num - 1];
        if (target) {
          handleSelectSentence(target.id);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (selectedSentenceId && !isSnipeLocked) {
          handleLockInSnipe();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, role, isSnipeLocked, currentScenario, selectedSentenceId]);

  // ==========================================
  // VIEW: WAITING LOBBY (HOST & PLAYER)
  // ==========================================
  if (stage === 'WAITING') {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎯🔍</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#38bdf8' }}>
          Flaw Finder: Heatmap Sniping
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {role === 'HOST'
            ? 'Waiting for game to launch. Click "Start Game" on your control console when all snipers are ready!'
            : 'Get your crosshairs ready! You will read real-world accessibility policies and snipe the single critical legal or technical loophole.'}
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#334155', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.9rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
          <span>Room PIN: <strong>{roomPin}</strong></span>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: FINAL PODIUM
  // ==========================================
  if (stage === 'PODIUM') {
    const gold = podiumData[0];
    const silver = podiumData[1];
    const bronze = podiumData[2];

    return (
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🎯</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Flaw Finder Master Snipers!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Tournament Complete! Outstanding policy precision and regulatory scrutiny.
        </p>

        <div className="podium-container" style={{ marginBottom: '2.5rem' }}>
          {/* 2nd place (Silver) */}
          <div className="podium-column">
            {silver && (
              <>
                <div style={{ fontSize: '2.5rem' }}>{silver.avatar}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{silver.nickname}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {silver.score} pts
                </div>
                <div className="podium-box silver">2nd</div>
              </>
            )}
          </div>

          {/* 1st place (Gold) */}
          <div className="podium-column">
            {gold && (
              <>
                <div style={{ fontSize: '3.5rem' }}>👑 {gold.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{gold.nickname}</div>
                <div style={{ fontSize: '0.95rem', color: '#fef08a', marginBottom: '0.5rem' }}>
                  {gold.score} pts
                </div>
                <div className="podium-box gold">1st</div>
              </>
            )}
          </div>

          {/* 3rd place (Bronze) */}
          <div className="podium-column">
            {bronze && (
              <>
                <div style={{ fontSize: '2.5rem' }}>{bronze.avatar}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{bronze.nickname}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {bronze.score} pts
                </div>
                <div className="podium-box bronze">3rd</div>
              </>
            )}
          </div>
        </div>

        <button type="button" className="btn-secondary" onClick={onLeave}>
          <RotateCcw size={18} />
          <span>Return to Mode Selection</span>
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW: HOST SCREEN (Sniping & Heatmap Reveal)
  // ==========================================
  if (role === 'HOST') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        {/* Top Control Bar */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: '#0284c7', color: '#ffffff', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem' }}>
                Scenario {scenarioIndex + 1} of {totalScenarios}
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                Domain {currentScenario?.domain}: {currentScenario?.domainName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {stage === 'SNIPING' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 700 }}>
                    <Crosshair size={18} color="#38bdf8" />
                    <span>{snipesLocked} / {totalPlayers} Snipers Locked</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.4rem', fontWeight: 900, color: timerLeft <= 5 ? '#ef4444' : '#38bdf8' }}>
                    <Clock size={20} />
                    <span>{timerLeft}s</span>
                  </div>
                </>
              )}

              {stage === 'HEATMAP' && (
                <button type="button" className="btn-primary" onClick={handleHostNext} style={{ padding: '0.6rem 1.4rem' }}>
                  <span>{revealData?.isLastScenario ? 'View Final Results' : 'Next Scenario'}</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Deadshot Alert Banner */}
        {stage === 'HEATMAP' && revealData?.deadshotTriggered && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.25), rgba(245, 158, 11, 0.15))',
            border: '2px solid #eab308',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Zap size={28} color="#facc15" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fef08a' }}>
                ⚡ DEADSHOT BONUS TRIGGERED!
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                Most snipers fell for compliant boilerplate clauses. Certified snipers earned <strong>+300 PTS</strong> for finding the subtle loophole!
              </div>
            </div>
          </div>
        )}

        {/* Scenario Document Viewer */}
        <div style={{ display: 'grid', gridTemplateColumns: stage === 'HEATMAP' ? '2.2fr 1fr' : '1fr', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                <BookOpen size={16} />
                <span>{currentScenario?.topic}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                {currentScenario?.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                💡 Premise: {currentScenario?.context}
              </p>
            </div>

            {/* Document Paragraphs & Heatmap overlay */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(stage === 'HEATMAP' ? revealData?.heatmap : currentScenario?.sentences)?.map((sentence, idx) => {
                const isFlaw = stage === 'HEATMAP' && sentence.isFlaw;
                const votes = stage === 'HEATMAP' ? sentence.votes : 0;
                const percentage = stage === 'HEATMAP' ? sentence.percentage : 0;

                let cardBg = 'rgba(255, 255, 255, 0.02)';
                let cardBorder = '1px solid rgba(255, 255, 255, 0.08)';

                if (stage === 'HEATMAP') {
                  if (isFlaw) {
                    cardBg = 'rgba(34, 197, 94, 0.15)';
                    cardBorder = '2px solid #22c55e';
                  } else if (votes > 0) {
                    cardBg = `rgba(239, 68, 68, ${Math.max(0.08, percentage / 100 * 0.35)})`;
                    cardBorder = '1px solid rgba(239, 68, 68, 0.4)';
                  }
                }

                return (
                  <div
                    key={sentence.id}
                    onClick={() => stage === 'HEATMAP' && setActiveDebriefSentenceId(sentence.id)}
                    style={{
                      background: cardBg,
                      border: cardBorder,
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      cursor: stage === 'HEATMAP' ? 'pointer' : 'default',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      outline: activeDebriefSentenceId === sentence.id ? '2px solid #38bdf8' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isFlaw ? '#4ade80' : '#94a3b8' }}>
                        [{idx + 1}]
                      </span>

                      {stage === 'HEATMAP' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {isFlaw ? (
                            <span style={{ background: '#22c55e', color: '#000000', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <CheckCircle2 size={13} />
                              <span>CRITICAL FLAW ({percentage}%)</span>
                            </span>
                          ) : votes > 0 ? (
                            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                              DISTRACTOR ({percentage}%)
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              0%
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#f8fafc', margin: 0 }}>
                      {sentence.text}
                    </p>

                    {/* Progress Fill Bar in Heatmap mode */}
                    {stage === 'HEATMAP' && percentage > 0 && (
                      <div style={{ marginTop: '0.6rem', background: 'rgba(0,0,0,0.3)', height: '5px', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: isFlaw ? '#22c55e' : '#ef4444',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CPACC Debrief Panel */}
            {stage === 'HEATMAP' && revealData && (
              <div style={{ marginTop: '1.75rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid #38bdf8', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} />
                  <span>Official CPACC Debrief & BoK Analysis</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {revealData.scenario.flawSummary}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  📚 <strong>Citation:</strong> {revealData.scenario.cpaccRef}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Leaderboard & Snipe telemetry */}
          {stage === 'HEATMAP' && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="#f59e0b" />
                <span>Sniper Leaderboard</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {leaderboard.map((player) => {
                  const outcome = revealData?.results.find(r => r.id === player.id);
                  return (
                    <div
                      key={player.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        background: outcome?.isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-surface)',
                        border: `1px solid ${outcome?.isCorrect ? '#22c55e' : 'var(--border-color)'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{player.avatar}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{player.nickname}</div>
                          <div style={{ fontSize: '0.75rem', color: outcome?.isCorrect ? '#4ade80' : '#f87171' }}>
                            {outcome?.isCorrect ? (outcome.deadshotAwarded ? '+300 (Deadshot!)' : '+200 pts') : 'Misfire'}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#38bdf8' }}>
                        {player.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: PLAYER SCREEN (Mobile & Desktop)
  // ==========================================
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {/* Player Header */}
      <div className="card" style={{ marginBottom: '1rem', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
              Scenario {scenarioIndex + 1} of {totalScenarios}
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
              {currentScenario?.title}
            </div>
          </div>

          {stage === 'SNIPING' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.3rem', fontWeight: 900, color: timerLeft <= 5 ? '#ef4444' : '#38bdf8' }}>
              <Clock size={18} />
              <span>{timerLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Outcome Banner (Heatmap phase) */}
      {stage === 'HEATMAP' && myResult && (
        <div style={{
          background: myResult.isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `2px solid ${myResult.isCorrect ? '#22c55e' : '#ef4444'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            {myResult.isCorrect ? '🎯🔥' : '❌💨'}
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', color: myResult.isCorrect ? '#4ade80' : '#fca5a5', marginBottom: '0.25rem' }}>
            {myResult.isCorrect ? 'DIRECT HIT! FLAW LOCATED' : 'MISFIRE! TARGETED COMPLIANT TEXT'}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>
            {myResult.isCorrect
              ? `You earned ${myResult.roundPoints} points! Total Score: ${myResult.totalScore} pts.`
              : `Look at the main host screen to see why sentence was compliant.`}
          </p>
        </div>
      )}

      {/* Premise Box */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        <strong>Premise:</strong> {currentScenario?.context}
      </div>

      {/* Clickable Sentence Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {currentScenario?.sentences.map((sent, idx) => {
          const isSelected = selectedSentenceId === sent.id;
          const isFlawInHeatmap = stage === 'HEATMAP' && sent.id === revealData?.flawedSentenceId;
          const wasMyChoice = myResult?.targetedId === sent.id;

          let btnBg = 'var(--bg-surface)';
          let btnBorder = '2px solid var(--border-color)';

          if (stage === 'SNIPING') {
            if (isSelected) {
              btnBg = 'rgba(56, 189, 248, 0.15)';
              btnBorder = '2px solid #38bdf8';
            }
          } else if (stage === 'HEATMAP') {
            if (isFlawInHeatmap) {
              btnBg = 'rgba(34, 197, 94, 0.2)';
              btnBorder = '2px solid #22c55e';
            } else if (wasMyChoice) {
              btnBg = 'rgba(239, 68, 68, 0.2)';
              btnBorder = '2px solid #ef4444';
            }
          }

          return (
            <button
              key={sent.id}
              type="button"
              disabled={isSnipeLocked || stage !== 'SNIPING'}
              onClick={() => handleSelectSentence(sent.id)}
              style={{
                background: btnBg,
                border: btnBorder,
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                textAlign: 'left',
                color: '#ffffff',
                cursor: (isSnipeLocked || stage !== 'SNIPING') ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{
                  background: isSelected ? '#38bdf8' : '#334155',
                  color: isSelected ? '#000000' : '#ffffff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}>
                  Key {idx + 1}
                </span>

                {isSelected && stage === 'SNIPING' && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Crosshair size={14} />
                    <span>TARGET LOCKED</span>
                  </span>
                )}

                {stage === 'HEATMAP' && isFlawInHeatmap && (
                  <span style={{ background: '#22c55e', color: '#000000', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>
                    ✓ ACTUAL FLAW
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#f8fafc' }}>
                {sent.text}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lock in Snipe Action Button */}
      {stage === 'SNIPING' && (
        <div style={{ position: 'sticky', bottom: '1rem', zIndex: 10 }}>
          <button
            type="button"
            className="btn-primary"
            disabled={!selectedSentenceId || isSnipeLocked}
            onClick={handleLockInSnipe}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              background: isSnipeLocked ? '#10b981' : undefined
            }}
          >
            <Crosshair size={22} />
            <span>{isSnipeLocked ? '✓ SNIPE LOCKED IN! Awaiting room...' : 'LOCK IN SNIPE (Space / Enter)'}</span>
          </button>
        </div>
      )}

      {/* Heatmap Official Debrief Card on mobile */}
      {stage === 'HEATMAP' && revealData && (
        <div className="card" style={{ marginTop: '1rem', padding: '1.25rem', border: '1px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <BookOpen size={18} />
            <span>CPACC Knowledge Debrief</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            {revealData.scenario.flawSummary}
          </p>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            📖 {revealData.scenario.cpaccRef}
          </div>
        </div>
      )}
    </div>
  );
}
