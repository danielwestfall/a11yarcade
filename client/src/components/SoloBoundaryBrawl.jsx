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
  Sparkles,
  Bot
} from 'lucide-react';
import { soundManager } from '../utils/sound';

const FALLBACK_CARDS = [
  {
    id: "card-01",
    title: "Providing Live Captions on All Internal All-Hands Meetings",
    domain: 2,
    domainName: "Universal Design & WCAG",
    quadrant: "Q2",
    quadrantName: "High Organizational Impact / Universal Design",
    xPlacement: 75,
    yPlacement: 75,
    description: "A 10,000-employee company enables human CART captions and transcripts on all company-wide video broadcasts proactively, without requiring employees to disclose hearing disabilities.",
    rationale: "Proactive live captions embody Universal Design (UD) because they benefit individuals who are deaf/hard of hearing, non-native language speakers, and those in noisy environments. High organizational impact due to broad reach and inclusion culture.",
    cpaccRef: "Domain 2: Universal Design vs. Accommodations & WCAG 1.2.4 Captions"
  },
  {
    id: "card-02",
    title: "Constructing Ramp with 1:8 Slope Violating Building Code",
    domain: 3,
    domainName: "Standards, Laws & Management",
    quadrant: "Q1",
    quadrantName: "High Organizational Risk / Strict Compliance Floor",
    xPlacement: 20,
    yPlacement: 85,
    description: "A building manager constructs an entrance ramp with a steep 1:8 slope instead of the mandatory ADA 1:12 maximum, arguing 'at least a ramp is present.'",
    rationale: "Strict legal compliance violation under ADA Title III Physical Accessibility Guidelines. A 1:8 slope poses severe physical tipping hazards for wheelchair users, presenting maximum legal liability and safety risk.",
    cpaccRef: "Domain 3: ADA Title III Standards for Accessible Design & Physical Barriers"
  },
  {
    id: "card-03",
    title: "Adjusting Work Hours for Neurodivergent Employee with ADHD",
    domain: 1,
    domainName: "Disabilities, Challenges & AT",
    quadrant: "Q4",
    quadrantName: "Low Organizational Risk / Reasonable Accommodation",
    xPlacement: 80,
    yPlacement: 25,
    description: "A software engineer requests shifted core hours (10 AM to 6 PM) to align with ADHD focus patterns and executive function needs, with zero project deadline impact.",
    rationale: "Textbook ADA Title I Reasonable Workplace Accommodation. Zero capital cost, low operational friction, tailored specifically to an individual's cognitive disability.",
    cpaccRef: "Domain 1 & 3: ADA Title I Workplace Accommodations & Neurodiversity"
  },
  {
    id: "card-04",
    title: "Procuring SaaS Software without a VPAT / ACR for Federal Agency",
    domain: 3,
    domainName: "Standards, Laws & Management",
    quadrant: "Q1",
    quadrantName: "High Organizational Risk / Strict Compliance Floor",
    xPlacement: 25,
    yPlacement: 80,
    description: "A federal government IT department purchases commercial cloud software without obtaining an Accessibility Conformance Report (VPAT 2.4).",
    rationale: "Direct violation of Revised Section 508 federal procurement standards. High legal and administrative risk that can trigger federal vendor bid protests and remediation mandates.",
    cpaccRef: "Domain 3: Revised Section 508 Federal IT Procurement Standards"
  },
  {
    id: "card-05",
    title: "Providing Dark Mode & High Contrast Theme Toggle on Web Portal",
    domain: 2,
    domainName: "Universal Design & WCAG",
    quadrant: "Q4",
    quadrantName: "Low Organizational Risk / Universal Design Enhancement",
    xPlacement: 85,
    yPlacement: 20,
    description: "A retail bank implements user-customizable dark mode, high contrast themes, and fluid font-size scaling beyond standard WCAG AA requirements.",
    rationale: "Universal Design best practice (exceeding WCAG AAA). Low risk, highly beneficial for low-vision users, photophobia, migraines, and general consumer comfort.",
    cpaccRef: "Domain 2: Principles of Universal Design (Flexibility in Use & Low Physical Effort)"
  },
  {
    id: "card-06",
    title: "Demanding Medical Diagnosis Records to Permit Service Animal Entry",
    domain: 3,
    domainName: "Standards, Laws & Management",
    quadrant: "Q1",
    quadrantName: "High Organizational Risk / Strict Compliance Floor",
    xPlacement: 15,
    yPlacement: 90,
    description: "A hotel clerk refuses entry to a customer with a service dog unless the guest presents written proof of their medical condition and doctor's certification.",
    rationale: "Severe ADA Title III violation. Federal law permits staff to ask only two specific questions and strictly prohibits demanding medical documentation or proof of training.",
    cpaccRef: "Domain 3: ADA Title III Service Animals Regulations & Non-Discrimination"
  }
];

