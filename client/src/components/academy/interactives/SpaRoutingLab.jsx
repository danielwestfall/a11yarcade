import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Radio,
  Focus,
  CheckCircle2,
  XCircle,
  Volume2,
  RefreshCw,
  Code,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const ROUTES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Executive Dashboard | Arcade Analytics',
    description: 'System metrics, active certifications, and team accessibility scores.',
    badge: '3 Critical Alerts'
  },
  {
    id: 'settings',
    label: 'Profile & Settings',
    title: 'User Profile & Preferences | Arcade Analytics',
    description: 'Manage notification channels, high-contrast themes, and screen reader preferences.',
    badge: 'Preferences Saved'
  },
  {
    id: 'billing',
    label: 'Invoices & Billing',
    title: 'Enterprise Billing & Invoices | Arcade Analytics',
    description: 'Download PDF VPAT compliance certificates, license seats, and monthly invoices.',
    badge: 'Next Cycle: Nov 15'
  }
];

export default function SpaRoutingLab() {
  const [activeRouteId, setActiveRouteId] = useState('dashboard');
  const [enableTitleSync, setEnableTitleSync] = useState(false);
  const [enableFocusManagement, setEnableFocusManagement] = useState(false);
  const [enableLiveAnnouncer, setEnableLiveAnnouncer] = useState(false);

  // Simulated browser states
  const [simulatedDocTitle, setSimulatedDocTitle] = useState('Arcade Analytics — SPA Portal');
  const [speechLog, setSpeechLog] = useState([
    { text: 'Page loaded: Arcade Analytics — SPA Portal', timestamp: 'Initial load' }
  ]);
  const [focusedElementLabel, setFocusedElementLabel] = useState('Nav Link: Dashboard');

  const headingRef = useRef(null);
  const liveAnnouncerRef = useRef(null);

  const activeRoute = ROUTES.find(r => r.id === activeRouteId) || ROUTES[0];
  const allRemediated = enableTitleSync && enableFocusManagement && enableLiveAnnouncer;

  const navigateTo = (routeId) => {
    soundManager.playClick();
    setActiveRouteId(routeId);
    const targetRoute = ROUTES.find(r => r.id === routeId);

    // 1. Title Sync
    if (enableTitleSync) {
      setSimulatedDocTitle(targetRoute.title);
    }

    // 2. Focus Management
    if (enableFocusManagement) {
      setFocusedElementLabel(`Heading 1: "${targetRoute.label}" [tabIndex="-1"]`);
      setTimeout(() => {
        headingRef.current?.focus();
      }, 50);
    } else {
      setFocusedElementLabel(`Nav Link: "${targetRoute.label}" (Focus stranded in navbar)`);
    }

    // 3. Live Region Announcement
    if (enableLiveAnnouncer) {
      const speech = `Navigated to ${targetRoute.label} page. ${enableTitleSync ? targetRoute.title : ''}`;
      setSpeechLog(prev => [
        { text: speech, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);
      soundManager.playCorrect();
    } else {
      setSpeechLog(prev => [
        { text: '⚠️ [SILENCE] No route change announced. Screen reader user unaware of navigation.', timestamp: new Date().toLocaleTimeString(), isSilent: true },
        ...prev.slice(0, 4)
      ]);
    }
  };

  const handleToggle = (setter, currentVal) => {
    soundManager.playClick();
    setter(!currentVal);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Intro Header */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Globe size={18} color="var(--arcade-cyan)" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Single-Page Application (SPA) Routing & Focus Lab
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          In traditional multi-page websites, page loads trigger automatic title announcements and reset focus to the top.
          In client-side SPAs (React, Vue, Angular), client-side transitions bypass the browser’s navigation lifecycle.
          Without explicit accessibility handling, screen readers remain completely silent and keyboard focus remains stranded.
        </p>
      </div>

      {/* Remediation Controls / Toggles */}
      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            SPA Accessibility Remediation Suite (WCAG 2.4.2 · 2.4.3 · 4.1.3)
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: allRemediated ? 'var(--arcade-green)' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {allRemediated ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            {allRemediated ? '100% WCAG Compliant SPA Architecture' : 'Inaccessible Architecture Detected'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {/* Toggle 1: Title Sync */}
          <button
            type="button"
            onClick={() => handleToggle(setEnableTitleSync, enableTitleSync)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.85rem',
              borderRadius: '6px',
              border: `2px solid ${enableTitleSync ? 'var(--arcade-green)' : 'var(--border-color)'}`,
              background: enableTitleSync ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ marginTop: '0.1rem' }}>
              {enableTitleSync ? <CheckCircle2 size={18} color="var(--arcade-green)" /> : <XCircle size={18} color="#ef4444" />}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                1. Synchronize &lt;title&gt;
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Updates document.title per route for WCAG 2.4.2 Page Titled.
              </div>
            </div>
          </button>

          {/* Toggle 2: Focus Management */}
          <button
            type="button"
            onClick={() => handleToggle(setEnableFocusManagement, enableFocusManagement)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.85rem',
              borderRadius: '6px',
              border: `2px solid ${enableFocusManagement ? 'var(--arcade-green)' : 'var(--border-color)'}`,
              background: enableFocusManagement ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ marginTop: '0.1rem' }}>
              {enableFocusManagement ? <CheckCircle2 size={18} color="var(--arcade-green)" /> : <XCircle size={18} color="#ef4444" />}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                2. Shift Focus to &lt;h1&gt;
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Moves focus to route heading with tabIndex="-1" (WCAG 2.4.3).
              </div>
            </div>
          </button>

          {/* Toggle 3: Live Announcer */}
          <button
            type="button"
            onClick={() => handleToggle(setEnableLiveAnnouncer, enableLiveAnnouncer)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.85rem',
              borderRadius: '6px',
              border: `2px solid ${enableLiveAnnouncer ? 'var(--arcade-green)' : 'var(--border-color)'}`,
              background: enableLiveAnnouncer ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ marginTop: '0.1rem' }}>
              {enableLiveAnnouncer ? <CheckCircle2 size={18} color="var(--arcade-green)" /> : <XCircle size={18} color="#ef4444" />}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                3. ARIA Live Announcer
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Fires aria-live="polite" route announcement (WCAG 4.1.3).
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Simulated Browser Viewport */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        {/* Browser Top Navigation Bar */}
        <div style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-color)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          {/* Simulated Tab Title */}
          <div style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: enableTitleSync ? 'var(--arcade-green)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace' }}>
            <span>📄</span>
            <strong style={{ color: enableTitleSync ? 'var(--text-primary)' : '#ef4444' }}>
              {simulatedDocTitle}
            </strong>
            {!enableTitleSync && <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>(Stuck! No update on navigation)</span>}
          </div>
        </div>

        {/* In-App Navbar */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--arcade-cyan)' }}>
            ⚡ ArcadeAnalytics SPA
          </div>
          <nav aria-label="Simulated SPA Main Navigation" style={{ display: 'flex', gap: '0.5rem' }}>
            {ROUTES.map(route => {
              const isSelected = activeRouteId === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => navigateTo(route.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--arcade-cyan)' : 'var(--border-color)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-elevated)',
                    color: isSelected ? 'var(--arcade-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {route.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* In-App Route Content */}
        <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', minHeight: '160px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h1
              ref={headingRef}
              tabIndex={-1}
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                outline: enableFocusManagement ? '2px solid var(--arcade-green)' : 'none',
                outlineOffset: '4px',
                borderRadius: '2px'
              }}
            >
              {activeRoute.label}
            </h1>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--arcade-cyan)', fontWeight: 700, border: '1px solid var(--arcade-cyan)' }}>
              {activeRoute.badge}
            </span>
          </div>

          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {activeRoute.description}
          </p>

          {/* Active Element Badge */}
          <div style={{ marginTop: '1rem', padding: '0.6rem 0.8rem', borderRadius: '4px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <Focus size={14} color={enableFocusManagement ? 'var(--arcade-green)' : '#ef4444'} />
            <span style={{ color: 'var(--text-muted)' }}>Current Keyboard Focus:</span>
            <code style={{ color: enableFocusManagement ? 'var(--arcade-green)' : '#ef4444', fontWeight: 700 }}>
              {focusedElementLabel}
            </code>
          </div>
        </div>
      </div>

      {/* Screen Reader Speech Stream & Technical Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Virtual Screen Reader Speech Log */}
        <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '6px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Volume2 size={16} color="var(--arcade-gold)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Simulated Screen Reader Speech Stream (Live)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {speechLog.map((log, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '4px',
                  background: log.isSilent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.08)',
                  borderLeft: `3px solid ${log.isSilent ? '#ef4444' : 'var(--arcade-gold)'}`,
                  color: log.isSilent ? '#f87171' : '#fef08a',
                  fontFamily: 'monospace'
                }}
              >
                <span style={{ opacity: 0.6, marginRight: '0.4rem', fontSize: '0.7rem' }}>[{log.timestamp}]</span>
                {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Code Pattern Implementation */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Code size={16} color="var(--arcade-cyan)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Standard React Router Pattern
            </span>
          </div>

          <pre style={{ margin: 0, padding: '0.6rem', background: '#0a0f1d', borderRadius: '4px', fontSize: '0.75rem', color: '#93c5fd', overflowX: 'auto', lineHeight: 1.4, fontFamily: 'monospace' }}>
{`// 1. Sync Document Title
useEffect(() => {
  document.title = \`\${route.title} | A11y Arcade\`;
}, [route]);

// 2. Programmatic Focus
const headingRef = useRef(null);
useEffect(() => {
  headingRef.current?.focus();
}, [route]);

// 3. Live Announcer
<div aria-live="polite" aria-atomic="true" className="sr-only">
  Navigated to {route.title}
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
