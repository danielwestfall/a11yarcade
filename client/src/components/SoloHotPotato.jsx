import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Users, Clock, RotateCcw, ArrowRight, Coins, Bot, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';
import rawQuestions from '../data/questions.json';
import CoachFeedbackCard from './CoachFeedbackCard';

const BOTS = [
  { id: 'bot-1', nickname: 'Ada Alt-Text', avatar: '🤖', specialtyDomain: 2 },
  { id: 'bot-2', nickname: 'Devin Div', avatar: '👾', specialtyDomain: 1 },
  { id: 'bot-3', nickname: 'Jordan Juris', avatar: '⚖️', specialtyDomain: 3 }
];

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

export default function SoloHotPotato({ onBack }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [gameState, setGameState] = useState('TEASER'); // TEASER, DECISION, QUESTION, SETTLEMENT, PODIUM
  const [timerLeft, setTimerLeft] = useState(20);
  const [scores, setScores] = useState({ player: 0, 'bot-1': 0, 'bot-2': 0, 'bot-3': 0 });
  const [hotSeatPlayer, setHotSeatPlayer] = useState('player'); // 'player', 'bot-1', 'bot-2', 'bot-3'
  const [delegates, setDelegates] = useState([]); // [{ id, nickname, avatar }]
  const [actionTaken, setActionTaken] = useState(null); // 'TAKE' | 'PASS'
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [settlementInfo, setSettlementInfo] = useState(null);

  // Initialize questions
  useEffect(() => {
    const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  const currentQ = questions[roundIndex];

  // Teaser Timer
  useEffect(() => {
    if (gameState !== 'TEASER') return;
    const interval = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          if (hotSeatPlayer === 'player') {
            handlePlayerAction('PASS'); // auto-pass on timeout
          } else {
            handleBotDecision();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, hotSeatPlayer, currentQ]);

  // If a Bot is in Hot Seat, let bot decide after 3 seconds
  useEffect(() => {
    if (gameState === 'TEASER' && hotSeatPlayer !== 'player') {
      const timer = setTimeout(() => {
        handleBotDecision();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [gameState, hotSeatPlayer]);

  const handleBotDecision = () => {
    if (!currentQ) return;
    const bot = BOTS.find(b => b.id === hotSeatPlayer);
    // If topic matches specialty, 65% chance to TAKE; otherwise PASS
    const isSpecialty = bot && bot.specialtyDomain === currentQ.domain;
    const takes = isSpecialty ? Math.random() < 0.65 : Math.random() < 0.35;

    if (takes) {
      setActionTaken('TAKE');
      soundManager.playClick();
      // Bot answers immediately
      const isCorrect = Math.random() < (isSpecialty ? 0.8 : 0.45);
      const delta = isCorrect ? 100 : -50;
      setScores(prev => ({ ...prev, [bot.id]: Math.max(0, prev[bot.id] + delta) }));
      setSettlementInfo({
        outcomeType: isCorrect ? 'SOLO_CORRECT' : 'SOLO_WRONG',
        actor: bot.nickname,
        delta,
        explanation: currentQ.explanation
      });
      setGameState('SETTLEMENT');
    } else {
      setActionTaken('PASS');
      soundManager.playSlotSpin();
      // Draft 2 other peers (player is always candidate)
      const otherRoster = [
        { id: 'player', nickname: 'You (Player)', avatar: '👤' },
        ...BOTS.filter(b => b.id !== hotSeatPlayer)
      ];
      const drafted = [...otherRoster].sort(() => 0.5 - Math.random()).slice(0, 2);
      setDelegates(drafted);

      // Check if player is drafted
      setGameState('QUESTION');
      setTimerLeft(45);
      soundManager.playDraftAlert();
    }
  };

  const handlePlayerAction = (action) => {
    soundManager.playClick();
    setActionTaken(action);

    if (action === 'TAKE') {
      setGameState('QUESTION');
      setTimerLeft(30);
    } else {
      // PASS: Draft 2 random bots
      soundManager.playSlotSpin();
      const draftedBots = [...BOTS].sort(() => 0.5 - Math.random()).slice(0, 2);
      setDelegates(draftedBots);

      // Settle delegates answers
      setTimeout(() => {
        settleBotDelegates(draftedBots);
      }, 2000);
    }
  };

  const handlePlayerAnswer = (choiceId) => {
    setSelectedChoice(choiceId);
    soundManager.playClick();

    const correct = currentQ.choices.find(c => c.isCorrect);
    const isCorrect = correct && correct.id === choiceId;

    if (hotSeatPlayer === 'player') {
      // Solo answer settlement
      const delta = isCorrect ? 100 : -50;
      setScores(prev => ({ ...prev, player: Math.max(0, prev.player + delta) }));
      setSettlementInfo({
        outcomeType: isCorrect ? 'SOLO_CORRECT' : 'SOLO_WRONG',
        actor: 'You',
        delta,
        explanation: currentQ.explanation
      });
      setGameState('SETTLEMENT');
      if (isCorrect) soundManager.playCoachFeedback(true); else soundManager.playCoachFeedback(false);
    } else {
      // Player is a delegate
      const otherDel = delegates.find(d => d.id !== 'player');
      const otherBotSpecialty = otherDel ? BOTS.find(b => b.id === otherDel.id)?.specialtyDomain === currentQ.domain : false;
      const otherBotCorrect = Math.random() < (otherBotSpecialty ? 0.75 : 0.45);

      settleDelegatesOutcome(isCorrect, otherBotCorrect, otherDel);
    }
  };

  const settleBotDelegates = (draftedBots) => {
    const correctA = Math.random() < (draftedBots[0].specialtyDomain === currentQ.domain ? 0.75 : 0.45);
    const correctB = Math.random() < (draftedBots[1].specialtyDomain === currentQ.domain ? 0.75 : 0.45);

    let outcomeType = '';
    let dividend = 0;
    const correctCount = (correctA ? 1 : 0) + (correctB ? 1 : 0);

    if (correctCount === 2) {
      outcomeType = 'BOTH_CORRECT';
      setScores(prev => ({
        ...prev,
        player: prev.player + 100,
        [draftedBots[0].id]: prev[draftedBots[0].id] + 50,
        [draftedBots[1].id]: prev[draftedBots[1].id] + 50
      }));
      soundManager.playCorrect();
    } else if (correctCount === 1) {
      outcomeType = 'ONE_CORRECT';
      const winner = correctA ? draftedBots[0].id : draftedBots[1].id;
      setScores(prev => ({
        ...prev,
        player: prev.player + 50,
        [winner]: prev[winner] + 50
      }));
      soundManager.playTick(1);
    } else {
      // BOTH FAILED -> SOCIAL DIVIDEND!
      outcomeType = 'NEITHER_CORRECT';
      dividend = 100; // room spectator collects
      setScores(prev => {
        // Find spectator bot
        const specBot = BOTS.find(b => !draftedBots.some(d => d.id === b.id));
        return {
          ...prev,
          player: Math.max(0, prev.player - 20),
          [specBot?.id || 'bot-3']: (prev[specBot?.id || 'bot-3'] || 0) + 100
        };
      });
      soundManager.playCoinShower();
    }

    setSettlementInfo({
      outcomeType,
      actor: 'You',
      delA: { name: draftedBots[0].nickname, correct: correctA },
      delB: { name: draftedBots[1].nickname, correct: correctB },
      dividend,
      explanation: currentQ.explanation
    });
    setGameState('SETTLEMENT');
  };

  const settleDelegatesOutcome = (playerCorrect, otherCorrect, otherDel) => {
    const correctCount = (playerCorrect ? 1 : 0) + (otherCorrect ? 1 : 0);
    const hotSeatBot = hotSeatPlayer;

    if (correctCount === 2) {
      setScores(prev => ({
        ...prev,
        [hotSeatBot]: prev[hotSeatBot] + 100,
        player: prev.player + 50,
        [otherDel.id]: prev[otherDel.id] + 50
      }));
      soundManager.playCorrect();
    } else if (correctCount === 1) {
      setScores(prev => ({
        ...prev,
        [hotSeatBot]: prev[hotSeatBot] + 50,
        player: playerCorrect ? prev.player + 50 : prev.player,
        [otherDel.id]: otherCorrect ? prev[otherDel.id] + 50 : prev[otherDel.id]
      }));
    } else {
      // NEITHER CORRECT -> SOCIAL DIVIDEND FOR SPECTATOR (AND YOU IF SPECTATING)!
      soundManager.playCoinShower();
    }

    setSettlementInfo({
      outcomeType: correctCount === 2 ? 'BOTH_CORRECT' : correctCount === 1 ? 'ONE_CORRECT' : 'NEITHER_CORRECT',
      actor: BOTS.find(b => b.id === hotSeatBot)?.nickname || 'Hot Seat Bot',
      delA: { name: 'You', correct: playerCorrect },
      delB: { name: otherDel.nickname, correct: otherCorrect },
      explanation: currentQ.explanation
    });
    setGameState('SETTLEMENT');
  };

  const handleNextRound = () => {
    soundManager.playClick();
    if (roundIndex >= questions.length - 1) {
      setGameState('PODIUM');
      soundManager.playFanfare();
      confetti({ particleCount: 120 });
    } else {
      setRoundIndex(r => r + 1);
      // Rotate Hot Seat between Player and Bots
      const roster = ['player', 'bot-1', 'bot-2', 'bot-3'];
      setHotSeatPlayer(roster[(roundIndex + 1) % roster.length]);
      setGameState('TEASER');
      setTimerLeft(20);
      setSelectedChoice(null);
      setActionTaken(null);
      setSettlementInfo(null);
    }
  };

  if (!currentQ) return <div className="card">Loading simulated session...</div>;

  const currentHotSeatObj = hotSeatPlayer === 'player'
    ? { nickname: 'You (Player)', avatar: '👤' }
    : BOTS.find(b => b.id === hotSeatPlayer);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: 'var(--bg-surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🥔🤖</span>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Solo Hot Potato (AI Study Peers)</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Round {roundIndex + 1} of {questions.length} • Practice Mode</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#94a3b8', padding: '0.35rem 0.8rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Exit Practice
        </button>
      </div>

      {/* Roster & Scores Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'player', nickname: 'You', avatar: '👤', score: scores.player },
          { id: 'bot-1', nickname: 'Ada Alt-Text', avatar: '🤖', score: scores['bot-1'] },
          { id: 'bot-2', nickname: 'Devin Div', avatar: '👾', score: scores['bot-2'] },
          { id: 'bot-3', nickname: 'Jordan Juris', avatar: '⚖️', score: scores['bot-3'] }
        ].map(p => (
          <div
            key={p.id}
            style={{
              background: hotSeatPlayer === p.id ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface-elevated)',
              border: `2px solid ${hotSeatPlayer === p.id ? '#f59e0b' : 'var(--border-color)'}`,
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>{p.avatar}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: hotSeatPlayer === p.id ? '#fbbf24' : '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.nickname}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8' }}>
              {p.score} pts
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================== */}
      {/* 1. TEASER VIEW */}
      {/* ==================================================== */}
      {gameState === 'TEASER' && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '0.4rem 1.2rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem' }}>
            HOT SEAT: {currentHotSeatObj?.nickname} • 100 Points Base
          </div>

          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{currentHotSeatObj?.avatar}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem' }}>
            {currentHotSeatObj?.nickname} is in the Hot Seat!
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '2px solid #38bdf8', padding: '1.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Concept Topic Cue:
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
              {currentQ.topic || currentQ.domainName}
            </div>
          </div>

          {hotSeatPlayer === 'player' ? (
            <div>
              <p style={{ color: '#94a3b8', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                You have {timerLeft}s to make your call:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#059669', borderColor: '#10b981', padding: '1rem' }}
                  onClick={() => handlePlayerAction('TAKE')}
                >
                  TAKE ALONE (+100 / -50)
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#d97706', borderColor: '#f59e0b', padding: '1rem' }}
                  onClick={() => handlePlayerAction('PASS')}
                >
                  PASS TO BOTS
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '1rem', borderRadius: 'var(--radius-md)', maxWidth: '500px', margin: '0 auto' }}>
              <p style={{ margin: 0, color: '#f8fafc' }}>
                🤖 {currentHotSeatObj?.nickname} is analyzing the concept...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. QUESTION VIEW */}
      {/* ==================================================== */}
      {gameState === 'QUESTION' && (
        <div>
          <div className="card" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4 }}>
              {currentQ.question}
            </h3>
          </div>

          {/* Choices */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {currentQ.choices.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => handlePlayerAnswer(c.id)}
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
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. SETTLEMENT VIEW */}
      {/* ==================================================== */}
      {gameState === 'SETTLEMENT' && settlementInfo && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            background: settlementInfo.outcomeType === 'NEITHER_CORRECT' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(5, 150, 105, 0.2)',
            border: `2px solid ${settlementInfo.outcomeType === 'NEITHER_CORRECT' ? '#f59e0b' : '#10b981'}`
          }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: settlementInfo.outcomeType === 'NEITHER_CORRECT' ? '#f59e0b' : '#34d399' }}>
              {settlementInfo.outcomeType === 'NEITHER_CORRECT' ? '💥 TOTAL BACKFIRE!' : '✓ ROUND SETTLED!'}
            </h3>
            <p style={{ color: '#e2e8f0', marginTop: '0.5rem', fontSize: '1rem' }}>
              {settlementInfo.outcomeType === 'NEITHER_CORRECT'
                ? 'Both delegates missed! Points were awarded as dividends.'
                : `${settlementInfo.actor} successfully secured points this round!`}
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
              Official Explanation:
            </div>
            <p style={{ fontSize: '0.95rem', color: '#f8fafc', margin: 0 }}>
              {settlementInfo.explanation}
            </p>
          </div>

          {/* Coach McGuirk's Sideline Pep Talk */}
          <CoachFeedbackCard isCorrect={settlementInfo.outcomeType !== 'SOLO_WRONG' && settlementInfo.outcomeType !== 'NEITHER_CORRECT'} />

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleNextRound}
              style={{ padding: '0.75rem 2rem' }}
            >
              <span>{roundIndex >= questions.length - 1 ? 'See Final Podium' : 'Next Round'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. PODIUM VIEW */}
      {/* ==================================================== */}
      {gameState === 'PODIUM' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🥔</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Practice Session Completed!
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            Final scores against your AI study syndicate:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            {[
              { id: 'player', nickname: 'You', avatar: '👤', score: scores.player },
              { id: 'bot-1', nickname: 'Ada Alt-Text', avatar: '🤖', score: scores['bot-1'] },
              { id: 'bot-2', nickname: 'Devin Div', avatar: '👾', score: scores['bot-2'] },
              { id: 'bot-3', nickname: 'Jordan Juris', avatar: '⚖️', score: scores['bot-3'] }
            ].sort((a, b) => b.score - a.score).map((p, idx) => (
              <div key={p.id} style={{ background: 'var(--bg-surface-elevated)', border: `2px solid ${idx === 0 ? '#fbbf24' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{p.avatar}</div>
                <div style={{ fontWeight: 800, marginTop: '0.25rem' }}>{p.nickname}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: idx === 0 ? '#fbbf24' : '#38bdf8' }}>{p.score} pts</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{idx === 0 ? '🥇 Winner' : `#${idx + 1}`}</div>
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
