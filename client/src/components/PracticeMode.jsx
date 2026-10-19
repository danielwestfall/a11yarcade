import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Lightbulb,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Play
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import questionsData from '../data/questions.json';
import CoachFeedbackCard from './CoachFeedbackCard';
import WinnerCelebrationSoundboard from './WinnerCelebrationSoundboard';
import {
  CERTIFICATION_TRACKS,
  CERTIFICATION_DOMAINS,
  CERTIFICATION_TAXONOMY,
  getAllSections,
  getAllSubjects,
  getFilteredQuestions,
  getQuestionsByTrack
} from '../utils/questionBanks';

const SHAPE_CONFIG = {
  triangle: { icon: '▲', color: '#ef4444', label: 'Red Triangle' },
  diamond: { icon: '◆', color: '#38bdf8', label: 'Electric Diamond' },
  circle: { icon: '●', color: '#f59e0b', label: 'Amber Flare Circle' },
  square: { icon: '■', color: '#10b981', label: 'Emerald Square' }
};

export default function PracticeMode({ onBack }) {
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all', 'cpacc', 'was'
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [filterType, setFilterType] = useState('domain'); // 'domain', 'sections', 'subjects'
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [questionCount, setQuestionCount] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewingMissed, setIsReviewingMissed] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const nextButtonRef = useRef(null);

  const availableQuestions = React.useMemo(() => {
    return getFilteredQuestions({
      certTrack: selectedTrack,
      domain: filterType === 'domain' ? selectedDomain : 'all',
      sections: filterType === 'sections' ? selectedSections : [],
      subjects: filterType === 'subjects' ? selectedSubjects : []
    });
  }, [selectedTrack, selectedDomain, filterType, selectedSections, selectedSubjects]);

  const allAvailableSections = React.useMemo(() => {
    return getAllSections(selectedTrack);
  }, [selectedTrack]);

  const allAvailableSubjects = React.useMemo(() => {
    return getAllSubjects(selectedTrack);
  }, [selectedTrack]);

  const handleToggleSection = (sectionId) => {
    soundManager.playClick();
    setSelectedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleSelectAllSections = () => {
    soundManager.playClick();
    const allIds = [];
    allAvailableSections.forEach(c => {
      (c.domains || []).forEach(d => {
        (d.sections || []).forEach(s => allIds.push(s.id));
      });
    });
    setSelectedSections(allIds);
  };

  const handleClearSections = () => {
    soundManager.playClick();
    setSelectedSections([]);
  };

  const handleToggleSubject = (subjectKey) => {
    soundManager.playClick();
    setSelectedSubjects(prev =>
      prev.includes(subjectKey) ? prev.filter(k => k !== subjectKey) : [...prev, subjectKey]
    );
  };

  const handleSelectAllSubjects = () => {
    soundManager.playClick();
    setSelectedSubjects(allAvailableSubjects.map(s => s.key));
  };

  const handleClearSubjects = () => {
    soundManager.playClick();
    setSelectedSubjects([]);
  };

  // Setup Quiz
  const startQuiz = (reviewMissedOnly = false) => {
    let pool = [];

    if (reviewMissedOnly) {
      const missedIds = history.filter(h => !h.isCorrect).map(h => h.question.id);
      pool = getQuestionsByTrack(selectedTrack).filter(q => missedIds.includes(q.id));
      setIsReviewingMissed(true);
    } else {
      setIsReviewingMissed(false);
      pool = [...availableQuestions];
      pool = pool.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    }

    if (pool.length === 0) return;

    setCurrentQuestions(pool);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setHistory([]);
    setIsFinished(false);
    setIsStarted(true);
    setLiveAnnouncement(`Quiz started. Question 1 of ${pool.length}: ${pool[0].question}`);
    soundManager.playClick();
  };

  // Keyboard navigation for answers (1-4 or A-D)
  useEffect(() => {
    if (!isStarted || isFinished || isAnswered) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      let index = -1;
      if (key === '1' || key === 'A' || key === 'T') index = 0;
      if (key === '2' || key === 'B' || key === 'F') index = 1;
      if (key === '3' || key === 'C') index = 2;
      if (key === '4' || key === 'D') index = 3;

      const q = currentQuestions[currentIndex];
      if (q && index >= 0 && index < q.choices.length) {
        handleSelectChoice(q.choices[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isFinished, isAnswered, currentIndex, currentQuestions]);

  // Focus next button when answered
  useEffect(() => {
    if (isAnswered && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [isAnswered]);

  const handleSelectChoice = (choice) => {
    if (isAnswered) return;

    const q = currentQuestions[currentIndex];
    const isCorrect = choice.isCorrect;
    setSelectedAnswer(choice.id);
    setIsAnswered(true);

    if (isCorrect) {
      soundManager.playCoachFeedback(true);
      setScore(prev => prev + 1);
      setLiveAnnouncement(`Correct! ${choice.text}. ${q.explanation}`);
    } else {
      soundManager.playCoachFeedback(false);
      const correctChoice = q.choices.find(c => c.isCorrect);
      setLiveAnnouncement(`Incorrect. You chose ${choice.text}. The correct answer was ${correctChoice ? correctChoice.text : ''}. ${q.explanation}`);
    }

    setHistory(prev => [
      ...prev,
      {
        question: q,
        chosenId: choice.id,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < currentQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setLiveAnnouncement(`Question ${nextIdx + 1} of ${currentQuestions.length}: ${currentQuestions[nextIdx].question}`);
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
      setLiveAnnouncement(`Practice round complete! Your final score is ${score} out of ${currentQuestions.length}.`);
    }
  };

  // ==========================================
  // VIEW 1: Quiz Configuration / Start Screen
  // ==========================================
  if (!isStarted) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Marquee Hero Header */}
        <section aria-labelledby="practice-hero-title" className="marquee-hero-card">
          <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <GraduationCap size={13} />
                <span>[SOLO PRACTICE GAUNTLET]</span>
              </span>
              <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)' }}>
                [ZERO TIMER PRESSURE]
              </span>
              <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)' }}>
                [WCAG 2.2 AAA VERIFIED]
              </span>
            </div>

            <h1 id="practice-hero-title" style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              DIGITAL ACCESSIBILITY IAAP PRACTICE GAUNTLET (CPACC · WAS · ADS)
            </h1>
            <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: '#94a3b8', maxWidth: '820px', lineHeight: 1.55 }}>
              Master official IAAP Digital Accessibility Certifications (CPACC · WAS · ADS) Body of Knowledge at your own speed with zero timer pressure, instant accredited citations, and witty real-world reality checks.
            </p>
          </div>
        </section>

        {/* Setup Console Card */}
        <section aria-label="Practice round configuration" className="card" style={{ padding: '2rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); startQuiz(false); }}>
            {/* 1. Certification Track Selection */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.65rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                1. Select Certification Exam Track:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {CERTIFICATION_TRACKS.map(track => {
                  const isSelected = selectedTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedTrack(track.id);
                        setSelectedDomain('all');
                      }}
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${isSelected ? track.color : 'var(--border-color)'}`,
                        background: isSelected ? track.bg : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease'
                      }}
                      aria-pressed={isSelected}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                          {track.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: track.color, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                          {track.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {track.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Curriculum Focus: Domain / Sections / Subject Switch */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.65rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                2. Select Curriculum Scope:
              </label>

              <div
                role="tablist"
                aria-label="Practice curriculum selection method"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: 'var(--bg-surface-elevated)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={filterType === 'domain'}
                  onClick={() => {
                    soundManager.playClick();
                    setFilterType('domain');
                  }}
                  style={{
                    padding: '0.6rem 0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: filterType === 'domain' ? '#38bdf8' : 'transparent',
                    color: filterType === 'domain' ? '#090d16' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🌐 By Domain
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={filterType === 'sections'}
                  onClick={() => {
                    soundManager.playClick();
                    setFilterType('sections');
                  }}
                  style={{
                    padding: '0.6rem 0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: filterType === 'sections' ? '#10b981' : 'transparent',
                    color: filterType === 'sections' ? '#090d16' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📑 By Sections ({selectedSections.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={filterType === 'subjects'}
                  onClick={() => {
                    soundManager.playClick();
                    setFilterType('subjects');
                  }}
                  style={{
                    padding: '0.6rem 0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: filterType === 'subjects' ? '#f59e0b' : 'transparent',
                    color: filterType === 'subjects' ? '#090d16' : '#94a3b8',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🏷️ By Subject ({selectedSubjects.length})
                </button>
              </div>

              {/* Sub-Panel A: By Domain */}
              {filterType === 'domain' && (
                <div>
                  <select
                    id="domain-select"
                    className="input-field"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    style={{ fontSize: '1rem', padding: '0.85rem 1rem' }}
                  >
                    {(CERTIFICATION_DOMAINS[selectedTrack] || CERTIFICATION_DOMAINS.all).map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Panel B: By Specific Sections */}
              {filterType === 'sections' && (
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                      Certification Sections ({selectedSections.length} selected):
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleSelectAllSections}
                        style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearSections}
                        style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.35rem' }}>
                    {allAvailableSections.map(cert => (
                      <div key={cert.id} style={{ marginBottom: '0.35rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem' }}>
                          {cert.title}
                        </div>
                        {(cert.domains || []).map(dom => (
                          <div key={dom.id} style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(56, 189, 248, 0.3)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                              {dom.title}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {(dom.sections || []).map(sec => {
                                const isChecked = selectedSections.includes(sec.id);
                                const isCritical = sec.count < 5;
                                const isLow = sec.count >= 5 && sec.count < 10;
                                return (
                                  <label
                                    key={sec.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '0.5rem',
                                      padding: '0.45rem 0.65rem',
                                      minHeight: '44px',
                                      borderRadius: '4px',
                                      background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                                      border: `1px solid ${isChecked ? '#10b981' : 'rgba(51, 65, 85, 0.5)'}`,
                                      cursor: 'pointer',
                                      fontSize: '0.82rem'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleSection(sec.id)}
                                        style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', cursor: 'pointer' }}
                                      />
                                      <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#cbd5e1' }}>
                                        [{sec.id}]
                                      </span>
                                      <span style={{ color: '#ffffff', fontSize: '0.8rem' }}>
                                        {sec.title}
                                      </span>
                                    </div>
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '4px',
                                        whiteSpace: 'nowrap',
                                        background: isCritical ? 'rgba(239, 68, 68, 0.2)' : isLow ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        border: `1px solid ${isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#10b981'}`,
                                        color: isCritical ? '#fca5a5' : isLow ? '#fde68a' : '#86efac'
                                      }}
                                    >
                                      {isCritical ? `🔴 ${sec.count} Qs` : isLow ? `⚠️ ${sec.count} Qs` : `🟢 ${sec.count} Qs`}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Panel C: By Subjects */}
              {filterType === 'subjects' && (
                <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>
                      Topics & Subjects ({selectedSubjects.length} selected):
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleSelectAllSubjects}
                        style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearSubjects}
                        style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.45rem', paddingRight: '0.35rem' }}>
                    {allAvailableSubjects.map(sub => {
                      const isChecked = selectedSubjects.includes(sub.key);
                      return (
                        <button
                          key={sub.key}
                          type="button"
                          onClick={() => handleToggleSubject(sub.key)}
                          aria-pressed={isChecked}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.65rem',
                            minHeight: '44px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: `1px solid ${isChecked ? '#f59e0b' : 'rgba(51, 65, 85, 0.6)'}`,
                            background: isChecked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                            color: isChecked ? '#fbbf24' : '#cbd5e1'
                          }}
                        >
                          <span>{sub.icon}</span>
                          <span>{sub.label}</span>
                          <span style={{ fontSize: '0.72rem', opacity: 0.8, fontFamily: "'Space Mono', monospace" }}>
                            ({sub.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pool Inventory Status */}
              <div style={{
                marginTop: '1rem',
                background: availableQuestions.length === 0 ? 'rgba(239, 68, 68, 0.15)' : availableQuestions.length < questionCount ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${availableQuestions.length === 0 ? '#ef4444' : availableQuestions.length < questionCount ? '#f59e0b' : '#10b981'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    fontFamily: "'Space Mono', monospace",
                    color: availableQuestions.length === 0 ? '#fca5a5' : availableQuestions.length < questionCount ? '#fde68a' : '#86efac'
                  }}>
                    📦 MATCH POOL: {availableQuestions.length} Questions Available
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                    TARGET: {questionCount} Qs
                  </span>
                </div>
                {availableQuestions.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '0.25rem' }}>
                    ⚠️ Zero questions match this selection. Please pick at least one section or subject.
                  </div>
                ) : availableQuestions.length < questionCount ? (
                  <div style={{ fontSize: '0.78rem', color: '#fde68a', marginTop: '0.25rem' }}>
                    ⚠️ Pool has fewer items ({availableQuestions.length}) than your target ({questionCount}). Quiz will run with {availableQuestions.length} questions.
                  </div>
                ) : null}
              </div>
            </div>

            {/* 3. Question Count Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.65rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                3. Number of Questions:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {[
                  { count: 5, label: '5 Questions', tag: 'Warm-Up' },
                  { count: 10, label: '10 Questions', tag: 'Standard' },
                  { count: 20, label: '20 Questions', tag: 'Intensive' },
                  { count: 40, label: '40 Questions', tag: 'Full Exam' }
                ].map(opt => (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setQuestionCount(opt.count);
                    }}
                    style={{
                      padding: '0.85rem 1rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: `2px solid ${questionCount === opt.count ? '#38bdf8' : 'var(--border-color)'}`,
                      background: questionCount === opt.count ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface-elevated)',
                      color: questionCount === opt.count ? '#ffffff' : '#94a3b8',
                      cursor: 'pointer'
                    }}
                    aria-pressed={questionCount === opt.count}
                  >
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8' }}>[{opt.tag}]</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={availableQuestions.length === 0}
                aria-disabled={availableQuestions.length === 0}
                className="btn-primary arcade-btn-secondary"
                style={{
                  padding: '0.85rem 2.5rem',
                  fontSize: '1.1rem',
                  minHeight: '44px',
                  fontWeight: 900,
                  background: availableQuestions.length === 0 ? '#334155' : '#10b981',
                  borderColor: availableQuestions.length === 0 ? '#475569' : '#10b981',
                  color: availableQuestions.length === 0 ? '#94a3b8' : '#090d16',
                  cursor: availableQuestions.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: availableQuestions.length === 0 ? 0.6 : 1
                }}
              >
                <Play size={20} />
                <span>[ 🕹️ LAUNCH GAUNTLET DRILL ]</span>
              </button>

              {onBack && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    soundManager.playClick();
                    onBack();
                  }}
                  style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
                >
                  ← Return to Solo Hub
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Quiz Complete / Results Screen
  // ==========================================
  if (isFinished) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    const missedQuestions = history.filter(h => !h.isCorrect);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <article className="card" style={{ textAlign: 'center', padding: '3rem 2rem', border: '2px solid var(--border-bright)' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.75rem' }}>
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎯' : '📚'}
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif", color: '#ffffff', marginBottom: '0.5rem' }}>
            PRACTICE DRILL COMPLETE!
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.5 }}>
            {percentage >= 80
              ? 'Outstanding mastery! You demonstrated thorough command of the IAAP Digital Accessibility Body of Knowledge!'
              : percentage >= 60
              ? 'Solid performance! A few more practice iterations will cement your core competencies.'
              : 'Great training session! Remember that accessibility is an iterative journey of continuous improvement.'}
          </p>

          {/* Diagnostic Metrics HUD */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              background: '#060e20',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-color)',
              marginBottom: '2rem'
            }}
          >
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', fontFamily: "'Space Mono', monospace" }}>
                {score} / {currentQuestions.length}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                QUESTIONS ACCREDITED
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: percentage >= 70 ? '#10b981' : '#f59e0b', fontFamily: "'Space Mono', monospace" }}>
                {percentage}%
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                ACCURACY SCORE
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#c084fc', fontFamily: "'Space Mono', monospace" }}>
                +{score * 25} XP
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                EXPERIENCE EARNED
              </div>
            </div>
          </div>

          {/* Solo Celebration Soundboard for High Accuracy */}
          {percentage >= 70 && (
            <WinnerCelebrationSoundboard isWinner={true} />
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {missedQuestions.length > 0 && (
              <button
                type="button"
                className="btn-primary arcade-btn-secondary"
                onClick={() => startQuiz(true)}
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', background: '#facc15', borderColor: '#facc15', color: '#090d16', fontWeight: 900 }}
              >
                <RotateCcw size={18} />
                <span>Retry Missed Questions ({missedQuestions.length})</span>
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                soundManager.playClick();
                setIsStarted(false);
              }}
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              Choose Another Drill
            </button>

            {onBack && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                Return to Solo Hub
              </button>
            )}
          </div>
        </article>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: Active Question Answering Screen
  // ==========================================
  const q = currentQuestions[currentIndex];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Live Region for Screen Readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      <article className="card" style={{ padding: '2rem', border: '2px solid var(--border-bright)', boxShadow: '6px 6px 0px 0px #040810' }}>
        {/* Top Telemetry Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#0b1326', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace", fontWeight: 900 }}>
              QUESTION {currentIndex + 1} OF {currentQuestions.length}
            </span>
            <span style={{
              background: q.certification === 'WAS' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              border: `1px solid ${q.certification === 'WAS' ? '#10b981' : '#38bdf8'}`,
              color: q.certification === 'WAS' ? '#34d399' : '#38bdf8',
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 800
            }}>
              [{q.certification || 'IAAP'}]
            </span>
            <span style={{ background: 'rgba(192, 132, 252, 0.15)', border: '1px solid #c084fc', color: '#e9d5ff', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
              [DOM-{q.domain}: {q.topic}]
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#10b981', fontWeight: 800 }}>
            SCORE: {score} CORRECT
          </div>
        </div>

        {/* Question Stem */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.45, color: '#ffffff', margin: '0 0 1.5rem 0', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
          {q.question}
        </h2>

        {/* 4 Accessible Dual-Coded Answer Buttons */}
        <div className="answers-grid" role="group" aria-label="Answer choices">
          {q.choices.map((choice, idx) => {
            const isUserChoice = selectedAnswer === choice.id;
            const isCorrect = choice.isCorrect;
            const shape = SHAPE_CONFIG[choice.shape] || SHAPE_CONFIG.triangle;

            let buttonClass = `answer-btn ${choice.shape}`;
            if (isAnswered) {
              if (isCorrect) {
                buttonClass += ' is-correct-highlight';
              } else {
                buttonClass += ' is-dimmed';
              }
            }

            return (
              <button
                key={choice.id}
                type="button"
                className={buttonClass}
                onClick={() => handleSelectChoice(choice)}
                disabled={isAnswered}
                aria-pressed={isUserChoice}
                aria-label={`${choice.id}: ${shape.label}, ${choice.text}`}
              >
                <span className="shape-badge" aria-hidden="true">
                  {shape.icon}
                </span>

                <span style={{ flex: 1, fontWeight: 700 }}>{choice.text}</span>

                <span className="shape-badge-key" aria-hidden="true">
                  {q.choices.length === 2 ? `Key: ${idx + 1} / ${idx === 0 ? 'T' : 'F'}` : `Key: ${idx + 1}`}
                </span>

                {isAnswered && isCorrect && (
                  <CheckCircle2 size={26} style={{ flexShrink: 0, color: '#ffffff' }} />
                )}
                {isAnswered && isUserChoice && !isCorrect && (
                  <XCircle size={26} style={{ flexShrink: 0, color: '#ffffff' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & IAAP Explanation Drawer */}
        {isAnswered && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Citation Box */}
            <div style={{ background: '#060e20', border: '1px solid #38bdf8', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: q.certification === 'WAS' ? '#34d399' : '#38bdf8', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace", fontSize: '0.82rem' }}>
                <BookOpen size={16} color={q.certification === 'WAS' ? '#34d399' : '#38bdf8'} />
                <span>{q.certification || 'IAAP'} BODY OF KNOWLEDGE EXPLANATION:</span>
              </div>
              <p style={{ color: '#f1f5f9', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                {q.explanation}
              </p>
              {(q.citation || q.cpaccRef || q.wasRef) && (
                <div style={{ marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.8rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                  Syllabus Citation: <strong style={{ color: q.certification === 'WAS' ? '#34d399' : '#38bdf8' }}>{q.citation || q.cpaccRef || q.wasRef}</strong>
                </div>
              )}
            </div>

            {/* Mnemonic Fun Note */}
            {q.funNote && (
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', padding: '0.9rem 1.15rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: '#fef08a', fontSize: '0.92rem' }}>
                <Lightbulb size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Arcade Mnemonic: </strong>
                  <span style={{ lineHeight: 1.5 }}>{q.funNote}</span>
                </div>
              </div>
            )}

            {/* Coach McGuirk's Sideline Pep Talk */}
            <CoachFeedbackCard isCorrect={q.choices.find(c => c.id === selectedAnswer)?.isCorrect} />

            {/* Next Question Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                ref={nextButtonRef}
                type="button"
                className="btn-primary arcade-btn-secondary"
                onClick={handleNext}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  background: '#38bdf8',
                  borderColor: '#38bdf8',
                  color: '#090d16'
                }}
              >
                <span>{currentIndex + 1 < currentQuestions.length ? 'NEXT QUESTION (ENTER)' : 'VIEW FINAL RESULTS'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
