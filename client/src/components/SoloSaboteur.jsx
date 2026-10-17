import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield,
  ShieldAlert,
  Terminal,
  Activity,
  Zap,
  Clock,
  Award,
  RotateCcw,
  AlertTriangle,
  Radio,
  CheckCircle2,
  XCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const AI_CREW = [
  { id: 'ai-1', name: 'Auditor Ava', avatar: '👩‍💼', role: 'Auditor', accuracy: 0.85, patchesApplied: 0, ap: 0 },
  { id: 'ai-2', name: 'Security Sam', avatar: '🕵️', role: 'Auditor', accuracy: 0.75, patchesApplied: 0, ap: 0 },
  { id: 'ai-3', name: 'Devin Dev', avatar: '👨‍💻', role: 'Auditor', accuracy: 0.65, patchesApplied: 0, ap: 0 }
];

export default function SoloSaboteur({ onBack }) {
  const [roleSelect, setRoleSelect] = useState(null); // 'AUDITOR' or 'SABOTEUR'
  const [stage, setStage] = useState('ROLE_SELECT'); // 'ROLE_SELECT', 'DRILL', 'STANDUP', 'PODIUM'
  const [compliancePercent, setCompliancePercent] = useState(0);
  const [serverTimeLeft, setServerTimeLeft] = useState(150);
  const [playerAp, setPlayerAp] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [patchesApplied, setPatchesApplied] = useState(0);

  // Subsystems
  const [subsystems, setSubsystems] = useState([
    { id: 'auth', name: 'Authentication & SSO (WCAG 3.3.8)', progress: 0 },
    { id: 'nav', name: 'Keyboard Landmarks & Focus (WCAG 2.4.7)', progress: 0 },
    { id: 'forms', name: 'Form Labels & Error Prevention (WCAG 3.3.2)', progress: 0 },
    { id: 'contrast', name: 'Color Contrast & Semantics (WCAG 1.4.3)', progress: 0 }
  ]);

  const [terminalLogs, setTerminalLogs] = useState([]);
  const [crew, setCrew] = useState([]);
  const [hiddenSaboteurId, setHiddenSaboteurId] = useState(null);

  // Question state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredFeedback, setAnsweredFeedback] = useState(null);

  // Standup State
  const [standupTimeLeft, setStandupTimeLeft] = useState(40);
  const [votedSuspectId, setVotedSuspectId] = useState(null);
  const [standupOutcomeMessage, setStandupOutcomeMessage] = useState(null);

  // Audit Ping Modal State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditReport, setAuditReport] = useState(null);

  // Final Outcome
  const [finalOutcome, setFinalOutcome] = useState(null);

  // Fetch drill questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/questions?limit=30');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setQuestions(data.sort(() => 0.5 - Math.random()));
            setCurrentQuestion(data[0]);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load questions from /api/questions:', err);
      }

      // Fallback question
      const fallback = {
        id: 'fb-1',
        question: 'What is the minimum contrast ratio required for normal body text under WCAG 2.1 Level AA?',
        difficulty: 'medium',
        domainName: 'Domain 2: WCAG Standards',
        choices: [
          { id: 'A', text: '3:1', isCorrect: false },
          { id: 'B', text: '4.5:1', isCorrect: true },
          { id: 'C', text: '7:1', isCorrect: false },
          { id: 'D', text: '10:1', isCorrect: false }
        ]
      };
      setQuestions([fallback]);
      setCurrentQuestion(fallback);
    }
    fetchQuestions();
  }, []);

  // Initialize Game when Role selected
  const handleStartGame = (chosenRole) => {
    soundManager.playClick();
    setRoleSelect(chosenRole);

    let assignedSaboteurId = null;
    let initialCrew = AI_CREW.map(ai => ({ ...ai, patchesApplied: 0, isFrozen: false }));

    if (chosenRole === 'SABOTEUR') {
      assignedSaboteurId = 'player';
    } else {
      // Pick random AI to be the saboteur
      const sabBot = initialCrew[Math.floor(Math.random() * initialCrew.length)];
      sabBot.role = 'Saboteur';
      assignedSaboteurId = sabBot.id;
    }

    setHiddenSaboteurId(assignedSaboteurId);
    setCrew(initialCrew);
    setCompliancePercent(0);
    setServerTimeLeft(150);
    setPlayerAp(0);
    setPlayerScore(0);
    setPatchesApplied(0);
    setTerminalLogs([
      { text: '🖥️ System Boot: Corporate Accessibility Subsystems Online.', type: 'info' },
      { text: '⚠️ Threat Warning: Rogue Saboteur detected on internal network.', type: 'alarm' }
    ]);

    setStage('DRILL');
  };

  // Master Timer Loop & AI Simulation
  useEffect(() => {
    if (stage !== 'DRILL') return;

    const timer = setInterval(() => {
      setServerTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          finishGame('TIMEOUT', 'The server deadline expired before 100% compliance was reached!');
          return 0;
        }
        if (t <= 10) soundManager.playTick(2);
        return t - 1;
      });

      // AI Bot autonomous actions (randomly solve questions or glitch)
      if (Math.random() < 0.35) {
        setCrew(prevCrew => {
          const activeBots = prevCrew.filter(b => !b.isFrozen);
          if (activeBots.length === 0) return prevCrew;

          const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)];
          const isSab = randomBot.id === hiddenSaboteurId;

          if (isSab && Math.random() < 0.6) {
            // Saboteur bot injects glitch
            setCompliancePercent(cp => Math.max(0, cp - 5));
            setTerminalLogs(logs => [
              ...logs.slice(-8),
              { text: `⚠️ [SYSTEM GLITCH] Subsystem integrity destabilized (-5%)!`, type: 'glitch' }
            ]);
            soundManager.playSabotageGlitch();
          } else {
            // Honest bot applies patch
            randomBot.patchesApplied += 1;
            setCompliancePercent(cp => {
              const newCp = Math.min(100, cp + 5);
              if (newCp >= 100) {
                clearInterval(timer);
                finishGame('COMPLIANCE', '100% Subsystem Compliance Achieved! The Auditors secured the infrastructure!');
              }
              return newCp;
            });
            setTerminalLogs(logs => [
              ...logs.slice(-8),
              { text: `✓ ${randomBot.name} applied a compliance patch (+5%)`, type: 'patch' }
            ]);
          }

          return [...prevCrew];
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, hiddenSaboteurId]);

  // Player solves fast-fire question
  const handleSubmitAnswer = (choiceId) => {
    if (!currentQuestion || answeredFeedback) return;

    const correctChoice = currentQuestion.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice?.id === choiceId;

    const apEarned = currentQuestion.difficulty === 'hard' ? 3 : currentQuestion.difficulty === 'medium' ? 2 : 1;
    const pts = currentQuestion.difficulty === 'hard' ? 250 : currentQuestion.difficulty === 'medium' ? 150 : 100;

    if (isCorrect) {
      soundManager.playCorrect();
      setPlayerAp(ap => ap + apEarned);
      setPlayerScore(s => s + pts);
    } else {
      soundManager.playIncorrect();
    }

    setAnsweredFeedback({ isCorrect, correctChoiceId: correctChoice?.id });

    setTimeout(() => {
      setAnsweredFeedback(null);
      const remaining = questions.filter(q => q.id !== currentQuestion.id);
      if (remaining.length > 0) {
        setCurrentQuestion(remaining[Math.floor(Math.random() * remaining.length)]);
      }
    }, 1000);
  };

  // Player applies patch
  const handleApplyPatch = (isSabotage = false) => {
    if (playerAp < 2) return;
    setPlayerAp(ap => ap - 2);

    if (isSabotage) {
      soundManager.playSabotageGlitch();
      setCompliancePercent(cp => Math.max(0, cp - 5));
      setTerminalLogs(logs => [
        ...logs.slice(-8),
        { text: `⚠️ [INTEGRITY CORRUPTED] Critical glitch injected into Subsystem (-5% Compliance)`, type: 'glitch' }
      ]);
    } else {
      soundManager.playPatchApplied();
      setPatchesApplied(p => p + 1);
      setPlayerScore(s => s + 75);
      setCompliancePercent(cp => {
        const newCp = Math.min(100, cp + 5);
        if (newCp >= 100) {
          finishGame('COMPLIANCE', '100% Subsystem Compliance Achieved! The Auditors secured the infrastructure!');
        }
        return newCp;
      });
      setTerminalLogs(logs => [
        ...logs.slice(-8),
        { text: `✓ You applied a compliance patch (+5% Compliance)`, type: 'patch' }
      ]);
    }
  };

  // Player runs audit ping
  const handleRunAuditPing = (targetBotId) => {
    if (playerAp < 3) return;
    setPlayerAp(ap => ap - 3);
    soundManager.playAuditPing();

    const target = crew.find(b => b.id === targetBotId);
    if (!target) return;

    const isSab = target.id === hiddenSaboteurId;
    const suspicion = isSab ? 'HIGH' : (target.accuracy > 0.8 ? 'LOW' : 'MEDIUM');
    const accuracy = isSab ? 35 : Math.round(target.accuracy * 100);

    setAuditReport({
      name: target.name,
      avatar: target.avatar,
      suspicion,
      accuracy
    });

    setTerminalLogs(logs => [
      ...logs.slice(-8),
      { text: `📡 Audit Ping scanned ${target.name}: Accuracy ${accuracy}% (${suspicion} Suspicion)`, type: 'audit' }
    ]);
  };

  // Call Emergency Standup
  const handleCallStandup = () => {
    if (playerAp < 4) return;
    setPlayerAp(ap => ap - 4);
    soundManager.playEmergencyAlarm();
    setStage('STANDUP');
    setStandupTimeLeft(30);
    setVotedSuspectId(null);
    setStandupOutcomeMessage(null);
  };

  // Vote during Standup
  const handleCastVote = (suspectId) => {
    if (votedSuspectId) return;
    setVotedSuspectId(suspectId);
    soundManager.playClick();

    setTimeout(() => {
      if (suspectId === 'SKIP') {
        setStandupOutcomeMessage({
          ejectedName: null,
          message: 'Vote was skipped. No player was ejected.'
        });
      } else {
        const ejected = crew.find(b => b.id === suspectId);
        if (ejected) {
          ejected.isFrozen = true;
          const wasSab = ejected.id === hiddenSaboteurId;

          if (wasSab) {
            soundManager.playCorrect();
            finishGame('EJECTED_SABOTEUR', `The Auditors successfully identified and ejected the Saboteur (${ejected.name})!`);
            return;
          } else {
            soundManager.playIncorrect();
            setStandupOutcomeMessage({
              ejectedName: ejected.name,
              message: `${ejected.name} was ejected, but was an INNOCENT AUDITOR! The real Saboteur remains on the loose.`
            });
          }
        }
      }

      setTimeout(() => {
        setStage('DRILL');
        setStandupOutcomeMessage(null);
      }, 3500);
    }, 1500);
  };

  const finishGame = (reasonCode, reasonText) => {
    soundManager.playFanfare();
    const sabBot = crew.find(b => b.id === hiddenSaboteurId);
    const sabName = roleSelect === 'SABOTEUR' ? 'You' : (sabBot?.name || 'Rogue AI');

    const auditorsWon = (reasonCode === 'COMPLIANCE' || reasonCode === 'EJECTED_SABOTEUR');
    setFinalOutcome({
      auditorsWon,
      reasonText,
      sabName
    });
    setStage('PODIUM');

    const isReducedMotion = document.body.classList.contains('reduced-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReducedMotion && typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ==========================================
  // VIEW 1: ROLE SELECTION
  // ==========================================
  if (stage === 'ROLE_SELECT') {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          ← Back to Solo Hub
        </button>

        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🕵️💻</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Solo Saboteur in the Server Room
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            A rogue entity is sabotaging corporate accessibility subsystems. Choose which side of the security conflict you want to play:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {/* Option A: Lead Auditor */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', border: '2px solid #38bdf8' }}>
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                  Play as Lead Auditor
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                  Solve fast-fire CPACC drills, earn Action Points, patch subsystems to 100%, and run Audit Pings to smoke out the rogue AI!
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleStartGame('AUDITOR')}
                style={{ width: '100%' }}
              >
                <span>Deploy as Auditor</span>
              </button>
            </div>

            {/* Option B: The Saboteur */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', border: '2px solid #ef4444' }}>
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>😈</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', marginBottom: '0.5rem' }}>
                  Play as The Saboteur
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                  Blend in with the AI crew by answering drills, secretly inject glitch exploits (-5% compliance), and run out the server clock!
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleStartGame('SABOTEUR')}
                style={{ width: '100%', background: '#dc2626', borderColor: '#ef4444' }}
              >
                <span>Infiltrate as Saboteur</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: FINAL PODIUM
  // ==========================================
  if (stage === 'PODIUM' && finalOutcome) {
    return (
      <div className="card" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
          {finalOutcome.auditorsWon ? '🛡️🎉' : '😈⚡'}
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: finalOutcome.auditorsWon ? '#4ade80' : '#f87171' }}>
          {finalOutcome.auditorsWon ? 'AUDITORS SECURE THE SYSTEM!' : 'SABOTEUR CRASHES THE SERVER!'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          {finalOutcome.reasonText}
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', fontWeight: 800, color: '#fca5a5' }}>
          <span>The Hidden Saboteur was: <strong>{finalOutcome.sabName}</strong></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={() => setStage('ROLE_SELECT')}>
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>
          <button type="button" className="btn-primary" onClick={onBack}>
            <span>Back to Solo Hub</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: STANDUP OVERLAY
  // ==========================================
  if (stage === 'STANDUP') {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        <div className="card" style={{ border: '2px solid #ef4444', padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={30} color="#ef4444" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f87171', margin: 0 }}>
              EMERGENCY COMPLIANCE STANDUP
            </h2>
          </div>
          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
            Who is sabotaging the server? Cast your vote to eject a suspect:
          </p>

          {standupOutcomeMessage ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fca5a5', margin: 0 }}>
                {standupOutcomeMessage.message}
              </h3>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {crew.filter(b => !b.isFrozen).map(bot => (
                <button
                  key={bot.id}
                  type="button"
                  disabled={Boolean(votedSuspectId)}
                  onClick={() => handleCastVote(bot.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: votedSuspectId === bot.id ? 'rgba(239, 68, 68, 0.3)' : 'var(--bg-surface-elevated)',
                    border: `2px solid ${votedSuspectId === bot.id ? '#ef4444' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: votedSuspectId ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{bot.avatar}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800 }}>{bot.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{bot.patchesApplied} Patches</div>
                    </div>
                  </div>
                  {votedSuspectId === bot.id && <span style={{ color: '#ef4444', fontWeight: 900 }}>VOTED</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN DRILL & DASHBOARD
  // ==========================================
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          ← Back to Solo Hub
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: roleSelect === 'SABOTEUR' ? '#f87171' : '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>
            <span>{roleSelect === 'SABOTEUR' ? '😈 Saboteur' : '🛡️ Auditor'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#0284c7', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.85rem' }}>
            <Zap size={15} />
            <span>{playerAp} AP</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.25rem', fontWeight: 900, color: serverTimeLeft <= 30 ? '#ef4444' : '#38bdf8' }}>
            <Clock size={18} />
            <span>{formatTimer(serverTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Global Compliance Bar */}
      <div className="card" style={{ marginBottom: '1rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 800 }}>
          <span style={{ color: '#ffffff' }}>System Compliance Integrity</span>
          <span style={{ color: compliancePercent >= 80 ? '#4ade80' : '#38bdf8' }}>{compliancePercent}% / 100%</span>
        </div>
        <div style={{ background: 'var(--bg-surface)', height: '14px', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ width: `${compliancePercent}%`, height: '100%', background: '#38bdf8', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Action Center */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          disabled={playerAp < 2}
          onClick={() => handleApplyPatch(false)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: playerAp >= 2 ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-surface)',
            border: `1px solid ${playerAp >= 2 ? '#22c55e' : 'var(--border-color)'}`,
            color: '#ffffff',
            cursor: playerAp >= 2 ? 'pointer' : 'default',
            textAlign: 'center',
            opacity: playerAp >= 2 ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🛠️</div>
          <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Patch (+5%)</div>
          <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>Cost: 2 AP</div>
        </button>

        <button
          type="button"
          disabled={playerAp < 3}
          onClick={() => setShowAuditModal(true)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: playerAp >= 3 ? 'rgba(234, 179, 8, 0.2)' : 'var(--bg-surface)',
            border: `1px solid ${playerAp >= 3 ? '#eab308' : 'var(--border-color)'}`,
            color: '#ffffff',
            cursor: playerAp >= 3 ? 'pointer' : 'default',
            textAlign: 'center',
            opacity: playerAp >= 3 ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>📡</div>
          <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Audit Ping</div>
          <div style={{ fontSize: '0.7rem', color: '#facc15' }}>Cost: 3 AP</div>
        </button>

        <button
          type="button"
          disabled={playerAp < 4}
          onClick={handleCallStandup}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: playerAp >= 4 ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
            border: `1px solid ${playerAp >= 4 ? '#ef4444' : 'var(--border-color)'}`,
            color: '#ffffff',
            cursor: playerAp >= 4 ? 'pointer' : 'default',
            textAlign: 'center',
            opacity: playerAp >= 4 ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🚨</div>
          <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Standup</div>
          <div style={{ fontSize: '0.7rem', color: '#f87171' }}>Cost: 4 AP</div>
        </button>

        {roleSelect === 'SABOTEUR' && (
          <button
            type="button"
            disabled={playerAp < 2}
            onClick={() => handleApplyPatch(true)}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: playerAp >= 2 ? 'rgba(239, 68, 68, 0.25)' : 'var(--bg-surface)',
              border: `2px dashed ${playerAp >= 2 ? '#ef4444' : 'var(--border-color)'}`,
              color: '#ffffff',
              cursor: playerAp >= 2 ? 'pointer' : 'default',
              textAlign: 'center',
              opacity: playerAp >= 2 ? 1 : 0.6
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>😈</div>
            <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#f87171' }}>Glitch (-5%)</div>
            <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Cost: 2 AP</div>
          </button>
        )}
      </div>

      {/* Main Grid: Drill on Left, Feed on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Fast-Fire Question Card */}
        {currentQuestion && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                {currentQuestion.domainName || 'CPACC Drill'}
              </span>
              <span style={{ background: '#334155', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                +{currentQuestion.difficulty === 'hard' ? 3 : currentQuestion.difficulty === 'medium' ? 2 : 1} AP
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {currentQuestion.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {currentQuestion.choices?.map(choice => {
                let choiceBg = 'var(--bg-surface)';
                let choiceBorder = '1px solid var(--border-color)';

                if (answeredFeedback) {
                  if (choice.id === answeredFeedback.correctChoiceId) {
                    choiceBg = 'rgba(34, 197, 94, 0.2)';
                    choiceBorder = '2px solid #22c55e';
                  }
                }

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={Boolean(answeredFeedback)}
                    onClick={() => handleSubmitAnswer(choice.id)}
                    style={{
                      background: choiceBg,
                      border: choiceBorder,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      color: '#ffffff',
                      cursor: answeredFeedback ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <span style={{ background: '#334155', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      {choice.id}
                    </span>
                    <span style={{ fontSize: '0.88rem' }}>{choice.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Terminal Feed */}
        <div className="card" style={{ padding: '1.25rem', background: '#020617', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
            <Terminal size={16} />
            <span>Terminal Telemetry Feed</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {terminalLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.type === 'patch' ? '#4ade80' : log.type === 'glitch' ? '#f87171' : log.type === 'audit' ? '#facc15' : '#94a3b8' }}>
                &gt; {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      {showAuditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} color="#eab308" />
              <span>Run Audit Ping</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Inspect an AI bot teammate's accuracy log to detect suspicious sandbagging. Costs 3 AP.
            </p>

            {auditReport ? (
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{auditReport.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>{auditReport.name}</div>
                <div style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 900, color: auditReport.suspicion === 'HIGH' ? '#f87171' : auditReport.suspicion === 'MEDIUM' ? '#facc15' : '#4ade80' }}>
                  Suspicion: {auditReport.suspicion}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Accuracy Rating: {auditReport.accuracy}%
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {crew.filter(b => !b.isFrozen).map(bot => (
                  <button
                    key={bot.id}
                    type="button"
                    onClick={() => handleRunAuditPing(bot.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{bot.avatar}</span>
                      <span style={{ fontWeight: 700 }}>{bot.name}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Scan &rarr;</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setShowAuditModal(false); setAuditReport(null); }}
              style={{ width: '100%' }}
            >
              <span>Close Inspection</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