const AI_BOTS = [
  { id: 'bot-1', nickname: 'Dr. Alex Audits', avatar: '⚖️', style: 'Strict Floor Enforcer' },
  { id: 'bot-2', nickname: 'Dana Design', avatar: '🎨', style: 'Universal Design Champion' },
  { id: 'bot-3', nickname: 'Officer Ryan', avatar: '🛡️', style: 'Corporate Risk Specialist' }
];

export default function SoloBoundaryBrawl({ onBack }) {
  const [cards, setCards] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScores, setBotScores] = useState({ 'bot-1': 100, 'bot-2': 100, 'bot-3': 100 });
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [stage, setStage] = useState('SCRAMBLE'); // 'SCRAMBLE', 'CHALLENGE', 'PODIUM'
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [settledReport, setSettledReport] = useState(null);
  const [userVoted, setUserVoted] = useState(null);

  useEffect(() => {
    fetch('/api/boundary-cards')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCards(data.slice(0, 6));
        } else {
          setCards(FALLBACK_CARDS);
        }
      })
      .catch(() => setCards(FALLBACK_CARDS));
  }, []);

  // Handle Player Placing Card
  const handlePlaceCard = (cardId, quadrant) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    soundManager.playCardDrop();
    const newPlacement = {
      cardId,
      title: card.title,
      description: card.description,
      domainName: card.domainName,
      quadrant,
      placedBy: { id: 'player', nickname: 'You (Solo)', avatar: '🧠' },
      isVerified: false
    };

    setPlacements((prev) => [...prev.filter((p) => p.cardId !== cardId), newPlacement]);
    setPlayerScore((prev) => prev + 50);
    setSelectedCardId(null);

    // Trigger AI placement of remaining cards with a short delay
    setTimeout(() => {
      triggerAiTurn();
    }, 1200);
  };

  // Simulated AI Turn
  const triggerAiTurn = () => {
    const placedIds = new Set(placements.map((p) => p.cardId));
    const unplaced = cards.filter((c) => !placedIds.has(c.id));

    if (unplaced.length > 0) {
      const randomCard = unplaced[0];
      const randomBot = AI_BOTS[Math.floor(Math.random() * AI_BOTS.length)];
      // 70% chance bot places in correct quadrant, 30% distractor quadrant
      const targetQuadrant = Math.random() < 0.7 ? randomCard.quadrant : (randomCard.quadrant === 'Q1' ? 'Q4' : 'Q1');

      soundManager.playCardDrop();
      const botPlacement = {
        cardId: randomCard.id,
        title: randomCard.title,
        description: randomCard.description,
        domainName: randomCard.domainName,
        quadrant: targetQuadrant,
        placedBy: randomBot,
        isVerified: false
      };

      setPlacements((prev) => [...prev.filter((p) => p.cardId !== randomCard.id), botPlacement]);
      setBotScores((prev) => ({ ...prev, [randomBot.id]: prev[randomBot.id] + 50 }));
    } else {
      // All cards placed, trigger Challenge Arena!
      if (stage === 'SCRAMBLE') {
        setStage('CHALLENGE');
        soundManager.playEmergencyAlarm();
      }
    }
  };

  // Initiate Challenge
  const handleStartChallenge = (cardId) => {
    const placement = placements.find((p) => p.cardId === cardId);
    const card = cards.find((c) => c.id === cardId);
    if (!placement || !card) return;

    soundManager.playChallengeAlert();
    setActiveChallenge({
      cardId,
      cardTitle: card.title,
      cardDescription: card.description,
      currentQuadrant: placement.quadrant,
      challenger: { id: 'player', nickname: 'You (Solo)', avatar: '🧠' },
      defender: placement.placedBy,
      thumbsUpCount: 1, // Defender starts with 1
      thumbsDownCount: 1 // Challenger starts with 1
    });
    setUserVoted(null);
    setSettledReport(null);
  };

  // Vote in Challenge
  const handleVote = (vote) => {
    if (!activeChallenge || userVoted) return;
    setUserVoted(vote);
    soundManager.playVoteChime();

    const card = cards.find((c) => c.id === activeChallenge.cardId);
    const placement = placements.find((p) => p.cardId === activeChallenge.cardId);

    // AI bot simulated votes
    const upVotes = vote === 'UP' ? 2 : 1;
    const downVotes = vote === 'DOWN' ? 2 : 1;

    setTimeout(() => {
      const roomOverthrew = downVotes > upVotes;

      if (roomOverthrew) {
        setPlayerScore((prev) => prev + (vote === 'DOWN' ? 150 : 0));
        soundManager.playCorrect();
        if (placement && card) {
          placement.quadrant = card.quadrant;
          placement.isVerified = true;
          placement.placedBy = { id: 'player', nickname: 'You (Solo)', avatar: '🧠' };
        }
      } else {
        setPlayerScore((prev) => prev + (vote === 'UP' ? 200 : 0));
        soundManager.playStreak();
        if (placement) placement.isVerified = true;
      }

      setSettledReport({
        winner: roomOverthrew ? 'CHALLENGER' : 'DEFENDER',
        correctQuadrant: card.quadrant,
        correctQuadrantName: card.quadrantName,
        rationale: card.rationale,
        cpaccRef: card.cpaccRef
      });
      setActiveChallenge(null);
    }, 1200);
  };

  const handleFinishGame = () => {
    setStage('PODIUM');
    soundManager.playWinnerFanfare();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const quadrants = [
    {
      id: 'Q1',
      title: 'Q1: High Risk / Strict Floor',
      subtitle: 'Mandatory Standards & Legal Floor',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      icon: '⚖️'
    },
    {
      id: 'Q2',
      title: 'Q2: High Impact / Universal Design',
      subtitle: 'Systemic Inclusion & Organizational Reach',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      icon: '🌍'
    },
    {
      id: 'Q3',
      title: 'Q3: Low Risk / Strict Floor',
      subtitle: 'Checklist Hygiene & Baseline Code',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      icon: '📋'
    },
    {
      id: 'Q4',
      title: 'Q4: Low Risk / UD Enhancement',
      subtitle: 'Usability Flourish & Flexible Options',
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.08)',
      borderColor: 'rgba(14, 165, 233, 0.4)',
      icon: '✨'
    }
  ];

  const placedCardIds = new Set(placements.map((p) => p.cardId));
  const unplacedCards = cards.filter((c) => !placedCardIds.has(c.id));

  if (stage === 'PODIUM') {
    return (
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆⚖️</div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
          Solo Boundary Brawl: Adjudication Complete!
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>
          You competed against Dr. Alex Audits, Dana Design, and Officer Ryan on nuanced CPACC edge cases!
        </p>

        <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '2px solid #38bdf8', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>Your Score: {playerScore} pts</div>
          <div style={{ color: '#bae6fd', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {playerScore >= 400 ? '🎖️ Supreme Court Accessibility Master!' : '🛡️ Senior Compliance Arbitrator!'}
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={onBack}
          style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', margin: '0 auto' }}
        >
          <RotateCcw size={18} />
          <span>Return to Solo Hub</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0.5rem' }}>
      {/* Top Header */}
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
                Solo Boundary Line Brawl
              </h2>
              <span
                style={{
                  background: 'rgba(14, 165, 233, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid #0ea5e9',
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '9999px',
                  fontWeight: 800
                }}
              >
                vs 3 AI Debaters
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Your Score: <strong style={{ color: '#38bdf8' }}>{playerScore} pts</strong> • Mode: {stage === 'SCRAMBLE' ? 'Phase 1: Card Placement' : 'Phase 2: Debate Arena'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {stage === 'CHALLENGE' && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleFinishGame}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <span>Finish Game & View Podium →</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={onBack}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          >
            ← Back to Hub
          </button>
        </div>
      </div>

      {/* Active Challenge Arena */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🥊</span>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f87171', margin: 0 }}>
                DEBATE CHALLENGE!
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                Challenging <strong>"{activeChallenge.cardTitle}"</strong> in <strong>{activeChallenge.currentQuadrant}</strong>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
            "{activeChallenge.cardDescription}"
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handleVote('UP')}
              disabled={userVoted !== null}
              style={{
                flex: 1,
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
              <span>DEFEND PLACEMENT (+200 pts)</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote('DOWN')}
              disabled={userVoted !== null}
              style={{
                flex: 1,
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
              <span>OVERTHROW & RELOCATE (+150 pts)</span>
            </button>
          </div>
        </div>
      )}

      {/* Settled Report */}
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
                ? `CHALLENGER OVERTHREW! Placed into ${settledReport.correctQuadrantName || settledReport.correctQuadrant}`
                : `DEFENDER PREVAILED! Confirmed in ${settledReport.correctQuadrantName || settledReport.correctQuadrant}`}
            </strong>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.4rem 0' }}>
            <strong>CPACC Rationale:</strong> {settledReport.rationale}
          </p>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
            <strong>Standard:</strong> {settledReport.cpaccRef}
          </div>
        </div>
      )}

      {/* 2x2 Matrix Board */}
      <div
        className="card"
        style={{
          padding: '1rem',
          background: '#090d16',
          border: '2px solid #334155',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#f87171', paddingBottom: '0.4rem', borderBottom: '1px solid #1e293b' }}>
          <span>▲ HIGH ORGANIZATIONAL RISK (Mandatory Standards)</span>
          <span>▲ HIGH ORGANIZATIONAL IMPACT (Systemic Universal Design)</span>
        </div>

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
                  flexDirection: 'column'
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

                  {selectedCardId && (
                    <button
                      type="button"
                      onClick={() => handlePlaceCard(selectedCardId, quad.id)}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                  {quadPlacements.map((p) => (
                    <div
                      key={p.cardId}
                      style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: `1.5px solid ${p.isVerified ? '#10b981' : quad.borderColor}`,
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

                        {stage === 'CHALLENGE' && !activeChallenge && p.placedBy?.id !== 'player' && (
                          <button
                            type="button"
                            onClick={() => handleStartChallenge(p.cardId)}
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
                            <span>Challenge Placement</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

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

      {/* Card Tray */}
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
            <span>📦 Your Scenario Cards</span>
            <span style={{ fontSize: '0.8rem', background: '#334155', color: '#94a3b8', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
              {unplacedCards.length} left
            </span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Choose a quadrant button to place onto the 2×2 matrix
          </span>
        </div>

        {unplacedCards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#10b981', fontWeight: 700 }}>
            🎉 All scenarios placed! Jump into the Debate Arena above to challenge AI placements!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {unplacedCards.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
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
                    onClick={() => handlePlaceCard(c.id, 'Q1')}
                    style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    Q1: High Floor
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlaceCard(c.id, 'Q2')}
                    style={{ flex: 1, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    Q2: High UD
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlaceCard(c.id, 'Q3')}
                    style={{ flex: 1, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fbbf24', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    Q3: Low Floor
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePlaceCard(c.id, 'Q4')}
                    style={{ flex: 1, background: 'rgba(14, 165, 233, 0.2)', border: '1px solid #0ea5e9', color: '#38bdf8', padding: '0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    Q4: Low UD
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
