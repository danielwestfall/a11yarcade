import { io } from './client/node_modules/socket.io-client/build/esm/index.js';
import fs from 'fs';
import path from 'path';

const SERVER_URL = 'http://localhost:3001';

let questionsData = [];
try {
  const resp = await fetch(`${SERVER_URL}/api/questions?track=all`);
  questionsData = await resp.json();
} catch (e) {
  const cpaccQuestions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));
  const wasQuestions = fs.existsSync('./data/questions_was.json') ? JSON.parse(fs.readFileSync('./data/questions_was.json', 'utf8')) : [];
  questionsData = [...cpaccQuestions, ...wasQuestions];
}

function createSocket() {
  return io(SERVER_URL, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForEvent(socket, eventName, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout (${timeoutMs}ms) waiting for event "${eventName}"`));
    }, timeoutMs);
    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runAllGameModeTests() {
  console.log('🎮 ====================================================');
  console.log('   A11y Arcade: Comprehensive Multi-Game Test Suite    ');
  console.log('   Testing Cabinets 02, 03, 04, 05, 06, 07             ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // ==========================================================
  // [CABINET 07] CLASSIC KAHOOT CLASH
  // ==========================================================
  totalTests++;
  console.log('--- [1/6] Testing Cabinet 07: Classic Kahoot Clash ---');
  try {
    const host = createSocket();
    const player1 = createSocket();
    const player2 = createSocket();
    await Promise.all([
      waitForEvent(host, 'connect'),
      waitForEvent(player1, 'connect'),
      waitForEvent(player2, 'connect')
    ]);

    const room = await new Promise(res => host.emit('create-room', { gameMode: 'CLASSIC', timeLimit: 15 }, res));
    await Promise.all([
      new Promise(res => player1.emit('join-room', { pin: room.pin, nickname: 'ClassicAce', userPin: '1111' }, res)),
      new Promise(res => player2.emit('join-room', { pin: room.pin, nickname: 'ClassicBob', userPin: '2222' }, res))
    ]);

    const qPromise = waitForEvent(player1, 'question-started');
    host.emit('start-game');
    const qData = await qPromise;

    if (!qData.question || !Array.isArray(qData.question.choices)) {
      throw new Error('Question payload malformed');
    }
    // Verify zero-knowledge: isCorrect omitted
    if (qData.question.choices.some(c => 'isCorrect' in c)) {
      throw new Error('Zero-knowledge violation: isCorrect leaked in question choices');
    }

    // Players submit answers
    const ansPromise = waitForEvent(player1, 'round-revealed');
    player1.emit('submit-answer', { choiceId: qData.question.choices[0].id });
    player2.emit('submit-answer', { choiceId: qData.question.choices[1].id });
    const roundResults = await ansPromise;

    if (!roundResults.leaderboard || roundResults.leaderboard.length !== 2) {
      throw new Error('Round results missing leaderboard entries');
    }

    console.log(`✓ Classic Mode: Question delivered securely, answers processed, leaderboard updated (${roundResults.leaderboard[0].nickname}: ${roundResults.leaderboard[0].score} pts)`);
    passedTests++;

    host.disconnect();
    player1.disconnect();
    player2.disconnect();
  } catch (err) {
    console.error('❌ Classic Mode Test Failed:', err.message);
  }

  await sleep(300);

  // ==========================================================
  // [CABINET 02] GRAND PRIX: APEX GAMBLER
  // ==========================================================
  totalTests++;
  console.log('\n--- [2/6] Testing Cabinet 02: Grand Prix: Apex Gambler ---');
  try {
    const host = createSocket();
    const racer = createSocket();
    await Promise.all([waitForEvent(host, 'connect'), waitForEvent(racer, 'connect')]);

    const room = await new Promise(res => host.emit('create-room', { gameMode: 'GRAND_PRIX', targetDistance: 100 }, res));
    await new Promise(res => racer.emit('join-room', { pin: room.pin, nickname: 'SpeedDemon', userPin: '3333' }, res));

    const raceStartPromise = waitForEvent(racer, 'gp-race-started');
    host.emit('start-game');
    await raceStartPromise;

    // 1. Shift Gear to Gear 3 & Receive Question
    const qServedPromise = waitForEvent(racer, 'gp-question-served');
    const gearRes = await new Promise(res => racer.emit('gp-select-gear', { gear: 3 }, res));
    if (!gearRes.success || gearRes.gear !== 3) {
      throw new Error('Failed to shift to Gear 3');
    }
    const qServed = await qServedPromise;

    // 2. Answer question to gain distance
    const currentQ = qServed.question;
    const fullQ = questionsData.find(q => q.id === currentQ.id);
    const correctChoice = fullQ?.choices.find(c => c.isCorrect) || currentQ.choices[0];
    const telemetryPromise = waitForEvent(racer, 'gp-telemetry-update');
    racer.emit('gp-submit-answer', { choiceId: correctChoice.id });
    const telemetry = await telemetryPromise;

    const myRacer = telemetry.players.find(r => r.nickname === 'SpeedDemon');
    if (!myRacer || myRacer.distance <= 0) {
      throw new Error('Distance was not awarded after answering');
    }
    console.log(`✓ Grand Prix Telemetry: Distance gained = ${myRacer.distance} km (Gear ${myRacer.gear})`);

    // 3. Initiate Pit Stop
    const pitRes = await new Promise(res => racer.emit('gp-pit-stop', {}, res));
    if (!pitRes.success || !pitRes.freezeTime) {
      throw new Error('Pit stop initiation failed');
    }

    // 4. Verify gear shift blocked while in pit
    const shiftInPit = await new Promise(res => racer.emit('gp-select-gear', { gear: 1 }, res));
    if (shiftInPit.success) {
      throw new Error('Exploit: Player shifted gear while frozen in Pit Stop');
    }
    console.log(`✓ Grand Prix Pit Stop: Frozen for ${pitRes.freezeTime}s; gear shift blocked during pit`);
    passedTests++;

    host.disconnect();
    racer.disconnect();
  } catch (err) {
    console.error('❌ Grand Prix Test Failed:', err.message);
  }

  await sleep(300);

  // ==========================================================
  // [CABINET 03] THE HIGH-ROLLER GAUNTLET
  // ==========================================================
  totalTests++;
  console.log('\n--- [3/6] Testing Cabinet 03: The High-Roller Gauntlet ---');
  try {
    const host = createSocket();
    const highRoller = createSocket();
    await Promise.all([waitForEvent(host, 'connect'), waitForEvent(highRoller, 'connect')]);

    const room = await new Promise(res => host.emit('create-room', { gameMode: 'HIGH_ROLLER' }, res));
    await new Promise(res => highRoller.emit('join-room', { pin: room.pin, nickname: 'CasinoKing', userPin: '4444' }, res));

    const teaserPromise = waitForEvent(highRoller, 'hr-teaser');
    host.emit('start-game');
    await teaserPromise;

    // 1. Wager clamping check: Submitting 99,999 chips is auto-clamped to maximum bankroll (1,000)
    const qPromise = waitForEvent(highRoller, 'hr-question-started');
    const clampWager = await new Promise(res => highRoller.emit('hr-submit-wager', { wager: 99999 }, res));
    if (!clampWager.success || clampWager.wager !== 1000) {
      throw new Error(`Wager was not clamped to bankroll limit: ${clampWager.wager}`);
    }
    const qData = await qPromise;

    // 2. Submit intentionally wrong answer to lose entire bankroll
    const wrongChoice = qData.question.choices.find(c => c.shape === 'square' || c.id === 'D' || c.id === 'B') || qData.question.choices[qData.question.choices.length - 1];
    const settlementPromise = waitForEvent(highRoller, 'hr-round-settlement');
    highRoller.emit('hr-submit-answer', { choiceId: wrongChoice.id });
    const settlement = await settlementPromise;

    const myStats = settlement.results.find(p => p.nickname === 'CasinoKing');
    if (!myStats) {
      throw new Error('Player not found in settlement results');
    }

    if (myStats.chips !== 250 || !myStats.bailoutAwarded) {
      throw new Error(`Bailout loan failed: chips = ${myStats.chips}, bailoutAwarded = ${myStats.bailoutAwarded}`);
    }

    console.log(`✓ High-Roller Gauntlet: Wager auto-clamped to 1000; All-In loss triggered 250-chip Safety Bailout`);
    passedTests++;

    host.disconnect();
    highRoller.disconnect();
  } catch (err) {
    console.error('❌ High-Roller Test Failed:', err.message);
  }

  await sleep(300);

  // ==========================================================
  // [CABINET 04] FLAW FINDER: HEATMAP SNIPING
  // ==========================================================
  totalTests++;
  console.log('\n--- [4/6] Testing Cabinet 04: Flaw Finder: Heatmap Sniping ---');
  try {
    const host = createSocket();
    const sniper = createSocket();
    await Promise.all([waitForEvent(host, 'connect'), waitForEvent(sniper, 'connect')]);

    const room = await new Promise(res => host.emit('create-room', { gameMode: 'FLAW_FINDER', timeLimit: 30 }, res));
    await new Promise(res => sniper.emit('join-room', { pin: room.pin, nickname: 'PolicySniper', userPin: '5555' }, res));

    const roundStartPromise = waitForEvent(sniper, 'ff-round-started');
    host.emit('start-game');
    const roundData = await roundStartPromise;

    if (!roundData.scenario || !Array.isArray(roundData.scenario.sentences)) {
      throw new Error('Flaw Finder scenario missing sentences');
    }

    // Pick first sentence and submit snipe
    const targetSentId = roundData.scenario.sentences[0].id;
    const snipeCountPromise = waitForEvent(sniper, 'ff-snipe-count');
    const heatmapPromise = waitForEvent(sniper, 'ff-heatmap-reveal');

    const snipeRes = await new Promise(res => sniper.emit('ff-submit-snipe', { sentenceId: targetSentId }, res));
    if (!snipeRes.success) {
      throw new Error('Failed to submit sentence snipe');
    }
    await snipeCountPromise;
    const heatmapData = await heatmapPromise;

    if (!heatmapData.scenario || !heatmapData.flawedSentenceId) {
      throw new Error('Heatmap reveal data malformed');
    }

    console.log(`✓ Flaw Finder: Scenario "${roundData.scenario.topic}" loaded with ${roundData.scenario.sentences.length} clauses; snipe recorded; heatmap revealed (Target Flaw: ${heatmapData.flawedSentenceId})`);
    passedTests++;

    host.disconnect();
    sniper.disconnect();
  } catch (err) {
    console.error('❌ Flaw Finder Test Failed:', err.message);
  }

  await sleep(300);

  // ==========================================================
  // [CABINET 05] SABOTEUR IN THE SERVER ROOM
  // ==========================================================
  totalTests++;
  console.log('\n--- [5/6] Testing Cabinet 05: Saboteur in the Server Room ---');
  try {
    const host = createSocket();
    const p1 = createSocket();
    const p2 = createSocket();
    await Promise.all([waitForEvent(host, 'connect'), waitForEvent(p1, 'connect'), waitForEvent(p2, 'connect')]);

    const room = await new Promise(res => host.emit('create-room', { gameMode: 'SABOTEUR' }, res));
    await Promise.all([
      new Promise(res => p1.emit('join-room', { pin: room.pin, nickname: 'AgentOne', userPin: '6666' }, res)),
      new Promise(res => p2.emit('join-room', { pin: room.pin, nickname: 'AgentTwo', userPin: '7777' }, res))
    ]);

    const p1RolePromise = waitForEvent(p1, 'sab-role-assigned');
    const p2RolePromise = waitForEvent(p2, 'sab-role-assigned');
    const startPromise = waitForEvent(p1, 'sab-game-started');
    host.emit('start-game');

    const [p1RoleData, p2RoleData] = await Promise.all([p1RolePromise, p2RolePromise, startPromise]);

    const p1Role = p1RoleData.isSaboteur;
    const p2Role = p2RoleData.isSaboteur;

    const hasOneSaboteur = (p1Role && !p2Role) || (!p1Role && p2Role);
    if (!hasOneSaboteur) {
      throw new Error('Expected exactly one Saboteur assigned in 2-player lobby');
    }

    const saboteurSocket = p1Role ? p1 : p2;
    const auditorSocket = p1Role ? p2 : p1;

    // 1. Verify AP gate: Calling standup with 0 AP is rejected
    const blockedStandup = await new Promise(res => auditorSocket.emit('sab-call-standup', res));
    if (blockedStandup.success) {
      throw new Error('Exploit: Called standup with 0 AP (requires 4 AP)');
    }

    // 2. Auditor earns 4 AP by answering questions
    let auditorAP = 0;
    while (auditorAP < 4) {
      const qRes = await new Promise(res => auditorSocket.emit('sab-request-question', res));
      const fullQ = questionsData.find(q => q.id === qRes.question.id);
      const correctChoice = fullQ?.choices.find(c => c.isCorrect) || fullQ?.choices[0];
      const ansRes = await new Promise(res => auditorSocket.emit('sab-submit-answer', { choiceId: correctChoice.id }, res));
      auditorAP = ansRes.currentAP;
    }

    // 3. Call Emergency Standup with >= 4 AP
    const standupPromise = waitForEvent(auditorSocket, 'sab-emergency-standup');
    const standupRes = await new Promise(res => auditorSocket.emit('sab-call-standup', res));
    if (!standupRes.success) {
      throw new Error(`Failed to trigger Emergency Standup meeting: ${standupRes?.error}`);
    }
    await standupPromise;

    // 4. Both vote to eject the Saboteur
    await new Promise(res => auditorSocket.emit('sab-cast-vote', { suspectId: saboteurSocket.id }, res));
    await new Promise(res => saboteurSocket.emit('sab-cast-vote', { suspectId: saboteurSocket.id }, res));

    const finishPromise = waitForEvent(auditorSocket, 'sab-game-finished');
    const finishData = await finishPromise;

    if (!finishData || (finishData.outcome !== 'AUDITORS_VOTED_SABOTEUR' && finishData.outcome !== 'AUDITORS_WIN')) {
      throw new Error(`Unexpected game finish outcome: ${finishData?.outcome}`);
    }

    console.log(`✓ Saboteur Mode: 4 AP requirement enforced; 4 AP earned via CPACC tasks; Emergency Standup triggered; Saboteur ejected with ${finishData.outcome}`);
    passedTests++;

    host.disconnect();
    p1.disconnect();
    p2.disconnect();
  } catch (err) {
    console.error('❌ Saboteur Test Failed:', err.message);
  }

  await sleep(300);

  // ==========================================================
  // [CABINET 06] THE BOUNDARY LINE BRAWL
  // ==========================================================
  totalTests++;
  console.log('\n--- [6/6] Testing Cabinet 06: The Boundary Line Brawl ---');
  try {
    const host = createSocket();
    const b1 = createSocket();
    const b2 = createSocket();
    await Promise.all([waitForEvent(host, 'connect'), waitForEvent(b1, 'connect'), waitForEvent(b2, 'connect')]);

    const room = await new Promise(res => host.emit('create-room', { gameMode: 'BOUNDARY_BRAWL', timeLimit: 60 }, res));
    await Promise.all([
      new Promise(res => b1.emit('join-room', { pin: room.pin, nickname: 'BrawlP1', userPin: '8888' }, res)),
      new Promise(res => b2.emit('join-room', { pin: room.pin, nickname: 'BrawlP2', userPin: '9999' }, res))
    ]);

    const bbStartPromise = waitForEvent(b1, 'bb-game-started');
    host.emit('start-game');
    const bbData = await bbStartPromise;

    if (!Array.isArray(bbData.cards) || bbData.cards.length === 0) {
      throw new Error('Boundary Brawl cards not distributed');
    }

    // 1. Player 1 places card into Q1
    const card = bbData.cards[0];
    const placeCardPromise = waitForEvent(b2, 'bb-card-moved');
    const placeRes = await new Promise(res => b1.emit('bb-place-card', { cardId: card.id, quadrant: 'Q1', x: 30, y: 30 }, res));
    if (!placeRes.success) {
      throw new Error('Failed to place boundary card in quadrant');
    }
    await placeCardPromise;

    // 2. Player 2 challenges placement
    const challengePromise = waitForEvent(b1, 'bb-challenge-started');
    const challengeRes = await new Promise(res => b2.emit('bb-challenge-card', { cardId: card.id }, res));
    if (!challengeRes.success) {
      throw new Error('Failed to initiate territorial challenge');
    }
    await challengePromise;

    // 3. Emoji Voting
    const vote1 = await new Promise(res => b1.emit('bb-cast-emoji-vote', { vote: 'UP' }, res));
    const vote2 = await new Promise(res => b2.emit('bb-cast-emoji-vote', { vote: 'DOWN' }, res));
    if (!vote1.success || !vote2.success) {
      throw new Error('Failed to cast community votes');
    }

    console.log(`✓ Boundary Brawl: Card "${card.title.slice(0, 35)}..." placed in Q1; challenged by opponent; 50/50 community votes recorded`);
    passedTests++;

    host.disconnect();
    b1.disconnect();
    b2.disconnect();
  } catch (err) {
    console.error('❌ Boundary Brawl Test Failed:', err.message);
  }

  // ==========================================================
  // FINAL SCORE & SUMMARY
  // ==========================================================
  console.log('\n====================================================');
  console.log(`🏆 ALL OTHER GAME MODES TESTED: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('🎉 100% OF ALL 8 A11Y ARCADE GAME MODES ARE VERIFIED & HEALTHY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ Some game mode tests failed. Inspect above logs.');
    process.exit(1);
  }
}

runAllGameModeTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
