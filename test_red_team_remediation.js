import { io } from './client/node_modules/socket.io-client/build/esm/index.js';
import { spawn } from 'child_process';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function waitForConnect(sock) {
  if (sock.connected) return Promise.resolve();
  return new Promise(r => sock.once('connect', r));
}

async function runRedTeamVerification() {
  console.log('🔴 Running Automated Verification for Red Team Vulnerability Fixes...\n');

  // Spawn server
  const serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit'
  });

  await sleep(1500);

  try {
    // ========================================================
    // TEST 1: Option B Passcode Enforcement & Hijacking Defense (Finding 2)
    // ========================================================
    console.log('=== [1/4] Testing Finding 2: Nickname Hijacking Prevention ===');
    const host = io('http://localhost:3001', { reconnection: false });
    const legitUser = io('http://localhost:3001', { reconnection: false });
    await Promise.all([waitForConnect(host), waitForConnect(legitUser)]);

    const roomRes = await new Promise(res => host.emit('create-room', { gameMode: 'CLASSIC', timeLimit: 15 }, res));
    const pin = roomRes.pin;

    // Legit user registers with PIN 7788
    const regRes = await new Promise(res => legitUser.emit('join-room', { pin, nickname: 'VipCadet', userPin: '7788' }, res));
    if (!regRes.success) throw new Error('Legit registration failed');
    console.log('✓ Legit user VipCadet registered with PIN 7788');
    legitUser.disconnect();

    // Attacker tries to join with same nickname but omits userPin
    const attacker = io('http://localhost:3001', { reconnection: false });
    await waitForConnect(attacker);
    const hijackAttempt = await new Promise(res => attacker.emit('join-room', { pin, nickname: 'VipCadet' }, res));
    if (hijackAttempt.success) throw new Error('VULNERABILITY REPRODUCED: Attacker hijacked registered nickname without PIN!');
    console.log(`✓ Finding 2 Fixed: Attacker blocked (${hijackAttempt.error})`);
    attacker.disconnect();

    // ========================================================
    // TEST 2: Mid-Game Disconnect Reconnection (Finding 1)
    // ========================================================
    console.log('\n=== [2/4] Testing Finding 1: Mid-Game Disconnect & Reconnect ===');
    const reconnector = io('http://localhost:3001', { reconnection: false });
    await waitForConnect(reconnector);

    // Reconnector joins lobby
    const joinRes = await new Promise(res => reconnector.emit('join-room', { pin, nickname: 'Reconnector', userPin: '4321' }, res));
    if (!joinRes.success) throw new Error('Initial join failed');
    console.log('✓ Player Reconnector joined lobby');

    // Start game
    const qPromise = new Promise(res => reconnector.once('question-started', res));
    host.emit('start-game');
    await qPromise;
    console.log('✓ Game is active in QUESTION state');

    // Reconnector disconnects (simulating network drop)
    reconnector.disconnect();
    await sleep(500);

    // New socket attempts reconnect with valid userPin
    const reconnectedSock = io('http://localhost:3001', { reconnection: false });
    await waitForConnect(reconnectedSock);
    const recRes = await new Promise(res => reconnectedSock.emit('join-room', { pin, nickname: 'Reconnector', userPin: '4321' }, res));
    if (!recRes.success) throw new Error(`VULNERABILITY REPRODUCED: Reconnection rejected with: ${recRes.error}`);
    if (!recRes.reconnected) throw new Error('Expected reconnected: true in response');
    console.log('✓ Finding 1 Fixed: Player seamlessly reconnected into active mid-game round!');
    reconnectedSock.disconnect();
    host.disconnect();

    // ========================================================
    // TEST 3: Boss Raid Shield Damage Overflow (Finding 3)
    // ========================================================
    console.log('\n=== [3/4] Testing Finding 3: Boss Raid Shield Damage Overflow ===');
    const hostBoss = io('http://localhost:3001', { reconnection: false });
    const raider = io('http://localhost:3001', { reconnection: false });
    await Promise.all([waitForConnect(hostBoss), waitForConnect(raider)]);

    const bossRoom = await new Promise(res => hostBoss.emit('create-room', { gameMode: 'BOSS_RAID' }, res));
    await new Promise(res => raider.emit('join-room', { pin: bossRoom.pin, nickname: 'Raider1', userPin: '1111' }, res));

    const bossStart = new Promise(res => raider.once('boss-game-started', res));
    hostBoss.emit('start-game');
    const initBoss = await bossStart;
    const initialBossHp = initBoss.tree.bossHp; // 500

    // Strike 1: Node A1 deals 50 DMG to Procurement Shield (100 -> 50)
    await new Promise(res => raider.emit('boss-select-node', { nodeId: 'node-a1' }, res));
    await new Promise(res => raider.emit('boss-submit-answer', { choiceId: 'B' }, res)); // Correct choice

    // Strike 2: Node A2 deals 50 DMG * 1.25 (Legal Piercer buff) = 63 DMG
    // Shield has 50 HP remaining, so 50 DMG breaks shield, 13 DMG MUST overflow to Boss HP (500 -> 487)
    const techTreePromise = new Promise(res => raider.once('boss-stage-tech-tree', res));
    hostBoss.emit('next-stage');
    await techTreePromise;
    await new Promise(res => raider.emit('boss-select-node', { nodeId: 'node-a2' }, res));

    const strike2Promise = new Promise(res => raider.once('boss-combat-resolved', res));
    // In node-a2: Choice A is correct
    await new Promise(res => raider.emit('boss-submit-answer', { choiceId: 'A' }, res));
    const strike2Result = await strike2Promise;

    console.log(`✓ Shield HP: ${strike2Result.shields.procurement.hp}, Boss HP: ${strike2Result.newBossHp}/${strike2Result.maxBossHp}`);
    if (strike2Result.newBossHp >= initialBossHp) {
      throw new Error(`VULNERABILITY REPRODUCED: Overflow damage not applied to Boss HP! Boss HP still ${strike2Result.newBossHp}`);
    }
    console.log(`✓ Finding 3 Fixed: Shield shattered and ${initialBossHp - strike2Result.newBossHp} overflow damage struck Boss HP!`);
    hostBoss.disconnect();
    raider.disconnect();

    // ========================================================
    // TEST 4: High-Roller Safety Bailout Discrepancy (Finding 8)
    // ========================================================
    console.log('\n=== [4/4] Testing Finding 8: High-Roller 250 Chip Bailout ===');
    const hostHR = io('http://localhost:3001', { reconnection: false });
    const bettor = io('http://localhost:3001', { reconnection: false });
    await Promise.all([waitForConnect(hostHR), waitForConnect(bettor)]);

    const hrRoom = await new Promise(res => hostHR.emit('create-room', { gameMode: 'HIGH_ROLLER', timeLimit: 5 }, res));
    await new Promise(res => bettor.emit('join-room', { pin: hrRoom.pin, nickname: 'Bettor1', userPin: '2222' }, res));

    const hrStartPromise = new Promise(res => bettor.once('hr-teaser', res));
    hostHR.emit('start-game');
    await hrStartPromise;

    // Bettor wagers 1,000 chips (All-In)
    await new Promise(res => bettor.emit('hr-submit-wager', { wager: 1000 }, res));

    // Wait for reveal
    await new Promise(res => bettor.once('hr-question-started', res));

    // Submit wrong choice to trigger bankruptcy
    const settlePromise = new Promise(res => bettor.once('hr-round-settlement', res));
    await new Promise(res => bettor.emit('hr-submit-answer', { choiceId: 'WRONG_ANSWER' }, res));
    const settleResult = await settlePromise;

    const myResult = settleResult.results.find(r => r.nickname === 'Bettor1');
    console.log(`✓ Settle Result: chips=${myResult.chips}, bailoutAwarded=${myResult.bailoutAwarded}`);
    if (myResult.chips !== 250) {
      throw new Error(`VULNERABILITY REPRODUCED: Bailout awarded ${myResult.chips} chips instead of 250!`);
    }
    console.log('✓ Finding 8 Fixed: Safety bailout successfully awarded exactly 250 emergency chips!');

    hostHR.disconnect();
    bettor.disconnect();

    console.log('\n====================================================');
    console.log('🏆 ALL 4 RED TEAM VULNERABILITIES VERIFIED AS FIXED!');
    console.log('====================================================');
    serverProcess.kill();
    process.exit(0);

  } catch (err) {
    console.error('❌ Verification failed:', err);
    serverProcess.kill();
    process.exit(1);
  }
}

runRedTeamVerification();
