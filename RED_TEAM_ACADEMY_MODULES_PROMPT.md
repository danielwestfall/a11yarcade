# 🔴 A11y Arcade: Academy Learning Modules & Interactive Labs Red Team Audit
## Target Component: 🎓 Digital Accessibility Learning Modules (CPACC · WAS · ADS)

> **Evaluation Mode:** ADVERSARIAL, RIGOROUS, FORENSIC  
> **Target Standards:** IAAP CPACC BoK V3, IAAP WAS BoK 2024, IAAP ADS BoK 2021, W3C WCAG 2.1 & 2.2 AA / AAA, PDF/UA ISO 14289-1, WAI-ARIA 1.2  
> **Environment:** `http://localhost:5173` (Vite) / `http://localhost:3001` (Production Build)  

---

## 🎯 Red Team Mission Objective

Your mission is to perform a **two-pronged adversarial audit** of the new **Digital Accessibility Learning Modules Academy**:
1. **Content & Pedagogical Integrity**: Rigorously verify that all theoretical models, success criteria numbers, contrast math, legal jurisdictions, PDF tag structures, and Knowledge Check questions are 100% technically accurate against official IAAP Bodies of Knowledge.
2. **Interactive Functionality & A11y Resilience**: Stress-test all 14 interactive simulators, code fixers, decision trees, focus traps, screen reader announcers, and persistence layers under extreme keyboard-only and low-vision conditions.

---

## 🧪 Track 1: Content & Pedagogical Forensic Verification

### Test 1.1: Body of Knowledge Taxonomy Alignment
Verify that every module matches official IAAP taxonomy definitions:
- **CPACC Domain 1**:
  - Medical Model (deficit in individual, cure-focused) vs Social Model (societal barriers disable the individual).
  - Biopsychosocial Model correctly attributes synthesis to WHO ICF.
  - Demographic statistics reflect WHO standard: **16% of global population (1.3 billion people)**.
- **CPACC Domain 2**:
  - Universal Design 7 Principles correctly attribute to Ronald Mace (NCSU).
  - The Curb-Cut Effect is accurately explained and applied to digital media (captions, contrast).
  - Universal Design for Learning (UDL) maps to 3 CAST pillars (Engagement, Representation, Action/Expression).
- **CPACC Domain 3**:
  - ADA Title II (2024 DOJ final rule mandating WCAG 2.1 AA for state & local entities).
  - Rehabilitation Act Section 508 (US Federal ICT procurement) vs Section 504 (Federally funded programs).
  - European Accessibility Act (Directive 2019/882, June 2025 enforcement) vs EN 301 549.
  - UN CRPD Article 9 explicitly cited for international human rights.
- **WAS Domain 1 & 2**:
  - WCAG 2.2 AA new criteria accurately stated:
    - SC 2.5.8 Target Size Minimum: **24×24 CSS pixels** with perimeter offset circles.
    - SC 3.3.7 Redundant Entry: Auto-population or selection of previously entered data.
    - SC 2.5.7 Dragging Movements: Single-pointer non-dragging alternative.
    - SC 3.2.6 Consistent Help: Consistent relative visual/tab order across pages.
    - **Deprecation**: SC 4.1.1 Parsing verified as obsoleted in WCAG 2.2.
  - First Rule of ARIA: Native HTML elements must always be preferred over ARIA restyling.
  - Live Regions: `aria-live="polite"` queues until idle; `aria-live="assertive"` interrupts immediately.
- **ADS Domain 1, 2 & 3**:
  - PDF/UA (ISO 14289-1) Matterhorn Protocol rules:
    - Purely decorative elements **MUST** be tagged as `/Artifact`.
    - Headings must follow strict sequential hierarchy (`<H1>` to `<H2>`), with no skipped levels (`<H1>` to `<H4>`).
    - Data tables require `<TH>` headers with scope attributes, distinct from layout tables.
    - Screen readers read from the **Tags Tree**, NOT the visual order or reading order pane alone.

### Test 1.2: Knowledge Check Question Bank Audit
For every question in every module:
1. Ensure the question stem is unambiguous and technically valid.
2. Confirm exactly 4 options (`A`, `B`, `C`, `D`) exist with no duplicates.
3. Validate that `answer` exactly matches one option ID.
4. Verify the explanation gives the authoritative reasoning rather than generic text.

---

## 🧪 Track 2: Interactive Functionality & Keyboard Stress Test

### Test 2.1: Keyboard Trap & Modal Dialog Escape Test
1. Press `Tab` until the **Learning Modules** tab is reached.
2. Navigate with `Tab` and press `Enter` on any module card's `Start Learning Module` button.
3. **Modal Dialog Verification**:
   - Focus must land immediately on the close button or first interactive control inside the modal.
   - Press <kbd>Tab</kbd> continuously: verify focus **never leaks** to the background page behind the modal overlay.
   - Press <kbd>Shift + Tab</kbd>: verify focus loops backwards to the last focusable element in the dialog.
   - Press <kbd>Escape</kbd>: the modal must immediately dismiss, and focus **MUST return** to the trigger button that launched it.

