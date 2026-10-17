import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  Users,
  Play,
  ArrowRight,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BarChart3,
  Gamepad2,
  Zap,
  Copy,
  Check,
  QrCode,
  Link as LinkIcon,
  Lock
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { getSocketUrl } from '../utils/api';
import HotPotatoMode from './HotPotatoMode';
import GrandPrixMode from './GrandPrixMode';
import HighRollerMode from './HighRollerMode';
import FlawFinderMode from './FlawFinderMode';
import SaboteurMode from './SaboteurMode';
import BoundaryBrawlMode from './BoundaryBrawlMode';

const SHAPE_ICONS = {
  triangle: '▲',
  diamond: '◆',
  circle: '●',
  square: '■'
};

const SHAPE_NAMES = {
  triangle: 'Red Triangle',
  diamond: 'Blue Diamond',
  circle: 'Amber Circle',
  square: 'Green Square'
};

const AVATARS = ['🐱', '🐶', '🦊', '🦉', '🐼', '🚀', '💡', '🥑', '⚡', '🌟', '🦄', '🐙'];

export default function LiveMode() {
  const [role, setRole] = useState(null); // null, 'HOST', 'PLAYER'
  const [gameMode, setGameMode] = useState('CLASSIC'); // 'CLASSIC', 'HOT_POTATO', 'GRAND_PRIX'
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Host State
  const [roomPin, setRoomPin] = useState('');
  const [hostSettings, setHostSettings] = useState({
    gameMode: 'CLASSIC',
    timeLimit: 20,
    questionCount: 10,
    domain: 'all',
    blunderPenalty: true,
    targetDistance: 100
  });
  const [players, setPlayers] = useState([]);
  const [hostGameState, setHostGameState] = useState('LOBBY'); // LOBBY, QUESTION, REVEAL, LEADERBOARD, PODIUM
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [timerLeft, setTimerLeft] = useState(20);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [roundResults, setRoundResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [podiumData, setPodiumData] = useState([]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Player State
  const [playerPinInput, setPlayerPinInput] = useState('');
  const [playerNickname, setPlayerNickname] = useState('');
  const [userPasscode, setUserPasscode] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('🐱');
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerState, setPlayerState] = useState('JOIN_FORM'); // JOIN_FORM, LOBBY, QUESTION, SUBMITTED, REVEAL, PODIUM
  const [playerChoice, setPlayerChoice] = useState(null);
  const [playerRoundFeedback, setPlayerRoundFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAutoFilledPin, setIsAutoFilledPin] = useState(false);

  // Screen reader announcer
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Load saved player credentials from localStorage (Option B)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11yarcade_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nickname) setPlayerNickname(parsed.nickname);
        if (parsed.avatar) setPlayerAvatar(parsed.avatar);
        if (parsed.passcode) setUserPasscode(parsed.passcode);
      }
    } catch (err) {
      console.error('Error reading localStorage user profile:', err);
    }
  }, []);

  // Check URL query parameters for ?pin=ABCD to auto-route to Player Join with PIN pre-filled
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pinParam = params.get('pin');
      if (pinParam && pinParam.trim()) {
        const cleanPin = pinParam.trim().toUpperCase();
        setPlayerPinInput(cleanPin);
        setRole('PLAYER');
        setIsAutoFilledPin(true);
        setLiveAnnouncement(`Room PIN ${cleanPin} loaded from link. Enter your nickname to join!`);
      }
    } catch (err) {
      console.error('Error reading URL params:', err);
    }
  }, []);

  // Generate QR code data URL whenever roomPin is updated in Host mode
  useEffect(() => {
    if (roomPin) {
      const joinUrl = `${window.location.origin}/?pin=${roomPin}`;
      QRCode.toDataURL(joinUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error('Failed to generate QR Code:', err);
        });
    } else {
      setQrDataUrl('');
    }
  }, [roomPin]);

  // Copy sharable invite link to clipboard
  const handleCopyInviteLink = async () => {
    if (!roomPin) return;
    const joinUrl = `${window.location.origin}/?pin=${roomPin}`;
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      soundManager.playClick();
      setLiveAnnouncement('Invite link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy invite link:', err);
    }
  };

  // Initialize Socket.io
  useEffect(() => {
    // In dev, Vite proxies /socket.io to http://localhost:3001
    const newSocket = io(getSocketUrl(), {
      reconnectionAttempts: 5,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Connected to game server:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from game server');
      setIsConnected(false);
    });

    // Host & Shared Events
    newSocket.on('player-list-update', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      if (updatedPlayers.length > 0) {
        soundManager.playClick();
      }
    });

    newSocket.on('question-started', (data) => {
      setCurrentQuestionData(data);
      setTimerLeft(data.timeLimit);
      setAnsweredCount(0);
      setRoundResults(null);
      setPlayerChoice(null);
      setPlayerRoundFeedback(null);

      soundManager.playTick(1);
      setLiveAnnouncement(`New question: ${data.question.question}`);

      setHostGameState('QUESTION');
      setPlayerState('QUESTION');
    });

    newSocket.on('timer-tick', ({ timeLeft }) => {
      setTimerLeft(timeLeft);
      if (timeLeft <= 5 && timeLeft > 0) {
        soundManager.playTick(2); // urgent tick
        if (timeLeft === 5) {
          setLiveAnnouncement('5 seconds remaining!');
        }
      }
    });

    newSocket.on('answer-submitted-count', ({ answeredCount }) => {
      setAnsweredCount(answeredCount);
    });

    newSocket.on('round-revealed', (results) => {
      setRoundResults(results);
      setLeaderboard(results.leaderboard);
      setHostGameState('REVEAL');
      setPlayerState('REVEAL');

      // Check player outcome
      if (newSocket.id) {
        const myResult = results.leaderboard.find(p => p.id === newSocket.id);
        if (myResult) {
          setPlayerRoundFeedback(myResult);
          if (myResult.roundCorrect) {
            soundManager.playCorrect();
            setLiveAnnouncement(`Correct! You earned ${myResult.roundPoints} points. Total: ${myResult.score}.`);
          } else {
            soundManager.playIncorrect();
            setLiveAnnouncement(`Incorrect. The correct answer was ${results.correctChoiceId}. Total: ${myResult.score}.`);
          }
        }
      }
    });

    newSocket.on('show-leaderboard', ({ leaderboard }) => {
      setLeaderboard(leaderboard);
      setHostGameState('LEADERBOARD');
    });

    newSocket.on('game-finished', ({ podium, allPlayers }) => {
      setPodiumData(podium);
      setLeaderboard(allPlayers);
      setHostGameState('PODIUM');
      setPlayerState('PODIUM');

      soundManager.playFanfare();

      // Trigger Confetti unless reduced motion is active
      const isReducedMotion = document.body.classList.contains('reduced-motion') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isReducedMotion) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    });

    newSocket.on('host-disconnected', () => {
      alert('The Host has ended the game.');
      resetToModeSelection();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Keyboard navigation for player answers (1, 2, 3, 4)
  useEffect(() => {
    if (role !== 'PLAYER' || playerState !== 'QUESTION' || !currentQuestionData) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toUpperCase();
      let choiceId = null;
      if (key === '1' || key === 'A') choiceId = 'A';
      if (key === '2' || key === 'B') choiceId = 'B';
      if (key === '3' || key === 'C') choiceId = 'C';
      if (key === '4' || key === 'D') choiceId = 'D';

      if (choiceId) {
        submitPlayerChoice(choiceId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role, playerState, currentQuestionData]);

  // Host Action: Create Room
  const handleHostCreateRoom = () => {
    if (!socket) return;
    setErrorMessage('');
    socket.emit('create-room', hostSettings, (res) => {
      if (res && res.success) {
        setRoomPin(res.pin);
        setGameMode(res.gameMode || hostSettings.gameMode || 'CLASSIC');
        if (res.players) {
          setPlayers(res.players);
        }
        setRole('HOST');
        setHostGameState('LOBBY');
        soundManager.playClick();
      } else {
        setErrorMessage('Failed to create room. Is the server running?');
      }
    });
  };

  // Host Action: Start Game
  const handleHostStartGame = () => {
    if (!socket) return;
    soundManager.playClick();
    if (gameMode !== 'CLASSIC') {
      setHostGameState('IN_GAME');
    }
    socket.emit('start-game');
  };

  // Host Action: Next Stage
  const handleHostNextStage = () => {
    if (!socket) return;
    soundManager.playClick();
    socket.emit('next-stage');
  };

  // Player Action: Join Room (Option B: Nickname + 4-Digit Passcode)
  const handlePlayerJoin = (e) => {
    e.preventDefault();
    if (!socket) return;
    setErrorMessage('');

    if (!playerPinInput.trim()) {
      setErrorMessage('Please enter a 4-letter Room PIN.');
      return;
    }
    if (!playerNickname.trim()) {
      setErrorMessage('Please enter your nickname.');
      return;
    }
    const cleanPasscode = String(userPasscode || '').trim();
    if (!/^\d{4}$/.test(cleanPasscode)) {
      setErrorMessage('Please enter a 4-digit secret passcode (e.g. 1234) to protect your scores!');
      return;
    }

    socket.emit('join-room', {
      pin: playerPinInput.trim().toUpperCase(),
      nickname: playerNickname.trim(),
      avatar: playerAvatar,
      userPin: cleanPasscode
    }, (res) => {
      if (res && res.success) {
        // Cache user credentials locally for zero-friction future sessions
        try {
          localStorage.setItem('a11yarcade_user', JSON.stringify({
            nickname: playerNickname.trim(),
            avatar: playerAvatar,
            passcode: cleanPasscode
          }));
        } catch (err) {
          console.error('Failed to save user credentials locally:', err);
        }

        setRole('PLAYER');
        setPlayerInfo(res.player);
        setGameMode(res.gameMode || 'CLASSIC');
        setPlayerState('LOBBY');
        soundManager.playClick();
      } else {
        setErrorMessage(res?.error || 'Failed to join room.');
      }
    });
  };

  // Player Action: Submit Answer Choice
  const submitPlayerChoice = (choiceId) => {
    if (!socket || playerState !== 'QUESTION') return;
    soundManager.playClick();
    setPlayerChoice(choiceId);
    setPlayerState('SUBMITTED');

    // Haptic feedback on mobile if supported
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    socket.emit('submit-answer', { choiceId }, (res) => {
      if (!res?.success) {
        console.error('Submission failed:', res?.error);
      }
    });
  };

  const resetToModeSelection = () => {
    setRole(null);
    setHostGameState('LOBBY');
    setPlayerState('JOIN_FORM');
    setRoomPin('');
    setPlayers([]);
    setCurrentQuestionData(null);
    setRoundResults(null);
    setLeaderboard([]);
  };

  // ==========================================
  // VIEW 1: Role Selection (Host or Player)
  // ==========================================
  if (!role) {
    return (
      <div className="card" style={{ maxWidth: '680px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          👥 Live Meeting Multiplayer
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Play live with your coworkers during your Teams, Zoom, or Google Meet call!
        </p>

        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Host Card */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🖥️</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Host a Game</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Screen share this view on your Teams/Zoom/Meet call. Choose your game mode:
              </p>

              {/* Game Mode Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'CLASSIC' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'CLASSIC' ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'CLASSIC' ? '#38bdf8' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'CLASSIC' ? '#38bdf8' : '#ffffff' }}>Classic Kahoot Clash</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Fast-paced speed & accuracy review</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'HOT_POTATO' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'HOT_POTATO' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'HOT_POTATO' ? '#f59e0b' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🥔</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'HOT_POTATO' ? '#f59e0b' : '#ffffff' }}>The Hot Potato Syndicate</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Take or Pass with Social Dividend</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'GRAND_PRIX' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'GRAND_PRIX' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'GRAND_PRIX' ? '#ef4444' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🏎️</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'GRAND_PRIX' ? '#ef4444' : '#ffffff' }}>Grand Prix: Apex Gambler</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gear shifts, Pit stops & Drafting</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'HIGH_ROLLER' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'HIGH_ROLLER' ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'HIGH_ROLLER' ? '#a855f7' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎰</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'HIGH_ROLLER' ? '#a855f7' : '#ffffff' }}>The High-Roller Gauntlet</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Blind wagers & Underdog multipliers</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'FLAW_FINDER' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'FLAW_FINDER' ? 'rgba(14, 165, 233, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'FLAW_FINDER' ? '#0ea5e9' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'FLAW_FINDER' ? '#0ea5e9' : '#ffffff' }}>Flaw Finder: Heatmap Sniping</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Legal policy loophole auditing & heatmaps</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'SABOTEUR' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'SABOTEUR' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'SABOTEUR' ? '#ef4444' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🕵️</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'SABOTEUR' ? '#ef4444' : '#ffffff' }}>Saboteur in the Server Room</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Resource heist, audit pings & emergency standups</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setHostSettings({ ...hostSettings, gameMode: 'BOUNDARY_BRAWL' })}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: hostSettings.gameMode === 'BOUNDARY_BRAWL' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
                    border: `2px solid ${hostSettings.gameMode === 'BOUNDARY_BRAWL' ? '#f59e0b' : 'var(--border-color)'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>⚖️</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: hostSettings.gameMode === 'BOUNDARY_BRAWL' ? '#f59e0b' : '#ffffff' }}>The Boundary Line Brawl</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>2×2 matrix territory control, slap challenges & debate</div>
                  </div>
                </button>
              </div>

              {/* Host Play Along Option */}
              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', textAlign: 'left' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                  <input
                    type="checkbox"
                    checked={hostSettings.hostParticipates || false}
                    onChange={(e) => setHostSettings({ ...hostSettings, hostParticipates: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>🎮 Play along as Host on this screen</span>
                </label>
                {hostSettings.hostParticipates && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Your Nickname (e.g. Captain Host)"
                      value={hostSettings.hostNickname || ''}
                      onChange={(e) => setHostSettings({ ...hostSettings, hostNickname: e.target.value })}
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={handleHostCreateRoom}
            >
              <Play size={18} />
              <span>Create Room ({hostSettings.gameMode === 'HOT_POTATO' ? 'Hot Potato' : hostSettings.gameMode === 'GRAND_PRIX' ? 'Grand Prix' : 'Classic'})</span>
            </button>
          </div>

          {/* Join Card */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📱</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Join as Player</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Participate on your phone or in a separate tab using your meeting host's 4-letter PIN code. Automatically connects to the hosted game mode!
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setRole('PLAYER')}
            >
              <Users size={18} />
              <span>Join with PIN</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: HOST SCREENS
  // ==========================================
  if (role === 'HOST') {
    // 2A: Host Lobby Screen
    if (hostGameState === 'LOBBY') {
      return (
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: gameMode === 'HOT_POTATO' ? 'rgba(245, 158, 11, 0.2)' : gameMode === 'GRAND_PRIX' ? 'rgba(239, 68, 68, 0.2)' : gameMode === 'BOUNDARY_BRAWL' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
              border: `1px solid ${gameMode === 'HOT_POTATO' ? '#f59e0b' : gameMode === 'GRAND_PRIX' ? '#ef4444' : gameMode === 'BOUNDARY_BRAWL' ? '#f59e0b' : '#38bdf8'}`,
              color: gameMode === 'HOT_POTATO' ? '#fbbf24' : gameMode === 'GRAND_PRIX' ? '#fca5a5' : gameMode === 'BOUNDARY_BRAWL' ? '#f59e0b' : '#38bdf8',
              padding: '0.4rem 1.25rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.95rem'
            }}>
              <span>
                {gameMode === 'HOT_POTATO' ? '🥔 Mode: The Hot Potato Syndicate' :
                 gameMode === 'GRAND_PRIX' ? '🏎️ Mode: Grand Prix: Apex Gambler' :
                 gameMode === 'HIGH_ROLLER' ? '🎰 Mode: The High-Roller Gauntlet' :
                 gameMode === 'FLAW_FINDER' ? '🎯 Mode: Flaw Finder: Heatmap Sniping' :
                 gameMode === 'SABOTEUR' ? '🕵️ Mode: Saboteur in the Server Room' :
                 gameMode === 'BOUNDARY_BRAWL' ? '⚖️ Mode: The Boundary Line Brawl' :
                 '🎯 Mode: Classic Kahoot Clash'}
              </span>
            </span>
          </div>

          {/* Joining Station: PIN, Sharable Link, and QR Code */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            textAlign: 'center'
          }}>
            {/* Left: PIN & Sharable Link */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '2px solid #38bdf8',
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-md)',
                width: '100%',
                maxWidth: '280px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Room PIN
                </div>
                <div style={{ fontSize: '3.6rem', fontWeight: 900, letterSpacing: '0.15em', color: '#ffffff', lineHeight: 1.1 }}>
                  {roomPin}
                </div>
              </div>

              {/* Sharable Link Button */}
              <div style={{ width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={copiedLink ? "btn-secondary" : "btn-primary"}
                  onClick={handleCopyInviteLink}
                  aria-live="polite"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: copiedLink ? '#10b981' : undefined,
                    borderColor: copiedLink ? '#10b981' : undefined,
                    color: '#ffffff'
                  }}
                >
                  {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copiedLink ? '✓ Link Copied to Clipboard!' : 'Copy Invite Link'}</span>
                </button>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0.35rem 0.6rem',
                    background: 'var(--bg-surface)',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    userSelect: 'all'
                  }}
                  title={`${window.location.origin}/?pin=${roomPin}`}
                >
                  🔗 {window.location.origin}/?pin={roomPin}
                </div>
              </div>
            </div>

            {/* Right: QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {qrDataUrl ? (
                <div style={{
                  background: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  display: 'inline-block'
                }}>
                  <img
                    src={qrDataUrl}
                    alt={`Scan QR code to join room ${roomPin}`}
                    style={{ width: '150px', height: '150px', display: 'block' }}
                  />
                </div>
              ) : (
                <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <QrCode size={48} color="#94a3b8" />
                </div>
              )}
              <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <QrCode size={15} color="#38bdf8" />
                <span>Scan with phone camera to join</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Coworkers can scan the QR code, click your shared link, or enter PIN: <strong style={{ color: '#ffffff' }}>{roomPin}</strong>
          </p>

          {/* Settings Bar */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Clock size={16} color="#38bdf8" />
              <span>Timer:</span>
              <select
                className="input-field"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', width: 'auto' }}
                value={hostSettings.timeLimit}
                onChange={(e) => setHostSettings({ ...hostSettings, timeLimit: parseInt(e.target.value, 10) })}
              >
                <option value="15">15 Seconds (Rapid)</option>
                <option value="20">20 Seconds (Standard)</option>
                <option value="30">30 Seconds (Thoughtful)</option>
                <option value="0">Untimed / Manual Advance (Max A11y)</option>
              </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <span>Domain:</span>
              <select
                className="input-field"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem', width: 'auto' }}
                value={hostSettings.domain}
                onChange={(e) => setHostSettings({ ...hostSettings, domain: e.target.value })}
              >
                <option value="all">All Domains (Mixed)</option>
                <option value="1">Domain 1 (Disabilities & AT)</option>
                <option value="2">Domain 2 (Universal Design & WCAG)</option>
                <option value="3">Domain 3 (Standards & Laws)</option>
              </select>
            </label>
          </div>

          {/* Connected Players List */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#38bdf8" />
              <span>Joined Coworkers ({players.length}):</span>
            </h3>

            {players.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem' }}>
                Waiting for players to join...
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                {players.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.nickname}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
            onClick={handleHostStartGame}
            disabled={players.length === 0}
          >
            <Play size={22} />
            <span>Start Game</span>
          </button>
        </div>
      );
    }

    // Route to specialized Game Mode views
    if (gameMode === 'HOT_POTATO') {
      return (
        <HotPotatoMode
          socket={socket}
          role="HOST"
          roomPin={roomPin}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'GRAND_PRIX') {
      return (
        <GrandPrixMode
          socket={socket}
          role="HOST"
          roomPin={roomPin}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'HIGH_ROLLER') {
      return (
        <HighRollerMode
          socket={socket}
          role="HOST"
          roomPin={roomPin}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'FLAW_FINDER') {
      return (
        <FlawFinderMode
          socket={socket}
          role="HOST"
          roomPin={roomPin}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'SABOTEUR') {
      return (
        <SaboteurMode
          socket={socket}
          role="HOST"
          roomPin={roomPin}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'BOUNDARY_BRAWL') {
      return (
        <BoundaryBrawlMode
          socket={socket}
          role="HOST"
          roomPin={roomPin}
          onLeave={resetToModeSelection}
        />
      );
    }

    // 2B: Host Question Screen (Classic Mode)
    if (hostGameState === 'QUESTION' && currentQuestionData) {
      const q = currentQuestionData.question;
      const progressPercent = hostSettings.timeLimit > 0
        ? Math.max(0, (timerLeft / hostSettings.timeLimit) * 100)
        : 100;

      return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div className="card">
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ background: '#334155', color: '#38bdf8', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem' }}>
                Question {currentQuestionData.questionIndex + 1} of {currentQuestionData.totalQuestions}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {answeredCount} / {currentQuestionData.totalPlayers} Answered
                </span>

                {hostSettings.timeLimit > 0 ? (
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: timerLeft <= 5 ? '#ef4444' : '#38bdf8',
                    minWidth: '40px',
                    textAlign: 'right'
                  }}>
                    {timerLeft}s
                  </span>
                ) : (
                  <span style={{ fontSize: '0.85rem', background: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    Untimed
                  </span>
                )}
              </div>
            </div>

            {/* Timer visual bar */}
            {hostSettings.timeLimit > 0 && (
              <div className="timer-container" aria-hidden="true">
                <div className="timer-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            )}

            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {q.domainName}
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.4, margin: '1rem 0 1.5rem 0', color: '#ffffff' }}>
              {q.question}
            </h2>

            {/* 4 Answers Grid */}
            <div className="answers-grid">
              {q.choices.map((c, idx) => (
                <div key={c.id} className={`answer-btn ${c.shape}`} style={{ cursor: 'default' }}>
                  <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                  <span style={{ flex: 1 }}>{c.text}</span>
                  <span className="shape-badge-key">Key: {idx + 1}</span>
                </div>
              ))}
            </div>

            {hostSettings.timeLimit === 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-primary" onClick={handleHostNextStage}>
                  <span>Reveal Answers</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2C: Host Reveal Screen
    if (hostGameState === 'REVEAL' && roundResults) {
      const q = roundResults.question;
      const totalAnswers = Object.values(roundResults.distribution).reduce((a, b) => a + b, 0);

      return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {q.question}
            </h2>

            {/* Answer Grid with Correct Highlight & Votes Distribution */}
            <div className="answers-grid">
              {q.choices.map((c) => {
                const isCorrect = c.isCorrect;
                const votes = roundResults.distribution[c.id] || 0;
                const votePercent = totalAnswers > 0 ? Math.round((votes / totalAnswers) * 100) : 0;

                return (
                  <div
                    key={c.id}
                    className={`answer-btn ${c.shape} ${isCorrect ? 'is-correct-highlight' : 'is-dimmed'}`}
                    style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="shape-badge">{SHAPE_ICONS[c.shape]}</span>
                      <span style={{ flex: 1 }}>{c.text}</span>
                      {isCorrect && <CheckCircle2 size={24} color="#ffffff" />}
                    </div>

                    {/* Answer distribution bar */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '4px', height: '16px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ background: '#ffffff', height: '100%', width: `${votePercent}%`, opacity: 0.8 }} />
                      <span style={{ position: 'absolute', right: '6px', top: '0', fontSize: '0.7rem', color: '#ffffff', fontWeight: 700 }}>
                        {votes} votes ({votePercent}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Box */}
            <div className="explanation-box" style={{ marginTop: '1.5rem' }}>
              <strong>CPACC Explanation:</strong> {q.explanation}
              <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                Ref: {q.cpaccRef}
              </div>
            </div>

            {q.funNote && (
              <div className="fun-note">
                <Sparkles size={18} />
                <span>{q.funNote}</span>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-primary" onClick={handleHostNextStage}>
                <span>Show Leaderboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 2D: Host Leaderboard Screen
    if (hostGameState === 'LEADERBOARD') {
      return (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Award size={28} color="#eab308" />
            <span>Leaderboard Standings</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {leaderboard.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface-elevated)',
                  border: idx === 0 ? '2px solid #eab308' : '1px solid var(--border-color)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, width: '28px' }}>
                    #{player.rank}
                  </span>
                  <span style={{ fontSize: '1.6rem' }}>{player.avatar}</span>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{player.nickname}</div>
                    {player.streak >= 2 && (
                      <div style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Flame size={14} />
                        <span>{player.streak} streak!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                  {player.score.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="btn-primary" style={{ padding: '0.9rem 2.5rem' }} onClick={handleHostNextStage}>
              <span>Next Question</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      );
    }

    // 2E: Host Final Podium Screen
    if (hostGameState === 'PODIUM') {
      const gold = podiumData[0];
      const silver = podiumData[1];
      const bronze = podiumData[2];

      return (
        <div className="card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🎉 The CPACC Champions Podium! 🎉
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Congratulations to our accessibility champions!
          </p>

          {/* Podium Graphic */}
          <div className="podium-stage">
            {/* 2nd place (Silver) */}
            <div className="podium-column">
              {silver && (
                <>
                  <div style={{ fontSize: '2.5rem' }}>{silver.avatar}</div>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{silver.nickname}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {silver.score} pts
                  </div>
                  <div className="podium-box silver">2nd</div>
                </>
              )}
            </div>

            {/* 1st place (Gold) */}
            <div className="podium-column">
              {gold && (
                <>
                  <div style={{ fontSize: '3rem' }}>👑 {gold.avatar}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{gold.nickname}</div>
                  <div style={{ fontSize: '0.9rem', color: '#fef08a', marginBottom: '0.5rem' }}>
                    {gold.score} pts
                  </div>
                  <div className="podium-box gold">1st</div>
                </>
              )}
            </div>

            {/* 3rd place (Bronze) */}
            <div className="podium-column">
              {bronze && (
                <>
                  <div style={{ fontSize: '2.5rem' }}>{bronze.avatar}</div>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{bronze.nickname}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {bronze.score} pts
                  </div>
                  <div className="podium-box bronze">3rd</div>
                </>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button type="button" className="btn-secondary" onClick={resetToModeSelection}>
              <RotateCcw size={18} />
              <span>Host Another Game</span>
            </button>
          </div>
        </div>
      );
    }
  }

  // ==========================================
  // VIEW 3: PLAYER SCREENS (Mobile & Tab)
  // ==========================================
  if (role === 'PLAYER') {
    // 3A: Player Join Form
    if (playerState === 'JOIN_FORM') {
      return (
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
            📱 Join Live Game
          </h2>
          {isAutoFilledPin && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              color: '#bae6fd',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <Sparkles size={22} color="#38bdf8" style={{ flexShrink: 0 }} />
              <div>
                <strong>Joined via Invite Link!</strong> PIN <strong style={{ color: '#ffffff' }}>{playerPinInput}</strong> has been filled automatically. Choose your nickname & avatar to jump in.
              </div>
            </div>
          )}

          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handlePlayerJoin}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="pin-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem' }}>
                Game PIN:
              </label>
              <input
                id="pin-input"
                type="text"
                maxLength={4}
                className="input-field"
                style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800 }}
                placeholder="A11Y"
                value={playerPinInput}
                onChange={(e) => setPlayerPinInput(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="nick-input" style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem' }}>
                Your Nickname:
              </label>
              <input
                id="nick-input"
                type="text"
                maxLength={18}
                className="input-field"
                placeholder="e.g. Captain Contrast"
                value={playerNickname}
                onChange={(e) => setPlayerNickname(e.target.value)}
                required
              />
            </div>

            {/* Option B: 4-Digit Passcode */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="passcode-input" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <Lock size={15} color="#38bdf8" />
                <span>4-Digit Secret Passcode:</span>
              </label>
              <input
                id="passcode-input"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                className="input-field"
                style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.3em', fontWeight: 800 }}
                placeholder="1234"
                value={userPasscode}
                onChange={(e) => setUserPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Protects your weekly score & study history! Creates your PIN if new, or unlocks your rank if returning.
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem' }}>
                Pick an Avatar:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setPlayerAvatar(av);
                    }}
                    style={{
                      fontSize: '1.5rem',
                      padding: '0.4rem',
                      borderRadius: '8px',
                      border: playerAvatar === av ? '2px solid #38bdf8' : '1px solid transparent',
                      background: playerAvatar === av ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              <span>Enter Lobby</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      );
    }

    // Route to specialized Game Mode views for Player
    if (gameMode === 'HOT_POTATO') {
      return (
        <HotPotatoMode
          socket={socket}
          role="PLAYER"
          roomPin={playerPinInput}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'GRAND_PRIX') {
      return (
        <GrandPrixMode
          socket={socket}
          role="PLAYER"
          roomPin={playerPinInput}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'HIGH_ROLLER') {
      return (
        <HighRollerMode
          socket={socket}
          role="PLAYER"
          roomPin={playerPinInput}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'FLAW_FINDER') {
      return (
        <FlawFinderMode
          socket={socket}
          role="PLAYER"
          roomPin={playerPinInput}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'SABOTEUR') {
      return (
        <SaboteurMode
          socket={socket}
          role="PLAYER"
          roomPin={playerPinInput}
          onLeave={resetToModeSelection}
        />
      );
    }

    if (gameMode === 'BOUNDARY_BRAWL') {
      return (
        <BoundaryBrawlMode
          socket={socket}
          role="PLAYER"
          roomPin={playerPinInput}
          onLeave={resetToModeSelection}
        />
      );
    }

    // 3B: Player in Lobby (Classic Mode)
    if (playerState === 'LOBBY') {
      return (
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{playerAvatar}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            You're in, {playerNickname}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Look at the meeting host screen. The game will start shortly!
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#334155', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.9rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span>Connected to PIN: {playerPinInput}</span>
          </div>
        </div>
      );
    }

    // 3C: Player Answering Buttons (Kahoot Touch Pad)
    if (playerState === 'QUESTION') {
      return (
        <div style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}>
          <div className="sr-only" role="status" aria-live="polite">
            {liveAnnouncement}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <span>Question in progress...</span>
            {timerLeft > 0 && <span style={{ fontWeight: 800, color: '#38bdf8' }}>{timerLeft}s remaining</span>}
          </div>

          {/* 4 Large Touch Buttons */}
          <div className="answers-grid">
            <button
              type="button"
              className="answer-btn triangle"
              onClick={() => submitPlayerChoice('A')}
              aria-label="Option A: Red Triangle"
              style={{ minHeight: '120px', fontSize: '1.3rem' }}
            >
              <span className="shape-badge" style={{ fontSize: '2rem', width: '56px', height: '56px' }}>▲</span>
              <span style={{ fontWeight: 800 }}>Option A</span>
              <span className="shape-badge-key">1</span>
            </button>

            <button
              type="button"
              className="answer-btn diamond"
              onClick={() => submitPlayerChoice('B')}
              aria-label="Option B: Blue Diamond"
              style={{ minHeight: '120px', fontSize: '1.3rem' }}
            >
              <span className="shape-badge" style={{ fontSize: '2rem', width: '56px', height: '56px' }}>◆</span>
              <span style={{ fontWeight: 800 }}>Option B</span>
              <span className="shape-badge-key">2</span>
            </button>

            <button
              type="button"
              className="answer-btn circle"
              onClick={() => submitPlayerChoice('C')}
              aria-label="Option C: Amber Circle"
              style={{ minHeight: '120px', fontSize: '1.3rem' }}
            >
              <span className="shape-badge" style={{ fontSize: '2rem', width: '56px', height: '56px' }}>●</span>
              <span style={{ fontWeight: 800 }}>Option C</span>
              <span className="shape-badge-key">3</span>
            </button>

            <button
              type="button"
              className="answer-btn square"
              onClick={() => submitPlayerChoice('D')}
              aria-label="Option D: Green Square"
              style={{ minHeight: '120px', fontSize: '1.3rem' }}
            >
              <span className="shape-badge" style={{ fontSize: '2rem', width: '56px', height: '56px' }}>■</span>
              <span style={{ fontWeight: 800 }}>Option D</span>
              <span className="shape-badge-key">4</span>
            </button>
          </div>
        </div>
      );
    }

    // 3D: Player Submitted Screen
    if (playerState === 'SUBMITTED') {
      return (
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Answer Locked In!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Waiting for other players to finish or time to expire...
          </p>
        </div>
      );
    }

    // 3E: Player Round Result
    if (playerState === 'REVEAL' && playerRoundFeedback) {
      const isCorrect = playerRoundFeedback.roundCorrect;

      return (
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
            {isCorrect ? '🎉' : '🙃'}
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: isCorrect ? '#22c55e' : '#f87171', marginBottom: '0.5rem' }}>
            {isCorrect ? 'Correct!' : 'Not Quite!'}
          </h2>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 0' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
              +{playerRoundFeedback.roundPoints} Points
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Total Score: {playerRoundFeedback.score}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>
              Rank #{playerRoundFeedback.rank}
            </div>
          </div>

          {playerRoundFeedback.streak >= 2 && (
            <div className="fun-note" style={{ justifyContent: 'center' }}>
              <Flame size={18} />
              <span>{playerRoundFeedback.streak} Streak! You're on fire!</span>
            </div>
          )}

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1.5rem' }}>
            Watch the host screen for explanations and the next question!
          </p>
        </div>
      );
    }

    // 3F: Player Podium
    if (playerState === 'PODIUM') {
      const myStanding = leaderboard.find(p => p.id === socket?.id);

      return (
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🏆</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Game Over!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You finished in:
          </p>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#eab308', marginBottom: '0.5rem' }}>
            #{myStanding?.rank || '-'} Place
          </div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
            Final Score: {myStanding?.score || 0} pts
          </div>

          <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={resetToModeSelection}>
            Exit to Menu
          </button>
        </div>
      );
    }
  }

  return null;
}
