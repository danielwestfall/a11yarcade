import React, { useState, useRef, useEffect } from 'react';
import { Layers, CheckCircle2, ChevronDown, Sparkles, Code } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const TABS = [
  { id: 'tab-1', title: 'Overview', content: 'Web Accessibility Initiative (WAI) develops technical specifications and educational materials.' },
  { id: 'tab-2', title: 'Specifications', content: 'WCAG 2.2, WAI-ARIA 1.2, Authoring Practices Guide (APG), and User Agent Accessibility Guidelines.' },
  { id: 'tab-3', title: 'Evaluation', content: 'WCAG-EM evaluation methodology provides a 5-step structured auditing workflow for websites.' }
];

export default function AccessibleTabsComboboxLab() {
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [focusedTabIdx, setFocusedTabIdx] = useState(0);

  const tabRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    let nextIdx = index;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIdx = (index + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIdx = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = TABS.length - 1;
    }

    if (nextIdx !== index) {
      soundManager.playClick();
      setFocusedTabIdx(nextIdx);
      setActiveTabId(TABS[nextIdx].id);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  const handleSelectTab = (id, index) => {
    soundManager.playClick();
    setActiveTabId(id);
    setFocusedTabIdx(index);
  };

  return (
    <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={22} color="var(--arcade-green)" />
            <span>W3C APG Accessible Tabs Pattern Lab</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Test keyboard interaction rules from the WAI-ARIA Authoring Practices Guide (APG): single Tab stop into tablist, Arrow key navigation, and roving tabindex.
          </p>
        </div>
      </div>

      {/* Interactive Tabs Widget */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ background: '#090d16', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.8rem', color: '#94a3b8' }}>
          💡 <strong>Keyboard Instructions:</strong> Press <kbd style={{ background: '#1e293b', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>Tab</kbd> to enter the tablist, then use <kbd style={{ background: '#1e293b', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>← Left Arrow</kbd> and <kbd style={{ background: '#1e293b', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>Right Arrow →</kbd> or <kbd style={{ background: '#1e293b', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>Home / End</kbd> to change tabs.
        </div>

        {/* Tablist container */}
        <div
          role="tablist"
          aria-label="W3C Resources"
          style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', gap: '0.5rem' }}
        >
          {TABS.map((tab, idx) => {
            const isSelected = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[idx] = el)}
                role="tab"
                id={`tab-btn-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectTab(tab.id, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  borderBottom: isSelected ? '3px solid var(--arcade-green)' : '3px solid transparent',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--arcade-green)' : 'var(--text-muted)',
                  borderRadius: '6px 6px 0 0',
                  outlineOffset: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>{tab.title}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                  [tabindex="{isSelected ? '0' : '-1'}"]
                </span>
              </button>
            );
          })}
        </div>

        {/* Tabpanels */}
        {TABS.map((tab) => {
          const isSelected = activeTabId === tab.id;
          if (!isSelected) return null;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-btn-${tab.id}`}
              tabIndex={0}
              style={{
                padding: '1.25rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                animation: 'fadeIn 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--arcade-green)', marginBottom: '0.5rem' }}>
                {tab.title} Overview:
              </div>
              <p style={{ margin: 0 }}>
                {tab.content}
              </p>
            </div>
          );
        })}

        {/* Architectural Checklist */}
        <div style={{ background: '#05070e', border: '1px solid #1e293b', borderRadius: '6px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
          <span style={{ fontWeight: 800, color: 'var(--arcade-cyan)', textTransform: 'uppercase' }}>
            ✓ APG Pattern Verification Checklist
          </span>
          <div style={{ color: '#10b981' }}>✓ Single tab stop: only the selected tab has tabindex="0"; unselected tabs have tabindex="-1".</div>
          <div style={{ color: '#10b981' }}>✓ Left/Right arrow keys cycle focus seamlessly between tabs.</div>
          <div style={{ color: '#10b981' }}>✓ Tab panel has tabIndex="0" so keyboard-only users can scroll long content.</div>
        </div>
      </div>
    </div>
  );
}
