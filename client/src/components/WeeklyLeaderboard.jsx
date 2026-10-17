import React, { useState, useEffect } from 'react';
import { Award, Trophy, Calendar, Sparkles, Flame, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { apiUrl } from '../utils/api';

export default function WeeklyLeaderboard() {
  const [activeTab, setActiveTab] = useState('WEEKLY'); // 'WEEKLY' | 'ALL_TIME'
  const [weeklyData, setWeeklyData] = useState([]);
  const [allTimeData, setAllTimeData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const currentList = activeTab === 'WEEKLY' ? weeklyData : allTimeData;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆📊</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Workplace Leaderboard & Hall of Fame
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
          Scores are automatically recorded across all live multiplayer games and team meetings.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'inline-flex', background: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('WEEKLY'); }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'WEEKLY' ? '#38bdf8' : 'transparent',
              color: activeTab === 'WEEKLY' ? '#000000' : '#ffffff',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Calendar size={16} />
            <span>This Week</span>
          </button>

          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('ALL_TIME'); }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'ALL_TIME' ? '#eab308' : 'transparent',
              color: activeTab === 'ALL_TIME' ? '#000000' : '#ffffff',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Trophy size={16} />
            <span>All-Time</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#38bdf8" />
            <span>{activeTab === 'WEEKLY' ? "This Week's Champions" : 'All-Time Champions'}</span>
          </h3>
          <button
            type="button"
            onClick={fetchLeaderboard}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#94a3b8', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RotateCcw size={14} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            Loading standings...
          </div>
        ) : currentList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎮</div>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>No games recorded for this period yet!</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Host a meeting game or play a match to get your name on the board.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentList.map((entry, idx) => (
              <div
                key={entry.nickname}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: idx === 0 ? 'rgba(234, 179, 8, 0.15)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${idx === 0 ? '#eab308' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--border-color)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, minWidth: '32px', color: idx === 0 ? '#fbbf24' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#d97706' : '#94a3b8' }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <span style={{ fontSize: '2rem' }}>{entry.avatar || '👤'}</span>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{entry.nickname}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {entry.gamesPlayed} {entry.gamesPlayed === 1 ? 'game' : 'games'} • {entry.wins} {entry.wins === 1 ? 'win' : 'wins'} • Best: {entry.bestScore.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8' }}>
                    {entry.totalScore.toLocaleString()} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
