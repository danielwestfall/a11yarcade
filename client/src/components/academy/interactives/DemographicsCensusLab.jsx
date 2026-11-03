import React, { useState } from 'react';
import {
  Users,
  PieChart,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Eye,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../../utils/sound';

const AGE_BRACKETS = [
  {
    id: '18-39',
    label: 'Ages 18–39 (Young Adult)',
    disabilityRate: 9,
    popEst: '72 Million',
    primaryImpairments: 'Cognitive/Neurodiverse (ADHD, Autism), Mental Health, Situational/Temporary injuries',
    techProfile: 'High digital literacy; high mobile adoption; frequent dark mode, captions, and text-to-speech usage.'
  },
  {
    id: '40-59',
    label: 'Ages 40–59 (Middle Adulthood)',
    disabilityRate: 18,
    popEst: '144 Million',
    primaryImpairments: 'Early presbyopia (low vision/reading glasses), RSI/Ergonomic motor pain, acquired chronic illness',
    techProfile: 'Increases default OS zoom to 125%-150%; sensitive to low-contrast grey text and small touch targets.'
  },
  {
    id: '60-74',
    label: 'Ages 60–74 (Older Adulthood)',
    disabilityRate: 31,
    popEst: '248 Million',
    primaryImpairments: 'Significant visual decline (cataracts, macular degeneration), high-frequency hearing loss, arthritis',
    techProfile: 'Heavy reliance on screen magnification, high contrast themes, and captioning for all video content.'
  },
  {
    id: '75+',
    label: 'Ages 75+ (Senior Population)',
    disabilityRate: 49,
    popEst: '392 Million',
    primaryImpairments: 'Multiple co-occurring conditions (vision + hearing + mobility), tremors, cognitive processing latency',
    techProfile: 'Requires large click targets, zero timed timeouts (WCAG 2.2.1), simplified linear navigation, and large fonts.'
  }
];

const PERSONA_SPECTRUM = [
  {
    domain: 'Touch / Motor',
    icon: '🖐️',
    permanent: { label: 'One arm (limb difference)', desc: 'Permanent anatomical limitation' },
    temporary: { label: 'Arm injury (cast / sprain)', desc: 'Heals in 6–8 weeks' },
    situational: { label: 'Holding a baby / carrying groceries', desc: 'Situational single-hand constraint' }
  },
  {
    domain: 'See / Vision',
    icon: '👁️',
    permanent: { label: 'Blind / Low Vision', desc: 'Screen reader or magnification user' },
    temporary: { label: 'Cataract surgery / dilated pupils', desc: 'Light-sensitive for several days' },
    situational: { label: 'Distracted driver / bright sun glare', desc: 'Screen invisible due to sunlight' }
  },
  {
    domain: 'Hear / Audio',
    icon: '👂',
    permanent: { label: 'Deaf / Profound hearing loss', desc: 'Relies on captions & sign language' },
    temporary: { label: 'Ear infection / clogged ear canal', desc: 'Temporary auditory attenuation' },
    situational: { label: 'Noisy airport bar / subway train', desc: 'Environmental noise drowns speaker' }
  },
  {
    domain: 'Speak / Speech',
    icon: '🗣️',
    permanent: { label: 'Non-verbal / Dysarthria', desc: 'Uses AAC speech generating device' },
    temporary: { label: 'Laryngitis / Dental anesthesia', desc: 'Vocal cords temporarily unusable' },
    situational: { label: 'Heavy regional accent in noisy room', desc: 'Voice AI fails speech recognition' }
  }
];

const SCENARIOS = [
  {
    id: 'case-1',
    title: 'The "Edge Case" Misconception & WHO 16% Benchmark',
    category: 'Global Prevalence',
    scenario:
      'A software engineering director dismisses digital accessibility during sprint planning, stating: "People with disabilities represent less than 1% of our customer base, so supporting screen readers and high contrast is an edge case." Human resources and legal advisors review global statistics.',
    question: 'According to the World Health Organization (WHO) World Report on Disability, what is the authoritative global prevalence of disability?',
    options: [
      {
        id: 'A',
        text: 'Approximately 16% of the global population (1.3 billion people)—making persons with disabilities the world\'s largest minority group, with 1 in 6 individuals experiencing significant disability.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Less than 1.5% worldwide, concentrated almost exclusively in specialized medical nursing facilities.',
        isCorrect: false
      },
      {
        id: 'C',
        text: '50% in developing nations, but strictly 0.5% in high-income European and North American markets.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'The WHO does not track disability; only local municipal building codes maintain demographic data.',
        isCorrect: false
      }
    ],
    explanation:
      'The WHO World Report on Disability establishes that an estimated 1.3 billion people—about 16% of the global population, or 1 in 6 people—experience significant disability. Designing for accessibility serves a massive mainstream audience, not an edge case.'
  },
  {
    id: 'case-2',
    title: 'Acquired Disability vs Congenital Disproportions',
    category: 'Etiology & Demographics',
    scenario:
      'A product design team assumes that nearly all people with disabilities were born with their impairments (congenital) and have spent their entire lives mastering specialized assistive technologies like Braille or Morse switches.',
    question: 'What do global epidemiological and census statistics reveal about the timing of disability acquisition?',
    options: [
      {
        id: 'A',
        text: 'Over 70% to 80% of disabilities are acquired during working-age adulthood or later life due to illness, accidents, repetitive stress, or the aging process, rather than being present at birth.',
        isCorrect: true
      },
      {
        id: 'B',
        text: '95% of disabilities are strictly congenital and genetic; adult onset is statistically negligible.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Disability acquisition only occurs after age 85.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Acquired disabilities are classified as lifestyle choices and are excluded from international civil rights protections.',
        isCorrect: false
      }
    ],
    explanation:
      'The vast majority of disabilities (>70-80%) are acquired during adulthood—due to diabetes, stroke, trauma, repetitive strain, and natural sensory/motor declines of aging. Many users with acquired limitations do not identify as "disabled" or know how to operate complex assistive tech, making intuitive universal design essential.'
  },
  {
    id: 'case-3',
    title: 'Washington Group on Disability Statistics Methodology',
    category: 'Census Variations',
    scenario:
      'Country A asks in its national census: "Do you consider yourself a disabled person?" (Binary Yes/No). Country B uses the Washington Group Short Set of Questions, asking: "Do you have difficulty seeing/hearing/walking/remembering/communicating even when using glasses/hearing aids?" (No difficulty, Some, A lot, Cannot do at all). Country A reports 2% disability; Country B reports 15%.',
    question: 'Why does the Washington Group functional approach yield much more accurate demographic data?',
    options: [
      {
        id: 'A',
        text: 'Binary "disabled" questions trigger social stigma and medical self-denial, causing massive underreporting, whereas functional questions measure real-world performance limitations without requiring self-identification.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Country B paid respondents $100 per checkmark, inflating the census numbers artificially.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'The Washington Group method only counts children under age 5.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Country A has a genetically superior population with zero chronic disease.',
        isCorrect: false
      }
    ],
    explanation:
      'The UN Washington Group questions focus on functional limitations in universal daily activities rather than medical diagnoses or the stigmatized label of "disabled." This functional approach captures older adults, people with chronic fatigue, and neurodivergent individuals who would otherwise answer "No" to a binary disability question.'
  },
  {
    id: 'case-4',
    title: 'The Microsoft Inclusive Design Persona Spectrum',
    category: 'Inclusive Design ROI',
    scenario:
      'A financial mobile app team implements closed captions and high contrast for videos to comply with accessibility standards. Post-launch analytics reveal that 68% of users activating captions do not identify as deaf or hard-of-hearing.',
    question: 'How does Microsoft\'s Persona Spectrum explain this dramatic market expansion?',
    options: [
      {
        id: 'A',
        text: 'Accessibility solutions designed for permanent disabilities naturally benefit massive populations with temporary impairments (ear infection) and situational constraints (noisy commute or quiet library).',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'The analytics software had a tracking cookie malfunction that falsified the metrics.',
        isCorrect: false
      },
      {
        id: 'C',
        text: 'Non-disabled users only use captions when required by criminal law.',
        isCorrect: false
      },
      {
        id: 'D',
        text: 'Captions consume less wireless cellular data than raw audio, so users use them to save battery.',
        isCorrect: false
      }
    ],
    explanation:
      'The Persona Spectrum demonstrates that designing for permanent disabilities solves for situational and temporary constraints as well. For example, solving for 25,000 people with one arm also benefits 13 million people with a temporary arm injury and 8 million parents holding an infant with one arm.'
  }
];

export default function DemographicsCensusLab() {
  const [selectedAgeId, setSelectedAgeId] = useState('40-59');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const activeAge = AGE_BRACKETS.find(a => a.id === selectedAgeId) || AGE_BRACKETS[0];
  const currentScenario = SCENARIOS[activeScenarioIdx];
  const selectedOption = userAnswers[currentScenario.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && currentScenario.options.find(o => o.id === selectedOption)?.isCorrect;

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    const opt = currentScenario.options.find(o => o.id === optId);
    const newAnswers = { ...userAnswers, [currentScenario.id]: optId };
    setUserAnswers(newAnswers);

    if (opt?.isCorrect) {
      soundManager.playCorrect();
      const newScore = score + 25;
      setScore(newScore);
      if (Object.keys(newAnswers).length === SCENARIOS.length) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setUserAnswers({});
    setScore(0);
    setActiveScenarioIdx(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.08))',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Disability Demographics, Global Census & Aging Simulator
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Examine the WHO 16% benchmark (1.3B people), acquired impairment prevalence, aging curves, and Microsoft Persona Spectrum
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Demographic Mastery
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: score === 100 ? 'var(--arcade-green)' : 'var(--arcade-yellow)' }}>
              {score}% ({Object.keys(userAnswers).length}/{SCENARIOS.length} Solved)
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
            title="Reset lab"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Global Key Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'var(--card-bg)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>WHO Global Benchmark</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>16% · 1.3 Billion</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 in 6 people globally experience significant disability</span>
        </div>

        <div style={{ background: 'var(--card-bg)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Acquired vs Congenital</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--arcade-green)' }}>&gt; 70% Acquired</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Most limitations occur in working adulthood or later life</span>
        </div>

        <div style={{ background: 'var(--card-bg)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Age 75+ Prevalence</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--arcade-yellow)' }}>49% Affected</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nearly half of all seniors experience functional impairments</span>
        </div>
      </div>

      {/* Aging Population & Functional Impairment Simulator */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Aging Population Simulator
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Functional Impairment Rates Across Lifespan
            </h4>
          </div>
        </div>

        {/* Age Bracket Selector */}
        <div role="tablist" aria-label="Age Brackets" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {AGE_BRACKETS.map((bracket) => {
            const isSelected = bracket.id === selectedAgeId;
            return (
              <button
                key={bracket.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedAgeId(bracket.id);
                }}
                className={`tab-btn ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '6px',
                  background: isSelected ? 'var(--card-bg)' : 'transparent',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <TrendingUp size={14} />
                <span>{bracket.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Age Bracket Details */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeAge.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Global Impact:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                {activeAge.disabilityRate}% ({activeAge.popEst})
              </span>
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${activeAge.disabilityRate}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8, var(--arcade-yellow))',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Common Acquired Limitations:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{activeAge.primaryImpairments}</div>
            </div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Digital Strategy & Needs:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{activeAge.techProfile}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Microsoft Persona Spectrum Matrix */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            The Microsoft Persona Spectrum
          </div>
          <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Permanent, Temporary & Situational Limitation Expansion
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {PERSONA_SPECTRUM.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#38bdf8' }}>
                <span>{p.icon}</span>
                <span>{p.domain}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--arcade-yellow)' }}>Permanent: </span>
                <span style={{ color: 'var(--text-primary)' }}>{p.permanent.label}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--arcade-cyan)' }}>Temporary: </span>
                <span style={{ color: 'var(--text-primary)' }}>{p.temporary.label}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--arcade-green)' }}>Situational: </span>
                <span style={{ color: 'var(--text-primary)' }}>{p.situational.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Solver Challenges */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Demographic Data Case Examiner
            </div>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Case {activeScenarioIdx + 1} of {SCENARIOS.length}: {currentScenario.title}
            </h4>
          </div>

          <span
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8'
            }}
          >
            {currentScenario.category}
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ marginBottom: '0.65rem' }}>
            <strong>Demographic Scenario:</strong> {currentScenario.scenario}
          </div>
          <div style={{ fontWeight: 700, color: '#38bdf8' }}>
            {currentScenario.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentScenario.options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            let optBorder = 'var(--border-color)';
            let optBg = 'var(--bg-secondary)';

            if (isAnswered) {
              if (opt.isCorrect) {
                optBorder = 'var(--arcade-green)';
                optBg = 'rgba(16, 185, 129, 0.12)';
              } else if (isChosen && !opt.isCorrect) {
                optBorder = '#ef4444';
                optBg = 'rgba(239, 68, 68, 0.12)';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  background: optBg,
                  border: `1px solid ${optBorder}`,
                  textAlign: 'left',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    background: isAnswered && opt.isCorrect ? 'var(--arcade-green)' : isAnswered && isChosen ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    color: isAnswered && (opt.isCorrect || isChosen) ? '#ffffff' : 'var(--text-primary)'
                  }}
                >
                  {opt.id}
                </div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-primary)' }}>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Rationale */}
        {isAnswered && (
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '6px',
              background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${isCorrect ? 'var(--arcade-green)' : '#ef4444'}`,
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)'
            }}
          >
            <strong>{isCorrect ? '✓ Correct Demographic Finding:' : '✗ Incorrect Demographic Interpretation:'}</strong> {currentScenario.explanation}
          </div>
        )}

        {/* Stepper Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            type="button"
            disabled={activeScenarioIdx === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev - 1);
            }}
            className="secondary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            ← Previous Case
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Case {activeScenarioIdx + 1} of {SCENARIOS.length}
          </span>

          <button
            type="button"
            disabled={activeScenarioIdx === SCENARIOS.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveScenarioIdx(prev => prev + 1);
            }}
            className="primary-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Next Case →
          </button>
        </div>
      </div>
    </div>
  );
}
