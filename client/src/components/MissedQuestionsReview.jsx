import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, RotateCcw, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { apiUrl } from '../utils/api';

export default function MissedQuestionsReview() {
  const [missedList, setMissedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState('all');
  const [activePracticeQuestion, setActivePracticeQuestion] = useState(null);
  const [practiceAnswerFeedback, setPracticeAnswerFeedback] = useState(null);

  useEffect(() => {
    fetchMissed();
  }, []);

  const fetchMissed = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/study/missed?nickname=all')).then(r => r.json());
      setMissedList(res.missed || []);
    } catch (err) {
      console.error('Failed to load missed questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterDomain === 'all'
    ? missedList
    : missedList.filter(m => String(m.domain) === filterDomain);

  // Group by questionId so duplicates don't overwhelm
  const uniqueQuestionsMap = new Map();
  filtered.forEach(item => {
    if (!uniqueQuestionsMap.has(item.questionId)) {
      uniqueQuestionsMap.set(item.questionId, { ...item, count: 1 });
    } else {
      uniqueQuestionsMap.get(item.questionId).count += 1;
    }
  });
  const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧠📖</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Missed Questions & Study Review
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
          Every question missed during meeting games is saved here with official CPACC Body of Knowledge citations and explanations.
        </p>

        {/* Domain Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Topics' },
            { id: '1', label: 'Domain 1: Disabilities & AT' },
            { id: '2', label: 'Domain 2: UD & WCAG' },
            { id: '3', label: 'Domain 3: Standards & Laws' }
          ].map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => { soundManager.playClick(); setFilterDomain(d.id); }}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: filterDomain === d.id ? '#38bdf8' : 'var(--bg-surface-elevated)',
                color: filterDomain === d.id ? '#000000' : '#ffffff',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Loading your study review items...
        </div>
      ) : uniqueQuestions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨🎯</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', marginBottom: '0.5rem' }}>
            No Missed Questions Recorded!
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Either your team scored 100% on everything, or no games have recorded mistakes yet. Play a round to track items!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {uniqueQuestions.map((q) => (
            <div
              key={q.questionId}
              className="card"
              style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ background: '#334155', color: '#38bdf8', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800 }}>
                  Domain {q.domain}: {q.topic || q.domainName}
                </span>

                <span style={{ fontSize: '0.8rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Missed {q.count} {q.count === 1 ? 'time' : 'times'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1rem', color: '#ffffff' }}>
                {q.questionText}
              </h4>

              {/* Explanations & Reference */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  CPACC Body of Knowledge Explanation:
                </div>
                <p style={{ fontSize: '0.95rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                  {q.explanation}
                </p>
                {q.funNote && (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '0.5rem', marginBottom: 0 }}>
                    💡 {q.funNote}
                  </p>
                )}
              </div>

              {q.cpaccRef && (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={14} color="#38bdf8" />
                  <span>Official Reference: <strong>{q.cpaccRef}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
