import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Scale,
  Swords,
  ShieldCheck,
  Flame,
  Clock,
  Award,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Move,
  Info,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import TauntTriggerButton from './TauntTriggerButton';
import WinnerCelebrationSoundboard from './WinnerCelebrationSoundboard';

export default function BoundaryBrawlMode({ socket, role, roomPin, onLeave }) {
  const [stage, setStage] = useState('SCRAMBLE'); // 'SCRAMBLE', 'CHALLENGE', 'PODIUM'
  const [timeLeft, setTimeLeft] = useState(75);
  const [cards, setCards] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [playerScores, setPlayerScores] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);

  // Active Challenge Debate
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(20);
  const [userVoted, setUserVoted] = useState(null); // 'UP' | 'DOWN'

  // Last Settled Rationale Announcement
  const [settledReport, setSettledReport] = useState(null);

  // Podium Data
  const [finalData, setFinalData] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('bb-game-started', (data) => {
      setCards(data.cards || []);
      setPlacements(data.placements || []);
      setTimeLeft(data.timeLeft || 75);
      setStage('SCRAMBLE');
      soundManager.playClick();
    });

    socket.on('bb-timer-tick', ({ timeLeft: tl }) => {
      setTimeLeft(tl);
      if (tl <= 10 && tl > 0) {
        soundManager.playTick(1);
      }
    });

    socket.on('bb-scramble-ended', ({ placements: pList }) => {
      setPlacements(pList || []);
      setStage('CHALLENGE');
      soundManager.playEmergencyAlarm();
    });

    socket.on('bb-card-moved', (data) => {
      setPlacements(data.placements || []);
      if (data.playerScores) setPlayerScores(data.playerScores);
      soundManager.playCardDrop();
    });

    socket.on('bb-challenge-started', ({ challenge }) => {
      setActiveChallenge(challenge);
      setChallengeTimeLeft(challenge.timeLeft || 20);
      setUserVoted(null);
      setSettledReport(null);
      soundManager.playChallengeAlert();
    });

    socket.on('bb-challenge-tick', ({ timeLeft: tl }) => {
      setChallengeTimeLeft(tl);
      if (tl <= 5 && tl > 0) {
        soundManager.playTick(2);
      }
    });

    socket.on('bb-vote-update', ({ thumbsUpCount, thumbsDownCount }) => {
      setActiveChallenge((prev) => prev ? { ...prev, thumbsUpCount, thumbsDownCount } : null);
      soundManager.playVoteChime();
    });

    socket.on('bb-challenge-settled', (data) => {
      setPlacements(data.updatedPlacements || []);
      if (data.playerScores) setPlayerScores(data.playerScores);
      setActiveChallenge(null);
      setSettledReport(data);

      if (data.winner === 'CHALLENGER') {
        soundManager.playCorrect();
      } else {
        soundManager.playStreak();
      }
    });

    socket.on('bb-game-finished', (data) => {
      setFinalData(data);
      setStage('PODIUM');
      soundManager.playWinnerFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    });

    return () => {
      socket.off('bb-game-started');
      socket.off('bb-timer-tick');
      socket.off('bb-scramble-ended');
      socket.off('bb-card-moved');
      socket.off('bb-challenge-started');
      socket.off('bb-challenge-tick');
      socket.off('bb-vote-update');
      socket.off('bb-challenge-settled');
      socket.off('bb-game-finished');
    };
  }, [socket]);

  // Handle Card Placement
  const handlePlaceCard = (cardId, quadrant, x, y) => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('bb-place-card', { cardId, quadrant, x, y }, (res) => {
      if (res?.success) {
        setSelectedCardId(null);
      }
    });
  };

  // Handle Slapping a Challenge
  const handleChallengeCard = (cardId) => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('bb-challenge-card', { cardId }, (res) => {
      if (!res?.success) {
        alert(res?.error || 'Could not initiate challenge.');
      }
    });
  };

  // Handle Voting in Challenge
  const handleVote = (vote) => {
    if (!socket || !activeChallenge || userVoted) return;
    setUserVoted(vote);
    soundManager.playVoteChime();
    socket.emit('bb-cast-emoji-vote', { vote }, () => {});
  };

  const handleNextStage = () => {
    if (!socket || role !== 'HOST') return;
    socket.emit('next-stage');
  };

  // Quadrants configuration
  const quadrants = [
    {
      id: 'Q1',
      title: 'Q1: High Risk / Strict Floor',
      subtitle: 'Mandatory Standards & Legal Floor',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      icon: '⚖️',
      defaultX: 25,
      defaultY: 75
    },
    {
      id: 'Q2',
      title: 'Q2: High Impact / Universal Design',
      subtitle: 'Systemic Inclusion & Organizational Reach',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      icon: '🌍',
      defaultX: 75,
      defaultY: 75
    },
    {
      id: 'Q3',
      title: 'Q3: Low Risk / Strict Floor',
      subtitle: 'Checklist Hygiene & Baseline Code',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      icon: '📋',
      defaultX: 25,
      defaultY: 25
    },
    {
      id: 'Q4',
      title: 'Q4: Low Risk / UD Enhancement',
      subtitle: 'Usability Flourish & Flexible Options',
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.08)',
      borderColor: 'rgba(14, 165, 233, 0.4)',
      icon: '✨',
      defaultX: 75,
      defaultY: 25
    }
  ];

  // ==========================================
  // VIEW: FINAL PODIUM
  // ==========================================
  if (stage === 'PODIUM' && finalData) {
    return (
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆⚖️</div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
          The Boundary Line Brawl: Final Arbitration
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>
          All scenarios have been challenged and adjudicated against CPACC accessibility jurisprudence!
        </p>

        {/* Podium Top 3 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1rem', marginBottom: '2.5rem' }}>
          {finalData.podium[1] && (
            <div style={{ flex: 1, background: 'var(--bg-surface-elevated)', border: '2px solid #94a3b8', borderRadius: 'var(--radius-md)', padding: '1rem', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.8rem' }}>🥈 {finalData.podium[1].avatar}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '0.5rem' }}>{finalData.podium[1].nickname}</div>
              <div style={{ color: '#38bdf8', fontWeight: 700 }}>{finalData.podium[1].score} pts</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{finalData.podium[1].challengesWon || 0} debates won</div>
            </div>
          )}

          {finalData.podium[0] && (
            <div style={{ flex: 1.2, background: 'rgba(234, 179, 8, 0.15)', border: '3px solid #eab308', borderRadius: 'var(--radius-md)', padding: '1.25rem', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '2.4rem' }}>👑 {finalData.podium[0].avatar}</div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', marginTop: '0.5rem', color: '#facc15' }}>{finalData.podium[0].nickname}</div>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>{finalData.podium[0].score} pts</div>
              <div style={{ fontSize: '0.8rem', color: '#fde047' }}>Chief Accessibility Arbitrator</div>
            </div>
          )}

          {finalData.podium[2] && (
            <div style={{ flex: 1, background: 'var(--bg-surface-elevated)', border: '2px solid #b45309', borderRadius: 'var(--radius-md)', padding: '1rem', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.8rem' }}>🥉 {finalData.podium[2].avatar}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '0.5rem' }}>{finalData.podium[2].nickname}</div>
              <div style={{ color: '#38bdf8', fontWeight: 700 }}>{finalData.podium[2].score} pts</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{finalData.podium[2].challengesWon || 0} debates won</div>
            </div>
          )}
        </div>

        {/* Winner's Celebration Soundboard for 1st Place Champion */}
        {finalData.podium[0]?.id === socket?.id && (
          <WinnerCelebrationSoundboard socket={socket} isWinner={true} />
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={onLeave}
          style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', margin: '0 auto' }}
        >
          <RotateCcw size={18} />
          <span>Return to Lobby</span>
        </button>
      </div>
    );
  }

  const placedCardIds = new Set(placements.map((p) => p.cardId));
  const unplacedCards = cards.filter((c) => !placedCardIds.has(c.id));
  const activeSelectedCard = cards.find((c) => c.id === selectedCardId);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0.5rem' }}>
      {/* Top Status Header */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
          padding: '1rem 1.5rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface-elevated)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem' }}>⚖️</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                The Boundary Line Brawl
              </h2>
              <span
                style={{
                  background: stage === 'SCRAMBLE' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: stage === 'SCRAMBLE' ? '#38bdf8' : '#f87171',
                  border: `1px solid ${stage === 'SCRAMBLE' ? '#38bdf8' : '#ef4444'}`,
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '9999px',
                  fontWeight: 800
                }}
              >
                {stage === 'SCRAMBLE' ? 'Phase 1: Scramble Drop' : 'Phase 2: Debate Arena'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Room PIN: <strong style={{ color: '#ffffff' }}>{roomPin}</strong> • Map ambiguous scenarios to 2×2 CPACC matrix
            </div>
          </div>
        </div>

        {/* Timer & Host Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {stage === 'SCRAMBLE' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: timeLeft <= 15 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                border: `2px solid ${timeLeft <= 15 ? '#ef4444' : '#334155'}`,
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                color: timeLeft <= 15 ? '#f87171' : '#ffffff',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}
            >
              <Clock size={18} />
              <span>{timeLeft}s</span>
            </div>
          )}

          {role === 'HOST' && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNextStage}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <span>{stage === 'SCRAMBLE' ? 'Start Challenge Brawl →' : 'Finalize Brawl →'}</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={onLeave}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            Leave
          </button>
        </div>
      </div>

      {/* Active Challenge Arena Overlay Banner */}
      {activeChallenge && (
        <div
          role="region"
          aria-live="assertive"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(15, 23, 42, 0.95))',
            border: '2px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1rem',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🥊</span>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f87171', margin: 0 }}>
                  CHALLENGE BRAWL IN PROGRESS!
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                  <strong>{activeChallenge.challenger.nickname}</strong> {activeChallenge.challenger.avatar} is challenging the placement of <strong>"{activeChallenge.cardTitle}"</strong> currently in <strong>{activeChallenge.currentQuadrant}</strong> (placed by {activeChallenge.defender.nickname} {activeChallenge.defender.avatar})
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(239, 68, 68, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.2rem'
              }}
            >
              <Clock size={20} />
              <span>{challengeTimeLeft}s</span>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
            "{activeChallenge.cardDescription}"
          </p>

          {/* Voting Station */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleVote('UP')}
              disabled={userVoted !== null}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: userVoted === 'UP' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                color: '#ffffff',
                fontWeight: 800,
                cursor: userVoted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem'
              }}
            >
              <ThumbsUp size={20} />
              <span>DEFEND PLACEMENT ({activeChallenge.thumbsUpCount || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote('DOWN')}
              disabled={userVoted !== null}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: userVoted === 'DOWN' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                border: '2px solid #ef4444',
                color: '#ffffff',
                fontWeight: 800,
                cursor: userVoted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem'
              }}
            >
              <ThumbsDown size={20} />
              <span>OVERTHROW & MOVE ({activeChallenge.thumbsDownCount || 0})</span>
            </button>
          </div>

          {userVoted && (
            <div style={{ marginTop: '0.6rem', textAlign: 'center', fontSize: '0.85rem', color: '#a7f3d0' }}>
              ✓ Your vote has been recorded! Live room adjudication settling when clock runs out.
            </div>
          )}
        </div>
      )}

      {/* Last Settled CPACC Adjudication Report */}
      {settledReport && (
        <div
          role="region"
          aria-live="polite"
          style={{
            background: settledReport.winner === 'CHALLENGER' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `2px solid ${settledReport.winner === 'CHALLENGER' ? '#0ea5e9' : '#10b981'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{settledReport.winner === 'CHALLENGER' ? '⚡' : '🛡️'}</span>
            <strong style={{ fontSize: '1rem', color: '#ffffff' }}>
              {settledReport.winner === 'CHALLENGER'
                ? `CHALLENGER OVERTHREW! Moved to ${settledReport.correctQuadrantName || settledReport.correctQuadrant}`
                : `DEFENDER PREVAILED! Placement confirmed in ${settledReport.correctQuadrantName || settledReport.correctQuadrant}`}
            </strong>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.4rem 0' }}>
            <strong>CPACC Rationale:</strong> {settledReport.rationale}
          </p>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
            <strong>Standard:</strong> {settledReport.cpaccRef}
          </div>

          {/* Winner / Challenged Player Taunt Trigger */}
          <TauntTriggerButton socket={socket} />
        </div>
      )}

      {/* Main Playfield: 2x2 Spatial Matrix and Card Tray */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {/* The 2x2 Spatial Board */}
        <div
          className="card"
          style={{
            position: 'relative',
            padding: '1rem',
            background: '#090d16',
            border: '2px solid #334155',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
        >
          {/* Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#f87171', paddingBottom: '0.4rem', borderBottom: '1px solid #1e293b' }}>
            <span>▲ HIGH ORGANIZATIONAL RISK (Legal / Mandatory)</span>
            <span>▲ HIGH ORGANIZATIONAL IMPACT (Systemic UD)</span>
          </div>

          {/* Quadrants Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'minmax(200px, auto) minmax(200px, auto)',
              gap: '12px',
              margin: '12px 0'
            }}
          >
            {quadrants.map((quad) => {
              const quadPlacements = placements.filter((p) => p.quadrant === quad.id);

              return (
                <div
                  key={quad.id}
                  style={{
                    background: quad.bg,
                    border: `2px solid ${quad.borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{quad.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: quad.color }}>{quad.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{quad.subtitle}</div>
                      </div>
                    </div>

                    {/* Quick placement button if a card is selected */}
                    {selectedCardId && (
                      <button
                        type="button"
                        onClick={() => handlePlaceCard(selectedCardId, quad.id, quad.defaultX, quad.defaultY)}
                        style={{
                          background: quad.color,
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Place Here +
                      </button>
                    )}
                  </div>

                  {/* Cards inside this quadrant */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    {quadPlacements.map((p) => {
                      const isBeingDebated = activeChallenge && activeChallenge.cardId === p.cardId;

                      return (
                        <div
                          key={p.cardId}
                          style={{
                            background: isBeingDebated ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.85)',
                            border: `1.5px solid ${isBeingDebated ? '#ef4444' : p.isVerified ? '#10b981' : quad.borderColor}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.6rem 0.75rem',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <strong style={{ color: '#ffffff' }}>{p.title}</strong>
                            {p.isVerified && (
                              <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <CheckCircle2 size={12} /> Verified
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                            {p.description}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              Placed by: {p.placedBy?.avatar} {p.placedBy?.nickname}
                            </span>

                            {stage === 'CHALLENGE' && !activeChallenge && (
                              <button
                                type="button"
                                onClick={() => handleChallengeCard(p.cardId)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: '1px solid #ef4444',
                                  color: '#f87171',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <Swords size={12} />
                                <span>Slap Challenge</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {quadPlacements.length === 0 && (
                      <div style={{ color: '#475569', fontSize: '0.75rem', fontStyle: 'italic', margin: 'auto 0', textAlign: 'center' }}>
                        No scenarios placed here yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', paddingTop: '0.4rem', borderTop: '1px solid #1e293b' }}>
            <span>▼ STRICT COMPLIANCE FLOOR (Baseline Checklist)</span>
            <span>▼ UNIVERSAL DESIGN ENHANCEMENT (Exceeding Minimums)</span>
          </div>
        </div>

        {/* Card Tray (Unplaced Cards) */}
        <div
          className="card"
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📦 Scenario Card Tray</span>
              <span style={{ fontSize: '0.8rem', background: '#334155', color: '#94a3b8', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                {unplacedCards.length} left
              </span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Select a card, then tap a quadrant to place it (+50 pts)
            </span>
          </div>

          {unplacedCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#10b981', fontWeight: 700 }}>
              🎉 All scenarios have been placed on the board! Host can advance to the Debate Arena.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {unplacedCards.map((c) => {
                const isSelected = selectedCardId === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCardId(isSelected ? null : c.id)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface)',
                      border: `2px solid ${isSelected ? '#38bdf8' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.2rem' }}>
                        {c.domainName}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', marginBottom: '0.3rem' }}>
                        {c.title}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
                        {c.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceCard(c.id, 'Q1', 25, 75);
                        }}
                        style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                      >
                        Q1: High Floor
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceCard(c.id, 'Q2', 75, 75);
                        }}
                        style={{ flex: 1, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                      >
                        Q2: High UD
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceCard(c.id, 'Q3', 25, 25);
                        }}
                        style={{ flex: 1, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                      >
                        Q3: Low Floor
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceCard(c.id, 'Q4', 75, 25);
                        }}
                        style={{ flex: 1, background: 'rgba(14, 165, 233, 0.2)', border: '1px solid #0ea5e9', color: '#38bdf8', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                      >
                        Q4: Low UD
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
