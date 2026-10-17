import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Crosshair,
  Clock,
  Award,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const AI_SNIPERS = [
  { name: 'Eagle-Eye Emma', avatar: '🦅', accuracy: 0.85, style: 'Expert Auditor' },
  { name: 'Calculated Cal', avatar: '🧐', accuracy: 0.60, style: 'Compliance Officer' },
  { name: 'Rookie Riley', avatar: '🐣', accuracy: 0.30, style: 'Junior Developer' }
];

export default function SoloFlawFinder({ onBack }) {
  const [scenarios, setScenarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState('LOADING'); // 'LOADING', 'SNIPING', 'HEATMAP', 'PODIUM'
  const [selectedSentenceId, setSelectedSentenceId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [timerLeft, setTimerLeft] = useState(30);

  // Scores
  const [playerScore, setPlayerScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [aiScores, setAiScores] = useState({
    'Eagle-Eye Emma': 0,
    'Calculated Cal': 0,
    'Rookie Riley': 0
  });

  // Heatmap telemetry for current round
  const [roundHeatmap, setRoundHeatmap] = useState([]);
  const [deadshotTriggered, setDeadshotTriggered] = useState(false);
  const [userOutcome, setUserOutcome] = useState(null);
  const [aiPicks, setAiPicks] = useState([]);

  // Fetch scenarios from server /api/flaws or fallback
  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await fetch('/api/flaws');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setScenarios(data.sort(() => 0.5 - Math.random()).slice(0, 5));
            setStage('SNIPING');
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch /api/flaws, using local fallback:', err);
      }

      // Hardcoded fallback if server offline
      setScenarios([
        {
          id: 'flaw-fb-1',
          title: 'Public University Web Accessibility Statement',
          domain: 3,
          domainName: 'Legal Mandates & Standards',
          topic: 'ADA Title II & Section 504 Undue Burden',
          context: 'A state university published this accessibility roadmap on its public portal.',
          sentences: [
            { id: 's1', text: 'Apex State University provides equal digital educational opportunities in accordance with Title II of the ADA and Section 504 of the Rehabilitation Act.', isFlaw: false },
            { id: 's2', text: 'All online course materials and departmental portals adhere to WCAG 2.1 Level AA criteria.', isFlaw: false },
            { id: 's3', text: 'Whenever digital course content cannot be rendered accessible without an undue burden, the university automatically excuses the instructor from providing any alternative auxiliary aids or accommodations.', isFlaw: true, explanation: 'Undue burden excuses the specific modification, but DOES NOT relieve the legal obligation to provide alternative auxiliary aids.' },
            { id: 's4', text: 'Students experiencing barriers can submit an inquiry through the Office of Disability Services.', isFlaw: false },
            { id: 's5', text: 'The university conducts bi-annual automated and manual screen reader audits.', isFlaw: false }
          ],
          flawSummary: 'An undue burden defense relieves an entity from the specific cost-prohibitive modification, but DOES NOT excuse them from providing alternative auxiliary aids ensuring equal access.',
          cpaccRef: 'CPACC BoK Domain 3: Section 504 Alternative Access Obligations'
        }
      ]);
      setStage('SNIPING');
    }

    loadScenarios();
  }, []);

  // Timer countdown during SNIPING stage
  useEffect(() => {
    if (stage !== 'SNIPING' || isLocked) return;

    if (timerLeft <= 0) {
      handleLockInSnipe(null); // Timeout misfire
      return;
    }

    const interval = setInterval(() => {
      setTimerLeft((t) => {
        if (t <= 5 && t > 1) {
          soundManager.playTick(2);
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isLocked, timerLeft]);

  // Lock in player snipe & simulate AI peers
  const handleLockInSnipe = (overrideSentenceId) => {
    if (isLocked) return;
    setIsLocked(true);

    const targetId = overrideSentenceId !== undefined ? overrideSentenceId : selectedSentenceId;
    const currentScenario = scenarios[currentIndex];
    if (!currentScenario) return;

    const flawSentence = currentScenario.sentences.find(s => s.isFlaw);
    const nonFlawSentences = currentScenario.sentences.filter(s => !s.isFlaw);
    const isPlayerCorrect = targetId === flawSentence?.id;

    if (isPlayerCorrect) {
      soundManager.playSnipeLock();
    } else {
      soundManager.playClick();
    }

    // Simulate AI choices based on their accuracy ratings
    const simulatedAIPicks = AI_SNIPERS.map(ai => {
      const getsCorrect = Math.random() < ai.accuracy;
      let chosenId = null;
      if (getsCorrect && flawSentence) {
        chosenId = flawSentence.id;
      } else {
        const randDistractor = nonFlawSentences[Math.floor(Math.random() * nonFlawSentences.length)];
        chosenId = randDistractor ? randDistractor.id : flawSentence?.id;
      }
      return {
        name: ai.name,
        avatar: ai.avatar,
        chosenId,
        isCorrect: chosenId === flawSentence?.id
      };
    });

    // Total participants = 1 player + 3 AI bots = 4 snipers
    const totalCorrect = (isPlayerCorrect ? 1 : 0) + simulatedAIPicks.filter(a => a.isCorrect).length;
    const isDeadshot = (totalCorrect / 4) <= 0.40; // Only 1 out of 4 correct = Deadshot!

    // Calculate points
    const roundPts = isPlayerCorrect ? (isDeadshot ? 300 : 200) : 0;
    const newPlayerScore = playerScore + roundPts;
    setPlayerScore(newPlayerScore);
    setStreak(isPlayerCorrect ? streak + 1 : 0);

    // Update AI scores
    const updatedAiScores = { ...aiScores };
    simulatedAIPicks.forEach(ai => {
      if (ai.isCorrect) {
        updatedAiScores[ai.name] = (updatedAiScores[ai.name] || 0) + (isDeadshot ? 300 : 200);
      }
    });
    setAiScores(updatedAiScores);

    // Compute sentence heatmap votes & percentages
    const votesBySentence = {};
    currentScenario.sentences.forEach(s => { votesBySentence[s.id] = 0; });
    if (targetId && votesBySentence[targetId] !== undefined) votesBySentence[targetId] += 1;
    simulatedAIPicks.forEach(ai => {
      if (votesBySentence[ai.chosenId] !== undefined) {
        votesBySentence[ai.chosenId] += 1;
      }
    });

    const heatmap = currentScenario.sentences.map(s => {
      const votes = votesBySentence[s.id] || 0;
      const pct = Math.round((votes / 4) * 100);
      return {
        id: s.id,
        text: s.text,
        isFlaw: s.isFlaw,
        explanation: s.explanation,
        votes,
        percentage: pct
      };
    });

    setRoundHeatmap(heatmap);
    setDeadshotTriggered(isDeadshot);
    setAiPicks(simulatedAIPicks);
    setUserOutcome({
      targetedId: targetId,
      isCorrect: isPlayerCorrect,
      roundPoints: roundPts
    });

    if (isPlayerCorrect) {
      soundManager.playDirectHit();
    } else {
      soundManager.playIncorrect();
    }

    setStage('HEATMAP');
  };

  // Advance to next scenario
  const handleNextScenario = () => {
    soundManager.playClick();
    if (currentIndex >= scenarios.length - 1) {
      setStage('PODIUM');
      soundManager.playFanfare();
      const isReducedMotion = document.body.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion && typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedSentenceId(null);
      setIsLocked(false);
      setTimerLeft(30);
      setStage('SNIPING');
      soundManager.playTick(1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage !== 'SNIPING' || isLocked) return;
      const current = scenarios[currentIndex];
      if (!current) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= current.sentences.length) {
        setSelectedSentenceId(current.sentences[num - 1].id);
        soundManager.playClick();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (selectedSentenceId) {
          handleLockInSnipe();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, isLocked, scenarios, currentIndex, selectedSentenceId]);

  if (stage === 'LOADING') {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 1rem' }}>
        <Crosshair size={48} color="#38bdf8" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <h2>Initializing Flaw Finder Scenarios...</h2>
      </div>
    );
  }

  // ==========================================
  // VIEW: FINAL PODIUM
  // ==========================================
  if (stage === 'PODIUM') {
    const allParticipants = [
      { name: 'You', avatar: '👤', score: playerScore, isUser: true },
      ...AI_SNIPERS.map(ai => ({ name: ai.name, avatar: ai.avatar, score: aiScores[ai.name] || 0, isUser: false }))
    ].sort((a, b) => b.score - a.score);

    const gold = allParticipants[0];
    const silver = allParticipants[1];
    const bronze = allParticipants[2];

    return (
      <div className="card" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🎯</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Solo Flaw Finder Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          You navigated authentic corporate policies, contracts, and legal statements against AI compliance auditors.
        </p>

        {/* Podium */}
        <div className="podium-container" style={{ marginBottom: '2.5rem' }}>
          <div className="podium-column">
            {silver && (
              <>
                <div style={{ fontSize: '2.5rem' }}>{silver.avatar}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: silver.isUser ? '#38bdf8' : '#ffffff' }}>{silver.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {silver.score} pts
                </div>
                <div className="podium-box silver">2nd</div>
              </>
            )}
          </div>

          <div className="podium-column">
            {gold && (
              <>
                <div style={{ fontSize: '3.5rem' }}>👑 {gold.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: gold.isUser ? '#38bdf8' : '#ffffff' }}>{gold.name}</div>
                <div style={{ fontSize: '0.95rem', color: '#fef08a', marginBottom: '0.5rem' }}>
                  {gold.score} pts
                </div>
                <div className="podium-box gold">1st</div>
              </>
            )}
          </div>

          <div className="podium-column">
            {bronze && (
              <>
                <div style={{ fontSize: '2.5rem' }}>{bronze.avatar}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: bronze.isUser ? '#38bdf8' : '#ffffff' }}>{bronze.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {bronze.score} pts
                </div>
                <div className="podium-box bronze">3rd</div>
              </>
            )}
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={onBack}>
          <RotateCcw size={18} />
          <span>Back to Solo Hub</span>
        </button>
      </div>
    );
  }

  const currentScenario = scenarios[currentIndex];

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          ← Back to Solo Hub
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ background: '#0284c7', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem' }}>
            Scenario {currentIndex + 1} of {scenarios.length}
          </span>

          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem' }}>
            Your Score: {playerScore} pts
          </span>

          {stage === 'SNIPING' && (
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: timerLeft <= 5 ? '#ef4444' : '#38bdf8' }}>
              {timerLeft}s
            </span>
          )}
        </div>
      </div>

      {/* Deadshot Banner */}
      {stage === 'HEATMAP' && deadshotTriggered && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.25), rgba(245, 158, 11, 0.15))',
          border: '2px solid #eab308',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Zap size={28} color="#facc15" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fef08a' }}>
              ⚡ DEADSHOT BONUS UNLOCKED!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
              Most simulated auditors fell for compliant distractor clauses! Correct snipers scored <strong>+300 PTS</strong>.
            </div>
          </div>
        </div>
      )}

      {/* Outcome Banner (Heatmap phase) */}
      {stage === 'HEATMAP' && userOutcome && (
        <div style={{
          background: userOutcome.isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `2px solid ${userOutcome.isCorrect ? '#22c55e' : '#ef4444'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {userOutcome.isCorrect ? <CheckCircle2 size={32} color="#4ade80" /> : <XCircle size={32} color="#f87171" />}
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: userOutcome.isCorrect ? '#4ade80' : '#fca5a5' }}>
                {userOutcome.isCorrect ? 'DIRECT HIT! CRITICAL FLAW LOCATED' : 'MISFIRE! TARGETED COMPLIANT BOILERPLATE'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                {userOutcome.isCorrect ? `Earned +${userOutcome.roundPoints} pts this round!` : 'Review the BoK debrief below to inspect the loophole.'}
              </div>
            </div>
          </div>

          <button type="button" className="btn-primary" onClick={handleNextScenario} style={{ padding: '0.6rem 1.25rem' }}>
            <span>{currentIndex >= scenarios.length - 1 ? 'View Final Results' : 'Next Scenario'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Document Reader Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <BookOpen size={16} />
            <span>{currentScenario?.topic}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
            {currentScenario?.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
            💡 Context: {currentScenario?.context}
          </p>
        </div>

        {/* Clickable Sentence Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {(stage === 'HEATMAP' ? roundHeatmap : currentScenario?.sentences)?.map((sentence, idx) => {
            const isSelected = selectedSentenceId === sentence.id;
            const isFlawInHeatmap = stage === 'HEATMAP' && sentence.isFlaw;
            const wasMyChoice = userOutcome?.targetedId === sentence.id;
            const votes = stage === 'HEATMAP' ? sentence.votes : 0;
            const percentage = stage === 'HEATMAP' ? sentence.percentage : 0;

            let cardBg = 'var(--bg-surface)';
            let cardBorder = '2px solid var(--border-color)';

            if (stage === 'SNIPING') {
              if (isSelected) {
                cardBg = 'rgba(56, 189, 248, 0.15)';
                cardBorder = '2px solid #38bdf8';
              }
            } else if (stage === 'HEATMAP') {
              if (isFlawInHeatmap) {
                cardBg = 'rgba(34, 197, 94, 0.15)';
                cardBorder = '2px solid #22c55e';
              } else if (wasMyChoice) {
                cardBg = 'rgba(239, 68, 68, 0.2)';
                cardBorder = '2px solid #ef4444';
              } else if (votes > 0) {
                cardBg = 'rgba(239, 68, 68, 0.08)';
                cardBorder = '1px solid rgba(239, 68, 68, 0.4)';
              }
            }

            return (
              <button
                key={sentence.id}
                type="button"
                disabled={isLocked || stage !== 'SNIPING'}
                onClick={() => {
                  setSelectedSentenceId(sentence.id);
                  soundManager.playClick();
                }}
                style={{
                  background: cardBg,
                  border: cardBorder,
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  textAlign: 'left',
                  color: '#ffffff',
                  cursor: (isLocked || stage !== 'SNIPING') ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
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
                    Clause [{idx + 1}]
                  </span>

                  {stage === 'SNIPING' && isSelected && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Crosshair size={14} />
                      <span>TARGET LOCKED</span>
                    </span>
                  )}

                  {stage === 'HEATMAP' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isFlawInHeatmap ? (
                        <span style={{ background: '#22c55e', color: '#000000', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 900 }}>
                          ✓ CRITICAL FLAW ({percentage}%)
                        </span>
                      ) : votes > 0 ? (
                        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          DISTRACTOR ({percentage}%)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>0%</span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.95rem', lineHeight: 1.55, color: '#f8fafc' }}>
                  {sentence.text}
                </div>

                {/* Heatmap Bar */}
                {stage === 'HEATMAP' && percentage > 0 && (
                  <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', height: '4px', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: isFlawInHeatmap ? '#22c55e' : '#ef4444'
                    }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Lock in Button */}
        {stage === 'SNIPING' && (
          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn-primary"
              disabled={!selectedSentenceId || isLocked}
              onClick={() => handleLockInSnipe()}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 800
              }}
            >
              <Crosshair size={20} />
              <span>LOCK IN SNIPE (Space / Enter)</span>
            </button>
          </div>
        )}

        {/* Debrief Card */}
        {stage === 'HEATMAP' && (
          <div style={{ marginTop: '1.5rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid #38bdf8', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={20} />
              <span>Official CPACC Knowledge Debrief</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.6rem', lineHeight: 1.5 }}>
              {currentScenario?.flawSummary}
            </p>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              📚 <strong>Citation:</strong> {currentScenario?.cpaccRef}
            </div>
          </div>
        )}
      </div>

      {/* AI Competitors Panel */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={18} color="#38bdf8" />
          <span>Simulated AI Auditors (Live Heatmap Peers)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {AI_SNIPERS.map(ai => {
            const pick = aiPicks.find(p => p.name === ai.name);
            return (
              <div
                key={ai.name}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{ai.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{ai.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ai.style}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#38bdf8' }}>
                    {aiScores[ai.name] || 0} pts
                  </div>
                  {stage === 'HEATMAP' && pick && (
                    <div style={{ fontSize: '0.75rem', color: pick.isCorrect ? '#4ade80' : '#f87171' }}>
                      {pick.isCorrect ? '✓ Found Flaw' : '✗ Distractor'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
