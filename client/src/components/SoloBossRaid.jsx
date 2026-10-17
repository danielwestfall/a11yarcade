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
  ArrowRight,
  BookOpen,
  RotateCcw,
  Bot
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import bossRaidsData from '../data/boss_raids.json';

const SHAPE_CONFIG = {
  triangle: { icon: '▲', color: '#ef4444', label: 'Red Triangle' },
  diamond: { icon: '◆', color: '#38bdf8', label: 'Electric Diamond' },
  circle: { icon: '●', color: '#f59e0b', label: 'Amber Flare Circle' },
  square: { icon: '■', color: '#10b981', label: 'Emerald Square' }
};

const AI_SQUADMATES = [
  { id: 'bot-ada', nickname: 'Ada Lovelace', role: 'Screen Reader Specialist', avatar: '👩‍💻' },
  { id: 'bot-alex', nickname: 'Auditor Alex', role: 'Legal Policy Recon', avatar: '🕵️' },
  { id: 'bot-tina', nickname: 'Turbo Tina', role: 'Sprint Auditor', avatar: '🚀' }
];

export default function SoloBossRaid({ onBack }) {
  const scenario = bossRaidsData[0];
  const [bossHp, setBossHp] = useState(scenario ? scenario.maxHp : 500);
  const [teamHp, setTeamHp] = useState(scenario ? scenario.maxTeamHp : 200);
  const [shields, setShields] = useState(() => {
    if (!scenario) return {};
    const s = {};
    Object.keys(scenario.shields).forEach(k => {
      s[k] = { ...scenario.shields[k], hp: scenario.shields[k].maxHp };
    });
    return s;
  });
  const [completedNodeIds, setCompletedNodeIds] = useState(new Set());
  const [activeBuffs, setActiveBuffs] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isCapstone, setIsCapstone] = useState(false);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [combatOutcome, setCombatOutcome] = useState(null);
  const [score, setScore] = useState(0);
  const [damageDealtTotal, setDamageDealtTotal] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  useEffect(() => {
    soundManager.playBossRoar();
  }, []);

  const allShieldsBroken = Object.values(shields).every(s => s.hp <= 0);

  const handleSelectNode = (node) => {
    soundManager.playClick();
    setActiveNode(node);
    setActiveQuestion(node);
    setIsCapstone(false);
    setPlayerChoice(null);
    setCombatOutcome(null);
    setLiveAnnouncement(`Selected node: ${node.title}. Question: ${node.question}`);
  };

  const handleStartCapstone = () => {
    soundManager.playChallengeAlert();
    setIsCapstone(true);
    setActiveNode(null);
    setActiveQuestion(scenario.capstone);
    setPlayerChoice(null);
    setCombatOutcome(null);
    setLiveAnnouncement(`All shields shattered! Capstone active: ${scenario.capstone.title}`);
  };

  const handleSubmitAnswer = (choice) => {
    if (playerChoice) return;
    soundManager.playClick();
    setPlayerChoice(choice.id);

    const isCorrect = choice.isCorrect;

    if (isCapstone) {
      if (isCorrect) {
        soundManager.playBossDamage();
        setTimeout(() => soundManager.playVictoryFanfare(), 300);
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        setBossHp(0);
        setWon(true);
        setIsFinished(true);
        setDamageDealtTotal(prev => prev + 200);
        setScore(prev => prev + 300);
      } else {
        soundManager.playIncorrect();
        const nextHp = Math.max(0, teamHp - 40);
        setTeamHp(nextHp);
        setCombatOutcome({
          isCorrect: false,
          counterDmgTaken: 40,
          explanation: scenario.capstone.explanation,
          cpaccRef: scenario.capstone.cpaccRef
        });
        if (nextHp <= 0) {
          setWon(false);
          setIsFinished(true);
        }
      }
      return;
    }

    // Standard Node Combat
    let dmg = activeNode.damage || 50;
    let shieldShattered = false;
    let buffUnlocked = null;
    let aegisAbsorbed = false;

    if (isCorrect) {
      soundManager.playBossDamage();
      if (activeBuffs.some(b => b.id === 'buff-legal-pierce')) {
        dmg = Math.round(dmg * 1.25);
      }

      // Damage target shield
      const shieldKey = Object.keys(shields).find(k => {
        const branch = scenario.branches.find(b => b.shieldTarget === k);
        return branch && branch.nodes.some(n => n.id === activeNode.id);
      }) || 'procurement';

      setShields(prev => {
        const updated = { ...prev };
        if (updated[shieldKey] && updated[shieldKey].hp > 0) {
          const remainingShieldHp = updated[shieldKey].hp;
          const overflowDmg = Math.max(0, dmg - remainingShieldHp);
          const nextShieldHp = Math.max(0, updated[shieldKey].hp - dmg);
          updated[shieldKey] = { ...updated[shieldKey], hp: nextShieldHp };
          if (nextShieldHp === 0) {
            shieldShattered = true;
            if (overflowDmg > 0) {
              setBossHp(b => Math.max(0, b - overflowDmg));
            }
            setTimeout(() => soundManager.playShieldBreak(), 250);
          }
        } else {
          setBossHp(b => Math.max(0, b - dmg));
        }
        return updated;
      });

      // Heal team if buff active
      if (activeBuffs.some(b => b.id === 'buff-team-surge')) {
        setTeamHp(t => Math.min(scenario.maxTeamHp, t + 25));
      }

      // Unlock buff
      if (activeNode.buff && !activeBuffs.some(b => b.id === activeNode.buff.id)) {
        buffUnlocked = activeNode.buff;
        setActiveBuffs(prev => [...prev, activeNode.buff]);
        setTimeout(() => soundManager.playBuffUnlocked(), 450);

        if (activeNode.buff.id === 'buff-combo-strike') {
          setBossHp(b => Math.max(0, b - 50));
          dmg += 50;
        }
      }

      setCompletedNodeIds(prev => new Set([...prev, activeNode.id]));
      setDamageDealtTotal(prev => prev + dmg);
      setScore(prev => prev + 100);

      // AI Squadmate support attack!
      const randomBot = AI_SQUADMATES[Math.floor(Math.random() * AI_SQUADMATES.length)];
      setBossHp(b => Math.max(0, b - 15));
      setDamageDealtTotal(prev => prev + 15);
    } else {
      soundManager.playIncorrect();
      const aegisIdx = activeBuffs.findIndex(b => b.id === 'buff-aegis-shield');
      if (aegisIdx >= 0) {
        aegisAbsorbed = true;
        setActiveBuffs(prev => prev.filter((_, i) => i !== aegisIdx));
      } else {
        const nextHp = Math.max(0, teamHp - 25);
        setTeamHp(nextHp);
        if (nextHp <= 0) {
          setWon(false);
          setIsFinished(true);
        }
      }
    }

    setCombatOutcome({
      isCorrect,
      damageDealt: dmg,
      counterDmgTaken: isCorrect ? 0 : 25,
      aegisAbsorbed,
      shieldShattered,
      buffUnlocked,
      explanation: activeNode.explanation,
      cpaccRef: activeNode.cpaccRef
    });
  };

  const handleReturnToTechTree = () => {
    soundManager.playClick();
    setActiveNode(null);
    setActiveQuestion(null);
    setCombatOutcome(null);
    setIsCapstone(false);
  };

  const handleResetRaid = () => {
    soundManager.playClick();
    setBossHp(scenario.maxHp);
    setTeamHp(scenario.maxTeamHp);
    const s = {};
    Object.keys(scenario.shields).forEach(k => {
      s[k] = { ...scenario.shields[k], hp: scenario.shields[k].maxHp };
    });
    setShields(s);
    setCompletedNodeIds(new Set());
    setActiveBuffs([]);
    setActiveNode(null);
    setActiveQuestion(null);
    setCombatOutcome(null);
    setIsFinished(false);
    setWon(false);
    setScore(0);
    setDamageDealtTotal(0);
    soundManager.playBossRoar();
  };

  // ==========================================
  // VIEW 1: GAME OVER / VICTORY / DEFEAT
  // ==========================================
  if (isFinished) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <article className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', border: `3px solid ${won ? '#10b981' : '#ef4444'}`, boxShadow: '8px 8px 0px 0px #040810' }}>
          <div style={{ fontSize: '5rem', marginBottom: '0.75rem' }}>
            {won ? '🏆🎉' : '💀💥'}
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", color: won ? '#10b981' : '#ef4444', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {won ? 'SOLO RAID VICTORY: MONOLITH DISMANTLED!' : 'SOLO RAID FAILED: SQUAD OVERWHELMED!'}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 2rem auto', lineHeight: 1.55 }}>
            {won
              ? 'Tremendous solo leadership! You coordinated your AI peer squad, shattered all 3 elemental shields, and landed the final Governance Capstone strike!'
              : 'The Monolith defenses counter-attacked and overwhelmed your squad. Review the Body of Knowledge and re-engage!'}
          </p>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#060e20', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', fontFamily: "'Space Mono', monospace" }}>
                {damageDealtTotal} DMG
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>TOTAL DAMAGE DEALT</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', fontFamily: "'Space Mono', monospace" }}>
                {completedNodeIds.size} / 6
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>TECH NODES CLEARED</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#c084fc', fontFamily: "'Space Mono', monospace" }}>
                +{score} XP
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>EXPERIENCE EARNED</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary arcade-btn-secondary"
              onClick={handleResetRaid}
              style={{ padding: '0.85rem 2rem', fontSize: '1rem', background: '#facc15', borderColor: '#facc15', color: '#090d16', fontWeight: 900 }}
            >
              <RotateCcw size={18} />
              <span>Retry Boss Raid</span>
            </button>

            {onBack && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onBack}
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                ← Return to Solo Hub
              </button>
            )}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '7rem' }}>
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {/* Top Boss HUD */}
      <section aria-labelledby="solo-boss-hud" className="card" style={{ padding: '1.5rem', border: '2px solid var(--border-bright)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(236, 72, 153, 0.15)', border: '2px solid #ec4899', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0 }}>
              {scenario.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#0b1326', border: '1px solid #ec4899', color: '#f472b6', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  [SOLO RAID SIMULATOR]
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                  AI BOT PEERS ACTIVE
                </span>
              </div>
              <h1 id="solo-boss-hud" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0 0 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                {scenario.name}
              </h1>
            </div>
          </div>

          {/* Squad Health */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#060e20', border: '1px solid var(--border-color)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <Heart size={20} color="#ef4444" fill="#ef4444" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>
                SQUAD INTEGRITY
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: teamHp > 50 ? '#10b981' : '#ef4444', fontFamily: "'Space Mono', monospace" }}>
                {teamHp} / {scenario.maxTeamHp} HP
              </div>
            </div>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace" }}>
            <span style={{ color: '#ec4899', fontWeight: 800 }}>MONOLITH VULNERABILITY METER</span>
            <span style={{ color: '#ffffff', fontWeight: 900 }}>{bossHp} / {scenario.maxHp} HP</span>
          </div>
          <div style={{ background: '#060e20', border: '1px solid var(--border-color)', height: '22px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, #ec4899 0%, #ef4444 100%)', height: '100%', width: `${Math.max(0, (bossHp / scenario.maxHp) * 100)}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* 3 Shields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {Object.entries(shields).map(([key, s]) => {
            const isBroken = s.hp <= 0;
            return (
              <div key={key} style={{ background: isBroken ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)', border: `2px solid ${isBroken ? '#10b981' : s.color}`, padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

        {/* AI Squadmates Roster */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Bot size={14} color="#38bdf8" />
            <span>AI SQUADMATES:</span>
          </span>
          {AI_SQUADMATES.map(bot => (
            <span key={bot.id} style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#060e20', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <span>{bot.avatar}</span>
              <strong style={{ color: '#ffffff' }}>{bot.nickname}</strong>
              <span style={{ color: '#94a3b8' }}>({bot.role})</span>
            </span>
          ))}
        </div>
      </section>

      {/* Tech Tree Stage */}
      {(!activeQuestion && !combatOutcome) && (
        <section aria-label="Tech Tree Canvas" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                  Initiate the Governance Capstone scenario to strike down the Monolith!
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {scenario.branches.map(b => (
              <div key={b.id} className="card" style={{ padding: '1.5rem', border: '2px solid var(--border-color)', borderTop: `5px solid ${b.color}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: b.color, fontWeight: 800 }}>
                    [BRANCH {b.id.slice(-1).toUpperCase()} // DOM-{b.domain}]
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {b.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {b.nodes.map(n => {
                    const isCompleted = completedNodeIds.has(n.id);
                    let isAvailable = !isCompleted;
                    if (n.tier > 1) {
                      const prevNode = b.nodes.find(pn => pn.tier === n.tier - 1);
                      if (prevNode && !completedNodeIds.has(prevNode.id)) {
                        isAvailable = false;
                      }
                    }

                    return (
                      <div
                        key={n.id}
                        style={{
                          background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : isAvailable ? 'var(--bg-surface-elevated)' : '#060e20',
                          border: `2px solid ${isCompleted ? '#10b981' : isAvailable ? b.color : 'var(--border-color)'}`,
                          padding: '1rem',
                          borderRadius: 'var(--radius-sm)',
                          opacity: isAvailable || isCompleted ? 1 : 0.6
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: isCompleted ? '#10b981' : b.color }}>
                            TIER {n.tier} // {n.damage} DMG
                          </span>
                          {isCompleted && (
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

                        {isAvailable && !isCompleted && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleSelectNode(n)}
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

      {/* Active Question Combat */}
      {(activeQuestion && !combatOutcome) && (
        <article className="card" style={{ padding: '2rem', border: '2px solid var(--border-bright)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, background: '#0b1326', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
              {isCapstone ? '🔥 FINAL CAPSTONE SHOWDOWN' : `COMBAT NODE: ${activeNode?.title}`}
            </span>
            <span style={{ fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#10b981', fontWeight: 800 }}>
              POTENTIAL REWARD: +{isCapstone ? 200 : activeNode?.damage} DMG
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.45, margin: '0 0 1.5rem 0', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
            {activeQuestion.question}
          </h2>

          <div className="answers-grid" role="group" aria-label="Combat answer choices">
            {activeQuestion.choices.map((c, idx) => {
              const shape = SHAPE_CONFIG[c.shape] || SHAPE_CONFIG.triangle;
              const isSelected = playerChoice === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  className={`answer-btn ${c.shape}`}
                  onClick={() => handleSubmitAnswer(c)}
                  disabled={playerChoice !== null}
                  aria-pressed={isSelected}
                  aria-label={`${c.id}: ${shape.label}, ${c.text}`}
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
        </article>
      )}

      {/* Combat Debrief */}
      {combatOutcome && (
        <article className="card" style={{ padding: '2rem', border: `2px solid ${combatOutcome.isCorrect ? '#10b981' : '#ef4444'}` }}>
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
                  ? `Dealt ${combatOutcome.damageDealt} DMG + 15 DMG AI squad support!`
                  : combatOutcome.aegisAbsorbed
                  ? 'Boss counter-attack absorbed by Shift-Left Aegis!'
                  : `Squad suffered -${combatOutcome.counterDmgTaken} damage.`}
              </span>
            </div>
          </div>

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

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-primary arcade-btn-secondary"
              onClick={handleReturnToTechTree}
              style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 900, background: '#38bdf8', borderColor: '#38bdf8', color: '#090d16' }}
            >
              <span>RETURN TO TECH TREE (ENTER)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </article>
      )}

      {/* Dock */}
      <aside aria-label="Solo raid command deck" className="arcade-dock">
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
            <span style={{ color: '#ec4899', fontWeight: 800 }}>
              👾 Boss: {bossHp} HP Remaining
            </span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>
              ❤️ Squad: {teamHp} HP
            </span>
            <span>•</span>
            <span style={{ color: allShieldsBroken ? '#ec4899' : '#facc15' }}>
              {allShieldsBroken ? '⚠️ CAPSTONE STRIKE UNLOCKED' : 'Researching Tech Tree'}
            </span>
          </div>

          {onBack && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onBack}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              ← Return to Solo Hub
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
