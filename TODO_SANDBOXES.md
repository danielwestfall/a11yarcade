# 📋 A11y Arcade: Sub-Domains Without Sandboxes & Top 3 Priority TODOs

This document tracks all Body of Knowledge (BoK) sub-domains across **CPACC**, **WAS**, and **ADS** that currently lack dedicated interactive sandbox labs in the Academy, along with the **Top 3 prioritized sandbox concepts** queued for future implementation.

---

## ✅ Live Completed Sandboxes (26 Total Academy Modules)

| Certification | Taxonomy Section | Module Title & Interactive Component | Status |
| :--- | :--- | :--- | :---: |
| **CPACC** | `CPACC-D2-F` | Universal Design for Learning (`UdlCourseDesignerLab.jsx`) | **LIVE ✓** |
| **WAS** | `WAS-D3-C` | Accessibility in ICT Procurement & VPAT (`VpatProcurementAuditorLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D3-C` | Limitations of Automated Testing (`AutomatedTestingLimitationsLab.jsx`) | **LIVE ✓** |
| **CPACC** | `CPACC-D1-E` | Disability Etiquette & Respectful Interactions (`DisabilityEtiquetteLab.jsx`) | **LIVE ✓** |
| **WAS** | `WAS-D2-B` | Conformance Requirements & WCAG-EM 1.0 (`WcagEmAuditPlannerLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D2-D` | Remediate in Authoring Formats (`AuthoringFormatRemediator.jsx`) | **LIVE ✓** |
| **WAS** | `WAS-D1-G` | Single-Page Applications Routing & Focus (`SpaRoutingLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D2-E` | Optical Character Recognition & Scanned PDF (`OcrDocumentRemediator.jsx`) | **LIVE ✓** |
| **CPACC** | `CPACC-D2-D` | Accessibility Principles for Built Environment (`BuiltEnvironmentBlueprintLab.jsx`) | **LIVE ✓** |

---

## 🎯 Next Top 3 Priority Sandbox Labs (TODO)

### 1. 🌍 Global Legal Jurisdictions & Regulatory Compass Simulator
- **Certification Track:** CPACC (Certified Professional in Accessibility Core Competencies)
- **Taxonomy Section:** `CPACC-D3-B` (*Regional Instruments on Human and Disability Rights*)
- **Core A11y Problem:** Digital products operating across global markets face a confusing web of regional legislation, distinct enforcement dates, and harmonized technical standards.
- **Interactive Sandbox Concept:**
  - An interactive world map and regulatory jurisdiction selector:
    1. **European Union:** European Accessibility Act (EAA Directive 2019/882, June 2025 enforcement) vs European Standard EN 301 549 (EU public sector procurement).
    2. **United States:** ADA Title II (2024 DOJ final rule mandating WCAG 2.1 AA) vs ADA Title III (places of public accommodation) vs Section 508.
    3. **Canada:** Accessible Canada Act (ACA) vs Ontario's AODA (mandating WCAG 2.0 AA).
    4. **United Kingdom:** Equality Act 2010 & Public Sector Bodies Accessibility Regulations 2018.
    5. **Japan:** Act on Elimination of Discrimination & JIS X 8341-3.
  - Users resolve legal compliance scenarios for e-commerce, banking, and public transport apps.

---

### 2. 🤖 Automated Linters & W3C ACT (Accessibility Conformance Testing) Rules Lab
- **Certification Track:** WAS (Web Accessibility Specialist)
- **Taxonomy Section:** `WAS-D2-D` (*Testing Tools for the Web and ACT Rules*)
- **Core A11y Problem:** Automated linters and test suites produce false positives and false negatives without strict test case definitions. The W3C ACT Rules Format provides standardized test procedures to harmonize accessibility tool evaluation.
- **Interactive Sandbox Concept:**
  - An interactive linter debugging bench connecting automated axe-core rules with official W3C ACT Rules:
    - Inspect ACT Rule definitions (Input Aspects, Expectations, Applicability).
    - Distinguish true positives, false positives, and incomplete test results.
    - Configure automated GitHub Actions CI/CD regression gates and severity threshold blockers.

---

### 3. 🛠️ Adobe Acrobat Pro Tags Tree & Table Editor Lab
- **Certification Track:** ADS (Accessible Document Specialist)
- **Taxonomy Section:** `ADS-D2-C` (*2.3 Remediate in final format*)
- **Core A11y Problem:** When source authoring files are unavailable, document remediators must fix complex defects directly within Adobe Acrobat Pro's Tags Tree, Reading Order Tool, and Table Editor.
- **Interactive Sandbox Concept:**
  - A simulated Adobe Acrobat Pro TouchUp workspace:
    - Remediate complex multi-cell spanning data tables using the Table Editor (`ColSpan="2"`, `RowSpan="2"`).
    - Fix untagged annotations, form field OBJR (Object Reference) dictionaries, and link annotations.
    - Reorder visual bounding boxes in the Reading Order Pane to eliminate architectural content stream conflicts.

---

## 📚 Remaining Inventory of Uncovered Sub-Domains

Below is the updated taxonomy analysis of remaining certification sections currently without an interactive sandbox:

### 🎓 CPACC (Core Competencies)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `CPACC-D1-D` | Domain 1 | Disability Demographics and Statistics | WHO global stats, census variations, aging populations |
| `CPACC-D2-A` | Domain 2 | Individualized Accommodations vs Universal Design | Workplace adjustments vs systemic universal design |
| `CPACC-D2-C` | Domain 2 | WCAG Principles and Application (POUR) | Overarching POUR framework across non-web ICT |
| `CPACC-D3-A` | Domain 3 | International Declarations & Conventions | UN CRPD Article 9, Marrakesh Treaty |
| `CPACC-D3-B` | Domain 3 | Regional Instruments on Disability Rights | EAA Directive 2019/882, EN 301 549, UK Equality Act *(Queued in TODO #1)* |
| `CPACC-D3-E` | Domain 3 | Applying Standards to ICT Procurement | VPAT/ACR evaluation, Section 508 procurement checklists |

---

### 💻 WAS (Web Accessibility Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `WAS-D1-E` | Domain 1 | Accessibility-Supported Technologies | User agent and AT support baselines across browser engines |
| `WAS-D1-H` | Domain 1 | Strategies of Persons with Disabilities | Screen magnification, switch devices, speech input mechanics |
| `WAS-D2-A` | Domain 2 | Interoperability and Compatibility Issues | Cross-browser / cross-screen reader pairing quirks |
| `WAS-D2-C` | Domain 2 | Testing with Assistive Technologies | Manual AT testing protocols (NVDA + Firefox, VoiceOver + Safari) |
| `WAS-D2-D` | Domain 2 | Testing Tools & ACT Rules | Automated linters, axe-core, W3C ACT Rules *(Queued in TODO #2)* |
| `WAS-D2-E` | Domain 2 | Accessibility Quality Assurance | CI/CD pipeline integration, regression testing gates |
| `WAS-D2-G` | Domain 2 | Testing for End-user Impact | Usability testing with people with disabilities |
| `WAS-D2-H` | Domain 2 | Testing Tools for the Web | Evaluation engines and accessibility scanners |
| `WAS-D3-B` | Domain 3 | Recommending Remediation Strategies | Interim workarounds vs root-cause architectural fixes |

---

### 📑 ADS (Accessible Document Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `ADS-D1-B` | Domain 1 | Design, Create & Assemble Final Form | Multi-column layouts, master pages, export settings |
| `ADS-D2-C` | Domain 2 | Remediate in Final Format (Acrobat Pro) | Acrobat TouchUp Reading Order tool, tags pane restructuring *(Queued in TODO #3)* |
| `ADS-D3-B` | Domain 3 | Manual Document Testing Processes | Screen reader document navigation, reflow view testing |
| `ADS-D3-D` | Domain 3 | Testing with Assistive Tech | JAWS, NVDA, and ReadOutLoud document reading behavior |
| `ADS-D4-A-G`| Domain 4 | Planning, Training & Workflows | Document lifecycle, intake forms, organizational SLAs |
| `ADS-D5-A-B`| Domain 5 | Policy Promotion, Advocacy & Advising | Institutional document compliance roadmaps and executive reporting |
