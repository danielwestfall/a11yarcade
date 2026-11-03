// IAAP WAS (Web Accessibility Specialist) Modules (12 Modules)
export const WAS_MODULES = [
  {
    "id": "mod-was-semantic-html",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-B",
    "title": "Semantic HTML vs Custom Controls (\"Div Soup\")",
    "badge": "Technical Mastery",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "interactiveType": "semantic-html-fixer",
    "citation": "WAS BoK 2024, Section 1.2 (Basic Programming Knowledge)",
    "summary": "Examine why native semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<input>`) are vastly superior to custom `<div>` constructions. Inspect accessibility trees and repair broken non-semantic markup.",
    "learningObjectives": [
      "Understand the built-in behaviors provided for free by native HTML: keyboard focusability, space/enter activation, accessible role, and state.",
      "Recognize how non-semantic `<div>` elements break screen readers and keyboard accessibility.",
      "Learn how to remediate pseudo-buttons, fake links, and unlabelled form controls into valid accessible semantics."
    ],
    "keyConcepts": [
      {
        "title": "Native Element Benefits (\"Free Functionality\")",
        "explanation": "A native `<button>` automatically has `role=\"button\"`, is keyboard focusable in the tab order, is activated by both Enter and Space, and reports disabled state without any JavaScript."
      },
      {
        "title": "The Pseudo-Button Trap",
        "explanation": "A `<div onclick=\"...\">` lacks keyboard focus, lacks an accessible role in the accessibility tree, cannot be triggered with Space or Enter, and is invisible to screen reader rotor buttons."
      },
      {
        "title": "Landmarks & Document Structure",
        "explanation": "Using `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` creates landmarks that screen reader users use to jump across sections in seconds."
      },
      {
        "title": "Button vs Link Decision",
        "explanation": "Links (`<a>`) navigate to a new location/URL or anchor. Buttons (`<button>`) perform an in-page action (open modal, submit data, toggle drawer)."
      }
    ],
    "examTips": "WAS exam questions frequently present code snippets with a `<div>` styled like a button or `<a href=\"#\">` and ask why it fails WCAG 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value). The answer is always lack of semantic role and keyboard activation.",
    "knowledgeCheck": [
      {
        "id": "kc-was-sem-1",
        "question": "Why does `<div class=\"btn\" onclick=\"save()\">Save</div>` fail WCAG 2.1.1 Keyboard?",
        "options": [
          {
            "id": "A",
            "text": "A div rejects inline event attributes like onclick in modern Chromium engines"
          },
          {
            "id": "B",
            "text": "A div is not naturally focusable and fails to fire on Enter/Space without script"
          },
          {
            "id": "C",
            "text": "Assistive tech ignores click handlers unless the label contains at least 5 letters"
          },
          {
            "id": "D",
            "text": "HTML5 deprecated the onclick attribute in favor of CSS pointer-event pseudoclasses"
          }
        ],
        "answer": "B",
        "explanation": "A generic <div> is excluded from the sequential keyboard tab order and lacks built-in Space/Enter key activation, whereas browsers do not reject inline CSS on divs, assistive tech does not ignore text inside divs, and divs do not block mouse click events."
      },
      {
        "id": "kc-was-sem-2",
        "question": "What is the appropriate HTML element for an interactive control that opens a slide-out filter modal on the same page?",
        "options": [
          {
            "id": "A",
            "text": "<button type=\"button\">Filters</button> triggering an in-page modal dialog action"
          },
          {
            "id": "B",
            "text": "<div class=\"filter-action\" onclick=\"openFilters()\">Filters</div> without keyboard support"
          },
          {
            "id": "C",
            "text": "<a href=\"#\">Filters</a> navigating to a hash fragment at the top of the document"
          },
          {
            "id": "D",
            "text": "<span role=\"link\" tabindex=\"0\">Filters</span> styled as an interactive button control"
          }
        ],
        "answer": "A",
        "explanation": "Native <button type=\"button\"> elements trigger in-page actions (such as opening modals or drawers), whereas <a href> links are reserved for navigating to a new URL or document resource."
      },
      {
        "id": "kc-was-sem-3",
        "question": "Which of the following creates a landmark region that allows screen reader users to skip straight to primary page content?",
        "options": [
          {
            "id": "A",
            "text": "<main> identifying the primary document content region for assistive technologies"
          },
          {
            "id": "B",
            "text": "<section class=\"content-body\"> without an accessible name or heading reference"
          },
          {
            "id": "C",
            "text": "<article class=\"page-container\"> grouping independent syndicated blog entries"
          },
          {
            "id": "D",
            "text": "<div id=\"primary-content\" class=\"main-wrapper\"> wrapping the central page column layout"
          }
        ],
        "answer": "A",
        "explanation": "The semantic <main> element exposes the main landmark role in the browser accessibility tree so screen reader users can jump straight past repetitive headers to primary page content."
      }
    ]
  },
  {
    "id": "mod-was-aria-patterns",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-D",
    "title": "WAI-ARIA: Live Regions, States & The First Rule",
    "badge": "Technical Mastery",
    "difficulty": "Advanced",
    "estimatedMinutes": 12,
    "interactiveType": "aria-live-lab",
    "citation": "WAS BoK 2024, Section 1.4 (Using ARIA) & W3C WAI-ARIA 1.2",
    "summary": "Master the Five Rules of ARIA, live region announcements (`aria-live=\"polite\"` vs `\"assertive\"`), dynamic state management (`aria-expanded`, `aria-selected`), and accessible name computation.",
    "learningObjectives": [
      "Apply the First Rule of ARIA: \"If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so.\"",
      "Configure `aria-live=\"polite\"` vs `aria-live=\"assertive\"` for asynchronous updates and form error banners.",
      "Implement dynamic state attributes (`aria-expanded`, `aria-hidden`, `aria-invalid`) with proper DOM synchronizations.",
      "Troubleshoot ARIA anti-patterns such as `role=\"button\"` on links or `aria-label` overriding visible text."
    ],
    "keyConcepts": [
      {
        "title": "The First Rule of ARIA",
        "explanation": "Never use ARIA as a substitute for native HTML elements when semantic elements exist. ARIA adds attributes to the accessibility tree; it does NOT add keyboard behaviors or focusability."
      },
      {
        "title": "Live Regions (`aria-live`)",
        "explanation": "`aria-live=\"polite\"` waits until the user is idle before announcing changes (used for search results, stock updates). `aria-live=\"assertive\"` or `role=\"alert\"` interrupts immediately for time-critical emergencies."
      },
      {
        "title": "States vs Properties",
        "explanation": "States change dynamically during interaction (`aria-expanded=\"false\"` -> `\"true\"` on an accordion). Properties describe stable characteristics (`aria-haspopup=\"dialog\"`)."
      },
      {
        "title": "Accessible Name Computation",
        "explanation": "Computed in order: `aria-labelledby` > `aria-label` > Native label / text content > `title` attribute. If `aria-label` is present, it completely replaces the visible text for screen readers!"
      }
    ],
    "examTips": "Remember: ARIA does NOT make an element focusable! Setting `role=\"button\"` on a `<div>` does NOT put it in the tab order. You still need `tabindex=\"0\"` and keyboard event listeners—which is why `<button>` is always better.",
    "knowledgeCheck": [
      {
        "id": "kc-was-aria-1",
        "question": "A live chat widget receives a new incoming message while the user is actively reading an article. Which `aria-live` setting should be used?",
        "options": [
          {
            "id": "A",
            "text": "aria-live=\"assertive\" queues alerts politely until current speech finishes"
          },
          {
            "id": "B",
            "text": "aria-live=\"polite\" waits until idle, while aria-live=\"assertive\" interrupts speech"
          },
          {
            "id": "C",
            "text": "aria-live=\"polite\" is for mobile browsers, while assertive is for desktop browsers"
          },
          {
            "id": "D",
            "text": "aria-live=\"assertive\" plays an auditory chime, whereas polite displays visual closed captions"
          }
        ],
        "answer": "B",
        "explanation": "aria-live=\"polite\" waits until the user pauses before speaking, whereas aria-live=\"assertive\" interrupts speech immediately for time-critical alerts; live regions control speech politeness rather than playing chime sounds or restricting support to mobile browsers."
      },
      {
        "id": "kc-was-aria-2",
        "question": "What is the First Rule of ARIA from the W3C WAI-ARIA Authoring Practices Guide?",
        "options": [
          {
            "id": "A",
            "text": "If you can use a native HTML element with built-in semantics, do so instead of ARIA"
          },
          {
            "id": "B",
            "text": "Adding explicit ARIA role attributes to standard HTML elements for clarity"
          },
          {
            "id": "C",
            "text": "Restricting WAI-ARIA attributes to mobile responsive layouts and touchscreen device viewports"
          },
          {
            "id": "D",
            "text": "Interactive elements must declare both aria-label and aria-describedby"
          }
        ],
        "answer": "A",
        "explanation": "The First Rule of ARIA states: \"If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so.\""
      },
      {
        "id": "kc-was-aria-3",
        "question": "An accordion header button expands and collapses its associated panel. Which ARIA attribute must be toggled on the button element?",
        "options": [
          {
            "id": "A",
            "text": "aria-pressed=\"true\" / \"false\" indicating the current state of a toggle button"
          },
          {
            "id": "B",
            "text": "aria-selected=\"true\" / \"false\" indicating the active tab inside a tablist widget"
          },
          {
            "id": "C",
            "text": "aria-expanded=\"true\" / \"false\" indicating whether the controlled panel is open"
          },
          {
            "id": "D",
            "text": "aria-hidden=\"true\" / \"false\" removing the trigger button from the accessibility tree"
          }
        ],
        "answer": "C",
        "explanation": "aria-expanded=\"true\" or \"false\" on the accordion trigger button communicates to screen readers whether its associated disclosure panel is currently expanded or collapsed."
      }
    ]
  },
  {
    "id": "mod-was-keyboard-focus",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-C",
    "title": "Keyboard Navigation & Focus Management",
    "badge": "Technical Mastery",
    "difficulty": "Intermediate",
    "estimatedMinutes": 9,
    "interactiveType": "keyboard-navigation-sandbox",
    "citation": "WAS BoK 2024, Section 1.3 (Interactive Controls & Best Practices)",
    "summary": "Master sequential keyboard navigation, modal focus traps, `tabindex` rules (0 vs -1 vs positive), skip links, and WCAG 2.2 focus appearance criteria (2.4.7 & 2.4.13).",
    "learningObjectives": [
      "Implement an accessible modal dialog with focus trapping and focus restoration to the trigger element on close.",
      "Explain the difference between `tabindex=\"0\"` (natural tab order), `tabindex=\"-1\"` (programmatic focus only), and why positive tabindex is an anti-pattern.",
      "Design bypass blocks (Skip to Content links) satisfying WCAG 2.4.1.",
      "Ensure high-contrast visible focus indicators conforming to WCAG 2.2 AA SC 2.4.11 and 2.4.13."
    ],
    "keyConcepts": [
      {
        "title": "tabindex Values and Usage",
        "explanation": "`tabindex=\"0\"` inserts element into natural sequential tab order. `tabindex=\"-1\"` allows programmatic focus via `.focus()` without being in tab order. Positive `tabindex` (> 0) disrupts natural document order and is considered an anti-pattern."
      },
      {
        "title": "Modal Dialog Focus Trap",
        "explanation": "When a modal opens: 1) Save trigger element; 2) Shift focus inside modal; 3) Trap Tab and Shift+Tab within modal; 4) Close on Escape; 5) Restore focus to trigger element."
      },
      {
        "title": "Skip to Content Links",
        "explanation": "Placed at the very top of the DOM. Hidden offscreen visually until focused, allowing keyboard-only users to bypass repetitive header navigation."
      },
      {
        "title": "Focus Appearance (WCAG 2.2)",
        "explanation": "Focus indicators must have at least 3:1 contrast against both focused and unfocused states, with a minimum perimeter area."
      }
    ],
    "examTips": "Exam question favorite: \"A developer sets outline: none on all buttons to remove the default browser ring. How does this violate WCAG?\" It violates WCAG 2.4.7 Focus Visible unless a custom high-contrast visible focus ring is provided.",
    "knowledgeCheck": [
      {
        "id": "kc-was-kb-1",
        "question": "When a user closes an accessible modal dialog by pressing the Escape key, where should keyboard focus immediately return?",
        "options": [
          {
            "id": "A",
            "text": "The top of the web page body element, resetting keyboard scroll coordinates to zero"
          },
          {
            "id": "B",
            "text": "The browser URL omnibox address bar, allowing the user to type a new destination"
          },
          {
            "id": "C",
            "text": "The first focusable anchor link located within the global website footer landmark"
          },
          {
            "id": "D",
            "text": "The trigger element (button or link) that originally invoked the modal dialog"
          }
        ],
        "answer": "D",
        "explanation": "When a modal dialog closes, focus must return to the invoking trigger button so keyboard users keep their place, rather than resetting scroll position to the top of the document, moving focus to the browser address omnibox, or leaving focus on an unmounted node."
      },
      {
        "id": "kc-was-kb-2",
        "question": "What is the effect of setting tabindex=\"-1\" on an HTML element?",
        "options": [
          {
            "id": "A",
            "text": "The interactive element is removed from the accessibility tree and hidden from screen readers"
          },
          {
            "id": "B",
            "text": "The element leaves sequential Tab order, but can receive focus via script .focus()"
          },
          {
            "id": "C",
            "text": "The element is prevented from receiving keyboard or programmatic script focus"
          },
          {
            "id": "D",
            "text": "The element is placed first in the sequential Tab navigation order on page load"
          }
        ],
        "answer": "B",
        "explanation": "`tabindex=\"-1\"` removes an element from sequential keyboard navigation while keeping it eligible for programmatic focus (e.g. error messages, modal containers)."
      },
      {
        "id": "kc-was-kb-3",
        "question": "Why is using positive tabindex values (e.g., tabindex=\"1\", tabindex=\"2\") strongly discouraged?",
        "options": [
          {
            "id": "A",
            "text": "They override natural DOM order, creating confusing and unpredictable focus jumps"
          },
          {
            "id": "B",
            "text": "They are unrecognized legacy attributes thrown as syntax warnings in browsers"
          },
          {
            "id": "C",
            "text": "They suppress default Spacebar click handling on standard interactive controls"
          },
          {
            "id": "D",
            "text": "Positive tabindex values prevent screen readers from reading text inside adjacent DOM containers"
          }
        ],
        "answer": "A",
        "explanation": "Positive tabindex values (tabindex=\"1\"+) hijack the natural DOM focus sequence and jump ahead of tabindex=\"0\" controls, rather than being unrecognized legacy HTML4 attributes, suppressing Enter/Space activation, or blocking screen readers from reading adjacent containers."
      }
    ]
  },
  {
    "id": "mod-was-wcag22",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-A",
    "title": "WCAG 2.2 New Success Criteria & Operable Interactions",
    "badge": "Technical Mastery",
    "difficulty": "Advanced",
    "estimatedMinutes": 11,
    "interactiveType": "wcag22-new-criteria-lab",
    "citation": "WAS BoK 2024, Section 1.1 & W3C WCAG 2.2 Recommendation (October 2023)",
    "summary": "Master the newest technical criteria introduced in WCAG 2.2: Target Size Minimum (2.5.8), Redundant Entry (3.3.7), Dragging Movements (2.5.7), and Consistent Help (3.2.6).",
    "learningObjectives": [
      "Apply SC 2.5.8 Target Size Minimum (24×24 CSS pixels) and calculate target offset spacing circles.",
      "Implement SC 3.3.7 Redundant Entry prevention techniques on multi-step forms.",
      "Provide single-pointer click alternatives for drag-and-drop components under SC 2.5.7.",
      "Verify consistent help placement across multi-page user journeys under SC 3.2.6."
    ],
    "keyConcepts": [
      {
        "title": "SC 2.5.8 Target Size (Minimum) (AA)",
        "explanation": "Pointer targets must be at least 24×24 CSS pixels, or have enough surrounding spacing such that a 24px diameter circle centered on the target does not overlap adjacent interactive elements."
      },
      {
        "title": "SC 3.3.7 Redundant Entry (A)",
        "explanation": "Information previously entered by the user in the same multi-step process must be auto-populated or available for selection (e.g. \"Billing address same as shipping\")."
      },
      {
        "title": "SC 2.5.7 Dragging Movements (AA)",
        "explanation": "Any interaction relying on dragging (sliders, sortable kanban cards, map panning) must provide an alternative single-pointer click/tap mechanism."
      },
      {
        "title": "SC 3.2.6 Consistent Help (A)",
        "explanation": "If contact details, chat widgets, or FAQs are provided across multiple pages, they must appear in the same relative visual and sequential reading order."
      }
    ],
    "examTips": "Notice the WCAG 2.2 deprecation: WCAG 2.2 officially removed 4.1.1 Parsing because modern browsers automatically resolve HTML parsing errors, refocusing audits entirely on assistive technology impact.",
    "knowledgeCheck": [
      {
        "id": "kc-was-22-1",
        "question": "Under WCAG 2.2 SC 2.5.8 Target Size (Minimum), what is the minimum required dimensions for pointer interactive targets at Level AA?",
        "options": [
          {
            "id": "A",
            "text": "12×12 CSS pixels (or 24×24 CSS pixels with tight circular inline margins)"
          },
          {
            "id": "B",
            "text": "24×24 CSS pixels (or an equivalent spacing offset ensuring 24px diameter clearance)"
          },
          {
            "id": "C",
            "text": "44�44 CSS pixels (required for Level AA interactive controls on mobile touchscreen viewports)"
          },
          {
            "id": "D",
            "text": "48×48 CSS pixels (recommended under legacy mobile Android design guidelines)"
          }
        ],
        "answer": "B",
        "explanation": "WCAG 2.2 SC 2.5.8 requires at least 24×24 CSS pixels for Level AA (while Level AAA SC 2.5.5 Target Size Enhanced recommends 44×44 CSS pixels)."
      },
      {
        "id": "kc-was-22-2",
        "question": "A web app requires users to drag tasks between Kanban columns. How can developers conform to WCAG 2.2 SC 2.5.7 Dragging Movements?",
        "options": [
          {
            "id": "A",
            "text": "Provide single-pointer click alternatives (e.g. Move Left/Right buttons or menus)"
          },
          {
            "id": "B",
            "text": "Remove drag-and-drop and require users to type column names in a standard text field"
          },
          {
            "id": "C",
            "text": "Play an auditory confirmation sound effect whenever a card drag movement starts"
          },
          {
            "id": "D",
            "text": "Increase the required pointer drag distance to prevent accidental card movements"
          }
        ],
        "answer": "A",
        "explanation": "SC 2.5.7 requires that any functionality achievable via dragging can also be operated using single pointer clicks/taps without sustained movement."
      },
      {
        "id": "kc-was-22-3",
        "question": "Which historical WCAG 2.0 / 2.1 success criterion was officially removed (obsoleted) from WCAG 2.2?",
        "options": [
          {
            "id": "A",
            "text": "SC 4.1.1 was updated to require strict XML schema validation across web pages"
          },
          {
            "id": "B",
            "text": "SC 4.1.1 was elevated from Level A to Level AAA conformance for mission-critical web portals"
          },
          {
            "id": "C",
            "text": "SC 4.1.1 was marked obsolete and removed because modern browsers handle parsing"
          },
          {
            "id": "D",
            "text": "SC 4.1.1 was renamed to \"Consistent Identification and Accessible Naming\""
          }
        ],
        "answer": "C",
        "explanation": "SC 4.1.1 Parsing was obsoleted in WCAG 2.2 because modern browser HTML parsers handle missing end tags and duplicate attributes predictably in DOM construction."
      }
    ]
  },
  {
    "id": "mod-was-custom-widgets",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-F",
    "title": "Standard Controls vs Custom Widgets (W3C APG Tablist Pattern)",
    "badge": "Technical Mastery",
    "difficulty": "Advanced",
    "estimatedMinutes": 10,
    "interactiveType": "accessible-tabs-combobox-lab",
    "citation": "WAS BoK 2024, Section 1.3 & W3C WAI-ARIA Authoring Practices Guide (APG)",
    "summary": "Implement complex interactive widgets conforming to the W3C Authoring Practices Guide (APG). Master roving `tabindex`, keyboard event listeners, and `role=\"tablist\"` architectures.",
    "learningObjectives": [
      "Implement the W3C APG Tabs Pattern using `role=\"tablist\"`, `role=\"tab\"`, and `role=\"tabpanel\"`.",
      "Explain the Roving Tabindex technique for multi-item compound widgets.",
      "Configure arrow key navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`) inside custom interactive toolbars and menus."
    ],
    "keyConcepts": [
      {
        "title": "Single Tab Stop Rule",
        "explanation": "A compound widget (such as a tablist, menubar, or grid) must represent only ONE sequential Tab stop on the page. Pressing Tab lands on the active item; pressing Tab again exits the widget completely."
      },
      {
        "title": "Arrow Key Navigation",
        "explanation": "Navigation BETWEEN items inside the widget must be performed using the Arrow keys (`ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown`), `Home`, and `End`."
      },
      {
        "title": "Roving tabindex Architecture",
        "explanation": "The currently selected tab has `tabindex=\"0\"`; all other unselected tabs in the list have `tabindex=\"-1\"`. When the user arrows to a new tab, JavaScript moves the `0` to the new target."
      }
    ],
    "examTips": "Classic WAS exam question: If a tablist contains 6 tabs, how many times should a keyboard user press the Tab key to move through the entire tablist and into the panel? Answer: Exactly ONCE into the active tab, and ONCE into the panel (Arrow keys move between tabs).",
    "knowledgeCheck": [
      {
        "id": "kc-was-widget-1",
        "question": "According to the WAI-ARIA Authoring Practices Guide (APG) Tabs Pattern, how should a user navigate between individual tabs in a tablist?",
        "options": [
          {
            "id": "A",
            "text": "Arrow keys (Left/Right or Up/Down) move focus, while Tab moves out to the tabpanel"
          },
          {
            "id": "B",
            "text": "The Tab key moves focus through every individual tab button before entering the active tabpanel"
          },
          {
            "id": "C",
            "text": "The Spacebar permanently locks focus inside the active tab until Escape is pressed"
          },
          {
            "id": "D",
            "text": "Mouse hover is mandatory to activate tab selection; keyboard operation is optional"
          }
        ],
        "answer": "A",
        "explanation": "In the standard APG Tabs pattern, the Tab key enters/exits the tablist, while Arrow keys navigate between individual tabs without cluttering sequential tab stops."
      },
      {
        "id": "kc-was-widget-2",
        "question": "Under the roving tabindex strategy for accessible tabs, which tabindex value is assigned to the inactive, unselected tabs?",
        "options": [
          {
            "id": "A",
            "text": "tabindex=\"0\" placing every inactive tab into the sequential keyboard Tab order"
          },
          {
            "id": "B",
            "text": "tabindex=\"1\" forcing inactive tabs ahead of document header links in Tab order"
          },
          {
            "id": "C",
            "text": "tabindex=\"-1\" removing inactive tabs from Tab order while allowing arrow focus"
          },
          {
            "id": "D",
            "text": "tabindex=\"auto\" delegating tablist focus management to browser default heuristics"
          }
        ],
        "answer": "C",
        "explanation": "Under the WAI-ARIA APG roving tabindex pattern, unselected tabs receive tabindex=\"-1\" so Tab skips past them into the active tabpanel while Left/Right Arrow keys call .focus() programmatically."
      },
      {
        "id": "kc-was-widget-3",
        "question": "Which ARIA attribute explicitly connects a tab button to its corresponding content container?",
        "options": [
          {
            "id": "A",
            "text": "aria-labelledby=\"panel-id\" overriding the accessible name of the tab button itself"
          },
          {
            "id": "B",
            "text": "aria-owns=\"panel-id\" rearranging the parent-child hierarchy in the accessibility tree"
          },
          {
            "id": "C",
            "text": "aria-current=\"page\" indicating the active navigation link within a site breadcrumb"
          },
          {
            "id": "D",
            "text": "aria-controls=\"panel-id\" referencing the DOM id of the associated tabpanel element"
          }
        ],
        "answer": "D",
        "explanation": "aria-controls on each <button role=\"tab\"> points to the id of the corresponding <div role=\"tabpanel\"> that the tab activates."
      }
    ]
  },
  {
    "id": "mod-was-triage-severity",
    "cert": "WAS",
    "domainId": "WAS-D3",
    "domainLabel": "Domain 3: Remediating Issues in Web Solutions",
    "sectionId": "WAS-D3-A",
    "title": "Defect Severity, Prioritization & Risk Management",
    "badge": "Technical Mastery",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "interactiveType": "issue-severity-triage-lab",
    "citation": "WAS BoK 2024, Section 3.1 (Severity and Prioritization of Issues)",
    "summary": "Triage digital accessibility defects based on end-user impact, task criticality, and legal risk. Learn how to rank blockers (P1) vs serious (P2) vs moderate (P3) bugs.",
    "learningObjectives": [
      "Prioritize remediation backlogs based on functional user impact rather than conformance level letters alone.",
      "Define Blocker defects: complete impediments to core user journeys with no feasible workarounds.",
      "Differentiate between high-impact transactional barriers and minor informational cosmetic issues."
    ],
    "keyConcepts": [
      {
        "title": "Impact-Driven Prioritization",
        "explanation": "A Level A failure that affects a decorative element is far less severe than a Level AA contrast failure on a critical checkout call-to-action. Prioritize by USER IMPACT."
      },
      {
        "title": "Blocker Severity (P1)",
        "explanation": "Prevents access to core functionality (login, payment, document submission) or traps keyboard focus. Requires immediate hotfix deployment."
      },
      {
        "title": "Serious Severity (P2)",
        "explanation": "Causes high frustration or requires significant effort to overcome, but an alternative pathway or workaround exists."
      }
    ],
    "examTips": "On the WAS exam, whenever asked which issue to remediate first, select the issue that blocks a user from completing a task or poses physical safety risks (e.g. photosensitive seizure triggers or unclosable traps).",
    "knowledgeCheck": [
      {
        "id": "kc-was-triage-1",
        "question": "Which of the following accessibility defects should be triaged as a Critical Blocker (P1) for immediate remediation?",
        "options": [
          {
            "id": "A",
            "text": "A decorative corporate copyright icon in the footer lacks an alternative text attribute"
          },
          {
            "id": "B",
            "text": "A secondary paragraph in the footer exhibits a 4.2:1 contrast ratio instead of 4.5:1"
          },
          {
            "id": "C",
            "text": "A modal dialog traps keyboard focus, preventing users from exiting or navigating"
          },
          {
            "id": "D",
            "text": "A multi-item bulleted list is coded visually using raw paragraphs instead of <ul>"
          }
        ],
        "answer": "C",
        "explanation": "Keyboard focus traps are severe blockers (violating SC 2.1.2) that completely strand keyboard-only and screen reader users with no exit path."
      },
      {
        "id": "kc-was-triage-2",
        "question": "When triaging an accessibility remediation backlog, why is relying solely on WCAG conformance levels (A vs AA vs AAA) flawed?",
        "options": [
          {
            "id": "A",
            "text": "Level AAA success criteria are mandated by statutory civil rights laws and international treaties"
          },
          {
            "id": "B",
            "text": "Automated testing tools cannot parse or evaluate Level A success criteria"
          },
          {
            "id": "C",
            "text": "WCAG conformance levels are re-indexed and altered every month by the W3C"
          },
          {
            "id": "D",
            "text": "A minor Level A flaw has far less user impact than a Level AA flaw blocking checkout"
          }
        ],
        "answer": "D",
        "explanation": "Conformity levels reflect technical applicability and consensus, not business criticality. Real-world prioritization must weigh user impact and task completion."
      },
      {
        "id": "kc-was-triage-3",
        "question": "What characterizes a \"Serious\" (P2) accessibility defect?",
        "options": [
          {
            "id": "A",
            "text": "It triggers immediate physical health hazards like photosensitive seizures"
          },
          {
            "id": "B",
            "text": "It creates high friction, but an alternative workaround pathway exists to complete tasks"
          },
          {
            "id": "C",
            "text": "It represents an editorial typo in an organization's public privacy policy page"
          },
          {
            "id": "D",
            "text": "It impacts end users running legacy desktop operating systems released prior to Windows XP"
          }
        ],
        "answer": "B",
        "explanation": "A Serious (P2) defect creates substantial friction or time delays for assistive technology users while still leaving a workaround path, unlike Critical (P1) blockers or seizure hazards, minor cosmetic privacy-policy typos, or issues limited to obsolete pre-2005 operating systems."
      }
    ]
  },
  {
    "id": "mod-was-spa-routing",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-G",
    "title": "Single-Page Applications (SPA) Routing & Focus Management",
    "badge": "SPA Accessibility",
    "difficulty": "Advanced",
    "estimatedMinutes": 14,
    "interactiveType": "spa-routing-lab",
    "citation": "IAAP WAS BoK 2024, Domain 1.G (Single-Page Applications), W3C WCAG 2.1/2.2 SC 2.4.2, 2.4.3, 4.1.3 & WAI-ARIA 1.2",
    "summary": "Architect accessible client-side routing in React, Vue, and Angular SPAs. Solve the three primary SPA accessibility failures: missing page title updates (WCAG 2.4.2), stranded keyboard focus (WCAG 2.4.3), and silent screen reader transitions (WCAG 4.1.3) through programmatic focus management and ARIA live route announcers.",
    "learningObjectives": [
      "Identify why client-side route transitions in Single-Page Applications fail default browser accessibility behaviors.",
      "Implement automated document title synchronization on route change to satisfy WCAG 2.4.2 Page Titled.",
      "Manage programmatic keyboard focus to the new page primary heading (<h1 tabIndex=\"-1\">) or main landmark (WCAG 2.4.3).",
      "Build an off-screen ARIA live region route announcer (aria-live=\"polite\", aria-atomic=\"true\") to notify screen readers of view changes.",
      "Prevent focus traps and skipped content when dynamically mounting and unmounting virtual DOM components."
    ],
    "keyConcepts": [
      {
        "title": "The SPA Navigation Breakdown",
        "explanation": "In multi-page apps (MPAs), clicking a link causes the browser to fetch HTML, update the window title, reset scroll position, and announce the new page to screen readers. In client-side SPAs (history.pushState / virtual DOM), none of these native actions occur automatically."
      },
      {
        "title": "Document Title Synchronization (WCAG 2.4.2)",
        "explanation": "WCAG 2.4.2 requires web pages to have descriptive titles. In SPAs, routing hooks (e.g., React useEffect or Vue router afterEach) must dynamically synchronize document.title on every view transition."
      },
      {
        "title": "Programmatic Focus Transfer (WCAG 2.4.3)",
        "explanation": "When client-side navigation occurs, keyboard focus remains stranded on the clicked link in the navbar unless programmatically moved. Shifting focus to the main route heading with <h1 tabIndex=\"-1\"> guides the keyboard user directly to the new content."
      },
      {
        "title": "ARIA Live Route Announcers (WCAG 4.1.3)",
        "explanation": "An off-screen container with aria-live=\"polite\" and aria-atomic=\"true\" announces the newly loaded view name to screen readers without interrupting immediate user input."
      }
    ],
    "examTips": "WAS Exam Alert: Remember that <h1 tabIndex=\"-1\"> is NOT added to the sequential keyboard Tab order, but IT CAN BE focused via JavaScript (element.focus()). This is the industry-standard APG pattern for SPA focus management. Always pair title updates with an ARIA live route announcement or focus move.",
    "knowledgeCheck": [
      {
        "id": "kc-was-spa-1",
        "question": "Why do default client-side route transitions in SPAs create severe accessibility barriers for screen reader users?",
        "options": [
          {
            "id": "A",
            "text": "Single page applications cannot render semantic HTML tags within virtual DOM nodes"
          },
          {
            "id": "B",
            "text": "Client-side routing libraries disable ARIA live region announcements inside virtual DOM trees"
          },
          {
            "id": "C",
            "text": "JavaScript execution is fundamentally unparsed by screen reader virtual buffers"
          },
          {
            "id": "D",
            "text": "Client-side routing bypasses native page reloads, leaving focus stranded and AT silent"
          }
        ],
        "answer": "D",
        "explanation": "Client-side SPA routers update the view via history.pushState without a browser page reload, leaving keyboard focus stranded and screen readers silent unless managed, rather than blocking semantic HTML in virtual DOMs or halting JavaScript execution in screen reader buffers."
      },
      {
        "id": "kc-was-spa-2",
        "question": "When shifting programmatic keyboard focus to a new page heading in a SPA, why should tabindex=\"-1\" be used on the <h1>?",
        "options": [
          {
            "id": "A",
            "text": "It permanently prevents the heading from ever receiving programmatic focus via script"
          },
          {
            "id": "B",
            "text": "It enables script .focus() while keeping the heading out of the natural Tab sequence"
          },
          {
            "id": "C",
            "text": "It converts the static heading into an interactive button in the browser accessibility tree"
          },
          {
            "id": "D",
            "text": "It suppresses screen reader synthesized speech when announcing the heading text"
          }
        ],
        "answer": "B",
        "explanation": "tabIndex=\"-1\" makes any element programmatically focusable via script without injecting non-interactive elements into the keyboard Tab sequence."
      },
      {
        "id": "kc-was-spa-3",
        "question": "Which ARIA configuration is recommended for an off-screen SPA route change announcer?",
        "options": [
          {
            "id": "A",
            "text": "aria-live=\"polite\" aria-atomic=\"true\" to announce the new page title without cutting speech"
          },
          {
            "id": "B",
            "text": "aria-live=\"assertive\" aria-atomic=\"false\" to immediately interrupt ongoing audio"
          },
          {
            "id": "C",
            "text": "role=\"alert\" with aria-busy=\"true\" to signal that asynchronous network routing is still pending"
          },
          {
            "id": "D",
            "text": "aria-hidden=\"true\" to hide the route announcer from assistive technologies"
          }
        ],
        "answer": "A",
        "explanation": "aria-live=\"polite\" queues the route change notification so it does not rudely interrupt ongoing speech, and aria-atomic=\"true\" ensures the entire announcement is read as a complete unit."
      }
    ]
  },
  {
    "id": "mod-was-wcag-em",
    "cert": "WAS",
    "domainId": "WAS-D2",
    "domainLabel": "Domain 2: Identifying Accessibility Issues in Web Solutions",
    "sectionId": "WAS-D2-B",
    "title": "Guidelines, Conformance Requirements & WCAG-EM 1.0",
    "badge": "Audit Methodology",
    "difficulty": "Advanced",
    "estimatedMinutes": 15,
    "interactiveType": "wcag-em-audit-planner-lab",
    "citation": "IAAP WAS BoK 2024, Domain 2.B (Guidelines, Conformance Requirements and WCAG-EM) & W3C WCAG-EM 1.0",
    "summary": "Master the W3C Website Accessibility Conformance Evaluation Methodology (WCAG-EM 1.0). Plan and execute comprehensive accessibility audits across 5 structured steps: defining evaluation scope and baseline, exploring website functionality, curating representative and random sample pages, evaluating success criteria, and reporting formal conformance claims.",
    "learningObjectives": [
      "Execute the 5 core steps of the official W3C WCAG-EM 1.0 auditing methodology.",
      "Define an audit scope boundary, conformance target (WCAG 2.2 AA), and accessibility-supported baseline.",
      "Apply the Complete Processes rule: ensure end-to-end transactional workflows (e.g. cart to confirmation) are audited without omission.",
      "Curate a statistically valid representative sample combining structured template pages with randomly selected URLs.",
      "Author a formal WCAG-EM Conformance Statement with clear executive findings and remediation guidance."
    ],
    "keyConcepts": [
      {
        "title": "The 5 Steps of WCAG-EM",
        "explanation": "WCAG-EM 1.0 consists of 5 sequential steps: 1. Define Evaluation Scope, 2. Explore Target Website, 3. Select Representative Sample, 4. Audit Selected Sample, 5. Report Evaluation Findings."
      },
      {
        "title": "Scoping & Complete Processes",
        "explanation": "Under WCAG Conformance Requirement 3 (Complete Processes), an audit cannot claim conformance for a process (e.g. ordering a product) if any single page in that workflow is excluded or non-conforming."
      },
      {
        "title": "Representative Sampling Strategy",
        "explanation": "A reliable audit must evaluate: (1) Key web pages (home, contact), (2) All steps in complete processes, (3) Pages with diverse functionality/technologies (data grids, canvas, multimedia), and (4) Approximately 10% randomly selected URLs to uncover systemic template bugs."
      },
      {
        "title": "Conformance Statements & Claims",
        "explanation": "A conformance claim must state the date of evaluation, the guidelines version (WCAG 2.2), conformance level (Level AA), scope of web pages, and accessibility-supported baseline."
      }
    ],
    "examTips": "WAS Exam Alert: Remember that you cannot claim partial conformance for a single page — conformance is all-or-nothing per page. Also remember the \"Complete Processes\" mandate: if any single step in a multi-step form fails, the entire process fails conformance.",
    "knowledgeCheck": [
      {
        "id": "kc-was-em-1",
        "question": "Under W3C WCAG-EM Step 3 (Select a Representative Sample), why is it mandatory to include a randomly selected sample alongside structured key pages?",
        "options": [
          {
            "id": "A",
            "text": "To minimize hourly consulting fees billed to commercial enterprise clients during site reviews"
          },
          {
            "id": "B",
            "text": "To uncover unexpected systemic defects and atypical templates omitted from curated samples"
          },
          {
            "id": "C",
            "text": "Because screen readers parse URLs generated through randomized seed lists"
          },
          {
            "id": "D",
            "text": "To satisfy international ISO 9001 industrial manufacturing audit protocols"
          }
        ],
        "answer": "B",
        "explanation": "Including approximately 10% randomly drawn URLs prevents auditor bias and exposes uncurated template variations or forgotten site sections."
      },
      {
        "id": "kc-was-em-2",
        "question": "According to WCAG Conformance Requirement 3 (Complete Processes), what happens if a multi-step checkout flow has 4 accessible pages but 1 page with an inaccessible payment button?",
        "options": [
          {
            "id": "A",
            "text": "The complete transaction process fails conformance because each sequential step must conform"
          },
          {
            "id": "B",
            "text": "The site can claim 80% proportional conformance for the completed pages"
          },
          {
            "id": "C",
            "text": "The non-conforming payment page is automatically excluded from the audit report"
          },
          {
            "id": "D",
            "text": "Overall conformance defaults to Level AAA for the individual steps that pass technical checks"
          }
        ],
        "answer": "A",
        "explanation": "Under WCAG-EM Step 5, a multi-step process (such as checkout) is only as accessible as its weakest step: if any required step fails Level AA, the entire process fails conformance, rather than averaging scores proportionally or excluding payment forms."
      },
      {
        "id": "kc-was-em-3",
        "question": "What are the 5 official sequential steps of the W3C WCAG-EM 1.0 methodology?",
        "options": [
          {
            "id": "A",
            "text": "Lint Code, Automated Scan, Manual Screen Reader Test, Bug Fix, Deployment"
          },
          {
            "id": "B",
            "text": "Identify Barriers, Isolate Code, Refactor DOM, Retest Components, Certification"
          },
          {
            "id": "C",
            "text": "Define Scope, Explore Website, Select Sample, Audit Sample, Report Findings"
          },
          {
            "id": "D",
            "text": "Vendor Procurement, Gap Analysis, Staff Training, Remediation, Litigation Defense"
          }
        ],
        "answer": "C",
        "explanation": "WCAG-EM 1.0 is structured into: 1. Define Scope, 2. Explore Target Website, 3. Select Representative Sample, 4. Audit Selected Sample, 5. Report Evaluation Findings."
      }
    ]
  },
  {
    "id": "mod-was-procurement",
    "cert": "WAS",
    "domainId": "WAS-D3",
    "domainLabel": "Domain 3: Remediating Issues in Web Solutions",
    "sectionId": "WAS-D3-C",
    "title": "Accessibility in ICT Procurement & Vendor Management",
    "badge": "Procurement & VPAT",
    "difficulty": "Advanced",
    "estimatedMinutes": 14,
    "interactiveType": "vpat-procurement-auditor-lab",
    "citation": "IAAP WAS BoK 2024, Domain 3.C (Accessibility Procurement Process), Section 508 & EN 301 549",
    "summary": "Manage accessibility throughout the ICT procurement lifecycle. Draft binding RFP requirements, evaluate vendor Voluntary Product Accessibility Templates (VPATs) and Accessibility Conformance Reports (ACRs), detect vendor \"greenwashing\", conduct validation audits, and negotiate enforceable contract remediation SLAs and indemnification clauses.",
    "learningObjectives": [
      "Integrate accessibility requirements (WCAG 2.2 AA, Section 508, EN 301 549) into procurement Statements of Work (SOWs) and RFPs.",
      "Analyze vendor Accessibility Conformance Reports (ACRs) based on VPAT 2.x standards.",
      "Identify vendor \"greenwashing\" red flags: 100% \"Supports\" claims with generic copy-pasted text and suspicious \"Not Applicable\" ratings.",
      "Require and execute independent hands-on verification audits of vendor demo environments prior to contract signature.",
      "Negotiate binding contractual safeguards: vendor remediation timelines (e.g. 30 days for Blocker defects) and legal indemnification."
    ],
    "keyConcepts": [
      {
        "title": "The ICT Procurement Risk",
        "explanation": "Acquiring third-party commercial-off-the-shelf (COTS) software without accessibility vetting is the leading cause of enterprise digital accessibility compliance failures. Once locked into a multi-year enterprise license, organizations inherit the vendor's legal liability under ADA Title III or Section 508."
      },
      {
        "title": "VPAT vs ACR",
        "explanation": "A Voluntary Product Accessibility Template (VPAT) is the blank standardized template maintained by the Information Technology Industry Council (ITI). When a vendor completes the template evaluating their product against accessibility standards, the resulting document is called an Accessibility Conformance Report (ACR)."
      },
      {
        "title": "Spotting Vendor \"Greenwashing\"",
        "explanation": "Dishonest vendors often claim 100% \"Supports\" across all 50 WCAG criteria to pass automated procurement filters. Key red flags: identical copy-pasted remarks for every criterion, listing core web criteria (contrast, keyboard) as \"Not Applicable\", and failing to document assistive technology testing configurations (e.g. NVDA, JAWS, VoiceOver)."
      },
      {
        "title": "Contractual Enforcement Clauses",
        "explanation": "A trustworthy ACR is only the first step. Commercial contracts must include: (1) Vendor Warranty of Accessibility, (2) Liquidated damages or withholding payments for non-compliance, (3) Binding Remediation SLAs (e.g. Critical defects fixed within 30 days), and (4) Buyer's right to perform independent third-party audits."
      }
    ],
    "examTips": "WAS Exam Alert: Remember that an ACR is only a vendor claim — it is NOT a certification. Due diligence ALWAYS requires independent manual verification testing. Also know the VPAT 2.x editions: 508 (US Federal), WCAG (W3C standard), EU (EN 301 549), and INT (International combining all three).",
    "knowledgeCheck": [
      {
        "id": "kc-was-pro-1",
        "question": "What is the critical distinction between a VPAT and an ACR in the accessibility procurement process?",
        "options": [
          {
            "id": "A",
            "text": "A VPAT is the blank reporting template; an ACR is the completed product conformance report"
          },
          {
            "id": "B",
            "text": "A VPAT evaluates physical hardware, whereas an ACR is used for cloud software"
          },
          {
            "id": "C",
            "text": "A VPAT is legally binding under federal law, while an ACR is an informal marketing document"
          },
          {
            "id": "D",
            "text": "An ACR is authored independently by government compliance review inspectors"
          }
        ],
        "answer": "A",
        "explanation": "ITI publishes the blank VPAT template; once an organization fills it out with product-specific audit findings, it becomes an Accessibility Conformance Report (ACR)."
      },
      {
        "id": "kc-was-pro-2",
        "question": "When evaluating a vendor's submitted Accessibility Conformance Report (ACR), which of the following is a major red flag indicating potential \"vendor greenwashing\"?",
        "options": [
          {
            "id": "A",
            "text": "The vendor discloses 3 known contrast issues with committed engineering fix dates"
          },
          {
            "id": "B",
            "text": "The vendor provides testing documentation conducted with both NVDA and JAWS"
          },
          {
            "id": "C",
            "text": "The vendor claims 100% \"Supports\" across criteria with zero evaluative explanations"
          },
          {
            "id": "D",
            "text": "The vendor completed the report using the current VPAT 2.5 WCAG Edition"
          }
        ],
        "answer": "C",
        "explanation": "A credible VPAT / ACR uses \"Partially Supports\" with concrete remarks explaining which success criteria pass, which fail, and what workarounds exist, rather than claiming blanket 100% conformance without evidence or leaving evaluation columns blank."
      },
      {
        "id": "kc-was-pro-3",
        "question": "Why must enterprise contracts incorporate a binding Accessibility Remediation Service Level Agreement (SLA)?",
        "options": [
          {
            "id": "A",
            "text": "To eliminate the need for the vendor to provide ongoing customer technical support"
          },
          {
            "id": "B",
            "text": "To allow the vendor to raise recurring enterprise software subscription rates annually"
          },
          {
            "id": "C",
            "text": "To prevent employees from utilizing third-party screen magnification utilities"
          },
          {
            "id": "D",
            "text": "To legally obligate the vendor to remediate newly discovered barriers within 30 days"
          }
        ],
        "answer": "D",
        "explanation": "Contractual procurement clauses should mandate an independent audit roadmap with binding remediation milestones before deployment, rather than accepting a vendor VPAT at face value without verification or granting indefinite waivers for customer-facing barriers."
      }
    ]
  },
  {
    "id": "mod-was-act-rules",
    "cert": "WAS",
    "domainId": "WAS-D2",
    "domainLabel": "Domain 2: Identifying Accessibility Issues in Web Solutions",
    "sectionId": "WAS-D2-D",
    "title": "Testing Tools for the Web & W3C ACT (Accessibility Conformance Testing) Rules",
    "badge": "ACT Rules & Testing Tools",
    "difficulty": "Advanced",
    "estimatedMinutes": 14,
    "interactiveType": "act-rules-linter-lab",
    "citation": "IAAP WAS BoK 2024, Domain 2.D (Testing Tools for the Web and ACT Rules) & W3C ACT Rules Format 1.0",
    "summary": "Master automated and semi-automated testing tools and the W3C Accessibility Conformance Testing (ACT) Rules Format 1.0. Understand how ACT Rules harmonize testing engines (axe-core, ARC, Lighthouse) to produce transparent, reproducible results. Configure automated CI/CD accessibility gates, debug ACT test cases, and distinguish false positives from true defects.",
    "learningObjectives": [
      "Explain the architecture and purpose of the W3C ACT Rules Format 1.0 in harmonizing web accessibility tools.",
      "Analyze the four structural components of an ACT Rule: Input Aspects, Applicability, Expectations, and Test Cases.",
      "Differentiate automated rules (deterministic), semi-automated checks (requiring human confirmation), and manual test requirements.",
      "Integrate automated rule engines (axe-core, linting plugins) into CI/CD build gates with severity thresholds.",
      "Identify and resolve common false positive and false negative scenarios generated by automated linters."
    ],
    "keyConcepts": [
      {
        "title": "What is an ACT Rule?",
        "explanation": "Different accessibility test engines historically interpreted WCAG criteria differently, causing the same webpage to pass in one tool and fail in another. The W3C ACT Rules Format 1.0 establishes vendor-neutral, unambiguous, algorithmic test definitions to standardize test results across all compliance engines."
      },
      {
        "title": "ACT Structural Architecture",
        "explanation": "An ACT Rule specifies: (1) Input Aspects (DOM tree, CSS styling, Accessibility Tree), (2) Applicability (the exact CSS/DOM conditions identifying test targets), (3) Expectations (what properties must be true for the target to pass), and (4) Test Cases (passed, failed, and inapplicable examples)."
      },
      {
        "title": "Automated vs Semi-Automated vs Manual",
        "explanation": "Fully automated tests are 100% deterministic (e.g. checking whether an <img> tag has an alt attribute or calculating contrast ratio). Semi-automated tools flag items for human verification (e.g. \"Does this alt text accurately describe the chart?\"). Manual testing evaluates cognitive flow, reading order, and complex custom widget interactions."
      },
      {
        "title": "CI/CD Build Gates & Regression Prevention",
        "explanation": "Embedding automated linters (e.g. axe-core in Playwright/Cypress/Jest) into continuous integration prevents accessibility regressions from merging into production. Build gates should block PRs on Critical and Serious violations."
      }
    ],
    "examTips": "WAS Exam Alert: Remember that automated tools alone can only evaluate ~30-40% of WCAG criteria. Automated tools excel at catching syntax flaws (missing attributes, duplicate IDs, invalid ARIA attributes, color contrast math), but CANNOT evaluate subjective or semantic criteria (e.g. alt text quality, focus logical order, clear heading wording).",
    "knowledgeCheck": [
      {
        "id": "kc-was-act-1",
        "question": "What is the primary objective of the W3C Accessibility Conformance Testing (ACT) Rules Format 1.0?",
        "options": [
          {
            "id": "A",
            "text": "To replace WCAG 2.2 criteria with a brand new set of legally binding standards"
          },
          {
            "id": "B",
            "text": "To mandate that commercial web applications be authored in TypeScript code"
          },
          {
            "id": "C",
            "text": "To provide unambiguous test definitions so tools and auditors evaluate criteria consistently"
          },
          {
            "id": "D",
            "text": "To replace manual assistive technology testing with deterministic static source-code analysis"
          }
        ],
        "answer": "C",
        "explanation": "The W3C ACT Rules Format standardizes testing procedures across different software engines (like axe-core, QualWeb, ARC) so that compliance determinations are consistent and reproducible."
      },
      {
        "id": "kc-was-act-2",
        "question": "Which structural component of a W3C ACT Rule identifies the exact conditions and DOM elements that must be evaluated by the rule?",
        "options": [
          {
            "id": "A",
            "text": "Applicability (defining the specific target DOM elements and testing conditions)"
          },
          {
            "id": "B",
            "text": "Expectations (stating the invariant assertions that applicable targets must pass)"
          },
          {
            "id": "C",
            "text": "Assumptions (documenting environmental interpretations made by the rule author)"
          },
          {
            "id": "D",
            "text": "Accessibility Support (listing assistive technology and browser version pairings)"
          }
        ],
        "answer": "A",
        "explanation": "In the W3C ACT Rules Format 1.0, the Applicability section defines the exact DOM elements and conditions tested by the rule, before Expectations evaluate whether each applicable target passes or fails."
      },
      {
        "id": "kc-was-act-3",
        "question": "Why is automated accessibility testing in CI/CD pipelines considered necessary but insufficient for complete WCAG compliance?",
        "options": [
          {
            "id": "A",
            "text": "Automated accessibility linters cannot execute inside containerized Linux CI/CD build pipelines"
          },
          {
            "id": "B",
            "text": "Automated tools catch deterministic syntax (~30-40%), leaving contextual usability to humans"
          },
          {
            "id": "C",
            "text": "Automated accessibility testing in CI/CD is prohibited under Section 508 rules"
          },
          {
            "id": "D",
            "text": "Screen readers automatically crash if automated linters execute during page loads"
          }
        ],
        "answer": "B",
        "explanation": "Automated engines easily evaluate deterministic rules (like contrast ratios and missing labels), but cannot evaluate semantic validity, reading order flow, or manual assistive technology compatibility."
      }
    ]
  },
  {
    "id": "mod-was-interoperability",
    "cert": "WAS",
    "domainId": "WAS-D2",
    "domainLabel": "Domain 2: Identifying Accessibility Issues in Web Solutions",
    "sectionId": "WAS-D2-A",
    "sectionLabel": "Interoperability and Compatibility Issues",
    "citation": "IAAP WAS BoK 2024, Domain 2.A (Interoperability and Compatibility Issues), W3C ARIA in HTML & Platform Accessibility APIs (IA2/UIA/NSAccessibility)",
    "title": "Screen Reader & Browser Interoperability Matrix",
    "summary": "Explore how HTML and WAI-ARIA translate through platform accessibility APIs (IAccessible2, UI Automation, NSAccessibility, Android) into screen reader speech, and troubleshoot cross-browser quirks.",
    "duration": "25 mins",
    "level": "Advanced",
    "interactiveType": "cross-browser-compatibility-lab",
    "learningObjectives": [
      "Map the assistive technology processing pipeline: DOM/ARIA -> Browser Engine -> Platform Accessibility API -> Screen Reader.",
      "Compare core screen reader / browser baselines: NVDA + Firefox, JAWS + Chrome/Edge, VoiceOver + Safari, TalkBack + Chrome.",
      "Diagnose virtual buffer (Browse Mode) versus direct application (Focus Mode) switching in desktop Windows screen readers.",
      "Remediate platform-specific anomalies such as WebKit/VoiceOver live region double-speech and Android AccessibilityNodeInfo touch event drops."
    ],
    "keyConcepts": [
      {
        "title": "The Accessibility API Translation Pipeline",
        "explanation": "Web accessibility functions through an architectural chain: Authors write HTML/ARIA -> Browser engines (Blink, Gecko, WebKit) construct an Accessibility Tree -> Platform APIs (IAccessible2, UI Automation, NSAccessibility) expose nodes -> Screen readers query nodes and generate speech or Braille."
      },
      {
        "title": "Standard Screen Reader & Browser Testing Baselines",
        "explanation": "Web applications must be tested against standard industry pairings: NVDA + Firefox (Gecko / IA2), JAWS + Chrome or Edge (Blink / UIA), VoiceOver + Safari (WebKit / NSAccessibility on macOS/iOS), and TalkBack + Chrome (Android Accessibility Framework)."
      },
      {
        "title": "Browse Mode (Virtual Buffer) vs Focus Mode",
        "explanation": "Windows screen readers (NVDA & JAWS) maintain an off-screen virtual buffer (Browse Mode) intercepting arrow keys for text navigation. Entering an editable input or composite widget (role=\"grid\", role=\"tablist\") switches the screen reader into Focus Mode, passing keystrokes directly to the web page."
      },
      {
        "title": "Common Interoperability Pitfalls & Best Practices",
        "explanation": "Examples include: VoiceOver double-announcing aria-live regions when parent nodes are replaced in the DOM, JAWS failing to report listbox selection without aria-activedescendant, and mobile touch targets failing unless semantic button roles and actions are declared."
      }
    ],
    "practicalTakeaways": [
      "Always test with standard pairings: NVDA with Firefox, JAWS with Chrome or Edge, VoiceOver with Safari on macOS/iOS, and TalkBack with Chrome on Android.",
      "When building composite interactive widgets (grids, tabs, toolbars), manage roving tabIndex and widget roles to trigger automatic switch from Browse Mode to Focus Mode.",
      "Never re-create aria-live container elements in the DOM; keep the container static and mutate only its inner text to prevent duplicate speech announcements in WebKit."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-was-interop-1",
        "question": "When navigating an interactive data spreadsheet with arrow keys in NVDA on Firefox, pressing the Down Arrow reads the next word of text instead of moving to the next spreadsheet cell. Why does this occur?",
        "options": [
          {
            "id": "A",
            "text": "The table markup is missing an explicit <caption> tag, breaking arrow-key binding"
          },
          {
            "id": "B",
            "text": "The spreadsheet uses role=\"presentation\" which strips keyboard coordinate listeners"
          },
          {
            "id": "C",
            "text": "The operating system speech-to-text dictation engine is intercepting directional arrow keystrokes"
          },
          {
            "id": "D",
            "text": "NVDA is in Browse Mode, reading document text rather than passing keys in Focus Mode"
          }
        ],
        "answer": "D",
        "explanation": "When NVDA is in Browse Mode, arrow keys navigate the virtual document buffer line-by-line or word-by-word; interactive grid widgets require switching to Focus/Application Mode so keystrokes pass through to JavaScript listeners, unrelated to 60Hz monitor refresh rates or OS speech dictation."
      },
      {
        "id": "kc-was-interop-2",
        "question": "A live search results box with aria-live=\"polite\" produces duplicate spoken announcements in VoiceOver on Safari every time a query is executed. What coding anti-pattern is responsible?",
        "options": [
          {
            "id": "A",
            "text": "The CSS font size on the search results container is smaller than 14pt"
          },
          {
            "id": "B",
            "text": "The developer tears down and re-creates the entire live region DOM node on search"
          },
          {
            "id": "C",
            "text": "VoiceOver on macOS Safari ignores polite regions and announces aria-live=\"assertive\" updates"
          },
          {
            "id": "D",
            "text": "The search input control is coded as an HTML5 <input type=\"search\"> element"
          }
        ],
        "answer": "B",
        "explanation": "In WebKit/VoiceOver, replacing a DOM element that contains aria-live triggers both a node insertion utterance and a live region text change utterance. To avoid duplicate speech, keep the live region container permanently in the DOM and mutate only its text content."
      },
      {
        "id": "kc-was-interop-3",
        "question": "Which underlying platform accessibility API does VoiceOver interface with on macOS?",
        "options": [
          {
            "id": "A",
            "text": "Apple NSAccessibility on macOS (and UIAccessibility on iOS and iPadOS devices)"
          },
          {
            "id": "B",
            "text": "Microsoft UI Automation (UIA) and legacy MSAA/IAccessible2 on Windows desktops"
          },
          {
            "id": "C",
            "text": "GNOME ATK and AT-SPI2 inter-process communication buses on Linux distributions"
          },
          {
            "id": "D",
            "text": "Android AccessibilityService APIs powering TalkBack on mobile touchscreen phones"
          }
        ],
        "answer": "A",
        "explanation": "On macOS, Safari and native desktop applications expose accessibility tree semantics to VoiceOver through Apple's NSAccessibility API (and UIAccessibility on iOS/iPadOS)."
      }
    ]
  },
  {
    "id": "mod-was-strategies",
    "cert": "WAS",
    "domainId": "WAS-D1",
    "domainLabel": "Domain 1: Creating Accessible Web Solutions",
    "sectionId": "WAS-D1-H",
    "sectionLabel": "Strategies of Persons with Disabilities in Using Web Solutions",
    "citation": "IAAP WAS BoK 2024, Domain 1.H (Strategies of Persons with Disabilities in Using Web Solutions), W3C WAI Guidelines & WCAG 2.5.3 (Label in Name)",
    "title": "Assistive Strategies & Adaptive Hardware Input Simulator",
    "summary": "Examine diverse user strategies beyond screen readers: high-power screen magnification viewport panning, single/dual-switch device scanning rates, speech recognition command grammars, and high-contrast system overrides.",
    "duration": "26 mins",
    "level": "Advanced",
    "interactiveType": "adaptive-strategies-lab",
    "learningObjectives": [
      "Evaluate the perceptual and navigational impact of high-magnification screen viewports (200%-800%) on spatial layout and off-screen notifications.",
      "Calculate the motor and temporal cost of linear item scanning for single-switch and dual-switch users, reinforcing WCAG 2.4.1 Skip Links.",
      "Apply WCAG 2.5.3 (Label in Name) to ensure visual button labels match speech recognition voice command grammars (e.g. Dragon, Windows Voice Access).",
      "Implement robust CSS borders and color variables compatible with Windows High Contrast and CSS forced-colors mode."
    ],
    "keyConcepts": [
      {
        "title": "Screen Magnification Viewport & Visual Context Loss",
        "explanation": "Users with low vision frequently utilize magnification software (ZoomText, MAGic, OS magnifiers) at 200% to 800%. At high magnification, users see only a small portion of the screen, losing all peripheral vision. Floating alerts or off-screen error messages are invisible unless accompanied by programmatic focus shifts or live region announcements."
      },
      {
        "title": "Switch Device Scanning & Temporal Navigation Cost",
        "explanation": "Users with severe physical motor limitations (quadriplegia, ALS, cerebral palsy) may operate computers via single or dual physical switches (head switches, sip-and-puff). Single switches rely on auto-scanning, where the system highlights elements sequentially on a timer. Bypassing repetitive navigation blocks with Skip Links (WCAG 2.4.1) saves switch users dozens of exhausting minutes per session."
      },
      {
        "title": "Speech Recognition Command Grammar (WCAG 2.5.3 Label in Name)",
        "explanation": "Speech-to-text users (Dragon NaturallySpeaking, Apple Voice Control) speak the visual text they see to trigger controls (e.g. \"Click Submit\"). Under WCAG 2.5.3, the accessible name must contain the visual label. If aria-label replaces the visual text with something completely different, voice commands fail silently."
      },
      {
        "title": "OS High Contrast & CSS forced-colors: active",
        "explanation": "In Windows High Contrast and CSS forced-colors mode, the operating system strips author-defined background colors, gradients, and box-shadows to ensure high contrast text. Buttons that rely solely on background color without a border become completely invisible unless an explicit transparent border is defined."
      }
    ],
    "practicalTakeaways": [
      "Always ensure the accessible name of an interactive element starts with or contains its visible text label (WCAG 2.5.3).",
      "Provide visible Skip Links on the first keyboard stop to prevent switch and keyboard users from suffering extreme linear scanning fatigue.",
      "Add border: 1px solid transparent to all flat button designs so they render with crisp visible borders in forced-colors mode."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-was-strat-1",
        "question": "A button displays the visible label \"Search\". Its HTML is coded as: <button aria-label=\"Find catalog items by keyword\">Search</button>. Why does this fail WCAG 2.5.3 (Label in Name)?",
        "options": [
          {
            "id": "A",
            "text": "Because aria-label attributes are prohibited on native HTML <button> elements"
          },
          {
            "id": "B",
            "text": "Speech recognition users saying \"Click Search\" fail because the name omits \"Search\""
          },
          {
            "id": "C",
            "text": "Because the string \"Search\" is a reserved keyword in modern ECMAScript engines"
          },
          {
            "id": "D",
            "text": "Because the button font size is smaller than the 18pt large-text contrast threshold"
          }
        ],
        "answer": "B",
        "explanation": "WCAG 2.5.3 (Label in Name) requires that when a component has a visible text label (\"Search\"), its programmatic accessible name must contain that visible text string so voice-control users saying \"Click Search\" can activate it."
      },
      {
        "id": "kc-was-strat-2",
        "question": "How does providing a \"Skip to Main Content\" link (WCAG 2.4.1) primarily benefit single-switch assistive technology users?",
        "options": [
          {
            "id": "A",
            "text": "It lets switch users jump past repetitive header links without waiting through scan cycles"
          },
          {
            "id": "B",
            "text": "It compresses high-resolution raster images to reduce cellular bandwidth usage on mobile networks"
          },
          {
            "id": "C",
            "text": "It automatically disables third-party JavaScript tracking scripts on the web page"
          },
          {
            "id": "D",
            "text": "It converts the web page into an automated synthesized podcast stream on load"
          }
        ],
        "answer": "A",
        "explanation": "Single-switch users wait for an auto-scan highlight to step through interactive controls sequentially; a \"Skip to Main Content\" link (WCAG 2.4.1) lets them bypass dozens of header navigation items on the first scan step."
      },
      {
        "id": "kc-was-strat-3",
        "question": "Why is adding `border: 1px solid transparent` recommended for buttons that otherwise use only CSS background-color and box-shadow for styling?",
        "options": [
          {
            "id": "A",
            "text": "To prevent search engine web crawlers from indexing the button destination link"
          },
          {
            "id": "B",
            "text": "To minimize stylesheet download sizes across low-bandwidth mobile connections"
          },
          {
            "id": "C",
            "text": "To ensure button outlines remain visible when High Contrast mode removes backgrounds"
          },
          {
            "id": "D",
            "text": "To instruct mobile WebKit and Blink layout engines to apply hardware-accelerated touch styling"
          }
        ],
        "answer": "C",
        "explanation": "Adding type=\"button\" prevents a <button> inside a <form> from acting as type=\"submit\" and triggering an unexpected page reload, rather than changing its accessibility tree role, hiding it from search crawlers, or applying mobile browser touch styling."
      }
    ]
  }
];
