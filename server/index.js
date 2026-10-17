import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gameStorage } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Load Question Bank
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');
let questionBank = [];
try {
  const data = fs.readFileSync(questionsPath, 'utf8');
  questionBank = JSON.parse(data);
  console.log(`Loaded ${questionBank.length} questions from question bank.`);
} catch (err) {
  console.error('Failed to load questions.json:', err.message);
}

// Load Policy Flaws Bank (Mode 7: Flaw Finder)
const flawsPath = path.join(__dirname, '..', 'data', 'policy_flaws.json');
let policyFlawsBank = [];
try {
  const data = fs.readFileSync(flawsPath, 'utf8');
  policyFlawsBank = JSON.parse(data);
  console.log(`Loaded ${policyFlawsBank.length} scenarios from policy flaws bank.`);
} catch (err) {
  console.error('Failed to load policy_flaws.json:', err.message);
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/flaws', (req, res) => {
  res.json(policyFlawsBank);
});

app.get('/api/questions', (req, res) => {
  const { domain, difficulty, limit } = req.query;
  let filtered = [...questionBank];
  if (domain && domain !== 'all') {
    filtered = filtered.filter(q => q.domain === parseInt(domain, 10));
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  if (limit) {
    const lim = parseInt(limit, 10);
    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, lim);
  }
  res.json(filtered);
});

app.get('/api/domains', (req, res) => {
  res.json([
    { id: 'all', name: 'All Domains (Mixed CPACC Review)' },
    { id: 1, name: 'Domain 1: Disabilities, Challenges & Assistive Tech' },
    { id: 2, name: 'Domain 2: Accessibility & Universal Design (WCAG)' },
    { id: 3, name: 'Domain 3: Standards, Laws & Management Strategies' }
  ]);
});

// Leaderboard & Study Endpoints
app.get('/api/leaderboard/weekly', (req, res) => {
  const leaderboard = gameStorage.getWeeklyLeaderboard();
  res.json({ leaderboard });
});

app.get('/api/leaderboard/all-time', (req, res) => {
  const leaderboard = gameStorage.getAllTimeLeaderboard();
  res.json({ leaderboard });
});

app.get('/api/study/missed', (req, res) => {
  const nickname = req.query.nickname || 'all';
  const missed = gameStorage.getMissedQuestions(nickname);
  res.json({ missed });
});

