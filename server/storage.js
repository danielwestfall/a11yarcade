import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'game_history.json');

// Ensure database file exists
function loadData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { games: [], weeklyLeaderboard: {}, allTimeLeaderboard: {}, missedQuestionsLog: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading game history DB:', err);
    return { games: [], weeklyLeaderboard: {}, allTimeLeaderboard: {}, missedQuestionsLog: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving game history DB:', err);
  }
}

// Get ISO Week string like "2026-W42"
function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export const gameStorage = {
  // Record a completed game
  recordGame({ roomPin, gameMode, players, questionsCount }) {
    const db = loadData();
    const timestamp = new Date().toISOString();
    const weekKey = getWeekKey(new Date());

    const gameEntry = {
      id: `${Date.now()}-${roomPin}`,
      timestamp,
      weekKey,
      gameMode,
      questionsCount,
      players: players.map(p => ({
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score || 0,
        distance: p.distance || 0,
        rank: p.rank || 1
      }))
    };

    db.games.push(gameEntry);
    if (db.games.length > 500) {
      db.games = db.games.slice(-500); // keep last 500 games
    }

    // Update Weekly & All-Time Leaderboard
    if (!db.weeklyLeaderboard[weekKey]) {
      db.weeklyLeaderboard[weekKey] = {};
    }

    players.forEach(p => {
      const nick = p.nickname.trim();
      const score = p.score || p.distance || 0;

      // Weekly
      if (!db.weeklyLeaderboard[weekKey][nick]) {
        db.weeklyLeaderboard[weekKey][nick] = {
          nickname: nick,
          avatar: p.avatar,
          totalScore: 0,
          gamesPlayed: 0,
          wins: 0,
          bestScore: 0
        };
      }
      const wRecord = db.weeklyLeaderboard[weekKey][nick];
      wRecord.totalScore += score;
      wRecord.gamesPlayed += 1;
      wRecord.bestScore = Math.max(wRecord.bestScore, score);
      if (p.rank === 1) wRecord.wins += 1;

      // All-time
      if (!db.allTimeLeaderboard[nick]) {
        db.allTimeLeaderboard[nick] = {
          nickname: nick,
          avatar: p.avatar,
          totalScore: 0,
          gamesPlayed: 0,
          wins: 0,
          bestScore: 0
        };
      }
      const aRecord = db.allTimeLeaderboard[nick];
      aRecord.totalScore += score;
      aRecord.gamesPlayed += 1;
      aRecord.bestScore = Math.max(aRecord.bestScore, score);
      if (p.rank === 1) aRecord.wins += 1;
    });

    saveData(db);
    return gameEntry;
  },

  // Record a missed question for study review
  recordMissedQuestion({ nickname, questionId, questionText, topic, domain, domainName, selectedChoiceId, correctChoiceId, explanation, funNote, cpaccRef }) {
    const db = loadData();
    const entry = {
      timestamp: new Date().toISOString(),
      nickname: (nickname || 'Anonymous').trim(),
      questionId,
      questionText,
      topic,
      domain,
      domainName,
      selectedChoiceId,
      correctChoiceId,
      explanation,
      funNote,
      cpaccRef
    };

    db.missedQuestionsLog.push(entry);
    if (db.missedQuestionsLog.length > 1000) {
      db.missedQuestionsLog = db.missedQuestionsLog.slice(-1000);
    }
    saveData(db);
  },

  // Retrieve Weekly Leaderboard
  getWeeklyLeaderboard(weekKey = getWeekKey()) {
    const db = loadData();
    const records = db.weeklyLeaderboard[weekKey] || {};
    return Object.values(records)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((r, idx) => ({ ...r, rank: idx + 1 }));
  },

  // Retrieve All-Time Leaderboard
  getAllTimeLeaderboard() {
    const db = loadData();
    return Object.values(db.allTimeLeaderboard || {})
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((r, idx) => ({ ...r, rank: idx + 1 }));
  },

  // Retrieve missed questions for a specific player (or all)
  getMissedQuestions(nickname) {
    const db = loadData();
    if (!nickname || nickname === 'all') {
      return db.missedQuestionsLog.slice(-50);
    }
    const clean = nickname.trim().toLowerCase();
    return db.missedQuestionsLog
      .filter(m => m.nickname.toLowerCase() === clean)
      .slice(-50);
  }
};
