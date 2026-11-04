import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, ShieldAlert, Sparkles, Sun, VolumeX, ShoppingBag, Car, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../../utils/sound';

const CURB_CUT_SCENARIOS = [
  {
    id: 'sunlight',
    title: 'Bright Direct Sunlight',
    icon: Sun,
    disabilityOrigin: 'Designed for Low Vision & Cataracts',
    curbCutBenefit: 'Allows smartphone users outside in noon glare to read emails and navigate maps without squinting.',
    wcagFeature: 'WCAG 1.4.3 & 1.4.6 Contrast (Minimum 4.5:1 / Enhanced 7:1) & High-Contrast Themes',
    impactMetric: '+100% readability outdoors on mobile devices'
  },
  {
    id: 'airport',
    title: 'Noisy Airport / Quiet Gym',
    icon: VolumeX,
    disabilityOrigin: 'Designed for Deaf & Hard of Hearing Individuals',
    curbCutBenefit: 'Over 80% of video captions on social media (TikTok, Instagram, LinkedIn) are watched on mute by hearing users in public spaces.',
    wcagFeature: 'WCAG 1.2.2 Captions (Prerecorded) & 1.2.4 Captions (Live)',
    impactMetric: '37% increase in video completion rate across all audiences'
  },
  {
    id: 'groceries',
    title: 'Holding Bags / Parent with Infant',
    icon: ShoppingBag,
    disabilityOrigin: 'Designed for Single-Limb Amputees & Motor Impairments',
    curbCutBenefit: 'Allows users holding groceries, holding an umbrella in rain, or carrying an infant to tap large hit targets and trigger voice commands with one hand.',
    wcagFeature: 'WCAG 2.5.5 / 2.5.8 Target Size (Minimum 24x24px, Enhanced 44x44px) & 2.5.1 Pointer Gestures',
    impactMetric: '42% decrease in accidental tap errors and cart abandonment'
  },
  {
    id: 'driving',
    title: 'Commuting / Driving in Traffic',
    icon: Car,
    disabilityOrigin: 'Designed for Blind Users & Screen Reader Navigation',
    curbCutBenefit: 'Text-to-speech audio playback and voice commands allow drivers to safely hear messages and dictate responses without taking eyes off the road.',
    wcagFeature: 'WCAG 4.1.2 Name, Role, Value & Speech Synthesis Interoperability',
    impactMetric: 'Enables hands-free connected car interfaces'
  }
];

