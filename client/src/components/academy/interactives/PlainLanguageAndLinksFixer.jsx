import React, { useState } from 'react';
import { FileText, CheckCircle2, ArrowRight, RefreshCw, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const LINK_EXERCISES = [
  {
    id: 'link-1',
    context: 'A company policy webpage provides a link to download the 2026 Employee Health Benefits Guide.',
    brokenSnippet: `Our comprehensive healthcare offerings for the upcoming calendar year are available for review. To download the medical package, <a href="/benefits.pdf">click here</a>.`,
    brokenLinkText: '"click here"',
    brokenRotor: 'Screen reader link rotor announces: "click here" (Completely devoid of context!)',
    fixedSnippet: `Review our comprehensive healthcare offerings by downloading the <a href="/benefits.pdf">2026 Employee Health Benefits Guide (PDF, 2.4 MB)</a>.`,
    fixedLinkText: '"2026 Employee Health Benefits Guide (PDF, 2.4 MB)"',
    fixedRotor: 'Screen reader link rotor announces: "2026 Employee Health Benefits Guide, PDF, 2.4 MB"',
    explanation: 'Screen reader users frequently pull up a list of all links on a page (rotor list). Links like "click here" or "learn more" are meaningless out of context and violate WCAG 2.4.4 Link Purpose (In Context).'
  },
  {
    id: 'link-2',
    context: 'A news digest features links at the end of multiple article excerpts.',
    brokenSnippet: `Quarterly revenue surpassed projections following our international expansion. <a href="/article-1">Read more</a>\n\nNew accessibility compliance regulations take effect this June. <a href="/article-2">Read more</a>`,
    brokenLinkText: 'Multiple identical "Read more" links',
    brokenRotor: 'Screen reader link rotor announces: "Read more", "Read more" (Impossible to know which leads where!)',
    fixedSnippet: `<a href="/article-1">Read full report on Q3 international revenue expansion</a>\n\n<a href="/article-2">Read overview of June 2025 digital accessibility compliance regulations</a>`,
    fixedLinkText: 'Specific unique destination phrases',
    fixedRotor: 'Announces distinct and informative destinations',
    explanation: 'Identical link labels pointing to different destinations force screen reader users to exit the link list and read the surrounding paragraphs to understand where each link goes.'
  }
];

const PLAIN_LANGUAGE_EXERCISES = [
  {
    id: 'pl-1',
    title: 'Dense Bureaucratic Jargon vs Plain Language',
    bureaucratic: 'In the event that an individual desires to effectuate the procurement of workplace accommodations, it is incumbent upon said personnel to execute documentation utilizing Form 402-A prior to the temporal expiration of the thirty-day window.',
    remediated: 'If you need a workplace accommodation, please submit Form 402-A within 30 days.',
    gradeLevelBefore: 'Grade 17 (Postgraduate Reading Level)',
    gradeLevelAfter: 'Grade 7 (Plain Language Standard)',
    tips: 'Use active voice, everyday words, and eliminate archaic phrases like "effectuate procurement" or "incumbent upon said personnel".'
  }
];

export default function PlainLanguageAndLinksFixer() {
  const [activeTab, setActiveTab] = useState('links'); // 'links' | 'plain'
  const [currentLinkIdx, setCurrentLinkIdx] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [plainFixed, setPlainFixed] = useState(false);

  const currentExercise = LINK_EXERCISES[currentLinkIdx];

  const handleRemediateLink = () => {
    soundManager.playCorrect();
    setIsFixed(true);
  };

  const handleResetLink = () => {
    soundManager.playClick();
    setIsFixed(false);
  };

  const handleTogglePlain = () => {
    soundManager.playClick();
    if (!plainFixed) soundManager.playCorrect();
    setPlainFixed(!plainFixed);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="var(--arcade-amber)" />
            <span>Plain Language & Accessible Hyperlink Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Remediate ambiguous link text ("Click here", "Read more") and translate convoluted bureaucratic text into clear, scannable plain language per WCAG 2.4.4 and 3.1.5.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Plain language and link exercises"
        style={{ display: 'flex', gap: '0.5rem' }}
        onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
          const idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[nextIdx]?.focus();
          tabs[nextIdx]?.click();
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'links'}
          tabIndex={activeTab === 'links' ? 0 : -1}
          onClick={() => {
            soundManager.playClick();
            setActiveTab('links');
          }}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            border: activeTab === 'links' ? '2px solid var(--arcade-amber)' : '1px solid var(--border-color)',
            background: activeTab === 'links' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
            color: activeTab === 'links' ? 'var(--arcade-amber)' : 'var(--text-secondary)'
          }}
        >
          1. Descriptive Hyperlinks (WCAG 2.4.4)
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'plain'}
          tabIndex={activeTab === 'plain' ? 0 : -1}
          onClick={() => {
            soundManager.playClick();
            setActiveTab('plain');
          }}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            border: activeTab === 'plain' ? '2px solid var(--arcade-amber)' : '1px solid var(--border-color)',
            background: activeTab === 'plain' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
            color: activeTab === 'plain' ? 'var(--arcade-amber)' : 'var(--text-secondary)'
          }}
        >
          2. Plain Language & Readability (WCAG 3.1.5)
        </button>
      </div>

      {/* TAB 1: ACCESSIBLE LINKS */}
      {activeTab === 'links' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Exercise: Standalone Link Purpose Remediation
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {currentExercise.context}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isFixed ? (
                <button
                  type="button"
                  onClick={handleRemediateLink}
                  className="primary-btn"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Sparkles size={14} />
                  <span>Remediate Link Text</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetLink}
                  className="secondary-btn"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RefreshCw size={14} />
                  <span>View Original "Click Here"</span>
                </button>
              )}
            </div>
          </div>

          {/* Document Paragraph Snippet */}
          <div style={{ background: '#090d16', border: `1px solid ${isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)'}`, borderRadius: '6px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)', textTransform: 'uppercase' }}>
              {isFixed ? '✓ Accessible Contextual Link' : '⚠ Non-Descriptive Link Defect'}
            </span>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#f8fafc', whiteSpace: 'pre-line' }}>
              {isFixed ? currentExercise.fixedSnippet : currentExercise.brokenSnippet}
            </div>
          </div>

          {/* Screen Reader Rotor Simulation */}
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--arcade-cyan)' }}>
              Screen Reader Links Rotor (VoiceOver Rotor / NVDA Insert + F7):
            </span>
            <div style={{ padding: '0.6rem 0.85rem', background: '#05070e', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem', color: isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)', borderLeft: `3px solid ${isFixed ? 'var(--arcade-green)' : 'var(--arcade-crimson)'}` }}>
              {isFixed ? currentExercise.fixedRotor : currentExercise.brokenRotor}
            </div>
          </div>

          {/* Pedagogical Explanation */}
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
            {currentExercise.explanation}
          </p>
        </div>
      )}

      {/* TAB 2: PLAIN LANGUAGE */}
      {activeTab === 'plain' && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {PLAIN_LANGUAGE_EXERCISES[0].title}
            </h4>
            <button
              type="button"
              onClick={handleTogglePlain}
              className="primary-btn"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              {plainFixed ? 'Show Complex Jargon' : 'Simplify to Plain Language'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#090d16', border: `1px solid ${plainFixed ? '#334155' : 'var(--arcade-crimson)'}`, borderRadius: '6px', padding: '1.25rem', opacity: plainFixed ? 0.6 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>Before: Bureaucratic Jargon</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{PLAIN_LANGUAGE_EXERCISES[0].gradeLevelBefore}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: '#f8fafc' }}>
                "{PLAIN_LANGUAGE_EXERCISES[0].bureaucratic}"
              </p>
            </div>

            <div style={{ background: '#090d16', border: `1px solid ${plainFixed ? 'var(--arcade-green)' : '#334155'}`, borderRadius: '6px', padding: '1.25rem', opacity: plainFixed ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>After: Plain Language</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{PLAIN_LANGUAGE_EXERCISES[0].gradeLevelAfter}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: '#f8fafc', fontWeight: plainFixed ? 700 : 400 }}>
                "{PLAIN_LANGUAGE_EXERCISES[0].remediated}"
              </p>
            </div>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>💡 Plain Language Golden Rule: </strong> {PLAIN_LANGUAGE_EXERCISES[0].tips}
          </div>
        </div>
      )}
    </div>
  );
}
