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
  Lock,
  Settings
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { getSocketUrl } from '../utils/api';
import HotPotatoMode from './HotPotatoMode';
import GrandPrixMode from './GrandPrixMode';
import HighRollerMode from './HighRollerMode';
import FlawFinderMode from './FlawFinderMode';
import SaboteurMode from './SaboteurMode';
import BoundaryBrawlMode from './BoundaryBrawlMode';
import BossRaidMode from './BossRaidMode';
import CoachFeedbackCard from './CoachFeedbackCard';
import TauntNotificationToast from './TauntNotificationToast';
import TauntTriggerButton from './TauntTriggerButton';
import CelebrationBroadcastOverlay from './CelebrationBroadcastOverlay';
import WinnerCelebrationSoundboard from './WinnerCelebrationSoundboard';
import {
  CERTIFICATION_DOMAINS,
  CERTIFICATION_TRACKS,
  CERTIFICATION_TAXONOMY,
  getAllSections,
  getAllSubjects,
  getSectionAuditReport,
  getFilteredQuestions
} from '../utils/questionBanks';

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

export const ARCADE_CABINETS = [
  {
    id: 'HOT_POTATO',
    num: '01',
    title: 'The Hot Potato Syndicate',
    subtitle: 'DELEGATE ROULETTE & SOCIAL DIVIDENDS',
    domain: 'Universal Design & Models',
    desc: 'Pass rapid accessibility bug tickets before the audit timer blows up! Test knowledge of models of disability and Universal Design principles.',
    icon: '🥔',
    tag: '[DELEGATE ROULETTE // AI BOTS]',
    color: '#f59e0b'
  },
  {
    id: 'GRAND_PRIX',
    num: '02',
    title: 'Grand Prix: Apex Gambler',
    subtitle: '3-GEAR RISK/REWARD SPEEDWAY',
    domain: 'WCAG 2.1 / 2.2 SCs',
    desc: 'Wager points on tricky WCAG 2.1 & 2.2 Success Criteria distinctions. Shift into 3rd gear for 3x combo bonuses on AA vs AAA requirements.',
    icon: '🏎️',
    tag: '[SPEEDWAY]',
    color: '#10b981'
  },
  {
    id: 'HIGH_ROLLER',
    num: '03',
    title: 'The High-Roller Gauntlet',
    subtitle: 'CHIP WAGERING & UNDERDOG MULTIPLIERS',
    domain: 'Assistive Tech & Hardware',
    desc: 'Wager credits on screen reader nuances (NVDA, JAWS, VoiceOver), Braille displays, and speech recognition hardware workflows.',
    icon: '🎰',
    tag: '[HIGH STAKES]',
    color: '#facc15'
  },
  {
    id: 'FLAW_FINDER',
    num: '04',
    title: 'Flaw Finder: Heatmap Sniping',
    subtitle: 'LEGAL POLICY LOOPHOLE SNIPING',
    domain: 'Laws, Standards & Treaties',
    desc: 'Analyze international accessibility treaties: Section 508, ADA Title II/III, European EN 301 549, and the Marrakesh Treaty.',
    icon: '🎯',
    tag: '[LEGAL MATRIX]',
    color: '#ef4444'
  },
  {
    id: 'SABOTEUR',
    num: '05',
    title: 'Saboteur in the Server Room',
    subtitle: 'AP HEIST & EMERGENCY STANDUP',
    domain: 'ARIA Architecture',
    desc: 'Fix broken ARIA roles injected by an accessibility imposter! Debug incorrect aria-live, invalid aria-owns, and redundant button roles.',
    icon: '🕵️',
    tag: '[ARIA HEIST]',
    color: '#c084fc'
  },
  {
    id: 'BOUNDARY_BRAWL',
    num: '06',
    title: 'The Boundary Line Brawl',
    subtitle: '2X2 MATRIX SPATIAL TERRITORY DEBATE',
    domain: 'Accommodations & Barriers',
    desc: 'Sort physical and digital barriers across Cognitive, Motor, Auditory, and Visual accommodations onto the spatial quadrant grid.',
    icon: '⚖️',
    tag: '[TERRITORY DEBATE]',
    color: '#f59e0b'
  },
  {
    id: 'CLASSIC',
    num: '07',
    title: 'Classic Kahoot Clash',
    subtitle: 'RAPID-FIRE SPEED & ACCURACY',
    domain: 'All IAAP Domains (CPACC · WAS · ADS)',
    desc: 'Fast-paced 4-choice questions with streak bonuses, buzzer timers, and instant retro leaderboard tracking.',
    icon: '⚡',
    tag: '[RAPID TRIVIA]',
    color: '#38bdf8'
  },
  {
    id: 'BOSS_RAID',
    num: '08',
    title: 'The Enterprise Boss Raid',
    subtitle: 'CO-OP TECH TREE & PASSIVE BUFFS',
    domain: 'All IAAP Domains (CPACC · WAS · ADS)',
    desc: 'Join forces to dismantle a multi-domain corporate compliance monolith! Draft tech-tree nodes across Procurement, Assistive Tech, and Organizational Culture to strip elemental shields and unlock the Capstone Strike.',
    icon: '🐉',
    tag: '[CO-OP RAID]',
    color: '#ec4899'
  }
];

export const CADET_SPECIALTIES = [
  '[✓] Screen Reader Spec',
  '[✓] Tab-Order Grandmaster',
  '[✓] Semantic HTML Sorceress',
  '[✓] Color Contrast Crusader',
  '[✓] ARIA Live Announcer',
  '[✓] Focus Ring Guardian',
  '[✓] Alt-Text Artisan',
  '[✓] Captions Connoisseur'
];

