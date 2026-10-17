import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield,
  Heart,
  Zap,
  Sword,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Compass,
  RotateCcw
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const SHAPE_CONFIG = {
  triangle: { icon: '▲', color: '#ef4444', label: 'Red Triangle' },
  diamond: { icon: '◆', color: '#38bdf8', label: 'Electric Diamond' },
  circle: { icon: '●', color: '#f59e0b', label: 'Amber Flare Circle' },
  square: { icon: '■', color: '#10b981', label: 'Emerald Square' }
};

export default function BossRaidMode({ socket, role, roomPin, onLeave }) {
  const [treeData, setTreeData] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [combatOutcome, setCombatOutcome] = useState(null);
  const [isCapstone, setIsCapstone] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  useEffect(() => {
    if (!socket) return;

    soundManager.playBossRoar();
    socket.emit('boss-get-tree');

    // 1. Boss Game Started
    socket.on('boss-game-started', (data) => {
      setTreeData(data.tree);
      setActiveNode(null);
      setActiveQuestion(null);
      setCombatOutcome(null);
      setLiveAnnouncement(data.message || 'Boss raid initiated!');
    });

    // 2. Tech Tree Stage
    socket.on('boss-stage-tech-tree', (data) => {
      setTreeData(data.tree);
      setActiveNode(null);
      setActiveQuestion(null);
      setCombatOutcome(null);
      setIsCapstone(false);
      setLiveAnnouncement(data.message || 'Returned to tech tree.');
    });

    // 3. Node Activated
    socket.on('boss-node-activated', (data) => {
      soundManager.playTick(1);
      setActiveNode(data.node);
      setActiveQuestion(data.question);
      setTimeLeft(data.timeLeft || 45);
      setPlayerChoice(null);
      setCombatOutcome(null);
      setLiveAnnouncement(`Combat node activated: ${data.node.title}. Question: ${data.question.stem}`);
    });

    // 4. Combat Resolved
    socket.on('boss-combat-resolved', (data) => {
      setCombatOutcome(data);
      if (data.isCorrect) {
        soundManager.playBossDamage();
        if (data.shieldShattered) {
          setTimeout(() => soundManager.playShieldBreak(), 250);
        }
        if (data.buffUnlocked) {
          setTimeout(() => soundManager.playBuffUnlocked(), 450);
        }
        setLiveAnnouncement(`Direct hit! Dealt ${data.damageDealt} damage. ${data.explanation}`);
      } else {
        soundManager.playIncorrect();
        setLiveAnnouncement(`Strike failed. Boss counter-attacked for ${data.counterDmgTaken} damage.`);
      }
    });

    // 5. Capstone Activated
    socket.on('boss-capstone-activated', (data) => {
      soundManager.playChallengeAlert();
      setIsCapstone(true);
      setActiveNode(null);
      setActiveQuestion(data.question);
      setPlayerChoice(null);
      setCombatOutcome(null);
      setLiveAnnouncement(`ALL SHIELDS SHATTERED! Capstone Strike active: ${data.title}`);
    });

    // 6. Capstone Failed
    socket.on('boss-capstone-failed', (data) => {
      soundManager.playIncorrect();
      setCombatOutcome({
        isCorrect: false,
        counterDmgTaken: 40,
        explanation: data.explanation,
        cpaccRef: data.cpaccRef
      });
      setLiveAnnouncement(`Capstone strike was deflected! Boss struck back for 40 damage.`);
    });

    // 7. Game Finished
    socket.on('boss-game-finished', (data) => {
      setGameResult(data);
      if (data.won) {
        soundManager.playVictoryFanfare();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        setLiveAnnouncement('VICTORY! The Enterprise Monolith has been dismantled!');
      } else {
        soundManager.playIncorrect();
        setLiveAnnouncement('DEFEAT! The squad health reached zero. The Monolith survived.');
      }
    });

    return () => {
      socket.off('boss-game-started');
      socket.off('boss-stage-tech-tree');
      socket.off('boss-node-activated');
      socket.off('boss-combat-resolved');
      socket.off('boss-capstone-activated');
      socket.off('boss-capstone-failed');
      socket.off('boss-game-finished');
    };
  }, [socket]);

  const handleSelectNode = (nodeId) => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('boss-select-node', { nodeId }, (res) => {
      if (!res?.success) {
        console.warn('Node selection error:', res?.error);
      }
    });
  };

  const handleSubmitAnswer = (choiceId) => {
    if (!socket || playerChoice) return;
    soundManager.playClick();
    setPlayerChoice(choiceId);

    if (isCapstone) {
      socket.emit('boss-submit-capstone', { choiceId });
    } else {
      socket.emit('boss-submit-answer', { choiceId });
    }
  };

  const handleStartCapstone = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('boss-start-capstone', (res) => {
      if (!res?.success) {
        console.warn('Capstone start error:', res?.error);
      }
    });
  };

  const handleNextStage = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('next-stage');
  };

  // ==========================================
  // VIEW 1: GAME OVER / VICTORY / DEFEAT
  // ==========================================
  if (gameResult) {
    const isWon = gameResult.won;

    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
        <article className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', border: `3px solid ${isWon ? '#10b981' : '#ef4444'}`, boxShadow: '8px 8px 0px 0px #040810' }}>
          <div style={{ fontSize: '5rem', marginBottom: '0.75rem' }}>
            {isWon ? '🏆🎉' : '💀💥'}
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", color: isWon ? '#10b981' : '#ef4444', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {isWon ? 'RAID CONQUERED: MONOLITH DISMANTLED!' : 'RAID FAILED: SQUAD OVERWHELMED!'}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 2rem auto', lineHeight: 1.55 }}>
            {isWon
              ? 'Incredible teamwork! Your squad dismantled all 3 elemental shields and executed the sustainable Governance Capstone strategy!'
              : 'The Monolith counter-attacked with legacy compliance blockers and drained your squad health. Regroup and rethink your Tech Tree strategy!'}
          </p>

          {/* MVP Podium Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {gameResult.podium && gameResult.podium.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: `2px solid ${idx === 0 ? '#facc15' : 'var(--border-color)'}`,
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: idx === 0 ? '#facc15' : '#94a3b8' }}>
                    {idx === 0 ? '👑 RAID MVP' : `#${idx + 1} CADET`}
                  </span>
                  <span style={{ fontSize: '1.5rem' }}>{p.avatar}</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{p.nickname}</div>
                <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontFamily: "'Space Mono', monospace", marginTop: '0.25rem' }}>
                  ⚔️ {p.damageDealt || 0} DMG Dealt
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-primary arcade-btn-secondary"
            onClick={onLeave}
            style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem', fontWeight: 900, background: '#38bdf8', borderColor: '#38bdf8', color: '#090d16' }}
          >
            ← Return to Lobby / Station
          </button>
        </article>
      </div>
    );
  }

  // Loading state
  if (!treeData) {
    return (
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
        [👾] COMMENCING ENTERPRISE TELEMETRY SCAN & TECH TREE MATRIX...
      </div>
    );
  }

  const allShieldsBroken = treeData.allShieldsBroken || Object.values(treeData.shields).every(s => s.hp <= 0);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '7rem' }}>
      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {/* ==========================================
          TOP BOSS RAID HUD BAR
          ========================================== */}
      <section aria-labelledby="boss-hud-title" className="card" style={{ padding: '1.5rem', border: '2px solid var(--border-bright)', background: 'var(--bg-surface)' }}>
        {/* Boss Profile & Squad Health */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Boss Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(236, 72, 153, 0.15)', border: '2px solid #ec4899', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0 }}>
              {treeData.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#0b1326', border: '1px solid #ec4899', color: '#f472b6', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  [CORP TITAN BOSS]
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                  PIN: #{roomPin}
                </span>
              </div>
              <h1 id="boss-hud-title" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0 0 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                {treeData.name}
              </h1>
            </div>
          </div>

          {/* Squad Health Meter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#060e20', border: '1px solid var(--border-color)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <Heart size={20} color="#ef4444" fill="#ef4444" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>
                SQUAD INTEGRITY
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: treeData.teamHp > 50 ? '#10b981' : '#ef4444', fontFamily: "'Space Mono', monospace" }}>
                {treeData.teamHp} / {treeData.maxTeamHp} HP
              </div>
            </div>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace" }}>
            <span style={{ color: '#ec4899', fontWeight: 800 }}>MONOLITH VULNERABILITY METER</span>
            <span style={{ color: '#ffffff', fontWeight: 900 }}>{treeData.bossHp} / {treeData.maxBossHp} HP</span>
          </div>
          <div style={{ background: '#060e20', border: '1px solid var(--border-color)', height: '22px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                background: 'linear-gradient(90deg, #ec4899 0%, #ef4444 100%)',
                height: '100%',
                width: `${Math.max(0, (treeData.bossHp / treeData.maxBossHp) * 100)}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* 3 Elemental Shields Status Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {treeData.shields && Object.entries(treeData.shields).map(([key, s]) => {
            const isBroken = s.hp <= 0;
            return (
              <div
                key={key}
                style={{
                  background: isBroken ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                  border: `2px solid ${isBroken ? '#10b981' : s.color}`,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isBroken ? '#10b981' : s.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {s.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 900, color: isBroken ? '#10b981' : '#ffffff' }}>
                      {isBroken ? '[SHATTERED]' : `${s.hp}/${s.maxHp} HP`}
                    </span>
                  </div>
                  <div style={{ background: '#060e20', height: '8px', borderRadius: '2px', overflow: 'hidden', marginTop: '0.35rem' }}>
                    <div style={{ background: isBroken ? '#10b981' : s.color, height: '100%', width: `${Math.max(0, (s.hp / s.maxHp) * 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Tech Buffs Bar */}
        {treeData.activeBuffs && treeData.activeBuffs.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#facc15', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={14} color="#facc15" />
              <span>ACTIVE RAID BUFFS:</span>
            </span>
            {treeData.activeBuffs.map((b) => (
              <span
                key={b.id}
                style={{
                  background: 'rgba(250, 204, 21, 0.12)',
                  border: '1px solid #facc15',
                  color: '#fef08a',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ==========================================
          STAGE A: TECH TREE DRAFTING VIEW
          ========================================== */}
      {(!activeQuestion && !combatOutcome) && (
        <section aria-label="Interactive Tech Tree Canvas" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Capstone Alert or Callout */}
          {allShieldsBroken ? (
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', border: '2px solid #ec4899', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 900, color: '#f472b6' }}>
                  [SHIELDS DOWN // VULNERABILITY DETECTED]
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                  ALL 3 ELEMENTAL SHIELDS SHATTERED!
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: 0 }}>
                  Deliver the final finishing blow by solving the Enterprise Governance Capstone scenario!
                </p>
              </div>

              <button
                type="button"
                className="btn-primary arcade-btn-secondary"
                onClick={handleStartCapstone}
                style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', fontWeight: 900, background: '#ec4899', borderColor: '#ec4899', color: '#ffffff' }}
              >
                <Sword size={20} />
                <span>[ ⚔️ EXECUTE CAPSTONE STRIKE ]</span>
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
              [SELECT AN AVAILABLE TECH NODE TO RESEARCH AND ATTACK]
            </div>
          )}

          {/* 3 Tech Tree Branches */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {treeData.branches && treeData.branches.map((b) => (
              <div
                key={b.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  border: '2px solid var(--border-color)',
                  borderTop: `5px solid ${b.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: b.color, fontWeight: 800 }}>
                    [BRANCH {b.id.slice(-1).toUpperCase()} // DOM-{b.domain}]
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {b.name}
                  </h3>
                </div>

                {/* Nodes inside branch */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {b.nodes.map((n) => {
                    return (
                      <div
                        key={n.id}
                        style={{
                          background: n.isCompleted
                            ? 'rgba(16, 185, 129, 0.1)'
                            : n.isAvailable
                            ? 'var(--bg-surface-elevated)'
                            : '#060e20',
                          border: `2px solid ${n.isCompleted ? '#10b981' : n.isAvailable ? b.color : 'var(--border-color)'}`,
                          padding: '1rem',
                          borderRadius: 'var(--radius-sm)',
                          opacity: n.isAvailable || n.isCompleted ? 1 : 0.6
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: n.isCompleted ? '#10b981' : b.color }}>
                            TIER {n.tier} // {n.damage} DMG
                          </span>
                          {n.isCompleted && (
                            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={13} />
                              <span>CLEARED</span>
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
                          {n.title}
                        </h4>

                        <div style={{ fontSize: '0.78rem', color: '#facc15', fontFamily: "'Space Mono', monospace", marginBottom: '0.75rem' }}>
                          Buff: {n.buff ? `${n.buff.icon} ${n.buff.name}` : 'N/A'}
                        </div>

                        {n.isAvailable && !n.isCompleted && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleSelectNode(n.id)}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              fontSize: '0.85rem',
                              fontFamily: "'Space Mono', monospace",
                              fontWeight: 800,
                              background: b.color,
                              borderColor: b.color,
                              color: '#090d16'
                            }}
                          >
                            [ ⚡ RESEARCH & ATTACK ]
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==========================================
          STAGE B: ACTIVE QUESTION / COMBAT VIEW
          ========================================== */}
      {(activeQuestion && !combatOutcome) && (
        <article className="card" style={{ padding: '2rem', border: '2px solid var(--border-bright)', boxShadow: '6px 6px 0px 0px #040810' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#0b1326', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
              {isCapstone ? '🔥 FINAL CAPSTONE SHOWDOWN' : `COMBAT NODE: ${activeNode?.title || 'TACTICAL STRIKE'}`}
            </span>

            <span style={{ fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#10b981', fontWeight: 800 }}>
              POTENTIAL REWARD: +{activeNode?.damage || 200} DMG
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.45, margin: '0 0 1.5rem 0', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
            {activeQuestion.stem}
          </h2>

          <div className="answers-grid" role="group" aria-label="Combat answer options">
            {activeQuestion.choices.map((c, idx) => {
              const shape = SHAPE_CONFIG[c.shape] || SHAPE_CONFIG.triangle;
              const isSelected = playerChoice === c.id;
              const isPurged = c.isPurged;

              return (
                <button
                  key={c.id}
                  type="button"
                  className={`answer-btn ${c.shape}`}
                  onClick={() => handleSubmitAnswer(c.id)}
                  disabled={playerChoice !== null || isPurged}
                  aria-pressed={isSelected}
                  aria-label={`${c.id}: ${shape.label}, ${c.text}`}
                  style={{
                    opacity: isPurged ? 0.35 : 1,
                    textDecoration: isPurged ? 'line-through' : 'none'
                  }}
                >
                  <span className="shape-badge" aria-hidden="true">
                    {shape.icon}
                  </span>
                  <span style={{ flex: 1, fontWeight: 700 }}>{c.text}</span>
                  <span className="shape-badge-key">Key: {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {playerChoice && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#38bdf8', fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>
              [🔒 STRIKE COORDINATES SUBMITTED // SIMULATING IMPACT...]
            </div>
          )}
        </article>
      )}

      {/* ==========================================
          STAGE C: COMBAT DEBRIEF VIEW
          ========================================== */}
      {combatOutcome && (
        <article className="card" style={{ padding: '2rem', border: `2px solid ${combatOutcome.isCorrect ? '#10b981' : '#ef4444'}`, boxShadow: '6px 6px 0px 0px #040810' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            {combatOutcome.isCorrect ? (
              <CheckCircle2 size={32} color="#10b981" />
            ) : (
              <XCircle size={32} color="#ef4444" />
            )}
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: combatOutcome.isCorrect ? '#10b981' : '#ef4444', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                {combatOutcome.isCorrect ? 'DIRECT HIT ON MONOLITH DEFENSES!' : 'STRIKE DEFLECTED // BOSS COUNTER-ATTACK!'}
              </h2>
              <span style={{ fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                {combatOutcome.isCorrect
                  ? `Dealt ${combatOutcome.damageDealt} DMG to Monolith defenses.`
                  : combatOutcome.aegisAbsorbed
                  ? 'Boss counter-attack was completely absorbed by Shift-Left Aegis!'
                  : `Squad suffered -${combatOutcome.counterDmgTaken} damage.`}
              </span>
            </div>
          </div>

          {/* Rationale & Citation */}
          <div style={{ background: '#060e20', border: '1px solid #38bdf8', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>
              <BookOpen size={16} color="#38bdf8" />
              <span>CPACC BODY OF KNOWLEDGE RATIONALE:</span>
            </div>
            <p style={{ color: '#f1f5f9', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              {combatOutcome.explanation}
            </p>
            {combatOutcome.cpaccRef && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                Citation: <strong style={{ color: '#38bdf8' }}>{combatOutcome.cpaccRef}</strong>
              </div>
            )}
          </div>

          {/* Next Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-primary arcade-btn-secondary"
              onClick={handleNextStage}
              style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 900, background: '#38bdf8', borderColor: '#38bdf8', color: '#090d16' }}
            >
              <span>RETURN TO TECH TREE (ENTER)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </article>
      )}

      {/* Fixed Bottom Command Deck */}
      <aside aria-label="Boss raid command deck" className="arcade-dock">
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
            <span style={{ color: '#ec4899', fontWeight: 800 }}>
              👾 Boss: {treeData.bossHp} HP Remaining
            </span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>
              ❤️ Squad: {treeData.teamHp} HP
            </span>
            <span>•</span>
            <span style={{ color: allShieldsBroken ? '#ec4899' : '#facc15' }}>
              {allShieldsBroken ? '⚠️ CAPSTONE STRIKE UNLOCKED' : 'Researching Tech Tree'}
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onLeave}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            Leave Raid
          </button>
        </div>
      </aside>
    </div>
  );
}
