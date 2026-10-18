import React, { useEffect, useState } from 'react';
import { X, MessageSquareQuote, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

export default function TauntNotificationToast({ taunt, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!taunt) return;
    setVisible(true);

    // Play accompanying sound effect
    if (taunt.soundFx) {
      soundManager.playSoundById(taunt.soundFx);
    }

    // Auto-dismiss after 4.5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 300);
    }, 4500);

    return () => clearTimeout(timer);
  }, [taunt, onDismiss]);

  if (!taunt || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        maxWidth: '92vw',
        width: '540px',
        background: '#090d16',
        border: '2px solid #ec4899',
        borderRadius: '12px',
        boxShadow: '0 0 35px rgba(236, 72, 153, 0.4), 0 8px 32px rgba(0, 0, 0, 0.8)',
        padding: '1rem 1.25rem',
        animation: 'slideDownBounce 0.4s ease-out forwards',
        color: '#ffffff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.8rem', flexShrink: 0 }} role="img" aria-label="Player Avatar">
            {taunt.avatar || '🎮'}
          </span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <strong style={{ color: '#ec4899', fontSize: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                {taunt.nickname}
              </strong>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(236, 72, 153, 0.2)',
                  color: '#f472b6',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700
                }}
              >
                🔥 FIRED A TAUNT!
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Broadcast to all players in the room
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            if (onDismiss) onDismiss();
          }}
          aria-label="Dismiss taunt alert"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '36px',
            minHeight: '36px'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Comic Speech Bubble Body */}
      <blockquote
        style={{
          margin: '0.75rem 0 0 0',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderLeft: '4px solid #ec4899',
          borderRadius: '6px',
          fontSize: '1.05rem',
          fontStyle: 'italic',
          lineHeight: 1.5,
          color: '#f8fafc',
          fontFamily: "'Space Grotesk', sans-serif"
        }}
      >
        "{taunt.tauntText}"
      </blockquote>
    </div>
  );
}
