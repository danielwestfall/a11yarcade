import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Eye,
  FileCode,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const TREE_NODES = [
  {
    id: 'node-search-btn',
    name: 'Icon-Only Search Button',
    html: '<button aria-label="Search Academy Courses">\n  <svg class="search-icon" aria-hidden="true">...</svg>\n</button>',
    computedName: '"Search Academy Courses"',
    computedRole: 'button',
    nameSource: 'aria-label attribute overrides child nodes',
    properties: {
      focusable: true,
      keyboardTabbable: true,
      ariaHidden: false,
      contrastRatio: 'N/A (Icon graphic)'
    },
    status: 'PASS',
    statusMsg: 'Accessible name computed properly from aria-label; child decorative SVG ignored.'
  },
  {
    id: 'node-text-gradient',
    name: 'CSS Linear Gradient Heading',
    html: '<h1 style="background: linear-gradient(90deg, #38bdf8, #818cf8); -webkit-background-clip: text; color: transparent;">\n  Master Web Accessibility\n</h1>',
    computedName: '"Master Web Accessibility"',
    computedRole: 'heading (level 1)',
    nameSource: 'Text node child contents',
    properties: {
      focusable: false,
      keyboardTabbable: false,
      ariaHidden: false,
      contrastRatio: 'MANUAL AUDIT REQUIRED (Automated tools cannot evaluate worst-case gradient pixel point)'
    },
    status: 'WARNING',
    statusMsg: 'Automated scanners cannot evaluate gradient text contrast against background. Manual eyedropper required.'
  },
  {
    id: 'node-custom-combobox',
    name: 'Custom ARIA 1.2 Combobox Input',
    html: '<div role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-controls="country-list" aria-labelledby="cb-label">\n  <span id="cb-label">Select Country</span>\n  <input id="cb-input" aria-autocomplete="list" />\n</div>',
    computedName: '"Select Country"',
    computedRole: 'combobox',
    nameSource: 'aria-labelledby referencing #cb-label',
    properties: {
      focusable: true,
      keyboardTabbable: true,
      ariaExpanded: 'true',
      ariaHaspopup: 'listbox'
    },
    status: 'PASS',
    statusMsg: 'Role, Name, and State correctly exposed to accessibility API tree.'
  }
];

export default function DeepWebAuditToolingLab() {
  const [selectedNodeId, setSelectedNodeId] = useState('node-search-btn');
  const [inspectedAll, setInspectedAll] = useState(false);
  const [inspectedCount, setInspectedCount] = useState(1);

  const activeNode = TREE_NODES.find(n => n.id === selectedNodeId) || TREE_NODES[0];

  const handleSelectNode = (id) => {
    soundManager.playClick();
    setSelectedNodeId(id);
    const newCount = inspectedCount + 1;
    setInspectedCount(newCount);
    if (newCount >= TREE_NODES.length && !inspectedAll) {
      setInspectedAll(true);
      soundManager.playCorrect();
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  return (
    <section aria-label="DevTools Accessibility Tree Inspector Lab" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro */}
      <div style={{ background: 'var(--arcade-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--arcade-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Code2 size={20} aria-hidden="true" />
          Browser DevTools, Accessibility Trees & DOM Inspection
        </h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Screen readers and assistive technologies do not read raw HTML directly; they query the platform <strong>Accessibility Tree</strong> constructed by the browser engine. Inspect how the Accessible Name and Description Computation specification computes roles, names, and states.
        </p>
      </div>

      {/* Main Grid: Node Selector & Inspector Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Left: DOM Nodes Tree View */}
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--arcade-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} aria-hidden="true" />
            Accessibility Tree Elements
          </span>
          <div role="listbox" aria-label="DOM Nodes List" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            {TREE_NODES.map(node => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectNode(node.id)}
                  style={{
                    minHeight: '44px',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid var(--arcade-cyan)' : '1px solid var(--arcade-border)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--arcade-surface)',
                    color: isSelected ? 'var(--arcade-cyan)' : 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{node.name}</span>
                  <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: {node.computedRole}</code>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Computed Accessibility Properties Panel */}
        <div style={{ background: '#020617', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--arcade-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--arcade-green)' }}>
              Computed Accessibility Properties
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chrome / Firefox Tree</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Computed Name: </span>
              <strong style={{ color: 'var(--arcade-cyan)', fontFamily: 'monospace' }}>{activeNode.computedName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Role: </span>
              <strong style={{ color: '#facc15', fontFamily: 'monospace' }}>{activeNode.computedRole}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Name Source: </span>
              <span style={{ color: 'var(--text-main)' }}>{activeNode.nameSource}</span>
            </div>
          </div>

          {/* Raw HTML Snippet */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Source HTML:</span>
            <pre style={{ margin: '0.25rem 0 0 0', padding: '0.5rem', background: '#090d16', borderRadius: '4px', border: '1px solid var(--arcade-border)', color: '#38bdf8', fontSize: '0.75rem', overflowX: 'auto', fontFamily: 'monospace' }}>
              {activeNode.html}
            </pre>
          </div>

          {/* Verdict Box */}
          <div style={{ padding: '0.75rem', borderRadius: '6px', background: activeNode.status === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: `1px solid ${activeNode.status === 'PASS' ? 'var(--arcade-green)' : '#f59e0b'}`, fontSize: '0.85rem' }}>
            <strong style={{ color: activeNode.status === 'PASS' ? 'var(--arcade-green)' : '#f59e0b' }}>
              [{activeNode.status}]:
            </strong>{' '}
            <span style={{ color: 'var(--text-main)' }}>{activeNode.statusMsg}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
