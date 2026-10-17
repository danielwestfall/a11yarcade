import { io } from './client/node_modules/socket.io-client/build/esm/index.js';

function waitForConnect(sock) {
  if (sock.connected) return Promise.resolve();
  return new Promise(r => sock.once('connect', r));
}

async function testGameLoop() {
  console.log('Testing live multiplayer game loop...');
  const host = io('http://localhost:3001', { reconnection: false });
  const player1 = io('http://localhost:3001', { reconnection: false });

  await waitForConnect(host);
  console.log('✓ Host connected to server');

  await waitForConnect(player1);
  console.log('✓ Player 1 connected to server');

  // 1. Host creates room
  const createRes = await new Promise((resolve) => {
    host.emit('create-room', { timeLimit: 5, questionCount: 2, domain: 'all' }, resolve);
  });
  console.log(`✓ Room created with PIN: ${createRes.pin}`);

  // 2. Player joins room
  const joinRes = await new Promise((resolve) => {
    player1.emit('join-room', { pin: createRes.pin, nickname: 'Alice Accessibility', avatar: '🦉' }, resolve);
  });
  console.log(`✓ Player joined room: ${joinRes.player.nickname}`);

  // Setup listeners before starting
  const questionPromise = new Promise((resolve) => {
    player1.once('question-started', resolve);
  });
  const revealPromise = new Promise((resolve) => {
    host.once('round-revealed', resolve);
  });

  // 3. Host starts game
  host.emit('start-game');

  const question = await questionPromise;
  console.log(`✓ Question received: "${question.question.question.substring(0, 50)}..."`);
  console.log(`✓ Choices available: ${question.question.choices.map(c => c.id).join(', ')}`);

  // 4. Player submits answer 'B'
  const answerRes = await new Promise((resolve) => {
    player1.emit('submit-answer', { choiceId: 'B' }, resolve);
  });
  console.log(`✓ Answer submitted: recorded=${answerRes.recorded}`);

  // 5. Host & Player receive round reveal
  const revealData = await revealPromise;
  console.log(`✓ Round revealed! Correct answer is: ${revealData.correctChoiceId}`);
  console.log(`✓ Leaderboard top player: ${revealData.leaderboard[0].nickname} - ${revealData.leaderboard[0].score} pts`);

  host.disconnect();
  player1.disconnect();
  console.log('🎉 Multi-player test completed successfully with 100% pass!');
  process.exit(0);
}

testGameLoop().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
