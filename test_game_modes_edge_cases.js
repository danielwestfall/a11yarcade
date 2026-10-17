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

async function runEdgeCases() {
  console.log('🕹️ Starting Game Engine QA & Edge-Case Exploits Suite...\n');

  const serverProcess = spawn('node', ['server/index.js'], {
    stdio: 'inherit'
  });
  await sleep(1500);

  try {
    // ==========================================
    // 1. High-Roller Gauntlet: Safety Bailout Loan
    // ==========================================
    console.log('--- [Mode 04] High-Roller Gauntlet: Safety Bailout Loan ---');
    const hrHost = createSocket();
    const hrPlayer = createSocket();
    await Promise.all([waitForEvent(hrHost, 'connect'), waitForEvent(hrPlayer, 'connect')]);

    const hrRoom = await new Promise(res => {
      hrHost.emit('create-room', { gameMode: 'HIGH_ROLLER', timeLimit: 20 }, res);
    });

    await new Promise(res => {
      hrPlayer.emit('join-room', { pin: hrRoom.pin, nickname: 'BrokeGambler', userPin: '4444' }, res);
    });

    const hrTeaserPromise = waitForEvent(hrPlayer, 'hr-teaser');
    hrHost.emit('start-game');
    await hrTeaserPromise;

    // Player bets 1,000 chips (All-In)
    console.log('Player wagering 1,000 chips (All-In)...');
    await new Promise(res => {
      hrPlayer.emit('hr-submit-wager', { wager: 1000 }, res);
    });

    // Advance to question
    const hrQPromise = waitForEvent(hrPlayer, 'hr-question-started');
    hrHost.emit('next-stage');
    const hrQData = await hrQPromise;

    // Submit wrong answer
    console.log('Player submitting wrong answer to lose bankroll...');
    const wrongChoice = hrQData.question.choices.find(c => c.shape === 'square' || c.id === 'D');
    const hrSettledPromise = waitForEvent(hrPlayer, 'hr-round-settlement');
    hrPlayer.emit('hr-submit-answer', { choiceId: wrongChoice.id });
    const hrSettlement = await hrSettledPromise;

    const mySettlement = (hrSettlement.results || hrSettlement.leaderboard).find(p => p.nickname === 'BrokeGambler');
    console.log(`High Roller Settlement: Chips = ${mySettlement.chips}, Bailout Awarded = ${mySettlement.bailoutAwarded}`);
    if (mySettlement.chips === 250) {
      console.log('✓ Safety Bailout Loan awarded 250 emergency chips as specified.');
    } else {
      console.log(`❌ DISCREPANCY: Bailout loan gave ${mySettlement.chips} chips instead of required 250 emergency chips!`);
    }

    hrHost.disconnect();
    hrPlayer.disconnect();

    // ==========================================
    // 2. Grand Prix: Pit Stop Gear Shift Lockdown
    // ==========================================
    console.log('\n--- [Mode 03] Grand Prix: Pit Stop Gear Shift Lockdown ---');
    const gpHost = createSocket();
    const gpPlayer = createSocket();
    await Promise.all([waitForEvent(gpHost, 'connect'), waitForEvent(gpPlayer, 'connect')]);

    const gpRoom = await new Promise(res => {
      gpHost.emit('create-room', { gameMode: 'GRAND_PRIX', targetDistance: 100 }, res);
    });

    await new Promise(res => {
      gpPlayer.emit('join-room', { pin: gpRoom.pin, nickname: 'PitRacer', userPin: '5555' }, res);
    });

    const gpStartPromise = waitForEvent(gpPlayer, 'gp-race-started');
    gpHost.emit('start-game');
    await gpStartPromise;

    // Shift to 3rd gear
    console.log('Racer shifting to 3rd Gear...');
    await new Promise(res => {
      gpPlayer.emit('gp-select-gear', { gear: 3 }, res);
    });

    // Trigger Pit Stop
    console.log('Racer triggering Pit Stop...');
    const pitRes = await new Promise(res => {
      gpPlayer.emit('gp-pit-stop', {}, res);
    });
    console.log(`Pit Stop initiated: freezeTime = ${pitRes.freezeTime}s`);

    // Attempt to shift gear while in pit
    console.log('Racer attempting gear shift while frozen in pit...');
    const shiftWhilePitRes = await new Promise(res => {
      gpPlayer.emit('gp-select-gear', { gear: 1 }, res);
    });
    console.log('Result of gear shift during pit stop:', shiftWhilePitRes);

    gpHost.disconnect();
    gpPlayer.disconnect();

    // ==========================================
    // 3. Boundary Brawl: 50/50 Tie Vote Resolution
    // ==========================================
    console.log('\n--- [Mode 07] Boundary Line Brawl: 50/50 Tiebreaker ---');
    const bbHost = createSocket();
    const bbPlayer1 = createSocket();
    const bbPlayer2 = createSocket();
    await Promise.all([
      waitForEvent(bbHost, 'connect'),
      waitForEvent(bbPlayer1, 'connect'),
      waitForEvent(bbPlayer2, 'connect')
    ]);

    const bbRoom = await new Promise(res => {
      bbHost.emit('create-room', { gameMode: 'BOUNDARY_BRAWL', timeLimit: 75 }, res);
    });

    await Promise.all([
      new Promise(res => bbPlayer1.emit('join-room', { pin: bbRoom.pin, nickname: 'DefenderP1', userPin: '1212' }, res)),
      new Promise(res => bbPlayer2.emit('join-room', { pin: bbRoom.pin, nickname: 'ChallengerP2', userPin: '3434' }, res))
    ]);

    const bbStartPromise = waitForEvent(bbPlayer1, 'bb-game-started');
    bbHost.emit('start-game');
    const bbStartData = await bbStartPromise;

    // Player 1 drops card into Q1
    const testCard = bbStartData.cards[0];
    await new Promise(res => {
      bbPlayer1.emit('bb-place-card', { cardId: testCard.id, quadrant: 'Q1', x: 25, y: 25 }, res);
    });

    // Player 2 challenges
    const challengePromise = waitForEvent(bbPlayer1, 'bb-challenge-started');
    await new Promise(res => {
      bbPlayer2.emit('bb-challenge-card', { cardId: testCard.id }, res);
    });
    await challengePromise;

    // Cast 1 UP vote and 1 DOWN vote (50/50 Tie)
    await new Promise(res => bbPlayer1.emit('bb-cast-emoji-vote', { vote: 'UP' }, res));
    await new Promise(res => bbPlayer2.emit('bb-cast-emoji-vote', { vote: 'DOWN' }, res));

    // Wait for settlement after 20s challenge timer
    const bbSettledPromise = waitForEvent(bbPlayer1, 'bb-challenge-settled', 25000);
    console.log('Waiting for Boundary Brawl challenge settlement (20s timer)...');
    const bbSettlement = await bbSettledPromise;
    console.log(`Boundary Brawl 50/50 Tie Result: Winner = ${bbSettlement.winner}, Defender = ${bbSettlement.defender.nickname}`);
    console.log(`Citation Displayed: BoK Ref = "${bbSettlement.cpaccRef}", Rationale = "${bbSettlement.rationale}"`);

    bbHost.disconnect();
    bbPlayer1.disconnect();
    bbPlayer2.disconnect();

    // ==========================================
    // 4. Saboteur: Emergency Standup & Ejection
    // ==========================================
    console.log('\n--- [Mode 06] Saboteur: Emergency Standup & Ejection ---');
    const sabHost = createSocket();
    const sabP1 = createSocket();
    const sabP2 = createSocket();
    await Promise.all([
      waitForEvent(sabHost, 'connect'),
      waitForEvent(sabP1, 'connect'),
      waitForEvent(sabP2, 'connect')
    ]);

    const sabRoom = await new Promise(res => {
      sabHost.emit('create-room', { gameMode: 'SABOTEUR' }, res);
    });

    await Promise.all([
      new Promise(res => sabP1.emit('join-room', { pin: sabRoom.pin, nickname: 'AgentA', userPin: '7878' }, res)),
      new Promise(res => sabP2.emit('join-room', { pin: sabRoom.pin, nickname: 'AgentB', userPin: '8989' }, res))
    ]);

    let p1Role = null;
    let p2Role = null;
    sabP1.on('sab-role-assigned', r => { p1Role = r.isSaboteur; });
    sabP2.on('sab-role-assigned', r => { p2Role = r.isSaboteur; });

    const sabStartPromise = waitForEvent(sabP1, 'sab-game-started');
    sabHost.emit('start-game');
    await sabStartPromise;
    console.log(`Roles assigned: AgentA (isSaboteur: ${p1Role}), AgentB (isSaboteur: ${p2Role})`);

    const saboteurSocket = p1Role ? sabP1 : sabP2;
    const auditorSocket = p1Role ? sabP2 : sabP1;
    const saboteurNick = p1Role ? 'AgentA' : 'AgentB';
    const auditorNick = p1Role ? 'AgentB' : 'AgentA';

    // Trigger Emergency Standup
    console.log('Triggering Emergency Standup...');
    const standupPromise = waitForEvent(auditorSocket, 'sab-emergency-standup');
    await new Promise(res => {
      saboteurSocket.emit('sab-trigger-standup', {}, res);
    });
    const standupData = await standupPromise;
    console.log('Emergency Standup triggered successfully.');

    // Both vote to eject the Saboteur
    console.log(`Voting to eject the Saboteur (${saboteurNick})...`);
    await new Promise(res => auditorSocket.emit('sab-cast-vote', { suspectId: saboteurSocket.id }, res));
    await new Promise(res => saboteurSocket.emit('sab-cast-vote', { suspectId: saboteurSocket.id }, res));

    const gameFinishedPromise = waitForEvent(auditorSocket, 'sab-game-finished');
    const finishedData = await gameFinishedPromise;
    console.log(`Saboteur Ejection Result: Outcome = ${finishedData.outcome}, Reason = "${finishedData.reason}"`);

    sabHost.disconnect();
    sabP1.disconnect();
    sabP2.disconnect();

    console.log('\n🏁 Edge-case tests completed successfully.');
  } finally {
    serverProcess.kill();
  }
  process.exit(0);
}

runEdgeCases().catch(err => {
  console.error('Edge case execution error:', err);
  process.exit(1);
});
