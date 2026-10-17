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
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import allQuestions from '../data/questions.json';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

const BOTS_INIT = [
  { id: 'b1', nickname: 'Penny Pincher Paul', avatar: '🦉', chips: 1000, riskLevel: 'conservative', accuracy: { 1: 0.85, 2: 0.65, 3: 0.60 } },
  { id: 'b2', nickname: 'Calculated Cal', avatar: '💡', chips: 1000, riskLevel: 'medium', accuracy: { 1: 0.70, 2: 0.90, 3: 0.65 } },
  { id: 'b3', nickname: 'Risky Riley', avatar: '🚀', chips: 1000, riskLevel: 'aggressive', accuracy: { 1: 0.55, 2: 0.55, 3: 0.85 } }
];

export default function SoloHighRoller({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // States: 'TEASER' | 'QUESTION' | 'REVEAL' | 'PODIUM'
  const [stage, setStage] = useState('TEASER');
  const [myChips, setMyChips] = useState(1000);
  const [myWager, setMyWager] = useState(100);
  const [myChoice, setMyChoice] = useState(null);
  const [bots, setBots] = useState(BOTS_INIT);
  const [roundResults, setRoundResults] = useState(null);

  // Initialize random 8 questions
  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 8);
    setQuestions(shuffled);
  }, []);

  const currentQ = questions[currentIdx];

  // Advance from Teaser to Question
  const handleLockWager = (wagerAmount) => {
    const finalWager = Math.max(10, Math.min(myChips, wagerAmount));
    setMyWager(finalWager);

    if (finalWager === myChips && finalWager > 100) {
      soundManager.playAllIn();
    } else {
      soundManager.playChipBet();
    }

    // Determine bots' wagers
    const updatedBots = bots.map((bot) => {
      let botBet = 100;
      if (bot.riskLevel === 'conservative') {
        botBet = Math.min(bot.chips, Math.floor(Math.random() * 50) + 50);
      } else if (bot.riskLevel === 'medium') {
        botBet = Math.min(bot.chips, Math.floor(bot.chips * 0.25) || 150);
      } else {
        // Aggressive
        botBet = Math.random() > 0.4 ? bot.chips : Math.floor(bot.chips * 0.6);
      }
      return { ...bot, currentWager: Math.max(10, botBet) };
    });

    setBots(updatedBots);
    setStage('QUESTION');
  };

  // Submit Answer & Evaluate Settlement
  const handleAnswer = (choiceId) => {
    soundManager.playClick();
    setMyChoice(choiceId);

    const isUserCorrect = currentQ.choices.find(c => c.id === choiceId)?.isCorrect || false;

    // Simulate bots answers based on domain accuracy
    const domain = currentQ.domain || 1;
    const botSubs = bots.map((bot) => {
      const acc = bot.accuracy[domain] || 0.65;
      const roll = Math.random();
      const isCorrect = roll < acc;
      let botChoice = '';
      if (isCorrect) {
        botChoice = currentQ.choices.find(c => c.isCorrect)?.id;
      } else {
        const distractors = currentQ.choices.filter(c => !c.isCorrect);
        botChoice = distractors[Math.floor(Math.random() * distractors.length)]?.id;
      }
      return {
        ...bot,
        isCorrect,
        choiceId: botChoice
      };
    });

    // Check Trap Card Underdog Multiplier:
    // If >= 50% of participants picked a wrong answer
    const allSubs = [
      { isCorrect: isUserCorrect },
      ...botSubs.map(b => ({ isCorrect: b.isCorrect }))
    ];
    const wrongCount = allSubs.filter(s => !s.isCorrect).length;
    const underdogTriggered = (wrongCount / allSubs.length) >= 0.50;

    // Calculate User delta
    let userDelta = 0;
    let newUserChips = myChips;
    let userBailout = false;

    if (isUserCorrect) {
      userDelta = underdogTriggered ? Math.round(myWager * 1.5) : myWager;
      newUserChips += userDelta;
    } else {
      userDelta = -myWager;
      newUserChips = Math.max(0, newUserChips - myWager);
      if (newUserChips <= 0) {
        newUserChips = 100;
        userBailout = true;
      }
    }

    // Calculate Bot deltas
    const finalizedBots = botSubs.map((b) => {
      let bDelta = 0;
      let newBChips = b.chips;
      let bBailout = false;

      if (b.isCorrect) {
        bDelta = underdogTriggered ? Math.round(b.currentWager * 1.5) : b.currentWager;
        newBChips += bDelta;
      } else {
        bDelta = -b.currentWager;
        newBChips = Math.max(0, newBChips - b.currentWager);
        if (newBChips <= 0) {
          newBChips = 100;
          bBailout = true;
        }
      }
      return {
        ...b,
        chipDelta: bDelta,
        chips: newBChips,
        bailoutAwarded: bBailout
      };
    });

    setMyChips(newUserChips);
    setBots(finalizedBots);

    if (underdogTriggered && isUserCorrect) {
      soundManager.playUnderdogMultiplier();
    } else if (isUserCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    // Combine leaderboard
    const allRanked = [
      { id: 'me', nickname: 'You (High Roller)', avatar: '👑', chips: newUserChips, chipDelta: userDelta, isCorrect: isUserCorrect, wager: myWager, isUser: true, bailoutAwarded: userBailout },
      ...finalizedBots.map(b => ({ ...b, isUser: false, wager: b.currentWager }))
    ].sort((a, b) => b.chips - a.chips);

    setRoundResults({
      underdogTriggered,
      userDelta,
      isUserCorrect,
      correctChoiceId: currentQ.choices.find(c => c.isCorrect)?.id,
      leaderboard: allRanked
    });

    setStage('REVEAL');
  };

  const handleNextRound = () => {
    soundManager.playClick();
    if (currentIdx >= questions.length - 1) {
      setStage('PODIUM');
      soundManager.playFanfare();

      const isReducedMotion = document.body.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      setCurrentIdx(currentIdx + 1);
      setMyWager(Math.min(myChips, 100));
      setMyChoice(null);
      setRoundResults(null);
      setStage('TEASER');
    }
  };

  if (!currentQ) return <div className="card">Loading High-Roller Gauntlet...</div>;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button type="button" className="btn-secondary" onClick={onBack} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <span>← Back to Solo Modes</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#334155', color: '#eab308', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800 }}>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span style={{ background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #eab308', color: '#fef08a', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 900 }}>
            Bankroll: {myChips.toLocaleString()} 🪙
          </span>
        </div>
      </div>

      {/* STAGE A: TEASER & BLIND WAGERING */}
      {stage === 'TEASER' && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '2px solid #eab308' }}>
          <div style={{ fontSize: '0.9rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, marginBottom: '0.5rem' }}>
            🎲 Blind Wager Phase • Question {currentIdx + 1}
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
            {currentQ.topic || 'Accessibility Principle'}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
            <span style={{ background: '#334155', color: '#cbd5e1', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem' }}>
              {currentQ.domainName}
            </span>
            <span style={{
              background: currentQ.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
              color: currentQ.difficulty === 'hard' ? '#fca5a5' : '#38bdf8',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              Difficulty: {currentQ.difficulty?.toUpperCase()}
            </span>
          </div>

          {/* Quick Chip Preset Buttons */}
          <div style={{ maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem' }}>
              Choose Your Chip Stake:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {[100, 250, 500, myChips].map((amt) => {
                const isAllIn = amt === myChips;
                const valid = amt <= myChips && amt > 0;
                return (
                  <button
                    key={amt}
                    type="button"
                    disabled={!valid}
                    onClick={() => setMyWager(amt)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isAllIn ? 'rgba(239, 68, 68, 0.2)' : myWager === amt ? 'rgba(234, 179, 8, 0.3)' : 'var(--bg-surface-elevated)',
                      border: `2px solid ${isAllIn ? '#ef4444' : myWager === amt ? '#eab308' : 'var(--border-color)'}`,
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

            {/* Slider */}
            <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                <span>Custom Wager:</span>
                <strong style={{ color: '#eab308' }}>{myWager} Chips</strong>
              </div>
              <input
                type="range"
                min="10"
                max={Math.max(10, myChips)}
                step="10"
                value={myWager}
                onChange={(e) => setMyWager(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#eab308', cursor: 'pointer' }}
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => handleLockWager(myWager)}
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
            >
              <span>Lock Bet: {myWager.toLocaleString()} Chips</span>
              <Coins size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE B: QUESTION */}
      {stage === 'QUESTION' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', background: '#334155', padding: '0.25rem 0.65rem', borderRadius: '4px', color: '#eab308', fontWeight: 700 }}>
              At Stake: {myWager.toLocaleString()} Chips
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Select the best answer:
            </span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.4, margin: '0.5rem 0 1.5rem 0', color: '#ffffff' }}>
            {currentQ.question}
          </h3>

          <div className="answers-grid">
            {currentQ.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`answer-btn ${c.shape}`}
                onClick={() => handleAnswer(c.id)}
                style={{ textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                <span style={{ flex: 1 }}>{c.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE C: REVEAL & UNDERDOG SETTLEMENT */}
      {stage === 'REVEAL' && roundResults && (
        <div className="card">
          {roundResults.underdogTriggered ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(234, 179, 8, 0.3) 100%)',
              border: '2px solid #c084fc',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>⚡🃏 TRAP CARD TRIGGERED! 🃏⚡</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fef08a' }}>
                50%+ of players fell for the tricky distractor!
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e9d5ff', marginTop: '0.25rem' }}>
                Correct high-rollers earn a <strong>1.5× Underdog Multiplier</strong> payout!
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{
                background: roundResults.isUserCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${roundResults.isUserCorrect ? '#10b981' : '#ef4444'}`,
                color: roundResults.isUserCorrect ? '#6ee7b7' : '#fca5a5',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}>
                {roundResults.isUserCorrect ? `🎉 Correct! +${roundResults.userDelta.toLocaleString()} Chips` : `💸 Incorrect! ${roundResults.userDelta.toLocaleString()} Chips`}
              </span>
            </div>
          )}

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
            {currentQ.question}
          </h3>

          <div className="answers-grid" style={{ marginBottom: '1.5rem' }}>
            {currentQ.choices.map((c) => {
              const isCorrect = c.id === roundResults.correctChoiceId;
              const isUserPick = c.id === myChoice;
              return (
                <div
                  key={c.id}
                  className={`answer-btn ${c.shape} ${isCorrect ? 'is-correct-highlight' : isUserPick ? 'is-wrong-highlight' : 'is-dimmed'}`}
                  style={{ cursor: 'default' }}
                >
                  <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                  <span style={{ flex: 1 }}>{c.text}</span>
                  {isUserPick && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#000', padding: '2px 6px', borderRadius: '4px' }}>
                      YOUR PICK
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
            <strong>BoK Citation & Rationale:</strong> {currentQ.explanation}
          </div>

          {/* AI Bots Standings */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              🪙 Current Chip Leaderboard:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {roundResults.leaderboard.map((r, idx) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: r.isUser ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                    border: r.isUser ? '2px solid #38bdf8' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, minWidth: '24px', color: '#94a3b8' }}>#{idx + 1}</span>
                    <span style={{ fontSize: '1.4rem' }}>{r.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>{r.nickname}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Wager: {r.wager} chips {r.bailoutAwarded && '• 🪙 Bailout Loan'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: r.chipDelta > 0 ? '#10b981' : '#ef4444', fontSize: '0.95rem' }}>
                      {r.chipDelta > 0 ? `+${r.chipDelta}` : r.chipDelta} 🪙
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#eab308', fontWeight: 700 }}>
                      {r.chips.toLocaleString()} chips
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="button" className="btn-primary" onClick={handleNextRound} style={{ padding: '0.85rem 2rem' }}>
              <span>{currentIdx >= questions.length - 1 ? 'View Final Chip Podium' : 'Next Teaser Round'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE D: PODIUM */}
      {stage === 'PODIUM' && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: '#eab308' }}>
            👑 The High-Roller Champions Podium! 👑
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Final bankroll tally after 8 high-stakes wagering rounds!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
            {[
              { id: 'me', nickname: 'You (High Roller)', avatar: '👑', chips: myChips },
              ...bots
            ].sort((a, b) => b.chips - a.chips).map((entry, idx) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: idx === 0 ? 'rgba(234, 179, 8, 0.2)' : 'var(--bg-surface-elevated)',
                  border: idx === 0 ? '2px solid #eab308' : '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</span>
                  <span style={{ fontSize: '1.8rem' }}>{entry.avatar}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, color: '#ffffff' }}>{entry.nickname}</div>
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#eab308' }}>
                  {entry.chips.toLocaleString()} 🪙
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn-secondary" onClick={onBack}>
            <RotateCcw size={18} />
            <span>Play Again or Choose Another Mode</span>
          </button>
        </div>
      )}
    </div>
  );
}