### Test 2.2: Color Contrast Math & SVG Simulation Filter Torture
1. Launch the **Vision & Contrast Lab** (`CPACC-D1-B`).
2. Test critical color edge cases:
   - Pure Black (`#000000`) on Pure White (`#ffffff`): Must report `21.00:1` (PASS AAA).
   - Identical colors (`#38bdf8` on `#38bdf8`): Must report `1.00:1` (FAIL AA/AAA).
   - Yellow on White (`#facc15` on `#ffffff`): Must report `< 2.0:1` with instant `FAIL (< 4.5:1)` badge.
   - Subtle Dark Gray on Dark Blue (`#64748b` on `#0f172a`): Must report failure for normal text.
3. Cycle through all 8 simulated vision filters (Protanopia, Deuteranopia, Tritanopia, Achromatopsia, Cataracts, Tunnel Vision, Macular Degeneration):
   - Verify that SVG matrix and blur/radial gradient overlays apply smoothly to the viewport with zero console exceptions.

### Test 2.3: Semantic HTML Code Remediator & Screen Reader Synthesizer
1. Launch the **Semantic HTML vs "Div Soup" Fixer** (`WAS-D1-B`).
2. Cycle through all 4 code challenges (Pseudo-Button, Fake Heading, Unassociated Input, Landmark Navigation).
3. Verify:
   - Defective state displays `generic (div)` in the Accessibility Tree with `Focusable: NO`.
   - Clicking `Apply Semantic HTML Fix` updates code in real-time.
   - Accessibility Tree immediately computes semantic role (`button`, `heading level 2`, `textbox`, `navigation landmark`) and `Focusable: YES`.
   - Simulated audio announcer displays realistic screen reader speech output.

### Test 2.4: PDF/UA Tag Tree Remediator PAC Meter Test
1. Launch the **Document Structure & PDF Tag Tree Remediator** (`ADS-D2-B`).
2. Initial state must display:
   - PAC automated score: `20% · FAILED CHECKS`.
   - Skipped `<H4>` heading defect, untagged swoosh artifact, and missing `<TH>` table headers.
3. Click remediation on each node:
   - Remediate heading: score increments to `40%`, tag updates to `<H2>`.
   - Remediate artifact: score increments to `60%`.
   - Remediate table headers: score increments to `80%`.
   - Remediate footer line: score reaches **`100% · PDF/UA COMPLIANT ✓`**.
   - Verify canvas confetti and sound effect trigger upon reaching 100%.

### Test 2.5: W3C APG Tabs Keyboard Interaction Test
1. Launch the **W3C APG Accessible Tabs Lab** (`WAS-D1-F`).
2. Focus the first tab with keyboard <kbd>Tab</kbd>.
3. Press <kbd>Right Arrow</kbd>: focus moves to Tab 2 and updates `aria-selected="true"`.
4. Press <kbd>Left Arrow</kbd>: focus returns to Tab 1.
5. Press <kbd>End</kbd>: focus jumps to the last tab.
6. Press <kbd>Home</kbd>: focus jumps to the first tab.
7. Verify that unselected tabs have `tabindex="-1"`, and pressing <kbd>Tab</kbd> moves directly into the tabpanel.

### Test 2.6: Knowledge Check Scoring & LocalStorage Persistence
1. Open any module's **Knowledge Check** tab.
2. Submit without selecting answers: verify submit button is disabled.
3. Select an incorrect answer for Q1 and correct answers for Q2 and Q3.
4. Click `Submit Knowledge Check`:
   - Score reports `2 / 3`.
   - Q1 highlights in red with explanatory rationale.
   - Q2 & Q3 highlight in green.
   - Module is NOT marked as completed.
5. Click `Retry Quiz`, answer all 3 questions correctly, and submit:
   - Score reports `3 / 3`.
   - Confetti triggers.
   - Module displays `✓ Completed`.
   - Close modal and verify the Academy Progress bar increments.
   - Refresh the page: verify the progress remains persisted from `localStorage`.

---

## 📊 Red Team Evaluation Scorecard

| Test Suite | Pass Criteria | Result |
| :--- | :--- | :--- |
| **BoK Taxonomy & Citations** | Zero hallucinated laws, accurate POUR & UDL mapping | **[PASS / FAIL]** |
| **Question Bank Rigor** | 100% valid stems, exactly 4 choices, valid answers & rationales | **[PASS / FAIL]** |
| **WCAG 2.2 Technical Criteria** | Accurate 2.5.8, 3.3.7, 2.5.7, 3.2.6 implementations & 4.1.1 removal | **[PASS / FAIL]** |
| **Keyboard Focus Traps** | Focus stays within modal dialog; Escape restores focus to trigger | **[PASS / FAIL]** |
| **Luminance & Contrast Math** | Formula strictly adheres to WCAG relative luminance specs | **[PASS / FAIL]** |
| **PAC / PDF-UA Conformance** | 20% to 100% remediation flow with valid ISO 14289 tag rules | **[PASS / FAIL]** |
| **State Persistence** | `localStorage` properly tracks completed modules and scores | **[PASS / FAIL]** |