// Option B: 4-digit PIN Authentication & Profiles
app.post('/api/user/auth', (req, res) => {
  const { nickname, pin, avatar } = req.body || {};
  const result = gameStorage.registerOrVerifyUser({ nickname, pin, avatar });
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.get('/api/user/profile', (req, res) => {
  const { nickname, pin } = req.query || {};
  const profile = gameStorage.getUserProfile(nickname, pin);
  if (!profile) {
    return res.status(404).json({ success: false, error: 'User profile not found or PIN incorrect.' });
  }
  res.json({ success: true, profile });
});

// Game Rooms State Management
const rooms = new Map();

function generatePin() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pin = '';
  for (let i = 0; i < 4; i++) {
    pin += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return rooms.has(pin) ? generatePin() : pin;
}

function sanitizeQuestionForPlayers(q) {
  return {
    id: q.id,
    domain: q.domain,
    domainName: q.domainName,
    topic: q.topic,
    type: q.type,
    difficulty: q.difficulty,
    question: q.question,
    choices: q.choices.map(c => ({
      id: c.id,
      text: c.text,
      shape: c.shape
    }))
  };
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ==========================================
  // 1. Room Creation (Multi-Mode)
  // ==========================================
  socket.on('create-room', (settings = {}, callback) => {
    const pin = generatePin();
    const gameMode = settings.gameMode || 'CLASSIC'; // 'CLASSIC' | 'HOT_POTATO' | 'GRAND_PRIX'
    const timeLimit = typeof settings.timeLimit === 'number' ? settings.timeLimit : (gameMode === 'HOT_POTATO' ? 20 : 20);
    const questionCount = settings.questionCount || 10;
    const selectedDomain = settings.domain || 'all';

    let pool = [...questionBank];
    if (selectedDomain !== 'all') {
      pool = pool.filter(q => q.domain === parseInt(selectedDomain, 10));
    }
    const chosenQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, questionCount);

    const hostParticipates = Boolean(settings.hostParticipates);

    const room = {
      pin,
      hostSocketId: socket.id,
      gameMode,
      settings: {
        gameMode,
        timeLimit,
        questionCount: chosenQuestions.length,
        domain: selectedDomain,
        blunderPenalty: settings.blunderPenalty !== false, // for Hot Potato
        targetDistance: settings.targetDistance || 100,    // for Grand Prix
        hostParticipates
      },
      status: 'LOBBY',
      players: new Map(),
      questions: chosenQuestions,
      currentQuestionIndex: -1,
      timer: null,
      timeLeft: timeLimit,
      answersThisRound: new Map(),

      // Hot Potato State
      hotPotato: {
        hotSeatIndex: 0,
        hotSeatPlayer: null,
        delegates: [],
        action: null, // 'TAKE' | 'PASS'
        submissions: new Map(),
        jackpotPot: 0
      },

      // Grand Prix State
      grandPrix: {
        targetDistance: settings.targetDistance || 100,
        questionPool: pool,
        finishedCount: 0,
        podium: []
      },

      // High-Roller Gauntlet State
      highRoller: {
        currentQuestionIndex: 0,
        wagers: new Map(),
        submissions: new Map(),
        stage: 'HR_TEASER',
        underdogTriggered: false
      },

      // Flaw Finder State
      flawFinder: {
        currentScenarioIndex: 0,
        scenarios: (function() {
          let pool = [...policyFlawsBank];
          if (selectedDomain !== 'all') {
            const filtered = pool.filter(f => f.domain === parseInt(selectedDomain, 10));
            if (filtered.length > 0) pool = filtered;
          }
          return pool.sort(() => 0.5 - Math.random()).slice(0, Math.min(pool.length, questionCount || 5));
        })(),
        submissions: new Map(),
        stage: 'FF_SNIPING'
      }
    };

    if (hostParticipates) {
      const hostPlayer = {
        id: socket.id,
        nickname: (settings.hostNickname || 'Host (Player)').trim().slice(0, 18),
        avatar: settings.hostAvatar || '👑',
        score: 0,
        streak: 0,
        answers: {},
        chips: 1000,
        currentWager: 100,
        distance: 0,
        gear: 1,
        inPit: false,
        pitTimeLeft: 0,
        pitTimer: null,
        questionsAnswered: 0,
        answeredQuestionIds: [],
        currentQuestion: null,
        currentGear: 1,
        finished: false,
        finishRank: null
      };
      room.players.set(socket.id, hostPlayer);
      socket.data.isPlayer = true;
    }

    rooms.set(pin, room);
    socket.join(pin);
    socket.data.isHost = true;
    socket.data.roomPin = pin;

    console.log(`Room created: ${pin} (Mode: ${gameMode}, HostPlaying: ${hostParticipates}) by host ${socket.id}`);

    if (hostParticipates) {
      io.to(pin).emit('player-list-update', Array.from(room.players.values()));
    }

    if (callback) {
      callback({
        success: true,
        pin,
        gameMode,
        questionCount: chosenQuestions.length,
        settings: room.settings,
        players: Array.from(room.players.values())
      });
    }
  });

  // ==========================================
  // 2. Player Join
  // ==========================================
  socket.on('join-room', ({ pin, nickname, avatar, userPin }, callback) => {
    const cleanPin = (pin || '').trim().toUpperCase();
    const room = rooms.get(cleanPin);

    if (!room) {
      return callback && callback({ success: false, error: 'Room not found. Check the PIN code!' });
    }
    if (room.status !== 'LOBBY') {
      return callback && callback({ success: false, error: 'Game is already in progress!' });
    }

    const cleanNick = (nickname || 'Anonymous Player').trim().slice(0, 18);

    // Option B: Check Passcode verification if userPin provided
    if (userPin) {
      const authResult = gameStorage.registerOrVerifyUser({ nickname: cleanNick, pin: userPin, avatar });
      if (!authResult.success) {
        return callback && callback({ success: false, error: authResult.error });
      }
    }

    let finalNick = cleanNick;
    let count = 2;
    const existingNicks = Array.from(room.players.values()).map(p => p.nickname.toLowerCase());
    while (existingNicks.includes(finalNick.toLowerCase())) {
      finalNick = `${cleanNick} (${count++})`;
    }

    const player = {
      id: socket.id,
      nickname: finalNick,
      avatar: avatar || '🐱',
      score: 0,
      streak: 0,
      answers: {},
      chips: 1000,
      currentWager: 100,

      // Grand Prix properties
      distance: 0,
      gear: 1,
      inPit: false,
      pitTimeLeft: 0,
      pitTimer: null,
      questionsAnswered: 0,
      answeredQuestionIds: [],
      currentQuestion: null,
      currentGear: 1,
      finished: false,
      finishRank: null
    };

    room.players.set(socket.id, player);
    socket.join(cleanPin);
    socket.data.isPlayer = true;
    socket.data.roomPin = cleanPin;

    console.log(`Player ${finalNick} joined room ${cleanPin} (${room.gameMode})`);

    if (callback) {
      callback({
        success: true,
        player,
        gameMode: room.gameMode,
        roomSettings: room.settings
      });
    }

    // Broadcast updated player list
    io.to(cleanPin).emit('player-list-update', Array.from(room.players.values()));
  });

  // ==========================================
  // 3. Start Game (Routes based on Game Mode)
  // ==========================================
  socket.on('start-game', () => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    if (room.gameMode === 'HOT_POTATO') {
      room.currentQuestionIndex = 0;
      room.hotPotato.hotSeatIndex = 0;
      startHotPotatoRound(room);
    } else if (room.gameMode === 'GRAND_PRIX') {
      startGrandPrixRace(room);
    } else if (room.gameMode === 'HIGH_ROLLER') {
      room.currentQuestionIndex = 0;
      room.highRoller.currentQuestionIndex = 0;
      startHighRollerTeaser(room);
    } else if (room.gameMode === 'FLAW_FINDER') {
      room.currentQuestionIndex = 0;
      room.flawFinder.currentScenarioIndex = 0;
      startFlawFinderRound(room);
    } else {
      // Classic Mode
      room.currentQuestionIndex = 0;
      startQuestionRound(room);
    }
  });

  // ========================================================
  // ================= CLASSIC MODE ENGINE ==================
  // ========================================================

  function startQuestionRound(room) {
    if (room.timer) clearInterval(room.timer);

    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      finishGame(room);
      return;
    }

    room.status = 'QUESTION';
    room.answersThisRound.clear();
    room.timeLeft = room.settings.timeLimit;

    io.to(room.pin).emit('question-started', {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      question: sanitizeQuestionForPlayers(q),
      timeLimit: room.settings.timeLimit,
      answeredCount: 0,
      totalPlayers: room.players.size
    });

    if (room.settings.timeLimit > 0) {
      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          revealRoundResults(room);
        }
      }, 1000);
    }
  }

  socket.on('submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'QUESTION') {
      return callback && callback({ success: false, error: 'Not currently accepting answers' });
    }

    const player = room.players.get(socket.id);
    if (!player) return;
    if (room.answersThisRound.has(socket.id)) {
      return callback && callback({ success: false, error: 'Already answered this round!' });
    }

    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    let points = 0;
    if (isCorrect) {
      const timeLimit = room.settings.timeLimit || 20;
      const timeSpentRatio = timeLimit > 0 ? (timeLimit - room.timeLeft) / timeLimit : 0.5;
      const speedScore = Math.round(500 * (1 - (timeSpentRatio / 2)));
      const baseScore = 500;
      const streakBonus = Math.min(player.streak * 50, 250);
      points = baseScore + speedScore + streakBonus;

      player.streak += 1;
      player.score += points;
    } else {
      player.streak = 0;
      gameStorage.recordMissedQuestion({
        nickname: player.nickname,
        questionId: q.id,
        questionText: q.question,
        topic: q.topic,
        domain: q.domain,
        domainName: q.domainName,
        selectedChoiceId: choiceId,
        correctChoiceId: correctChoice ? correctChoice.id : null,
        explanation: q.explanation,
        funNote: q.funNote,
        cpaccRef: q.cpaccRef
      });
    }

    const answerRecord = {
      choiceId,
      isCorrect,
      points,
      streak: player.streak,
      timeRemaining: room.timeLeft
    };

    room.answersThisRound.set(socket.id, answerRecord);
    player.answers[q.id] = answerRecord;

    if (callback) {
      callback({ success: true, recorded: true });
    }

    io.to(room.pin).emit('answer-submitted-count', {
      answeredCount: room.answersThisRound.size,
      totalPlayers: room.players.size
    });

    if (room.answersThisRound.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      revealRoundResults(room);
    }
  });

  function revealRoundResults(room) {
    room.status = 'REVEAL';
    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);

    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    for (const ans of room.answersThisRound.values()) {
      if (distribution[ans.choiceId] !== undefined) {
        distribution[ans.choiceId] += 1;
      }
    }

    const rankedPlayers = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        streak: p.streak,
        rank: idx + 1,
        roundPoints: room.answersThisRound.get(p.id)?.points || 0,
        roundCorrect: room.answersThisRound.get(p.id)?.isCorrect || false,
        chosen: room.answersThisRound.get(p.id)?.choiceId || null
      }));

    io.to(room.pin).emit('round-revealed', {
      question: q,
      correctChoiceId: correctChoice ? correctChoice.id : null,
      distribution,
      leaderboard: rankedPlayers
    });
  }

  // ========================================================
  // ============== HOT POTATO SYNDICATE ENGINE =============
  // ========================================================

  function startHotPotatoRound(room) {
    if (room.timer) clearInterval(room.timer);

    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      finishGame(room);
      return;
    }

    const playerList = Array.from(room.players.values());
    if (playerList.length === 0) return;

    // Determine Hot Seat player
    const activePlayer = playerList[room.hotPotato.hotSeatIndex % playerList.length];
    room.hotPotato.hotSeatPlayer = activePlayer;
    room.hotPotato.delegates = [];
    room.hotPotato.action = null;
    room.hotPotato.submissions.clear();
    room.status = 'HP_TEASER';
    room.timeLeft = 20;

    // Emit Teaser
    io.to(room.pin).emit('hp-teaser', {
      roundIndex: room.currentQuestionIndex,
      totalRounds: room.questions.length,
      activePlayer: {
        id: activePlayer.id,
        nickname: activePlayer.nickname,
        avatar: activePlayer.avatar,
        score: activePlayer.score
      },
      conceptHeader: q.topic || q.domainName,
      domainName: q.domainName,
      baseValue: 100,
      decisionTimeLimit: 20,
      jackpotPot: room.hotPotato.jackpotPot
    });

    // Start 20s Teaser countdown
    room.timer = setInterval(() => {
      room.timeLeft -= 1;
      io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

      if (room.timeLeft <= 0) {
        clearInterval(room.timer);
        // Default to PASS if active player ran out of time
        handleHotPotatoAction(room, activePlayer.id, 'PASS');
      }
    }, 1000);
  }

  socket.on('hp-choose-action', ({ action }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'HP_TEASER') return;
    if (room.hotPotato.hotSeatPlayer?.id !== socket.id) {
      return callback && callback({ success: false, error: 'Only the active player can choose Take or Pass!' });
    }

    if (room.timer) clearInterval(room.timer);
    handleHotPotatoAction(room, socket.id, action);
    if (callback) callback({ success: true, action });
  });

  function handleHotPotatoAction(room, activePlayerId, action) {
    room.hotPotato.action = action;
    const q = room.questions[room.currentQuestionIndex];

    if (action === 'TAKE') {
      // Active player answers alone
      room.status = 'HP_SOLO';
      room.timeLeft = 30;

      io.to(room.pin).emit('hp-solo-started', {
        activePlayerId,
        question: sanitizeQuestionForPlayers(q),
        timeLimit: 30
      });

      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });
        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          settleHotPotatoRound(room);
        }
      }, 1000);
    } else {
      // PASS: Draft two delegates from other players
      room.status = 'HP_DELEGATES';
      room.timeLeft = 45;

      const candidates = Array.from(room.players.values()).filter(p => p.id !== activePlayerId);
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      const delegateA = shuffled[0] || room.hotPotato.hotSeatPlayer;
      const delegateB = shuffled[1] || null;

      room.hotPotato.delegates = [delegateA, delegateB].filter(Boolean);

      io.to(room.pin).emit('hp-delegates-drafted', {
        delegateA: { id: delegateA.id, nickname: delegateA.nickname, avatar: delegateA.avatar },
        delegateB: delegateB ? { id: delegateB.id, nickname: delegateB.nickname, avatar: delegateB.avatar } : null,
        question: sanitizeQuestionForPlayers(q),
        timeLimit: 45
      });

      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });
        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          settleHotPotatoRound(room);
        }
      }, 1000);
    }
  }

  socket.on('hp-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || (room.status !== 'HP_SOLO' && room.status !== 'HP_DELEGATES')) {
      return callback && callback({ success: false, error: 'Not currently accepting Hot Potato answers!' });
    }

    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    if (room.status === 'HP_SOLO') {
      if (socket.id !== room.hotPotato.hotSeatPlayer.id) {
        return callback && callback({ success: false, error: 'Only the active player can answer in Solo mode.' });
      }
      room.hotPotato.submissions.set(socket.id, { choiceId, isCorrect, submittedAt: room.timeLeft });
      if (callback) callback({ success: true });
      if (room.timer) clearInterval(room.timer);
      settleHotPotatoRound(room);
    } else if (room.status === 'HP_DELEGATES') {
      const isDelegate = room.hotPotato.delegates.some(d => d.id === socket.id);
      if (!isDelegate) {
        return callback && callback({ success: false, error: 'Only drafted delegates can answer this question!' });
      }

      room.hotPotato.submissions.set(socket.id, { choiceId, isCorrect, submittedAt: room.timeLeft });
      if (callback) callback({ success: true });

      // If all delegates submitted, settle immediately
      if (room.hotPotato.submissions.size >= room.hotPotato.delegates.length) {
        if (room.timer) clearInterval(room.timer);
        settleHotPotatoRound(room);
      }
    }
  });

  function settleHotPotatoRound(room) {
    room.status = 'HP_SETTLEMENT';
    const q = room.questions[room.currentQuestionIndex];
    const action = room.hotPotato.action;
    const activePlayer = room.players.get(room.hotPotato.hotSeatPlayer.id);
    const delegates = room.hotPotato.delegates.map(d => room.players.get(d.id)).filter(Boolean);
    const pointDeltas = {};
    const submissions = {};

    for (const [id, sub] of room.hotPotato.submissions.entries()) {
      submissions[id] = sub;
    }

    let outcomeType = '';
    let dividendPerSpectator = 0;

    if (action === 'TAKE') {
      const sub = room.hotPotato.submissions.get(activePlayer.id);
      const isCorrect = sub && sub.isCorrect;
      if (isCorrect) {
        outcomeType = 'SOLO_CORRECT';
        pointDeltas[activePlayer.id] = 100;
        activePlayer.score += 100;
      } else {
        outcomeType = 'SOLO_WRONG';
        const penalty = room.settings.blunderPenalty ? -50 : 0;
        pointDeltas[activePlayer.id] = penalty;
        activePlayer.score = Math.max(0, activePlayer.score + penalty);
      }
    } else {
      // PASS: Evaluate delegates
      const correctDelegates = delegates.filter(d => room.hotPotato.submissions.get(d.id)?.isCorrect);
      const correctCount = correctDelegates.length;

      if (correctCount >= 2 || (delegates.length === 1 && correctCount === 1)) {
        // Both Correct (Best Case for Active Player)
        outcomeType = 'BOTH_CORRECT';
        pointDeltas[activePlayer.id] = 100;
        activePlayer.score += 100;
        delegates.forEach(d => {
          pointDeltas[d.id] = 50;
          d.score += 50;
        });
      } else if (correctCount === 1 && delegates.length > 1) {
        // Only 1 Correct (Muddled)
        outcomeType = 'ONE_CORRECT';
        pointDeltas[activePlayer.id] = 50;
        activePlayer.score += 50;
        delegates.forEach(d => {
          const correct = room.hotPotato.submissions.get(d.id)?.isCorrect;
          pointDeltas[d.id] = correct ? 50 : 0;
          if (correct) d.score += 50;
        });
      } else {
        // Neither Correct (TOTAL BACKFIRE -> SOCIAL DIVIDEND!)
        outcomeType = 'NEITHER_CORRECT';
        const blunderFee = room.settings.blunderPenalty ? -20 : 0;
        pointDeltas[activePlayer.id] = blunderFee;
        activePlayer.score = Math.max(0, activePlayer.score + blunderFee);

        delegates.forEach(d => {
          pointDeltas[d.id] = 0;
        });

        // Dividend Payout to Spectators
        const activeAndDelIds = new Set([activePlayer.id, ...delegates.map(d => d.id)]);
        const spectators = Array.from(room.players.values()).filter(p => !activeAndDelIds.has(p.id));

        if (spectators.length > 0) {
          const totalPot = 100 + room.hotPotato.jackpotPot;
          dividendPerSpectator = Math.floor(totalPot / spectators.length);
          spectators.forEach(s => {
            pointDeltas[s.id] = dividendPerSpectator;
            s.score += dividendPerSpectator;
          });
          room.hotPotato.jackpotPot = 0; // cleared pot
        } else {
          // No spectators (room too small): Rollover 100 to jackpot pot
          room.hotPotato.jackpotPot += 100;
        }
      }
    }

    const rankedPlayers = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        rank: idx + 1,
        delta: pointDeltas[p.id] || 0
      }));

    io.to(room.pin).emit('hp-round-settlement', {
      question: q,
      actionTaken: action,
      activePlayer: { id: activePlayer.id, nickname: activePlayer.nickname, avatar: activePlayer.avatar },
      delegates: delegates.map(d => ({ id: d.id, nickname: d.nickname, avatar: d.avatar })),
      submissions,
      outcomeType,
      pointDeltas,
      dividendPerSpectator,
      jackpotPot: room.hotPotato.jackpotPot,
      leaderboard: rankedPlayers
    });
  }

  // ========================================================
  // ============ GRAND PRIX: APEX GAMBLER ENGINE ===========
  // ========================================================

  function startGrandPrixRace(room) {
    room.status = 'GP_RACING';
    room.grandPrix.finishedCount = 0;
    room.grandPrix.podium = [];

    // Reset player distances and stats
    for (const p of room.players.values()) {
      p.distance = 0;
      p.gear = 1;
      p.streak = 0;
      p.inPit = false;
      p.pitTimeLeft = 0;
      if (p.pitTimer) clearInterval(p.pitTimer);
      p.questionsAnswered = 0;
      p.answeredQuestionIds = [];
      p.currentQuestion = null;
      p.finished = false;
      p.finishRank = null;
    }

    io.to(room.pin).emit('gp-race-started', {
      targetDistance: room.settings.targetDistance || 100,
      totalQuestions: room.settings.questionCount || 10,
      hazards: [
        { atMeter: 25, type: 'HAIRPIN', name: 'Hairpin Turn', rule: '3rd Gear Locked' },
        { atMeter: 50, type: 'SLIPSTREAM', name: 'Slipstream Zone', rule: '1.5x Reward within 15m of leader' },
        { atMeter: 80, type: 'FINAL_STRETCH', name: 'Final Straightaway', rule: 'Pit Stop Disabled' }
      ]
    });

    broadcastGrandPrixTelemetry(room, '🚦 The green flag has dropped! Choose your starting Gear!');
  }

  socket.on('gp-select-gear', ({ gear }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'GP_RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished) return;

    if (player.inPit) {
      return callback && callback({ success: false, error: `In Pit Stop! Wait ${player.pitTimeLeft}s` });
    }

    // Check Hairpin Turn (Meter 25 to 35): 3rd Gear is locked
    if (player.distance >= 25 && player.distance < 35 && gear === 3) {
      return callback && callback({ success: false, error: '⚠️ Hairpin Turn! 3rd Gear is locked out (Max 2nd Gear).' });
    }

    const gearNum = Math.min(3, Math.max(1, parseInt(gear, 10) || 1));
    const difficultyTarget = gearNum === 1 ? 'easy' : gearNum === 2 ? 'medium' : 'hard';

    // Find question matching difficulty not yet answered by this player
    let candidateQuestions = room.grandPrix.questionPool.filter(
      q => q.difficulty === difficultyTarget && !player.answeredQuestionIds.includes(q.id)
    );

    // Fallback if difficulty exhausted
    if (candidateQuestions.length === 0) {
      candidateQuestions = room.grandPrix.questionPool.filter(
        q => !player.answeredQuestionIds.includes(q.id)
      );
    }
    // Loop over if all exhausted
    if (candidateQuestions.length === 0) {
      candidateQuestions = room.grandPrix.questionPool;
    }

    const chosenQuestion = candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)];
    player.currentQuestion = chosenQuestion;
    player.currentGear = gearNum;

    if (callback) {
      callback({ success: true, gear: gearNum });
    }

    socket.emit('gp-question-served', {
      question: sanitizeQuestionForPlayers(chosenQuestion),
      gear: gearNum,
      timeLimit: 60,
      allowPitStop: player.distance < 80 // Meter 80+ disables Pit Stop
    });
  });

  socket.on('gp-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'GP_RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished || !player.currentQuestion) return;

    const q = player.currentQuestion;
    const correctChoice = q.choices.find(c => c.isCorrect);
    const isCorrect = correctChoice && correctChoice.id === choiceId;

    // Gear distance matrix:
    // Gear 1: +10 / -10
    // Gear 2: +25 / -25
    // Gear 3: +50 / -50
    const baseReward = player.currentGear === 1 ? 10 : player.currentGear === 2 ? 25 : 50;
    let delta = isCorrect ? baseReward : -baseReward;

    // Slipstream Bonus: at Meter 50+, if within 15m of leader
    const currentLeaderDist = Math.max(...Array.from(room.players.values()).map(p => p.distance));
    let slipstreamTriggered = false;
    if (isCorrect && player.distance >= 50 && (currentLeaderDist - player.distance <= 15) && (currentLeaderDist - player.distance > 0)) {
      delta = Math.round(delta * 1.5);
      slipstreamTriggered = true;
    }

    // Drift Streak: 3 consecutive correct = +10m Drafting Boost
    let driftTriggered = false;
    if (isCorrect) {
      player.streak += 1;
      if (player.streak % 3 === 0) {
        delta += 10;
        driftTriggered = true;
      }
    } else {
      player.streak = 0;
      gameStorage.recordMissedQuestion({
        nickname: player.nickname,
        questionId: q.id,
        questionText: q.question,
        topic: q.topic,
        domain: q.domain,
        domainName: q.domainName,
        selectedChoiceId: choiceId,
        correctChoiceId: correctChoice ? correctChoice.id : null,
        explanation: q.explanation,
        funNote: q.funNote,
        cpaccRef: q.cpaccRef
      });
    }

    player.distance = Math.max(0, player.distance + delta);
    player.questionsAnswered += 1;
    player.answeredQuestionIds.push(q.id);
    player.currentQuestion = null;

    // Build ticker commentary
    let commentary = '';
    if (isCorrect) {
      commentary = `🏎️ ${player.nickname} hit ${player.currentGear}st/nd/rd Gear (+${delta}m)!`;
      if (slipstreamTriggered) commentary += ` 🌪️ Slipstream boost applied!`;
      if (driftTriggered) commentary += ` ⚡ +10m Drift streak boost!`;
    } else {
      commentary = `💥 ${player.nickname} spun out in Gear ${player.currentGear} (${delta}m)!`;
    }

    // Check race completion for this player
    const targetDist = room.settings.targetDistance || 100;
    const maxQ = room.settings.questionCount || 10;
    if (player.distance >= targetDist || player.questionsAnswered >= maxQ) {
      player.finished = true;
      room.grandPrix.finishedCount += 1;
      player.finishRank = room.grandPrix.finishedCount;
      room.grandPrix.podium.push({
        id: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        distance: player.distance,
        rank: player.finishRank
      });
      commentary = `🏁 ${player.nickname} crossed the finish line in P${player.finishRank}!`;
    }

    if (callback) {
      callback({
        success: true,
        isCorrect,
        delta,
        newDistance: player.distance,
        streak: player.streak,
        explanation: q.explanation,
        funNote: q.funNote,
        correctChoiceId: correctChoice.id,
        finished: player.finished
      });
    }

    broadcastGrandPrixTelemetry(room, commentary);

    // If all players finished or top 3 finished in larger rooms
    if (room.grandPrix.finishedCount >= room.players.size && room.players.size > 0) {
      finishGrandPrixRace(room);
    }
  });

  socket.on('gp-pit-stop', (data, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.status !== 'GP_RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished) return;

    if (player.distance >= 80) {
      return callback && callback({ success: false, error: 'Pit Lane is closed on the Final Straightaway (80m+)!' });
    }

    // Freeze times: Gear 1 = 5s, Gear 2 = 10s, Gear 3 = 20s
    const freezeTime = player.currentGear === 1 ? 5 : player.currentGear === 2 ? 10 : 20;
    player.inPit = true;
    player.pitTimeLeft = freezeTime;
    player.currentQuestion = null;

    if (player.pitTimer) clearInterval(player.pitTimer);
    player.pitTimer = setInterval(() => {
      player.pitTimeLeft -= 1;
      socket.emit('gp-pit-tick', { pitTimeLeft: player.pitTimeLeft });

      if (player.pitTimeLeft <= 0) {
        clearInterval(player.pitTimer);
        player.inPit = false;
        player.pitTimer = null;
        socket.emit('gp-pit-complete');
        broadcastGrandPrixTelemetry(room, `🔧 ${player.nickname} exited the Pit Lane and is back on track!`);
      }
    }, 1000);

    if (callback) {
      callback({ success: true, freezeTime });
    }

    broadcastGrandPrixTelemetry(room, `🔧 ${player.nickname} pulled into the Pit Lane (Frozen for ${freezeTime}s)!`);
  });

  function broadcastGrandPrixTelemetry(room, commentary = '') {
    const playersList = Array.from(room.players.values())
      .sort((a, b) => b.distance - a.distance)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        distance: p.distance,
        rank: idx + 1,
        gear: p.currentGear,
        streak: p.streak,
        inPit: p.inPit,
        pitTimeLeft: p.pitTimeLeft,
        finished: p.finished,
        questionsAnswered: p.questionsAnswered
      }));

    io.to(room.pin).emit('gp-telemetry-update', {
      players: playersList,
      raceLeaderId: playersList[0]?.id || null,
      commentary,
      allFinished: room.grandPrix.finishedCount >= room.players.size
    });
  }

  function finishGrandPrixRace(room) {
    room.status = 'GP_PODIUM';
    const ranked = Array.from(room.players.values())
      .sort((a, b) => {
        if (a.finishRank && b.finishRank) return a.finishRank - b.finishRank;
        if (a.finishRank) return -1;
        if (b.finishRank) return 1;
        return b.distance - a.distance;
      })
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        distance: p.distance,
        rank: idx + 1,
        questionsAnswered: p.questionsAnswered
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.settings.questionCount || 10
    });

    io.to(room.pin).emit('gp-race-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ========================================================
  // ============= HIGH-ROLLER GAUNTLET ENGINE ==============
  // ========================================================

  function startHighRollerTeaser(room) {
    if (room.timer) clearInterval(room.timer);

    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      finishHighRollerGame(room);
      return;
    }

    room.status = 'HR_TEASER';
    room.highRoller.wagers.clear();
    room.highRoller.submissions.clear();
    room.highRoller.underdogTriggered = false;
    room.timeLeft = 15;

    // Ensure players have at least 100 chips to wager
    room.players.forEach(p => {
      if (typeof p.chips !== 'number' || p.chips <= 0) {
        p.chips = 1000;
      }
      p.currentWager = Math.min(p.chips, 100);
    });

    const teaserData = {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      domain: q.domain,
      domainName: q.domainName,
      topic: q.topic || 'Accessibility Concept',
      difficulty: q.difficulty || 'medium',
      timeLimit: 15,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        chips: p.chips
      }))
    };

    io.to(room.pin).emit('hr-teaser', teaserData);

    room.timer = setInterval(() => {
      room.timeLeft -= 1;
      io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

      if (room.timeLeft <= 0) {
        clearInterval(room.timer);
        revealHighRollerQuestion(room);
      }
    }, 1000);
  }

  socket.on('hr-submit-wager', ({ wager }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'HIGH_ROLLER' || room.status !== 'HR_TEASER') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const maxBet = player.chips || 1000;
    const bet = Math.max(10, Math.min(maxBet, parseInt(wager, 10) || 100));
    player.currentWager = bet;
    room.highRoller.wagers.set(socket.id, bet);

    if (callback) callback({ success: true, wager: bet, remainingChips: player.chips });

    io.to(room.pin).emit('hr-wager-update', {
      playerId: socket.id,
      wagerSubmitted: true,
      totalWagersPlaced: room.highRoller.wagers.size,
      totalPlayers: room.players.size
    });

    // If all players wagered, advance immediately without waiting out the teaser clock
    if (room.highRoller.wagers.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      revealHighRollerQuestion(room);
    }
  });

  function revealHighRollerQuestion(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'HR_QUESTION';

    // Auto-fill default wager for any player who didn't submit
    room.players.forEach(p => {
      if (!room.highRoller.wagers.has(p.id)) {
        const fallbackBet = Math.min(p.chips, 100);
        p.currentWager = fallbackBet;
        room.highRoller.wagers.set(p.id, fallbackBet);
      }
    });

    const q = room.questions[room.currentQuestionIndex];
    const timeLimit = room.settings.timeLimit > 0 ? room.settings.timeLimit : 30;
    room.timeLeft = timeLimit;

    io.to(room.pin).emit('hr-question-started', {
      questionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      question: sanitizeQuestionForPlayers(q),
      timeLimit,
      totalPlayers: room.players.size,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        chips: p.chips,
        wager: room.highRoller.wagers.get(p.id)
      }))
    });

    if (timeLimit > 0) {
      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          settleHighRollerRound(room);
        }
      }, 1000);
    }
  }

  socket.on('hr-submit-answer', ({ choiceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'HIGH_ROLLER' || room.status !== 'HR_QUESTION') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const q = room.questions[room.currentQuestionIndex];
    const choice = q.choices.find(c => c.id === choiceId);
    const isCorrect = choice ? choice.isCorrect : false;

    room.highRoller.submissions.set(socket.id, {
      choiceId,
      isCorrect,
      submittedAt: Date.now()
    });

    if (callback) callback({ success: true, choiceId });

    io.to(room.pin).emit('answer-submitted-count', {
      answeredCount: room.highRoller.submissions.size,
      totalPlayers: room.players.size
    });

    if (room.highRoller.submissions.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      settleHighRollerRound(room);
    }
  });

  function settleHighRollerRound(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'HR_REVEAL';

    const q = room.questions[room.currentQuestionIndex];
    const correctChoice = q.choices.find(c => c.isCorrect);

    // Distribution
    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    room.highRoller.submissions.forEach(sub => {
      if (distribution[sub.choiceId] !== undefined) {
        distribution[sub.choiceId] += 1;
      }
    });

    // Trap Card Underdog Multiplier:
    // If >= 50% of the room chose a wrong distractor option
    const totalSubs = room.highRoller.submissions.size;
    const correctSubs = Array.from(room.highRoller.submissions.values()).filter(s => s.isCorrect).length;
    const wrongSubs = totalSubs - correctSubs;

    const underdogTriggered = (totalSubs >= 2 && (wrongSubs / totalSubs) >= 0.50);
    room.highRoller.underdogTriggered = underdogTriggered;

    const results = [];
    room.players.forEach(p => {
      const wager = room.highRoller.wagers.get(p.id) || 100;
      const sub = room.highRoller.submissions.get(p.id);
      const isCorrect = sub ? sub.isCorrect : false;

      let chipDelta = 0;
      let bailoutAwarded = false;

      if (isCorrect) {
        chipDelta = underdogTriggered ? Math.round(wager * 1.5) : wager;
        p.chips += chipDelta;
        p.score = p.chips;
      } else {
        chipDelta = -wager;
        p.chips = Math.max(0, p.chips - wager);
        if (p.chips <= 0) {
          p.chips = 100; // Bailout safety loan
          bailoutAwarded = true;
        }
        p.score = p.chips;

        // Log missed question
        gameStorage.recordMissedQuestion({
          nickname: p.nickname,
          questionId: q.id,
          questionText: q.question,
          topic: q.topic,
          domain: q.domain,
          domainName: q.domainName,
          selectedChoiceId: sub ? sub.choiceId : 'NONE',
          correctChoiceId: correctChoice?.id,
          explanation: q.explanation,
          funNote: q.funNote,
          cpaccRef: q.cpaccRef
        });
      }

      results.push({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        wager,
        isCorrect,
        choiceId: sub?.choiceId || null,
        chipDelta,
        chips: p.chips,
        bailoutAwarded
      });
    });

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.chips - a.chips)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        chips: p.chips,
        score: p.chips,
        rank: idx + 1
      }));

    io.to(room.pin).emit('hr-round-settlement', {
      question: q,
      correctChoiceId: correctChoice?.id,
      underdogTriggered,
      distribution,
      results,
      leaderboard: ranked,
      isLastQuestion: room.currentQuestionIndex >= room.questions.length - 1
    });
  }

  function finishHighRollerGame(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'HR_PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.chips - a.chips)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.chips,
        chips: p.chips,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.questions.length
    });

    io.to(room.pin).emit('hr-game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ========================================================
  // ============== FLAW FINDER ENGINE (HEATMAP) ============
  // ========================================================

  function startFlawFinderRound(room) {
    if (room.timer) clearInterval(room.timer);

    const s = room.flawFinder.scenarios[room.flawFinder.currentScenarioIndex];
    if (!s) {
      finishFlawFinderGame(room);
      return;
    }

    room.status = 'FF_SNIPING';
    room.flawFinder.stage = 'FF_SNIPING';
    room.flawFinder.submissions.clear();
    const timeLimit = room.settings.timeLimit > 0 ? room.settings.timeLimit : 30;
    room.timeLeft = timeLimit;

    // Sanitize scenario to hide isFlaw & explanation
    const sanitized = {
      id: s.id,
      title: s.title,
      domain: s.domain,
      domainName: s.domainName,
      topic: s.topic,
      context: s.context,
      sentences: s.sentences.map(sent => ({
        id: sent.id,
        text: sent.text
      }))
    };

    io.to(room.pin).emit('ff-round-started', {
      scenarioIndex: room.flawFinder.currentScenarioIndex,
      totalScenarios: room.flawFinder.scenarios.length,
      scenario: sanitized,
      timeLimit,
      totalPlayers: room.players.size,
      snipesLocked: 0
    });

    if (timeLimit > 0) {
      room.timer = setInterval(() => {
        room.timeLeft -= 1;
        io.to(room.pin).emit('timer-tick', { timeLeft: room.timeLeft });

        if (room.timeLeft <= 0) {
          clearInterval(room.timer);
          revealFlawFinderHeatmap(room);
        }
      }, 1000);
    }
  }

  socket.on('ff-submit-snipe', ({ sentenceId }, callback) => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.gameMode !== 'FLAW_FINDER' || room.status !== 'FF_SNIPING') return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const s = room.flawFinder.scenarios[room.flawFinder.currentScenarioIndex];
    if (!s) return;

    const targetSentence = s.sentences.find(sent => sent.id === sentenceId);
    if (!targetSentence) {
      return callback && callback({ success: false, error: 'Invalid sentence ID' });
    }

    const isFlaw = !!targetSentence.isFlaw;
    room.flawFinder.submissions.set(socket.id, {
      sentenceId,
      isFlaw,
      timeRemaining: room.timeLeft
    });

    if (callback) {
      callback({ success: true, sentenceId, isFlaw });
    }

    io.to(room.pin).emit('ff-snipe-count', {
      snipesLocked: room.flawFinder.submissions.size,
      totalPlayers: room.players.size
    });

    // Advance when all players locked in
    if (room.flawFinder.submissions.size >= room.players.size && room.players.size > 0) {
      if (room.timer) clearInterval(room.timer);
      revealFlawFinderHeatmap(room);
    }
  });

  function revealFlawFinderHeatmap(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'FF_HEATMAP';
    room.flawFinder.stage = 'FF_HEATMAP';

    const s = room.flawFinder.scenarios[room.flawFinder.currentScenarioIndex];
    const totalSubmissions = room.flawFinder.submissions.size;
    const correctCount = Array.from(room.flawFinder.submissions.values()).filter(sub => sub.isFlaw).length;

    // Deadshot Bonus: if <= 40% of the room correctly spotted the flaw (and room has >= 2 players)
    const deadshotTriggered = totalSubmissions >= 2 && (correctCount / totalSubmissions) <= 0.40;

    // Compute sentence heatmap votes and percentages
    const sentenceVotes = {};
    s.sentences.forEach(sent => {
      sentenceVotes[sent.id] = 0;
    });
    room.flawFinder.submissions.forEach(sub => {
      if (sentenceVotes[sub.sentenceId] !== undefined) {
        sentenceVotes[sub.sentenceId] += 1;
      }
    });

    const heatmap = s.sentences.map(sent => {
      const votes = sentenceVotes[sent.id] || 0;
      const percentage = totalSubmissions > 0 ? Math.round((votes / totalSubmissions) * 100) : 0;
      return {
        id: sent.id,
        text: sent.text,
        isFlaw: sent.isFlaw,
        explanation: sent.explanation,
        votes,
        percentage
      };
    });

    // Settle points and record missed questions
    const results = [];
    room.players.forEach(p => {
      const sub = room.flawFinder.submissions.get(p.id);
      const isCorrect = sub ? sub.isFlaw : false;
      const targetedId = sub ? sub.sentenceId : null;

      let roundPoints = 0;
      if (isCorrect) {
        roundPoints = deadshotTriggered ? 300 : 200;
        p.score += roundPoints;
        p.streak += 1;
      } else {
        p.streak = 0;
        // Log missed question / scenario
        const flawSentence = s.sentences.find(sent => sent.isFlaw);
        gameStorage.recordMissedQuestion({
          nickname: p.nickname,
          questionId: `${s.id}-${s.domain}`,
          questionText: s.title + ': ' + s.context,
          topic: s.topic,
          domain: s.domain,
          domainName: s.domainName,
          selectedChoiceId: targetedId || 'TIMEOUT',
          correctChoiceId: flawSentence?.id,
          explanation: s.flawSummary,
          funNote: `Targeted Sentence: "${s.sentences.find(sent => sent.id === targetedId)?.text.slice(0, 50) || 'None'}..."`,
          cpaccRef: s.cpaccRef
        });
      }

      results.push({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        targetedId,
        isCorrect,
        roundPoints,
        totalScore: p.score,
        deadshotAwarded: isCorrect && deadshotTriggered
      });
    });

    const rankedPlayers = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        streak: p.streak,
        rank: idx + 1
      }));

    io.to(room.pin).emit('ff-heatmap-reveal', {
      scenario: s,
      flawedSentenceId: s.sentences.find(sent => sent.isFlaw)?.id,
      heatmap,
      deadshotTriggered,
      results,
      leaderboard: rankedPlayers,
      isLastScenario: room.flawFinder.currentScenarioIndex >= room.flawFinder.scenarios.length - 1
    });
  }

  function finishFlawFinderGame(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'FF_PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.flawFinder.scenarios.length
    });

    io.to(room.pin).emit('ff-game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ==========================================
  // 4. Host Advance / Next Stage
  // ==========================================
  socket.on('next-stage', () => {
    const pin = socket.data.roomPin;
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    if (room.gameMode === 'HOT_POTATO') {
      if (room.status === 'HP_SETTLEMENT') {
        room.currentQuestionIndex += 1;
        room.hotPotato.hotSeatIndex += 1;
        if (room.currentQuestionIndex >= room.questions.length) {
          finishGame(room);
        } else {
          startHotPotatoRound(room);
        }
      }
    } else if (room.gameMode === 'HIGH_ROLLER') {
      if (room.status === 'HR_TEASER') {
        revealHighRollerQuestion(room);
      } else if (room.status === 'HR_REVEAL') {
        room.currentQuestionIndex += 1;
        if (room.currentQuestionIndex >= room.questions.length) {
          finishHighRollerGame(room);
        } else {
          startHighRollerTeaser(room);
        }
      }
    } else if (room.gameMode === 'FLAW_FINDER') {
      if (room.status === 'FF_SNIPING') {
        revealFlawFinderHeatmap(room);
      } else if (room.status === 'FF_HEATMAP') {
        room.flawFinder.currentScenarioIndex += 1;
        if (room.flawFinder.currentScenarioIndex >= room.flawFinder.scenarios.length) {
          finishFlawFinderGame(room);
        } else {
          startFlawFinderRound(room);
        }
      }
    } else if (room.gameMode === 'CLASSIC') {
      if (room.status === 'REVEAL') {
        room.status = 'LEADERBOARD';
        const ranked = Array.from(room.players.values())
          .sort((a, b) => b.score - a.score)
          .map((p, idx) => ({
            id: p.id,
            nickname: p.nickname,
            avatar: p.avatar,
            score: p.score,
            streak: p.streak,
            rank: idx + 1
          }));

        io.to(room.pin).emit('show-leaderboard', {
          leaderboard: ranked,
          isLastQuestion: room.currentQuestionIndex >= room.questions.length - 1
        });
      } else if (room.status === 'LEADERBOARD') {
        room.currentQuestionIndex += 1;
        if (room.currentQuestionIndex >= room.questions.length) {
          finishGame(room);
        } else {
          startQuestionRound(room);
        }
      }
    }
  });

  function finishGame(room) {
    if (room.timer) clearInterval(room.timer);
    room.status = 'PODIUM';

    const ranked = Array.from(room.players.values())
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
        streak: p.streak,
        rank: idx + 1
      }));

    gameStorage.recordGame({
      roomPin: room.pin,
      gameMode: room.gameMode,
      players: ranked,
      questionsCount: room.questions?.length || (room.settings.questionCount || 10)
    });

    io.to(room.pin).emit('game-finished', {
      podium: ranked.slice(0, 3),
      allPlayers: ranked
    });
  }

  // ==========================================
  // 5. Disconnect Cleanup
  // ==========================================
  socket.on('disconnect', () => {
    const pin = socket.data.roomPin;
    if (!pin) return;
    const room = rooms.get(pin);
    if (!room) return;

    if (socket.data.isHost) {
      console.log(`Host disconnected from room ${pin}`);
      io.to(pin).emit('host-disconnected');
      if (room.timer) clearInterval(room.timer);
      for (const p of room.players.values()) {
        if (p.pitTimer) clearInterval(p.pitTimer);
      }
      rooms.delete(pin);
    } else if (socket.data.isPlayer) {
      console.log(`Player ${socket.id} left room ${pin}`);
      const player = room.players.get(socket.id);
      if (player && player.pitTimer) clearInterval(player.pitTimer);

      room.players.delete(socket.id);
      room.answersThisRound.delete(socket.id);
      io.to(pin).emit('player-list-update', Array.from(room.players.values()));

      if (room.gameMode === 'CLASSIC' && room.status === 'QUESTION') {
        if (room.answersThisRound.size >= room.players.size && room.players.size > 0) {
          if (room.timer) clearInterval(room.timer);
          revealRoundResults(room);
        }
      } else if (room.gameMode === 'GRAND_PRIX' && room.status === 'GP_RACING') {
        broadcastGrandPrixTelemetry(room, `Player left the race.`);
      }
    }
  });
});

// Serve client dist in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎮 A11y Arcade Server running on port ${PORT}`);
});
