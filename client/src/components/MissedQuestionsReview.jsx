import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, RotateCcw, AlertCircle, Sparkles, Filter, User, Users, Search, Lightbulb, Play } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { apiUrl } from '../utils/api';

export default function MissedQuestionsReview() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('a11yarcade_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [viewScope, setViewScope] = useState(() => {
    try {
      const saved = localStorage.getItem('a11yarcade_user');
      return saved ? 'MY' : 'ALL';
    } catch {
      return 'ALL';
    }
  });
  const [missedList, setMissedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRetryModal, setActiveRetryModal] = useState(null);
  const [retryAnswerFeedback, setRetryAnswerFeedback] = useState(null);

  useEffect(() => {
    fetchMissed();
  }, [viewScope]);

  const fetchMissed = async () => {
    setLoading(true);
    try {
      const scopeParam = viewScope === 'MY' && currentUser?.nickname ? currentUser.nickname : 'all';
      const res = await fetch(apiUrl(`/api/study/missed?nickname=${encodeURIComponent(scopeParam)}`)).then(r => r.json());
      setMissedList(res.missed || []);
    } catch (err) {
      console.error('Failed to load missed questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const domainFiltered = filterDomain === 'all'
    ? missedList
    : missedList.filter(m => String(m.domain) === filterDomain);

  const searched = domainFiltered.filter(m => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (m.questionText && m.questionText.toLowerCase().includes(term)) ||
      (m.topic && m.topic.toLowerCase().includes(term)) ||
      (m.explanation && m.explanation.toLowerCase().includes(term)) ||
      (m.cpaccRef && m.cpaccRef.toLowerCase().includes(term)) ||
      (m.wasRef && m.wasRef.toLowerCase().includes(term)) ||
      (m.citation && m.citation.toLowerCase().includes(term))
    );
  });

  // Group by questionId so duplicates don't overwhelm
  const uniqueQuestionsMap = new Map();
  searched.forEach(item => {
    if (!uniqueQuestionsMap.has(item.questionId)) {
      uniqueQuestionsMap.set(item.questionId, { ...item, count: 1 });
    } else {
      uniqueQuestionsMap.get(item.questionId).count += 1;
    }
  });
  const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '7rem' }}>
      {/* Marquee Hero Diagnostic Header */}
      <section aria-labelledby="study-review-title" className="marquee-hero-card">
        <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(239, 68, 68, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>📖</span>
              <span>[IAAP BoK CITATIONS (CPACC · WAS · ADS)]</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #ef4444', color: '#fca5a5', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)' }}>
              [AUTONOMOUS DIAGNOSTICS]
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🛡️</span>
              <span>WCAG 2.2 AAA VERIFIED</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)' }}>
              [REMEDIATION COHORT SYNC]
            </span>
          </div>

          <h1 id="study-review-title" style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            MISSED QUESTIONS & STUDY REVIEW
          </h1>
          <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: '#94a3b8', maxWidth: '820px', lineHeight: 1.5 }}>
            Every stumble in the arena is logged here with official Digital Accessibility IAAP Body of Knowledge citations (CPACC · WAS · ADS) and humorous explanations. Review missed items solo or test your memory with instant retakes!
          </p>

          {/* Diagnostic Metrics Bar */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace" }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Flagged Drills: </span>
              <strong style={{ color: '#ef4444' }}>{uniqueQuestions.length} Questions</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Cohort Remediation Bonus: </span>
              <strong style={{ color: '#facc15' }}>+50 XP / Fix</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Active Review Scope: </span>
              <strong style={{ color: '#38bdf8' }}>{viewScope === 'MY' && currentUser?.nickname ? `CADET ${currentUser.nickname.toUpperCase()}` : 'ALL TEAM COHORT'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Scope Console */}
      <section aria-label="Study Review Filters" className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            {/* View Scope Toggle */}
            {currentUser?.nickname ? (
              <div style={{ display: 'inline-flex', background: '#060e20', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => { soundManager.playClick(); setViewScope('MY'); }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: viewScope === 'MY' ? '#38bdf8' : 'transparent',
                    color: viewScope === 'MY' ? '#090d16' : '#ffffff',
                    fontWeight: 900,
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <User size={15} />
                  <span>My Missed Questions ({currentUser.nickname})</span>
                </button>
                <button
                  type="button"
                  onClick={() => { soundManager.playClick(); setViewScope('ALL'); }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: viewScope === 'ALL' ? '#38bdf8' : 'transparent',
                    color: viewScope === 'ALL' ? '#090d16' : '#ffffff',
                    fontWeight: 900,
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <Users size={15} />
                  <span>All Team Cohort Blunders</span>
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                [BROWSING ALL TEAM COHORT BLUNDERS]
              </div>
            )}

            {/* Keyword Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '420px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search topic, WCAG criterion, or law..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                aria-label="Search missed questions"
              />
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            {[
              { id: 'all', label: `All Topics (${uniqueQuestions.length})` },
              { id: '1', label: 'Domain 1: Disabilities & AT' },
              { id: '2', label: 'Domain 2: UD & WCAG 2.1/2.2' },
              { id: '3', label: 'Domain 3: Standards & Laws' }
            ].map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => { soundManager.playClick(); setFilterDomain(d.id); }}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  background: filterDomain === d.id ? '#38bdf8' : '#0b1326',
                  color: filterDomain === d.id ? '#090d16' : '#94a3b8',
                  border: `1px solid ${filterDomain === d.id ? '#38bdf8' : 'var(--border-color)'}`,
                  cursor: 'pointer'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Diagnostic Flash Cards Grid / Bento */}
      <section aria-label="Diagnostic Flash Cards List">
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
            [⧗] ACCESSING IAAP DIAGNOSTIC REPOSITORIES...
          </div>
        ) : uniqueQuestions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '2px solid #10b981' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>✨🎯</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981', marginBottom: '0.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              NO MISSED DRILLS IN LOG!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
              Either your team scored 100% on everything, or no games have recorded mistakes yet. Play an arcade match or solo gauntlet to track mastery!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {uniqueQuestions.map((q, idx) => (
              <article
                key={q.questionId || idx}
                className="card"
                style={{
                  padding: '1.75rem',
                  border: '2px solid var(--border-bright)',
                  borderLeft: '5px solid #ef4444',
                  background: 'var(--bg-surface)',
                  boxShadow: '4px 4px 0px 0px #040810'
                }}
              >
                {/* Top Telemetry Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#0b1326', border: '1px solid #c084fc', color: '#c084fc', padding: '0.2rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>
                      [DOM-{q.domain || 1}: {q.topic || q.domainName || 'IAAP BoK'}]
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                      #{q.questionId}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '0.2rem 0.65rem', borderRadius: '4px', fontWeight: 800 }}>
                    ✕ Missed {q.count}x across cohort
                  </span>
                </div>

                {/* Question Stem */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.5, margin: '0 0 1.25rem 0', color: '#ffffff', fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
                  {q.questionText}
                </h3>

                {/* Side-by-side Diagnostic Answer Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  {/* Selected / Distractor Trap */}
                  {q.selectedChoiceId && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#f87171', fontFamily: "'Space Mono', monospace", fontWeight: 800, marginBottom: '0.35rem' }}>
                        [✕ YOUR ANSWER / COMMON TRAP]
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                        Choice {q.selectedChoiceId}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#fca5a5', margin: '0.35rem 0 0 0' }}>
                        Common distractor trap: Watch out for pace vs modality differences in accessibility scenarios.
                      </p>
                    </div>
                  )}

                  {/* Correct Answer */}
                  {q.correctChoiceId && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#10b981', fontFamily: "'Space Mono', monospace", fontWeight: 800, marginBottom: '0.35rem' }}>
                        [✓ ACCREDITED IAAP ANSWER]
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                        Choice {q.correctChoiceId}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#6ee7b7', margin: '0.35rem 0 0 0' }}>
                        Accredited definition aligned with official IAAP Body of Knowledge principles.
                      </p>
                    </div>
                  )}
                </div>

                {/* Official IAAP BoK Citation Box */}
                <div style={{ background: '#060e20', border: '1px solid #38bdf8', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <BookOpen size={14} color="#38bdf8" />
                    <span>IAAP BODY OF KNOWLEDGE EXPLANATION:</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#f1f5f9', margin: 0, lineHeight: 1.55 }}>
                    {q.explanation}
                  </p>
                  {(q.citation || q.cpaccRef || q.wasRef) && (
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace", marginTop: '0.5rem', borderTop: '1px solid rgba(56, 189, 248, 0.2)', paddingTop: '0.35rem' }}>
                      Official Syllabus Citation: <strong style={{ color: '#38bdf8' }}>{q.citation || q.cpaccRef || q.wasRef}</strong>
                    </div>
                  )}
                </div>

                {/* Humorous Mnemonic / Fun Note */}
                {q.funNote && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#fef08a', fontSize: '0.88rem' }}>
                    <Lightbulb size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Arcade Mnemonic: </strong>
                      <span>{q.funNote}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Fixed Bottom Arcade Dock */}
      <aside aria-label="Study review command deck" className="arcade-dock">
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
            <span style={{ color: '#ef4444', fontWeight: 800 }}>
              {uniqueQuestions.length} Questions Flagged for Remediation
            </span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>
              ✓ Complete IAAP BoK Citations Indexed
            </span>
          </div>

          <button
            type="button"
            className="btn-primary arcade-btn-secondary"
            onClick={() => {
              soundManager.playClick();
              window.location.hash = '#solo';
              window.location.reload();
            }}
            style={{
              padding: '0.65rem 1.75rem',
              fontSize: '0.95rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              background: '#facc15',
              borderColor: '#facc15',
              color: '#090d16'
            }}
          >
            <span>[ ▶ START RAPID REMEDIATION DRILL ]</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

