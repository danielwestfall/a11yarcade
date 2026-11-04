import React, { useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useSkin, THEME_MASCOTS, THEME_ICONS } from '../utils/useSkin';
import { soundManager } from '../utils/sound';

/**
 * ThemeMascotBanner
 * Renders the active theme's mascot (Bit-Bot, Mochi-Bot, or A11y-Zero) with
 * pose selection ('hero' | 'academy' | 'victory' | 'at' | 'wcag' | 'laws')
 * and an interactive pep-talk speech bubble.
 */
export default function ThemeMascotBanner({
  pose = 'hero',
  customMessage = '',
  contextBadge = '',
  compact = false,
  isLcp = false
}) {
  const skin = useSkin();
  const mascot = THEME_MASCOTS[skin] || THEME_MASCOTS.arcade;
  const themeIcon = THEME_ICONS[skin] || THEME_ICONS.arcade;

  const [pepIdx, setPepIdx] = useState(0);
  const [imgSrc, setImgSrc] = useState(mascot.images[pose] || mascot.images.hero);

  // Sync image source when skin or pose changes
  React.useEffect(() => {
    setImgSrc(mascot.images[pose] || mascot.images.hero);
  }, [skin, pose, mascot]);

  const handleCyclePepTalk = () => {
    soundManager.playClick();
    setPepIdx((prev) => (prev + 1) % mascot.pepTalks.length);
  };

  const activeMessage = customMessage
    ? pepIdx === 0
      ? customMessage
      : mascot.pepTalks[pepIdx % mascot.pepTalks.length]
    : mascot.pepTalks[pepIdx % mascot.pepTalks.length];

  return (
    <div
      className="theme-mascot-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '0.85rem' : '1.15rem',
        padding: compact ? '0.75rem 1rem' : '1rem 1.25rem',
        background: 'var(--bg-surface-elevated)',
        border: mascot.borderStyle,
        borderRadius: mascot.borderRadius,
        boxShadow: mascot.shadow,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Mascot Portrait Frame */}
      <div
        style={{
          position: 'relative',
          width: compact ? '68px' : '92px',
          height: compact ? '68px' : '92px',
          borderRadius: skin === 'kawaii' ? '50%' : skin === 'anime' ? '4px' : '10px',
          border: `2.5px solid ${mascot.accent}`,
          background: '#ffffff',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: `0 0 14px ${mascot.accent}40`
        }}
      >
        <img
          src={imgSrc}
          alt={mascot.altText[pose] || mascot.altText.hero}
          width={compact ? 68 : 92}
          height={compact ? 68 : 92}
          {...(isLcp ? { fetchPriority: 'high' } : { loading: 'lazy' })}
          onError={() => {
            if (imgSrc !== mascot.images.hero) {
              setImgSrc(mascot.images.hero);
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      {/* Mascot Dialogue & Identity */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.3rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 900,
              padding: '0.15rem 0.55rem',
              borderRadius: skin === 'kawaii' ? '9999px' : '4px',
              background: `${mascot.accent}22`,
              color: 'var(--text-primary)',
              border: `1.5px solid ${mascot.accent}`
            }}
          >
            {themeIcon.hero} {mascot.name.toUpperCase()} • {mascot.role.toUpperCase()}
          </span>

          {contextBadge && (
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: skin === 'kawaii' ? '9999px' : '4px',
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {contextBadge}
            </span>
          )}
        </div>

        <p
          style={{
            margin: 0,
            fontSize: compact ? '0.85rem' : '0.92rem',
            lineHeight: 1.45,
            color: 'var(--text-primary)',
            fontWeight: 600
          }}
        >
          “{activeMessage}”
        </p>

        <div style={{ marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleCyclePepTalk}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              minHeight: '30px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 800,
              fontFamily: "'Space Mono', monospace",
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: `1.5px solid ${mascot.accent}`,
              borderRadius: skin === 'kawaii' ? '9999px' : '4px',
              cursor: 'pointer'
            }}
            aria-label={`Ask ${mascot.name} for another accessibility tip`}
          >
            <MessageCircle size={13} aria-hidden="true" />
            <span>Ask {mascot.name} Tip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
