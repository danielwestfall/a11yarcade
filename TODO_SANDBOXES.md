# 📋 A11y Arcade: Sub-Domains Without Sandboxes & Top 3 Priority TODOs

This document tracks all Body of Knowledge (BoK) sub-domains across **CPACC**, **WAS**, and **ADS** that currently lack dedicated interactive sandbox labs in the Academy, along with the **Top 3 prioritized sandbox concepts** queued for implementation.

---

## 🎯 Top 3 Priority Sandbox Labs (TODO)

### 1. 🌐 Single-Page Application (SPA) Focus & Route Announcer Lab
- **Certification Track:** WAS (Web Accessibility Specialist)
- **Taxonomy Section:** `WAS-D1-G` (*Single-Page Applications*)
- **Core A11y Problem:** In client-side routing (React, Vue, Angular), clicking an in-app link does not perform a full page reload. Screen readers remain silent, and keyboard focus is either trapped on the clicked link or reset to `document.body`.
- **Interactive Sandbox Concept:**
  - An interactive simulated mini-SPA with 3 route views (Dashboard, User Settings, Billing).
  - Users encounter broken route navigation (no title change, silent transitions, stranded focus).
  - Remediators write/toggle the 3 essential SPA accessibility patterns:
    1. **Document Title Sync:** Dynamically update `<title>` to `{Page Name} | App Name`.
    2. **Focus Management:** Shift programmatic focus to the route's primary `<h1 tabIndex="-1">` or `<main>` container.
    3. **Live Region Route Announcer:** Fire an `aria-live="polite"` message announcing *"Navigated to User Settings page"*.
  - Includes a real-time virtual screen reader speech log proving the announcement fired.

---

### 2. 📄 Scanned Document OCR & Image-to-Text Remediation Lab
- **Certification Track:** ADS (Accessible Document Specialist)
- **Taxonomy Section:** `ADS-D2-E` (*2.5 Use OCR*)
- **Core A11y Problem:** Scanned paper documents exported to PDF are flat raster images without a text layer or tag tree. Assistive technology treats them as completely blank pages.
- **Interactive Sandbox Concept:**
  - A dual-pane canvas displaying a scanned legacy government/medical form with artifacts, slight rotation, and noise.
  - Phase 1: Run simulated OCR engine; detect low-confidence glyph misrecognitions (e.g., `rn` mistranscribed as `m`, `1` vs `l`, `0` vs `O`).
  - Phase 2: User corrects spelling errors in the recognized text layer.
  - Phase 3: Tag the text layer with structural headings (`<H1>`, `<H2>`), paragraphs (`<P>`), and form labels before verifying PDF/UA compliance with PAC validation.

---

### 3. 🏛️ Built Environment & Architectural Clearance Blueprint Simulator
- **Certification Track:** CPACC (Certified Professional in Accessibility Core Competencies)
- **Taxonomy Section:** `CPACC-D2-D` (*Accessibility Principles for the Built Environment*)
- **Core A11y Problem:** Physical space barriers are governed by ADAAG (ADA Accessibility Guidelines) and ISO 21542, but digital accessibility specialists frequently struggle with physical space dimensions.
- **Interactive Sandbox Concept:**
  - An interactive top-down blueprint planner featuring a building entrance, doorway, ramp, and elevator vestibule.
  - Users drag measurement calipers and adjust physical parameters to meet accessibility codes:
    - **Ramp Slope:** Fix steep 1:8 slopes down to the compliant maximum **1:12 slope (8.33% grade)** with resting landings every 30 feet.
    - **Door Clear Width:** Adjust narrow 28-inch doorways to the required minimum **32 inches of clear opening width**.
    - **Wheelchair Turning Radius:** Verify a full **60-inch diameter circle** or T-shaped space for wheelchair turning.
    - **Tactile Signage:** Position room signs at the latch side of doors between **48 and 60 inches above the finish floor**.

---

## 📚 Complete Inventory of Uncovered Sub-Domains

Below is the full taxonomy analysis of all certification sections currently without an interactive sandbox in the Academy:

### 🎓 CPACC (Core Competencies)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `CPACC-D1-D` | Domain 1 | Disability Demographics and Statistics | WHO global stats, census variations, aging populations |
| `CPACC-D1-E` | Domain 1 | Disability Etiquette | Person-first vs identity-first language, service animals |
| `CPACC-D2-A` | Domain 2 | Individualized Accommodations vs Universal Design | Workplace adjustments vs systemic universal design |
| `CPACC-D2-C` | Domain 2 | WCAG Principles and Application (POUR) | Overarching POUR framework across non-web ICT |
| `CPACC-D2-D` | Domain 2 | Principles for the Built Environment | Ramp slopes, door widths, tactile signage, ADAAG *(Queued in TODO #3)* |
| `CPACC-D2-F` | Domain 2 | Universal Design for Learning (UDL) | CAST guidelines (Representation, Engagement, Action/Expression) |
| `CPACC-D3-A` | Domain 3 | International Declarations & Conventions | UN CRPD Article 9, Marrakesh Treaty |
| `CPACC-D3-B` | Domain 3 | Regional Instruments on Disability Rights | EAA Directive 2019/882, EN 301 549, UK Equality Act |
| `CPACC-D3-E` | Domain 3 | Applying Standards to ICT Procurement | VPAT/ACR evaluation, Section 508 procurement checklists |

---

### 💻 WAS (Web Accessibility Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `WAS-D1-E` | Domain 1 | Accessibility-Supported Technologies | User agent and AT support baselines across browser engines |
| `WAS-D1-G` | Domain 1 | Single-Page Applications | Client-side routing, focus resets, route announcers *(Queued in TODO #1)* |
| `WAS-D1-H` | Domain 1 | Strategies of Persons with Disabilities | Screen magnification, switch devices, speech input mechanics |
| `WAS-D2-A` | Domain 2 | Interoperability and Compatibility Issues | Cross-browser / cross-screen reader pairing quirks |
| `WAS-D2-B` | Domain 2 | Guidelines, Conformance & WCAG-EM | WCAG-EM 5-step auditing, sampling, and structured reporting |
| `WAS-D2-C` | Domain 2 | Testing with Assistive Technologies | Manual AT testing protocols (NVDA + Firefox, VoiceOver + Safari) |
| `WAS-D2-D` | Domain 2 | Testing Tools & ACT Rules | Automated linters, axe-core, W3C Accessibility Conformance Testing |
| `WAS-D2-E` | Domain 2 | Accessibility Quality Assurance | CI/CD pipeline integration, regression testing gates |
| `WAS-D2-G` | Domain 2 | Testing for End-User Impact | Usability testing with people with disabilities |
| `WAS-D3-B` | Domain 3 | Recommending Remediation Strategies | Interim workarounds vs root-cause architectural fixes |
| `WAS-D3-C` | Domain 3 | Accessibility Procurement Process | RFP accessibility clauses, vendor audits, VPAT verification |

---

### 📑 ADS (Accessible Document Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `ADS-D1-B` | Domain 1 | Design, Create & Assemble Final Form | Multi-column layouts, master pages, export settings |
| `ADS-D2-C` | Domain 2 | Remediate in Final Format (Acrobat Pro) | Acrobat TouchUp Reading Order tool, tags pane restructuring |
| `ADS-D2-D` | Domain 2 | Remediate in Authoring Format | Source-level fixes in InDesign, Microsoft Word, PowerPoint |
| `ADS-D2-E` | Domain 2 | Use OCR | Scanned PDF remediation, glyph error correction *(Queued in TODO #2)* |
| `ADS-D3-B` | Domain 3 | Manual Document Testing Processes | Screen reader document navigation, reflow view testing |
| `ADS-D3-C` | Domain 3 | Limitations of Automated Testing | Distinguishing layout tables vs data tables, semantic validity |
| `ADS-D3-D` | Domain 3 | Testing with Assistive Tech | JAWS, NVDA, and ReadOutLoud document reading behavior |
| `ADS-D4-A-G`| Domain 4 | Planning, Training & Workflows | Document lifecycle, intake forms, organizational SLAs |
| `ADS-D5-A-B`| Domain 5 | Policy Promotion, Advocacy & Advising | Institutional document compliance roadmaps and executive reporting |
