# 🎮 A11y Arcade
### The Mario Party of Accessibility & CPACC Certification Mastery

> An accessible, real-time multiplayer party game and solo training suite for team meetings, accessibility workshops, and IAAP CPACC certification prep. Grounded in the **IAAP CPACC Body of Knowledge (BoK)**.

[![GitHub Repo](https://img.shields.io/badge/GitHub-danielwestfall%2Fa11yarcade-blue?logo=github)](https://github.com/danielwestfall/a11yarcade)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Accessibility: WCAG 2.1 AA](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🌟 Interactive Game Modes

### 1. 🥔 Mode A: The Hot Potato Syndicate (Take or Pass)
* **Asymmetric Risk & Delegation Dynamic**: The active player in the "Hot Seat" sees only the high-level **Concept Header** (and 100 pt base value) before deciding whether to tackle it alone for full glory or pass the buck to an unwitting syndicate of two randomly drafted peers!
* **The Social Dividend Celebration**: If the active player passes and **both delegates miss**, 100 points are divided equally among all spectators in the room! The audience actively roots for delegates to blunder, turning every turn into high-stakes drama.
* **Payout Matrix**:
  * **Solo Correct**: Active Player +100 pts. Solo Miss: -50 pts.
  * **Delegates Both Correct**: Active Player +100 pts, Delegates split +50 pts each.
  * **1 Correct / 1 Miss**: Active Player takes +50% cut (+50 pts), Correct Solver earns +50 pts.
  * **Neither Correct**: Backfire! 100 Points divided equally among all spectators.

### 2. 🏎️ Mode B: The Grand Prix: Apex Gambler
* **Tactical 100-Meter Racing Engine**: Raw typing speed loses to risk assessment and knowing when to fold.
* **The Gear Shift Engine**:
  * **1st Gear (Safe / Easy)**: $+10\text{m} / -10\text{m}$ / $5\text{s}$ Pit freeze.
  * **2nd Gear (Cruise / Medium)**: $+25\text{m} / -25\text{m}$ / $10\text{s}$ Pit freeze.
  * **3rd Gear (Turbo / Hard)**: $+50\text{m} / -50\text{m}$ / $20\text{s}$ Pit freeze.
* **Tactical Features**:
  * **The Pit Lane Pass**: Players can fold a trap question for $0\text{m}$ loss, taking a timed freeze overlay while rivals race ahead.
  * **The Drift Bonus**: 3 consecutive correct answers grant $+10\text{m}$ Drafting Boost.
  * **Course Hazards**:
    * **25m Hairpin Turn**: 3rd Gear is locked out.
    * **50m Slipstream Zone**: Trailing within 15m of leader gives $1.5\times$ reward on correct answers.
    * **80m+ Final Straightaway**: Pit Lane is closed; every question must be answered!
* **Visual 2D Racetrack**: Real-time multi-lane track displaying live racer avatars, landmark flags, and broadcast commentary.

### 3. 🎯 Mode C: Classic Kahoot Clash
* Speed + accuracy scoring, live leaderboard, answer distribution bar charts, and grand podium finale.

---

## 📱 Instant Joining: QR Code & 1-Click Sharable Link
* **Meeting Host Lobby**: Displays an automatic high-contrast **QR Code** and a **1-click "Copy Invite Link"** button.
* **Auto-Join**: Opening `https://your-domain/?pin=ABCD` instantly pre-fills the PIN and guides players directly to choose an avatar and jump in.

---

## 🤖 Solo & Independent AI Bot Modes (Play Anytime)
Don't have a team meeting or active room? You can play full matches anytime against simulated AI peers:
1. **🥔 Solo Hot Potato (AI Study Peers)**:
   * Play with 3 simulated colleagues: **Ada Alt-Text** (WCAG pro), **Devin Div** (Front-End/AT), and **Jordan Juris** (Policy/Law).
   * Bots take or pass based on their domain specialties. If both bots miss, **you collect the Social Dividend!**
2. **🏎️ Solo Grand Prix (AI Bot Racers)**:
   * Race against 3 distinct bot drivers: **Safe Sal** (reliable 1st gear), **Balanced Bea** (2nd gear with smart pit stops), and **Turbo Tina** (aggressive 3rd gear gambler).
3. **🎓 Classic Solo Practice**: Self-paced drill filtered by Domains 1, 2, or 3 with zero timer pressure.

---

## 🏆 Persistent Storage, Weekly Leaderboard & Study Hub
* **🎮 Host Can Play Along**: Hosts can check *"Play along as Host on this screen"* to compete and answer directly alongside participants.
* **📊 Weekly & All-Time Leaderboards**: Every game automatically records scores, wins, games played, and best scores into `data/game_history.json`. Toggle between **This Week's Standings** and the **All-Time Hall of Fame**.
* **🧠 Missed Questions Study Hub**: Every missed question across all modes is automatically logged with its official CPACC BoK reference, domain, and full rationale so coworkers can focus on what they need to master!

---

## ☁️ Deploying the Backend on Render.com (100% Free)

Because A11y Arcade uses **Socket.IO WebSockets** for real-time room communication and timer synchronization, Render.com's free web service tier is the ideal home for the backend.

### Option A: 1-Click Render Blueprint (Recommended)
This repository includes a `render.yaml` Blueprint file.
1. Sign up / Log in to [Render.com](https://render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository (`https://github.com/danielwestfall/a11yarcade`).
4. Click **Apply**. Render will automatically detect `render.yaml`, build the client, and start the Socket.IO server on your free `https://<service-name>.onrender.com` domain!

### Option B: Manual Web Service Setup on Render
1. In Render dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository (`danielwestfall/a11yarcade`).
3. Set the following settings:
   * **Name**: `a11yarcade` (or any custom name)
   * **Region**: Oregon (US West) or Ohio (US East)
   * **Runtime**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`
4. Click **Deploy Web Service**.

> **Note**: Because the server automatically serves the built frontend (`client/dist`), visiting your Render URL (e.g. `https://a11yarcade.onrender.com`) immediately launches the full game with zero extra configuration!

### Hosting Frontend on GitHub Pages (Optional Dual-Tier)
If you prefer your frontend on `https://danielwestfall.github.io/a11yarcade`:
1. In `client/` create `.env.production`:
   ```bash
   VITE_SERVER_URL=https://<your-service-name>.onrender.com
   ```
2. Build client: `npm run build`
3. Push `client/dist` to GitHub Pages.

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/danielwestfall/a11yarcade.git
cd a11yarcade
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Run Local Dev Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

### 3. Run Automated Tests
```bash
node test_phase1_games.js
```

---

## 🕹️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `1` or `A` | Select Red Triangle (▲) / 1st Gear |
| `2` or `B` | Select Blue Diamond (◆) / 2nd Gear |
| `3` or `C` | Select Amber Circle (●) / 3rd Gear |
| `4` or `D` | Select Green Square (■) |
| `T` | Take Question (Hot Potato) |
| `P` | Pass Question / Take Pit Stop |
| `Tab` / `Shift+Tab` | Navigate interactive elements |
| `Space` / `Enter` | Activate selected button |
| `Esc` | Close dialogs / modals |

---

## 🏆 CPACC Body of Knowledge Domains Covered

1. **Domain 1: Disabilities, Challenges, and Assistive Technologies (40%)**
   * Theoretical Models of Disability (Medical, Social, Economic, Charity, Functional Solutions)
   * Visual, Auditory, Speech, Motor, Cognitive, Seizure, and Psychological disabilities
   * Assistive Technologies (Screen readers, braille, screen magnifiers, switches, eye tracking)
   * Global demographics (WHO 1.3B / 16%) and disability etiquette
2. **Domain 2: Accessibility and Universal Design (34%)**
   * Universal Design vs Accommodations & the Curb-Cut Effect
   * The 7 Principles of Universal Design
   * Universal Design for Learning (UDL) 3 pillars
   * WCAG Principles (POUR) and Success Criteria (Contrast, Keyboard, Alt Text, Reflow)
3. **Domain 3: Standards, Laws, and Management Strategies (26%)**
   * UN CRPD (Article 9 Accessibility)
   * ADA (Titles I, II, III), Section 508 of Rehabilitation Act, AODA, EN 301 549
   * Procurement & VPAT / ACR documentation
   * Capability Maturity Model (CMM), Shift-Left testing, and user testing with people with disabilities
