# 🔴 A11y Arcade: Forensic Red Team Browser Torture Test
## Target Game: 🥔 Cabinet 01 — The Hot Potato Syndicate (Take or Pass & Social Dividend)

> **Test Methodology:** Tri-Viewport Browser Orchestration (Host Desktop, Hot Seat Cadet, & Drafted Delegate/Spectator), Keyboard-Only Interaction, Slot Machine Spin Inspection, Asymmetric Role Matrix, and Social Dividend Exploitation.  
> **Target URL:** `http://localhost:5173` (Vite Dev Server) or `http://localhost:3001` (Production Build)  
> **Evaluation Mode:** ADVERSARIAL, RIGOROUS, SYSTEMATIC  
> **Target Conformance:** WCAG 2.2 Level AA / WCAG 3.0 Silver Readiness

---

## 🎯 Red Team Mission Objective

Your mission is to perform a **forensic, multi-role browser audit** of **The Hot Potato Syndicate**. Unlike standard symmetrical quiz games, this mode features **3 distinct live roles** per round:
1. **Window A (Desktop Host):** `1920 × 1080` (Main room screen with slot-machine delegate visual and live spectator pot).
2. **Window B (Hot Seat Cadet):** `390 × 844` (Mobile touch viewport — receives teaser, decides **TAKE (T)** or **PASS (P)**).
3. **Window C (Drafted Delegate / Spectator Cadet):** `390 × 844` (Mobile touch viewport — spectator until drafted into Delegate Slot A or B).

You must test every state transition: blind concept teaser, slot-machine draft randomization, delegate answering isolation, and the room-wide **Social Dividend Payout Matrix**.

---

## 🛠️ Step 0: Test Environment Initialization

Launch local development instances:

```bash
# Terminal 1: Start Server
node server/index.js

# Terminal 2: Start Client
npm --prefix client run dev
```

### Viewport Setup:
1. **Window A (Host):** Google Chrome at `http://localhost:5173` (`1920 × 1080`).
2. **Window B (HotSeat):** Private/Incognito Window 1 at `http://localhost:5173` (`390 × 844` iPhone touch viewport).
3. **Window C (Spectator / Delegate):** Private/Incognito Window 2 at `http://localhost:5173` (`390 × 844` iPhone touch viewport).
4. **(Optional Window D):** Second spectator to verify equal division of the Social Dividend pot.

---

## 🧪 Phase 1: Lobby Setup, Asymmetric Registration & Passcode Check

### Test 1.1: Cartridge Mount & Room PIN Generation (Window A)
1. On **Window A (Host)**:
   - Click **`Cabinet 01: The Hot Potato Syndicate`**.
   - Verify card lights up with amber accent (`#f59e0b`) and `[DELEGATE ROULETTE // AI BOTS]`.
   - Set **Round Timer Limit** to `20 Seconds`.
   - Set **CPACC Domain Focus** to `All Domains`.
   - Click **`CREATE ARCADE ROOM`**.
   - Record the 4-digit PIN (e.g. `POTA`).

### Test 1.2: Multi-Cadet Passcode Verification (Windows B, C, & D)
1. In **Window B**: Join `POTA` with nickname `SarahHotSeat`, Passcode `1111`, avatar `🥔`.
2. In **Window C**: Join `POTA` with nickname `MarcusDel`, Passcode `2222`, avatar `⚡`.
3. In **Window D** (or automated socket): Join `POTA` with nickname `SamAudience`, Passcode `3333`, avatar `🦉`.
4. **Passcode Protection Verification:**
   - Attempt to join from a new tab with nickname `SarahHotSeat` with no passcode.
   - **Pass Criteria:** Connection rejected with `"Nickname 'SarahHotSeat' is registered. 4-digit PIN required."`
5. In Window A, verify all 3 cadets appear in the **Connected Squad Cadets (3/30)** roster.

---

## 🧪 Phase 2: Teaser Phase & Blind Risk Assessment

In **Window A (Host)**, click **`INSERT COIN / START GAME`**.

### Test 2.1: Asymmetric View Hiding (Zero-Knowledge Isolation)
1. The server enters `TEASER` state (20-second decision clock).
2. **Window B (HotSeat):**
   - Verify screen displays: **`🔥 YOU ARE IN THE HOT SEAT!`**
   - Verify only the **Concept Header** is revealed (e.g. `Universal Design for Learning (UDL)` or `Section 508 Refresh`).
   - **CRITICAL SECURITY CHECK:** Inspect the DOM and WebSocket payloads (`hp-teaser`). Verify the full question stem and answer choices are **NOT present** in the network payload (prevents client-side devtools cheating).
   - Verify two prominent actions: **`[T] TAKE (SOLO)`** (+100 / -50) and **`[P] PASS (DELEGATE)`** (Split / Dividend).
3. **Window C (Audience):**
   - Verify screen displays: **`🥔 SarahHotSeat is in the Hot Seat!`**
   - Verify action buttons are disabled or hidden for non-hotseat players.
4. **Keyboard Accessibility:**
   - In Window B, press key `T` or `P`. Verify HotSeat action triggers via single keystroke without mouse click.

---

## 🧪 Phase 3: The Delegate Roulette Draft & Slot Machine Visual

In Window B (Hot Seat), trigger **`[P] PASS (DELEGATE)`**.

