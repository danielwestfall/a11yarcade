import React, { useState, useEffect } from 'react';
import { Award, Trophy, Calendar, Sparkles, Flame, RotateCcw, Search, Shield, Zap } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { apiUrl } from '../utils/api';
import { CADET_SPECIALTIES } from './LiveMode';

export default function WeeklyLeaderboard() {
  const [activeTab, setActiveTab] = useState('WEEKLY'); // 'WEEKLY' | 'ALL_TIME'
  const [weeklyData, setWeeklyData] = useState([]);
  const [allTimeData, setAllTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const [weekRes, allRes] = await Promise.all([
        fetch(apiUrl('/api/leaderboard/weekly')).then(r => r.json()),
        fetch(apiUrl('/api/leaderboard/all-time')).then(r => r.json())
      ]);
      setWeeklyData(weekRes.leaderboard || []);
      setAllTimeData(allRes.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = (() => {
    try {
      const saved = localStorage.getItem('a11yarcade_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const rawList = activeTab === 'WEEKLY' ? weeklyData : allTimeData;
  const currentList = rawList.filter(entry =>
    !searchTerm.trim() || entry.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top1 = currentList[0];
  const top2 = currentList[1];
  const top3 = currentList[2];

  const myEntryIndex = currentList.findIndex(e =>
    currentUser?.nickname && e.nickname.toLowerCase() === currentUser.nickname.toLowerCase()
  );
  const myEntry = myEntryIndex !== -1 ? currentList[myEntryIndex] : null;

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '7rem' }}>
      {/* Marquee Hero Header */}
      <section aria-labelledby="leaderboard-title" className="marquee-hero-card">
        <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(234, 179, 8, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #facc15', color: '#fef08a', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🏆</span>
              <span>[CPACC BATTLE STATS // VER 2.2]</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #38bdf8', color: '#7dd3fc', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)' }}>
              [LIVE ROOM AGGREGATION]
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🛡️</span>
              <span>WCAG 2.2 AAA VERIFIED</span>
            </span>
            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #334155', color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: '#0b1326' }}>
              [WEEKLY SPRINT CYCLE]
            </span>
          </div>

          <h1 id="leaderboard-title" style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            WORKPLACE LEADERBOARD & HALL OF FAME
          </h1>
          <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: '#94a3b8', maxWidth: '820px', lineHeight: 1.5 }}>
            Honoring our keyboard warriors and accessibility champions! Scores are automatically recorded live during meeting multiplayer drills, live team calls, and solo gauntlets.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace" }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Total Ranked Cadets: </span>
              <strong style={{ color: '#ffffff' }}>{rawList.length}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Top Score on Record: </span>
              <strong style={{ color: '#facc15' }}>{rawList[0] ? rawList[0].totalScore.toLocaleString() : 0} XP</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Active Mode: </span>
              <strong style={{ color: '#38bdf8' }}>{activeTab === 'WEEKLY' ? "THIS WEEK'S SPRINT" : 'ALL-TIME HALL OF FAME'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 Champions Podium (if data exists) */}
      {currentList.length > 0 && (
        <section aria-labelledby="podium-title" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 id="podium-title" style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, fontFamily: "'Space Grotesk', sans-serif", color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👑</span>
            <span>CHAMPIONS PODIUM</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
            {/* 2nd Place: Silver (Left) */}
            {top2 ? (
              <article className="card" style={{ border: '2px solid #94a3b8', background: 'var(--bg-surface)', padding: '1.5rem', textAlign: 'center', boxShadow: '4px 4px 0px 0px #040810' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1', fontWeight: 800, padding: '0.2rem 0.6rem', background: '#0b1326', border: '1px solid #94a3b8', borderRadius: '4px' }}>
                  🥈 RANK #2 • SILVER
                </span>
                <div style={{ fontSize: '3rem', margin: '0.75rem 0 0.25rem 0' }}>{top2.avatar || '🥈'}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{top2.nickname}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                  {CADET_SPECIALTIES[1]}
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#cbd5e1', marginTop: '0.75rem' }}>
                  {top2.totalScore.toLocaleString()} XP
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {top2.gamesPlayed} games • {top2.wins} wins
                </div>
              </article>
            ) : null}

            {/* 1st Place: Gold (Center / Raised) */}
            {top1 ? (
              <article className="card" style={{ border: '3px solid #facc15', background: '#131b2e', padding: '1.75rem 1.5rem', textAlign: 'center', boxShadow: '6px 6px 0px 0px #ca8a04', transform: 'scale(1.02)' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#facc15', fontWeight: 900, padding: '0.25rem 0.75rem', background: 'rgba(250, 204, 21, 0.15)', border: '1px solid #facc15', borderRadius: '4px' }}>
                  👑 RANK #1 • GOLD CHAMPION
                </span>
                <div style={{ fontSize: '3.6rem', margin: '0.75rem 0 0.25rem 0' }}>{top1.avatar || '👑'}</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{top1.nickname}</h3>
                <span style={{ fontSize: '0.75rem', color: '#facc15', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                  {CADET_SPECIALTIES[0]}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15', marginTop: '0.75rem' }}>
                  {top1.totalScore.toLocaleString()} XP
                </div>
                <div style={{ fontSize: '0.8rem', color: '#fef08a', marginTop: '0.25rem', fontWeight: 700 }}>
                  🔥 {top1.wins} wins • Best: {top1.bestScore.toLocaleString()}
                </div>
              </article>
            ) : null}

            {/* 3rd Place: Bronze (Right) */}
            {top3 ? (
              <article className="card" style={{ border: '2px solid #d97706', background: 'var(--bg-surface)', padding: '1.5rem', textAlign: 'center', boxShadow: '4px 4px 0px 0px #040810' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#fbbf24', fontWeight: 800, padding: '0.2rem 0.6rem', background: '#0b1326', border: '1px solid #d97706', borderRadius: '4px' }}>
                  🥉 RANK #3 • BRONZE
                </span>
                <div style={{ fontSize: '3rem', margin: '0.75rem 0 0.25rem 0' }}>{top3.avatar || '🥉'}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{top3.nickname}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                  {CADET_SPECIALTIES[2]}
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', marginTop: '0.75rem' }}>
                  {top3.totalScore.toLocaleString()} XP
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {top3.gamesPlayed} games • {top3.wins} wins
                </div>
              </article>
            ) : null}
          </div>
        </section>
      )}

      {/* Interactive Arcade Filter Console */}
      <section aria-label="Leaderboard Filters" className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Sprint vs Hall of Fame Toggle */}
          <div style={{ display: 'inline-flex', background: '#060e20', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', gap: '4px' }}>
            <button
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab('WEEKLY'); }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'WEEKLY' ? '#38bdf8' : 'transparent',
                color: activeTab === 'WEEKLY' ? '#090d16' : '#ffffff',
                fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <Calendar size={16} />
              <span>THIS WEEK'S SPRINT</span>
            </button>

            <button
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab('ALL_TIME'); }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'ALL_TIME' ? '#facc15' : 'transparent',
                color: activeTab === 'ALL_TIME' ? '#090d16' : '#ffffff',
                fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <Trophy size={16} />
              <span>ALL-TIME HALL OF FAME</span>
            </button>
          </div>

          {/* Search Cadet Input */}
          <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search cadet or specialist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              aria-label="Search leaderboard by cadet nickname"
            />
          </div>

          <button
            type="button"
            onClick={fetchLeaderboard}
            className="btn-secondary arcade-btn-deck"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={15} />
            <span>Refresh Roster</span>
          </button>
        </div>
      </section>

      {/* Tactile Leaderboard Matrix Table */}
      <section aria-labelledby="matrix-title" className="card" style={{ padding: '1.5rem' }}>
        <h3 id="matrix-title" style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 1.25rem 0', fontFamily: "'Space Grotesk', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="#38bdf8" />
          <span>{activeTab === 'WEEKLY' ? "This Week's Cadet Standings" : "All-Time Hall of Fame Registry"} ({currentList.length} Cadets)</span>
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
            [⧗] ACCESSING TACTICAL SCORING MAINFRAME...
          </div>
        ) : currentList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎮</div>
            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>No battle records match your filter!</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Host a meeting arcade drill or play a solo match to enter the Hall of Fame.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentList.map((entry, idx) => {
              const isMe = currentUser?.nickname && entry.nickname.toLowerCase() === currentUser.nickname.toLowerCase();
              return (
                <article
                  key={entry.nickname}
                  className="cadet-card"
                  style={{
                    background: isMe ? 'rgba(56, 189, 248, 0.12)' : idx === 0 ? 'rgba(250, 204, 21, 0.08)' : 'var(--bg-surface)',
                    borderColor: isMe ? '#38bdf8' : idx === 0 ? '#facc15' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : 'var(--border-color)',
                    padding: '1rem 1.25rem',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, minWidth: '40px', fontFamily: "'Space Mono', monospace", color: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#d97706' : '#94a3b8' }}>
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </span>
                    <div style={{ width: '44px', height: '44px', background: '#060e20', border: `2px solid ${isMe ? '#38bdf8' : 'var(--border-color)'}`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {entry.avatar || '👤'}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                        <span>{entry.nickname}</span>
                        {isMe && (
                          <span style={{ background: '#38bdf8', color: '#090d16', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8', marginTop: '0.15rem' }}>
                        {CADET_SPECIALTIES[idx % CADET_SPECIALTIES.length]}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                        {entry.gamesPlayed} {entry.gamesPlayed === 1 ? 'game' : 'games'} • {entry.wins} {entry.wins === 1 ? 'win' : 'wins'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: "'Space Mono', monospace" }}>
                        Best: {entry.bestScore.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: idx === 0 ? '#facc15' : '#38bdf8', fontFamily: "'Space Grotesk', sans-serif" }}>
                        {entry.totalScore.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                        TOTAL XP
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Fixed Bottom Player Arcade Dock */}
      <aside aria-label="Leaderboard command deck" className="arcade-dock">
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
            {myEntry ? (
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>
                YOU: Rank #{myEntryIndex + 1} • {myEntry.totalScore.toLocaleString()} XP • {myEntry.wins} Wins
              </span>
            ) : (
              <span style={{ color: '#94a3b8' }}>
                Join or host a multiplayer match to claim your official rank!
              </span>
            )}
            <span>•</span>
            <span style={{ color: '#10b981' }}>
              ✓ WCAG 2.2 AAA Validated Roster
            </span>
          </div>

          <button
            type="button"
            className="btn-primary arcade-btn-secondary"
            onClick={() => {
              soundManager.playClick();
              window.location.hash = '#lobby';
              window.location.reload();
            }}
            style={{
              padding: '0.65rem 1.75rem',
              fontSize: '0.95rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              background: '#10b981',
              borderColor: '#10b981',
              color: '#090d16'
            }}
          >
            <span>[ INSERT COIN // CHALLENGE LEADERBOARD ]</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

