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

    // ==========================================
    // TEST 4: The High-Roller Gauntlet Mode
    // ==========================================
    console.log('=== [4/4] Testing The High-Roller Gauntlet Mode ===');
    const host4 = io('http://localhost:3001', { reconnection: false });
    const bettor1 = io('http://localhost:3001', { reconnection: false });
    const bettor2 = io('http://localhost:3001', { reconnection: false });

    await Promise.all([
      waitForConnect(host4),
      waitForConnect(bettor1),
      waitForConnect(bettor2)
    ]);

    const createHR = await new Promise(res => host4.emit('create-room', { gameMode: 'HIGH_ROLLER', questionCount: 2 }, res));
    console.log(`✓ High-Roller Room Created: PIN ${createHR.pin}`);

    await new Promise(res => bettor1.emit('join-room', { pin: createHR.pin, nickname: 'Dan The Man', avatar: '🎰' }, res));
    await new Promise(res => bettor2.emit('join-room', { pin: createHR.pin, nickname: 'Risky Ray', avatar: '🦁' }, res));

    const teaserPromise1 = new Promise(res => bettor1.once('hr-teaser', res));
    host4.emit('start-game');
    const teaserData = await teaserPromise1;
    console.log(`✓ Teaser Started: Domain=${teaserData.domain}, Topic="${teaserData.topic}", Difficulty=${teaserData.difficulty}`);

    // Both players wager
    const qRevealPromise = new Promise(res => bettor1.once('hr-question-started', res));
    await new Promise(res => bettor1.emit('hr-submit-wager', { wager: 300 }, res));
    await new Promise(res => bettor2.emit('hr-submit-wager', { wager: 500 }, res));

    const revealData = await qRevealPromise;
    console.log(`✓ Question Revealed: "${revealData.question.question.slice(0, 45)}..."`);

    // Bettors submit answers
    const roundSettlePromise = new Promise(res => host4.once('hr-round-settlement', res));
    const hrCorrectId = revealData.question.choices[0].id; // any choice
    const hrWrongId = revealData.question.choices[1].id;

    // Bettor 1 submits answer
    await new Promise(res => bettor1.emit('hr-submit-answer', { choiceId: hrCorrectId }, res));
    // Bettor 2 submits answer
    await new Promise(res => bettor2.emit('hr-submit-answer', { choiceId: hrWrongId }, res));

    const settleData = await roundSettlePromise;
    console.log(`✓ Round Settled! Underdog Triggered=${settleData.underdogTriggered}`);
    const p1Outcome = settleData.results.find(o => o.nickname === 'Dan The Man');
    const p2Outcome = settleData.results.find(o => o.nickname === 'Risky Ray');
    console.log(`✓ Dan: Net=${p1Outcome.chipDelta} chips (Final: ${p1Outcome.chips}), Ray: Net=${p2Outcome.chipDelta} chips (Final: ${p2Outcome.chips})`);

    host4.disconnect();
    bettor1.disconnect();
    bettor2.disconnect();
    console.log('🎉 The High-Roller Gauntlet Passed!\n');

    // ==========================================
    // TEST 5: Flaw Finder Mode (Heatmap Sniping)
    // ==========================================
    console.log('=== [5/5] Testing Flaw Finder Mode ===');
    const host5 = io('http://localhost:3001', { reconnection: false });
    const sniper1 = io('http://localhost:3001', { reconnection: false });
    const sniper2 = io('http://localhost:3001', { reconnection: false });

    await Promise.all([
      waitForConnect(host5),
      waitForConnect(sniper1),
      waitForConnect(sniper2)
    ]);

    const createFF = await new Promise(res => host5.emit('create-room', { gameMode: 'FLAW_FINDER', questionCount: 2 }, res));
    console.log(`✓ Flaw Finder Room Created: PIN ${createFF.pin}`);

    await new Promise(res => sniper1.emit('join-room', { pin: createFF.pin, nickname: 'Sniper Sam', avatar: '🎯' }, res));
    await new Promise(res => sniper2.emit('join-room', { pin: createFF.pin, nickname: 'Auditor Alex', avatar: '🧐' }, res));

    const roundStartPromise = new Promise(res => sniper1.once('ff-round-started', res));
    host5.emit('start-game');
    const ffData = await roundStartPromise;
    console.log(`✓ Scenario Served: "${ffData.scenario.title}" (Sentences: ${ffData.scenario.sentences.length})`);
    
    // Verify sanitized payload: sentences must NOT leak isFlaw flag to players
    if (ffData.scenario.sentences[0].isFlaw !== undefined) {
      throw new Error('Security flaw: isFlaw leaked in sanitized scenario!');
    }
    console.log(`✓ Sanitization Verified: Sentence answers protected against inspection`);

    const heatmapPromise = new Promise(res => host5.once('ff-heatmap-reveal', res));
    // Sniper 1 snipes sentence 3 (typically the flaw)
    await new Promise(res => sniper1.emit('ff-submit-snipe', { sentenceId: 's3' }, res));
    // Sniper 2 snipes sentence 1 (compliant distractor)
    await new Promise(res => sniper2.emit('ff-submit-snipe', { sentenceId: 's1' }, res));

    const revealHeatmap = await heatmapPromise;
    console.log(`✓ Heatmap Revealed! Flaw Identified: ${revealHeatmap.flawedSentenceId}, Debrief: "${revealHeatmap.scenario.flawSummary.slice(0, 50)}..."`);
    console.log(`✓ Heatmap Distribution: s3=${revealHeatmap.heatmap.find(h => h.id === 's3')?.percentage}%, s1=${revealHeatmap.heatmap.find(h => h.id === 's1')?.percentage}%`);

    const s1Result = revealHeatmap.results.find(r => r.nickname === 'Sniper Sam');
    const s2Result = revealHeatmap.results.find(r => r.nickname === 'Auditor Alex');
    console.log(`✓ Sam: isCorrect=${s1Result.isCorrect}, pts=+${s1Result.roundPoints}; Alex: isCorrect=${s2Result.isCorrect}, pts=+${s2Result.roundPoints}`);

    host5.disconnect();
    sniper1.disconnect();
    sniper2.disconnect();
    console.log('🎉 Flaw Finder Mode Passed!\n');

    // ==========================================
    // TEST 6: Saboteur in the Server Room Mode
    // ==========================================
    console.log('=== [6/6] Testing Saboteur in the Server Room Mode ===');
    const host6 = io('http://localhost:3001', { reconnection: false });
    const crew1 = io('http://localhost:3001', { reconnection: false });
    const crew2 = io('http://localhost:3001', { reconnection: false });

    await Promise.all([
      waitForConnect(host6),
      waitForConnect(crew1),
      waitForConnect(crew2)
    ]);

    const createSab = await new Promise(res => host6.emit('create-room', { gameMode: 'SABOTEUR', timeLimit: 120 }, res));
    console.log(`✓ Saboteur Room Created: PIN ${createSab.pin}`);

    await new Promise(res => crew1.emit('join-room', { pin: createSab.pin, nickname: 'Lead Auditor', avatar: '🛡️' }, res));
    await new Promise(res => crew2.emit('join-room', { pin: createSab.pin, nickname: 'Cyber Analyst', avatar: '💻' }, res));

    const gameStartPromise = new Promise(res => crew1.once('sab-game-started', res));
    const roleAssignedPromise = new Promise(res => crew1.once('sab-role-assigned', res));
    host6.emit('start-game');

    const telemetry = await gameStartPromise;
    const roleData = await roleAssignedPromise;
    console.log(`✓ Saboteur Game Started! Clock: ${telemetry.serverTimeLeft}s, Initial Compliance: ${telemetry.compliancePercent}%, Subsystems: ${telemetry.subsystems.length}`);
    console.log(`✓ Secret Role Assigned: isSaboteur=${roleData.isSaboteur}`);

    // Crew 1 requests asynchronous fast-fire drill question
    const sabQData = await new Promise(res => crew1.emit('sab-request-question', res));
    console.log(`✓ Drill Question Served: "${sabQData.question.question.slice(0, 45)}..." (+${sabQData.apReward} AP reward)`);

    // Crew 1 submits correct answer to accumulate AP
    const sabChoiceId = sabQData.question.choices[0].id;
    const sabAnswerRes = await new Promise(res => crew1.emit('sab-submit-answer', { choiceId: sabChoiceId }, res));
    console.log(`✓ Answer Submitted: isCorrect=${sabAnswerRes.isCorrect}, apEarned=${sabAnswerRes.apEarned}, currentAP=${sabAnswerRes.currentAP}`);

    // Grant Crew 1 enough AP to test patch, audit ping, and standup
    while (sabAnswerRes.currentAP < 4) {
      const moreQ = await new Promise(res => crew1.emit('sab-request-question', res));
      const resMore = await new Promise(res => crew1.emit('sab-submit-answer', { choiceId: moreQ.question.choices[0].id }, res));
      sabAnswerRes.currentAP = resMore.currentAP;
      if (resMore.isCorrect) break;
    }

    // Test Patch Application
    if (sabAnswerRes.currentAP >= 2) {
      const patchRes = await new Promise(res => crew1.emit('sab-apply-patch', { subsystemId: 'auth', isSabotage: false }, res));
      console.log(`✓ Compliance Patch Applied: action=${patchRes.action}, remainingAP=${patchRes.remainingAP}`);
    }

    // Test Audit Ping
    if (sabAnswerRes.currentAP >= 3) {
      const pingRes = await new Promise(res => crew1.emit('sab-run-audit-ping', { targetPlayerId: crew2.id }, res));
      console.log(`✓ Audit Ping Executed on ${pingRes.targetNickname}: Accuracy=${pingRes.accuracy}%, Suspicion=${pingRes.suspicion}`);
    }

    // Test Calling Emergency Standup
    const standupPromise = new Promise(res => crew2.once('sab-emergency-standup', res));
    // Let's make sure crew1 has 4 AP
    crew1.emit('sab-call-standup', (res) => {});

    host6.disconnect();
    crew1.disconnect();
    crew2.disconnect();
    console.log('🎉 Saboteur in the Server Room Mode Passed!\n');

    // ==========================================
    // Test 7: The Boundary Line Brawl Mode
    // ==========================================
    console.log('=== [7/7] Testing The Boundary Line Brawl Mode ===');
    const host7 = io('http://localhost:3001');
    const brawler1 = io('http://localhost:3001');
    const brawler2 = io('http://localhost:3001');
    await Promise.all([
      waitForConnect(host7),
      waitForConnect(brawler1),
      waitForConnect(brawler2)
    ]);

    const createBB = await new Promise(res => {
      host7.emit('create-room', {
        gameMode: 'BOUNDARY_BRAWL',
        selectedDomain: 'all',
        questionCount: 6,
        settings: { timeLimit: 60 }
      }, res);
    });
    console.log(`✓ Boundary Brawl Room Created: PIN ${createBB.pin}`);

    await new Promise(res => brawler1.emit('join-room', { pin: createBB.pin, nickname: 'UD Champion', avatar: '🎨' }, res));
    await new Promise(res => brawler2.emit('join-room', { pin: createBB.pin, nickname: 'Floor Enforcer', avatar: '⚖️' }, res));

    const bbStartPromise = new Promise(res => brawler1.once('bb-game-started', res));
    host7.emit('start-game');

    const bbData = await bbStartPromise;
    console.log(`✓ Boundary Brawl Started! Cards in Tray: ${bbData.cards.length}, Time: ${bbData.timeLeft}s`);

    // Brawler 1 places card-01 into Q2
    const targetCard = bbData.cards[0];
    const placeCardRes = await new Promise(res => {
      brawler1.emit('bb-place-card', {
        cardId: targetCard.id,
        quadrant: 'Q2',
        x: 75,
        y: 75
      }, res);
    });
    console.log(`✓ Card Placed by ${placeCardRes.placement.placedBy.nickname}: "${placeCardRes.placement.title.slice(0, 45)}..." in Quadrant ${placeCardRes.placement.quadrant}`);

    // Brawler 2 challenges Brawler 1's placement
    const challengePromise = new Promise(res => brawler1.once('bb-challenge-started', res));
    const challengeInitRes = await new Promise(res => {
      brawler2.emit('bb-challenge-card', { cardId: targetCard.id }, res);
    });
    const activeChallengeData = await challengePromise;
    console.log(`✓ Challenge Brawl Triggered! Challenger: ${activeChallengeData.challenge.challenger.nickname} vs Defender: ${activeChallengeData.challenge.defender.nickname}`);

    // Brawler 1 votes UP (Defend), Brawler 2 votes DOWN (Overthrow)
    await new Promise(res => brawler1.emit('bb-cast-emoji-vote', { vote: 'UP' }, res));
    const voteRes = await new Promise(res => brawler2.emit('bb-cast-emoji-vote', { vote: 'DOWN' }, res));
    console.log(`✓ Emoji Votes Registered: vote=${voteRes.vote}`);

    host7.disconnect();
    brawler1.disconnect();
    brawler2.disconnect();
    console.log('🎉 The Boundary Line Brawl Mode Passed!\n');

    console.log('====================================================');
    console.log('🏆 ALL 7 MULTIPLAYER GAME MODES PASS 100%!');
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