export default function LiveMode() {
  const [role, setRole] = useState(null); // null, 'HOST', 'PLAYER'
  const [gameMode, setGameMode] = useState('HOT_POTATO'); // 'HOT_POTATO', 'GRAND_PRIX', etc.
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Host State
  const [roomPin, setRoomPin] = useState('');
  const [roomSettings, setRoomSettings] = useState(null);
  const [hostSettings, setHostSettings] = useState({
    gameMode: 'HOT_POTATO',
    timeLimit: 20,
    questionCount: 10,
    domain: 'all',
    certTrack: 'all', // 'all', 'cpacc', 'was'
    filterType: 'domain', // 'domain', 'sections', 'subjects'
    selectedSections: [],
    selectedSubjects: [],
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
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStopHostingConfirm, setShowStopHostingConfirm] = useState(false);

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

  // Live Taunts & Winner Celebration Overlays
  const [activeTaunt, setActiveTaunt] = useState(null);
  const [activeCelebration, setActiveCelebration] = useState(null);

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
            soundManager.playCoachFeedback(true);
            setLiveAnnouncement(`Correct! You earned ${myResult.roundPoints} points. Total: ${myResult.score}.`);
          } else {
            soundManager.playCoachFeedback(false);
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

    newSocket.on('game-mode-changed', ({ gameMode: newMode }) => {
      setGameMode(newMode);
      setHostSettings((prev) => ({ ...prev, gameMode: newMode }));
      soundManager.playClick();
      setLiveAnnouncement(`Host switched arcade cartridge to ${newMode}`);
    });

    newSocket.on('room-settings-updated', ({ settings, gameMode: newMode, questionCount }) => {
      if (settings) {
        setRoomSettings(settings);
        setHostSettings((prev) => ({ ...prev, ...settings }));
        if (settings.timeLimit !== undefined) {
          setTimerLeft(settings.timeLimit);
        }
      }
      if (newMode) setGameMode(newMode);
      soundManager.playClick();
      setLiveAnnouncement(`Host updated match settings: ${questionCount || ''} questions, ${settings?.timeLimit ? settings.timeLimit + 's' : 'untimed'}.`);
    });

    newSocket.on('room-returned-to-lobby', ({ settings, gameMode: newMode, players: updatedPlayers }) => {
      setHostGameState('LOBBY');
      setPlayerState('LOBBY');
      setCurrentQuestionData(null);
      setRoundResults(null);
      if (settings) {
        setRoomSettings(settings);
        setHostSettings((prev) => ({ ...prev, ...settings }));
        setTimerLeft(settings.timeLimit || 20);
      }
      if (newMode) setGameMode(newMode);
      if (updatedPlayers) setPlayers(updatedPlayers);
      soundManager.playClick();
      setLiveAnnouncement('Match paused by host and squad returned to Lobby.');
    });

    newSocket.on('host-disconnected', () => {
      alert('The Host has ended the game.');
      resetToModeSelection();
    });

    // Room-wide taunts & winner celebration soundboard events
    newSocket.on('player-taunted', (data) => {
      setActiveTaunt(data);
      setLiveAnnouncement(`Taunt from ${data.nickname}: "${data.tauntText}"`);
    });

    newSocket.on('winner-celebration-fx', (data) => {
      setActiveCelebration(data);
      setLiveAnnouncement(`${data.nickname} fired ${data.soundName} celebration!`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Spacebar to start game when in Host Lobby
  useEffect(() => {
    if (role !== 'HOST' || hostGameState !== 'LOBBY' || players.length === 0) return;
    const handleSpacebar = (e) => {
      if (e.code === 'Space' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        handleHostStartGame();
      }
    };
    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, [role, hostGameState, players.length]);

  // Keyboard navigation for player answers (1, 2, 3, 4 or T, F)
  useEffect(() => {
    if (role !== 'PLAYER' || playerState !== 'QUESTION' || !currentQuestionData) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const key = e.key.toUpperCase();
      let choiceId = null;
      if (key === '1' || key === 'A' || key === 'T') choiceId = 'A';
      if (key === '2' || key === 'B' || key === 'F') choiceId = 'B';
      if (key === '3' || key === 'C') choiceId = 'C';
      if (key === '4' || key === 'D') choiceId = 'D';

      if (choiceId) {
        submitPlayerChoice(choiceId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role, playerState, currentQuestionData]);

  // Host Action: Select Arcade Cabinet Game Mode
  const handleSelectGameMode = (newMode) => {
    setGameMode(newMode);
    setHostSettings((prev) => ({ ...prev, gameMode: newMode }));
    soundManager.playClick();
    if (socket && roomPin) {
      socket.emit('change-game-mode', { gameMode: newMode });
    }
  };

  // Real-time calculation of available questions in pool
  const availableQuestions = React.useMemo(() => {
    if (hostSettings.filterType === 'sections' && (!hostSettings.selectedSections || hostSettings.selectedSections.length === 0)) {
      return [];
    }
    if (hostSettings.filterType === 'subjects' && (!hostSettings.selectedSubjects || hostSettings.selectedSubjects.length === 0)) {
      return [];
    }
    return getFilteredQuestions({
      certTrack: hostSettings.certTrack || 'all',
      domain: hostSettings.filterType === 'domain' ? hostSettings.domain : 'all',
      sections: hostSettings.filterType === 'sections' ? hostSettings.selectedSections : [],
      subjects: hostSettings.filterType === 'subjects' ? hostSettings.selectedSubjects : []
    });
  }, [hostSettings.certTrack, hostSettings.domain, hostSettings.filterType, hostSettings.selectedSections, hostSettings.selectedSubjects]);

  const allAvailableSections = React.useMemo(() => {
    return getAllSections(hostSettings.certTrack || 'all');
  }, [hostSettings.certTrack]);

  const allAvailableSubjects = React.useMemo(() => {
    return getAllSubjects(hostSettings.certTrack || 'all');
  }, [hostSettings.certTrack]);

  const handleToggleSection = (sectionId) => {
    soundManager.playClick();
    setHostSettings((prev) => {
      const current = prev.selectedSections || [];
      const updated = current.includes(sectionId)
        ? current.filter(id => id !== sectionId)
        : [...current, sectionId];
      return { ...prev, selectedSections: updated };
    });
  };

  const handleSelectAllSections = () => {
    soundManager.playClick();
    const allIds = [];
    allAvailableSections.forEach(c => {
      (c.domains || []).forEach(d => {
        (d.sections || []).forEach(s => allIds.push(s.id));
      });
    });
    setHostSettings(prev => ({ ...prev, selectedSections: allIds }));
  };

  const handleClearSections = () => {
    soundManager.playClick();
    setHostSettings(prev => ({ ...prev, selectedSections: [] }));
  };

  const handleToggleSubject = (subjectKey) => {
    soundManager.playClick();
    setHostSettings((prev) => {
      const current = prev.selectedSubjects || [];
      const updated = current.includes(subjectKey)
        ? current.filter(k => k !== subjectKey)
        : [...current, subjectKey];
      return { ...prev, selectedSubjects: updated };
    });
  };

  const handleSelectAllSubjects = () => {
    soundManager.playClick();
    setHostSettings(prev => ({ ...prev, selectedSubjects: allAvailableSubjects.map(s => s.key) }));
  };

  const handleClearSubjects = () => {
    soundManager.playClick();
    setHostSettings(prev => ({ ...prev, selectedSubjects: [] }));
  };

  // Host Action: Create Room
  const handleHostCreateRoom = () => {
    if (!socket) return;
    if (availableQuestions.length === 0) {
      soundManager.playError();
      setErrorMessage('⚠️ Zero questions found matching this filter. Please choose at least one section or subject.');
      return;
    }
    setErrorMessage('');
    const payload = {
      ...hostSettings,
      sections: hostSettings.filterType === 'sections' ? hostSettings.selectedSections : [],
      subjects: hostSettings.filterType === 'subjects' ? hostSettings.selectedSubjects : [],
      domain: hostSettings.filterType === 'domain' ? hostSettings.domain : 'all'
    };
    socket.emit('create-room', payload, (res) => {
      if (res && res.success) {
        setRoomPin(res.pin);
        setGameMode(res.gameMode || hostSettings.gameMode || 'CLASSIC');
        if (res.settings) {
          setRoomSettings(res.settings);
        }
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

  // Host Action: Update Match Settings live on server & broadcast
  const handleUpdateSettings = (updated) => {
    const next = { ...hostSettings, ...updated };
    setHostSettings(next);
    if (socket && role === 'HOST' && roomPin) {
      const payload = {
        ...next,
        sections: next.filterType === 'sections' ? (next.selectedSections || []) : [],
        subjects: next.filterType === 'subjects' ? (next.selectedSubjects || []) : [],
        domain: next.filterType === 'domain' ? next.domain : 'all'
      };
      socket.emit('update-room-settings', payload, (res) => {
        if (res && res.success) {
          if (res.settings) setRoomSettings(res.settings);
          soundManager.playClick();
          setLiveAnnouncement('Match settings updated and broadcast to all cadets.');
        }
      });
    }
  };

  // Host Action: Return Active Match to Lobby without disconnecting players
  const handleReturnToLobby = () => {
    if (!socket || role !== 'HOST') return;
    soundManager.playClick();
    socket.emit('return-to-lobby', (res) => {
      if (res && res.success) {
        setHostGameState('LOBBY');
        setCurrentQuestionData(null);
        setRoundResults(null);
        setLiveAnnouncement('Returned match to Lobby. You may now reconfigure or change settings.');
      }
    });
    setShowSettingsModal(false);
  };

  // Host Action: Stop Hosting (cleans up room and returns to setup)
  const handleStopHosting = () => {
    soundManager.playClick();
    if (socket && role === 'HOST') {
      socket.emit('stop-hosting', () => {
        resetToModeSelection();
      });
    } else {
      resetToModeSelection();
    }
    setShowStopHostingConfirm(false);
    setShowSettingsModal(false);
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
        if (res.roomSettings) {
          setRoomSettings(res.roomSettings);
        }
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

    const choiceObj = currentQuestionData?.choices?.find(c => c.id === choiceId);
    const shapeLabel = choiceObj?.shape === 'triangle' ? '▲ Triangle' : choiceObj?.shape === 'diamond' ? '◆ Diamond' : choiceObj?.shape === 'circle' ? '● Circle' : '■ Square';
    const choiceText = choiceObj?.text ? ` (${choiceObj.text})` : '';
    setLiveAnnouncement(`Answer submitted: Choice ${choiceId} ${shapeLabel}${choiceText}. Locked in!`);

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
    setShowSettingsModal(false);
    setShowStopHostingConfirm(false);
  };

  // Host In-Game Persistent Command Bar (renders across all 8 cabinet game modes)
  const renderHostInGameHeader = () => {
    if (role !== 'HOST' || hostGameState === 'LOBBY') return null;

    const activeCabinet = ARCADE_CABINETS.find(c => c.id === gameMode) || ARCADE_CABINETS[0];

    return (
      <header
        aria-label="Host Match Control Deck"
        style={{
          background: '#060e20',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', background: '#1e293b', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
            🎮 HOST COMMAND DECK
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>
            ROOM: {roomPin}
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', color: activeCabinet.color, fontWeight: 700 }}>
            {activeCabinet.icon} {activeCabinet.title}
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: '#facc15' }}>
            👥 {players.length} Cadets
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary arcade-btn-deck"
            style={{ minHeight: '44px', padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>
          <button
            type="button"
            className="btn-secondary arcade-btn-deck"
            style={{ minHeight: '44px', padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#f59e0b', color: '#fde68a' }}
            onClick={handleReturnToLobby}
          >
            <RotateCcw size={15} />
            <span>Restart to Lobby</span>
          </button>
          <button
            type="button"
            className="btn-secondary arcade-btn-deck"
            style={{ minHeight: '44px', padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#ef4444', color: '#fca5a5' }}
            onClick={() => setShowStopHostingConfirm(true)}
          >
            <XCircle size={15} />
            <span>Stop Hosting</span>
          </button>
        </div>
      </header>
    );
  };

  // Host Match Settings & Curriculum Modal
  const renderSettingsModal = () => {
    if (!showSettingsModal) return null;

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-settings-modal-title"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowSettingsModal(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setShowSettingsModal(false);
        }}
      >
        <div
          style={{
            background: '#0b1326',
            border: '2px solid #38bdf8',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden'
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#060e20'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚙️</span>
              <div>
                <h2
                  id="host-settings-modal-title"
                  style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  HOST MATCH & CURRICULUM SETTINGS
                </h2>
                <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8' }}>
                  ACTIVE ROOM PIN: {roomPin} {hostGameState !== 'LOBBY' ? '• [MATCH IN PROGRESS]' : '• [IN LOBBY]'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ minWidth: '44px', minHeight: '44px', padding: '0.4rem 0.75rem', fontSize: '1rem', color: '#94a3b8' }}
              onClick={() => setShowSettingsModal(false)}
              aria-label="Close Settings Dialog"
            >
              ✕
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Row 1: Cartridge / Game Mode & Exam Track */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="modal-game-mode" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  🕹️ Active Arcade Cartridge:
                </label>
                <select
                  id="modal-game-mode"
                  className="input-field"
                  value={hostSettings.gameMode}
                  onChange={(e) => {
                    handleSelectGameMode(e.target.value);
                  }}
                  style={{ minHeight: '44px' }}
                >
                  {ARCADE_CABINETS.map((cab) => (
                    <option key={cab.id} value={cab.id}>
                      Cabinet {cab.num}: {cab.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modal-track-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  🎓 Certification Exam Track:
                </label>
                <select
                  id="modal-track-select"
                  className="input-field"
                  value={hostSettings.certTrack || 'all'}
                  onChange={(e) => {
                    handleUpdateSettings({ certTrack: e.target.value, domain: 'all' });
                  }}
                  style={{ minHeight: '44px' }}
                >
                  <option value="all">🌟 Digital Accessibility IAAP Suite (CPACC · WAS · ADS)</option>
                  <option value="cpacc">📘 CPACC (Core Competencies & Universal Design)</option>
                  <option value="was">💻 WAS (Web Accessibility Specialist - Technical AA/AAA)</option>
                  <option value="ads">📄 ADS (Accessible Document Specialist - Remediation & PDF/UA)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Timer & Question Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="modal-timer-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  ⏱️ Round Timer Limit:
                </label>
                <select
                  id="modal-timer-select"
                  className="input-field"
                  value={hostSettings.timeLimit}
                  onChange={(e) => {
                    handleUpdateSettings({ timeLimit: parseInt(e.target.value, 10) });
                  }}
                  style={{ minHeight: '44px' }}
                >
                  <option value="15">15 Seconds (Rapid)</option>
                  <option value="20">20 Seconds (Standard)</option>
                  <option value="30">30 Seconds (Thoughtful)</option>
                  <option value="0">Untimed / Manual Advance</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-count-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  🎯 Questions Per Match:
                </label>
                <select
                  id="modal-count-select"
                  className="input-field"
                  value={hostSettings.questionCount}
                  onChange={(e) => {
                    handleUpdateSettings({ questionCount: parseInt(e.target.value, 10) });
                  }}
                  style={{ minHeight: '44px' }}
                >
                  <option value="5">5 Questions (Blitz)</option>
                  <option value="10">10 Questions (Standard)</option>
                  <option value="15">15 Questions (Extended)</option>
                  <option value="20">20 Questions (Marathon)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Curriculum Filter Mode Switcher */}
            <div>
              <span style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.45rem' }}>
                📚 Curriculum Selection Focus:
              </span>
              <div
                role="tablist"
                aria-label="Modal question selection method"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', background: '#060e20', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={hostSettings.filterType === 'domain'}
                  onClick={() => {
                    soundManager.playClick();
                    handleUpdateSettings({ filterType: 'domain' });
                  }}
                  style={{
                    minHeight: '44px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: hostSettings.filterType === 'domain' ? '#38bdf8' : 'transparent',
                    color: hostSettings.filterType === 'domain' ? '#090d16' : '#94a3b8'
                  }}
                >
                  🌐 By Domain
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={hostSettings.filterType === 'sections'}
                  onClick={() => {
                    soundManager.playClick();
                    handleUpdateSettings({ filterType: 'sections' });
                  }}
                  style={{
                    minHeight: '44px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: hostSettings.filterType === 'sections' ? '#10b981' : 'transparent',
                    color: hostSettings.filterType === 'sections' ? '#090d16' : '#94a3b8'
                  }}
                >
                  📑 By Sections ({hostSettings.selectedSections?.length || 0})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={hostSettings.filterType === 'subjects'}
                  onClick={() => {
                    soundManager.playClick();
                    handleUpdateSettings({ filterType: 'subjects' });
                  }}
                  style={{
                    minHeight: '44px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: hostSettings.filterType === 'subjects' ? '#f59e0b' : 'transparent',
                    color: hostSettings.filterType === 'subjects' ? '#090d16' : '#94a3b8'
                  }}
                >
                  🏷️ By Subject ({hostSettings.selectedSubjects?.length || 0})
                </button>
              </div>
            </div>

            {/* Filter Content */}
            {hostSettings.filterType === 'domain' && (
              <div>
                <label htmlFor="modal-domain-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Curriculum Domain Focus:
                </label>
                <select
                  id="modal-domain-select"
                  className="input-field"
                  value={hostSettings.domain}
                  onChange={(e) => {
                    handleUpdateSettings({ domain: e.target.value });
                  }}
                  style={{ minHeight: '44px' }}
                >
                  {(CERTIFICATION_DOMAINS[hostSettings.certTrack || 'all'] || CERTIFICATION_DOMAINS.all).map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>
            )}

            {hostSettings.filterType === 'sections' && (
              <div style={{ background: '#060e20', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                    Curriculum Sections ({hostSettings.selectedSections?.length || 0} selected):
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: '44px' }}
                      onClick={handleSelectAllSections}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: '44px' }}
                      onClick={handleClearSections}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem' }}>
                  {allAvailableSections.map((cert) => (
                    <div key={cert.id} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.2rem' }}>
                        {cert.title}
                      </div>
                      {(cert.domains || []).map((dom) => (
                        <div key={dom.id} style={{ marginBottom: '0.5rem', paddingLeft: '0.35rem' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                            {dom.title}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.35rem' }}>
                            {(dom.sections || []).map((sec) => {
                              const isChecked = (hostSettings.selectedSections || []).includes(sec.id);
                              return (
                                <label
                                  key={sec.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '4px',
                                    background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                                    border: `1px solid ${isChecked ? '#10b981' : 'transparent'}`,
                                    cursor: 'pointer',
                                    minHeight: '44px'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleSection(sec.id)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#10b981' }}
                                  />
                                  <span style={{ fontSize: '0.75rem', color: isChecked ? '#ffffff' : '#cbd5e1', flex: 1 }}>
                                    <strong>{sec.id}</strong>: {sec.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hostSettings.filterType === 'subjects' && (
              <div style={{ background: '#060e20', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>
                    Curriculum Subjects ({hostSettings.selectedSubjects?.length || 0} selected):
                  </span>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: '44px' }}
                    onClick={handleClearSubjects}
                  >
                    Clear All
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {allAvailableSubjects.map((sub) => {
                    const isChecked = (hostSettings.selectedSubjects || []).includes(sub.key);
                    return (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => handleToggleSubject(sub.key)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          cursor: 'pointer',
                          minHeight: '44px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: isChecked ? '#f59e0b' : 'rgba(30, 41, 59, 0.7)',
                          color: isChecked ? '#090d16' : '#cbd5e1',
                          border: `1px solid ${isChecked ? '#f59e0b' : 'rgba(100, 116, 139, 0.4)'}`
                        }}
                      >
                        <span>{isChecked ? '✓' : '+'}</span>
                        <span>{sub.label}</span>
                        <span style={{ opacity: 0.75, fontSize: '0.7rem' }}>({sub.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pool Diagnostics */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: availableQuestions.length === 0 ? 'rgba(239, 68, 68, 0.15)' : availableQuestions.length < hostSettings.questionCount ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${availableQuestions.length === 0 ? '#ef4444' : availableQuestions.length < hostSettings.questionCount ? '#f59e0b' : '#10b981'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: availableQuestions.length === 0 ? '#fca5a5' : availableQuestions.length < hostSettings.questionCount ? '#fde68a' : '#6ee7b7' }}>
                <span>{availableQuestions.length === 0 ? '🔴' : availableQuestions.length < hostSettings.questionCount ? '⚠️' : '🟢'}</span>
                <span>
                  {availableQuestions.length === 0
                    ? 'Zero questions found matching this filter.'
                    : availableQuestions.length < hostSettings.questionCount
                    ? `Pool only has ${availableQuestions.length} questions (below round target of ${hostSettings.questionCount}).`
                    : `Healthy inventory: ${availableQuestions.length} questions available.`}
                </span>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, color: '#ffffff' }}>
                POOL: {availableQuestions.length} Qs
              </span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: '#060e20',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {hostGameState !== 'LOBBY' && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ minHeight: '44px', borderColor: '#f59e0b', color: '#fde68a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={handleReturnToLobby}
                >
                  <RotateCcw size={16} />
                  <span>Restart / Return to Lobby</span>
                </button>
              )}
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '44px', borderColor: '#ef4444', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowStopHostingConfirm(true);
                }}
              >
                <XCircle size={16} />
                <span>Stop Hosting</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '44px' }}
                onClick={() => setShowSettingsModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ minHeight: '44px', background: '#10b981', borderColor: '#10b981', color: '#090d16', fontWeight: 800 }}
                onClick={() => {
                  handleUpdateSettings(hostSettings);
                  setShowSettingsModal(false);
                }}
              >
                ✓ Apply & Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Host Stop Hosting Confirmation Dialog
  const renderStopHostingConfirmModal = () => {
    if (!showStopHostingConfirm) return null;

    return (
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="stop-hosting-dialog-title"
        aria-describedby="stop-hosting-dialog-desc"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowStopHostingConfirm(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setShowStopHostingConfirm(false);
        }}
      >
        <div
          style={{
            background: '#0b1326',
            border: '2px solid #ef4444',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '520px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🛑</span>
            <div>
              <h2
                id="stop-hosting-dialog-title"
                style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                STOP HOSTING ARCADE ROOM?
              </h2>
              <span style={{ fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                ROOM PASSCODE: {roomPin}
              </span>
            </div>
          </div>

          <p id="stop-hosting-dialog-desc" style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
            Stopping the hosted game will immediately terminate Room <strong>{roomPin}</strong> and disconnect all connected cadets. You will be returned to the main cartridge setup screen.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ minHeight: '44px', padding: '0.6rem 1.25rem' }}
              onClick={() => setShowStopHostingConfirm(false)}
            >
              ↩️ Keep Hosting
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ minHeight: '44px', padding: '0.6rem 1.25rem', background: '#ef4444', borderColor: '#ef4444', color: '#ffffff', fontWeight: 800 }}
              onClick={handleStopHosting}
            >
              🛑 Yes, Stop Hosting
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW RENDERER (Wrapped in Root Accessible Status Region)
  // ==========================================
  const renderViewContent = () => {
    if (!role) {
    const activeCabinet = ARCADE_CABINETS.find(c => c.id === hostSettings.gameMode) || ARCADE_CABINETS[0];

    return (
      <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Marquee Hero Header */}
        <section aria-labelledby="lobby-marquee-title" className="marquee-hero-card">
          <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #c084fc', color: '#e9d5ff', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(192, 132, 252, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>✓</span>
                <span>[DOM-1, 2, 3 HYBRID]</span>
              </span>
              <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #334155', color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: '#0b1326' }}>
                MATCH ID: #IAAP-LOBBY
              </span>
              <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>🛡️</span>
                <span>WCAG 2.2 AAA VERIFIED</span>
              </span>
            </div>

            <h1 id="lobby-marquee-title" style={{ fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              MULTIPLAYER PARTY DRILL LOBBY
            </h1>
            <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: '#94a3b8', maxWidth: '800px', lineHeight: 1.5 }}>
              Choose your combat station! Screen readers welcome, rogue bots will be alt-tagged. Compete live with your accessibility team to conquer Digital Accessibility IAAP certification questions (CPACC, WAS, and upcoming ADS) in rapid-fire arcade rounds.
            </p>
          </div>
        </section>

        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', color: '#fca5a5', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
            {errorMessage}
          </div>
        )}

        {/* 2-Station Bento Grid: Player Join vs Host Launch */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {/* Station 1: Join as Player */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid var(--border-bright)', background: 'var(--bg-surface)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>📱</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Join as Player</h2>
                    <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8' }}>[CADET TERMINAL]</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '4px', fontWeight: 700 }}>
                  LIVE SYNC
                </span>
              </div>

              <form onSubmit={handlePlayerJoin} id="player-join-form">
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="role-pin-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace" }}>
                    4-DIGIT ROOM PIN:
                  </label>
                  <input
                    id="role-pin-input"
                    type="text"
                    maxLength={4}
                    className="input-field"
                    style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 900, fontFamily: "'Space Mono', monospace", color: '#38bdf8', background: '#090d16', border: '2px solid #38bdf8' }}
                    placeholder="A11Y"
                    value={playerPinInput}
                    onChange={(e) => setPlayerPinInput(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="role-nick-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Cadet Nickname:
                  </label>
                  <input
                    id="role-nick-input"
                    type="text"
                    maxLength={18}
                    className="input-field"
                    placeholder="e.g. Captain Contrast"
                    value={playerNickname}
                    onChange={(e) => setPlayerNickname(e.target.value)}
                    required
                  />
                </div>

                {/* Option B: Secret Passcode */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="role-passcode-input" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    <Lock size={15} color="#38bdf8" />
                    <span>4-Digit Secret Passcode:</span>
                  </label>
                  <input
                    id="role-passcode-input"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    className="input-field"
                    style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.3em', fontWeight: 800 }}
                    placeholder="1234"
                    value={userPasscode}
                    onChange={(e) => setUserPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    Protects your weekly score & study history! Creates your passcode if new, or unlocks stats if returning.
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Avatar Selection:
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => {
                          setPlayerAvatar(av);
                          soundManager.playClick();
                        }}
                        style={{
                          fontSize: '1.4rem',
                          padding: '0.35rem 0.55rem',
                          background: playerAvatar === av ? 'rgba(56, 189, 248, 0.25)' : 'var(--bg-surface-elevated)',
                          border: `2px solid ${playerAvatar === av ? '#38bdf8' : 'var(--border-color)'}`,
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transform: playerAvatar === av ? 'scale(1.15)' : 'none',
                          transition: 'transform 0.1s ease'
                        }}
                        aria-label={`Select avatar ${av}`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary arcade-btn-primary"
                  style={{ width: '100%', fontSize: '1.05rem', padding: '0.85rem' }}
                >
                  <Users size={18} />
                  <span>JOIN WITH TOKEN</span>
                </button>
              </form>
            </div>
          </div>

          {/* Station 2: Host an Arcade Game */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid var(--border-bright)', background: 'var(--bg-surface)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>🖥️</span>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Host Arcade Room</h2>
                    <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#10b981' }}>[HOST COMMAND CENTER]</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '4px', fontWeight: 700 }}>
                  SCREEN SHARE
                </span>
              </div>

              {/* Active Cartridge Pill */}
              <div style={{ background: '#0b1326', border: `2px solid ${activeCabinet.color}`, borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: activeCabinet.color, fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>
                    {activeCabinet.tag} // CABINET {activeCabinet.num}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                    {activeCabinet.domain}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{activeCabinet.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {activeCabinet.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {activeCabinet.subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label htmlFor="host-track-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Certification Exam Track:
                  </label>
                  <select
                    id="host-track-select"
                    className="input-field"
                    value={hostSettings.certTrack || 'all'}
                    onChange={(e) => setHostSettings({ ...hostSettings, certTrack: e.target.value, domain: 'all' })}
                  >
                    <option value="all">🌟 Digital Accessibility IAAP Suite (CPACC · WAS · ADS)</option>
                    <option value="cpacc">📘 CPACC (Core Competencies & Universal Design)</option>
                    <option value="was">💻 WAS (Web Accessibility Specialist - Technical AA/AAA)</option>
                    <option value="ads">📄 ADS (Accessible Document Specialist - Remediation & PDF/UA)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="host-timer-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Round Timer Limit:
                    </label>
                    <select
                      id="host-timer-select"
                      className="input-field"
                      value={hostSettings.timeLimit}
                      onChange={(e) => setHostSettings({ ...hostSettings, timeLimit: parseInt(e.target.value, 10) })}
                    >
                      <option value="15">15 Seconds (Rapid)</option>
                      <option value="20">20 Seconds (Standard)</option>
                      <option value="30">30 Seconds (Thoughtful)</option>
                      <option value="0">Untimed / Manual</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="host-count-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Questions Per Match:
                    </label>
                    <select
                      id="host-count-select"
                      className="input-field"
                      value={hostSettings.questionCount}
                      onChange={(e) => setHostSettings({ ...hostSettings, questionCount: parseInt(e.target.value, 10) })}
                    >
                      <option value="5">5 Questions (Blitz)</option>
                      <option value="10">10 Questions (Standard)</option>
                      <option value="15">15 Questions (Extended)</option>
                      <option value="20">20 Questions (Marathon)</option>
                    </select>
                  </div>
                </div>

                {/* Question Selection Mode Switcher */}
                <div>
                  <span style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.45rem' }}>
                    Question Pool Focus:
                  </span>
                  <div
                    role="tablist"
                    aria-label="Question selection method"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', background: '#0b1326', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={hostSettings.filterType === 'domain'}
                      onClick={() => {
                        soundManager.playClick();
                        setHostSettings(prev => ({ ...prev, filterType: 'domain' }));
                      }}
                      style={{
                        padding: '0.5rem 0.25rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: hostSettings.filterType === 'domain' ? '#38bdf8' : 'transparent',
                        color: hostSettings.filterType === 'domain' ? '#090d16' : '#94a3b8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      🌐 By Domain
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={hostSettings.filterType === 'sections'}
                      onClick={() => {
                        soundManager.playClick();
                        setHostSettings(prev => ({ ...prev, filterType: 'sections' }));
                      }}
                      style={{
                        padding: '0.5rem 0.25rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: hostSettings.filterType === 'sections' ? '#10b981' : 'transparent',
                        color: hostSettings.filterType === 'sections' ? '#090d16' : '#94a3b8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      📑 By Sections ({hostSettings.selectedSections?.length || 0})
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={hostSettings.filterType === 'subjects'}
                      onClick={() => {
                        soundManager.playClick();
                        setHostSettings(prev => ({ ...prev, filterType: 'subjects' }));
                      }}
                      style={{
                        padding: '0.5rem 0.25rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: hostSettings.filterType === 'subjects' ? '#f59e0b' : 'transparent',
                        color: hostSettings.filterType === 'subjects' ? '#090d16' : '#94a3b8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      🏷️ By Subject ({hostSettings.selectedSubjects?.length || 0})
                    </button>
                  </div>
                </div>

                {/* Sub-Panel A: By Domain Focus */}
                {hostSettings.filterType === 'domain' && (
                  <div>
                    <label htmlFor="host-domain-select" style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Curriculum Domain Focus:
                    </label>
                    <select
                      id="host-domain-select"
                      className="input-field"
                      value={hostSettings.domain}
                      onChange={(e) => setHostSettings({ ...hostSettings, domain: e.target.value })}
                    >
                      {(CERTIFICATION_DOMAINS[hostSettings.certTrack || 'all'] || CERTIFICATION_DOMAINS.all).map(d => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sub-Panel B: By Sections Multi-Select */}
                {hostSettings.filterType === 'sections' && (
                  <div style={{ background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>
                        Curriculum Sections ({hostSettings.selectedSections.length} selected):
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={handleSelectAllSections}
                          style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={handleClearSections}
                          style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '0.35rem' }}>
                      {allAvailableSections.map(cert => (
                        <div key={cert.id} style={{ marginBottom: '0.35rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                            {cert.title}
                          </div>
                          {(cert.domains || []).map(dom => (
                            <div key={dom.id} style={{ marginBottom: '0.5rem', paddingLeft: '0.35rem', borderLeft: '2px solid rgba(56, 189, 248, 0.3)' }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                                {dom.title}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {(dom.sections || []).map(sec => {
                                  const isChecked = hostSettings.selectedSections.includes(sec.id);
                                  const isCritical = sec.count < 5;
                                  const isLow = sec.count >= 5 && sec.count < 10;
                                  return (
                                    <label
                                      key={sec.id}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '0.5rem',
                                        padding: '0.45rem 0.65rem',
                                        minHeight: '44px',
                                        borderRadius: '4px',
                                        background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                                        border: `1px solid ${isChecked ? '#10b981' : 'rgba(51, 65, 85, 0.5)'}`,
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleToggleSection(sec.id)}
                                          style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#cbd5e1' }}>
                                          [{sec.id}]
                                        </span>
                                        <span style={{ color: '#ffffff', fontSize: '0.78rem' }}>
                                          {sec.title}
                                        </span>
                                      </div>
                                      <span
                                        style={{
                                          fontSize: '0.7rem',
                                          fontWeight: 800,
                                          padding: '0.15rem 0.4rem',
                                          borderRadius: '4px',
                                          whiteSpace: 'nowrap',
                                          background: isCritical ? 'rgba(239, 68, 68, 0.2)' : isLow ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                          border: `1px solid ${isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#10b981'}`,
                                          color: isCritical ? '#fca5a5' : isLow ? '#fde68a' : '#86efac'
                                        }}
                                        title={isCritical ? 'Fewer than 5 questions available for this section' : isLow ? 'Fewer than 10 questions available' : 'Healthy inventory'}
                                      >
                                        {isCritical ? `🔴 ${sec.count} Qs` : isLow ? `⚠️ ${sec.count} Qs` : `🟢 ${sec.count} Qs`}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Panel C: By Subject / Topic Multi-Select */}
                {hostSettings.filterType === 'subjects' && (
                  <div style={{ background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b' }}>
                        Curriculum Subjects ({hostSettings.selectedSubjects.length} selected):
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={handleSelectAllSubjects}
                          style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={handleClearSubjects}
                          style={{ minHeight: '44px', minWidth: '44px', fontSize: '0.75rem', padding: '0.35rem 0.65rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingRight: '0.35rem' }}>
                      {allAvailableSubjects.map(sub => {
                        const isChecked = hostSettings.selectedSubjects.includes(sub.key);
                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => handleToggleSubject(sub.key)}
                            aria-pressed={isChecked}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.4rem 0.65rem',
                              minHeight: '44px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: `1px solid ${isChecked ? '#f59e0b' : 'rgba(51, 65, 85, 0.6)'}`,
                              background: isChecked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                              color: isChecked ? '#fbbf24' : '#cbd5e1'
                            }}
                          >
                            <span>{sub.icon}</span>
                            <span>{sub.label}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.8, fontFamily: "'Space Mono', monospace" }}>
                              ({sub.count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Real-Time Question Pool Diagnostic Bar */}
                <div style={{
                  background: availableQuestions.length === 0 ? 'rgba(239, 68, 68, 0.15)' : availableQuestions.length < hostSettings.questionCount ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                  border: `1px solid ${availableQuestions.length === 0 ? '#ef4444' : availableQuestions.length < hostSettings.questionCount ? '#f59e0b' : '#10b981'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      fontFamily: "'Space Mono', monospace",
                      color: availableQuestions.length === 0 ? '#fca5a5' : availableQuestions.length < hostSettings.questionCount ? '#fde68a' : '#86efac'
                    }}>
                      📦 MATCH POOL: {availableQuestions.length} Questions Available
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Space Mono', monospace" }}>
                      TARGET: {hostSettings.questionCount} Qs
                    </span>
                  </div>

                  {availableQuestions.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.2rem' }}>
                      ⚠️ Zero questions found matching this filter. Please choose at least one section or subject.
                    </div>
                  ) : availableQuestions.length < hostSettings.questionCount ? (
                    <div style={{ fontSize: '0.75rem', color: '#fde68a', marginTop: '0.2rem' }}>
                      ⚠️ Pool has fewer items ({availableQuestions.length}) than your round target ({hostSettings.questionCount}). The match will run with all {availableQuestions.length} questions.
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#86efac', marginTop: '0.2rem' }}>
                      ✓ Healthy question inventory for full {hostSettings.questionCount}-question matches.
                    </div>
                  )}
                </div>

                {/* Host Play Along Option */}
                <div style={{ background: '#0b1326', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                    <input
                      type="checkbox"
                      checked={hostSettings.hostParticipates || false}
                      onChange={(e) => setHostSettings({ ...hostSettings, hostParticipates: e.target.checked })}
                      style={{ width: '24px', height: '24px', minWidth: '44px', minHeight: '44px', cursor: 'pointer' }}
                    />
                    <span>🎮 Play along as Host on this screen</span>
                  </label>
                  {hostSettings.hostParticipates && (
                    <div style={{ marginTop: '0.6rem' }}>
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
            </div>

            <button
              type="button"
              disabled={availableQuestions.length === 0}
              aria-disabled={availableQuestions.length === 0}
              className="btn-primary arcade-btn-secondary"
              style={{
                width: '100%',
                fontSize: '1.05rem',
                padding: '0.85rem',
                minHeight: '44px',
                background: availableQuestions.length === 0 ? '#334155' : '#10b981',
                borderColor: availableQuestions.length === 0 ? '#475569' : '#10b981',
                color: availableQuestions.length === 0 ? '#94a3b8' : '#090d16',
                cursor: availableQuestions.length === 0 ? 'not-allowed' : 'pointer',
                opacity: availableQuestions.length === 0 ? 0.6 : 1
              }}
              onClick={handleHostCreateRoom}
            >
              <Play size={18} />
              <span>CREATE ARCADE ROOM</span>
            </button>
          </div>
        </div>

        {/* Digital Accessibility IAAP Certification Arcade Cabinets Preview / Selector Grid */}
        <section aria-labelledby="arcade-cabinets-title">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8', fontWeight: 800 }}>
                [SELECTION STAGE]
              </span>
            </div>
            <h2 id="arcade-cabinets-title" style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              DIGITAL ACCESSIBILITY IAAP CERTIFICATION CABINETS (CPACC · WAS · ADS)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
              Select a drill cartridge to load into the host lobby queue (1 active drill per round):
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Digital Accessibility IAAP Certification Cabinets (CPACC · WAS · ADS)"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {ARCADE_CABINETS.map((cab) => {
              const isSelected = hostSettings.gameMode === cab.id;
              return (
                <article
                  key={cab.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelectGameMode(cab.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleSelectGameMode(cab.id);
                    }
                  }}
                  className={`arcade-cabinet-card ${isSelected ? 'cabinet-selected' : ''}`}
                  style={{
                    borderColor: isSelected ? cab.color : undefined
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: cab.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>CABINET {cab.num}</span>
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: isSelected ? '#10b981' : '#94a3b8' }}>
                        {isSelected ? '[ACTIVE LOADOUT]' : cab.tag}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ width: '44px', height: '44px', background: `${cab.color}18`, border: `2px solid ${cab.color}`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                        {cab.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                          {cab.title}
                        </h3>
                        <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: cab.color, display: 'block', marginTop: '0.15rem' }}>
                          {cab.subtitle}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                      {cab.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                      Domain: {cab.domain}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectGameMode(cab.id);
                      }}
                      className={isSelected ? "btn-primary" : "btn-secondary"}
                      style={{
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.75rem',
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 800,
                        background: isSelected ? cab.color : undefined,
                        borderColor: isSelected ? cab.color : undefined,
                        color: isSelected ? '#090d16' : '#ffffff'
                      }}
                    >
                      {isSelected ? '✓ SELECTED' : 'INSERT TOKEN'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: HOST SCREENS
  // ==========================================
  if (role === 'HOST') {
    // 2A: Host Lobby Screen (Stitch Neo-Arcade Architecture)
    if (hostGameState === 'LOBBY') {
      const activeCabinet = ARCADE_CABINETS.find(c => c.id === gameMode) || ARCADE_CABINETS[0];
      const pinLetters = roomPin ? roomPin.split('') : ['_', '_', '_', '_'];

      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '7rem' }}>
          {/* Top Marquee Bento Card */}
          <section aria-labelledby="host-lobby-title" className="marquee-hero-card">
            <div aria-hidden="true" style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div aria-hidden="true" style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '9999px', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '2rem', justifyContent: 'space-between', alignItems: 'stretch' }}>
              {/* Left Column: Match Details and HUD */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        border: `1px solid ${hostSettings.certTrack === 'was' ? '#10b981' : hostSettings.certTrack === 'cpacc' ? '#38bdf8' : hostSettings.certTrack === 'ads' ? '#f59e0b' : '#c084fc'}`,
                        color: hostSettings.certTrack === 'was' ? '#6ee7b7' : hostSettings.certTrack === 'cpacc' ? '#7dd3fc' : hostSettings.certTrack === 'ads' ? '#fde68a' : '#e9d5ff',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        background: hostSettings.certTrack === 'was' ? 'rgba(16, 185, 129, 0.15)' : hostSettings.certTrack === 'cpacc' ? 'rgba(56, 189, 248, 0.15)' : hostSettings.certTrack === 'ads' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(192, 132, 252, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <span>{hostSettings.certTrack === 'was' ? '💻' : hostSettings.certTrack === 'cpacc' ? '📘' : hostSettings.certTrack === 'ads' ? '📄' : '🌟'}</span>
                        <span>[EXAM: {hostSettings.certTrack === 'was' ? 'IAAP WAS TECHNICAL' : hostSettings.certTrack === 'cpacc' ? 'IAAP CPACC CORE' : hostSettings.certTrack === 'ads' ? 'IAAP ADS DOCUMENT SPECIALIST' : 'DIGITAL ACCESSIBILITY IAAP (CPACC · WAS · ADS)'}]</span>
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #334155', color: '#94a3b8', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: '#0b1326' }}>
                        MATCH ID: #{roomPin || 'ARCADE'}
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', border: '1px solid #10b981', color: '#6ee7b7', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>🛡️</span>
                        <span>WCAG 2.2 AAA VERIFIED</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-secondary arcade-btn-deck"
                        style={{ minHeight: '44px', padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#38bdf8', color: '#7dd3fc' }}
                        onClick={() => setShowSettingsModal(true)}
                      >
                        <Settings size={15} />
                        <span>⚙️ Edit Match Settings</span>
                      </button>
                      <button
                        type="button"
                        className="btn-secondary arcade-btn-deck"
                        style={{ minHeight: '44px', padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#ef4444', color: '#fca5a5' }}
                        onClick={() => setShowStopHostingConfirm(true)}
                      >
                        <XCircle size={15} />
                        <span>🛑 Stop Hosting</span>
                      </button>
                    </div>
                  </div>

                  <h1 id="host-lobby-title" style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                    MULTIPLAYER PARTY DRILL LOBBY
                  </h1>
                  <p style={{ marginTop: '0.6rem', fontSize: '1rem', color: '#94a3b8', maxWidth: '750px', lineHeight: 1.5 }}>
                    Punch in your 4-digit token (<span style={{ color: '#10b981', fontWeight: 800 }}>screen readers welcome</span>, rogue bots will be alt-tagged!). Compete live with your accessibility team to conquer {hostSettings.certTrack === 'was' ? 'IAAP WAS technical remediation' : hostSettings.certTrack === 'cpacc' ? 'IAAP CPACC certification' : hostSettings.certTrack === 'ads' ? 'IAAP ADS document accessibility' : 'Digital Accessibility IAAP certification (CPACC · WAS · ADS)'} questions in rapid-fire arcade rounds.
                  </p>

                  {/* Room Inventory Warning if Pool is small */}
                  {roomSettings?.poolWarning && (
                    <div style={{
                      marginTop: '0.75rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid #f59e0b',
                      color: '#fde68a',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                      <span><strong>Pool Inventory Notice:</strong> {roomSettings.poolWarning}</span>
                    </div>
                  )}
                </div>

                {/* Match Configuration HUD Strip */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid rgba(51, 65, 85, 0.6)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
                    <Clock size={16} color="#38bdf8" />
                    <span>Timer:</span>
                    <select
                      className="input-field"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto', minHeight: '44px' }}
                      value={hostSettings.timeLimit}
                      onChange={(e) => handleUpdateSettings({ timeLimit: parseInt(e.target.value, 10) })}
                    >
                      <option value="15">15s Rapid</option>
                      <option value="20">20s Standard</option>
                      <option value="30">30s Thoughtful</option>
                      <option value="0">Untimed / Manual</option>
                    </select>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
                    <span>Track:</span>
                    <select
                      className="input-field"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto', minHeight: '44px' }}
                      value={hostSettings.certTrack || 'all'}
                      onChange={(e) => handleUpdateSettings({ certTrack: e.target.value, domain: 'all' })}
                    >
                      <option value="all">🌟 Digital Accessibility IAAP Suite (CPACC · WAS · ADS)</option>
                      <option value="cpacc">📘 CPACC (Core Competencies & Universal Design)</option>
                      <option value="was">💻 WAS (Web Accessibility Specialist)</option>
                      <option value="ads">📄 ADS (Accessible Document Specialist - Remediation & PDF/UA)</option>
                    </select>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: '#cbd5e1' }}>
                    <span>Questions:</span>
                    <select
                      className="input-field"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto', minHeight: '44px' }}
                      value={hostSettings.questionCount}
                      onChange={(e) => handleUpdateSettings({ questionCount: parseInt(e.target.value, 10) })}
                    >
                      <option value="5">5 Qs</option>
                      <option value="10">10 Qs</option>
                      <option value="15">15 Qs</option>
                      <option value="20">20 Qs</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="btn-secondary arcade-btn-deck"
                    style={{ minHeight: '44px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#10b981', color: '#6ee7b7' }}
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <span>📑 Curriculum:</span>
                    <span style={{ fontWeight: 800 }}>
                      {hostSettings.filterType === 'sections'
                        ? `${hostSettings.selectedSections?.length || 0} Sec`
                        : hostSettings.filterType === 'subjects'
                        ? `${hostSettings.selectedSubjects?.length || 0} Sub`
                        : 'By Domain'}
                    </span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>(Customize)</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: availableQuestions.length === 0 ? '#ef4444' : availableQuestions.length < hostSettings.questionCount ? '#f59e0b' : '#10b981' }}>
                    <span>{availableQuestions.length === 0 ? '🔴' : availableQuestions.length < hostSettings.questionCount ? '⚠️' : '🟢'}</span>
                    <span>{availableQuestions.length} Qs Pool</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontFamily: "'Space Mono', monospace", color: activeCabinet.color, marginLeft: 'auto' }}>
                    <span style={{ fontSize: '1.1rem' }}>{activeCabinet.icon}</span>
                    <span style={{ fontWeight: 800 }}>CARTRIDGE: {activeCabinet.title}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 4-Digit Room Code Terminal Box */}
              <div style={{ minWidth: '340px', maxWidth: '420px', background: '#060e20', border: '2px solid rgba(56, 189, 248, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '4px 4px 0px 0px #060e20' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', marginBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    CABINET DISPATCH TOKEN
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#64748b' }}>
                    PORT: 8080-A11Y
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
                  ROOM PASSCODE FOR CADETS
                </p>

                {/* 4-Digit Massive Retro Tiles */}
                <div
                  aria-label={`4 digit room code: ${pinLetters.join(' ')}`}
                  role="group"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', margin: '0.5rem 0' }}
                >
                  {pinLetters.map((char, idx) => (
                    <div key={idx} className="pin-tile">
                      {char}
                    </div>
                  ))}
                </div>

                {/* Action Buttons: Copy Invite Link & Smartphone QR */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn-secondary arcade-btn-deck"
                    onClick={handleCopyInviteLink}
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      background: copiedLink ? '#10b981' : undefined,
                      borderColor: copiedLink ? '#10b981' : undefined,
                      color: '#ffffff'
                    }}
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary arcade-btn-deck"
                    onClick={() => setShowQrModal(!showQrModal)}
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <QrCode size={14} color="#38bdf8" />
                    <span>{showQrModal ? 'Hide QR' : 'Phone QR'}</span>
                  </button>
                </div>

                {/* QR Code view toggle */}
                {showQrModal && qrDataUrl && (
                  <div style={{ marginTop: '0.85rem', padding: '0.5rem', background: '#ffffff', borderRadius: 'var(--radius-sm)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    <img
                      src={qrDataUrl}
                      alt={`Scan QR code to join room ${roomPin}`}
                      style={{ width: '140px', height: '140px', display: 'block', margin: '0 auto' }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#090d16', marginTop: '0.25rem', fontWeight: 800 }}>
                      Scan to Join directly!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Connected Squad Cadets */}
          <section aria-labelledby="connected-squad-title" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span aria-hidden="true" style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '9999px', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                <h2 id="connected-squad-title" style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                  CONNECTED SQUAD ({players.length} CADETS)
                </h2>
              </div>
              <div style={{ fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#10b981', background: '#0b1326', padding: '0.3rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>⌨️</span>
                <span>{players.length} keyboard warriors in the room... ready to drop the quarter!</span>
              </div>
            </div>

            {/* Cadets Bento Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {players.map((p, idx) => (
                <article key={p.id || idx} className="cadet-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          width: '46px',
                          height: '46px',
                          background: '#060e20',
                          border: `2px solid ${idx === 0 && hostSettings.hostParticipates ? '#10b981' : '#38bdf8'}`,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem'
                        }}
                      >
                        {p.avatar || '🐱'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                          {p.nickname}
                        </h3>
                        <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                          {p.score || 0} XP
                        </span>
                      </div>
                    </div>
                    <span style={{ padding: '0.15rem 0.5rem', background: idx === 0 && hostSettings.hostParticipates ? '#10b981' : '#1e293b', color: idx === 0 && hostSettings.hostParticipates ? '#090d16' : '#94a3b8', fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', fontWeight: 800, borderRadius: '4px' }}>
                      {idx === 0 && hostSettings.hostParticipates ? 'HOST' : 'CADET'}
                    </span>
                  </div>

                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.4)', background: '#060e20', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      {CADET_SPECIALTIES[idx % CADET_SPECIALTIES.length]}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', fontWeight: 800 }}>
                      <span>✓</span>
                      <span>READY</span>
                    </div>
                  </div>
                </article>
              ))}

              {/* Slot Open Card */}
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '115px' }}>
                <span style={{ fontSize: '1.4rem', color: '#64748b', marginBottom: '0.25rem' }}>➕</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', fontFamily: "'Space Grotesk', sans-serif" }}>Slot Open</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: "'Space Mono', monospace", marginTop: '0.2rem' }}>Waiting for challenger...</span>
              </div>
            </div>
          </section>

          {/* Section 3: CPACC Certification Arcade Cabinets Grid (Selectable) */}
          <section aria-labelledby="host-cabinets-title" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: "'Space Mono', monospace", color: '#38bdf8', fontWeight: 800 }}>
                  [SELECTION STAGE]
                </span>
              </div>
              <h2 id="host-cabinets-title" style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                DIGITAL ACCESSIBILITY IAAP CERTIFICATION CABINETS (CPACC · WAS · ADS)
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                Select a drill cartridge to load into the host lobby queue (1 active drill per round):
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Digital Accessibility IAAP Certification Cabinets (CPACC · WAS · ADS)"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {ARCADE_CABINETS.map((cab) => {
                const isSelected = gameMode === cab.id;
                return (
                  <article
                    key={cab.id}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelectGameMode(cab.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleSelectGameMode(cab.id);
                      }
                    }}
                    className={`arcade-cabinet-card ${isSelected ? 'cabinet-selected' : ''}`}
                    style={{
                      borderColor: isSelected ? cab.color : undefined
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1326', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.65rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: cab.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>CABINET {cab.num}</span>
                        </span>
                        <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono', monospace", fontWeight: 800, color: isSelected ? '#10b981' : '#94a3b8' }}>
                          {isSelected ? '[ACTIVE LOADOUT]' : cab.tag}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div style={{ width: '44px', height: '44px', background: `${cab.color}18`, border: `2px solid ${cab.color}`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                          {cab.icon}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                            {cab.title}
                          </h3>
                          <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: cab.color, display: 'block', marginTop: '0.15rem' }}>
                            {cab.subtitle}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.75rem 0 1rem 0', lineHeight: 1.45 }}>
                        {cab.desc}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                        Domain: {cab.domain}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectGameMode(cab.id);
                        }}
                        className={isSelected ? "btn-primary" : "btn-secondary"}
                        style={{
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.75rem',
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 800,
                          background: isSelected ? cab.color : undefined,
                          borderColor: isSelected ? cab.color : undefined,
                          color: isSelected ? '#090d16' : '#ffffff'
                        }}
                      >
                        {isSelected ? '✓ SELECTED' : 'INSERT TOKEN'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Sticky Bottom Primary Arcade Deck Action */}
          <aside aria-label="Game launch terminal deck" className="arcade-dock">
            <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              {/* Compliance Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace", color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981' }}>
                  <span>🛡️</span>
                  <span>Screen Reader Optimised</span>
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
                  <span>✓</span>
                  <span>WCAG 2.2 AAA Validated</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#facc15' }}>
                  <span>⌨️</span>
                  <span>Press [SPACEBAR] to Launch</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary arcade-btn-deck"
                  style={{ minHeight: '44px', padding: '0.6rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#38bdf8', color: '#7dd3fc' }}
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings size={18} />
                  <span>⚙️ Settings</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary arcade-btn-deck"
                  style={{ minHeight: '44px', padding: '0.6rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#ef4444', color: '#fca5a5' }}
                  onClick={() => setShowStopHostingConfirm(true)}
                >
                  <XCircle size={18} />
                  <span>🛑 Stop Hosting</span>
                </button>

                {/* Big Arcade Start Push Button */}
                <button
                  type="button"
                  className="btn-primary arcade-btn-secondary"
                  style={{
                    fontSize: '1.15rem',
                    padding: '0.85rem 2.5rem',
                    background: '#10b981',
                    borderColor: '#10b981',
                    boxShadow: '0 5px 0 0 #059669',
                    color: '#090d16',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    fontFamily: "'Space Grotesk', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    minHeight: '44px'
                  }}
                  onClick={handleHostStartGame}
                  disabled={players.length === 0}
                >
                  <Play size={20} />
                  <span>INSERT COIN / START GAME</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      );
    }

    // Route to specialized Game Mode views
    if (gameMode === 'HOT_POTATO') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <HotPotatoMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
      );
    }

    if (gameMode === 'GRAND_PRIX') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <GrandPrixMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
      );
    }

    if (gameMode === 'HIGH_ROLLER') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <HighRollerMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
      );
    }

    if (gameMode === 'FLAW_FINDER') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <FlawFinderMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
      );
    }

    if (gameMode === 'SABOTEUR') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <SaboteurMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
      );
    }

    if (gameMode === 'BOUNDARY_BRAWL') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <BoundaryBrawlMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
      );
    }

    if (gameMode === 'BOSS_RAID') {
      return (
        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <BossRaidMode
            socket={socket}
            role="HOST"
            roomPin={roomPin}
            onLeave={handleReturnToLobby}
          />
        </div>
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
          {renderHostInGameHeader()}
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
          {renderHostInGameHeader()}
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
            <div className="explanation-box" tabIndex={0} role="region" aria-label="IAAP Certification Explanation and Reference" style={{ marginTop: '1.5rem' }}>
              <strong>Body of Knowledge Explanation:</strong> {q.explanation}
              <div style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                Ref: {q.cpaccRef || q.wasRef || q.section_id || 'IAAP BoK'}
              </div>
            </div>

            {q.funNote && (
              <div className="fun-note">
                <Sparkles size={18} />
                <span>{q.funNote}</span>
              </div>
            )}

            {/* Coach McGuirk's Sideline Pep Talk on Host Display */}
            <CoachFeedbackCard isCorrect={roundResults?.summary?.percentCorrect >= 50} />

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
        <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <div className="card">
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
        </div>
      );
    }

    // 2E: Host Final Podium Screen
    if (hostGameState === 'PODIUM') {
      const gold = podiumData[0];
      const silver = podiumData[1];
      const bronze = podiumData[2];

      return (
        <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          {renderHostInGameHeader()}
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🎉 The Digital Accessibility Champions Podium! 🎉
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

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" style={{ minHeight: '44px' }} onClick={handleReturnToLobby}>
                <RotateCcw size={18} />
                <span>Return to Lobby (Keep Squad)</span>
              </button>
              <button type="button" className="btn-secondary" style={{ minHeight: '44px', borderColor: '#ef4444', color: '#fca5a5' }} onClick={() => setShowStopHostingConfirm(true)}>
                <XCircle size={18} />
                <span>Stop Hosting</span>
              </button>
            </div>
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

    if (gameMode === 'BOSS_RAID') {
      return (
        <BossRaidMode
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#334155', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.9rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
            <span>Connected to PIN: {playerPinInput}</span>
            {roomSettings?.certTrack && (
              <span style={{
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                background: roomSettings.certTrack === 'was' ? '#10b981' : roomSettings.certTrack === 'cpacc' ? '#38bdf8' : roomSettings.certTrack === 'ads' ? '#f59e0b' : '#c084fc',
                color: '#090d16',
                fontWeight: 800,
                fontSize: '0.75rem',
                fontFamily: "'Space Mono', monospace"
              }}>
                {roomSettings.certTrack === 'was' ? 'WAS TRACK' : roomSettings.certTrack === 'cpacc' ? 'CPACC TRACK' : roomSettings.certTrack === 'ads' ? 'ADS TRACK' : 'IAAP SUITE (CPACC · WAS · ADS)'}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 3C: Player Answering Buttons (Kahoot Touch Pad)
    if (playerState === 'QUESTION') {
      return (
        <div style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <span>Question in progress...</span>
            {timerLeft > 0 && <span style={{ fontWeight: 800, color: '#38bdf8' }}>{timerLeft}s remaining</span>}
          </div>

          {/* Dynamic Answers Grid (Supports True/False 2-choice & Multiple Choice 4-choice) */}
          <div
            className="answers-grid"
            style={currentQuestionData?.choices?.length === 2 ? { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' } : {}}
          >
            {(currentQuestionData?.choices || [
              { id: 'A', text: 'Option A', shape: 'triangle' },
              { id: 'B', text: 'Option B', shape: 'diamond' },
              { id: 'C', text: 'Option C', shape: 'circle' },
              { id: 'D', text: 'Option D', shape: 'square' }
            ]).map((c, idx) => {
              const shapeIcon = SHAPE_ICONS[c.shape] || '▲';
              const shapeName = SHAPE_NAMES[c.shape] || 'Shape';
              const isTwoChoice = currentQuestionData?.choices?.length === 2;
              const keyShortcut = isTwoChoice ? (idx === 0 ? '1 / T' : '2 / F') : `${idx + 1}`;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`answer-btn ${c.shape}`}
                  onClick={() => submitPlayerChoice(c.id)}
                  aria-label={`${c.text || `Option ${c.id}`}: ${shapeName}`}
                  style={{ minHeight: '120px', fontSize: '1.25rem' }}
                >
                  <span className="shape-badge" style={{ fontSize: '2rem', width: '56px', height: '56px' }}>{shapeIcon}</span>
                  <span style={{ fontWeight: 800 }}>{c.text || `Option ${c.id}`}</span>
                  <span className="shape-badge-key">{keyShortcut}</span>
                </button>
              );
            })}
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

          {/* Coach McGuirk's Sideline Pep Talk for the Player */}
          <CoachFeedbackCard isCorrect={playerRoundFeedback.roundCorrect} />

          {/* Round winner / correct answer privilege: Drop a humorous taunt! */}
          {playerRoundFeedback.roundCorrect && (
            <TauntTriggerButton socket={socket} />
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
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto', width: '100%', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
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
          <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Final Score: {myStanding?.score || 0} pts
          </div>

          {/* Winner's Celebration Soundboard for 1st Place Champion */}
          {myStanding?.rank === 1 && (
            <WinnerCelebrationSoundboard socket={socket} isWinner={true} />
          )}

          <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={resetToModeSelection}>
            Exit to Menu
          </button>
        </div>
      );
    }
  }

    return null;
  };

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>
      <TauntNotificationToast taunt={activeTaunt} onDismiss={() => setActiveTaunt(null)} />
      <CelebrationBroadcastOverlay eventData={activeCelebration} onDismiss={() => setActiveCelebration(null)} />
      {renderSettingsModal()}
      {renderStopHostingConfirmModal()}
      {renderViewContent()}
    </>
  );
}
