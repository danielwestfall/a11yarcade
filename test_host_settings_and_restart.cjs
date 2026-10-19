const io = require('./client/node_modules/socket.io-client');
const assert = require('assert');

const SERVER_URL = 'http://localhost:3001';

async function runHostSettingsTest() {
  console.log('🧪 Starting Host Settings Adjustment, Return-to-Lobby, & Stop-Hosting Verification...');

  // 1. Connect Host and 2 Cadets
  const host = io(SERVER_URL, { reconnection: false });
  const cadet1 = io(SERVER_URL, { reconnection: false });
  const cadet2 = io(SERVER_URL, { reconnection: false });

  await Promise.all([
    new Promise(res => host.on('connect', res)),
    new Promise(res => cadet1.on('connect', res)),
    new Promise(res => cadet2.on('connect', res))
  ]);
  console.log('✅ Host and 2 Cadets connected.');

  // 2. Host creates room with default settings (CLASSIC, 10 questions, 20s timer, all tracks)
  let roomPin = null;
  await new Promise((resolve, reject) => {
    host.emit('create-room', {
      gameMode: 'CLASSIC',
      timeLimit: 20,
      questionCount: 10,
      certTrack: 'all'
    }, (res) => {
      if (res && res.success) {
        roomPin = res.pin;
        console.log(`✅ Room ${roomPin} created with initial settings: 10 Qs, 20s, All Tracks.`);
        resolve();
      } else {
        reject(new Error('Failed to create room'));
      }
    });
  });

  // 3. Cadets join room
  await Promise.all([
    new Promise(res => cadet1.emit('join-room', { pin: roomPin, nickname: 'Cadet1', userPin: '1111' }, res)),
    new Promise(res => cadet2.emit('join-room', { pin: roomPin, nickname: 'Cadet2', userPin: '2222' }, res))
  ]);
  console.log('✅ Cadets joined room successfully.');

  // 4. Test Live Settings Adjustment in Lobby:
  // Host updates timeLimit to 15, certTrack to 'was', and questionCount to 5
  console.log('🔄 Host updating settings on the fly...');
  const settingsUpdatedPromiseCadet1 = new Promise((resolve) => {
    cadet1.on('room-settings-updated', resolve);
  });
  const settingsUpdatedPromiseCadet2 = new Promise((resolve) => {
    cadet2.on('room-settings-updated', resolve);
  });

  const updateResult = await new Promise((resolve) => {
    host.emit('update-room-settings', {
      timeLimit: 15,
      certTrack: 'was',
      questionCount: 5,
      domain: 'all'
    }, resolve);
  });

  assert.strictEqual(updateResult.success, true, 'Settings update should succeed');
  assert.strictEqual(updateResult.settings.timeLimit, 15, 'Time limit should be updated to 15');
  assert.strictEqual(updateResult.settings.certTrack, 'was', 'Cert track should be updated to was');
  assert.strictEqual(updateResult.questionCount, 5, 'Question count should be updated to 5');

  const [cadet1Settings, cadet2Settings] = await Promise.all([
    settingsUpdatedPromiseCadet1,
    settingsUpdatedPromiseCadet2
  ]);

  assert.strictEqual(cadet1Settings.settings.timeLimit, 15, 'Cadet 1 received timeLimit update');
  assert.strictEqual(cadet1Settings.settings.certTrack, 'was', 'Cadet 1 received certTrack update');
  assert.strictEqual(cadet2Settings.questionCount, 5, 'Cadet 2 received questionCount update');
  console.log('✅ PASS: Settings live adjustment successfully applied and broadcast to all connected players!');

  // 5. Host starts game with the updated settings
  console.log('🚀 Host starting game with new settings...');
  const qStartedPromise = new Promise(resolve => cadet1.on('question-started', resolve));
  host.emit('start-game');
  const qData = await qStartedPromise;

  assert.strictEqual(qData.timeLimit, 15, 'Round started with updated 15s time limit');
  assert.strictEqual(qData.totalQuestions, 5, 'Round started with updated 5 question count');
  console.log('✅ PASS: Match started with new 15s timer and 5 total questions.');

  // 6. Test Restart to Lobby (Mid-Game Halt without dropping players)
  console.log('🔄 Host restarting match back to Lobby...');
  const lobbyReturnPromiseCadet1 = new Promise(resolve => cadet1.on('room-returned-to-lobby', resolve));
  const lobbyReturnPromiseCadet2 = new Promise(resolve => cadet2.on('room-returned-to-lobby', resolve));

  const returnResult = await new Promise(resolve => host.emit('return-to-lobby', resolve));
  assert.strictEqual(returnResult.success, true, 'Return to lobby should succeed');

  const [c1Lobby, c2Lobby] = await Promise.all([
    lobbyReturnPromiseCadet1,
    lobbyReturnPromiseCadet2
  ]);

  assert.strictEqual(c1Lobby.players.length, 2, 'Cadets remain in room on return to lobby');
  assert.strictEqual(c2Lobby.players.length, 2, 'Cadets remain in room on return to lobby');
  console.log('✅ PASS: Host halted in-progress match and returned everyone to Lobby without kicking players.');

  // 7. Host switches cartridge and updates curriculum again from the lobby
  console.log('🔄 Host switching cartridge and adjusting section filter...');
  const secondUpdate = await new Promise(resolve => {
    host.emit('update-room-settings', {
      gameMode: 'GRAND_PRIX',
      timeLimit: 30,
      questionCount: 8,
      certTrack: 'cpacc'
    }, resolve);
  });
  assert.strictEqual(secondUpdate.settings.gameMode, 'GRAND_PRIX', 'Game mode changed to GRAND_PRIX');
  assert.strictEqual(secondUpdate.settings.timeLimit, 30, 'Time limit changed to 30');
  console.log('✅ PASS: Host re-configured match settings while back in Lobby.');

  // 8. Test Stop Hosting (Clean Room Teardown)
  console.log('🛑 Host stopping hosting / closing room...');
  const hostDisconnectPromiseCadet1 = new Promise(resolve => cadet1.on('host-disconnected', resolve));
  const hostDisconnectPromiseCadet2 = new Promise(resolve => cadet2.on('host-disconnected', resolve));

  const stopResult = await new Promise(resolve => host.emit('stop-hosting', resolve));
  assert.strictEqual(stopResult.success, true, 'Stop hosting should succeed');

  await Promise.all([hostDisconnectPromiseCadet1, hostDisconnectPromiseCadet2]);
  console.log('✅ PASS: All cadets received host-disconnected event on stop-hosting.');

  // Clean up
  host.disconnect();
  cadet1.disconnect();
  cadet2.disconnect();

  console.log('\n🏆 ALL HOST SETTINGS & LIFECYCLE TESTS PASSED (100%)!');
}

runHostSettingsTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
