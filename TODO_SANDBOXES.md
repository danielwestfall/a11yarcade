# 📋 A11y Arcade: Sub-Domains Without Sandboxes & Top 3 Priority TODOs

This document tracks all Body of Knowledge (BoK) sub-domains across **CPACC**, **WAS**, and **ADS** that currently lack dedicated interactive sandbox labs in the Academy, along with the **Top 3 prioritized sandbox concepts** queued for future implementation.

---

## ✅ Live Completed Sandboxes (23 Total Academy Modules)

| Certification | Taxonomy Section | Module Title & Interactive Component | Status |
| :--- | :--- | :--- | :---: |
| **CPACC** | `CPACC-D1-E` | Disability Etiquette & Respectful Interactions (`DisabilityEtiquetteLab.jsx`) | **LIVE ✓** |
| **WAS** | `WAS-D2-B` | Conformance Requirements & WCAG-EM 1.0 (`WcagEmAuditPlannerLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D2-D` | Remediate in Authoring Formats (`AuthoringFormatRemediator.jsx`) | **LIVE ✓** |
| **WAS** | `WAS-D1-G` | Single-Page Applications Routing & Focus (`SpaRoutingLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D2-E` | Optical Character Recognition & Scanned PDF (`OcrDocumentRemediator.jsx`) | **LIVE ✓** |
| **CPACC** | `CPACC-D2-D` | Accessibility Principles for Built Environment (`BuiltEnvironmentBlueprintLab.jsx`) | **LIVE ✓** |

---

## 🎯 Next Top 3 Priority Sandbox Labs (TODO)

### 1. 🎓 Universal Design for Learning (UDL) Course Designer Lab
- **Certification Track:** CPACC (Certified Professional in Accessibility Core Competencies)
- **Taxonomy Section:** `CPACC-D2-F` (*Universal Design for Learning*)
- **Core A11y Problem:** Traditional instructional materials rely on a single modality (e.g. text-only lecture), creating barriers for diverse learners. UDL provides a scientific framework based on cognitive neuroscience to proactively design inclusive learning.
- **Interactive Sandbox Concept:**
  - An interactive instructional design workbench based on CAST's 3 UDL pillars:
    1. **Multiple Means of Engagement:** (The "Why" of learning) — options for recruiting interest, sustaining effort, and self-regulation.
    2. **Multiple Means of Representation:** (The "What" of learning) — options for perception (multimodal media), language/symbols (glossaries, captions), and comprehension.
    3. **Multiple Means of Action & Expression:** (The "How" of learning) — options for physical action (assistive tech inputs), expressive media (text, speech, diagrams), and executive functions.
  - Users transform a rigid, traditional university syllabus into a resilient, UDL-certified learning curriculum.

---

### 2. 💼 Enterprise ICT Procurement & VPAT / ACR Auditor Lab
- **Certification Track:** WAS (Web Accessibility Specialist)
- **Taxonomy Section:** `WAS-D3-C` (*Accessibility Procurement Process*)
- **Core A11y Problem:** Enterprise software acquisitions routinely introduce catastrophic accessibility barriers when vendors submit vague, misleading, or fraudulent Voluntary Product Accessibility Templates (VPATs / ACRs).
- **Interactive Sandbox Concept:**
  - An interactive enterprise procurement review desk evaluating 3 competing commercial SaaS vendors for a corporate CRM.
  - Users inspect vendor Accessibility Conformance Reports (ACRs):
    - Identify "vendor greenwashing" (e.g., claiming "Supports" for WCAG 2.1.1 Keyboard when only basic tab-order exists, or claiming "Not Applicable" for dynamic form errors).
    - Analyze VPAT Edition differences (VPAT 508 vs VPAT WCAG vs VPAT EU EN 301 549).
    - Draft mandatory contract indemnification clauses and require third-party verification before signing.

---

### 3. 🔍 Automated vs Human Judgment Document Audit Lab
- **Certification Track:** ADS (Accessible Document Specialist)
- **Taxonomy Section:** `ADS-D3-C` (*3.3 Identify limitations of automated testing*)
- **Core A11y Problem:** Automated PDF testing tools (PAC, Acrobat Accessibility Checker) can only check structural syntax. They give misleading "green checkmarks" to PDFs that remain totally unusable for screen reader users.
- **Interactive Sandbox Concept:**
  - A dual-inspector tool contrasting automated PAC validator results against human screen reader user tests across 4 tricky PDF elements:
    1. **Nonsense Alt Text:** An image has `alt="image_042_final.png"`. (Automated PAC passes: "Alt text exists!"; Human test fails: gibberish filename).
    2. **Skipped Reading Order:** Visual two-column layout tagged in horizontal reading order across columns. (PAC passes: "All tags present!"; Human test fails: sentences interleave).
    3. **Fake Table Layout:** Multi-column layout built with `<Table>` tags. (PAC passes: "Table has headers!"; Human test fails: layout announced as tabular data).
    4. **Color Contrast on Complex Background:** White text over photographic pattern. (PAC passes: automated contrast unsupported in PDF streams; Human test fails: unreadable text).

---

## 📚 Remaining Inventory of Uncovered Sub-Domains

Below is the updated taxonomy analysis of remaining certification sections currently without an interactive sandbox:

### 🎓 CPACC (Core Competencies)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `CPACC-D1-D` | Domain 1 | Disability Demographics and Statistics | WHO global stats, census variations, aging populations |
| `CPACC-D2-A` | Domain 2 | Individualized Accommodations vs Universal Design | Workplace adjustments vs systemic universal design |
| `CPACC-D2-C` | Domain 2 | WCAG Principles and Application (POUR) | Overarching POUR framework across non-web ICT |
| `CPACC-D2-F` | Domain 2 | Universal Design for Learning (UDL) | CAST guidelines (Representation, Engagement, Action) *(Queued in TODO #1)* |
| `CPACC-D3-A` | Domain 3 | International Declarations & Conventions | UN CRPD Article 9, Marrakesh Treaty |
| `CPACC-D3-B` | Domain 3 | Regional Instruments on Disability Rights | EAA Directive 2019/882, EN 301 549, UK Equality Act |
| `CPACC-D3-E` | Domain 3 | Applying Standards to ICT Procurement | VPAT/ACR evaluation, Section 508 procurement checklists |

---

### 💻 WAS (Web Accessibility Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `WAS-D1-E` | Domain 1 | Accessibility-Supported Technologies | User agent and AT support baselines across browser engines |
| `WAS-D1-H` | Domain 1 | Strategies of Persons with Disabilities | Screen magnification, switch devices, speech input mechanics |
| `WAS-D2-A` | Domain 2 | Interoperability and Compatibility Issues | Cross-browser / cross-screen reader pairing quirks |
| `WAS-D2-C` | Domain 2 | Testing with Assistive Technologies | Manual AT testing protocols (NVDA + Firefox, VoiceOver + Safari) |
| `WAS-D2-D` | Domain 2 | Testing Tools & ACT Rules | Automated linters, axe-core, W3C Accessibility Conformance Testing |
| `WAS-D2-E` | Domain 2 | Accessibility Quality Assurance | CI/CD pipeline integration, regression testing gates |
| `WAS-D2-G` | Domain 2 | Testing for End-user Impact | Usability testing with people with disabilities |
| `WAS-D2-H` | Domain 2 | Testing Tools for the Web | Evaluation engines and accessibility scanners |
| `WAS-D3-B` | Domain 3 | Recommending Remediation Strategies | Interim workarounds vs root-cause architectural fixes |
| `WAS-D3-C` | Domain 3 | Accessibility Procurement Process | RFP accessibility clauses, vendor audits, VPAT verification *(Queued in TODO #2)* |

---

### 📑 ADS (Accessible Document Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `ADS-D1-B` | Domain 1 | Design, Create & Assemble Final Form | Multi-column layouts, master pages, export settings |
| `ADS-D2-C` | Domain 2 | Remediate in Final Format (Acrobat Pro) | Acrobat TouchUp Reading Order tool, tags pane restructuring |
| `ADS-D3-B` | Domain 3 | Manual Document Testing Processes | Screen reader document navigation, reflow view testing |
| `ADS-D3-C` | Domain 3 | Limitations of Automated Testing | Distinguishing layout tables vs data tables, semantic validity *(Queued in TODO #3)* |
| `ADS-D3-D` | Domain 3 | Testing with Assistive Tech | JAWS, NVDA, and ReadOutLoud document reading behavior |
| `ADS-D4-A-G`| Domain 4 | Planning, Training & Workflows | Document lifecycle, intake forms, organizational SLAs |
| `ADS-D5-A-B`| Domain 5 | Policy Promotion, Advocacy & Advising | Institutional document compliance roadmaps and executive reporting |
