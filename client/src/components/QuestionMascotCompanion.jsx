import React, { useState, useEffect } from 'react';
import { useSkin, resolveQuestionMascot } from '../utils/useSkin';

/**
 * QuestionMascotCompanion
 * Displays a contextually matched illustration of the active theme's mascot
 * (Bit-Bot for Neo-Arcade, Mochi-Bot for Kawaii Pastel, A11y-Zero for Manga/Anime)
 * alongside any text question in Practice, Live, Solo Arcade, or Academy modes.
 */
export default function QuestionMascotCompanion({
  question,
  isAnswered = false,
  isCorrect = false,
  compact = false,
  customCaption = ''
}) {
  const skin = useSkin();
  const scene = resolveQuestionMascot(question, skin);
  const { mascot } = scene;

  const targetImg = isAnswered && isCorrect
    ? mascot.images.victory
    : scene.imageUrl;

  const [imgSrc, setImgSrc] = useState(targetImg);

  useEffect(() => {
    setImgSrc(isAnswered && isCorrect ? mascot.images.victory : scene.imageUrl);
  }, [skin, question, isAnswered, isCorrect, scene.imageUrl, mascot.images.victory]);

  const statusText = isAnswered
    ? isCorrect
      ? mascot.victoryQuote
      : mascot.encouragementQuote
    : customCaption || scene.caption;

  return (
    <figure
      className="question-mascot-companion"
      style={{
        margin: '0 0 1.25rem 0',
        padding: compact ? '0.75rem 1rem' : '0.95rem 1.2rem',
        background: 'var(--bg-surface-elevated)',
        border: isAnswered
          ? `2px solid ${isCorrect ? '#10b981' : '#f59e0b'}`
          : mascot.borderStyle,
        borderRadius: mascot.borderRadius,
        boxShadow: mascot.shadow,
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '0.85rem' : '1.15rem',
        flexWrap: 'wrap'
      }}
    >
      <div
        style={{
          width: compact ? '144px' : '184px',
          height: compact ? '144px' : '184px',
          borderRadius: skin === 'kawaii' ? '22px' : skin === 'anime' ? '6px' : '12px',
          border: `3px solid ${isAnswered ? (isCorrect ? '#10b981' : '#f59e0b') : mascot.accent}`,
          background: '#ffffff',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: `0 6px 16px rgba(0, 0, 0, 0.28)`
        }}
      >
        <img
          src={imgSrc}
          alt={isAnswered && isCorrect ? mascot.altText.victory : scene.alt}
          width={compact ? 144 : 184}
          height={compact ? 144 : 184}
          loading="lazy"
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

      <figcaption style={{ flex: 1, minWidth: '220px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.45rem' }}>
          <span
            className="mascot-scene-badge"
            style={{
              fontSize: '0.78rem',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 900,
              padding: '0.2rem 0.65rem',
              borderRadius: skin === 'kawaii' ? '9999px' : '4px',
              background: isAnswered
                ? isCorrect
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(245, 158, 11, 0.2)'
                : `${mascot.accent}25`,
              color: 'var(--text-primary)',
              border: `1.5px solid ${isAnswered ? (isCorrect ? '#10b981' : '#f59e0b') : mascot.accent}`
            }}
          >
            {scene.badge}
          </span>

          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            {scene.sceneTitle}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: compact ? '0.92rem' : '1rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            fontWeight: 600
          }}
        >
          {statusText}
        </p>
      </figcaption>
    </figure>
  );
}
