# 🔴 A11y Arcade: Deep-Dive Browser Red Team Torture Test
## Target Game: 👾 Cabinet 07 / 08 — The Enterprise Boss Raid & Tech Tree

> **Test Methodology:** Dual-Viewport Browser Orchestration (Host Desktop + Cadet Mobile), Keyboard-Only Interaction, Screen Reader Tree Inspection, and Chaos Injection.  
> **Target URL:** `http://localhost:5173` (Vite Dev Server) or `http://localhost:3001` (Production Build)  
> **Evaluation Mode:** ADVERSARIAL, RIGOROUS, SYSTEMATIC  
> **Target Conformance:** WCAG 2.2 Level AA, WCAG 3.0 Silver Readiness

---

## 🎯 Red Team Mission Objective

Your mission is to perform a **forensic, end-to-end browser audit** of **The Enterprise Boss Raid**. You will orchestrate two simultaneous browser sessions:
1. **Window A (Desktop Host):** `1920 × 1080` (Screen share view for the team/meeting).
2. **Window B (Mobile Cadet):** `390 × 844` (Emulated iPhone 14 touch device).

You must test every state transition from lobby creation to the Capstone Strike, attempting to break layout reflow, keyboard focus management, ARIA announcements, and damage calculations.

---

## 🛠️ Step 0: Test Environment Initialization

Launch the local development environment:

```bash
# Terminal 1: Start Backend Server
node server/index.js

# Terminal 2: Start Vite Client
npm --prefix client run dev
```

1. Open **Browser Window A (Host)** in Google Chrome at `http://localhost:5173`. Resize to `1920 × 1080`.
2. Open **Browser Window B (Player)** in an Incognito / Private window at `http://localhost:5173`. Open Chrome DevTools (`F12`), toggle **Device Toolbar** (`Ctrl+Shift+M`), and select **iPhone 12/13/14 Pro** (`390 × 844`).

---

## 🧪 Phase 1: Lobby Setup, Passcode Auth & Mobile Reflow

### Test 1.1: Mobile Viewport & Touch Target Audit (Window B)
1. In Window B (Cadet Mobile), verify that the header, tabs, and Station 1 (`Join as Player`) fit cleanly on the screen without horizontal scrolling (`overflow-x: hidden`).
2. Open DevTools Console and execute:
   ```javascript
   // Verify touch target dimensions (WCAG 2.2 SC 2.5.8 >= 44x44px)
   document.querySelectorAll('button, input, select').forEach(el => {
     const rect = el.getBoundingClientRect();
     if (rect.width < 44 || rect.height < 44) {
       console.warn('Touch target undersized (<44px):', el, `${rect.width}x${rect.height}`);
     }
   });
   ```
3. **Pass Criteria:** Zero warnings. All buttons and inputs measure $\ge 44 \times 44\text{px}$.

### Test 1.2: Passcode Hijacking & Room Creation (Window A & B)
1. In **Window A (Host)**:
   - Select the cartridge: Click on **`Cabinet 07: The Enterprise Boss Raid`**.
   - Verify the cartridge card highlights in vibrant purple with the `[ACTIVE CARTRIDGE]` badge.
   - Click **`CREATE ARCADE ROOM`**.
   - Record the 4-digit Room PIN (e.g., `BOSS`).
2. In **Window B (Player)**:
   - Enter Room PIN: `BOSS`.
   - Enter Cadet Nickname: `RaidLeader`.
   - Enter 4-Digit Passcode: `9988`.
   - Select avatar: `🛡️`.
   - Click **`JOIN WITH TOKEN`**.
3. **Verification:**
   - Window A instantly displays `RaidLeader 🛡️` under **Connected Squad Cadets (1/30)**.
   - Open a third tab (Attacker) and attempt to join room `BOSS` with nickname `RaidLeader` without a PIN.
   - **Pass Criteria:** Attacker is blocked with `"Nickname 'RaidLeader' is registered. 4-digit PIN required."`

---

## 🧪 Phase 2: Theme Switching & A11y Suite Torture

Execute these tests directly in **Window B (Player)**:

1. Press `Alt + A` on the keyboard to open the **Accessibility Features Menu**.
   - Verify focus is automatically trapped inside the `<dialog>` modal.
   - Press `Tab` through all controls; verify focus cycles without escaping into the page behind.
2. **Switch to Crisp Light Mode:**
   - Select `Crisp Light Mode`.
   - Inspect background and text color in DevTools: verify text `#090d16` on `#ffffff` canvas yields $> 15:1$ contrast (WCAG AAA).
3. **Switch to High Contrast Theme:**
   - Select `High Contrast (12:1)`.
   - Verify background is pure obsidian `#000000` and text/borders are neon yellow `#facc15`.
4. **Enable Dyslexia Font & Reading Focus Ruler:**
   - Select `OpenDyslexic` font.
   - Toggle **`Reading Focus Ruler`** on.
   - Close modal with `Escape`. Confirm focus returns to the `Alt + A` trigger button.
   - Press `Tab` through the page; **verify the horizontal reading ruler follows the focused element down the screen**.
5. Switch back to **Dark Cyberpunk** theme for combat testing.

---

## 🧪 Phase 3: The Enterprise Boss Raid Combat Torture

In **Window A (Host)**, click **`INSERT COIN / START GAME`**.