### Test 3.1: Slot Machine Wheel Animation & Sensory Accommodations
1. Server transitions to `hp-delegates-drafted`.
2. In **Window A (Host)**:
   - Verify the digital slot-machine reel spins with rapid nickname cycling.
   - Verify earcon `playSlotSpin()` sounds.
   - After 1.2s, the wheel locks on **Delegate Slot A** (`MarcusDel`) and **Delegate Slot B** (`SamAudience`).
   - Verify earcon `playDraftAlert()` triggers.
   - **Reduced Motion Check:** If `prefers-reduced-motion` is active on Window A, verify the slot reel does not flicker rapidly and displays final names immediately.

### Test 3.2: Asymmetric Answering Permissions
1. **Window C (`MarcusDel` - Drafted Delegate):**
   - Screen illuminates: **`⚡ YOU WERE DRAFTED AS DELEGATE A!`**
   - Full question stem and 4 dual-coded choices (▲, ◆, ●, ■) appear with 45-second clock.
2. **Window B (`SarahHotSeat` - Hot Seat):**
   - Screen indicates: **`Delegates are answering your ticket... Sit tight!`**
   - Answer buttons are locked out.
3. **Out-of-Turn Injection Attack:**
   - From Window B DevTools Console, attempt to submit an answer:
     ```javascript
     socket.emit('hp-submit-delegate-answer', { choiceId: 'A' }, console.log);
     ```
   - **Pass Criteria:** Server returns `{ success: false, error: 'You are not a drafted delegate this round!' }`.

---

## 🧪 Phase 4: The 3 Settlement Outcomes & Social Dividend Matrix

Conduct 3 test rounds to verify the complete payout matrix:

### Scenario 4A: Total Backfire & The Social Dividend (`NEITHER_CORRECT`)
1. Both Delegate A (`MarcusDel`) and Delegate B (`SamAudience`) intentionally submit an incorrect answer.
2. **Round Settlement:**
   - Server triggers `NEITHER_CORRECT`.
   - Earcon `playCoinShower()` sounds.
   - Gold coin particles shower the screen.
   - **Dividend Allocation Math:** 100 points divided among all non-delegate spectators.
   - **Pass Criteria:** Spectator banks points directly from the Hot Seat blunder; live region announces `"Total Backfire! Social dividend of 100 points awarded to spectators!"`.

### Scenario 4B: Split Consensus (`ONE_CORRECT`)
1. In the next round, Delegate A submits the correct choice; Delegate B submits an incorrect choice.
2. **Round Settlement:**
   - Server triggers `ONE_CORRECT`.
   - Hot Seat player receives +50 points.
   - Correct Delegate receives +50 points.
   - Incorrect Delegate receives 0 points.
   - Spectators receive 0 points.
   - **Pass Criteria:** Leaderboard updates accurately reflect 50/50 split.

### Scenario 4C: Flawless Delegation (`BOTH_CORRECT`)
1. In the third round, both delegates submit the correct choice.
2. **Round Settlement:**
   - Server triggers `BOTH_CORRECT`.
   - Hot Seat player banks full +100 points.
   - Delegate A and Delegate B receive +50 points each.
   - Earcon `playCorrect()` sounds.
   - **Pass Criteria:** All 3 participants are awarded points simultaneously.

---

## 🧪 Phase 5: Chaos, Concurrency & Teardown

1. **Hot Seat Disconnect During 20s Decision:**
   - Close Window B while the Hot Seat teaser timer is at 12s.
   - **Pass Criteria:** Server detects disconnect, defaults ticket to `PASS`, drafts delegates automatically, or cleanly aborts round without freezing Window A.
2. **Rapid Key Spamming:**
   - While delegates are answering, spam keys `1`, `2`, `3`, `4` rapidly on Window C.
   - **Pass Criteria:** Exactly 1 answer locks in; subsequent key events are ignored (`hasSubmitted = true`).
3. **Session Teardown & Listener Integrity:**
   - On Window A, exit to lobby menu.
   - Return to mode selector and launch another cabinet (e.g. `Cabinet 02: Grand Prix`).
   - Open DevTools Console and verify:
     ```javascript
     // Confirm no duplicate timer-tick listeners exist
     console.log('Timer listeners:', socket.listeners('timer-tick').length);
     ```
   - **Pass Criteria:** Exactly 1 listener active. Zero listener accumulation.

---

## 📊 Red Team Evaluation Scoring Sheet

| Test Category | Item Tested | Expected Outcome | Score (1-5) |
| :--- | :--- | :--- | :--- |
| **Zero-Knowledge** | Teaser payload hiding | Full question stem omitted from teaser socket event | [  ] / 5 |
| **Asymmetric A11y** | Role-specific screens | Hot Seat, Delegate, and Spectator get distinct accessible views | [  ] / 5 |
| **Draft Fairness** | Slot machine wheel | Draft selects only active room cadets; respects reduced motion | [  ] / 5 |
| **Security** | Out-of-turn submission | Non-delegates cannot submit answers via socket injection | [  ] / 5 |
| **Economics** | Social Dividend math | 100 pts accurately divided among room spectators on backfire | [  ] / 5 |
| **Audio Policies** | Slot & coin earcons | Synthesizers trigger cleanly without unhandled audio errors | [  ] / 5 |
| **Resilience** | Hot Seat disconnect | Server recovers gracefully without infinite timer freeze | [  ] / 5 |
| **Total** | **Comprehensive Hot Potato Audit** | **Target: $\ge 33 / 35$ Points** | **[  ] / 35** |
