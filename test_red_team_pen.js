import { io } from './client/node_modules/socket.io-client/build/esm/index.js';
import { spawn } from 'child_process';

const SERVER_URL = 'http://localhost:3001';

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

function waitForEvent(socket, eventName, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event "${eventName}"`));
    }, timeoutMs);
    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runPenetrationTests() {
  console.log('🔴 Starting Red Team Concurrency & Penetration Test Suite...\n');

  const serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit'
  });
  await sleep(1500);

  try {
    // ==========================================
    // Test 1: Rapid Double-Submission Exploit
    // ==========================================
    console.log('--- [Test 1] Rapid Multi-Submission Penetration ---');
    
    // 1A: Boss Raid Rapid Multi-Submission
    console.log('Testing Boss Raid Rapid Submissions (10 rapid emissions in 5ms)...');
    const hostSocket = createSocket();
    const playerSocket = createSocket();

    await Promise.all([
      waitForEvent(hostSocket, 'connect'),
      waitForEvent(playerSocket, 'connect')
    ]);

    const bossRoom = await new Promise(res => {
      hostSocket.emit('create-room', { gameMode: 'BOSS_RAID' }, res);
    });

    await new Promise(res => {
      playerSocket.emit('join-room', { pin: bossRoom.pin, nickname: 'RaidTester', userPin: '1111' }, res);
    });

    const bossStartPromise = waitForEvent(playerSocket, 'boss-game-started');
    hostSocket.emit('start-game');
    await bossStartPromise;

    // Activate Tier 1 node
    const nodeActivePromise = waitForEvent(playerSocket, 'boss-node-activated');
    playerSocket.emit('boss-select-node', { nodeId: 'node-a1' });
    const nodeData = await nodeActivePromise;
    console.log(`Node activated: ${nodeData.node.title}, choices: ${nodeData.question.choices.length}`);

    // Track how many boss-combat-resolved events are emitted
    let combatResolvedCount = 0;
    playerSocket.on('boss-combat-resolved', () => {
      combatResolvedCount++;
    });

    // Now spam 10 boss-submit-answer calls with the correct choice simultaneously
    console.log('Firing 10 simultaneous boss-submit-answer emissions...');
    for (let i = 0; i < 10; i++) {
      playerSocket.emit('boss-submit-answer', { choiceId: nodeData.question.choices[0].id });
    }
    await sleep(600);
    console.log(`Boss Raid: Combat resolved events received: ${combatResolvedCount}`);

    hostSocket.disconnect();
    playerSocket.disconnect();

    // 1B: Classic Mode Rapid Submissions
    console.log('\nTesting Classic Mode Rapid Submissions (10 rapid emissions in 5ms)...');
    const cHost = createSocket();
    const cPlayer = createSocket();
    await Promise.all([
      waitForEvent(cHost, 'connect'),
      waitForEvent(cPlayer, 'connect')
    ]);

    const classicRoom = await new Promise(res => {
      cHost.emit('create-room', { gameMode: 'CLASSIC', timeLimit: 20 }, res);
    });

    await new Promise(res => {
      cPlayer.emit('join-room', { pin: classicRoom.pin, nickname: 'ClassicTester', userPin: '2222' }, res);
    });

    const cQuestionPromise = waitForEvent(cPlayer, 'question-started');
    cHost.emit('start-game');
    const cQData = await cQuestionPromise;

    console.log('Firing 10 simultaneous submit-answer emissions in Classic mode...');
    const cPromises = [];
    for (let i = 0; i < 10; i++) {
      cPromises.push(new Promise(resolve => {
        cPlayer.emit('submit-answer', { choiceId: cQData.question.choices[0].id }, resolve);
      }));
    }
    const cResults = await Promise.all(cPromises);
    const cSuccesses = cResults.filter(r => r?.success !== false);
    const cRejections = cResults.filter(r => r?.success === false && r?.error?.includes('Already answered'));
    console.log(`Classic Mode: Successes = ${cSuccesses.length}, Rejections = ${cRejections.length}`);

    cHost.disconnect();
    cPlayer.disconnect();

    // ==========================================
    // Test 2: Out-of-Turn Socket Injections
    // ==========================================
    console.log('\n--- [Test 2] Out-of-Turn Socket Injections ---');
    const bHost = createSocket();
    const bPlayer = createSocket();
    await Promise.all([
      waitForEvent(bHost, 'connect'),
      waitForEvent(bPlayer, 'connect')
    ]);

    const bRoom = await new Promise(res => {
      bHost.emit('create-room', { gameMode: 'BOSS_RAID' }, res);
    });
    await new Promise(res => {
      bPlayer.emit('join-room', { pin: bRoom.pin, nickname: 'InjectTester', userPin: '3333' }, res);
    });
    
    const bStartPromise = waitForEvent(bPlayer, 'boss-game-started');
    bHost.emit('start-game');
    await bStartPromise;

    // Stage is TECH_TREE: attempt to submit answer
    console.log('Injecting boss-submit-answer while stage is TECH_TREE...');
    const ootAnswerRes = await new Promise(resolve => {
      bPlayer.emit('boss-submit-answer', { choiceId: 'B' }, resolve);
    });
    console.log('Result of boss-submit-answer during TECH_TREE:', ootAnswerRes);

    // Activate node to enter NODE_COMBAT
    const bNodePromise = waitForEvent(bPlayer, 'boss-node-activated');
    bPlayer.emit('boss-select-node', { nodeId: 'node-a1' });
    await bNodePromise;

    // Stage is NODE_COMBAT: attempt to select another node
    console.log('Injecting boss-select-node while stage is NODE_COMBAT...');
    const ootSelectRes = await new Promise(resolve => {
      bPlayer.emit('boss-select-node', { nodeId: 'node-a2' }, resolve);
    });
    console.log('Result of boss-select-node during NODE_COMBAT:', ootSelectRes);

    bHost.disconnect();
    bPlayer.disconnect();

    // ==========================================
    // Test 3: Nickname Hijacking & PIN Collisions
    // ==========================================
    console.log('\n--- [Test 3] Nickname Hijacking & PIN Collisions ---');
    const nHost = createSocket();
    const nPlayer1 = createSocket();
    const nPlayer2 = createSocket();
    const nAttacker = createSocket();
    await Promise.all([
      waitForEvent(nHost, 'connect'),
      waitForEvent(nPlayer1, 'connect'),
      waitForEvent(nPlayer2, 'connect'),
      waitForEvent(nAttacker, 'connect')
    ]);

    const nRoom = await new Promise(res => {
      nHost.emit('create-room', { gameMode: 'CLASSIC' }, res);
    });

    // Player 1 registers with unique PIN
    const p1Res = await new Promise(res => {
      nPlayer1.emit('join-room', { pin: nRoom.pin, nickname: 'ShadowAuditor', userPin: '9876' }, res);
    });
    console.log('Player 1 join (first time registration):', p1Res?.player?.nickname, 'success:', p1Res?.success);

    // Player 2 connects with identical nickname in same room
    const p2Res = await new Promise(res => {
      nPlayer2.emit('join-room', { pin: nRoom.pin, nickname: 'ShadowAuditor', userPin: '5432' }, res);
    });
    console.log('Player 2 join with same nickname & different PIN:', p2Res);

    // Attacker attempts to spoof ShadowAuditor with bogus PIN
    const atkRes = await new Promise(res => {
      nAttacker.emit('join-room', { pin: nRoom.pin, nickname: 'ShadowAuditor', userPin: '0000' }, res);
    });
    console.log('Attacker spoof attempt with bogus PIN:', atkRes);

    // Attacker attempts to join with NO PIN provided for existing registered nickname
    const noPinRes = await new Promise(res => {
      nAttacker.emit('join-room', { pin: nRoom.pin, nickname: 'ShadowAuditor' }, res);
    });
    console.log('Attacker join with registered nickname but NO userPin:', noPinRes?.player?.nickname, noPinRes?.error);

    nHost.disconnect();
    nPlayer1.disconnect();
    nPlayer2.disconnect();
    nAttacker.disconnect();

    // ==========================================
    // Test 4: Host Abandonment
    // ==========================================
    console.log('\n--- [Test 4] Host Abandonment ---');
    const hHost = createSocket();
    const hPlayer = createSocket();
    await Promise.all([
      waitForEvent(hHost, 'connect'),
      waitForEvent(hPlayer, 'connect')
    ]);

    const hRoom = await new Promise(res => {
      hHost.emit('create-room', { gameMode: 'CLASSIC' }, res);
    });

    await new Promise(res => {
      hPlayer.emit('join-room', { pin: hRoom.pin, nickname: 'SurvivorPlayer', userPin: '7777' }, res);
    });

    const hQPromise = waitForEvent(hPlayer, 'question-started');
    hHost.emit('start-game');
    await hQPromise;

    let hostDisconnectReceived = false;
    hPlayer.on('host-disconnected', () => {
      hostDisconnectReceived = true;
    });

    console.log('Killing Host mid-round...');
    hHost.disconnect();
    await sleep(500);

    console.log(`Survivor player received host-disconnected event: ${hostDisconnectReceived}`);
    hPlayer.disconnect();

    // ==========================================
    // Test 5: Reconnection & Mid-Game Rejoining
    // ==========================================
    console.log('\n--- [Test 5] Network Jitter & Mid-Game Reconnection ---');
    const rHost = createSocket();
    let rPlayer = createSocket();
    await Promise.all([
      waitForEvent(rHost, 'connect'),
      waitForEvent(rPlayer, 'connect')
    ]);

    const rRoom = await new Promise(res => {
      rHost.emit('create-room', { gameMode: 'CLASSIC', timeLimit: 45 }, res);
    });

    await new Promise(res => {
      rPlayer.emit('join-room', { pin: rRoom.pin, nickname: 'Reconnector', userPin: '4321' }, res);
    });

    const rQPromise = waitForEvent(rPlayer, 'question-started');
    rHost.emit('start-game');
    await rQPromise;

    console.log('Dropping player socket during active round for 3 seconds...');
    rPlayer.disconnect();
    await sleep(3000);

    console.log('Player reconnecting with new socket & Option B PIN 4321...');
    rPlayer = createSocket();
    await waitForEvent(rPlayer, 'connect');

    const reconnRes = await new Promise(res => {
      rPlayer.emit('join-room', { pin: rRoom.pin, nickname: 'Reconnector', userPin: '4321' }, res);
    });
    console.log('Reconnection response:', reconnRes);

    rHost.disconnect();
    rPlayer.disconnect();

    // ==========================================
    // Test 6: Boss Raid Damage Overflow Verification
    // ==========================================
    console.log('\n--- [Test 6] Boss Raid Shield Damage Overflow ---');
    const ovHost = createSocket();
    const ovPlayer = createSocket();
    await Promise.all([
      waitForEvent(ovHost, 'connect'),
      waitForEvent(ovPlayer, 'connect')
    ]);

    const ovRoom = await new Promise(res => {
      ovHost.emit('create-room', { gameMode: 'BOSS_RAID' }, res);
    });

    await new Promise(res => {
      ovPlayer.emit('join-room', { pin: ovRoom.pin, nickname: 'OverflowTester', userPin: '6666' }, res);
    });

    const ovStartPromise = waitForEvent(ovPlayer, 'boss-game-started');
    ovHost.emit('start-game');
    const ovStartData = await ovStartPromise;
    const initialBossHp = ovStartData.tree.bossHp;
    console.log(`Initial Boss HP: ${initialBossHp}, Procurement Shield HP: ${ovStartData.tree.shields.procurement.hp}`);

    // Solve Tier 1 (Procurement Shield: 100 HP -> 50 HP)
    let nodeActive = waitForEvent(ovPlayer, 'boss-node-activated');
    ovPlayer.emit('boss-select-node', { nodeId: 'node-a1' });
    let activeData = await nodeActive;
    let resolvedPromise = waitForEvent(ovPlayer, 'boss-combat-resolved');
    ovPlayer.emit('boss-submit-answer', { choiceId: 'B' });
    let resolvedData = await resolvedPromise;
    console.log(`Strike 1: Shield HP: ${resolvedData.shields.procurement.hp}, Boss HP: ${resolvedData.newBossHp}`);

    // Host advances from debrief back to Tech Tree
    const techTreePromise = waitForEvent(ovPlayer, 'boss-stage-tech-tree');
    ovHost.emit('next-stage');
    await techTreePromise;
    console.log('Returned to tech tree successfully.');

    // Solve Tier 2 (Node damage: 50 * 1.25 = 63 DMG. Shield has 50 HP left! Overflow should be 13 DMG to Boss HP!)
    nodeActive = waitForEvent(ovPlayer, 'boss-node-activated');
    ovPlayer.emit('boss-select-node', { nodeId: 'node-a2' });
    activeData = await nodeActive;
    resolvedPromise = waitForEvent(ovPlayer, 'boss-combat-resolved');
    ovPlayer.emit('boss-submit-answer', { choiceId: 'A' });
    resolvedData = await resolvedPromise;
    console.log(`Strike 2 (63 DMG vs 50 HP shield): Shield HP: ${resolvedData.shields.procurement.hp}, Boss HP: ${resolvedData.newBossHp}`);
    if (resolvedData.newBossHp === initialBossHp) {
      console.log('❌ BUG CONFIRMED: Overflow damage was LOST! Boss HP did not decrease below initial max HP!');
    } else {
      console.log(`✓ Overflow applied: Boss HP decreased to ${resolvedData.newBossHp}`);
    }

    ovHost.disconnect();
    ovPlayer.disconnect();

    console.log('\n🏁 Penetration tests complete.');
  } finally {
    serverProcess.kill();
  }
  process.exit(0);
}

runPenetrationTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
