import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Brain,
  Layers,
  Eye,
  Sliders,
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const UDL_PILLARS = [
  {
    id: 'engagement',
    label: '1. Engagement (Why)',
    sublabel: 'Affective Networks — Interest, Effort & Self-Regulation',
    color: 'var(--arcade-purple)'
  },
  {
    id: 'representation',
    label: '2. Representation (What)',
    sublabel: 'Recognition Networks — Perception, Language & Comprehension',
    color: 'var(--arcade-cyan)'
  },
  {
    id: 'expression',
    label: '3. Action & Expression (How)',
    sublabel: 'Strategic Networks — Physical Action, Communication & Executive Function',
    color: 'var(--arcade-green)'
  }
];

export default function UdlCourseDesignerLab() {
  const [activePillar, setActivePillar] = useState('engagement');

  // Pillar 1: Engagement Toggles
  const [engagementChoices, setEngagementChoices] = useState({
    assessmentChoice: false, // Choice of Assessment Format
    authenticTasks: false,   // Authentic Real-World Projects
    selfRegulation: false    // Low-Stakes Rubrics & Progress Checkpoints
  });

  // Pillar 2: Representation Toggles
  const [representationChoices, setRepresentationChoices] = useState({
    multimodalMedia: false,  // Captioned Video + Transcripts + Diagrams
    scaffoldedGlossary: false,// Embedded Vocabulary & Formula Glossary
    customizableDisplay: false// Adjustable Text, High Contrast & TTS
  });

  // Pillar 3: Action & Expression Toggles
  const [expressionChoices, setExpressionChoices] = useState({
    multiFormatSubmissions: false, // Document, Podcast, Slide Deck or Video
    assistiveTechSupport: false,   // Speech-to-Text & Screen Reader Friendly
    executiveScaffolding: false    // Step-by-Step Project Milestones
  });

  // Count total active scaffolds (0 to 9)
  const totalScaffolds = [
    ...Object.values(engagementChoices),
    ...Object.values(representationChoices),
    ...Object.values(expressionChoices)
  ].filter(Boolean).length;

  const inclusivityScore = Math.round((totalScaffolds / 9) * 100);
  const isFullyCertified = totalScaffolds === 9;

  const handleToggle = (pillar, key) => {
    soundManager.playClick();
    if (pillar === 'engagement') {
      setEngagementChoices(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        checkAll(updated, representationChoices, expressionChoices);
        return updated;
      });
    } else if (pillar === 'representation') {
      setRepresentationChoices(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        checkAll(engagementChoices, updated, expressionChoices);
        return updated;
      });
    } else {
      setExpressionChoices(prev => {
        const updated = { ...prev, [key]: !prev[key] };
        checkAll(engagementChoices, representationChoices, updated);
        return updated;
      });
    }
  };

  const checkAll = (e, r, x) => {
    const total = [...Object.values(e), ...Object.values(r), ...Object.values(x)].filter(Boolean).length;
    if (total === 9) {
      soundManager.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleApplyAll = () => {
    soundManager.playClick();
    setEngagementChoices({ assessmentChoice: true, authenticTasks: true, selfRegulation: true });
    setRepresentationChoices({ multimodalMedia: true, scaffoldedGlossary: true, customizableDisplay: true });
    setExpressionChoices({ multiFormatSubmissions: true, assistiveTechSupport: true, executiveScaffolding: true });
    soundManager.playCorrect();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    soundManager.playClick();
    setEngagementChoices({ assessmentChoice: false, authenticTasks: false, selfRegulation: false });
    setRepresentationChoices({ multimodalMedia: false, scaffoldedGlossary: false, customizableDisplay: false });
    setExpressionChoices({ multiFormatSubmissions: false, assistiveTechSupport: false, executiveScaffolding: false });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Brain size={18} color="var(--arcade-purple)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Universal Design for Learning (UDL) Course Designer Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          CPACC Domain 2 covers Universal Design for Learning (UDL), developed by CAST. UDL moves beyond reactive accommodations
          by proactively building flexible learning options into instructional curricula across 3 primary brain networks:
          Multiple Means of Engagement, Representation, and Action & Expression.
        </p>
      </div>

      {/* Progress & Inclusivity Meter */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              CAST Universal Design for Learning Conformance Meter
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isFullyCertified ? 'var(--arcade-green)' : inclusivityScore >= 50 ? 'var(--arcade-cyan)' : '#ef4444' }}>
              {inclusivityScore}% UDL Inclusivity Rating {isFullyCertified && '— 100% CAST UDL CERTIFIED ✓'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleApplyAll}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Sparkles size={14} color="var(--arcade-gold)" />
              <span>Apply All UDL Scaffolds</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="secondary-btn"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', width: '100%', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${inclusivityScore}%`,
              background: isFullyCertified ? 'var(--arcade-green)' : inclusivityScore >= 50 ? 'var(--arcade-cyan)' : '#ef4444',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* 3 Pillar Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
        {UDL_PILLARS.map(p => {
          const isSelected = activePillar === p.id;
          let count = 0;
          if (p.id === 'engagement') count = Object.values(engagementChoices).filter(Boolean).length;
          else if (p.id === 'representation') count = Object.values(representationChoices).filter(Boolean).length;
          else count = Object.values(expressionChoices).filter(Boolean).length;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActivePillar(p.id);
              }}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: isSelected ? p.color : 'var(--border-color)',
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface-elevated)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {p.label}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px', background: count === 3 ? 'var(--arcade-green)' : 'var(--bg-surface)', color: count === 3 ? '#fff' : 'var(--text-muted)' }}>
                  {count} / 3 Active
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {p.sublabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Workspace */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* PILLAR 1: ENGAGEMENT */}
        {activePillar === 'engagement' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderLeft: '4px solid var(--arcade-purple)', paddingLeft: '0.75rem' }}>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Pillar 1: Multiple Means of Engagement (The "Why" of Learning)
              </h5>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Affective brain networks regulate motivation, persistence, and emotional investment.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  key: 'assessmentChoice',
                  title: 'A. Assessment Flexibility & Choice',
                  before: 'Mandatory high-stakes 3-hour written exam (100% of final grade).',
                  udl: 'Students choose between a written report, podcast recording, or interactive prototype to demonstrate mastery.',
                  active: engagementChoices.assessmentChoice
                },
                {
                  key: 'authenticTasks',
                  title: 'B. Authentic, Real-World Relevance',
                  before: 'Abstract theoretical memorization of textbook dates and definitions.',
                  udl: 'Students apply accessibility audit tools to real municipal websites in their local community.',
                  active: engagementChoices.authenticTasks
                },
                {
                  key: 'selfRegulation',
                  title: 'C. Self-Regulation & Mastery Checkpoints',
                  before: 'Zero feedback until final grades are posted at semester end.',
                  udl: 'Weekly low-stakes self-check quizzes, transparent rubric grading criteria, and guided self-reflection.',
                  active: engagementChoices.selfRegulation
                }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggle('engagement', item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: `1px solid ${item.active ? 'var(--arcade-green)' : 'var(--border-color)'}`,
                    background: item.active ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginTop: '0.1rem' }}>
                    {item.active ? <CheckCircle2 size={18} color="var(--arcade-green)" /> : <XCircle size={18} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: item.active ? 'var(--arcade-green)' : 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {item.active ? `✓ UDL Applied: ${item.udl}` : `Traditional Baseline: ${item.before}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PILLAR 2: REPRESENTATION */}
        {activePillar === 'representation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderLeft: '4px solid var(--arcade-cyan)', paddingLeft: '0.75rem' }}>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Pillar 2: Multiple Means of Representation (The "What" of Learning)
              </h5>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Recognition brain networks perceive, interpret, and assign meaning to information and ideas.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  key: 'multimodalMedia',
                  title: 'A. Multimodal Media Delivery',
                  before: 'Single format: 400 pages of dense printed textbook chapters only.',
                  udl: 'Lecture videos with human captions, downloadable transcripts, interactive diagrams, and audio versions.',
                  active: representationChoices.multimodalMedia
                },
                {
                  key: 'scaffoldedGlossary',
                  title: 'B. Scaffolded Language & Symbol Support',
                  before: 'Unexplained technical jargon and acronyms assume prior domain expertise.',
                  udl: 'Embedded hover glossaries, symbol keys, and simplified plain language executive summaries.',
                  active: representationChoices.scaffoldedGlossary
                },
                {
                  key: 'customizableDisplay',
                  title: 'C. Customizable Information Display',
                  before: 'Fixed 10pt low-contrast black text on gray glossy paper.',
                  udl: 'Digital reader support with adjustable font sizes, high-contrast dark mode, and screen reader reflow.',
                  active: representationChoices.customizableDisplay
                }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggle('representation', item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: `1px solid ${item.active ? 'var(--arcade-green)' : 'var(--border-color)'}`,
                    background: item.active ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginTop: '0.1rem' }}>
                    {item.active ? <CheckCircle2 size={18} color="var(--arcade-green)" /> : <XCircle size={18} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: item.active ? 'var(--arcade-green)' : 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {item.active ? `✓ UDL Applied: ${item.udl}` : `Traditional Baseline: ${item.before}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PILLAR 3: ACTION & EXPRESSION */}
        {activePillar === 'expression' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderLeft: '4px solid var(--arcade-green)', paddingLeft: '0.75rem' }}>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Pillar 3: Multiple Means of Action & Expression (The "How" of Learning)
              </h5>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Strategic brain networks plan, execute, and monitor physical tasks, communication, and demonstration of knowledge.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  key: 'multiFormatSubmissions',
                  title: 'A. Diverse Expression Channels',
                  before: 'Handwritten timed essay with pen and paper as the only allowable submission format.',
                  udl: 'Submissions accepted via typed semantic document, recorded audio analysis, or structured slide deck.',
                  active: expressionChoices.multiFormatSubmissions
                },
                {
                  key: 'assistiveTechSupport',
                  title: 'B. Assistive Technology Compatibility',
                  before: 'Software platform locks out speech-to-text dictation and custom keyboard inputs.',
                  udl: 'Full support for speech recognition, screen magnifiers, single-switch scanning, and screen readers.',
                  active: expressionChoices.assistiveTechSupport
                },
                {
                  key: 'executiveScaffolding',
                  title: 'C. Executive Function Scaffolding',
                  before: 'Semester-long term paper due with no intermediate milestones or planning templates.',
                  udl: 'Broken into 4 milestones: outline checkpoint, draft review, peer feedback, and final polish.',
                  active: expressionChoices.executiveScaffolding
                }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggle('expression', item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: `1px solid ${item.active ? 'var(--arcade-green)' : 'var(--border-color)'}`,
                    background: item.active ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginTop: '0.1rem' }}>
                    {item.active ? <CheckCircle2 size={18} color="var(--arcade-green)" /> : <XCircle size={18} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: item.active ? 'var(--arcade-green)' : 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {item.active ? `✓ UDL Applied: ${item.udl}` : `Traditional Baseline: ${item.before}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real-World Population Inclusivity Impact */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Award size={16} color="var(--arcade-gold)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Learner Populations Benefited by Active Scaffolds ({totalScaffolds}/9)
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {[
              { label: 'Neurodivergent Learners (ADHD / Autism)', active: totalScaffolds >= 3 },
              { label: 'English Language Learners (ESL)', active: totalScaffolds >= 4 },
              { label: 'Students with Motor Disabilities', active: totalScaffolds >= 6 },
              { label: 'Deaf & Hard of Hearing Students', active: totalScaffolds >= 5 },
              { label: 'Students with Situational / Chronic Anxiety', active: totalScaffolds >= 2 },
              { label: 'All Learners (Universal Curb-Cut Benefit)', active: totalScaffolds >= 7 }
            ].map((pop, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  background: pop.active ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                  color: pop.active ? 'var(--arcade-green)' : 'var(--text-muted)',
                  border: `1px solid ${pop.active ? 'var(--arcade-green)' : 'var(--border-color)'}`,
                  fontWeight: pop.active ? 700 : 500
                }}
              >
                {pop.active ? '✓ ' : '○ '} {pop.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
