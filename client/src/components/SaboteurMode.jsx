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
  HelpCircle,
  Flame,
  UserX
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function SaboteurMode({ socket, role, roomPin, onLeave }) {
  const [stage, setStage] = useState('DRILL'); // 'DRILL', 'STANDUP', 'PODIUM'
  const [isSaboteur, setIsSaboteur] = useState(false);
  const [ap, setAp] = useState(0);
  const [score, setScore] = useState(0);

  // Global Telemetry
  const [compliancePercent, setCompliancePercent] = useState(0);
  const [serverTimeLeft, setServerTimeLeft] = useState(180);
  const [subsystems, setSubsystems] = useState([]);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [players, setPlayers] = useState([]);

  // Player Drill Question State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [answeredFeedback, setAnsweredFeedback] = useState(null);

  // Standup State
  const [standupData, setStandupData] = useState(null);
  const [standupTimeLeft, setStandupTimeLeft] = useState(45);
  const [votedSuspectId, setVotedSuspectId] = useState(null);
  const [standupOutcomeMessage, setStandupOutcomeMessage] = useState(null);

  // Audit Ping Modal State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditReport, setAuditReport] = useState(null);

  // Final Podium
  const [finalData, setFinalData] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('sab-role-assigned', ({ isSaboteur: isSab }) => {
      setIsSaboteur(isSab);
      if (isSab) {
        soundManager.playSabotageGlitch();
      } else {
        soundManager.playClick();
      }
    });

    socket.on('sab-game-started', (telemetry) => {
      setCompliancePercent(telemetry.compliancePercent);
      setServerTimeLeft(telemetry.serverTimeLeft);
      setSubsystems(telemetry.subsystems || []);
      setTerminalLogs(telemetry.terminalLogs || []);
      setPlayers(telemetry.players || []);
      setStage('DRILL');

      // Request initial question for player
      if (role === 'PLAYER') {
        socket.emit('sab-request-question', (data) => {
          if (data?.question) {
            setCurrentQuestion(data.question);
          }
        });
      }
    });

    socket.on('sab-timer-tick', ({ timeLeft, compliancePercent: cp }) => {
      setServerTimeLeft(timeLeft);
      setCompliancePercent(cp);
      if (timeLeft <= 10 && timeLeft > 0) {
        soundManager.playTick(2);
      }
    });

    socket.on('sab-telemetry-update', (telemetry) => {
      setCompliancePercent(telemetry.compliancePercent);
      setSubsystems(telemetry.subsystems || []);
      setTerminalLogs(telemetry.terminalLogs || []);
      setPlayers(telemetry.players || []);
    });

    socket.on('sab-emergency-standup', (standup) => {
      setStage('STANDUP');
      setStandupData(standup);
      setStandupTimeLeft(standup.timeLeft || 45);
      setVotedSuspectId(null);
      setStandupOutcomeMessage(null);
      soundManager.playEmergencyAlarm();
    });

    socket.on('sab-standup-tick', ({ timeLeft }) => {
      setStandupTimeLeft(timeLeft);
    });

    socket.on('sab-standup-settled', ({ ejectedNickname, wasSaboteur, message }) => {
      setStandupOutcomeMessage({ ejectedNickname, wasSaboteur, message });
      if (wasSaboteur) {
        soundManager.playCorrect();
      } else if (ejectedNickname) {
        soundManager.playIncorrect();
      }
    });

    socket.on('sab-resume-drill', (telemetry) => {
      setStage('DRILL');
      setStandupData(null);
      setStandupOutcomeMessage(null);
      setCompliancePercent(telemetry.compliancePercent);
      setSubsystems(telemetry.subsystems || []);
      setTerminalLogs(telemetry.terminalLogs || []);
      setPlayers(telemetry.players || []);

      if (role === 'PLAYER' && !currentQuestion) {
        socket.emit('sab-request-question', (data) => {
          if (data?.question) setCurrentQuestion(data.question);
        });
      }
    });

    socket.on('sab-game-finished', (data) => {
      setStage('PODIUM');
      setFinalData(data);
      soundManager.playFanfare();

      const isReducedMotion = document.body.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion && typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    });

    return () => {
      socket.off('sab-role-assigned');
      socket.off('sab-game-started');
      socket.off('sab-timer-tick');
      socket.off('sab-telemetry-update');
      socket.off('sab-emergency-standup');
      socket.off('sab-standup-tick');
      socket.off('sab-standup-settled');
      socket.off('sab-resume-drill');
      socket.off('sab-game-finished');
    };
  }, [socket, role, currentQuestion]);

  // Player action: submit answer to fast-fire drill question
  const handleSubmitAnswer = (choiceId) => {
    if (!socket || !currentQuestion || answeredFeedback) return;
    setSelectedChoice(choiceId);

    socket.emit('sab-submit-answer', { choiceId }, (res) => {
      if (res?.success) {
        setAnsweredFeedback(res);
        setAp(res.currentAP);
        setScore(res.score);

        if (res.isCorrect) {
          soundManager.playCorrect();
        } else {
          soundManager.playIncorrect();
        }

        setTimeout(() => {
          setAnsweredFeedback(null);
          setSelectedChoice(null);
          socket.emit('sab-request-question', (nextData) => {
            if (nextData?.question) {
              setCurrentQuestion(nextData.question);
            }
          });
        }, 1200);
      }
    });
  };

  // Player action: Apply patch
  const handleApplyPatch = (subsystemId, isSabotage = false) => {
    if (!socket || ap < 2) return;
    if (isSabotage) {
      soundManager.playSabotageGlitch();
    } else {
      soundManager.playPatchApplied();
    }

    socket.emit('sab-apply-patch', { subsystemId, isSabotage }, (res) => {
      if (res?.success) {
        setAp(res.remainingAP);
      }
    });
  };

  // Player action: Run audit ping
  const handleRunAuditPing = (targetPlayerId) => {
    if (!socket || ap < 3) return;
    soundManager.playAuditPing();

    socket.emit('sab-run-audit-ping', { targetPlayerId }, (res) => {
      if (res?.success) {
        setAp(res.remainingAP);
        setAuditReport(res);
      }
    });
  };

  // Player action: Call emergency standup
  const handleCallStandup = () => {
    if (!socket || ap < 4) return;
    soundManager.playEmergencyAlarm();

    socket.emit('sab-call-standup', (res) => {
      if (res?.success) {
        setAp(res.remainingAP);
      }
    });
  };

  // Player action: Cast vote in emergency standup
  const handleCastVote = (suspectId) => {
    if (!socket || votedSuspectId) return;
    soundManager.playClick();
    setVotedSuspectId(suspectId);
    socket.emit('sab-cast-vote', { suspectId });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ==========================================
  // VIEW: PODIUM & GAME OVER
  // ==========================================
  if (stage === 'PODIUM' && finalData) {
    const isAuditorsVictory = finalData.outcome.startsWith('AUDITORS');
    return (
      <div className="card" style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>
          {isAuditorsVictory ? '🛡️🎉' : '😈⚡'}
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', color: isAuditorsVictory ? '#4ade80' : '#f87171' }}>
          {isAuditorsVictory ? 'AUDITORS SECURE THE SYSTEM!' : 'SABOTEUR CRASHES THE SERVER!'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          {finalData.reason}
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{finalData.saboteurAvatar || '😈'}</span>
          <span style={{ fontWeight: 800, color: '#fca5a5' }}>
            The Hidden Saboteur was: <strong>{finalData.saboteurNickname}</strong>
          </span>
        </div>

        {/* Player Ranks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
          {finalData.allPlayers?.map((p, idx) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: p.isSaboteur ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${p.isSaboteur ? '#ef4444' : 'var(--border-color)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontWeight: 900, color: '#94a3b8' }}>#{idx + 1}</span>
                <span style={{ fontSize: '1.3rem' }}>{p.avatar}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.nickname}</div>
                  <div style={{ fontSize: '0.75rem', color: p.isSaboteur ? '#f87171' : '#38bdf8' }}>
                    {p.isSaboteur ? '😈 The Saboteur' : '🛡️ Compliance Auditor'}
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#38bdf8' }}>
                {p.score} pts
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn-secondary" onClick={onLeave}>
          <RotateCcw size={18} />
          <span>Return to Mode Selection</span>
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW: EMERGENCY STANDUP OVERLAY
  // ==========================================
  if (stage === 'STANDUP') {
    return (
      <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
        <div className="card" style={{ border: '2px solid #ef4444', padding: '2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={32} color="#ef4444" style={{ animation: 'bounce 1s infinite' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f87171', margin: 0 }}>
              EMERGENCY COMPLIANCE STANDUP
            </h2>
            <AlertTriangle size={32} color="#ef4444" style={{ animation: 'bounce 1s infinite' }} />
          </div>

          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1rem' }}>
            Called by: <strong>{standupData?.initiatorNickname}</strong>. Debate suspect activity and vote to eject the Saboteur!
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#450a0a', border: '1px solid #ef4444', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '1.25rem', fontWeight: 900, color: '#fca5a5', marginBottom: '2rem' }}>
            <Clock size={20} />
            <span>Time Remaining: {standupTimeLeft}s</span>
          </div>

          {standupOutcomeMessage ? (
            <div style={{
              background: standupOutcomeMessage.wasSaboteur ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              border: `2px solid ${standupOutcomeMessage.wasSaboteur ? '#22c55e' : '#ef4444'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {standupOutcomeMessage.wasSaboteur ? '🎯🎉' : '❌🚨'}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: standupOutcomeMessage.wasSaboteur ? '#4ade80' : '#f87171', marginBottom: '0.5rem' }}>
                {standupOutcomeMessage.message}
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                Resuming server operations in 4 seconds...
              </p>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
                Cast Your Suspect Vote:
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {standupData?.players?.map((p) => {
                  const isMe = p.id === socket?.id;
                  const isSelected = votedSuspectId === p.id;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={Boolean(votedSuspectId) || isMe}
                      onClick={() => handleCastVote(p.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(239, 68, 68, 0.3)' : 'var(--bg-surface-elevated)',
                        border: `2px solid ${isSelected ? '#ef4444' : 'var(--border-color)'}`,
                        color: '#ffffff',
                        cursor: votedSuspectId || isMe ? 'default' : 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        opacity: isMe ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>{p.avatar}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.nickname} {isMe && '(You)'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {p.patchesApplied} Patches Applied
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span style={{ background: '#ef4444', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                          VOTED
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="btn-secondary"
                disabled={Boolean(votedSuspectId)}
                onClick={() => handleCastVote('SKIP')}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <span>{votedSuspectId === 'SKIP' ? '✓ Vote Skipped' : 'Skip / Abstain Vote'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: HOST SCREEN (Terminal & Compliance Dashboard)
  // ==========================================
  if (role === 'HOST') {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Top Header */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🕵️⚡</span>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                  Server Room: Compliance Security Grid
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Room PIN: <strong>{roomPin}</strong> • Continuous Asynchronous Patch Race
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 900, color: serverTimeLeft <= 30 ? '#ef4444' : '#38bdf8' }}>
                <Clock size={22} />
                <span>{formatTimer(serverTimeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Compliance Progress Bar */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
              <Shield size={20} color="#38bdf8" />
              <span>Overall Infrastructure Compliance Progress</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: compliancePercent >= 80 ? '#4ade80' : '#38bdf8' }}>
              {compliancePercent}% / 100%
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', height: '22px', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{
              width: `${compliancePercent}%`,
              height: '100%',
              background: compliancePercent >= 80 ? 'linear-gradient(90deg, #10b981, #22c55e)' : 'linear-gradient(90deg, #0284c7, #38bdf8)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Two Columns: Subsystems & Terminal Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Subsystems Status */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#38bdf8" />
              <span>Subsystem Integrity Metrics</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subsystems.map(sub => (
                <div key={sub.id} style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span style={{ color: '#ffffff' }}>{sub.name}</span>
                    <span style={{ color: sub.progress >= 100 ? '#4ade80' : '#38bdf8' }}>{sub.progress}%</span>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, sub.progress)}%`,
                      height: '100%',
                      background: sub.progress >= 100 ? '#22c55e' : '#0284c7',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Event Logs */}
          <div className="card" style={{ padding: '1.5rem', background: '#020617', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
              <Terminal size={18} />
              <span>Live Terminal Activity Feed</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.82rem' }}>
              {terminalLogs.map((log, idx) => {
                let color = '#94a3b8';
                if (log.type === 'patch') color = '#4ade80';
                if (log.type === 'glitch' || log.type === 'alarm') color = '#f87171';
                if (log.type === 'audit') color = '#facc15';

                return (
                  <div key={idx} style={{ color, display: 'flex', gap: '0.4rem' }}>
                    <span style={{ color: '#475569' }}>&gt;</span>
                    <span>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Connected Auditors / Crew List */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#f59e0b" />
            <span>Active Team Security Personnel</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {players.map(p => (
              <div
                key={p.id}
                style={{
                  background: p.isFrozen ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${p.isFrozen ? '#ef4444' : 'var(--border-color)'}`,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{p.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                      {p.nickname} {p.isFrozen && '(FROZEN)'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {p.patchesApplied} Patches
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#38bdf8' }}>
                  {p.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: PLAYER SCREEN (Mobile & Desktop)
  // ==========================================
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      {/* Role Banner */}
      <div style={{
        background: isSaboteur ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.25), rgba(153, 27, 27, 0.4))' : 'linear-gradient(90deg, rgba(56, 189, 248, 0.2), rgba(30, 58, 138, 0.3))',
        border: `2px solid ${isSaboteur ? '#ef4444' : '#38bdf8'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{isSaboteur ? '😈' : '🛡️'}</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: isSaboteur ? '#f87171' : '#38bdf8' }}>
              {isSaboteur ? 'SECRET ROLE: THE SABOTEUR' : 'SECRET ROLE: COMPLIANCE AUDITOR'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              {isSaboteur ? 'Inject glitches & slow down compliance before timer expires!' : 'Answer drills, earn AP, and patch the server subsystems to 100%!'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#0284c7', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.9rem' }}>
          <Zap size={16} />
          <span>{ap} AP</span>
        </div>
      </div>

      {/* Global Server Metrics Bar */}
      <div className="card" style={{ marginBottom: '1rem', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 800 }}>
          <span style={{ color: '#ffffff' }}>System Compliance: {compliancePercent}%</span>
          <span style={{ color: serverTimeLeft <= 30 ? '#ef4444' : '#38bdf8' }}>Clock: {formatTimer(serverTimeLeft)}</span>
        </div>
        <div style={{ background: 'var(--bg-surface)', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${compliancePercent}%`, height: '100%', background: '#38bdf8', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Action Center (Spend AP) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          disabled={ap < 2}
          onClick={() => handleApplyPatch(subsystems[0]?.id || 'auth', false)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: ap >= 2 ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-surface)',
            border: `1px solid ${ap >= 2 ? '#22c55e' : 'var(--border-color)'}`,
            color: '#ffffff',
            cursor: ap >= 2 ? 'pointer' : 'default',
            textAlign: 'center',
            opacity: ap >= 2 ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🛠️</div>
          <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Patch (+5%)</div>
          <div style={{ fontSize: '0.7rem', color: '#4ade80' }}>Cost: 2 AP</div>
        </button>

        <button
          type="button"
          disabled={ap < 3}
          onClick={() => setShowAuditModal(true)}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: ap >= 3 ? 'rgba(234, 179, 8, 0.2)' : 'var(--bg-surface)',
            border: `1px solid ${ap >= 3 ? '#eab308' : 'var(--border-color)'}`,
            color: '#ffffff',
            cursor: ap >= 3 ? 'pointer' : 'default',
            textAlign: 'center',
            opacity: ap >= 3 ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>📡</div>
          <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Audit Ping</div>
          <div style={{ fontSize: '0.7rem', color: '#facc15' }}>Cost: 3 AP</div>
        </button>

        <button
          type="button"
          disabled={ap < 4}
          onClick={handleCallStandup}
          style={{
            padding: '0.75rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: ap >= 4 ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
            border: `1px solid ${ap >= 4 ? '#ef4444' : 'var(--border-color)'}`,
            color: '#ffffff',
            cursor: ap >= 4 ? 'pointer' : 'default',
            textAlign: 'center',
            opacity: ap >= 4 ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🚨</div>
          <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Standup</div>
          <div style={{ fontSize: '0.7rem', color: '#f87171' }}>Cost: 4 AP</div>
        </button>
      </div>

      {/* Saboteur Special Exploit Button */}
      {isSaboteur && (
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            type="button"
            disabled={ap < 2}
            onClick={() => handleApplyPatch(subsystems[0]?.id || 'auth', true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: ap >= 2 ? 'rgba(239, 68, 68, 0.3)' : 'var(--bg-surface)',
              border: `2px dashed ${ap >= 2 ? '#ef4444' : 'var(--border-color)'}`,
              color: '#ffffff',
              cursor: ap >= 2 ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}
          >
            <span>😈 INJECT SABOTAGE GLITCH (-5% Compliance • Cost: 2 AP)</span>
          </button>
        </div>
      )}

      {/* Fast-Fire Drill Question Box */}
      {currentQuestion ? (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
              {currentQuestion.domainName || 'CPACC Drill'}
            </span>
            <span style={{ background: '#334155', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
              +{currentQuestion.difficulty === 'hard' ? 3 : currentQuestion.difficulty === 'medium' ? 2 : 1} AP
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {currentQuestion.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {currentQuestion.choices?.map(choice => {
              const isSelected = selectedChoice === choice.id;
              let choiceBg = 'var(--bg-surface)';
              let choiceBorder = '1px solid var(--border-color)';

              if (answeredFeedback) {
                if (choice.id === answeredFeedback.correctChoiceId) {
                  choiceBg = 'rgba(34, 197, 94, 0.2)';
                  choiceBorder = '2px solid #22c55e';
                } else if (isSelected) {
                  choiceBg = 'rgba(239, 68, 68, 0.2)';
                  choiceBorder = '2px solid #ef4444';
                }
              } else if (isSelected) {
                choiceBg = 'rgba(56, 189, 248, 0.2)';
                choiceBorder = '2px solid #38bdf8';
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
                    padding: '0.85rem 1rem',
                    textAlign: 'left',
                    color: '#ffffff',
                    cursor: answeredFeedback ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ background: '#334155', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                    {choice.id}
                  </span>
                  <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                    {choice.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#94a3b8' }}>Fetching next fast-fire question...</p>
        </div>
      )}

      {/* Audit Ping Modal */}
      {showAuditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} color="#eab308" />
              <span>Run Audit Ping on Suspect</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Select a teammate to inspect their recent answer accuracy log. Costs 3 AP.
            </p>

            {auditReport ? (
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{auditReport.targetAvatar}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>{auditReport.targetNickname}</div>
                <div style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 900, color: auditReport.suspicion === 'HIGH' ? '#f87171' : auditReport.suspicion === 'MEDIUM' ? '#facc15' : '#4ade80' }}>
                  Suspicion Rating: {auditReport.suspicion}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Recent Accuracy: {auditReport.accuracy}% across {auditReport.answersCount} answers
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {players.filter(p => p.id !== socket?.id && !p.isFrozen).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleRunAuditPing(p.id)}
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
                      <span style={{ fontSize: '1.4rem' }}>{p.avatar}</span>
                      <span style={{ fontWeight: 700 }}>{p.nickname}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>
                      Scan &rarr;
                    </span>
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
