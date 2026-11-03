import React, { useState } from 'react';
import {
  Volume2,
  List,
  Navigation,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Hash,
  Link as LinkIcon,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const SAMPLE_PAGE_ELEMENTS = [
  { id: 'el-1', type: 'landmark', name: 'banner', tag: '<header role="banner">', speech: 'Banner landmark' },
  { id: 'el-2', type: 'heading', level: 1, name: 'Student Financial Services Portal', tag: '<h1>', speech: 'Heading level 1, Student Financial Services Portal' },
  { id: 'el-3', type: 'link', name: 'Skip to Main Content', tag: '<a href="#main">', speech: 'Link, Skip to Main Content' },
  { id: 'el-4', type: 'landmark', name: 'main', tag: '<main role="main">', speech: 'Main landmark' },
  { id: 'el-5', type: 'heading', level: 2, name: 'Outstanding Tuition Balance', tag: '<h2>', speech: 'Heading level 2, Outstanding Tuition Balance' },
  { id: 'el-6', type: 'form', name: 'Payment Amount ($USD)', tag: '<input type="number">', speech: 'Payment Amount dollars USD, edit text, required, 0.00' },
  { id: 'el-7', type: 'form', name: 'Select Payment Method', tag: '<select>', speech: 'Select Payment Method, combobox collapsed' },
  { id: 'el-8', type: 'heading', level: 3, name: 'Payment Schedule Options', tag: '<h3>', speech: 'Heading level 3, Payment Schedule Options' },
  { id: 'el-9', type: 'link', name: 'Download Tuition Breakdown PDF', tag: '<a href="/breakdown.pdf">', speech: 'Link, Download Tuition Breakdown PDF' },
  { id: 'el-10', type: 'form', name: 'Submit Payment Authorization', tag: '<button type="submit">', speech: 'Submit Payment Authorization, button' },
  { id: 'el-11', type: 'landmark', name: 'contentinfo', tag: '<footer role="contentinfo">', speech: 'Contentinfo landmark' }
];

export default function ScreenReaderSpeechTestingLab() {
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const [activeRotorCategory, setActiveRotorCategory] = useState('headings'); // 'headings' | 'links' | 'forms' | 'landmarks'
  const [speechLog, setSpeechLog] = useState([SAMPLE_PAGE_ELEMENTS[0].speech]);
  const [speechRate, setSpeechRate] = useState(1);
  const [completedTour, setCompletedTour] = useState(false);

  const activeElement = SAMPLE_PAGE_ELEMENTS[activeElementIndex];

  const handleSpeakElement = (idx) => {
    soundManager.playClick();
    setActiveElementIndex(idx);
    const spoken = SAMPLE_PAGE_ELEMENTS[idx].speech;
    setSpeechLog(prev => [spoken, ...prev.slice(0, 9)]);
    if (idx === SAMPLE_PAGE_ELEMENTS.length - 1 && !completedTour) {
      setCompletedTour(true);
      soundManager.playCorrect();
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  const handleNextElement = () => {
    const nextIdx = (activeElementIndex + 1) % SAMPLE_PAGE_ELEMENTS.length;
    handleSpeakElement(nextIdx);
  };

  const handlePrevElement = () => {
    const prevIdx = (activeElementIndex - 1 + SAMPLE_PAGE_ELEMENTS.length) % SAMPLE_PAGE_ELEMENTS.length;
    handleSpeakElement(prevIdx);
  };

  const handleJumpNextHeading = () => {
    const nextHeadingIdx = SAMPLE_PAGE_ELEMENTS.findIndex((el, i) => i > activeElementIndex && el.type === 'heading');
    if (nextHeadingIdx !== -1) {
      handleSpeakElement(nextHeadingIdx);
    } else {
      const wrapIdx = SAMPLE_PAGE_ELEMENTS.findIndex(el => el.type === 'heading');
      if (wrapIdx !== -1) handleSpeakElement(wrapIdx);
    }
  };

  const handleJumpNextForm = () => {
    const nextFormIdx = SAMPLE_PAGE_ELEMENTS.findIndex((el, i) => i > activeElementIndex && el.type === 'form');
    if (nextFormIdx !== -1) {
      handleSpeakElement(nextFormIdx);
    } else {
      const wrapIdx = SAMPLE_PAGE_ELEMENTS.findIndex(el => el.type === 'form');
      if (wrapIdx !== -1) handleSpeakElement(wrapIdx);
    }
  };

  const handleJumpNextLink = () => {
    const nextLinkIdx = SAMPLE_PAGE_ELEMENTS.findIndex((el, i) => i > activeElementIndex && el.type === 'link');
    if (nextLinkIdx !== -1) {
      handleSpeakElement(nextLinkIdx);
    } else {
      const wrapIdx = SAMPLE_PAGE_ELEMENTS.findIndex(el => el.type === 'link');
      if (wrapIdx !== -1) handleSpeakElement(wrapIdx);
    }
  };

  const filteredRotorElements = SAMPLE_PAGE_ELEMENTS.filter(el => {
    if (activeRotorCategory === 'headings') return el.type === 'heading';
    if (activeRotorCategory === 'links') return el.type === 'link';
    if (activeRotorCategory === 'forms') return el.type === 'form';
    if (activeRotorCategory === 'landmarks') return el.type === 'landmark';
    return true;
  });

  return (
    <section aria-label="Screen Reader Speech & Rotor Simulation Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-green)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Volume2 size={20} aria-hidden="true" />
          Screen Reader Testing & Practical Rotor Navigation
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Screen reader users navigate via virtual cursor linear reading, single-key quick keys (<strong>H</strong> for headings, <strong>F</strong> for form fields, <strong>K</strong> for links), and the <strong>Rotor / Elements List</strong> (VO-U in VoiceOver, Insert+F7 in JAWS/NVDA). Test real-time speech announcements and linear rotor indexing.
        </p>
      </div>

      {/* Main Grid: Speech Output + Virtual Rotor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Left: Simulated Speech Synthesizer Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--arcade-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={16} aria-hidden="true" />
              Live Speech Synthesizer Buffer
            </span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--arcade-green)' }}>
              TTS Active
            </span>
          </div>

          {/* Current Spoken Announcement */}
          <div
            role="status"
            aria-live="assertive"
            style={{
              padding: '1rem',
              borderRadius: '6px',
              background: '#020617',
              border: '2px solid var(--arcade-green)',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            🔊 "{activeElement.speech}"
          </div>

          {/* Quick Keys Navigation Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={handleJumpNextHeading}
              style={{
                minHeight: '44px',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--arcade-border)',
                background: 'var(--arcade-surface)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Jump to Next Heading (H key)"
            >
              <Hash size={14} aria-hidden="true" />
              Next Heading [H]
            </button>

            <button
              type="button"
              onClick={handleJumpNextForm}
              style={{
                minHeight: '44px',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--arcade-border)',
                background: 'var(--arcade-surface)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Jump to Next Form Control (F key)"
            >
              <CheckSquare size={14} aria-hidden="true" />
              Next Form [F]
            </button>

            <button
              type="button"
              onClick={handleJumpNextLink}
              style={{
                minHeight: '44px',
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--arcade-border)',
                background: 'var(--arcade-surface)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Jump to Next Link (K key)"
            >
              <LinkIcon size={14} aria-hidden="true" />
              Next Link [K]
            </button>
          </div>

          {/* Speech History Log */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recent Speech Log:</span>
            <ol style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {speechLog.slice(1, 5).map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: Screen Reader Rotor / Elements List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--arcade-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <List size={16} aria-hidden="true" />
              Virtual Elements Rotor
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>VO-U / Insert+F7</span>
          </div>

          {/* Rotor Category Tabs */}
          <div role="tablist" aria-label="Rotor category filters" style={{ display: 'flex', gap: '0.35rem', background: 'var(--arcade-surface)', padding: '0.25rem', borderRadius: '6px' }}>
            {[
              { id: 'headings', label: 'Headings' },
              { id: 'links', label: 'Links' },
              { id: 'forms', label: 'Form Controls' },
              { id: 'landmarks', label: 'Landmarks' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeRotorCategory === tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveRotorCategory(tab.id);
                }}
                style={{
                  flex: 1,
                  minHeight: '36px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeRotorCategory === tab.id ? 'var(--arcade-cyan)' : 'transparent',
                  color: activeRotorCategory === tab.id ? '#000' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Rotor Items Listbox */}
          <div
            role="listbox"
            aria-label={`Rotor ${activeRotorCategory} list`}
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              padding: '0.25rem'
            }}
          >
            {filteredRotorElements.map(el => {
              const fullIdx = SAMPLE_PAGE_ELEMENTS.findIndex(item => item.id === el.id);
              const isActive = fullIdx === activeElementIndex;
              return (
                <button
                  key={el.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSpeakElement(fullIdx)}
                  style={{
                    minHeight: '44px',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: isActive ? '1px solid var(--arcade-cyan)' : '1px solid transparent',
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--arcade-surface)',
                    color: isActive ? 'var(--arcade-cyan)' : 'var(--text-main)',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{el.type === 'heading' ? `H${el.level}: ` : ''}{el.name}</span>
                  <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{el.tag}</code>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={handlePrevElement}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.25rem',
            borderRadius: '6px',
            border: '1px solid var(--arcade-border)',
            background: 'var(--arcade-surface)',
            color: 'var(--text-main)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ← Previous Element (Up Arrow)
        </button>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Element {activeElementIndex + 1} of {SAMPLE_PAGE_ELEMENTS.length}
        </span>

        <button
          type="button"
          onClick={handleNextElement}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--arcade-green)',
            color: '#000',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Next Element (Down Arrow) →
        </button>
      </div>

      {/* Educational Verification */}
      {completedTour && (
        <div
          role="region"
          aria-live="polite"
          style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--arcade-green)',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <CheckCircle2 size={24} style={{ color: 'var(--arcade-green)' }} aria-hidden="true" />
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            <strong>Screen Reader Rotor Mastery Confirmed!</strong> You have traversed linear DOM order, rotor element lists, and single-key navigation patterns across headings, form fields, and landmark boundaries.
          </p>
        </div>
      )}
    </section>
  );
}
