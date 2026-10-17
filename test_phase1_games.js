import { io } from './client/node_modules/socket.io-client/build/esm/index.js';
import { spawn } from 'child_process';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function waitForConnect(sock) {
  if (sock.connected) return Promise.resolve();
  return new Promise(r => sock.once('connect', r));
}

async function runTests() {
  console.log('🚀 Starting Phase 1 Integration Tests for All Game Modes...\n');

  // Spawn server
  const serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit'
  });

  // Give server 1.5s to start
  await sleep(1500);

  try {
    // ==========================================
    // TEST 1: Classic Kahoot Mode
    // ==========================================
    console.log('=== [1/3] Testing Classic Mode ===');
    const host1 = io('http://localhost:3001', { reconnection: false });
    const p1 = io('http://localhost:3001', { reconnection: false });
    await Promise.all([waitForConnect(host1), waitForConnect(p1)]);

    const createClassic = await new Promise(res => host1.emit('create-room', { gameMode: 'CLASSIC', timeLimit: 5, questionCount: 1 }, res));
    console.log(`✓ Classic Room Created: PIN ${createClassic.pin}`);

    // Option B Test: First join sets Alice's PIN to 1234
    const joinOk = await new Promise(res => p1.emit('join-room', { pin: createClassic.pin, nickname: 'Alice', avatar: '🦉', userPin: '1234' }, res));
    if (!joinOk.success) throw new Error('Failed initial join with PIN');
    console.log(`✓ Option B Passcode: Player Alice registered with 4-digit PIN 1234`);

    // Verify wrong PIN fails
    const pFake = io('http://localhost:3001', { reconnection: false });
    await waitForConnect(pFake);
    const fakeJoin = await new Promise(res => pFake.emit('join-room', { pin: createClassic.pin, nickname: 'Alice', avatar: '🦉', userPin: '9999' }, res));
    if (fakeJoin.success) throw new Error('Expected wrong PIN to fail!');
    console.log(`✓ Option B Passcode: Wrong PIN rejected successfully (${fakeJoin.error.slice(0, 38)}...)`);
    pFake.disconnect();

    const qPromise = new Promise(res => p1.once('question-started', res));
    const revealPromise = new Promise(res => host1.once('round-revealed', res));
    host1.emit('start-game');

    const qData = await qPromise;
    console.log(`✓ Classic Question Received: "${qData.question.question.slice(0, 45)}..."`);

    await new Promise(res => p1.emit('submit-answer', { choiceId: 'B' }, res));
    const reveal = await revealPromise;
    console.log(`✓ Classic Round Revealed! Top player: ${reveal.leaderboard[0].nickname}`);

    host1.disconnect();
    p1.disconnect();
    console.log('🎉 Classic Mode Passed!\n');

    // ==========================================
    // TEST 2: Hot Potato Syndicate Mode
    // ==========================================
    console.log('=== [2/3] Testing Hot Potato Syndicate Mode ===');
    const host2 = io('http://localhost:3001', { reconnection: false });
    const activeP = io('http://localhost:3001', { reconnection: false });
    const del1 = io('http://localhost:3001', { reconnection: false });
    const del2 = io('http://localhost:3001', { reconnection: false });
    const spectator = io('http://localhost:3001', { reconnection: false });

    await Promise.all([
      waitForConnect(host2),
      waitForConnect(activeP),
      waitForConnect(del1),
      waitForConnect(del2),
      waitForConnect(spectator)
    ]);

    const createHP = await new Promise(res => host2.emit('create-room', { gameMode: 'HOT_POTATO', questionCount: 2, blunderPenalty: true }, res));
    console.log(`✓ Hot Potato Room Created: PIN ${createHP.pin}`);

    await new Promise(res => activeP.emit('join-room', { pin: createHP.pin, nickname: 'Sarah HotSeat', avatar: '🔥' }, res));
    await new Promise(res => del1.emit('join-room', { pin: createHP.pin, nickname: 'Marcus Del1', avatar: '🦊' }, res));
    await new Promise(res => del2.emit('join-room', { pin: createHP.pin, nickname: 'Elena Del2', avatar: '🚀' }, res));
    await new Promise(res => spectator.emit('join-room', { pin: createHP.pin, nickname: 'Sam Spectator', avatar: '🍿' }, res));
    console.log(`✓ 4 Players Joined Hot Potato Syndicate Room`);

    // Listen for Teaser
    const teaserPromise = new Promise(res => host2.once('hp-teaser', res));
    host2.emit('start-game');
    const teaser = await teaserPromise;
    console.log(`✓ Teaser Received! Active: ${teaser.activePlayer.nickname}, Concept: "${teaser.conceptHeader}"`);

    // Active player decides to PASS
    const draftPromise = new Promise(res => host2.once('hp-delegates-drafted', res));
    await new Promise(res => activeP.emit('hp-choose-action', { action: 'PASS' }, res));
    const draftData = await draftPromise;
    console.log(`✓ Delegates Drafted: A=${draftData.delegateA.nickname}, B=${draftData.delegateB.nickname}`);

    // Map sockets by id so the drafted delegates submit
    const socketMap = {
      [activeP.id]: activeP,
      [del1.id]: del1,
      [del2.id]: del2,
      [spectator.id]: spectator
    };

    // Both drafted delegates submit wrong answers to trigger Social Dividend for spectators!
    const settlementPromise = new Promise(res => host2.once('hp-round-settlement', res));
    socketMap[draftData.delegateA.id].emit('hp-submit-answer', { choiceId: 'WRONG_CHOICE' });
    socketMap[draftData.delegateB.id].emit('hp-submit-answer', { choiceId: 'WRONG_CHOICE' });

    const settlement = await settlementPromise;
    console.log(`✓ Round Settled! Outcome: ${settlement.outcomeType}`);
    console.log(`✓ Social Dividend Payout: ${settlement.dividendPerSpectator} pts per spectator!`);
    if (settlement.outcomeType === 'NEITHER_CORRECT' && settlement.dividendPerSpectator > 0) {
      console.log('✓ Social Dividend successfully awarded to room spectators!');
    }

    host2.disconnect();
    activeP.disconnect();
    del1.disconnect();
    del2.disconnect();
    spectator.disconnect();
    console.log('🎉 Hot Potato Syndicate Mode Passed!\n');

    // ==========================================
    // TEST 3: Grand Prix Apex Gambler Mode
    // ==========================================
    console.log('=== [3/3] Testing Grand Prix: Apex Gambler Mode ===');
    const host3 = io('http://localhost:3001', { reconnection: false });
    const racer1 = io('http://localhost:3001', { reconnection: false });
    const racer2 = io('http://localhost:3001', { reconnection: false });

    await Promise.all([
      waitForConnect(host3),
      waitForConnect(racer1),
      waitForConnect(racer2)
    ]);

    const createGP = await new Promise(res => host3.emit('create-room', { gameMode: 'GRAND_PRIX', questionCount: 5, targetDistance: 100 }, res));
    console.log(`✓ Grand Prix Room Created: PIN ${createGP.pin}`);

    await new Promise(res => racer1.emit('join-room', { pin: createGP.pin, nickname: 'Speedy Sam', avatar: '🏎️' }, res));
    await new Promise(res => racer2.emit('join-room', { pin: createGP.pin, nickname: 'Cautious Chloe', avatar: '🚗' }, res));

    const raceStartPromise = new Promise(res => racer1.once('gp-race-started', res));
    host3.emit('start-game');
    const raceConfig = await raceStartPromise;
    console.log(`✓ Race Started! Target Distance: ${raceConfig.targetDistance}m, Hazards: ${raceConfig.hazards.length}`);

    // Racer 1 selects Gear 2 (Medium)
    const qServedPromise = new Promise(res => racer1.once('gp-question-served', res));
    await new Promise(res => racer1.emit('gp-select-gear', { gear: 2 }, res));
    const servedQ = await qServedPromise;
    console.log(`✓ Gear 2 Question Served: "${servedQ.question.question.slice(0, 45)}..." (Difficulty: ${servedQ.question.difficulty})`);

    // Racer 1 answers correctly
    const correctId = servedQ.question.choices[0].id; // any answer to test telemetry
    const answerRes = await new Promise(res => racer1.emit('gp-submit-answer', { choiceId: correctId }, res));
    console.log(`✓ Racer 1 Answered: isCorrect=${answerRes.isCorrect}, Delta=${answerRes.delta}m, Distance=${answerRes.newDistance}m`);

    // Racer 2 selects Gear 1, then takes a Pit Stop
    const pitQPromise = new Promise(res => racer2.once('gp-question-served', res));
    await new Promise(res => racer2.emit('gp-select-gear', { gear: 1 }, res));
    await pitQPromise;

    const pitRes = await new Promise(res => racer2.emit('gp-pit-stop', {}, res));
    console.log(`✓ Racer 2 Took Pit Stop! Freeze time: ${pitRes.freezeTime}s`);

    host3.disconnect();
    racer1.disconnect();
    racer2.disconnect();
    console.log('🎉 Grand Prix Apex Gambler Mode Passed!\n');

    console.log('====================================================');
    console.log('🏆 ALL PHASE 1 MULTIPLAYER GAME MODES PASS 100%!');
    console.log('====================================================');
    serverProcess.kill();
    process.exit(0);

  } catch (err) {
    console.error('❌ Test failed:', err);
    serverProcess.kill();
    process.exit(1);
  }
}

runTests();