### Test 3.1: Tech Tree Navigation & Prerequisite Lockout
1. **Host Screen (Window A):**
   - Verify Boss Monolith displays at **500 / 500 HP**.
   - Verify all 3 Elemental Shields display at **100 / 100 HP**:
     - 📜 *Procurement Aegis* (Blue)
     - 🎧 *Assistive Tech Barrier* (Green)
     - 🏛️ *Governance Barrier* (Amber)
   - Verify Tier 2 nodes are visually locked and disabled until Tier 1 is cleared.
2. In **Window B (Player)**:
   - Attempt to click or keyboard-select a Tier 2 node (`node-a2`).
   - **Pass Criteria:** Action is rejected with `"Prerequisite must be solved first!"`.

### Test 3.2: Dual-Coded Strike & Damage Allocation
1. In Window B, select **Node A1 (`Section 508 Refresh & Federal Scope`)**.
2. Combat Screen triggers:
   - Check the 4 answer buttons: Verify they display dual-coded shapes (▲, ◆, ●, ■) alongside colors and text.
   - Using keyboard only, press `2` or click **`◆ Choice B: The vendor must provide an accredited Accessibility Conformance Report (ACR) based on VPAT 2.4+`**.
3. **Observe Resolution:**
   - Earcon `playBossDamage()` sounds.
   - Web Audio earcon `playBuffUnlocked()` triggers.
   - Passive Buff **`⚖️ Legal Piercer (+25% damage)`** appears in the active buff tray.
   - **Shield Telemetry:** Procurement Shield drops from **100 HP $\to$ 50 HP**. Boss HP remains at **500 HP**.
   - Explanation drawer opens displaying CPACC citations: press `Tab` and verify the explanation box receives focus (`tabIndex={0}`).

### Test 3.3: Shield Damage Overflow Exploit (Finding 3 Regression Test)
1. In Window A (Host), click **`RETURN TO TECH TREE`** (or press `Space`).
2. In Window B, select newly unlocked **Node A2 (`EN 301 549 & Transnational Audits`)**.
3. Note combat mathematics:
   - Base damage: `50 DMG`.
   - With `Legal Piercer` (+25%): Total strike = `63 DMG`.
   - Procurement Shield has only `50 HP` remaining.
4. Answer correctly with **`▲ Choice A: EN 301 549 Clause 9 harmonizes directly with WCAG 2.1 Level AA`**.
5. **Verify Damage Overflow:**
   - Procurement Shield drops to **0 HP** and shatters (`playShieldBreak()` plays).
   - **CRITICAL CHECK:** Verify the **13 excess damage** overflows and damages the Boss directly.
   - **Pass Criteria:** Boss HP must display **487 / 500 HP** (NOT 500/500).

---

## 🧪 Phase 4: Chaos & Concurrency Stress Test

During combat in **Node B1 (`Screen Reader & Assistive Tech Pairing`)**:

1. **Rapid Double-Submit Spam:**
   - In DevTools Console of Window B, run:
     ```javascript
     for (let i = 0; i < 10; i++) {
       window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
     }
     ```
   - **Pass Criteria:** Server registers exactly 1 answer. No duplicate damage or double counter-attacks occur.
2. **Network Interruption (Mid-Game Disconnect):**
   - In Window B DevTools Network tab, set Throttling to **Offline** for 4 seconds, then set back to **No Throttling**.
   - If disconnected, refresh the page and enter Room PIN `BOSS`, Nickname `RaidLeader`, Passcode `9988`.
   - **Pass Criteria:** Player re-enters active raid seamlessly with their accumulated score and active buffs intact.
3. **Host Screen Share Resizing:**
   - In Window A, resize the browser from `1920px` down to `768px` tablet view.
   - **Pass Criteria:** The 3 elemental shield meters and the tech tree branches collapse from 3 columns into a clean single-column accordion without clipping or horizontal overflow.

---

## 🧪 Phase 5: The Capstone Strike & Victory Fanfare

1. Clear remaining nodes until all 3 shields reach **0 HP**.
2. Verify **`⚠️ ALL 3 ELEMENTAL SHIELDS SHATTERED!`** banner illuminates.
3. Verify the **`⚡ EXECUTE CAPSTONE STRIKE`** button unlocks.
4. Trigger the Capstone Strike:
   - Answer the final enterprise governance question.
   - Verify the 200 DMG finishing blow destroys the Monolith.
   - Verify synthesized 8-bit `playVictoryFanfare()` plays.
   - Verify canvas confetti triggers with `prefers-reduced-motion` compliance.

---

## 📊 Red Team Evaluation Scoring Sheet

| Test Category | Item Tested | Expected Outcome | Score (1-5) |
| :--- | :--- | :--- | :--- |
| **A11y Touch** | Mobile touch target sizing | All interactive targets $\ge 44 \times 44\text{px}$ | [  ] / 5 |
| **A11y Focus** | Keyboard focus & ruler | Tab navigation clean; Reading Ruler tracks focus | [  ] / 5 |
| **A11y Contrast**| Themes & border contrast | Light mode $>15:1$, Dark mode borders $>3.0:1$ | [  ] / 5 |
| **Auth** | Option B Passcode | Registered nicknames protected from hijacking | [  ] / 5 |
| **Combat Math** | Shield damage overflow | Excess damage accurately strikes Boss HP | [  ] / 5 |
| **Resilience** | Mid-round reconnect | Player rejoins active combat without lockout | [  ] / 5 |
| **Audio** | Web Audio policies | Earcons play cleanly without unhandled rejections | [  ] / 5 |
| **Total** | **Comprehensive Boss Raid Audit** | **Target: $\ge 33 / 35$ Points** | **[  ] / 35** |
