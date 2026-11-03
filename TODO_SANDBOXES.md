# 📋 A11y Arcade: Sub-Domains Without Sandboxes & Top 3 Priority TODOs

This document tracks all Body of Knowledge (BoK) sub-domains across **CPACC**, **WAS**, and **ADS** that currently lack dedicated interactive sandbox labs in the Academy, along with the **Top 3 prioritized sandbox concepts** queued for future implementation.

---

## ✅ Live Completed Sandboxes (29 Total Academy Modules)

| Certification | Taxonomy Section | Module Title & Interactive Component | Status |
| :--- | :--- | :--- | :---: |
| **CPACC** | `CPACC-D3-B` | Regional Civil Rights Legislation (`GlobalLegalCompassLab.jsx`) | **LIVE ✓** |
| **WAS** | `WAS-D2-D` | W3C ACT Rules & Testing Tools (`ActRulesLinterLab.jsx`) | **LIVE ✓** |
| **ADS** | `ADS-D2-C` | Acrobat Pro Final Format TouchUp (`AcrobatTagsTableEditorLab.jsx`) | **LIVE ✓** |
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

### 1. 🌐 UN CRPD Article 9 & International Human Rights Treaty Explorer
- **Certification Track:** CPACC (Certified Professional in Accessibility Core Competencies)
- **Taxonomy Section:** `CPACC-D3-A` (*International Declarations and Conventions on Disability Rights*)
- **Core A11y Problem:** Digital accessibility is an internationally recognized fundamental human right under the United Nations, yet practitioners frequently confuse international human rights treaties with technical compliance standards.
- **Interactive Sandbox Concept:**
  - An interactive treaty exploration bench examining core global conventions:
    1. **UN CRPD Article 9:** Mandates States Parties to take appropriate measures to ensure access to information, communications, and other services, including electronic services and emergency services.
    2. **UN CRPD Article 21:** Freedom of expression and opinion, and access to information in accessible formats and technologies appropriate to different kinds of disabilities.
    3. **Marrakesh Treaty (WIPO 2013):** Mandatory copyright exceptions enabling the creation and cross-border exchange of accessible format books for persons who are blind, visually impaired, or print disabled.
    4. **Universal Declaration of Human Rights (UDHR 1948):** Foundation of universal equality and non-discrimination.
  - Interactive scenario analyzer resolving cross-border accessible media exchange and treaty obligations.

---

### 2. 🔄 Cross-Browser & Screen Reader Compatibility Matrix Lab
- **Certification Track:** WAS (Web Accessibility Specialist)
- **Taxonomy Section:** `WAS-D2-A` (*Interoperability and Compatibility Issues*)
- **Core A11y Problem:** Code that conforms strictly to the HTML and ARIA specification can still fail in practice due to underlying accessibility API mapping differences between operating systems and screen reader pairing quirks.
- **Interactive Sandbox Concept:**
  - A dual-pane platform compatibility simulator testing standard UI widgets across 4 primary AT/browser combinations:
    1. **NVDA + Mozilla Firefox (Windows - IAccessible2):** Virtual buffer browsing vs focus mode toggles.
    2. **JAWS + Google Chrome (Windows - UI Automation):** Custom comboboxes, forms mode, and virtual cursor behavior.
    3. **VoiceOver + Apple Safari (macOS / iOS - NSAccessibility):** Rotor navigation, semantic grouping, and custom select announcements.
    4. **TalkBack + Google Chrome (Android):** Touch exploration, swipe gestures, and live region interrupts.
  - Debug platform-specific quirks (e.g. VoiceOver double-announcements, NVDA virtual cursor traps).

---

