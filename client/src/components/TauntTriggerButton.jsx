import React, { useState } from 'react';
import { Flame, Dice5, ChevronDown, ChevronUp, Send, Check } from 'lucide-react';
import { TAUNT_QUOTES, getRandomTaunt } from '../utils/taunts';
import { soundManager } from '../utils/sound';

export default function TauntTriggerButton({ socket, onTauntSent }) {
  const [cooldown, setCooldown] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [lastSentText, setLastSentText] = useState(null);

  const handleSendTaunt = (tauntObj) => {
    if (cooldown || !socket) return;

    soundManager.playClick();
    const taunt = tauntObj || getRandomTaunt();

    socket.emit('send-taunt', {
      tauntText: taunt.text,
      soundFx: taunt.soundFx
    }, (res) => {
      if (res && res.error) {
        console.warn('Taunt error:', res.error);
      }
    });

    setLastSentText(taunt.text);
    setCooldown(true);
    setShowPicker(false);
    if (onTauntSent) onTauntSent(taunt);

    // 2.5s cooldown
    setTimeout(() => {
      setCooldown(false);
      setLastSentText(null);
    }, 2500);
  };

  return (
    <div
      className="taunt-trigger-container"
      style={{
        background: 'rgba(236, 72, 153, 0.1)',
        border: '1px solid #ec4899',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '0.85rem 1rem',
        marginTop: '0.85rem',
        marginBottom: '0.85rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={20} color="#ec4899" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
              ROUND WINNER PRIVILEGE: TAUNT THE ROOM
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f472b6' }}>
              Broadcast a humorous taunt & sound effect to all players!
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => handleSendTaunt(null)}
            disabled={cooldown}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              minHeight: '44px',
              borderRadius: '6px',
              border: 'none',
              background: cooldown ? '#475569' : '#ec4899',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: cooldown ? 'not-allowed' : 'pointer',
              boxShadow: cooldown ? 'none' : '0 0 15px rgba(236, 72, 153, 0.4)'
            }}
            aria-label="Drop a random humorous taunt to all players"
          >
            <Dice5 size={18} />
            <span>{cooldown ? 'RECHARGING...' : '🎲 DROP RANDOM TAUNT'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPicker(prev => !prev)}
            disabled={cooldown}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.55rem 0.75rem',
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: '6px',
              border: '1px solid rgba(236, 72, 153, 0.5)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#f472b6',
              cursor: cooldown ? 'not-allowed' : 'pointer'
            }}
            aria-label="Toggle taunt list picker"
            aria-expanded={showPicker}
          >
            {showPicker ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {lastSentText && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Check size={16} />
          <span>Fired: "{lastSentText}"</span>
        </div>
      )}

      {/* Optional Taunt Picker Menu */}
      {showPicker && !cooldown && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(236, 72, 153, 0.3)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.5rem',
            maxHeight: '220px',
            overflowY: 'auto'
          }}
        >
          {TAUNT_QUOTES.slice(0, 6).map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendTaunt(item)}
              style={{
                textAlign: 'left',
                padding: '0.6rem 0.75rem',
                minHeight: '44px',
                borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#ec4899', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                [{item.tag.toUpperCase()}]
              </div>
              <div style={{ fontStyle: 'italic' }}>
                "{item.text}"
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
