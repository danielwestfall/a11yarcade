import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Coins,
  Flame,
  Zap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

export default function HighRollerMode({ socket, role, roomPin, onLeave }) {
  // Game states: 'HR_TEASER' | 'HR_QUESTION' | 'HR_REVEAL' | 'HR_PODIUM'
  const [stage, setStage] = useState('HR_TEASER');
  const [teaserData, setTeaserData] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [settlementData, setSettlementData] = useState(null);
  const [podiumData, setPodiumData] = useState(null);

  // Timers & telemetry
  const [timeLeft, setTimeLeft] = useState(15);
  const [wagersPlacedCount, setWagersPlacedCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Player personal state
  const [myChips, setMyChips] = useState(1000);
  const [selectedWager, setSelectedWager] = useState(100);
  const [wagerLocked, setWagerLocked] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [choiceSubmitted, setChoiceSubmitted] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Teaser revealed
    const handleTeaser = (data) => {
      setTeaserData(data);
      setStage('HR_TEASER');
      setTimeLeft(data.timeLimit || 15);
      setQuestionData(null);
      setSettlementData(null);
      setWagerLocked(false);
      setMyChoice(null);
      setChoiceSubmitted(false);

      if (data.players) {
        setTotalPlayers(data.players.length);
        const me = data.players.find(p => p.id === socket.id);
        if (me && me.chips) {
          setMyChips(me.chips);
          setSelectedWager(Math.min(me.chips, 100));
        }
      }

      soundManager.playTick(1);
    };

    // Timer tick
    const handleTimerTick = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
      if (timeLeft <= 5 && timeLeft > 0) {
        soundManager.playTick(2);
      }
    };

    // Wager updates count
    const handleWagerUpdate = (data) => {
      setWagersPlacedCount(data.totalWagersPlaced);
      setTotalPlayers(data.totalPlayers);
    };

    // Full question started
    const handleQuestionStarted = (data) => {
      setQuestionData(data);
      setStage('HR_QUESTION');
      setTimeLeft(data.timeLimit || 30);
      setMyChoice(null);
      setChoiceSubmitted(false);
      soundManager.playClick();

      if (data.players) {
        const me = data.players.find(p => p.id === socket.id);
        if (me) {
          setMyChips(me.chips);
          if (me.wager) setSelectedWager(me.wager);
        }
      }
    };

    // Round settlement
    const handleRoundSettlement = (data) => {
      setSettlementData(data);
      setStage('HR_REVEAL');

      if (data.underdogTriggered) {
        soundManager.playUnderdogMultiplier();
      } else {
        soundManager.playCorrect();
      }

      const me = data.results?.find(r => r.id === socket.id);
      if (me) {
        setMyChips(me.chips);
      }
    };

    // Final podium
    const handleGameFinished = ({ podium, allPlayers }) => {
      setPodiumData(podium);
      setStage('HR_PODIUM');
      soundManager.playFanfare();

      const isReducedMotion = document.body.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      }
    };

    socket.on('hr-teaser', handleTeaser);
    socket.on('timer-tick', handleTimerTick);
    socket.on('hr-wager-update', handleWagerUpdate);
    socket.on('hr-question-started', handleQuestionStarted);
    socket.on('hr-round-settlement', handleRoundSettlement);
    socket.on('hr-game-finished', handleGameFinished);

    return () => {
      socket.off('hr-teaser', handleTeaser);
      socket.off('timer-tick', handleTimerTick);
      socket.off('hr-wager-update', handleWagerUpdate);
      socket.off('hr-question-started', handleQuestionStarted);
      socket.off('hr-round-settlement', handleRoundSettlement);
      socket.off('hr-game-finished', handleGameFinished);
    };
  }, [socket]);

  // Keyboard shortcut for answers (1-4)
  useEffect(() => {
    if (role !== 'PLAYER' || stage !== 'HR_QUESTION' || choiceSubmitted || !questionData) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toUpperCase();
      let choiceId = null;
      if (key === '1' || key === 'A') choiceId = 'A';
      if (key === '2' || key === 'B') choiceId = 'B';
      if (key === '3' || key === 'C') choiceId = 'C';
      if (key === '4' || key === 'D') choiceId = 'D';

      if (choiceId) {
        handlePlayerSubmitChoice(choiceId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role, stage, choiceSubmitted, questionData]);

  // Player wager submit
  const handlePlayerSubmitWager = (amount) => {
    if (!socket || wagerLocked) return;
    const finalAmount = Math.max(10, Math.min(myChips, amount));
    setSelectedWager(finalAmount);

    if (finalAmount === myChips && finalAmount > 100) {
      soundManager.playAllIn();
    } else {
      soundManager.playChipBet();
    }

    socket.emit('hr-submit-wager', { wager: finalAmount }, (res) => {
      if (res && res.success) {
        setWagerLocked(true);
      }
    });
  };

  // Player answer submit
  const handlePlayerSubmitChoice = (choiceId) => {
    if (!socket || choiceSubmitted) return;
    soundManager.playClick();
    setMyChoice(choiceId);
    setChoiceSubmitted(true);
    socket.emit('hr-submit-answer', { choiceId });
  };

  // Host Next Stage advance
  const handleHostNext = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('next-stage');
  };

  // ==========================================
  // VIEW 1: HOST VIEW
  // ==========================================
  if (role === 'HOST') {
    return (
      <div style={{ maxWidth: '980px', margin: '0 auto', width: '100%' }}>
        {/* Top Game Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '1px solid #eab308',
              color: '#fef08a',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Coins size={16} />
              <span>The High-Roller Gauntlet</span>
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Room PIN: <strong>{roomPin}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {stage !== 'HR_PODIUM' && (
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: timeLeft <= 5 ? '#ef4444' : '#38bdf8',
                minWidth: '45px',
                textAlign: 'right'
              }}>
                {timeLeft}s
              </span>
            )}
          </div>
        </div>

        {/* STAGE A: TEASER / WAGERING */}
        {stage === 'HR_TEASER' && teaserData && (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '2px solid #eab308' }}>
            <div style={{ fontSize: '1rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.5rem' }}>
              🎲 Blind Wager Phase • Question {teaserData.questionIndex + 1} of {teaserData.totalQuestions}
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
              {teaserData.topic}
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ background: '#334155', color: '#94a3b8', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem' }}>
                {teaserData.domainName}
              </span>
              <span style={{
                background: teaserData.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                color: teaserData.difficulty === 'hard' ? '#fca5a5' : '#38bdf8',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                Difficulty: {teaserData.difficulty?.toUpperCase()}
              </span>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                Players are placing their blind wagers...
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#eab308' }}>
                {wagersPlacedCount} / {totalPlayers || teaserData.players?.length || 1}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Wagers Locked In
              </div>
            </div>

            <button type="button" className="btn-primary" onClick={handleHostNext} style={{ padding: '0.75rem 2rem' }}>
              <span>Skip Countdown & Reveal Question</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STAGE B: QUESTION */}
        {stage === 'HR_QUESTION' && questionData && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span>Question {questionData.questionIndex + 1} of {questionData.totalQuestions}</span>
              <span>All Wagers are Locked!</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.4, margin: '0.5rem 0 1.5rem 0', color: '#ffffff' }}>
              {questionData.question.question}
            </h2>

            <div className="answers-grid">
              {questionData.question.choices.map((c) => (
                <div key={c.id} className={`answer-btn ${c.shape}`} style={{ cursor: 'default' }}>
                  <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                  <span style={{ flex: 1 }}>{c.text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button type="button" className="btn-secondary" onClick={handleHostNext}>
                <span>Reveal Answers & Payouts</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STAGE C: REVEAL & UNDERDOG PAYOUTS */}
        {stage === 'HR_REVEAL' && settlementData && (
          <div className="card">
            {/* Trap Card Underdog Banner */}
            {settlementData.underdogTriggered ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(234, 179, 8, 0.3) 100%)',
                border: '2px solid #c084fc',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>⚡🃏 TRAP CARD ACTIVATED! 🃏⚡</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fef08a' }}>
                  Over 50% of the room fell for a distractor!
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e9d5ff', marginTop: '0.25rem' }}>
                  Correct high-rollers earned the <strong>1.5× Underdog Multiplier</strong> on their payouts!
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                color: '#bae6fd',
                fontWeight: 700
              }}>
                Double-Blind Wager Payouts Complete!
              </div>
            )}

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
              {settlementData.question.question}
            </h3>

            {/* Answer Distribution */}
            <div className="answers-grid" style={{ marginBottom: '1.5rem' }}>
              {settlementData.question.choices.map((c) => {
                const isCorrect = c.id === settlementData.correctChoiceId;
                const votes = settlementData.distribution[c.id] || 0;
                return (
                  <div
                    key={c.id}
                    className={`answer-btn ${c.shape} ${isCorrect ? 'is-correct-highlight' : 'is-dimmed'}`}
                    style={{ cursor: 'default' }}
                  >
                    <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                    <span style={{ flex: 1 }}>{c.text}</span>
                    <span style={{ fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                      {votes} {votes === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Player Outcomes Table */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
                🪙 Chip Payouts & Standings:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {settlementData.results.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: `1px solid ${r.isCorrect ? '#10b981' : '#ef4444'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{r.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{r.nickname}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Bet: {r.wager} chips {r.bailoutAwarded && '• 🪙 Bailout Loan Issued'}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        color: r.chipDelta > 0 ? '#10b981' : '#ef4444'
                      }}>
                        {r.chipDelta > 0 ? `+${r.chipDelta}` : r.chipDelta} 🪙
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#eab308', fontWeight: 700 }}>
                        Total: {r.chips.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button type="button" className="btn-primary" onClick={handleHostNext} style={{ padding: '0.9rem 2.5rem' }}>
                <span>{settlementData.isLastQuestion ? 'View High-Roller Podium' : 'Next Teaser Round'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STAGE D: PODIUM */}
        {stage === 'HR_PODIUM' && podiumData && (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: '#eab308' }}>
              👑 The High-Roller Champions Podium! 👑
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Mastery of the odds, calculating distractors, and fearless risk management.
            </p>

            <div className="podium-stage">
              {/* Silver */}
              <div className="podium-column">
                {podiumData[1] && (
                  <>
                    <div style={{ fontSize: '2.5rem' }}>{podiumData[1].avatar}</div>
                    <div style={{ fontWeight: 700 }}>{podiumData[1].nickname}</div>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{podiumData[1].chips?.toLocaleString()} chips</div>
                    <div className="podium-box silver">2nd</div>
                  </>
                )}
              </div>

              {/* Gold */}
              <div className="podium-column">
                {podiumData[0] && (
                  <>
                    <div style={{ fontSize: '3.2rem' }}>👑 {podiumData[0].avatar}</div>
                    <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{podiumData[0].nickname}</div>
                    <div style={{ fontSize: '1rem', color: '#fef08a' }}>{podiumData[0].chips?.toLocaleString()} chips</div>
                    <div className="podium-box gold">1st</div>
                  </>
                )}
              </div>

              {/* Bronze */}
              <div className="podium-column">
                {podiumData[2] && (
                  <>
                    <div style={{ fontSize: '2.5rem' }}>{podiumData[2].avatar}</div>
                    <div style={{ fontWeight: 700 }}>{podiumData[2].nickname}</div>
                    <div style={{ fontSize: '0.9rem', color: '#d97706' }}>{podiumData[2].chips?.toLocaleString()} chips</div>
                    <div className="podium-box bronze">3rd</div>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <button type="button" className="btn-secondary" onClick={onLeave}>
                <RotateCcw size={18} />
                <span>Return to Lobby</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PLAYER VIEW (Mobile & Personal Screen)
  // ==========================================
  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}>
      {/* Player Header with Chip Balance */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid #eab308',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Coins size={22} color="#eab308" />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>Your Bankroll:</span>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fef08a' }}>
          {myChips.toLocaleString()} 🪙
        </div>
      </div>

      {/* STAGE A: PLAYER TEASER & WAGERING */}
      {stage === 'HR_TEASER' && teaserData && (
        <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.25rem' }}>
            Blind Wager • {timeLeft}s remaining
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            {teaserData.topic}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            {teaserData.domainName}
          </p>

          {!wagerLocked ? (
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
                Select Your Chip Wager:
              </div>

              {/* Quick Chip Preset Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[100, 250, 500, myChips].map((amt) => {
                  const isAllIn = amt === myChips;
                  const valid = amt <= myChips && amt > 0;
                  return (
                    <button
                      key={amt}
                      type="button"
                      disabled={!valid}
                      onClick={() => handlePlayerSubmitWager(amt)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isAllIn ? 'rgba(239, 68, 68, 0.2)' : selectedWager === amt ? 'rgba(234, 179, 8, 0.3)' : 'var(--bg-surface-elevated)',
                        border: `2px solid ${isAllIn ? '#ef4444' : selectedWager === amt ? '#eab308' : 'var(--border-color)'}`,
                        color: isAllIn ? '#fca5a5' : '#ffffff',
                        fontWeight: 800,
                        cursor: valid ? 'pointer' : 'not-allowed',
                        opacity: valid ? 1 : 0.4
                      }}
                    >
                      {isAllIn ? `🔥 All-In (${amt.toLocaleString()})` : `🪙 ${amt.toLocaleString()} Chips`}
                    </button>
                  );
                })}
              </div>

              {/* Custom Slider */}
              <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  <span>Custom Wager:</span>
                  <strong style={{ color: '#eab308' }}>{selectedWager} Chips</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max={Math.max(10, myChips)}
                  step="10"
                  value={selectedWager}
                  onChange={(e) => setSelectedWager(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#eab308', cursor: 'pointer' }}
                />
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => handlePlayerSubmitWager(selectedWager)}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <span>Lock In {selectedWager} Chip Wager</span>
                <Coins size={18} />
              </button>
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 'var(--radius-md)', padding: '1.5rem', color: '#a7f3d0' }}>
              <Sparkles size={32} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Wager Locked: {selectedWager} Chips!</div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Waiting for question reveal on host screen...
              </p>
            </div>
          )}
        </div>
      )}

      {/* STAGE B: PLAYER QUESTION */}
      {stage === 'HR_QUESTION' && questionData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', background: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#eab308', fontWeight: 700 }}>
              At Stake: {selectedWager} Chips
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: timeLeft <= 5 ? '#ef4444' : '#38bdf8' }}>
              {timeLeft}s
            </span>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '1.25rem', color: '#ffffff' }}>
            {questionData.question.question}
          </h3>

          {!choiceSubmitted ? (
            <div className="answers-grid">
              {questionData.question.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`answer-btn ${c.shape}`}
                  onClick={() => handlePlayerSubmitChoice(c.id)}
                  style={{ textAlign: 'left', cursor: 'pointer' }}
                >
                  <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                  <span style={{ flex: 1 }}>{c.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>Answer Locked In!</div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Selected Choice {myChoice}. Payout calculated when timer ends.
              </p>
            </div>
          )}
        </div>
      )}

      {/* STAGE C: PLAYER REVEAL */}
      {stage === 'HR_REVEAL' && settlementData && (
        <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
          {(() => {
            const me = settlementData.results?.find(r => r.id === socket.id);
            const isCorrect = me?.isCorrect;
            const delta = me?.chipDelta || 0;

            return (
              <>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                  {isCorrect ? '🎉' : '💸'}
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: isCorrect ? '#10b981' : '#ef4444', marginBottom: '0.25rem' }}>
                  {isCorrect ? `+${delta.toLocaleString()} Chips!` : `${delta.toLocaleString()} Chips`}
                </h3>

                {settlementData.underdogTriggered && isCorrect && (
                  <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    ⚡ 1.5× Underdog Multiplier Applied!
                  </div>
                )}

                {me?.bailoutAwarded && (
                  <div style={{ background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #eab308', color: '#fef08a', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', margin: '0.75rem 0' }}>
                    🪙 Bailout Loan Issued: 100 chips granted so you stay in the action!
                  </div>
                )}

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '1rem 0' }}>
                  Correct Answer was <strong>Choice {settlementData.correctChoiceId}</strong>.
                </p>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'left' }}>
                  <strong>CPACC Debrief:</strong> {settlementData.question.explanation}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* STAGE D: PLAYER PODIUM */}
      {stage === 'HR_PODIUM' && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👑🪙</div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eab308', marginBottom: '0.5rem' }}>
            High-Roller Gauntlet Concluded!
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Check the main host screen for final podium standing!
          </p>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
            Final Bankroll: {myChips.toLocaleString()} Chips
          </div>
        </div>
      )}
    </div>
  );
}
