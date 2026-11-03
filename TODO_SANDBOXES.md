# 📋 A11y Arcade: Sub-Domains Without Sandboxes & Top 3 Priority TODOs

This document tracks all Body of Knowledge (BoK) sub-domains across **CPACC**, **WAS**, and **ADS** that currently lack dedicated interactive sandbox labs in the Academy, along with the **Top 3 prioritized sandbox concepts** queued for future implementation.

---

## ✅ Recently Completed Sandboxes (20 Total Academy Modules)

| Certification | Taxonomy Section | Module Title & Interactive Component | Status |
| :--- | :--- | :--- | :---: |
| **WAS** | `WAS-D1-G` | Single-Page Applications Routing & Focus (`SpaRoutingLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D2-E` | Optical Character Recognition & Scanned PDF (`OcrDocumentRemediator.jsx`) | **LIVE ✓** |
| **CPACC** | `CPACC-D2-D` | Accessibility Principles for Built Environment (`BuiltEnvironmentBlueprintLab.jsx`) | **LIVE ✓** |

---

## 🎯 Next Top 3 Priority Sandbox Labs (TODO)

### 1. 🤝 Disability Etiquette & Respectful Interaction Simulator
- **Certification Track:** CPACC (Certified Professional in Accessibility Core Competencies)
- **Taxonomy Section:** `CPACC-D1-E` (*Disability Etiquette*)
- **Core A11y Problem:** Disability etiquette errors alienate people with disabilities, violate privacy, and cause communication breakdowns in professional and public environments.
- **Interactive Sandbox Concept:**
  - An interactive dialogue and scenario branching tree with simulated personas (guide dog handler, manual wheelchair user, Deaf person with an ASL interpreter, person with a cognitive processing disability).
  - Users select appropriate responses across real-world situations:
    1. **Service Animals:** Interacting with a guide dog handler (never pet, feed, or distract a working dog; address the handler directly).
    2. **Physical Etiquette:** Speaking with a wheelchair user (pull up a chair to speak at eye level; never lean on or push a wheelchair without consent).
    3. **Deaf & Hard of Hearing:** Communicating via an ASL interpreter (maintain eye contact with the Deaf individual, never speak to the interpreter saying "tell them...").
    4. **Language Preferences:** Respecting person-first ("person with autism") vs identity-first ("Autistic person") language across different disability communities.

---

### 2. 📊 WCAG-EM Conformance Evaluation & Representative Sampling Lab
- **Certification Track:** WAS (Web Accessibility Specialist)
- **Taxonomy Section:** `WAS-D2-B` (*Guidelines, Conformance Requirements and WCAG-EM*)
- **Core A11y Problem:** Comprehensive web audits cannot test every URL on large enterprise sites. Practitioners must follow W3C's 5-step Website Accessibility Conformance Evaluation Methodology (WCAG-EM) to select a statistically valid, representative sample.
- **Interactive Sandbox Concept:**
  - An interactive website audit planning workbench covering the 5 WCAG-EM steps:
    1. **Define Scope:** Specify target URL patterns, conformance target (WCAG 2.2 AA), and accessibility baseline.
    2. **Explore Target Website:** Identify distinct web page types (home, login, dashboard, checkout flow, data tables).
    3. **Select Representative Sample:** Balance structured page selection (complete purchase process) with randomly sampled URLs.
    4. **Audit Sample:** Record conformance per success criterion with reproducible steps.
    5. **Report Conformance:** Generate an executive summary statement and machine-readable audit report.

---

### 3. ✍️ Source Authoring Format Remediation Lab (Word & InDesign to PDF/UA)
- **Certification Track:** ADS (Accessible Document Specialist)
- **Taxonomy Section:** `ADS-D2-D` (*2.4 Remediate in authoring format*)
- **Core A11y Problem:** Remediating PDFs downstream in Acrobat Pro is time-consuming and fragile. The most efficient and sustainable approach is fixing document structure at the source authoring level (Microsoft Word, Google Docs, Adobe InDesign) before PDF export.
- **Interactive Sandbox Concept:**
  - An interactive simulated authoring tool interface (Word / InDesign inspector):
    1. **Heading Styles vs Fake Bolding:** Replace manually enlarged 24pt bold text with true `Heading 1` and `Heading 2` paragraph styles.
    2. **Table Header Configuration:** Configure "Repeat as header row at the top of each page" and prevent rows from breaking across pages.
    3. **InDesign Export Tagging:** Map Paragraph Styles to PDF export tags (`P` ➔ `<P>`, `H1` ➔ `<H1>`, `Sidebar` ➔ `<Aside>`).
    4. **Source Alt Text:** Embed alternative text directly into source graphics so all future PDF re-exports preserve accessibility tags automatically.

---

## 📚 Remaining Inventory of Uncovered Sub-Domains

Below is the updated taxonomy analysis of remaining certification sections currently without an interactive sandbox:

### 🎓 CPACC (Core Competencies)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `CPACC-D1-D` | Domain 1 | Disability Demographics and Statistics | WHO global stats, census variations, aging populations |
| `CPACC-D1-E` | Domain 1 | Disability Etiquette | Person-first vs identity-first language, service animals *(Queued in TODO #1)* |
| `CPACC-D2-A` | Domain 2 | Individualized Accommodations vs Universal Design | Workplace adjustments vs systemic universal design |
| `CPACC-D2-C` | Domain 2 | WCAG Principles and Application (POUR) | Overarching POUR framework across non-web ICT |
| `CPACC-D2-F` | Domain 2 | Universal Design for Learning (UDL) | CAST guidelines (Representation, Engagement, Action/Expression) |
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
| `WAS-D2-B` | Domain 2 | Guidelines, Conformance & WCAG-EM | WCAG-EM 5-step auditing, sampling, and structured reporting *(Queued in TODO #2)* |
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
| `ADS-D2-D` | Domain 2 | Remediate in Authoring Format | Source-level fixes in InDesign, Microsoft Word, PowerPoint *(Queued in TODO #3)* |
| `ADS-D3-B` | Domain 3 | Manual Document Testing Processes | Screen reader document navigation, reflow view testing |
| `ADS-D3-C` | Domain 3 | Limitations of Automated Testing | Distinguishing layout tables vs data tables, semantic validity |
| `ADS-D3-D` | Domain 3 | Testing with Assistive Tech | JAWS, NVDA, and ReadOutLoud document reading behavior |
| `ADS-D4-A-G`| Domain 4 | Planning, Training & Workflows | Document lifecycle, intake forms, organizational SLAs |
| `ADS-D5-A-B`| Domain 5 | Policy Promotion, Advocacy & Advising | Institutional document compliance roadmaps and executive reporting |