### 3. 🧪 Manual Document Accessibility Testing & Reflow Protocol Lab
- **Certification Track:** ADS (Accessible Document Specialist)
- **Taxonomy Section:** `ADS-D3-B` (*3.2 Identify and run manual testing processes*)
- **Core A11y Problem:** Passing automated syntax checks (PAC) is only the first step; a complete document audit requires rigorous manual testing protocols: Reflow view verification, Screen Reader document rotor navigation, and initial view settings.
- **Interactive Sandbox Concept:**
  - An interactive manual PDF inspection workstation testing 4 manual audit techniques:
    1. **Adobe Acrobat Reflow Mode (`Ctrl+4`):** Verifies that two-column documents reflow into a clean single column at 400% zoom without horizontal scrolling or text overlap.
    2. **Screen Reader Document Navigation Protocol:** Test document rotor elements (Heading navigation <kbd>H</kbd>, Table navigation <kbd>T</kbd>, Link lists).
    3. **Windows High Contrast / Inverted Color Mode:** Ensure background images or watermarks don't occlude text in high-contrast mode.
    4. **Document Initial View & Title Bar Display:** Verify Document Properties (`Ctrl+D`) has "Show: Document Title" selected instead of displaying obscure server filenames in the title bar.

---

## 📚 Remaining Inventory of Uncovered Sub-Domains

Below is the updated taxonomy analysis of remaining certification sections currently without an interactive sandbox:

### 🎓 CPACC (Core Competencies)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `CPACC-D1-D` | Domain 1 | Disability Demographics and Statistics | WHO global stats, census variations, aging populations |
| `CPACC-D2-A` | Domain 2 | Individualized Accommodations vs Universal Design | Workplace adjustments vs systemic universal design |
| `CPACC-D2-C` | Domain 2 | WCAG Principles and Application (POUR) | Overarching POUR framework across non-web ICT |
| `CPACC-D3-A` | Domain 3 | International Declarations & Conventions | UN CRPD Article 9, Marrakesh Treaty *(Queued in TODO #1)* |
| `CPACC-D3-E` | Domain 3 | Applying Standards to ICT Procurement | VPAT/ACR evaluation, Section 508 procurement checklists |

---

### 💻 WAS (Web Accessibility Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `WAS-D1-E` | Domain 1 | Accessibility-Supported Technologies | User agent and AT support baselines across browser engines |
| `WAS-D1-H` | Domain 1 | Strategies of Persons with Disabilities | Screen magnification, switch devices, speech input mechanics |
| `WAS-D2-A` | Domain 2 | Interoperability and Compatibility Issues | Cross-browser / cross-screen reader pairing quirks *(Queued in TODO #2)* |
| `WAS-D2-C` | Domain 2 | Testing with Assistive Technologies | Manual AT testing protocols (NVDA + Firefox, VoiceOver + Safari) |
| `WAS-D2-E` | Domain 2 | Accessibility Quality Assurance | CI/CD pipeline integration, regression testing gates |
| `WAS-D2-G` | Domain 2 | Testing for End-user Impact | Usability testing with people with disabilities |
| `WAS-D2-H` | Domain 2 | Testing Tools for the Web | Evaluation engines and accessibility scanners |
| `WAS-D3-B` | Domain 3 | Recommending Remediation Strategies | Interim workarounds vs root-cause architectural fixes |

---

### 📑 ADS (Accessible Document Specialist)
| Section ID | Domain | Sub-Domain Label | Core BoK Topic |
| :--- | :--- | :--- | :--- |
| `ADS-D1-B` | Domain 1 | Design, Create & Assemble Final Form | Multi-column layouts, master pages, export settings |
| `ADS-D3-B` | Domain 3 | Manual Document Testing Processes | Screen reader document navigation, reflow view testing *(Queued in TODO #3)* |
| `ADS-D3-D` | Domain 3 | Testing with Assistive Tech | JAWS, NVDA, and ReadOutLoud document reading behavior |
| `ADS-D4-A-G`| Domain 4 | Planning, Training & Workflows | Document lifecycle, intake forms, organizational SLAs |
| `ADS-D5-A-B`| Domain 5 | Policy Promotion, Advocacy & Advising | Institutional document compliance roadmaps and executive reporting |
