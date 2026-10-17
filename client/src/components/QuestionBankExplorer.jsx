import React, { useState } from 'react';
import { Search, BookOpen, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import questionsData from '../data/questions.json';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

export default function QuestionBankExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredQuestions = questionsData.filter((q) => {
    const matchesDomain = domainFilter === 'all' || q.domain === parseInt(domainFilter, 10);
    const textToSearch = `${q.question} ${q.topic} ${q.explanation} ${q.cpaccRef}`.toLowerCase();
    const matchesSearch = !searchTerm.trim() || textToSearch.includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📚</span> CPACC Question Bank Explorer ({questionsData.length} Questions)
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Explore all curriculum questions extracted and adapted from the <strong>IAAP CPACC Body of Knowledge</strong>.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by topic, keyword, WCAG, law..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search questions"
            />
          </div>

          <div style={{ minWidth: '200px' }}>
            <select
              className="input-field"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              aria-label="Filter by domain"
            >
              <option value="all">All Domains ({questionsData.length})</option>
              <option value="1">Domain 1: Disabilities & AT ({questionsData.filter(q => q.domain === 1).length})</option>
              <option value="2">Domain 2: Universal Design & WCAG ({questionsData.filter(q => q.domain === 2).length})</option>
              <option value="3">Domain 3: Standards & Laws ({questionsData.filter(q => q.domain === 3).length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredQuestions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            No questions matched your search criteria.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <div key={q.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(q.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(q.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem'
                  }}
                  aria-expanded={isExpanded}
                  aria-label={`${q.question}. Click to toggle details.`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#334155', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        Domain {q.domain}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {q.topic}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {q.question}
                    </h3>
                  </div>

                  <div style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {q.choices.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: c.isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-surface-elevated)',
                            border: c.isCorrect ? '2px solid #22c55e' : '1px solid var(--border-color)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <span style={{ fontWeight: 800, color: c.isCorrect ? '#22c55e' : 'var(--text-secondary)' }}>
                            {c.id} ({SHAPE_ICONS[c.shape]})
                          </span>
                          <span style={{ flex: 1, fontSize: '0.95rem' }}>{c.text}</span>
                          {c.isCorrect && <CheckCircle2 size={18} color="#22c55e" />}
                        </div>
                      ))}
                    </div>

                    <div className="explanation-box" style={{ marginTop: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.25rem' }}>
                        <BookOpen size={16} />
                        <span>Rationale:</span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{q.explanation}</p>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        Citation: {q.cpaccRef}
                      </div>
                    </div>

                    {q.funNote && (
                      <div className="fun-note">
                        <Lightbulb size={16} />
                        <span>{q.funNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