export default function BusinessCaseCurbCutLab() {
  const [activeTab, setActiveTab] = useState('curb-cut'); // 'curb-cut' | 'roi-calculator'
  const [selectedScenarioId, setSelectedScenarioId] = useState('sunlight');
  const [monthlyVisitors, setMonthlyVisitors] = useState(100000);
  const [avgOrderValue, setAvgOrderValue] = useState(65);
  const [conversionRate, setConversionRate] = useState(2.5);

  const activeScenario = CURB_CUT_SCENARIOS.find(s => s.id === selectedScenarioId);

  // Business ROI Calculations
  // WHO statistic: 16% of global population has significant disability
  const disabledVisitors = Math.round(monthlyVisitors * 0.16);
  // Click-Away Pound / Fable study: 71% of disabled users leave inaccessible sites immediately
  const lostDisabledVisitors = Math.round(disabledVisitors * 0.71);
  const currentDisabledConversions = Math.round((disabledVisitors - lostDisabledVisitors) * (conversionRate / 100));
  const potentialDisabledConversions = Math.round(disabledVisitors * (conversionRate / 100));
  const recoveredAnnualRevenue = Math.round((potentialDisabledConversions - currentDisabledConversions) * avgOrderValue * 12);
  const averageLawsuitDefenseCost = 75000;

  const handleScenarioChange = (id) => {
    soundManager.playClick();
    setSelectedScenarioId(id);
  };

  const handleTabChange = (tab) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <TrendingUp size={20} color="#38bdf8" aria-hidden="true" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
              The Business Case, Curb-Cut Effect & ROI Modeler
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Explore how accessible design creates universal situational benefits and model the direct financial return on accessible digital experiences.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleTabChange('curb-cut')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'curb-cut' ? '1px solid #38bdf8' : '1px solid var(--border-color)',
              background: activeTab === 'curb-cut' ? '#38bdf820' : 'var(--bg-surface)',
              color: activeTab === 'curb-cut' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            Curb-Cut Simulator
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('roi-calculator')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'roi-calculator' ? '1px solid #10b981' : '1px solid var(--border-color)',
              background: activeTab === 'roi-calculator' ? '#10b98120' : 'var(--bg-surface)',
              color: activeTab === 'roi-calculator' ? '#10b981' : 'var(--text-muted)'
            }}
          >
            Financial ROI Calculator
          </button>
        </div>
      </div>

      {/* VIEW 1: CURB-CUT SIMULATOR */}
      {activeTab === 'curb-cut' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Situation Buttons */}
          <div
            role="tablist" onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
          const idx = tabs.indexOf(document.activeElement);
          if (idx === -1) return;
          const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : e.key === 'ArrowLeft' ? (idx - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[nextIdx]?.focus();
          tabs[nextIdx]?.click();
        }}
            aria-label="Curb cut situational scenarios"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}
          >
            {CURB_CUT_SCENARIOS.map((s) => {
              const Icon = s.icon;
              const isSelected = s.id === selectedScenarioId;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleScenarioChange(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface)',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                    color: isSelected ? '#38bdf8' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Detail Card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h5 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#38bdf8" aria-hidden="true" />
                {activeScenario.title}
              </h5>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                {activeScenario.impactMetric}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Origin Disability Need */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '6px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Accessible Design Origin
                </span>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeScenario.disabilityOrigin}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Technical Rule: {activeScenario.wcagFeature}
                </p>
              </div>

              {/* Universal Situational Benefit */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  The Curb-Cut Effect (Universal Situational Benefit)
                </span>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activeScenario.curbCutBenefit}
                </p>
              </div>
            </div>

            {/* Historical Curb Cut Context */}
            <div
              style={{
                padding: '0.9rem 1.15rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderLeft: '4px solid #38bdf8',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                color: 'var(--text-muted)'
              }}
            >
              <strong>The Historical Curb-Cut Lesson:</strong> Concrete sidewalk ramps were pioneered in Berkeley, California in the 1970s for wheelchair users. Today, over 90% of curb-cut users are parents pushing baby strollers, travelers rolling suitcases, package delivery workers with hand trucks, and skateboarders. Designing for disability creates superior experiences for everyone.
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FINANCIAL ROI CALCULATOR */}
      {activeTab === 'roi-calculator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {/* Controls Form */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Digital Business Parameters
              </h5>

              {/* Monthly Visitors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <label htmlFor="roi-visitors" style={{ color: 'var(--text-secondary)' }}>Monthly Unique Visitors</label>
                  <span style={{ fontWeight: 800, color: '#38bdf8' }}>{monthlyVisitors.toLocaleString()}</span>
                </div>
                <input
                  id="roi-visitors"
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={monthlyVisitors}
                  onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                  style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </div>

              {/* Average Order Value */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <label htmlFor="roi-aov" style={{ color: 'var(--text-secondary)' }}>Average Order Value (AOV)</label>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>${avgOrderValue}</span>
                </div>
                <input
                  id="roi-aov"
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  style={{ accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              {/* Baseline Conversion Rate */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <label htmlFor="roi-cvr" style={{ color: 'var(--text-secondary)' }}>Baseline Conversion Rate (%)</label>
                  <span style={{ fontWeight: 800, color: '#f59e0b' }}>{conversionRate}%</span>
                </div>
                <input
                  id="roi-cvr"
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  style={{ accentColor: '#f59e0b', cursor: 'pointer' }}
                />
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on WHO demographic data (16% global disability prevalence) and the Click-Away Pound finding that 71% of users with access needs immediately leave inaccessible websites.
              </div>
            </div>

            {/* Financial Output Dashboard */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Accessibility Financial Impact
              </h5>

              {/* Primary Metric: Recovered Annual Revenue */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#10b981' }}>
                  Estimated Recovered Annual Revenue
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>
                  +${recoveredAnnualRevenue.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  By eliminating checkout blockers for {lostDisabledVisitors.toLocaleString()} lost visitors/month.
                </span>
              </div>

              {/* Secondary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800 }}>
                    <Users size={14} aria-hidden="true" />
                    <span>Audience Retained</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {disabledVisitors.toLocaleString()}/mo
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    16% of total site traffic
                  </div>
                </div>

                <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800 }}>
                    <ShieldAlert size={14} aria-hidden="true" />
                    <span>Litigation Avoidance</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    ${averageLawsuitDefenseCost.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Avg. ADA legal defense cost
                  </div>
                </div>
              </div>

              {/* Global Market Callout */}
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong>Global Scale:</strong> People with disabilities represent a market larger than China, with over <strong>$13 Trillion</strong> in annual disposable income alongside friends, family, and allies.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
