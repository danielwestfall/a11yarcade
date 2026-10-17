import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  Play,
  ArrowRight,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Coins,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

const SHAPE_NAMES = {
  triangle: 'Red Triangle',
  diamond: 'Blue Diamond',
  circle: 'Amber Circle',
  square: 'Green Square'
};

export default function HotPotatoMode({ socket, role, roomPin, onLeave }) {
  // Common State
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, TEASER, SOLO_QUESTION, DELEGATE_QUESTION, SETTLEMENT, PODIUM
  const [teaserData, setTeaserData] = useState(null);
  const [timerLeft, setTimerLeft] = useState(20);
  const [questionData, setQuestionData] = useState(null);
  const [delegatesData, setDelegatesData] = useState(null);
  const [settlementData, setSettlementData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [podiumData, setPodiumData] = useState([]);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Host State
  const [players, setPlayers] = useState([]);
  const [slotSpinning, setSlotSpinning] = useState(false);
  const [displayDelegateNames, setDisplayDelegateNames] = useState({ a: '???', b: '???' });

  // Player State
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isHotSeat, setIsHotSeat] = useState(false);
  const [isDelegate, setIsDelegate] = useState(false);
  const [delegateSlot, setDelegateSlot] = useState(null); // 'A' or 'B'

  useEffect(() => {
    if (!socket) return;

    socket.on('player-list-update', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // 1. Teaser Event
    socket.on('hp-teaser', (data) => {
      setTeaserData(data);
      setGameState('TEASER');
      setTimerLeft(data.decisionTimeLimit);
      setQuestionData(null);
      setDelegatesData(null);
      setSettlementData(null);
      setSelectedChoice(null);
      setHasSubmitted(false);

      const amHotSeat = socket.id === data.activePlayer.id;
      setIsHotSeat(amHotSeat);
      setIsDelegate(false);
      setDelegateSlot(null);

      soundManager.playTick(1);
      setLiveAnnouncement(`Hot Seat: ${data.activePlayer.nickname}. Concept: ${data.conceptHeader}.`);
    });

    // Timer tick
    socket.on('timer-tick', ({ timeLeft }) => {
      setTimerLeft(timeLeft);
      if (timeLeft <= 5 && timeLeft > 0) {
        soundManager.playTick(2);
        if (timeLeft === 5) {
          setLiveAnnouncement('5 seconds remaining!');
        }
      }
    });

    // 2. Solo Started
    socket.on('hp-solo-started', (data) => {
      setQuestionData(data.question);
      setTimerLeft(data.timeLimit);
      setGameState('SOLO_QUESTION');
      soundManager.playTick(1);
      setLiveAnnouncement(`Solo Answer Phase. Active player is answering.`);
    });

    // 3. Delegates Drafted
    socket.on('hp-delegates-drafted', (data) => {
      setDelegatesData(data);
      setQuestionData(data.question);
      setTimerLeft(data.timeLimit);

      // Check if current player is a delegate
      const isDelA = data.delegateA?.id === socket.id;
      const isDelB = data.delegateB?.id === socket.id;
      setIsDelegate(isDelA || isDelB);
      setDelegateSlot(isDelA ? 'A' : isDelB ? 'B' : null);

      // Run slot-machine wheel visual
      setSlotSpinning(true);
      soundManager.playSlotSpin();

      let ticks = 0;
      const interval = setInterval(() => {
        ticks++;
        const pList = players.length > 0 ? players : [data.delegateA, data.delegateB].filter(Boolean);
        const randA = pList[Math.floor(Math.random() * pList.length)]?.nickname || '???';
        const randB = pList[Math.floor(Math.random() * pList.length)]?.nickname || '???';
        setDisplayDelegateNames({ a: randA, b: randB });

        if (ticks >= 12) {
          clearInterval(interval);
          setSlotSpinning(false);
          setDisplayDelegateNames({
            a: data.delegateA?.nickname || 'None',
            b: data.delegateB?.nickname || 'None'
          });
          soundManager.playDraftAlert();
          setGameState('DELEGATE_QUESTION');
          setLiveAnnouncement(`Delegates drafted: ${data.delegateA?.nickname} and ${data.delegateB?.nickname || 'None'}.`);
        }
      }, 100);
    });

    // 4. Settlement
    socket.on('hp-round-settlement', (data) => {
      setSettlementData(data);
      setLeaderboard(data.leaderboard);
      setGameState('SETTLEMENT');

      if (data.outcomeType === 'NEITHER_CORRECT') {
        soundManager.playCoinShower();
        setLiveAnnouncement(`Total Backfire! Social dividend of ${data.dividendPerSpectator} points awarded to spectators!`);
        // Trigger small gold confetti
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ['#f59e0b', '#fbbf24', '#fef08a']
        });
      } else if (data.outcomeType === 'BOTH_CORRECT' || data.outcomeType === 'SOLO_CORRECT') {
        soundManager.playCorrect();
        setLiveAnnouncement(`Correctly answered! Points awarded.`);
      } else {
        soundManager.playTick(1);
        setLiveAnnouncement(`1 out of 2 correct.`);
      }
    });

    // 5. Game Finished
    socket.on('game-finished', ({ podium, allPlayers }) => {
      setPodiumData(podium);
      setLeaderboard(allPlayers);
      setGameState('PODIUM');
      soundManager.playFanfare();
      confetti({ particleCount: 150, spread: 90 });
    });

    return () => {
      socket.off('player-list-update');
      socket.off('hp-teaser');
      socket.off('timer-tick');
      socket.off('hp-solo-started');
      socket.off('hp-delegates-drafted');
      socket.off('hp-round-settlement');
      socket.off('game-finished');
    };
  }, [socket, players]);

  // Keyboard navigation for answers
  useEffect(() => {
    if (gameState !== 'SOLO_QUESTION' && gameState !== 'DELEGATE_QUESTION') return;
    if (hasSubmitted) return;

    // Only allow if authorized to answer
    const canAnswer = (gameState === 'SOLO_QUESTION' && isHotSeat) ||
                      (gameState === 'DELEGATE_QUESTION' && isDelegate);
    if (!canAnswer) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toUpperCase();
      let choiceId = null;
      if (key === '1' || key === 'A') choiceId = 'A';
      if (key === '2' || key === 'B') choiceId = 'B';
      if (key === '3' || key === 'C') choiceId = 'C';
      if (key === '4' || key === 'D') choiceId = 'D';

      if (choiceId) {
        handleAnswerSubmit(choiceId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hasSubmitted, isHotSeat, isDelegate]);

  // Actions
  const handleChooseAction = (action) => {
    soundManager.playClick();
    socket.emit('hp-choose-action', { action });
  };

  const handleAnswerSubmit = (choiceId) => {
    if (hasSubmitted) return;
    soundManager.playClick();
    setSelectedChoice(choiceId);
    setHasSubmitted(true);
    socket.emit('hp-submit-answer', { choiceId });
  };

  const handleNextRound = () => {
    soundManager.playClick();
    socket.emit('next-stage');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Live Screen Reader Announcement */}
      <div className="sr-only" aria-live="assertive">
        {liveAnnouncement}
      </div>

      {/* Header Info Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🥔</span>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>The Hot Potato Syndicate</h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Room PIN: <strong style={{ color: '#38bdf8' }}>{roomPin}</strong></span>
          </div>
        </div>

        {gameState !== 'LOBBY' && gameState !== 'PODIUM' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: timerLeft <= 5 ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface-elevated)', padding: '0.4rem 0.8rem', borderRadius: '9999px', border: `1px solid ${timerLeft <= 5 ? '#ef4444' : 'var(--border-color)'}` }}>
            <Clock size={16} color={timerLeft <= 5 ? '#ef4444' : '#38bdf8'} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: timerLeft <= 5 ? '#ef4444' : '#f8fafc' }}>
              {timerLeft}s
            </span>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 0. LOBBY VIEW */}
      {/* ==================================================== */}
      {gameState === 'LOBBY' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🥔</div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Connected to The Hot Potato Syndicate!
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Keep your eyes on the host screen. When the round starts, someone will be drafted into the Hot Seat to Take or Pass!
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.9rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span>Ready in Room PIN: {roomPin}</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. TEASER VIEW */}
      {/* ==================================================== */}
      {gameState === 'TEASER' && teaserData && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '0.4rem 1.2rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Round {teaserData.roundIndex + 1} of {teaserData.totalRounds} • Base Value: {teaserData.baseValue} Pts
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem' }}>{teaserData.activePlayer.avatar}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>In the Hot Seat:</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>{teaserData.activePlayer.nickname}</div>
            </div>
          </div>

          {/* Concept Header Spotlight */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '2px solid #38bdf8', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', boxShadow: '0 0 30px rgba(56, 189, 248, 0.15)' }}>
            <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              Concept Topic Cue
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.3 }}>
              {teaserData.conceptHeader}
            </div>
            <p style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              The full question is currently hidden! Evaluate your mastery of this topic before the timer runs out.
            </p>
          </div>

          {/* Controls for Hot Seat vs Other Players */}
          {role === 'PLAYER' && isHotSeat ? (
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>
                🔥 You are in the Hot Seat! Make your call:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#059669', borderColor: '#10b981', padding: '1.25rem', fontSize: '1.1rem' }}
                  onClick={() => handleChooseAction('TAKE')}
                >
                  <Award size={22} />
                  <span>TAKE IT (+100 / -50)</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#d97706', borderColor: '#f59e0b', padding: '1.25rem', fontSize: '1.1rem' }}
                  onClick={() => handleChooseAction('PASS')}
                >
                  <Users size={22} />
                  <span>PASS TO SYNDICATE</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '1rem', borderRadius: 'var(--radius-md)', maxWidth: '600px', margin: '0 auto' }}>
              <p style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>
                ⏳ Waiting for <strong style={{ color: '#38bdf8' }}>{teaserData.activePlayer.nickname}</strong> to decide: <em>Tackle alone for full glory or Pass to two delegates?</em>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. QUESTION ACTIVE (SOLO OR DELEGATES) */}
      {/* ==================================================== */}
      {(gameState === 'SOLO_QUESTION' || gameState === 'DELEGATE_QUESTION') && questionData && (
        <div>
          {/* Top Status Banner */}
          <div style={{ background: gameState === 'SOLO_QUESTION' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)', border: `1px solid ${gameState === 'SOLO_QUESTION' ? '#059669' : '#d97706'}`, padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: gameState === 'SOLO_QUESTION' ? '#34d399' : '#fbbf24' }}>
                {gameState === 'SOLO_QUESTION' ? '🎯 Solo Attempt by Hot Seat Player' : '🤝 Syndicated Delegation (2 Random Delegates)'}
              </span>
              {delegatesData && (
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.2rem' }}>
                  Drafted Delegates: <strong>{delegatesData.delegateA?.nickname}</strong> and <strong>{delegatesData.delegateB?.nickname || 'Solo Delegate'}</strong>
                </div>
              )}
            </div>

            {/* Audience cheering tag */}
            {!isHotSeat && !isDelegate && (
              <div style={{ background: 'var(--bg-surface)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Coins size={14} />
                <span>Spectator: Rooting for Backfire (+Dividend)!</span>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.4 }}>
              {questionData.question}
            </h3>
          </div>

          {/* Answer Options */}
          {((gameState === 'SOLO_QUESTION' && isHotSeat) || (gameState === 'DELEGATE_QUESTION' && isDelegate)) ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700, color: '#38bdf8' }}>
                {hasSubmitted ? '✓ Answer locked in! Waiting for settlement...' : 'Select your answer (or press keys 1, 2, 3, 4):'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {questionData.choices.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => handleAnswerSubmit(c.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: selectedChoice === c.id ? '#38bdf8' : 'var(--bg-surface-elevated)',
                      color: selectedChoice === c.id ? '#000000' : '#ffffff',
                      border: '2px solid var(--border-color)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: hasSubmitted ? 'default' : 'pointer',
                      fontSize: '1.05rem',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ background: 'rgba(0,0,0,0.3)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 900 }}>
                      {SHAPE_ICONS[c.shape] || c.id}
                    </span>
                    <span>{c.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍿</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Private Submissions Underway</h4>
              <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
                {gameState === 'SOLO_QUESTION'
                  ? 'The active player is answering secretly. Results will be revealed once committed!'
                  : 'The two drafted delegates are submitting their answers secretly. If both miss, the Social Dividend drops into your score!'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. SETTLEMENT VIEW (SOCIAL DIVIDEND REVEAL) */}
      {/* ==================================================== */}
      {gameState === 'SETTLEMENT' && settlementData && (
        <div className="card" style={{ padding: '2rem' }}>
          {/* Outcome Banner */}
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            background: settlementData.outcomeType === 'NEITHER_CORRECT'
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.1))'
              : settlementData.outcomeType === 'BOTH_CORRECT' || settlementData.outcomeType === 'SOLO_CORRECT'
              ? 'rgba(5, 150, 105, 0.2)'
              : 'rgba(56, 189, 248, 0.2)',
            border: `2px solid ${
              settlementData.outcomeType === 'NEITHER_CORRECT' ? '#f59e0b'
              : settlementData.outcomeType === 'BOTH_CORRECT' || settlementData.outcomeType === 'SOLO_CORRECT' ? '#10b981'
              : '#38bdf8'
            }`
          }}>
            {settlementData.outcomeType === 'NEITHER_CORRECT' && (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>💰💥</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b' }}>
                  TOTAL BACKFIRE! SOCIAL DIVIDEND PAID!
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#fef08a', marginTop: '0.5rem' }}>
                  Both delegates missed! <strong>+{settlementData.dividendPerSpectator} points</strong> deposited to every spectator in the room!
                </p>
              </div>
            )}

            {settlementData.outcomeType === 'BOTH_CORRECT' && (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🤝🎉</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399' }}>
                  DOUBLE HIT! SYNDICATE SUCCESS!
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#a7f3d0' }}>
                  Both delegates solved it correctly! Active player collects +100 pts, delegates earn +50 pts each!
                </p>
              </div>
            )}

            {settlementData.outcomeType === 'ONE_CORRECT' && (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>⚖️</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                  SPLIT DECISION: 1 OUT OF 2 CORRECT
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#bae6fd' }}>
                  Active player claims a 50% cut (+50 pts). The correct solver earns +50 pts.
                </p>
              </div>
            )}

            {settlementData.outcomeType === 'SOLO_CORRECT' && (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🏆</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399' }}>
                  SOLO GLORY! +100 POINTS!
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#a7f3d0' }}>
                  {settlementData.activePlayer.nickname} backed themselves and took the full reward!
                </p>
              </div>
            )}

            {settlementData.outcomeType === 'SOLO_WRONG' && (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>❌</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444' }}>
                  SOLO BLUNDER!
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#fca5a5' }}>
                  {settlementData.activePlayer.nickname} swung alone and took a penalty!
                </p>
              </div>
            )}
          </div>

          {/* Explanation Box */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '0.25rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Official CPACC BoK Explanation
            </div>
            <p style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              {settlementData.question.explanation}
            </p>
            {settlementData.question.funNote && (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                💡 {settlementData.question.funNote}
              </p>
            )}
          </div>

          {/* Mini-Leaderboard */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#38bdf8" />
              <span>Current Room Standings:</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {leaderboard.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#94a3b8' }}>#{p.rank}</span>
                    <span>{p.avatar}</span>
                    <span style={{ fontWeight: 600 }}>{p.nickname}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: p.delta > 0 ? '#34d399' : p.delta < 0 ? '#ef4444' : '#ffffff' }}>
                    {p.score} pts {p.delta !== 0 && `(${p.delta > 0 ? '+' : ''}${p.delta})`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Host Next Round Button */}
          {role === 'HOST' && (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem' }}
                onClick={handleNextRound}
              >
                <span>Next Round</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. PODIUM VIEW */}
      {/* ==================================================== */}
      {gameState === 'PODIUM' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🥔</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Hot Potato Syndicate Champions!
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
            Mastery, calculated risks, and sweet social dividends all settled!
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
                  {p.score} Pts
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem', fontWeight: 700 }}>
                  {idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
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
