// Comprehensive IAAP Bodies of Knowledge Learning Modules Registry
// Covers CPACC (Core Competencies), WAS (Web Accessibility Specialist), and ADS (Accessible Document Specialist)
// Aligned with official IAAP BOK taxonomy and WCAG 2.1 / 2.2 standards

export const ACADEMY_TRACKS = [
  {
    id: 'all',
    code: 'ALL',
    name: 'All Certifications Suite',
    badge: '🌟 IAAP ACCREDITATION',
    desc: 'Master the complete digital accessibility spectrum: CPACC fundamentals, WAS technical implementation, and ADS document remediation.',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.15)'
  },
  {
    id: 'cpacc',
    code: 'CPACC',
    name: 'CPACC: Core Competencies',
    badge: '📘 IAAP CPACC',
    desc: 'Foundational models of disability, assistive technologies, universal design principles, and international accessibility legislation.',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)'
  },
  {
    id: 'was',
    code: 'WAS',
    name: 'WAS: Web Accessibility Specialist',
    badge: '💻 IAAP WAS',
    desc: 'Technical WCAG 2.1/2.2 AA success criteria, WAI-ARIA 1.2 patterns, keyboard focus management, and DOM code remediation.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'ads',
    code: 'ADS',
    name: 'ADS: Accessible Document Specialist',
    badge: '📄 IAAP ADS',
    desc: 'Accessible electronic document authoring, PDF/UA ISO 14289 tagging, heading hierarchies, table structures, and alt-text strategies.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)'
  }
];

export const LEARNING_MODULES = [
  // ==========================================
  // CPACC MODULES
  // ==========================================
  {
    id: 'mod-cpacc-models',
    cert: 'CPACC',
    domainId: 'CPACC-D1',
    domainLabel: 'Domain 1: Disabilities, Challenges & Assistive Tech',
    sectionId: 'CPACC-D1-A',
    title: 'Theoretical Models of Disability',
    badge: 'Core Competency',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    interactiveType: 'model-classifier',
    citation: 'CPACC BoK V3, Section 1.1 (Theoretical Models)',
    summary: 'Analyze how society conceives disability across Medical, Social, Biopsychosocial, Functional, Charity, and Human Rights frameworks. Understand why the Social Model is the cornerstone of modern accessibility.',
    learningObjectives: [
      'Distinguish between the Medical Model (deficit in individual) and Social Model (barriers created by environment).',
      'Understand the Biopsychosocial synthesis adopted by the World Health Organization (WHO ICF).',
      'Identify Functional Solutions, Charity/Tragedy, and Human Rights models in real-world policies and public campaigns.'
    ],
    keyConcepts: [
      {
        title: 'Social Model of Disability',
        explanation: 'Disability is not an inherent trait of a person; it is caused by the way society is organized. Environmental, physical, digital, and attitudinal barriers prevent people with impairments from participating equally.'
      },
      {
        title: 'Medical Model',
        explanation: 'Views disability as a pathology, deficit, or medical problem residing solely within the individual. The primary goal is curing or fixing the person to fit into an unyielding society.'
      },
      {
        title: 'Biopsychosocial Model (WHO ICF)',
        explanation: 'Integrates biological impairments, individual psychology, and social participation restrictions. Recognized by the World Health Organization as the comprehensive standard.'
      },
      {
        title: 'Functional Solutions Model',
        explanation: 'Focuses pragmatically on using technology, engineering, and accommodations to overcome limitations, regardless of socio-political debates.'
      },
      {
        title: 'Charity / Tragedy Model',
        explanation: 'Views disabled people as victims deserving pity, inspiration, or charity. Widely rejected by disability rights advocates because it strips individuals of agency and rights.'
      }
    ],
    examTips: 'IAAP exam scenarios often ask: "An employee cannot access a second-floor office because there is no elevator. How does the social model view this?" The answer is always that the building\'s architectural barrier disables the person, not their wheelchair.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-1',
        question: 'Under the Social Model of Disability, what is considered the primary cause of disability?',
        options: [
          { id: 'A', text: 'The medical diagnosis or physiological impairment of the individual' },
          { id: 'B', text: 'Barriers created by societal structures, physical environments, and attitudes' },
          { id: 'C', text: 'Lack of personal motivation and physical rehabilitation' },
          { id: 'D', text: 'Economic dependence on governmental welfare systems' }
        ],
        answer: 'B',
        explanation: 'The Social Model asserts that people are disabled by barriers in society (inaccessible buildings, websites, attitudes), not by their personal impairments.'
      },
      {
        id: 'kc-cpacc-2',
        question: 'Which model of disability combines biological factors, individual psychological experiences, and social context into an integrated framework adopted by the WHO?',
        options: [
          { id: 'A', text: 'The Functional Solutions Model' },
          { id: 'B', text: 'The Economic Model' },
          { id: 'C', text: 'The Biopsychosocial Model' },
          { id: 'D', text: 'The Charity Model' }
        ],
        answer: 'C',
        explanation: 'The Biopsychosocial Model (embodied in the WHO ICF) integrates biological, psychological, and social factors into a unified approach.'
      },
      {
        id: 'kc-cpacc-3',
        question: 'A telethon portrays people with disabilities as tragic victims who depend on the generosity of benefactors. Which model does this reflect?',
        options: [
          { id: 'A', text: 'Social Model' },
          { id: 'B', text: 'Human Rights Model' },
          { id: 'C', text: 'Charity / Tragedy Model' },
          { id: 'D', text: 'Universal Design Model' }
        ],
        answer: 'C',
        explanation: 'The Charity or Tragedy model frames disability as an unfortunate condition requiring pity and patronizing benevolence rather than equal rights.'
      }
    ]
  },

  {
    id: 'mod-cpacc-categories',
    cert: 'CPACC',
    domainId: 'CPACC-D1',
    domainLabel: 'Domain 1: Disabilities, Challenges & Assistive Tech',
    sectionId: 'CPACC-D1-B',
    title: 'Disability Categories, Barriers & Assistive Tech',
    badge: 'Core Competency',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    interactiveType: 'vision-contrast-simulator',
    citation: 'CPACC BoK V3, Section 1.2 (Categories & Barriers)',
    summary: 'Explore the major disability categories: Visual, Auditory, Physical/Motor, Cognitive/Learning, Speech, and Deafblindness. Test how color blindness, cataracts, and tunnel vision affect visual perception.',
    learningObjectives: [
      'Identify the spectrum of visual impairments (low vision, color blindness, total blindness) and adaptive strategies.',
      'Recognize auditory barriers and solutions including CART, closed captions, and sign language interpreters.',
      'Understand motor barriers (tremors, paralysis, limited dexterity) and input devices like switches, eye gaze, and head pointers.',
      'Analyze cognitive accessibility barriers including complex language, memory load, and unpredictable layout changes.'
    ],
    keyConcepts: [
      {
        title: 'Visual Disabilities Spectrum',
        explanation: 'Includes low vision (acuity < 20/70), total blindness, tunnel vision (glaucoma), central vision loss (macular degeneration), cataracts (blur/glare), and color vision deficiencies (Protanopia, Deuteranopia, Tritanopia).'
      },
      {
        title: 'Auditory Disabilities',
        explanation: 'Deaf, hard of hearing, and deafblindness. Requires synchronized captioning (WCAG 1.2.2), audio descriptions, transcripts, and plain language.'
      },
      {
        title: 'Cognitive & Neurodiversity',
        explanation: 'Dyslexia, ADHD, autism, intellectual disabilities, and dementia. Accommodated by clear visual hierarchy, distraction-free reading, predictable navigation, and adjustable timers.'
      },
      {
        title: 'Temporary & Situational Disabilities',
        explanation: 'Disabilities are not only permanent. A broken arm is temporary; glare on a phone in sunlight or holding a baby while cooking is situational.'
      }
    ],
    examTips: 'Remember Microsoft’s Inclusive Design persona spectrum: Permanent (one arm), Temporary (arm in cast), Situational (holding groceries). Solutions designed for permanent disabilities benefit everyone!',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-cat-1',
        question: 'Which of the following is an example of a situational disability?',
        options: [
          { id: 'A', text: 'A person born with profound hearing loss' },
          { id: 'B', text: 'A commuter trying to watch a video on a noisy train without earbuds' },
          { id: 'C', text: 'A student with diagnosed dyslexia' },
          { id: 'D', text: 'A developer recovering from wrist surgery over six weeks' }
        ],
        answer: 'B',
        explanation: 'A person on a noisy train experiences a situational auditory disability where captions provide full access.'
      },
      {
        id: 'kc-cpacc-cat-2',
        question: 'What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against its background?',
        options: [
          { id: 'A', text: '3:1' },
          { id: 'B', text: '4.5:1' },
          { id: 'C', text: '7:1' },
          { id: 'D', text: '10:1' }
        ],
        answer: 'B',
        explanation: 'WCAG SC 1.4.3 Contrast (Minimum) requires at least 4.5:1 for normal text and 3:1 for large text (18pt / 24px or 14pt bold).'
      },
      {
        id: 'kc-cpacc-cat-3',
        question: 'A user with tremors or limited fine motor control benefits most from which digital design accommodation?',
        options: [
          { id: 'A', text: 'Autoplaying instructional audio' },
          { id: 'B', text: 'Generous target sizes (at least 24x24 or 44x44 CSS pixels) with adequate spacing' },
          { id: 'C', text: 'Complex multi-finger gestures for shortcuts' },
          { id: 'D', text: 'Strict 5-second countdown timers on form submission' }
        ],
        answer: 'B',
        explanation: 'Large target sizes with spacing prevent accidental activation by users with hand tremors or motor limitations (WCAG 2.5.5 / 2.5.8).'
      }
    ]
  },

  {
    id: 'mod-cpacc-universal-design',
    cert: 'CPACC',
    domainId: 'CPACC-D2',
    domainLabel: 'Domain 2: Accessibility & Universal Design',
    sectionId: 'CPACC-D2-E',
    title: 'The 7 Principles of Universal Design',
    badge: 'Core Competency',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    interactiveType: 'universal-design-sorter',
    citation: 'CPACC BoK V3, Section 2.5 (Center for Universal Design)',
    summary: 'Study the 7 Principles of Universal Design formulated by Ronald Mace and North Carolina State University. Learn how inclusive design creates environments usable by all people without need for specialized adaptation.',
    learningObjectives: [
      'Master the 7 Principles of Universal Design: Equitable Use, Flexibility, Simple & Intuitive, Perceptible Information, Tolerance for Error, Low Physical Effort, Size and Space.',
      'Differentiate between individualized retrofitted accommodations and proactive universal design.',
      'Apply the "Curb-Cut Effect" to digital user experience and physical architecture.'
    ],
    keyConcepts: [
      {
        title: 'Principle 1: Equitable Use',
        explanation: 'The design is useful and marketable to people with diverse abilities. It avoids segregating or stigmatizing any users. Example: Power sliding doors at building entrances.'
      },
      {
        title: 'Principle 2: Flexibility in Use',
        explanation: 'The design accommodates a wide range of individual preferences and abilities. Example: Right- or left-handed scissors; customizable playback speeds.'
      },
      {
        title: 'Principle 3: Simple and Intuitive Use',
        explanation: 'Use of the design is easy to understand regardless of user experience, knowledge, language skills, or current concentration level.'
      },
      {
        title: 'Principle 4: Perceptible Information',
        explanation: 'The design communicates necessary information effectively through redundant sensory channels (visual, verbal, tactile).'
      },
      {
        title: 'Principle 5: Tolerance for Error',
        explanation: 'Minimizes hazards and adverse consequences of accidental actions. Example: Confirmation dialogs and undo mechanisms.'
      },
      {
        title: 'Principle 6: Low Physical Effort',
        explanation: 'The design can be used efficiently and comfortably with minimal fatigue. Example: Lever handles instead of round twist knobs.'
      },
      {
        title: 'Principle 7: Size and Space for Approach and Use',
        explanation: 'Appropriate size and space is provided for approach, reach, manipulation, and use regardless of body size, posture, or mobility.'
      }
    ],
    examTips: 'Exam questions often contrast Universal Design with Assistive Technology. Universal Design is inherent in the environment; Assistive Technology is personal equipment brought by the user. They work together synergistically!',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-ud-1',
        question: 'Which Universal Design principle is illustrated by an automatic door that opens smoothly for wheelchair users, parents with strollers, and delivery workers carrying boxes?',
        options: [
          { id: 'A', text: 'Tolerance for Error' },
          { id: 'B', text: 'Equitable Use' },
          { id: 'C', text: 'Low Physical Effort alone' },
          { id: 'D', text: 'Perceptible Information' }
        ],
        answer: 'B',
        explanation: 'Equitable Use means the design provides the same means of use for all users—identical whenever possible, equivalent when not—avoiding stigmatizing segregation.'
      },
      {
        id: 'kc-cpacc-ud-2',
        question: 'A web application includes an "Undo" button after deleting a file to prevent accidental loss of data. Which Universal Design principle is this?',
        options: [
          { id: 'A', text: 'Tolerance for Error' },
          { id: 'B', text: 'Flexibility in Use' },
          { id: 'C', text: 'Equitable Use' },
          { id: 'D', text: 'Size and Space for Approach' }
        ],
        answer: 'A',
        explanation: 'Principle 5: Tolerance for Error focuses on minimizing hazards and the adverse consequences of unintended or accidental actions.'
      },
      {
        id: 'kc-cpacc-ud-3',
        question: 'What is the primary conceptual difference between Universal Design and an Individualized Accommodation?',
        options: [
          { id: 'A', text: 'Accommodations are always cheaper than Universal Design' },
          { id: 'B', text: 'Universal Design is proactive and benefits all people from the start; accommodations are reactive retrofits for a specific person' },
          { id: 'C', text: 'Accommodations are only used in physical buildings, whereas Universal Design is for websites' },
          { id: 'D', text: 'There is no difference; the terms are completely interchangeable' }
        ],
        answer: 'B',
        explanation: 'Universal Design is proactive and universal; accommodations are reactive adjustments requested by and configured for a specific individual.'
      }
    ]
  },

  {
    id: 'mod-cpacc-laws',
    cert: 'CPACC',
    domainId: 'CPACC-D3',
    domainLabel: 'Domain 3: Standards, Laws & Management',
    sectionId: 'CPACC-D3-D',
    title: 'Accessibility Laws, Regulations & Standards',
    badge: 'Core Competency',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    interactiveType: 'model-classifier',
    citation: 'CPACC BoK V3, Section 3.1 & 3.2 (Laws & Regulations)',
    summary: 'Master key digital accessibility laws: ADA Title II & III, Rehabilitation Act Sections 504 & 508, European Accessibility Act (EAA), EN 301 549, and the UN Convention on the Rights of Persons with Disabilities (CRPD).',
    learningObjectives: [
      'Distinguish between civil rights non-discrimination laws (ADA) and procurement laws (Section 508, EN 301 549).',
      'Understand the April 2024 DOJ Title II rule requiring WCAG 2.1 AA compliance for state and local government digital services.',
      'Explain the global impact of the UN CRPD Article 9 on national legislation.'
    ],
    keyConcepts: [
      {
        title: 'Americans with Disabilities Act (ADA)',
        explanation: 'Title I covers employment; Title II covers state and local governments (formalized April 2024 to mandate WCAG 2.1 AA); Title III covers public accommodations and commercial facilities.'
      },
      {
        title: 'Rehabilitation Act of 1973',
        explanation: 'Section 504 prohibits discrimination in federally funded programs. Section 508 mandates accessible Information and Communication Technology (ICT) for federal agencies.'
      },
      {
        title: 'European Accessibility Act (EAA / Directive 2019/882)',
        explanation: 'Enforceable across all EU member states from June 2025, harmonizing accessibility standards for consumer hardware, banking, e-commerce, e-books, and ticketing.'
      },
      {
        title: 'EN 301 549',
        explanation: 'The European standard for accessibility requirements suitable for public procurement of ICT products and services in Europe (maps directly to WCAG 2.1 AA).'
      }
    ],
    examTips: 'Watch out for jurisdictional differences on the exam: ADA is US civil rights; Section 508 is US federal ICT procurement; EN 301 549 is European ICT procurement; EAA applies to the European private consumer sector.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-law-1',
        question: 'Which United States law specifically mandates that federal government agencies must procure, develop, maintain, and use accessible electronic and information technology?',
        options: [
          { id: 'A', text: 'ADA Title III' },
          { id: 'B', text: 'Section 508 of the Rehabilitation Act' },
          { id: 'C', text: 'The Telecommunications Act of 1996 alone' },
          { id: 'D', text: 'Section 504 of the Rehabilitation Act' }
        ],
        answer: 'B',
        explanation: 'Section 508 specifically governs federal government procurement and maintenance of accessible ICT.'
      },
      {
        id: 'kc-cpacc-law-2',
        question: 'Under the DOJ\'s 2024 final rule for ADA Title II, which technical standard must state and local government digital web and mobile apps comply with?',
        options: [
          { id: 'A', text: 'WCAG 2.0 Level A' },
          { id: 'B', text: 'WCAG 2.1 Level AA' },
          { id: 'C', text: 'WCAG 2.2 Level AAA' },
          { id: 'D', text: 'Section 255 Guidelines only' }
        ],
        answer: 'B',
        explanation: 'The US Department of Justice finalized its ADA Title II rule requiring public entities to conform to WCAG 2.1 Level AA.'
      },
      {
        id: 'kc-cpacc-law-3',
        question: 'What is the role of UN CRPD Article 9?',
        options: [
          { id: 'A', text: 'It establishes strict US fines for non-compliant software' },
          { id: 'B', text: 'It obligates State Parties to enable persons with disabilities to live independently and participate fully through accessibility in physical and digital spaces' },
          { id: 'C', text: 'It outlines copyright exemptions for screen reader users exclusively in Canada' },
          { id: 'D', text: 'It creates the W3C Web Accessibility Initiative' }
        ],
        answer: 'B',
        explanation: 'Article 9 of the UN Convention on the Rights of Persons with Disabilities specifically establishes accessibility as a core human right.'
      }
    ]
  },

  // ==========================================
  // WAS (WEB ACCESSIBILITY SPECIALIST) MODULES
  // ==========================================
  {
    id: 'mod-was-semantic-html',
    cert: 'WAS',
    domainId: 'WAS-D1',
    domainLabel: 'Domain 1: Creating Accessible Web Solutions',
    sectionId: 'WAS-D1-B',
    title: 'Semantic HTML vs Custom Controls ("Div Soup")',
    badge: 'Technical Mastery',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    interactiveType: 'semantic-html-fixer',
    citation: 'WAS BoK 2024, Section 1.2 (Basic Programming Knowledge)',
    summary: 'Examine why native semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<input>`) are vastly superior to custom `<div>` constructions. Inspect accessibility trees and repair broken non-semantic markup.',
    learningObjectives: [
      'Understand the built-in behaviors provided for free by native HTML: keyboard focusability, space/enter activation, accessible role, and state.',
      'Recognize how non-semantic `<div>` elements break screen readers and keyboard accessibility.',
      'Learn how to remediate pseudo-buttons, fake links, and unlabelled form controls into valid accessible semantics.'
    ],
    keyConcepts: [
      {
        title: 'Native Element Benefits ("Free Functionality")',
        explanation: 'A native `<button>` automatically has `role="button"`, is keyboard focusable in the tab order, is activated by both Enter and Space, and reports disabled state without any JavaScript.'
      },
      {
        title: 'The Pseudo-Button Trap',
        explanation: 'A `<div onclick="...">` lacks keyboard focus, lacks an accessible role in the accessibility tree, cannot be triggered with Space or Enter, and is invisible to screen reader rotor buttons.'
      },
      {
        title: 'Landmarks & Document Structure',
        explanation: 'Using `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` creates landmarks that screen reader users use to jump across sections in seconds.'
      },
      {
        title: 'Button vs Link Decision',
        explanation: 'Links (`<a>`) navigate to a new location/URL or anchor. Buttons (`<button>`) perform an in-page action (open modal, submit data, toggle drawer).'
      }
    ],
    examTips: 'WAS exam questions frequently present code snippets with a `<div>` styled like a button or `<a href="#">` and ask why it fails WCAG 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value). The answer is always lack of semantic role and keyboard activation.',
    knowledgeCheck: [
      {
        id: 'kc-was-sem-1',
        question: 'Why does `<div class="btn" onclick="save()">Save</div>` fail WCAG 2.1.1 Keyboard?',
        options: [
          { id: 'A', text: 'Because divs can never execute JavaScript' },
          { id: 'B', text: 'Because a div is not naturally focusable and does not fire onclick upon Space or Enter keypress without manual handlers' },
          { id: 'C', text: 'Because the text "Save" is too short to be recognized' },
          { id: 'D', text: 'Because onclick is deprecated in HTML5' }
        ],
        answer: 'B',
        explanation: 'A `div` is neither in the sequential keyboard tab order nor listens to Space or Enter keys for click activation, breaking keyboard accessibility.'
      },
      {
        id: 'kc-was-sem-2',
        question: 'What is the appropriate HTML element for an interactive control that opens a slide-out filter modal on the same page?',
        options: [
          { id: 'A', text: '<a href="#">Filters</a>' },
          { id: 'B', text: '<button type="button">Filters</button>' },
          { id: 'C', text: '<span role="link">Filters</span>' },
          { id: 'D', text: '<div class="filter-action">Filters</div>' }
        ],
        answer: 'B',
        explanation: 'Buttons trigger actions on the page (like opening modals); links are for navigation to a destination URL.'
      },
      {
        id: 'kc-was-sem-3',
        question: 'Which of the following creates a landmark region that allows screen reader users to skip straight to primary page content?',
        options: [
          { id: 'A', text: '<div id="primary">' },
          { id: 'B', text: '<main>' },
          { id: 'C', text: '<section class="content">' },
          { id: 'D', text: '<article>' }
        ],
        answer: 'B',
        explanation: '`<main>` communicates the main landmark region in the browser accessibility tree without requiring additional ARIA.'
      }
    ]
  },

  {
    id: 'mod-was-aria-patterns',
    cert: 'WAS',
    domainId: 'WAS-D1',
    domainLabel: 'Domain 1: Creating Accessible Web Solutions',
    sectionId: 'WAS-D1-D',
    title: 'WAI-ARIA: Live Regions, States & The First Rule',
    badge: 'Technical Mastery',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    interactiveType: 'aria-live-lab',
    citation: 'WAS BoK 2024, Section 1.4 (Using ARIA) & W3C WAI-ARIA 1.2',
    summary: 'Master the Five Rules of ARIA, live region announcements (`aria-live="polite"` vs `"assertive"`), dynamic state management (`aria-expanded`, `aria-selected`), and accessible name computation.',
    learningObjectives: [
      'Apply the First Rule of ARIA: "If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so."',
      'Configure `aria-live="polite"` vs `aria-live="assertive"` for asynchronous updates and form error banners.',
      'Implement dynamic state attributes (`aria-expanded`, `aria-hidden`, `aria-invalid`) with proper DOM synchronizations.',
      'Troubleshoot ARIA anti-patterns such as `role="button"` on links or `aria-label` overriding visible text.'
    ],
    keyConcepts: [
      {
        title: 'The First Rule of ARIA',
        explanation: 'Never use ARIA as a substitute for native HTML elements when semantic elements exist. ARIA adds attributes to the accessibility tree; it does NOT add keyboard behaviors or focusability.'
      },
      {
        title: 'Live Regions (`aria-live`)',
        explanation: '`aria-live="polite"` waits until the user is idle before announcing changes (used for search results, stock updates). `aria-live="assertive"` or `role="alert"` interrupts immediately for time-critical emergencies.'
      },
      {
        title: 'States vs Properties',
        explanation: 'States change dynamically during interaction (`aria-expanded="false"` -> `"true"` on an accordion). Properties describe stable characteristics (`aria-haspopup="dialog"`).'
      },
      {
        title: 'Accessible Name Computation',
        explanation: 'Computed in order: `aria-labelledby` > `aria-label` > Native label / text content > `title` attribute. If `aria-label` is present, it completely replaces the visible text for screen readers!'
      }
    ],
    examTips: 'Remember: ARIA does NOT make an element focusable! Setting `role="button"` on a `<div>` does NOT put it in the tab order. You still need `tabindex="0"` and keyboard event listeners—which is why `<button>` is always better.',
    knowledgeCheck: [
      {
        id: 'kc-was-aria-1',
        question: 'A live chat widget receives a new incoming message while the user is actively reading an article. Which `aria-live` setting should be used?',
        options: [
          { id: 'A', text: 'aria-live="assertive"' },
          { id: 'B', text: 'aria-live="off"' },
          { id: 'C', text: 'aria-live="polite"' },
          { id: 'D', text: 'role="alert"' }
        ],
        answer: 'C',
        explanation: '`aria-live="polite"` queues the speech announcement until the user pauses, preventing disruptive interruption during reading.'
      },
      {
        id: 'kc-was-aria-2',
        question: 'What is the First Rule of ARIA from the W3C WAI-ARIA Authoring Practices Guide?',
        options: [
          { id: 'A', text: 'Always add role attributes to every HTML element for clarity' },
          { id: 'B', text: 'If you can use a native HTML element with the semantics already built in, do so instead of repurposing an element and adding ARIA' },
          { id: 'C', text: 'Only use ARIA on touchscreens and mobile viewports' },
          { id: 'D', text: 'All interactive elements must have aria-describedby' }
        ],
        answer: 'B',
        explanation: 'The First Rule of ARIA states: "If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so."'
      },
      {
        id: 'kc-was-aria-3',
        question: 'An accordion header button expands and collapses its associated panel. Which ARIA attribute must be toggled on the button element?',
        options: [
          { id: 'A', text: 'aria-pressed' },
          { id: 'B', text: 'aria-selected' },
          { id: 'C', text: 'aria-expanded="true" / "false"' },
          { id: 'D', text: 'aria-hidden' }
        ],
        answer: 'C',
        explanation: '`aria-expanded` communicates whether the collapsible content container controlled by the button is currently expanded or collapsed.'
      }
    ]
  },

  {
    id: 'mod-was-keyboard-focus',
    cert: 'WAS',
    domainId: 'WAS-D1',
    domainLabel: 'Domain 1: Creating Accessible Web Solutions',
    sectionId: 'WAS-D1-C',
    title: 'Keyboard Navigation & Focus Management',
    badge: 'Technical Mastery',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    interactiveType: 'keyboard-navigation-sandbox',
    citation: 'WAS BoK 2024, Section 1.3 (Interactive Controls & Best Practices)',
    summary: 'Master sequential keyboard navigation, modal focus traps, `tabindex` rules (0 vs -1 vs positive), skip links, and WCAG 2.2 focus appearance criteria (2.4.7 & 2.4.13).',
    learningObjectives: [
      'Implement an accessible modal dialog with focus trapping and focus restoration to the trigger element on close.',
      'Explain the difference between `tabindex="0"` (natural tab order), `tabindex="-1"` (programmatic focus only), and why positive tabindex is an anti-pattern.',
      'Design bypass blocks (Skip to Content links) satisfying WCAG 2.4.1.',
      'Ensure high-contrast visible focus indicators conforming to WCAG 2.2 AA SC 2.4.11 and 2.4.13.'
    ],
    keyConcepts: [
      {
        title: 'tabindex Values and Usage',
        explanation: '`tabindex="0"` inserts element into natural sequential tab order. `tabindex="-1"` allows programmatic focus via `.focus()` without being in tab order. Positive `tabindex` (> 0) disrupts natural document order and is considered an anti-pattern.'
      },
      {
        title: 'Modal Dialog Focus Trap',
        explanation: 'When a modal opens: 1) Save trigger element; 2) Shift focus inside modal; 3) Trap Tab and Shift+Tab within modal; 4) Close on Escape; 5) Restore focus to trigger element.'
      },
      {
        title: 'Skip to Content Links',
        explanation: 'Placed at the very top of the DOM. Hidden offscreen visually until focused, allowing keyboard-only users to bypass repetitive header navigation.'
      },
      {
        title: 'Focus Appearance (WCAG 2.2)',
        explanation: 'Focus indicators must have at least 3:1 contrast against both focused and unfocused states, with a minimum perimeter area.'
      }
    ],
    examTips: 'Exam question favorite: "A developer sets outline: none on all buttons to remove the default browser ring. How does this violate WCAG?" It violates WCAG 2.4.7 Focus Visible unless a custom high-contrast visible focus ring is provided.',
    knowledgeCheck: [
      {
        id: 'kc-was-kb-1',
        question: 'When a user closes an accessible modal dialog by pressing the Escape key, where should keyboard focus immediately return?',
        options: [
          { id: 'A', text: 'The top of the web page (body)' },
          { id: 'B', text: 'The trigger element (button or link) that opened the modal' },
          { id: 'C', text: 'The first focusable element in the footer' },
          { id: 'D', text: 'The browser URL address bar' }
        ],
        answer: 'B',
        explanation: 'Focus must be restored to the invoking element that opened the dialog so keyboard users maintain their position in the task flow.'
      },
      {
        id: 'kc-was-kb-2',
        question: 'What is the effect of setting tabindex="-1" on an HTML element?',
        options: [
          { id: 'A', text: 'The element is completely hidden from screen readers' },
          { id: 'B', text: 'The element cannot receive focus under any circumstances' },
          { id: 'C', text: 'The element is removed from sequential Tab navigation, but can receive programmatic focus via JavaScript .focus()' },
          { id: 'D', text: 'The element receives focus before all other elements' }
        ],
        answer: 'C',
        explanation: '`tabindex="-1"` removes an element from sequential keyboard navigation while keeping it eligible for programmatic focus (e.g. error messages, modal containers).'
      },
      {
        id: 'kc-was-kb-3',
        question: 'Why is using positive tabindex values (e.g., tabindex="1", tabindex="2") strongly discouraged?',
        options: [
          { id: 'A', text: 'They are unsupported in modern browsers' },
          { id: 'B', text: 'They override the natural DOM reading order and create confusing, unpredictable keyboard navigation flows' },
          { id: 'C', text: 'They disable the Spacebar key' },
          { id: 'D', text: 'They prevent screen readers from reading text' }
        ],
        answer: 'B',
        explanation: 'Positive `tabindex` hijacks the natural sequential tab order, causing the focus ring to jump erratically across unrelated areas of the page.'
      }
    ]
  },

  // ==========================================
  // ADS (ACCESSIBLE DOCUMENT SPECIALIST) MODULES
  // ==========================================
  {
    id: 'mod-ads-alt-text',
    cert: 'ADS',
    domainId: 'ADS-D2',
    domainLabel: 'Domain 2: Remediating Electronic Documents',
    sectionId: 'ADS-D2-A',
    title: 'Alternative Text & Graphic Classification',
    badge: 'Document Remediation',
    difficulty: 'Beginner',
    estimatedMinutes: 9,
    interactiveType: 'alt-text-decision-tree',
    citation: 'ADS BoK 2021, Section 2.1 (Implement alternative text) & WCAG 1.1.1',
    summary: 'Master the alt-text decision tree for documents (PDF, Word, InDesign). Learn when an image is purely decorative (`alt=""` / `/Artifact`), functional (icon button), informative (photo), or complex (charts and graphs).',
    learningObjectives: [
      'Apply the W3C Alt-Text Decision Tree to determine appropriate alternative text for electronic documents.',
      'Differentiate between decorative images marked as `/Artifact` and informative content requiring alt text.',
      'Write concise, context-rich alternative text without redundant phrases like "image of" or "picture of".',
      'Provide dual-layer descriptions for complex infographics (short summary alt text + comprehensive data table/caption).'
    ],
    keyConcepts: [
      {
        title: 'Decorative Images (`alt=""` or `/Artifact`)',
        explanation: 'Images that add purely visual flair (background waves, horizontal separator lines, decorative icons next to text). In PDF/UA, decorative elements MUST be marked as Artifacts so screen readers ignore them.'
      },
      {
        title: 'Functional Images',
        explanation: 'Images that trigger an action or serve as a link. The alt text must describe the PURPOSE or DESTINATION of the action, not the visual appearance (e.g. `alt="Search"` not `alt="Magnifying glass"`).'
      },
      {
        title: 'Informative Images',
        explanation: 'Images that convey meaningful concept or information. Describe the key meaning or emotion concisely. Avoid "Image of..." or "Graphic showing...".'
      },
      {
        title: 'Complex Images (Charts & Graphs)',
        explanation: 'A short alt text gives the high-level takeaway (e.g. "Bar chart of Q3 sales showing 25% growth in Europe"). A full text equivalent (table or paragraph) must be provided in the document body.'
      }
    ],
    examTips: 'In PDF accessibility (PDF/UA), an image MUST either have alternative text OR be marked as an Artifact. Having an untagged image or an image with no alt and no artifact tag is a critical PAC / PDF-UA validation failure.',
    knowledgeCheck: [
      {
        id: 'kc-ads-alt-1',
        question: 'An electronic PDF newsletter has a decorative wavy swoosh divider between sections. How should this element be handled in PDF tagging?',
        options: [
          { id: 'A', text: 'Tag it with alt="Decorative wavy line"' },
          { id: 'B', text: 'Mark it as an Artifact so assistive technology completely ignores it' },
          { id: 'C', text: 'Convert it into an empty heading tag (<H3></H3>)' },
          { id: 'D', text: 'Delete the entire section divider from the visual layout' }
        ],
        answer: 'B',
        explanation: 'In PDF/UA and accessible document authoring, purely decorative graphics must be tagged as `/Artifact` so screen readers do not announce useless noise.'
      },
      {
        id: 'kc-ads-alt-2',
        question: 'A button displays only a printer icon without any visible text. What should the alternative text be?',
        options: [
          { id: 'A', text: 'alt="Black and grey inkjet printer with paper tray"' },
          { id: 'B', text: 'alt=""' },
          { id: 'C', text: 'alt="Print this document"' },
          { id: 'D', text: 'alt="Icon graphic"' }
        ],
        answer: 'C',
        explanation: 'For functional images, the alternative text must convey the action or purpose of the button (e.g., "Print this document"), not its visual depiction.'
      },
      {
        id: 'kc-ads-alt-3',
        question: 'Which is the recommended practice for a complex statistical chart in an accessible annual report?',
        options: [
          { id: 'A', text: 'Provide a 1,000-word paragraph directly in the alt attribute' },
          { id: 'B', text: 'Provide a concise summary in the alt attribute and a full accessible data table or text description in the surrounding document text' },
          { id: 'C', text: 'Mark the chart as an Artifact' },
          { id: 'D', text: 'Replace the chart with an image of raw code' }
        ],
        answer: 'B',
        explanation: 'Complex graphics require a two-part approach: a brief summary in the alt text and a complete, accessible textual representation (such as a data table) in the document body.'
      }
    ]
  },

  {
    id: 'mod-ads-tag-tree',
    cert: 'ADS',
    domainId: 'ADS-D2',
    domainLabel: 'Domain 2: Remediating Electronic Documents',
    sectionId: 'ADS-D2-B',
    title: 'Document Structure & PDF Tag Tree Remediation',
    badge: 'Document Remediation',
    difficulty: 'Intermediate',
    estimatedMinutes: 11,
    interactiveType: 'pdf-tag-tree-fixer',
    citation: 'ADS BoK 2021, Section 2.2 (Review and correct structure) & ISO 14289-1 (PDF/UA)',
    summary: 'Master PDF/UA logical structure trees. Identify and fix common tagging defects: skipped heading levels (`<H1>` to `<H4>`), missing table header tags (`<TH scope="col">`), untagged content, tagging decorative elements as `/Artifact`, and reading order mismatches.',
    learningObjectives: [
      'Understand the role of the PDF logical structure tree in PDF/UA ISO 14289 conformance.',
      'Detect and correct skipped heading levels (`<H1>` directly to `<H3>`) to maintain hierarchical navigation.',
      'Tag decorative graphic elements (separators, watermarks, background shapes) as `/Artifact` to prevent screen reader clutter and PAC errors.',
      'Ensure data tables have `<TH>` headers with scope attributes, separating tabular data from layout tables.',
      'Verify reading order between the visual document layout, the tag tree, and the architectural Content stream.'
    ],
    keyConcepts: [
      {
        title: 'The Logical Tag Tree',
        explanation: 'Assistive technologies do not read visual pixels in a PDF; they traverse the logical Tag Tree (`<Document>`, `<Part>`, `<Sect>`, `<H1>`, `<P>`, `<Table>`, `<L>`). Without tags, a PDF is completely inaccessible to screen readers.'
      },
      {
        title: 'Decorative Content & /Artifact Tagging',
        explanation: 'Under ISO 14289-1 (PDF/UA), all content in a PDF must either be semantically tagged or explicitly marked as an `/Artifact`. Decorative dividers, background shapes, and non-meaningful graphics must be artifacted so screen readers ignore them and automated tools like PAC do not flag untagged content.'
      },
      {
        title: 'Heading Hierarchy Integrity',
        explanation: 'Headings must follow a strict logical hierarchy (`<H1>` -> `<H2>` -> `<H3>`). Never skip heading levels for visual styling (e.g. jumping from `<H1>` to `<H4>`).'
      },
      {
        title: 'Table Tag Semantics',
        explanation: 'Accessible tables require `<Table>`, `<TR>`, `<TH>` (table headers), and `<TD>` (table data). Column and row headers must be tagged with `<TH>` and associated with data cells.'
      },
      {
        title: 'PDF/UA & PAC Validation',
        explanation: 'PDF/UA (ISO 14289-1) is the international technical standard for accessible PDF. Free tools like PAC (PDF Accessibility Checker) test machine-verifiable criteria.'
      }
    ],
    examTips: 'ADS exam alert: In Adobe Acrobat Pro, there is a visual "Order Panel" and a "Tags Panel". In PDF/UA, screen readers read from the TAGS TREE, not the Order panel! Always ensure the Tags Tree reflects the correct reading flow.',
    knowledgeCheck: [
      {
        id: 'kc-ads-tag-1',
        question: 'When remediating a PDF document, which panel determines the exact reading order and semantic structure interpreted by modern screen readers?',
        options: [
          { id: 'A', text: 'The Visual Reading Order panel' },
          { id: 'B', text: 'The Tags Tree panel' },
          { id: 'C', text: 'The Page Thumbnails panel' },
          { id: 'D', text: 'The Bookmarks panel' }
        ],
        answer: 'B',
        explanation: 'Under ISO 14289-1 (PDF/UA), screen readers rely exclusively on the logical Tags Tree structure to read content and announce semantics.'
      },
      {
        id: 'kc-ads-tag-2',
        question: 'A document jumps directly from an <H1> title to an <H4> subhead because the author wanted a smaller font size. What is the proper remediation?',
        options: [
          { id: 'A', text: 'Leave the <H4> tag because visual font size dictates tag selection' },
          { id: 'B', text: 'Change the tag to <H2> and adjust the visual font styling in the authoring application' },
          { id: 'C', text: 'Replace the heading with a bold paragraph <P>' },
          { id: 'D', text: 'Insert two blank headings (<H2></H2><H3></H3>) to fill the gap' }
        ],
        answer: 'B',
        explanation: 'Heading levels must strictly follow a logical numerical hierarchy without skipping levels. Visual styling should be adjusted via styles or fonts, not by distorting semantic tags.'
      },
      {
        id: 'kc-ads-tag-3',
        question: 'What is required for a data table to be considered accessible in PDF/UA?',
        options: [
          { id: 'A', text: 'All cells must be tagged as <TD> with no headers' },
          { id: 'B', text: 'Column and row header cells must be properly tagged as <TH> with scope attributes' },
          { id: 'C', text: 'Tables must never contain numbers' },
          { id: 'D', text: 'The entire table must be converted into an image with an alt tag' }
        ],
        answer: 'B',
        explanation: 'Data tables require header cells tagged as `<TH>` with scope, allowing screen readers to correlate data cells with their respective column and row headers.'
      }
    ]
  },

  {
    id: 'mod-ads-testing-pac',
    cert: 'ADS',
    domainId: 'ADS-D3',
    domainLabel: 'Domain 3: Auditing & Testing Documents',
    sectionId: 'ADS-D3-A',
    title: 'Automated vs Manual Document Auditing (PAC & Screen Readers)',
    badge: 'Auditing & QA',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    interactiveType: 'pdf-tag-tree-fixer',
    citation: 'ADS BoK 2021, Section 3.1 & 3.3 (Testing Processes & Limitations)',
    summary: 'Evaluate the boundaries of automated document testing tools (PAC, Adobe Acrobat Accessibility Checker) versus manual testing with assistive technologies (NVDA, JAWS).',
    learningObjectives: [
      'Run and interpret automated validation reports from PAC (PDF Accessibility Checker).',
      'Recognize what automated accessibility checkers CAN test (missing alt attributes, tag presence, contrast).',
      'Recognize what automated checkers CANNOT test (alt-text accuracy, logical reading order sense, table header relevance).',
      'Execute screen reader testing protocols in Adobe Acrobat Pro and Microsoft Word.'
    ],
    keyConcepts: [
      {
        title: 'PAC (PDF Accessibility Checker)',
        explanation: 'Industry gold standard automated validator for PDF/UA ISO 14289 conformance and Matterhorn Protocol checkpoint testing.'
      },
      {
        title: 'Limitations of Automated Testing',
        explanation: 'Automated tools can only verify that an alt attribute EXISTS; they cannot verify whether `alt="image123.jpg"` is accurate or meaningful. Manual human testing is always required.'
      },
      {
        title: 'The Matterhorn Protocol',
        explanation: 'Catalog of 31 checkpoints and 136 failure conditions for PDF/UA conformance, explicitly identifying which items can be tested by software and which require human inspection.'
      }
    ],
    examTips: 'Exam classic: "An automated tool reports 0 accessibility errors on a document. Does this guarantee the document is accessible?" Never! Automated tools cannot verify context, meaning, or reading clarity.',
    knowledgeCheck: [
      {
        id: 'kc-ads-test-1',
        question: 'Which of the following can automated PDF testing tools reliably detect without human intervention?',
        options: [
          { id: 'A', text: 'Whether the alternative text accurately describes the emotional meaning of a photograph' },
          { id: 'B', text: 'Whether an image is completely missing an alternative text attribute or tag' },
          { id: 'C', text: 'Whether a document is written in clear, concise plain language' },
          { id: 'D', text: 'Whether the reading sequence makes logical editorial sense' }
        ],
        answer: 'B',
        explanation: 'Automated tools can check for the physical presence or absence of alt text and tags, but human judgment is required to evaluate accuracy, quality, and logic.'
      },
      {
        id: 'kc-ads-test-2',
        question: 'What is the Matterhorn Protocol?',
        options: [
          { id: 'A', text: 'A Swiss treaty regulating web browsers' },
          { id: 'B', text: 'A technical specification that categorizes PDF/UA failure conditions into automated and human-verifiable tests' },
          { id: 'C', text: 'An encryption method for secure PDF transmission' },
          { id: 'D', text: 'A font formatting standard for European e-books' }
        ],
        answer: 'B',
        explanation: 'The Matterhorn Protocol, created by the PDF Association, defines 136 failure conditions for PDF/UA, specifying which are machine-verifiable and which require human inspection.'
      },
      {
        id: 'kc-ads-test-3',
        question: 'Why must manual screen reader testing be performed on electronic documents even after automated check passes?',
        options: [
          { id: 'A', text: 'Automated checkers only work on Windows, not Mac' },
          { id: 'B', text: 'To verify that the reading flow, link announcements, table associations, and contextual alt-text provide an equivalent experience in practice' },
          { id: 'C', text: 'Because Adobe Acrobat prohibits automated validation' },
          { id: 'D', text: 'Screen readers automatically repair broken tags during playback' }
        ],
        answer: 'B',
        explanation: 'Manual testing with assistive technologies ensures the synthesized speech and navigation actually make sense to real human users in practical usage.'
      }
    ]
  },

  // ==========================================
  // EXPANDED CPACC MODULES
  // ==========================================
  {
    id: 'mod-cpacc-assistive-tech',
    cert: 'CPACC',
    domainId: 'CPACC-D1',
    domainLabel: 'Domain 1: Disabilities, Challenges & Assistive Tech',
    sectionId: 'CPACC-D1-C',
    title: 'Individual Assistive Technologies & Adaptive Strategies',
    badge: 'Core Competency',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    interactiveType: 'assistive-tech-simulator',
    citation: 'CPACC BoK V3, Section 1.3 (Assistive Technologies & Adaptive Strategies)',
    summary: 'Master the diverse ecosystem of assistive hardware and software: Screen readers, refreshable Braille displays, single-switch scanning, screen magnification, voice recognition, and captions.',
    learningObjectives: [
      'Understand how single-switch and dual-switch scanning devices enable users with motor paralysis to operate software.',
      'Explain how refreshable Braille displays translate dynamic digital text into tactile 6-dot and 8-dot Braille cells.',
      'Analyze the visual restrictions experienced by screen magnification users operating at 400%+ zoom.'
    ],
    keyConcepts: [
      {
        title: 'Switch Access Scanning',
        explanation: 'Used when motor impairments prevent keyboard or mouse operation. Scanning highlights items sequentially; the user triggers an adaptive switch (sip-and-puff, head button, or eye blink) to select.'
      },
      {
        title: 'Refreshable Braille Displays',
        explanation: 'Electromechanical devices that dynamically raise plastic or metal pins through holes in a flat surface to represent Braille cells. Essential for deafblind individuals and technical coding.'
      },
      {
        title: 'Screen Magnification Limitations',
        explanation: 'Magnification increases pixel scale but drastically shrinks the visible field of view. Content spaced far to the right or bottom of a viewport is completely lost without horizontal panning.'
      }
    ],
    examTips: 'IAAP CPACC questions frequently highlight that screen reader users do not read pages top-to-bottom like sighted readers; they navigate by headings, landmarks, links, and forms using shortcut keys.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-at-1',
        question: 'How does an individual with quadriplegia typically navigate an interface using single-switch scanning?',
        options: [
          { id: 'A', text: 'By rapidly typing letters on a specialized physical keyboard' },
          { id: 'B', text: 'By waiting for the software to automatically cycle through rows/items and clicking their switch when the desired item is highlighted' },
          { id: 'C', text: 'By tilting a handheld joystick in 360 degrees' },
          { id: 'D', text: 'By relying entirely on third-party voice assistants' }
        ],
        answer: 'B',
        explanation: 'Single-switch scanning automatically cycles focus through options at a configurable speed, allowing the user to select an item with a single physical activation.'
      },
      {
        id: 'kc-cpacc-at-2',
        question: 'Which population of users relies most critically on refreshable Braille displays for digital communication?',
        options: [
          { id: 'A', text: 'Users with mild presbyopia' },
          { id: 'B', text: 'Individuals who are deafblind' },
          { id: 'C', text: 'Users with situational color blindness in bright sunlight' },
          { id: 'D', text: 'Individuals with speech stutter' }
        ],
        answer: 'B',
        explanation: 'Deafblind individuals cannot use synthesized auditory speech from screen readers or visual displays; tactile Braille is their primary digital medium.'
      },
      {
        id: 'kc-cpacc-at-3',
        question: 'Why do widely separated layout elements create severe barriers for screen magnification users?',
        options: [
          { id: 'A', text: 'Magnifiers invert all colors on the display' },
          { id: 'B', text: 'At high zoom levels (e.g. 400%), users view only a small fraction of the screen at a time, easily missing distant error messages or action buttons' },
          { id: 'C', text: 'Screen magnifiers disable the mouse cursor' },
          { id: 'D', text: 'High zoom levels disable browser JavaScript' }
        ],
        answer: 'B',
        explanation: 'High magnification produces a "keyhole" effect where users lose global context, making distant notifications and multi-column gaps difficult to find.'
      }
    ]
  },

  {
    id: 'mod-cpacc-benefits-business',
    cert: 'CPACC',
    domainId: 'CPACC-D2',
    domainLabel: 'Domain 2: Accessibility & Universal Design',
    sectionId: 'CPACC-D2-B',
    title: 'The Business Case, Curb-Cut Effect & Social Inclusion',
    badge: 'Core Competency',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    interactiveType: 'universal-design-sorter',
    citation: 'CPACC BoK V3, Section 2.2 (Benefits of Accessibility)',
    summary: 'Analyze the multifaceted business case for accessibility: market expansion, innovation, brand reputation, search engine optimization (SEO), and legal risk mitigation.',
    learningObjectives: [
      'Articulate the commercial size of the disability market: 1.3 billion people globally with over $13 trillion in disposable income.',
      'Explain the "Curb-Cut Effect": how accessibility features created for disabled persons benefit the wider mainstream population.',
      'Understand the relationship between semantic accessibility and Search Engine Optimization (SEO).'
    ],
    keyConcepts: [
      {
        title: 'The Curb-Cut Effect',
        explanation: 'Originally concrete sidewalk ramps built for wheelchair users in Berkeley, California, curb cuts were quickly embraced by parents with strollers, travelers with wheeled luggage, skateboarders, and delivery workers. In digital spaces, captions, transcripts, and high contrast exhibit the exact same universal benefit.'
      },
      {
        title: 'Market Reach & Demographics',
        explanation: '16% of the world population (1 in 6 people) lives with significant disability. Families and friends also choose accessible brands, creating massive commercial network effects.'
      },
      {
        title: 'Accessibility & SEO Synergy',
        explanation: 'Search engine crawlers index web pages in almost the exact same way screen readers do: parsing clean HTML structure, `<title>`, `<h1>-<h6>`, `<main>`, descriptive anchor text, and alternative text.'
      }
    ],
    examTips: 'Exam questions often ask which department in an enterprise benefits from digital accessibility. The answer is virtually ALL departments: Engineering (cleaner code), Marketing (SEO and reach), Legal (risk mitigation), and HR (inclusive hiring).',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-biz-1',
        question: 'What is the "Curb-Cut Effect" in accessibility theory?',
        options: [
          { id: 'A', text: 'A cost-cutting method that eliminates testing budgets' },
          { id: 'B', text: 'The phenomenon where solutions designed specifically for people with disabilities end up benefiting society as a whole' },
          { id: 'C', text: 'A legal strategy for avoiding ADA lawsuits' },
          { id: 'D', text: 'A visual design trend featuring rounded corners' }
        ],
        answer: 'B',
        explanation: 'The Curb-Cut Effect describes how accommodations created for disability (curb ramps, closed captions, spellcheck) provide immense utility to the entire general population.'
      },
      {
        id: 'kc-cpacc-biz-2',
        question: 'How does creating accessible digital content directly enhance Search Engine Optimization (SEO)?',
        options: [
          { id: 'A', text: 'Search engines give secret rank bonuses to W3C members' },
          { id: 'B', text: 'Search engine crawlers lack vision and rely on semantic HTML tags, headings, descriptive link text, and alt attributes to understand page content' },
          { id: 'C', text: 'Accessibility code hides tracking cookies' },
          { id: 'D', text: 'Screen readers automatically click search ads' }
        ],
        answer: 'B',
        explanation: 'Search crawlers read text and DOM semantics without human sight. Clear headings, semantic landmarks, descriptive link labels, and alt attributes directly improve crawling and indexing.'
      },
      {
        id: 'kc-cpacc-biz-3',
        question: 'According to the World Health Organization, approximately what percentage of the global population lives with a significant disability?',
        options: [
          { id: 'A', text: 'About 2%' },
          { id: 'B', text: 'About 8%' },
          { id: 'C', text: 'About 16% (1.3 billion people)' },
          { id: 'D', text: 'Over 50%' }
        ],
        answer: 'C',
        explanation: 'WHO estimates that approximately 1.3 billion people—16% of the global population—experience significant disability, representing the world\'s largest minority group.'
      }
    ]
  },

  {
    id: 'mod-cpacc-maturity',
    cert: 'CPACC',
    domainId: 'CPACC-D3',
    domainLabel: 'Domain 3: Standards, Laws & Management',
    sectionId: 'CPACC-D3-F',
    title: 'Integrating Accessibility & Capability Maturity Models',
    badge: 'Core Competency',
    difficulty: 'Advanced',
    estimatedMinutes: 9,
    interactiveType: 'a11y-maturity-model-auditor',
    citation: 'CPACC BoK V3, Section 3.4 (Integrating ICT Accessibility Across the Organization)',
    summary: 'Apply the Capability Maturity Model (CMM) and the W3C Accessibility Maturity Model (AMM) to transition organizations from reactive ad-hoc compliance to sustainable cultural inclusion.',
    learningObjectives: [
      'Evaluate organizational readiness across Governance, Culture, Personnel, Procurement, and Technology.',
      'Distinguish between Level 1 (Ad-hoc / Chaos) and Level 5 (Optimizing / Co-design) maturity stages.',
      'Implement procurement verification workflows utilizing Accessibility Conformance Reports (ACRs / VPATs).'
    ],
    keyConcepts: [
      {
        title: 'Maturity Levels in Accessibility',
        explanation: 'Level 1: Initial (unplanned, reactive to lawsuits); Level 2: Planned (ad-hoc projects); Level 3: Defined (enterprise policy and standardized testing); Level 4: Measured (metrics & automated gates); Level 5: Optimizing (continuous innovation and inclusive culture).'
      },
      {
        title: 'ICT Procurement & VPATs',
        explanation: 'Organizations cannot be accessible if they purchase inaccessible third-party software. Voluntary Product Accessibility Templates (VPATs) completed by vendors produce Accessibility Conformance Reports (ACRs).'
      },
      {
        title: 'Executive Governance & Culture',
        explanation: 'Sustainable accessibility requires top-down leadership sponsorship, dedicated executive budget, and cross-functional representation (design, engineering, legal, HR).'
      }
    ],
    examTips: 'Exam trap: IAAP tests whether an accessibility team should exist in a silo. The correct answer is that accessibility must be decentralized across every functional role (Designers own contrast, Devs own semantic HTML, Authors own alt-text, Procurement owns VPATs).',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-mat-1',
        question: 'An enterprise only addresses digital accessibility when threatened with a federal lawsuit or customer complaint. What stage of the Accessibility Maturity Model does this represent?',
        options: [
          { id: 'A', text: 'Level 5 (Optimizing)' },
          { id: 'B', text: 'Level 3 (Defined)' },
          { id: 'C', text: 'Level 1 (Initial / Ad-Hoc)' },
          { id: 'D', text: 'Level 4 (Managed)' }
        ],
        answer: 'C',
        explanation: 'Level 1 (Initial / Ad-hoc) is characterized by reactive, disorganized responses to external pressure with no documented strategy or proactive policies.'
      },
      {
        id: 'kc-cpacc-mat-2',
        question: 'What is a VPAT (Voluntary Product Accessibility Template)?',
        options: [
          { id: 'A', text: 'A visual color palette generator' },
          { id: 'B', text: 'A standardized document format used by vendors to state how their ICT product conforms to WCAG and Section 508 accessibility standards' },
          { id: 'C', text: 'A free screen reader download' },
          { id: 'D', text: 'An ISO encryption certificate' }
        ],
        answer: 'B',
        explanation: 'A VPAT is the standardized reporting template created by the Information Technology Industry Council (ITI) that vendors fill out to create an Accessibility Conformance Report (ACR).'
      },
      {
        id: 'kc-cpacc-mat-3',
        question: 'What is the most effective approach for integrating digital accessibility into an organization long-term?',
        options: [
          { id: 'A', text: 'Assigning a single junior developer to manually fix all errors after every production release' },
          { id: 'B', text: 'Embedding role-based accessibility responsibilities, training, and testing gates across design, engineering, QA, content authoring, and procurement' },
          { id: 'C', text: 'Relying exclusively on automated web overlay widgets' },
          { id: 'D', text: 'Purchasing insurance against disability discrimination lawsuits' }
        ],
        answer: 'B',
        explanation: 'Sustainable accessibility integrates into every discipline of the product development lifecycle with governance, training, and accountability.'
      }
    ]
  },

  // ==========================================
  // EXPANDED WAS MODULES
  // ==========================================
  {
    id: 'mod-was-wcag22',
    cert: 'WAS',
    domainId: 'WAS-D1',
    domainLabel: 'Domain 1: Creating Accessible Web Solutions',
    sectionId: 'WAS-D1-A',
    title: 'WCAG 2.2 New Success Criteria & Operable Interactions',
    badge: 'Technical Mastery',
    difficulty: 'Advanced',
    estimatedMinutes: 11,
    interactiveType: 'wcag22-new-criteria-lab',
    citation: 'WAS BoK 2024, Section 1.1 & W3C WCAG 2.2 Recommendation (October 2023)',
    summary: 'Master the newest technical criteria introduced in WCAG 2.2: Target Size Minimum (2.5.8), Redundant Entry (3.3.7), Dragging Movements (2.5.7), and Consistent Help (3.2.6).',
    learningObjectives: [
      'Apply SC 2.5.8 Target Size Minimum (24×24 CSS pixels) and calculate target offset spacing circles.',
      'Implement SC 3.3.7 Redundant Entry prevention techniques on multi-step forms.',
      'Provide single-pointer click alternatives for drag-and-drop components under SC 2.5.7.',
      'Verify consistent help placement across multi-page user journeys under SC 3.2.6.'
    ],
    keyConcepts: [
      {
        title: 'SC 2.5.8 Target Size (Minimum) (AA)',
        explanation: 'Pointer targets must be at least 24×24 CSS pixels, or have enough surrounding spacing such that a 24px diameter circle centered on the target does not overlap adjacent interactive elements.'
      },
      {
        title: 'SC 3.3.7 Redundant Entry (A)',
        explanation: 'Information previously entered by the user in the same multi-step process must be auto-populated or available for selection (e.g. "Billing address same as shipping").'
      },
      {
        title: 'SC 2.5.7 Dragging Movements (AA)',
        explanation: 'Any interaction relying on dragging (sliders, sortable kanban cards, map panning) must provide an alternative single-pointer click/tap mechanism.'
      },
      {
        title: 'SC 3.2.6 Consistent Help (A)',
        explanation: 'If contact details, chat widgets, or FAQs are provided across multiple pages, they must appear in the same relative visual and sequential reading order.'
      }
    ],
    examTips: 'Notice the WCAG 2.2 deprecation: WCAG 2.2 officially removed 4.1.1 Parsing because modern browsers automatically resolve HTML parsing errors, refocusing audits entirely on assistive technology impact.',
    knowledgeCheck: [
      {
        id: 'kc-was-22-1',
        question: 'Under WCAG 2.2 SC 2.5.8 Target Size (Minimum), what is the minimum required dimensions for pointer interactive targets at Level AA?',
        options: [
          { id: 'A', text: '12×12 CSS pixels' },
          { id: 'B', text: '24×24 CSS pixels (or equivalent spacing offset)' },
          { id: 'C', text: '48×48 CSS pixels' },
          { id: 'D', text: '100×100 CSS pixels' }
        ],
        answer: 'B',
        explanation: 'WCAG 2.2 SC 2.5.8 requires at least 24×24 CSS pixels for Level AA (while Level AAA SC 2.5.5 Target Size Enhanced recommends 44×44 CSS pixels).'
      },
      {
        id: 'kc-was-22-2',
        question: 'A web app requires users to drag tasks between Kanban columns. How can developers conform to WCAG 2.2 SC 2.5.7 Dragging Movements?',
        options: [
          { id: 'A', text: 'By removing the drag-and-drop feature entirely' },
          { id: 'B', text: 'By providing buttons (e.g. "Move Left" / "Move Right") or a dropdown menu that allows single-click column assignment without dragging' },
          { id: 'C', text: 'By adding an audio chime whenever a card is dragged' },
          { id: 'D', text: 'By increasing the mouse drag velocity' }
        ],
        answer: 'B',
        explanation: 'SC 2.5.7 requires that any functionality achievable via dragging can also be operated using single pointer clicks/taps without sustained movement.'
      },
      {
        id: 'kc-was-22-3',
        question: 'Which historical WCAG 2.0 / 2.1 success criterion was officially removed (obsoleted) from WCAG 2.2?',
        options: [
          { id: 'A', text: 'SC 1.1.1 Non-text Content' },
          { id: 'B', text: 'SC 2.1.1 Keyboard' },
          { id: 'C', text: 'SC 4.1.1 Parsing' },
          { id: 'D', text: 'SC 1.4.3 Contrast (Minimum)' }
        ],
        answer: 'C',
        explanation: 'SC 4.1.1 Parsing was obsoleted in WCAG 2.2 because modern browser HTML parsers handle missing end tags and duplicate attributes predictably in DOM construction.'
      }
    ]
  },

  {
    id: 'mod-was-custom-widgets',
    cert: 'WAS',
    domainId: 'WAS-D1',
    domainLabel: 'Domain 1: Creating Accessible Web Solutions',
    sectionId: 'WAS-D1-F',
    title: 'Standard Controls vs Custom Widgets (W3C APG Tablist Pattern)',
    badge: 'Technical Mastery',
    difficulty: 'Advanced',
    estimatedMinutes: 10,
    interactiveType: 'accessible-tabs-combobox-lab',
    citation: 'WAS BoK 2024, Section 1.3 & W3C WAI-ARIA Authoring Practices Guide (APG)',
    summary: 'Implement complex interactive widgets conforming to the W3C Authoring Practices Guide (APG). Master roving `tabindex`, keyboard event listeners, and `role="tablist"` architectures.',
    learningObjectives: [
      'Implement the W3C APG Tabs Pattern using `role="tablist"`, `role="tab"`, and `role="tabpanel"`.',
      'Explain the Roving Tabindex technique for multi-item compound widgets.',
      'Configure arrow key navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`) inside custom interactive toolbars and menus.'
    ],
    keyConcepts: [
      {
        title: 'Single Tab Stop Rule',
        explanation: 'A compound widget (such as a tablist, menubar, or grid) must represent only ONE sequential Tab stop on the page. Pressing Tab lands on the active item; pressing Tab again exits the widget completely.'
      },
      {
        title: 'Arrow Key Navigation',
        explanation: 'Navigation BETWEEN items inside the widget must be performed using the Arrow keys (`ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown`), `Home`, and `End`.'
      },
      {
        title: 'Roving tabindex Architecture',
        explanation: 'The currently selected tab has `tabindex="0"`; all other unselected tabs in the list have `tabindex="-1"`. When the user arrows to a new tab, JavaScript moves the `0` to the new target.'
      }
    ],
    examTips: 'Classic WAS exam question: If a tablist contains 6 tabs, how many times should a keyboard user press the Tab key to move through the entire tablist and into the panel? Answer: Exactly ONCE into the active tab, and ONCE into the panel (Arrow keys move between tabs).',
    knowledgeCheck: [
      {
        id: 'kc-was-widget-1',
        question: 'According to the WAI-ARIA Authoring Practices Guide (APG) Tabs Pattern, how should a user navigate between individual tabs in a tablist?',
        options: [
          { id: 'A', text: 'By pressing the Tab key for every single tab' },
          { id: 'B', text: 'By using the Left and Right Arrow keys' },
          { id: 'C', text: 'By double-clicking the mouse wheel' },
          { id: 'D', text: 'By pressing the Escape key' }
        ],
        answer: 'B',
        explanation: 'In the standard APG Tabs pattern, the Tab key enters/exits the tablist, while Arrow keys navigate between individual tabs without cluttering sequential tab stops.'
      },
      {
        id: 'kc-was-widget-2',
        question: 'Under the roving tabindex strategy for accessible tabs, which tabindex value is assigned to the inactive, unselected tabs?',
        options: [
          { id: 'A', text: 'tabindex="0"' },
          { id: 'B', text: 'tabindex="1"' },
          { id: 'C', text: 'tabindex="-1"' },
          { id: 'D', text: 'tabindex="auto"' }
        ],
        answer: 'C',
        explanation: 'Unselected tabs receive `tabindex="-1"` so they cannot be reached via the Tab key, while remaining focusable programmatically via JavaScript arrow handlers.'
      },
      {
        id: 'kc-was-widget-3',
        question: 'Which ARIA attribute explicitly connects a tab button to its corresponding content container?',
        options: [
          { id: 'A', text: 'aria-controls="panel-id"' },
          { id: 'B', text: 'aria-haspopup="true"' },
          { id: 'C', text: 'aria-live="polite"' },
          { id: 'D', text: 'aria-expanded="true"' }
        ],
        answer: 'A',
        explanation: '`aria-controls` references the `id` of the `<div role="tabpanel">` that this tab button activates and displays.'
      }
    ]
  },

  {
    id: 'mod-was-triage-severity',
    cert: 'WAS',
    domainId: 'WAS-D3',
    domainLabel: 'Domain 3: Remediating Issues in Web Solutions',
    sectionId: 'WAS-D3-A',
    title: 'Defect Severity, Prioritization & Risk Management',
    badge: 'Technical Mastery',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    interactiveType: 'issue-severity-triage-lab',
    citation: 'WAS BoK 2024, Section 3.1 (Severity and Prioritization of Issues)',
    summary: 'Triage digital accessibility defects based on end-user impact, task criticality, and legal risk. Learn how to rank blockers (P1) vs serious (P2) vs moderate (P3) bugs.',
    learningObjectives: [
      'Prioritize remediation backlogs based on functional user impact rather than conformance level letters alone.',
      'Define Blocker defects: complete impediments to core user journeys with no feasible workarounds.',
      'Differentiate between high-impact transactional barriers and minor informational cosmetic issues.'
    ],
    keyConcepts: [
      {
        title: 'Impact-Driven Prioritization',
        explanation: 'A Level A failure that affects a decorative element is far less severe than a Level AA contrast failure on a critical checkout call-to-action. Prioritize by USER IMPACT.'
      },
      {
        title: 'Blocker Severity (P1)',
        explanation: 'Prevents access to core functionality (login, payment, document submission) or traps keyboard focus. Requires immediate hotfix deployment.'
      },
      {
        title: 'Serious Severity (P2)',
        explanation: 'Causes high frustration or requires significant effort to overcome, but an alternative pathway or workaround exists.'
      }
    ],
    examTips: 'On the WAS exam, whenever asked which issue to remediate first, select the issue that blocks a user from completing a task or poses physical safety risks (e.g. photosensitive seizure triggers or unclosable traps).',
    knowledgeCheck: [
      {
        id: 'kc-was-triage-1',
        question: 'Which of the following accessibility defects should be triaged as a Critical Blocker (P1) for immediate remediation?',
        options: [
          { id: 'A', text: 'A decorative footer logo lacks an alt attribute' },
          { id: 'B', text: 'An accessible modal dialog traps keyboard focus, preventing the user from closing it or accessing the rest of the application' },
          { id: 'C', text: 'A copyright statement in the footer has a 4.2:1 contrast ratio instead of 4.5:1' },
          { id: 'D', text: 'A bulleted list is coded as paragraphs instead of <ul>' }
        ],
        answer: 'B',
        explanation: 'Keyboard focus traps are severe blockers (violating SC 2.1.2) that completely strand keyboard-only and screen reader users with no exit path.'
      },
      {
        id: 'kc-was-triage-2',
        question: 'When triaging an accessibility remediation backlog, why is relying solely on WCAG conformance levels (A vs AA vs AAA) flawed?',
        options: [
          { id: 'A', text: 'Because Level AAA is legally mandated in all countries' },
          { id: 'B', text: 'Because a minor Level A defect (e.g. missing alt on decorative icon) has far less real-world user impact than a Level AA defect blocking the main navigation' },
          { id: 'C', text: 'Because WCAG levels change every month' },
          { id: 'D', text: 'Because automated testing tools cannot read Level A criteria' }
        ],
        answer: 'B',
        explanation: 'Conformity levels reflect technical applicability and consensus, not business criticality. Real-world prioritization must weigh user impact and task completion.'
      },
      {
        id: 'kc-was-triage-3',
        question: 'What characterizes a "Serious" (P2) accessibility defect?',
        options: [
          { id: 'A', text: 'It poses an immediate physical health hazard like flashing lights' },
          { id: 'B', text: 'It creates a significant barrier and high friction, but an alternative workaround pathway is available to complete the task' },
          { id: 'C', text: 'It is a typo in a privacy policy' },
          { id: 'D', text: 'It only affects users on legacy operating systems from the 1990s' }
        ],
        answer: 'B',
        explanation: 'A Serious defect creates significant difficulties for assistive technology users, but does not completely dead-end the transaction if an alternative route exists.'
      }
    ]
  },

  // ==========================================
  // EXPANDED ADS MODULES
  // ==========================================
  {
    id: 'mod-ads-plain-language',
    cert: 'ADS',
    domainId: 'ADS-D1',
    domainLabel: 'Domain 1: Creating Electronic Documents',
    sectionId: 'ADS-D1-A',
    title: 'Writing Accessible Content, Plain Language & Hyperlinks',
    badge: 'Document Remediation',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    interactiveType: 'plain-language-links-fixer',
    citation: 'ADS BoK 2021, Section 1.1 (Write accessible inclusive content) & WCAG 2.4.4',
    summary: 'Author documents with crystal-clear readability: Eliminate non-descriptive links ("click here"), apply plain language principles, and construct scannable lists and headings.',
    learningObjectives: [
      'Remediate ambiguous link text into self-descriptive phrases containing target destination and document format.',
      'Simplify dense bureaucratic writing to Grade 8 reading levels per the Plain Writing Act.',
      'Structure lists using genuine semantic list formatting rather than manually typed asterisks or hyphens.'
    ],
    keyConcepts: [
      {
        title: 'Descriptive Hyperlink Text',
        explanation: 'Links must describe their destination even when read completely out of context. Instead of "Click here for report", use "Download the 2025 Annual Diversity Report (PDF)".'
      },
      {
        title: 'Plain Language Principles',
        explanation: 'Write in active voice, use short paragraphs (1 idea per paragraph), choose familiar everyday words, and target a reading age accessible to users with cognitive limitations.'
      },
      {
        title: 'Semantic Lists vs Text Glyphs',
        explanation: 'Always use native numbered and bulleted lists in authoring tools (Word, Google Docs, InDesign). Typing a dash or asterisk does not communicate list item counts to screen readers.'
      }
    ],
    examTips: 'ADS exam favorite: What should a link do when it downloads a non-HTML file like a PDF or Word document? It should explicitly state the file format and size in the link text or accessible name (e.g., "[PDF, 2 MB]").',
    knowledgeCheck: [
      {
        id: 'kc-ads-pl-1',
        question: 'Which of the following represents the most accessible hyperlink text in an electronic document?',
        options: [
          { id: 'A', text: 'Click here' },
          { id: 'B', text: 'Read more' },
          { id: 'C', text: 'https://example.com/files/download?id=9841' },
          { id: 'D', text: 'Download Employee Benefits Guide 2025 (PDF, 1.2 MB)' }
        ],
        answer: 'D',
        explanation: 'Accessible links clearly state the destination, subject, file format, and file size so users know exactly what will occur when activated.'
      },
      {
        id: 'kc-ads-pl-2',
        question: 'Why should document authors use native list formatting instead of typing manual dashes or asterisks?',
        options: [
          { id: 'A', text: 'Because manual dashes cause printer jams' },
          { id: 'B', text: 'Native list tools generate semantic <L> and <LI> tags in PDF, allowing screen readers to announce the total number of items and current position' },
          { id: 'C', text: 'Dashes are prohibited under copyright law' },
          { id: 'D', text: 'Manual dashes increase file size by 500%' }
        ],
        answer: 'B',
        explanation: 'Native list formatting tags items semantically (`<L>`, `<LI>`, `<Lbl>`, `<LBody>`), allowing assistive technology to announce "List with 5 items, item 1".'
      },
      {
        id: 'kc-ads-pl-3',
        question: 'What is the primary benefit of adhering to plain language standards in electronic documents?',
        options: [
          { id: 'A', text: 'It allows documents to be read faster by automated OCR scanners' },
          { id: 'B', text: 'It benefits people with cognitive and learning disabilities, non-native speakers, and all readers by ensuring information is quickly understood' },
          { id: 'C', text: 'It eliminates the need for alternative text on images' },
          { id: 'D', text: 'It removes all styling formatting' }
        ],
        answer: 'B',
        explanation: 'Plain language directly aids comprehension for people with intellectual disabilities, dyslexia, or ADHD, while simultaneously boosting reading speed and clarity for everyone.'
      }
    ]
  },
  {
    id: 'mod-cpacc-built-environment',
    cert: 'CPACC',
    domainId: 'CPACC-D2',
    domainLabel: 'Domain 2: Accessibility and Universal Design',
    sectionId: 'CPACC-D2-D',
    title: 'Accessibility Principles for the Built Environment',
    badge: 'Physical Accessibility',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    interactiveType: 'built-environment-blueprint-lab',
    citation: 'IAAP CPACC BoK V3, Domain 2.D (Accessibility Principles for the Built Environment), ADAAG (2010 ADA Standards) & ISO 21542',
    summary: 'Explore physical and architectural accessibility principles in the built environment. Master critical dimensional standards: wheelchair ramp slopes (1:12 maximum), doorway clear opening widths (32" minimum), 360-degree wheelchair turning clearances (60" diameter), closed-fist operable hardware, and tactile/Braille signage placement.',
    learningObjectives: [
      'Calculate maximum running slopes for wheelchair ramps (1:12 ratio / 8.33% grade) and landing spacing requirements.',
      'Specify minimum doorway clear opening width (32 inches) and accessible hardware operable without tight grasping or twisting.',
      'Apply spatial standards for wheelchair turning (60-inch diameter circle or T-shaped turn) in hallways, restrooms, and vestibules.',
      'Determine compliant tactile and Braille signage mounting heights (48"-60" character baseline) and latch-side wall locations.',
      'Understand the interplay between physical accessibility (ADA Title III / ISO 21542) and digital accessibility kiosk/terminal design.'
    ],
    keyConcepts: [
      {
        title: 'Ramp Running Slopes & Restings (ADAAG 405)',
        explanation: 'Under ADAAG Section 405, ramp runs shall have a running slope not steeper than 1:12 (8.33% grade). Cross slope must not exceed 1:48. Level landings of at least 60" x 60" are required at the top, bottom, and at every 30 inches of maximum vertical rise to allow wheelchair users to rest.'
      },
      {
        title: 'Accessible Doorways & Operable Hardware (ADAAG 404)',
        explanation: 'Door openings must provide a minimum clear width of 32 inches (815 mm) measured between the face of the door and the opposite stop with the door open 90 degrees. Door hardware must be operable with one hand without tight grasping, pinching, or twisting of the wrist (operable with a closed fist; maximum 5 lbf of operational force).'
      },
      {
        title: 'Wheelchair Turning Space (ADAAG 304)',
        explanation: 'A full 360-degree wheelchair turn requires a circular space of 60 inches (1525 mm) minimum diameter, or a T-shaped turning space within a 60" by 60" boundary with 36" wide arms.'
      },
      {
        title: 'Tactile & Braille Signage Mounting (ADAAG 703)',
        explanation: 'Tactile signs identifying permanent rooms must be mounted on the wall on the latch side of the door. Tactile character baselines must be between 48 inches minimum and 60 inches maximum above the finish floor, with an 18" x 18" clear floor space centered on the tactile sign.'
      }
    ],
    examTips: 'CPACC Exam Alert: Remember the rule of thumb "1:12" for ramps (1 inch of vertical rise requires at least 12 inches of horizontal run). Watch out for trap questions claiming 1:8 or 1:10 is standard — those are illegal tipping hazards. For door hardware, the key test is "operable with a closed fist" with 5 pounds of force or less. For signs, NEVER place them on the door face itself if the door swings into the user.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-be-1',
        question: 'Under the 2010 ADA Standards (ADAAG 405.2), what is the maximum running slope allowed for an accessible wheelchair ramp in new construction?',
        options: [
          { id: 'A', text: '1:8 (12.5% slope)' },
          { id: 'B', text: '1:10 (10% slope)' },
          { id: 'C', text: '1:12 (8.33% slope)' },
          { id: 'D', text: '1:20 (5% slope)' }
        ],
        answer: 'C',
        explanation: 'ADAAG 405.2 specifies that ramp runs shall have a running slope not steeper than 1:12 (8.33% grade). Steeper slopes create dangerous tipping hazards for manual and power wheelchair users.'
      },
      {
        id: 'kc-cpacc-be-2',
        question: 'What is the minimum clear opening width required for accessible doors and gates under ADAAG 404.2.3?',
        options: [
          { id: 'A', text: '28 inches (710 mm)' },
          { id: 'B', text: '30 inches (760 mm)' },
          { id: 'C', text: '32 inches (815 mm)' },
          { id: 'D', text: '36 inches (915 mm)' }
        ],
        answer: 'C',
        explanation: 'Door openings must provide a minimum clear width of 32 inches (815 mm), measured between the face of the door and the stop with the door open 90 degrees.'
      },
      {
        id: 'kc-cpacc-be-3',
        question: 'Where must tactile and Braille signs identifying permanent interior rooms be mounted according to ADAAG 703.4?',
        options: [
          { id: 'A', text: 'Directly in the center of the push side of the door leaf at 72 inches' },
          { id: 'B', text: 'On the wall adjacent to the latch side of the door, with character baselines between 48 and 60 inches above the finish floor' },
          { id: 'C', text: 'Hanging from the ceiling at 80 inches minimum clearance' },
          { id: 'D', text: 'On the floor directly in front of the door threshold' },
        ],
        answer: 'B',
        explanation: 'Mounting tactile signs on the wall on the latch side of the door between 48" and 60" ensures that blind individuals reading Braille do not get struck by a swinging door.'
      }
    ]
  },
  {
    id: 'mod-was-spa-routing',
    cert: 'WAS',
    domainId: 'WAS-D1',
    domainLabel: 'Domain 1: Creating Accessible Web Solutions',
    sectionId: 'WAS-D1-G',
    title: 'Single-Page Applications (SPA) Routing & Focus Management',
    badge: 'SPA Accessibility',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    interactiveType: 'spa-routing-lab',
    citation: 'IAAP WAS BoK 2024, Domain 1.G (Single-Page Applications), W3C WCAG 2.1/2.2 SC 2.4.2, 2.4.3, 4.1.3 & WAI-ARIA 1.2',
    summary: 'Architect accessible client-side routing in React, Vue, and Angular SPAs. Solve the three primary SPA accessibility failures: missing page title updates (WCAG 2.4.2), stranded keyboard focus (WCAG 2.4.3), and silent screen reader transitions (WCAG 4.1.3) through programmatic focus management and ARIA live route announcers.',
    learningObjectives: [
      'Identify why client-side route transitions in Single-Page Applications fail default browser accessibility behaviors.',
      'Implement automated document title synchronization on route change to satisfy WCAG 2.4.2 Page Titled.',
      'Manage programmatic keyboard focus to the new page primary heading (<h1 tabIndex="-1">) or main landmark (WCAG 2.4.3).',
      'Build an off-screen ARIA live region route announcer (aria-live="polite", aria-atomic="true") to notify screen readers of view changes.',
      'Prevent focus traps and skipped content when dynamically mounting and unmounting virtual DOM components.'
    ],
    keyConcepts: [
      {
        title: 'The SPA Navigation Breakdown',
        explanation: 'In multi-page apps (MPAs), clicking a link causes the browser to fetch HTML, update the window title, reset scroll position, and announce the new page to screen readers. In client-side SPAs (history.pushState / virtual DOM), none of these native actions occur automatically.'
      },
      {
        title: 'Document Title Synchronization (WCAG 2.4.2)',
        explanation: 'WCAG 2.4.2 requires web pages to have descriptive titles. In SPAs, routing hooks (e.g., React useEffect or Vue router afterEach) must dynamically synchronize document.title on every view transition.'
      },
      {
        title: 'Programmatic Focus Transfer (WCAG 2.4.3)',
        explanation: 'When client-side navigation occurs, keyboard focus remains stranded on the clicked link in the navbar unless programmatically moved. Shifting focus to the main route heading with <h1 tabIndex="-1"> guides the keyboard user directly to the new content.'
      },
      {
        title: 'ARIA Live Route Announcers (WCAG 4.1.3)',
        explanation: 'An off-screen container with aria-live="polite" and aria-atomic="true" announces the newly loaded view name to screen readers without interrupting immediate user input.'
      }
    ],
    examTips: 'WAS Exam Alert: Remember that <h1 tabIndex="-1"> is NOT added to the sequential keyboard Tab order, but IT CAN BE focused via JavaScript (element.focus()). This is the industry-standard APG pattern for SPA focus management. Always pair title updates with an ARIA live route announcement or focus move.',
    knowledgeCheck: [
      {
        id: 'kc-was-spa-1',
        question: 'Why do default client-side route transitions in SPAs create severe accessibility barriers for screen reader users?',
        options: [
          { id: 'A', text: 'SPAs cannot render semantic HTML elements in the virtual DOM' },
          { id: 'B', text: 'Client-side routing bypasses native page reloads, leaving the browser title unchanged, keyboard focus stranded, and screen readers silent' },
          { id: 'C', text: 'JavaScript is completely unsupported by modern screen readers' },
          { id: 'D', text: 'Client-side routers automatically disable all ARIA attributes' }
        ],
        answer: 'B',
        explanation: 'Because client-side routing intercepts links with history.pushState without a full page reload, the browser does not announce the new document title or reset keyboard focus unless explicitly coded.'
      },
      {
        id: 'kc-was-spa-2',
        question: 'When shifting programmatic keyboard focus to a new page heading in a SPA, why should tabindex="-1" be used on the <h1>?',
        options: [
          { id: 'A', text: 'It permanently prevents the heading from receiving focus' },
          { id: 'B', text: 'It allows programmatic focus via .focus() while keeping the heading out of the natural sequential Tab order' },
          { id: 'C', text: 'It converts the heading into an interactive button' },
          { id: 'D', text: 'It suppresses screen reader announcements of the heading text' }
        ],
        answer: 'B',
        explanation: 'tabIndex="-1" makes any element programmatically focusable via script without injecting non-interactive elements into the keyboard Tab sequence.'
      },
      {
        id: 'kc-was-spa-3',
        question: 'Which ARIA configuration is recommended for an off-screen SPA route change announcer?',
        options: [
          { id: 'A', text: 'aria-live="assertive" aria-atomic="false"' },
          { id: 'B', text: 'aria-live="polite" aria-atomic="true"' },
          { id: 'C', text: 'role="alert" aria-busy="true"' },
          { id: 'D', text: 'aria-hidden="true"' }
        ],
        answer: 'B',
        explanation: 'aria-live="polite" queues the route change notification so it does not rudely interrupt ongoing speech, and aria-atomic="true" ensures the entire announcement is read as a complete unit.'
      }
    ]
  },
  {
    id: 'mod-ads-ocr-remediation',
    cert: 'ADS',
    domainId: 'ADS-D2',
    domainLabel: 'Domain 2: Remediating Electronic Documents',
    sectionId: 'ADS-D2-E',
    title: 'Optical Character Recognition (OCR) & Scanned Document Remediation',
    badge: 'Scanned Document Remediation',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    interactiveType: 'ocr-document-remediator',
    citation: 'IAAP ADS BoK 2021, Section 2.5 (Use OCR) & ISO 14289-1 (PDF/UA-1)',
    summary: 'Remediate scanned paper documents and image-only PDFs into fully accessible PDF/UA files. Understand OCR limitations, proofread and correct optical glyph misrecognitions (1 vs l, 0 vs O, rn vs m), define document natural languages, and transform raw OCR text into structured PDF/UA tag trees.',
    learningObjectives: [
      'Explain why a scanned PDF without OCR is completely inaccessible to assistive technology (0% PAC conformance).',
      'Understand the difference between "Searchable Image" (OCR text layer behind pixels) and fully tagged PDF/UA-1.',
      'Identify and correct high-frequency optical recognition glyph errors that distort screen reader pronunciation.',
      'Assign document natural language metadata (xml:lang) to ensure accurate screen reader speech synthesis engines.',
      'Structure OCR text layers into semantic PDF tags (<H1>, <H2>, <P>, <Table>, <L>) to pass ISO 14289-1 validation.'
    ],
    keyConcepts: [
      {
        title: 'The "Searchable Image" Myth',
        explanation: 'Running OCR in Acrobat generates a "Searchable Image" (an invisible text layer placed behind the scanned bitmap). While this enables text searching, IT IS NOT YET ACCESSIBLE under PDF/UA because it lacks structure tags, reading order, and table semantics.'
      },
      {
        title: 'Optical Glyph Misrecognitions',
        explanation: 'OCR engines work via pattern matching on pixel clusters. Visual artifacts, speckles, or font ligatures routinely cause misreadings: "rn" becomes "m", "cl" becomes "d", "1" becomes "l", and "O" becomes "0". Uncorrected glyphs cause severe screen reader pronunciation distortion.'
      },
      {
        title: 'Language Tagging (PDF/UA 7.2)',
        explanation: 'ISO 14289-1 mandates that the natural language of all text content must be specified (e.g. en-US, es-ES). Without language tags, screen readers use default synthesizer phonetics, rendering foreign or localized text unintelligible.'
      },
      {
        title: 'Document Structuring',
        explanation: 'Once OCR text is proofread, it must be tagged. Headings must be nested (<H1> to <H2>), lists must use <L> and <LI>, and background paper artifacts must be marked as /Artifact.'
      }
    ],
    examTips: 'ADS Exam Alert: Remember that running OCR is necessary but NOT sufficient for PDF/UA conformance. An exam question asking "Is a scanned PDF accessible once OCR has been run?" has the answer NO — it still requires manual proofreading for glyph errors, document language declaration, and logical tag tree structuring.',
    knowledgeCheck: [
      {
        id: 'kc-ads-ocr-1',
        question: 'Why is running Optical Character Recognition (OCR) alone insufficient to make a scanned PDF accessible under PDF/UA (ISO 14289-1)?',
        options: [
          { id: 'A', text: 'OCR permanently flattens all fonts and disables text search' },
          { id: 'B', text: 'OCR only generates an unformatted text layer; it does not assign heading hierarchies, table headers, document language, or logical reading order tags' },
          { id: 'C', text: 'OCR is prohibited by Section 508 procurement standards' },
          { id: 'D', text: 'Screen readers cannot read any PDF that contains images' }
        ],
        answer: 'B',
        explanation: 'OCR creates a "Searchable Image" text layer, but PDF/UA requires semantic structure tags (<H1>, <P>, <Table>), reading order verification, language tagging, and error proofreading.'
      },
      {
        id: 'kc-ads-ocr-2',
        question: 'Which high-frequency OCR transcription defect can severely impair screen reader pronunciation if left uncorrected?',
        options: [
          { id: 'A', text: 'Vector path compression' },
          { id: 'B', text: 'Look-alike glyph errors such as mistaking "rn" for "m", numeral "1" for letter "l", or numeral "0" for uppercase "O"' },
          { id: 'C', text: 'Excessive DPI resolution in raster layers' },
          { id: 'D', text: 'Automatic font embedding' }
        ],
        answer: 'B',
        explanation: 'Optical character engines frequently confuse visually similar character pairs (such as "rn" vs "m" or "1" vs "l"), causing screen reader text-to-speech synthesizers to mispronounce words.'
      },
      {
        id: 'kc-ads-ocr-3',
        question: 'Under ISO 14289-1 (PDF/UA), what metadata attribute must be defined for an OCR-remediated document so that screen readers pronounce words with correct phonetics?',
        options: [
          { id: 'A', text: 'The document author\'s employee ID' },
          { id: 'B', text: 'The document primary natural language (e.g. en-US or fr-FR)' },
          { id: 'C', text: 'The DPI resolution of the scanner scanner hardware' },
          { id: 'D', text: 'The color space profile (CMYK vs RGB)' }
        ],
        answer: 'B',
        explanation: 'PDF/UA requires the document natural language to be explicitly specified so screen readers activate the correct phonetic pronunciation rules and accent engines.'
      }
    ]
  },
  {
    id: 'mod-cpacc-etiquette',
    cert: 'CPACC',
    domainId: 'CPACC-D1',
    domainLabel: 'Domain 1: Disabilities, Challenges, and Assistive Technologies',
    sectionId: 'CPACC-D1-E',
    title: 'Disability Etiquette & Respectful Professional Interactions',
    badge: 'Disability Etiquette',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    interactiveType: 'disability-etiquette-lab',
    citation: 'IAAP CPACC BoK V3, Domain 1.E (Disability Etiquette) & ADA Title III Guidance',
    summary: 'Master professional disability etiquette and interpersonal communication principles. Understand the boundary between personal bodily space and assistive equipment, working service dog protocol, direct communication with Deaf individuals working with sign language interpreters, and community-driven terminology preferences (Person-First vs Identity-First language).',
    learningObjectives: [
      'Treat wheelchairs, guide dogs, white canes, and assistive devices as extensions of personal bodily space.',
      'Apply service animal etiquette: never distract, pet, or feed a working service animal.',
      'Maintain direct communication and eye contact with the person with a disability rather than addressing an interpreter, companion, or caregiver.',
      'Navigate the nuances of Person-First language ("person with a disability") and Identity-First language ("Deaf person", "Autistic person") across distinct communities.',
      'Recognize and eliminate patronizing euphemisms ("differently abled", "special needs", "handi-capable").'
    ],
    keyConcepts: [
      {
        title: 'Assistive Devices as Bodily Space',
        explanation: 'A wheelchair, white cane, guide dog harness, or walker is an integral extension of an individual\'s personal physical space. Leaning on someone\'s wheelchair, touching equipment without permission, or grabbing handles to push them is equivalent to touching their physical body without consent.'
      },
      {
        title: 'Service Animal Protocol',
        explanation: 'Service animals (primarily dogs trained to perform specific tasks related to a person\'s disability under ADA Title II/III) are working medical equipment. Distracting, petting, or feeding them disrupts their focus on medical alerts, navigation, or seizure detection.'
      },
      {
        title: 'Direct Address & Eye Contact',
        explanation: 'When speaking with a person who uses an ASL interpreter, speech synthesizer, or personal assistant, always look directly at the person and speak in the first person ("What is your goal?"). Never say "Ask them..." or look exclusively at the interpreter. For wheelchair users, pull up a chair to speak at eye level to prevent neck strain and patronizing posturing.'
      },
      {
        title: 'Terminology: Person-First vs Identity-First Language',
        explanation: 'Person-First Language ("person who is blind", "people with disabilities") emphasizes humanity before disability and is common in legal/policy contexts. Identity-First Language ("Autistic adult", "Deaf individual") views disability as an inseparable, proud cultural identity. Both are valid within their respective communities; patronizing euphemisms like "differently abled" or "special needs" are rejected by disability advocacy groups.'
      }
    ],
    examTips: 'CPACC Exam Alert: Watch out for questions offering "helpful" actions that violate autonomy — such as pushing someone\'s wheelchair without asking or speaking to an interpreter instead of the individual. Remember the core rule: ALWAYS ask before offering assistance, and respect their answer if they decline.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-et-1',
        question: 'When conversing with a person who uses a wheelchair during an extended meeting, what is the recommended etiquette?',
        options: [
          { id: 'A', text: 'Lean on the wheelchair handles to demonstrate closeness' },
          { id: 'B', text: 'Sit down or pull up a chair so you are conversing at eye level, and never touch the wheelchair without explicit consent' },
          { id: 'C', text: 'Stand directly behind them and speak loudly' },
          { id: 'D', text: 'Push their wheelchair to the front of the room without asking' }
        ],
        answer: 'B',
        explanation: 'Sitting at eye level facilitates comfortable conversation without causing neck strain, while respecting the wheelchair as personal bodily space.'
      },
      {
        id: 'kc-cpacc-et-2',
        question: 'When interacting with a colleague who is accompanied by a certified working guide dog in the office, what is the correct behavioral rule?',
        options: [
          { id: 'A', text: 'Offer the dog treats to establish positive team rapport' },
          { id: 'B', text: 'Pet the dog whenever you enter the room' },
          { id: 'C', text: 'Address and greet the colleague directly while ignoring the working dog so its focus remains on its handler' },
          { id: 'D', text: 'Demand to inspect the dog\'s veterinary health records' }
        ],
        answer: 'C',
        explanation: 'Working service animals must not be distracted, petted, or fed while on duty. Always address the human handler directly.'
      },
      {
        id: 'kc-cpacc-et-3',
        question: 'Why do disability rights organizations and the IAAP strongly discourage the use of terms like "differently abled", "special needs", or "handi-capable"?',
        options: [
          { id: 'A', text: 'They are trademarked terms owned by private medical corporations' },
          { id: 'B', text: 'They are patronizing euphemisms that avoid the neutral, factual terms "disability" and "disabled"' },
          { id: 'C', text: 'They are only permissible in legal statutes outside the United States' },
          { id: 'D', text: 'They refer exclusively to temporary cognitive impairments' }
        ],
        answer: 'B',
        explanation: '"Disabled" and "disability" are recognized, neutral descriptors. Euphemisms like "special needs" are viewed by disability communities as patronizing and evasive.'
      }
    ]
  },
  {
    id: 'mod-was-wcag-em',
    cert: 'WAS',
    domainId: 'WAS-D2',
    domainLabel: 'Domain 2: Identifying Accessibility Issues in Web Solutions',
    sectionId: 'WAS-D2-B',
    title: 'Guidelines, Conformance Requirements & WCAG-EM 1.0',
    badge: 'Audit Methodology',
    difficulty: 'Advanced',
    estimatedMinutes: 15,
    interactiveType: 'wcag-em-audit-planner-lab',
    citation: 'IAAP WAS BoK 2024, Domain 2.B (Guidelines, Conformance Requirements and WCAG-EM) & W3C WCAG-EM 1.0',
    summary: 'Master the W3C Website Accessibility Conformance Evaluation Methodology (WCAG-EM 1.0). Plan and execute comprehensive accessibility audits across 5 structured steps: defining evaluation scope and baseline, exploring website functionality, curating representative and random sample pages, evaluating success criteria, and reporting formal conformance claims.',
    learningObjectives: [
      'Execute the 5 core steps of the official W3C WCAG-EM 1.0 auditing methodology.',
      'Define an audit scope boundary, conformance target (WCAG 2.2 AA), and accessibility-supported baseline.',
      'Apply the Complete Processes rule: ensure end-to-end transactional workflows (e.g. cart to confirmation) are audited without omission.',
      'Curate a statistically valid representative sample combining structured template pages with randomly selected URLs.',
      'Author a formal WCAG-EM Conformance Statement with clear executive findings and remediation guidance.'
    ],
    keyConcepts: [
      {
        title: 'The 5 Steps of WCAG-EM',
        explanation: 'WCAG-EM 1.0 consists of 5 sequential steps: 1. Define Evaluation Scope, 2. Explore Target Website, 3. Select Representative Sample, 4. Audit Selected Sample, 5. Report Evaluation Findings.'
      },
      {
        title: 'Scoping & Complete Processes',
        explanation: 'Under WCAG Conformance Requirement 3 (Complete Processes), an audit cannot claim conformance for a process (e.g. ordering a product) if any single page in that workflow is excluded or non-conforming.'
      },
      {
        title: 'Representative Sampling Strategy',
        explanation: 'A reliable audit must evaluate: (1) Key web pages (home, contact), (2) All steps in complete processes, (3) Pages with diverse functionality/technologies (data grids, canvas, multimedia), and (4) Approximately 10% randomly selected URLs to uncover systemic template bugs.'
      },
      {
        title: 'Conformance Statements & Claims',
        explanation: 'A conformance claim must state the date of evaluation, the guidelines version (WCAG 2.2), conformance level (Level AA), scope of web pages, and accessibility-supported baseline.'
      }
    ],
    examTips: 'WAS Exam Alert: Remember that you cannot claim partial conformance for a single page — conformance is all-or-nothing per page. Also remember the "Complete Processes" mandate: if any single step in a multi-step form fails, the entire process fails conformance.',
    knowledgeCheck: [
      {
        id: 'kc-was-em-1',
        question: 'Under W3C WCAG-EM Step 3 (Select a Representative Sample), why is it mandatory to include a randomly selected sample alongside structured key pages?',
        options: [
          { id: 'A', text: 'To reduce the audit fee for commercial clients' },
          { id: 'B', text: 'To uncover unexpected systemic defects, legacy sub-templates, and atypical page layouts not captured in curated core pages' },
          { id: 'C', text: 'Because automated screen readers can only parse randomly generated URLs' },
          { id: 'D', text: 'To satisfy ISO 9001 factory manufacturing audits' }
        ],
        answer: 'B',
        explanation: 'Including approximately 10% randomly drawn URLs prevents auditor bias and exposes uncurated template variations or forgotten site sections.'
      },
      {
        id: 'kc-was-em-2',
        question: 'According to WCAG Conformance Requirement 3 (Complete Processes), what happens if a multi-step checkout flow has 4 accessible pages but 1 page with an inaccessible payment button?',
        options: [
          { id: 'A', text: 'The website can claim 80% proportional conformance for the process' },
          { id: 'B', text: 'The entire transaction process fails conformance because all steps in a complete process must conform' },
          { id: 'C', text: 'The payment page is automatically exempted from audit scope' },
          { id: 'D', text: 'Conformance defaults to WCAG Level AAA' }
        ],
        answer: 'B',
        explanation: 'Under WCAG Conformance Requirement 3, if any page in a transaction workflow is non-conforming, the entire process cannot be certified as conforming.'
      },
      {
        id: 'kc-was-em-3',
        question: 'What are the 5 official sequential steps of the W3C WCAG-EM 1.0 methodology?',
        options: [
          { id: 'A', text: 'Scan, Lint, Fix, Test, Deploy' },
          { id: 'B', text: 'Define Scope, Explore Website, Select Sample, Audit Sample, Report Findings' },
          { id: 'C', text: 'Identify, Isolate, Refactor, Document, Certify' },
          { id: 'D', text: 'Procure, Audit, Train, Remediate, Litigate' }
        ],
        answer: 'B',
        explanation: 'WCAG-EM 1.0 is structured into: 1. Define Scope, 2. Explore Target Website, 3. Select Representative Sample, 4. Audit Selected Sample, 5. Report Evaluation Findings.'
      }
    ]
  },
  {
    id: 'mod-ads-authoring-format',
    cert: 'ADS',
    domainId: 'ADS-D2',
    domainLabel: 'Domain 2: Remediating Electronic Documents',
    sectionId: 'ADS-D2-D',
    title: 'Remediating Documents in Authoring Formats (Word & InDesign)',
    badge: 'Source Remediation',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    interactiveType: 'authoring-format-remediator',
    citation: 'IAAP ADS BoK 2021, Section 2.4 (Remediate in authoring format) & ISO 14289-1 (PDF/UA)',
    summary: 'Remediate accessibility defects directly in source authoring applications (Microsoft Word, Adobe InDesign, Google Docs) before PDF export. Master built-in paragraph styles, "Repeat as Header Row" for data tables, InDesign Export Tagging rules, and embedded graphic metadata to ensure repeatable, permanent PDF/UA conformance.',
    learningObjectives: [
      'Explain why remediating document accessibility in source authoring tools is exponentially more sustainable than downstream PDF touchups.',
      'Replace visual font bolding/resizing with native Heading Styles (Heading 1, Heading 2) in Microsoft Word and InDesign.',
      'Configure multi-page table properties ("Repeat as Header Row at Top of Each Page") to generate valid PDF/UA <TH> headers.',
      'Configure Adobe InDesign Paragraph Style Export Tagging to map custom print layouts to semantic PDF tags (<Aside>, <BlockQuote>).',
      'Embed alternative text directly into source image object properties to persist across all future PDF document revisions.'
    ],
    keyConcepts: [
      {
        title: 'The Fragility of Downstream PDF Remediation',
        explanation: 'Remediating a PDF in Adobe Acrobat Pro modifies only the exported PDF tag tree. If an author later edits a single typo in Microsoft Word or InDesign and re-exports, ALL downstream Acrobat tags, alt text, and reading order touchups are completely overwritten and lost.'
      },
      {
        title: 'Native Heading Styles vs Visual Bolding',
        explanation: 'Changing font size to 24pt and bolding text creates visually large text, but exports to a <P> (paragraph) tag in PDF. Applying true built-in styles (Heading 1, Heading 2) maps automatically to <H1> and <H2> in the exported PDF tag tree.'
      },
      {
        title: 'Accessible Data Tables in Word',
        explanation: 'To pass PDF/UA table requirements from Word, tables must have a designated header row with "Repeat as header row at the top of each page" checked in Table Properties, and "Allow row to break across pages" unchecked for data consistency.'
      },
      {
        title: 'InDesign Export Tagging',
        explanation: 'Professional desktop publishing layouts often use non-standard style names (e.g., "PullQuote_Red", "Sidebar_Note"). In InDesign, the Export Tagging panel allows creators to explicitly map styles to semantic PDF tags (<BlockQuote>, <Aside>, <H1>, <P>).'
      }
    ],
    examTips: 'ADS Exam Alert: Remember that source remediation is the primary defense against the "Re-Export Trap". When a question asks how to handle recurring quarterly reports, the correct strategy is ALWAYS configuring templates and styles in the authoring tool (Word/InDesign), never manually re-tagging the PDF in Acrobat every quarter.',
    knowledgeCheck: [
      {
        id: 'kc-ads-auth-1',
        question: 'Why is remediating accessibility in source authoring files (Word/InDesign) preferred over fixing tags downstream in Adobe Acrobat Pro?',
        options: [
          { id: 'A', text: 'Adobe Acrobat Pro cannot create <H1> tags' },
          { id: 'B', text: 'Re-exporting a document from Word or InDesign after future text edits completely wipes out all downstream Acrobat PDF remediation' },
          { id: 'C', text: 'Section 508 prohibits the use of PDF editing software' },
          { id: 'D', text: 'Source files have smaller file sizes than PDFs' }
        ],
        answer: 'B',
        explanation: 'Every time a source document is re-exported to PDF, the PDF tag tree is regenerated from scratch, destroying all manual fixes made in Acrobat.'
      },
      {
        id: 'kc-ads-auth-2',
        question: 'In Microsoft Word, what action is necessary to ensure a table spanning multiple pages exports to PDF with valid <TH> table header tags on every page?',
        options: [
          { id: 'A', text: 'Manually copy and paste the header row text at the top of each page' },
          { id: 'B', text: 'Right-click the header row, open Table Properties, and check "Repeat as header row at the top of each page"' },
          { id: 'C', text: 'Draw a black border around the top row' },
          { id: 'D', text: 'Convert the table into an image with alternative text' }
        ],
        answer: 'B',
        explanation: 'Checking "Repeat as header row at the top of each page" in Word Table Properties instructs the PDF export filter to tag those cells as semantic <TH> headers.'
      },
      {
        id: 'kc-ads-auth-3',
        question: 'In Adobe InDesign, what feature must be configured so that custom paragraph styles (such as "Feature_Callout") export to semantic PDF tags like <Aside> instead of generic <Div> tags?',
        options: [
          { id: 'A', text: 'Preflight Panel' },
          { id: 'B', text: 'Export Tagging in Paragraph Style Options' },
          { id: 'C', text: 'Glyphs Panel' },
          { id: 'D', text: 'Object State Manager' }
        ],
        answer: 'B',
        explanation: 'InDesign\'s Export Tagging tab in Paragraph Style Options enables designers to explicitly map custom print styles to semantic PDF/UA tags.'
      }
    ]
  },
  {
    id: 'mod-cpacc-udl',
    cert: 'CPACC',
    domainId: 'CPACC-D2',
    domainLabel: 'Domain 2: Accessibility and Universal Design',
    sectionId: 'CPACC-D2-F',
    title: 'Universal Design for Learning (UDL) & Inclusive Pedagogy',
    badge: 'Educational Accessibility',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    interactiveType: 'udl-course-designer-lab',
    citation: 'IAAP CPACC BoK V3, Domain 2.F (Universal Design for Learning) & CAST UDL Guidelines 2.2',
    summary: 'Explore the Universal Design for Learning (UDL) framework developed by CAST. Understand how proactive curricular design based on cognitive neuroscience eliminates educational barriers across 3 brain networks: Multiple Means of Engagement (Affective Networks), Multiple Means of Representation (Recognition Networks), and Multiple Means of Action & Expression (Strategic Networks).',
    learningObjectives: [
      'Map CAST\'s 3 UDL pillars to the underlying brain networks: Affective ("Why"), Recognition ("What"), and Strategic ("How").',
      'Differentiate proactive universal instructional design from reactive post-enrollment accommodations.',
      'Apply multiple means of engagement through student choice, authentic tasks, and self-regulation scaffolding.',
      'Provide multiple means of representation via multimodal media, synchronized captions, transcripts, and customizable display options.',
      'Support multiple means of action and expression with flexible response formats, assistive technology integration, and executive function supports.'
    ],
    keyConcepts: [
      {
        title: 'Affective Networks & Engagement (The "Why" of Learning)',
        explanation: 'The affective brain network determines what captures learners\' interest, how they sustain effort, and how they self-regulate. Providing options for student choice, real-world authenticity, and low-stakes progress milestones fosters intrinsically motivated, purposeful learners.'
      },
      {
        title: 'Recognition Networks & Representation (The "What" of Learning)',
        explanation: 'The recognition network identifies facts, letters, symbols, and concepts. Relying solely on printed text erects barriers for blind, dyslexic, or ESL students. Offering multimodal media (captioned video, transcripts, interactive diagrams) and embedded vocabulary supports ensures perception and comprehension for all.'
      },
      {
        title: 'Strategic Networks & Action/Expression (The "How" of Learning)',
        explanation: 'The strategic network plans, executes, and monitors physical and communicative activities. Forcing a single evaluation medium (e.g. handwritten paper) discriminates against students with physical or motor disabilities, dysgraphia, or speech impediments. Providing multiple channels (typed report, podcast, video presentation) allows learners to demonstrate mastery authentically.'
      },
      {
        title: 'Universal Design vs Individual Accommodations',
        explanation: 'Individual accommodations (e.g., granting 1.5x time or brailling a test after a student discloses a disability) are reactive, costly, and can isolate the student. Universal Design for Learning proactively designs flexibility into the syllabus so the greatest number of diverse learners succeed without needing to petition for separate accommodations.'
      }
    ],
    examTips: 'CPACC Exam Alert: Be prepared to match each of the 3 UDL pillars to its corresponding brain network and question: Engagement = Affective Network ("Why"), Representation = Recognition Network ("What"), Action & Expression = Strategic Network ("How"). Also remember: UDL benefits ALL students (curb-cut effect in education), not just students with diagnosed disabilities.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-udl-1',
        question: 'Which neurological network corresponds to the UDL principle of providing "Multiple Means of Representation" and the "What" of learning?',
        options: [
          { id: 'A', text: 'The Affective Network' },
          { id: 'B', text: 'The Recognition Network' },
          { id: 'C', text: 'The Strategic Network' },
          { id: 'D', text: 'The Vestibular Network' }
        ],
        answer: 'B',
        explanation: 'The Recognition Network (located in the rear of the brain) processes sensory input to recognize patterns, symbols, and ideas — corresponding to the "What" of learning.'
      },
      {
        id: 'kc-cpacc-udl-2',
        question: 'How does Universal Design for Learning (UDL) fundamentally differ from traditional individualized accommodations in higher education?',
        options: [
          { id: 'A', text: 'UDL completely eliminates the need for any grading or student evaluation' },
          { id: 'B', text: 'UDL proactively designs multimodal flexibility into the core curriculum for all learners, whereas accommodations are reactive modifications arranged for individual students' },
          { id: 'C', text: 'UDL is applied exclusively to physical campus architecture' },
          { id: 'D', text: 'Accommodations are designed by CAST while UDL is administered by state medical boards' }
        ],
        answer: 'B',
        explanation: 'UDL is proactive and universal: flexible learning options are built into the initial course architecture, drastically reducing the need for retrofitted, reactive individual accommodations.'
      },
      {
        id: 'kc-cpacc-udl-3',
        question: 'Allowing students to submit an assignment as a written essay, an audio podcast, or an interactive demonstration directly embodies which UDL principle?',
        options: [
          { id: 'A', text: 'Multiple Means of Engagement' },
          { id: 'B', text: 'Multiple Means of Representation' },
          { id: 'C', text: 'Multiple Means of Action and Expression' },
          { id: 'D', text: 'The Medical Model of Disability' }
        ],
        answer: 'C',
        explanation: 'Offering varied mediums for students to demonstrate knowledge and express ideas is the hallmark of the Strategic Network ("Multiple Means of Action and Expression").'
      }
    ]
  },
  {
    id: 'mod-was-procurement',
    cert: 'WAS',
    domainId: 'WAS-D3',
    domainLabel: 'Domain 3: Remediating Issues in Web Solutions',
    sectionId: 'WAS-D3-C',
    title: 'Accessibility in ICT Procurement & Vendor Management',
    badge: 'Procurement & VPAT',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    interactiveType: 'vpat-procurement-auditor-lab',
    citation: 'IAAP WAS BoK 2024, Domain 3.C (Accessibility Procurement Process), Section 508 & EN 301 549',
    summary: 'Manage accessibility throughout the ICT procurement lifecycle. Draft binding RFP requirements, evaluate vendor Voluntary Product Accessibility Templates (VPATs) and Accessibility Conformance Reports (ACRs), detect vendor "greenwashing", conduct validation audits, and negotiate enforceable contract remediation SLAs and indemnification clauses.',
    learningObjectives: [
      'Integrate accessibility requirements (WCAG 2.2 AA, Section 508, EN 301 549) into procurement Statements of Work (SOWs) and RFPs.',
      'Analyze vendor Accessibility Conformance Reports (ACRs) based on VPAT 2.x standards.',
      'Identify vendor "greenwashing" red flags: 100% "Supports" claims with generic copy-pasted text and suspicious "Not Applicable" ratings.',
      'Require and execute independent hands-on verification audits of vendor demo environments prior to contract signature.',
      'Negotiate binding contractual safeguards: vendor remediation timelines (e.g. 30 days for Blocker defects) and legal indemnification.'
    ],
    keyConcepts: [
      {
        title: 'The ICT Procurement Risk',
        explanation: 'Acquiring third-party commercial-off-the-shelf (COTS) software without accessibility vetting is the leading cause of enterprise digital accessibility compliance failures. Once locked into a multi-year enterprise license, organizations inherit the vendor\'s legal liability under ADA Title III or Section 508.'
      },
      {
        title: 'VPAT vs ACR',
        explanation: 'A Voluntary Product Accessibility Template (VPAT) is the blank standardized template maintained by the Information Technology Industry Council (ITI). When a vendor completes the template evaluating their product against accessibility standards, the resulting document is called an Accessibility Conformance Report (ACR).'
      },
      {
        title: 'Spotting Vendor "Greenwashing"',
        explanation: 'Dishonest vendors often claim 100% "Supports" across all 50 WCAG criteria to pass automated procurement filters. Key red flags: identical copy-pasted remarks for every criterion, listing core web criteria (contrast, keyboard) as "Not Applicable", and failing to document assistive technology testing configurations (e.g. NVDA, JAWS, VoiceOver).'
      },
      {
        title: 'Contractual Enforcement Clauses',
        explanation: 'A trustworthy ACR is only the first step. Commercial contracts must include: (1) Vendor Warranty of Accessibility, (2) Liquidated damages or withholding payments for non-compliance, (3) Binding Remediation SLAs (e.g. Critical defects fixed within 30 days), and (4) Buyer\'s right to perform independent third-party audits.'
      }
    ],
    examTips: 'WAS Exam Alert: Remember that an ACR is only a vendor claim — it is NOT a certification. Due diligence ALWAYS requires independent manual verification testing. Also know the VPAT 2.x editions: 508 (US Federal), WCAG (W3C standard), EU (EN 301 549), and INT (International combining all three).',
    knowledgeCheck: [
      {
        id: 'kc-was-pro-1',
        question: 'What is the critical distinction between a VPAT and an ACR in the accessibility procurement process?',
        options: [
          { id: 'A', text: 'A VPAT is for hardware while an ACR is exclusively for cloud software' },
          { id: 'B', text: 'A VPAT is the blank evaluation template published by ITI, whereas an ACR is the completed report detailing a specific product\'s conformance' },
          { id: 'C', text: 'A VPAT is legally binding under federal law while an ACR is an informal marketing document' },
          { id: 'D', text: 'An ACR is authored only by government regulators while a VPAT is created by lawyers' }
        ],
        answer: 'B',
        explanation: 'ITI publishes the blank VPAT template; once an organization fills it out with product-specific audit findings, it becomes an Accessibility Conformance Report (ACR).'
      },
      {
        id: 'kc-was-pro-2',
        question: 'When evaluating a vendor\'s submitted Accessibility Conformance Report (ACR), which of the following is a major red flag indicating potential "vendor greenwashing"?',
        options: [
          { id: 'A', text: 'The vendor discloses 3 known contrast issues with committed fix dates in their engineering roadmap' },
          { id: 'B', text: 'The vendor claims 100% "Supports" across all criteria using identical copy-pasted remarks with zero assistive technology testing notes' },
          { id: 'C', text: 'The vendor provides testing documentation conducted with NVDA and JAWS' },
          { id: 'D', text: 'The vendor completed the report using the modern VPAT 2.5 WCAG Edition' }
        ],
        answer: 'B',
        explanation: 'Claiming flawless 100% conformance across all criteria without specific testing notes or AT configurations is a classic hallmark of superficial or deceptive vendor greenwashing.'
      },
      {
        id: 'kc-was-pro-3',
        question: 'Why must enterprise contracts incorporate a binding Accessibility Remediation Service Level Agreement (SLA)?',
        options: [
          { id: 'A', text: 'To eliminate the need for the vendor to provide customer support' },
          { id: 'B', text: 'To legally obligate the vendor to fix newly discovered critical accessibility barriers within a defined timeframe (e.g. 30 days) at no extra cost' },
          { id: 'C', text: 'To prevent users from using screen magnification' },
          { id: 'D', text: 'To allow the vendor to increase licensing fees annually' }
        ],
        answer: 'B',
        explanation: 'Without an enforceable SLA, vendors have no contractual obligation to remediate accessibility defects post-deployment, leaving the customer organization legally exposed.'
      }
    ]
  },
  {
    id: 'mod-ads-testing-limitations',
    cert: 'ADS',
    domainId: 'ADS-D3',
    domainLabel: 'Domain 3: Auditing and Testing Document Accessibility',
    sectionId: 'ADS-D3-C',
    title: 'Limitations of Automated Testing & Assistive Tech Document Auditing',
    badge: 'Audit Limitations',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    interactiveType: 'automated-testing-limitations-lab',
    citation: 'IAAP ADS BoK 2021, Section 3.3 (Identify limitations of automated testing) & ISO 14289-1 (PDF/UA)',
    summary: 'Understand the strict boundary between automated PDF syntax validation (PAC, Acrobat Accessibility Checker) and genuine human accessibility. Discover why automated checkers catch only 30-40% of document barriers, leaving critical defects undetected: filename alt text, scrambled reading order, layout tables, and color contrast over complex raster images.',
    learningObjectives: [
      'Differentiate syntactic structural conformance (checked by automated tools) from semantic and cognitive usability.',
      'Identify the critical defects automated PDF validators pass as valid: filename alt text, layout tables, and scrambled multi-column reading order.',
      'Understand why automated PDF validators cannot reliably compute color contrast against raster photographs and background graphics.',
      'Execute manual assistive technology inspection protocols using screen readers (NVDA, JAWS) and keyboard navigation.',
      'Formulate a comprehensive document audit workflow integrating automated screening with mandatory manual inspection.'
    ],
    keyConcepts: [
      {
        title: 'The Illusion of the Automated Green Checkmark',
        explanation: 'Automated PDF checkers (like PAC 2024 or Acrobat Accessibility Checker) inspect only programmatically verifiable metadata: "Does an /Alt attribute exist on the tag?", "Does the table have a <TH> tag?", "Are heading levels sequential?". They cannot evaluate whether the alt text is accurate, whether reading order makes sense, or whether table headers are semantically related.'
      },
      {
        title: 'Filename & Nonsense Alt Text',
        explanation: 'If a complex bar chart has Alt="figure_2026_q3_final_v2.png", automated tools give it a 100% green checkmark because the attribute is populated. For a blind user, however, the image remains completely inaccessible and uninformative.'
      },
      {
        title: 'Reading Order & Content Stream Mismatches',
        explanation: 'Automated checkers verify that all content elements reside inside tags in the logical structure tree. They cannot detect if a multi-column article has been tagged across columns instead of down each column, causing sentences to interleave into gibberish.'
      },
      {
        title: 'Limitations on Visual Contrast',
        explanation: 'Automated tools cannot evaluate text contrast against complex background images, gradients, or photographs in PDF content streams. Contrast must be inspected manually using an eyedropper tool over worst-case pixel highlights.'
      }
    ],
    examTips: 'ADS Exam Alert: Remember that automated checkers can never certify a document as 100% accessible. A document that passes PAC with zero automated errors can still be completely unusable. Manual screen reader testing and human verification of reading order and alternative text are ALWAYS mandatory for true ISO 14289-1 compliance.',
    knowledgeCheck: [
      {
        id: 'kc-ads-lim-1',
        question: 'Why can an automated PDF accessibility checker (such as PAC) award a 100% pass rating to a document with useless image descriptions?',
        options: [
          { id: 'A', text: 'Automated checkers permanently disable image inspection to improve performance' },
          { id: 'B', text: 'Automated checkers verify only the mechanical presence of an alternative text attribute, not the semantic accuracy or usefulness of the description' },
          { id: 'C', text: 'ISO 14289-1 exempts images from accessibility requirements' },
          { id: 'D', text: 'Screen readers do not read alternative text in PDF files' }
        ],
        answer: 'B',
        explanation: 'Automated validators check syntax (e.g. "Is the /Alt key present and non-empty?"). They cannot evaluate whether "chart_v2.png" provides meaningful content to a human listener.'
      },
      {
        id: 'kc-ads-lim-2',
        question: 'Which critical document defect is virtually impossible for automated PDF validators to detect without manual human auditing?',
        options: [
          { id: 'A', text: 'Missing document title in Document Properties' },
          { id: 'B', text: 'An untagged heading skipping from H1 directly to H4' },
          { id: 'C', text: 'A multi-column newspaper layout whose reading order interleaves lines between columns instead of following column order' },
          { id: 'D', text: 'Missing document language tag (xml:lang)' }
        ],
        answer: 'C',
        explanation: 'Automated validators verify that text is enclosed in tags, but cannot assess whether the logical reading order matches the human visual reading sequence across multi-column layouts.'
      },
      {
        id: 'kc-ads-lim-3',
        question: 'Approximately what percentage of WCAG and PDF/UA accessibility requirements can be reliably and fully evaluated using automated testing tools alone?',
        options: [
          { id: 'A', text: '100% — modern AI checkers have fully replaced human auditors' },
          { id: 'B', text: 'Approximately 30% to 40% — the majority require human cognitive judgment and assistive technology verification' },
          { id: 'C', text: 'Less than 1%' },
          { id: 'D', text: '95% for government documents' }
        ],
        answer: 'B',
        explanation: 'Industry research and IAAP consensus indicate that automated testing tools reliably catch only 30% to 40% of potential accessibility barriers, leaving human evaluation mandatory for the remainder.'
      }
    ]
  },
  {
    id: 'mod-cpacc-regional-laws',
    cert: 'CPACC',
    domainId: 'CPACC-D3',
    domainLabel: 'Domain 3: Standards, Laws, and Management Strategies',
    sectionId: 'CPACC-D3-B',
    title: 'Regional & National Civil Rights Legislation (EU, US, Canada, UK, Japan)',
    badge: 'International Law',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    interactiveType: 'global-legal-compass-lab',
    citation: 'IAAP CPACC BoK V3, Domain 3.B (Regional Instruments), EAA Directive 2019/882, ADA Title II DOJ Final Rule 2024, ACA 2019 & EN 301 549',
    summary: 'Master the landscape of regional and national disability rights and digital accessibility statutes. Analyze the European Accessibility Act (EAA Directive 2019/882, June 2025 enforcement) and EN 301 549, the US Americans with Disabilities Act (2024 Title II DOJ final rule mandating WCAG 2.1 AA) and Section 508, Canada\'s ACA and AODA, the UK Equality Act 2010, and Japan\'s JIS X 8341-3.',
    learningObjectives: [
      'Distinguish the scope, deadlines, and technical standards of the European Accessibility Act (EAA Directive 2019/882) and EN 301 549.',
      'Analyze US legal mandates: ADA Title II (2024 DOJ final rule mandating WCAG 2.1 AA), ADA Title III commercial application, and Section 508.',
      'Understand Canadian federal and provincial frameworks: the Accessible Canada Act (ACA 2019) vs Ontario\'s AODA.',
      'Identify UK (Equality Act 2010, PSBAR 2018) and Japanese (JIS X 8341-3, 2024 private sector mandate) accessibility statutes.',
      'Compare civil rights / anti-discrimination frameworks against procurement and standard harmonization models.'
    ],
    keyConcepts: [
      {
        title: 'European Union Frameworks (EAA & EN 301 549)',
        explanation: 'The EU Web Accessibility Directive (2016/2102) covers public sector bodies. The European Accessibility Act (Directive 2019/882) expands mandatory compliance to the private commercial sector (e-commerce, online banking, e-books, transport, ATMs) with strict enforcement starting June 28, 2025. Technical standard EN 301 549 harmonizes requirements across all 27 EU member states.'
      },
      {
        title: 'United States Regulatory Evolution',
        explanation: 'The Americans with Disabilities Act (ADA 1990) contains Title II (state and local governments) and Title III (public accommodations). In April 2024, the DOJ issued a historic Final Rule under Title II explicitly adopting WCAG 2.1 Level AA as the mandatory technical standard for state/local websites and mobile apps. Section 508 of the Rehabilitation Act governs federal agencies and their ICT vendors.'
      },
      {
        title: 'Canadian Federal & Provincial Governance',
        explanation: 'The Accessible Canada Act (ACA 2019) aims for a barrier-free Canada by 2040, applying to federally regulated industries (telecoms, banking, transport). At the provincial level, Ontario\'s Accessibility for Ontarians with Disabilities Act (AODA 2005) mandates WCAG Level AA conformance for organizations with 50+ employees.'
      },
      {
        title: 'UK & Asia-Pacific Legal Instruments',
        explanation: 'The UK Equality Act 2010 mandates reasonable adjustments in goods, services, and employment, reinforced by the Public Sector Bodies Accessibility Regulations 2018 (PSBAR). In Japan, the Act on Elimination of Discrimination Against Persons with Disabilities (amended April 2024) mandates reasonable accommodation for private businesses, supported by technical standard JIS X 8341-3.'
      }
    ],
    examTips: 'CPACC Exam Alert: Be prepared for questions testing specific jurisdictional scopes: EAA = EU private commercial sector (June 28, 2025); EN 301 549 = EU ICT standard; DOJ Title II 2024 Rule = US state/local government mandating WCAG 2.1 AA; AODA = Ontario, Canada; ACA = Canadian federal sector.',
    knowledgeCheck: [
      {
        id: 'kc-cpacc-reg-1',
        question: 'Starting June 28, 2025, which European Union statute mandates accessibility for private sector e-commerce, banking, e-books, and ticketing services across all member states?',
        options: [
          { id: 'A', text: 'EU Web Accessibility Directive 2016/2102' },
          { id: 'B', text: 'European Accessibility Act (Directive 2019/882)' },
          { id: 'C', text: 'General Data Protection Regulation (GDPR)' },
          { id: 'D', text: 'Bologna Declaration' }
        ],
        answer: 'B',
        explanation: 'The European Accessibility Act (Directive 2019/882) applies directly to key consumer products and private sector digital services, with enforcement beginning June 28, 2025.'
      },
      {
        id: 'kc-cpacc-reg-2',
        question: 'In April 2024, the United States Department of Justice (DOJ) published a landmark Final Rule under ADA Title II. What technical standard does it officially codify for state and local government web content and mobile apps?',
        options: [
          { id: 'A', text: 'Section 508 legacy standards from 1998' },
          { id: 'B', text: 'W3C WCAG 2.1 Level AA' },
          { id: 'C', text: 'ISO 9001:2015' },
          { id: 'D', text: 'WCAG 1.0 Priority 1' }
        ],
        answer: 'B',
        explanation: 'The DOJ April 2024 Title II Final Rule officially established W3C WCAG 2.1 Level AA as the enforceable legal technical standard for state and municipal websites, mobile apps, and electronic documents.'
      },
      {
        id: 'kc-cpacc-reg-3',
        question: 'Which European standard specifies the functional accessibility requirements for ICT products and services, harmonizing WCAG 2.1 AA with non-web hardware, software, and kiosk technologies?',
        options: [
          { id: 'A', text: 'EN 301 549' },
          { id: 'B', text: 'ISO 14001' },
          { id: 'C', text: 'IEEE 802.11' },
          { id: 'D', text: 'DIN 5008' }
        ],
        answer: 'A',
        explanation: 'EN 301 549 is the European standard that maps WCAG 2.1 Level AA to web content, software, documents, and hardware in European procurement and regulatory contexts.'
      }
    ]
  },
  {
    id: 'mod-was-act-rules',
    cert: 'WAS',
    domainId: 'WAS-D2',
    domainLabel: 'Domain 2: Identifying Accessibility Issues in Web Solutions',
    sectionId: 'WAS-D2-D',
    title: 'Testing Tools for the Web & W3C ACT (Accessibility Conformance Testing) Rules',
    badge: 'ACT Rules & Testing Tools',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    interactiveType: 'act-rules-linter-lab',
    citation: 'IAAP WAS BoK 2024, Domain 2.D (Testing Tools for the Web and ACT Rules) & W3C ACT Rules Format 1.0',
    summary: 'Master automated and semi-automated testing tools and the W3C Accessibility Conformance Testing (ACT) Rules Format 1.0. Understand how ACT Rules harmonize testing engines (axe-core, ARC, Lighthouse) to produce transparent, reproducible results. Configure automated CI/CD accessibility gates, debug ACT test cases, and distinguish false positives from true defects.',
    learningObjectives: [
      'Explain the architecture and purpose of the W3C ACT Rules Format 1.0 in harmonizing web accessibility tools.',
      'Analyze the four structural components of an ACT Rule: Input Aspects, Applicability, Expectations, and Test Cases.',
      'Differentiate automated rules (deterministic), semi-automated checks (requiring human confirmation), and manual test requirements.',
      'Integrate automated rule engines (axe-core, linting plugins) into CI/CD build gates with severity thresholds.',
      'Identify and resolve common false positive and false negative scenarios generated by automated linters.'
    ],
    keyConcepts: [
      {
        title: 'What is an ACT Rule?',
        explanation: 'Different accessibility test engines historically interpreted WCAG criteria differently, causing the same webpage to pass in one tool and fail in another. The W3C ACT Rules Format 1.0 establishes vendor-neutral, unambiguous, algorithmic test definitions to standardize test results across all compliance engines.'
      },
      {
        title: 'ACT Structural Architecture',
        explanation: 'An ACT Rule specifies: (1) Input Aspects (DOM tree, CSS styling, Accessibility Tree), (2) Applicability (the exact CSS/DOM conditions identifying test targets), (3) Expectations (what properties must be true for the target to pass), and (4) Test Cases (passed, failed, and inapplicable examples).'
      },
      {
        title: 'Automated vs Semi-Automated vs Manual',
        explanation: 'Fully automated tests are 100% deterministic (e.g. checking whether an <img> tag has an alt attribute or calculating contrast ratio). Semi-automated tools flag items for human verification (e.g. "Does this alt text accurately describe the chart?"). Manual testing evaluates cognitive flow, reading order, and complex custom widget interactions.'
      },
      {
        title: 'CI/CD Build Gates & Regression Prevention',
        explanation: 'Embedding automated linters (e.g. axe-core in Playwright/Cypress/Jest) into continuous integration prevents accessibility regressions from merging into production. Build gates should block PRs on Critical and Serious violations.'
      }
    ],
    examTips: 'WAS Exam Alert: Remember that automated tools alone can only evaluate ~30-40% of WCAG criteria. Automated tools excel at catching syntax flaws (missing attributes, duplicate IDs, invalid ARIA attributes, color contrast math), but CANNOT evaluate subjective or semantic criteria (e.g. alt text quality, focus logical order, clear heading wording).',
    knowledgeCheck: [
      {
        id: 'kc-was-act-1',
        question: 'What is the primary objective of the W3C Accessibility Conformance Testing (ACT) Rules Format 1.0?',
        options: [
          { id: 'A', text: 'To replace WCAG 2.2 with a brand new set of legal criteria' },
          { id: 'B', text: 'To provide vendor-neutral, unambiguous test definitions so different automated testing tools and human auditors evaluate accessibility criteria consistently' },
          { id: 'C', text: 'To mandate that all websites be rewritten in Python' },
          { id: 'D', text: 'To eliminate the need for any human manual auditing' }
        ],
        answer: 'B',
        explanation: 'The W3C ACT Rules Format standardizes testing procedures across different software engines (like axe-core, QualWeb, ARC) so that compliance determinations are consistent and reproducible.'
      },
      {
        id: 'kc-was-act-2',
        question: 'Which structural component of a W3C ACT Rule identifies the exact conditions and DOM elements that must be evaluated by the rule?',
        options: [
          { id: 'A', text: 'Input Aspects' },
          { id: 'B', text: 'Applicability' },
          { id: 'C', text: 'Expectations' },
          { id: 'D', text: 'Conformance Claims' }
        ],
        answer: 'B',
        explanation: 'The Applicability section of an ACT Rule defines the specific characteristics (such as tag names, attributes, or CSS states) that qualify an element for evaluation by the rule.'
      },
      {
        id: 'kc-was-act-3',
        question: 'Why is automated accessibility testing in CI/CD pipelines considered necessary but insufficient for complete WCAG compliance?',
        options: [
          { id: 'A', text: 'Automated testing cannot run in continuous integration servers' },
          { id: 'B', text: 'Automated test tools reliably test only deterministic syntax and math (approximately 30-40% of criteria), leaving semantic, cognitive, and narrative usability to human evaluation' },
          { id: 'C', text: 'Automated tests are prohibited under Section 508' },
          { id: 'D', text: 'Screen readers automatically crash when automated tests are running' }
        ],
        answer: 'B',
        explanation: 'Automated engines easily evaluate deterministic rules (like contrast ratios and missing labels), but cannot evaluate semantic validity, reading order flow, or manual assistive technology compatibility.'
      }
    ]
  },
  {
    id: 'mod-ads-acrobat-touchup',
    cert: 'ADS',
    domainId: 'ADS-D2',
    domainLabel: 'Domain 2: Remediating Electronic Documents',
    sectionId: 'ADS-D2-C',
    title: 'PDF Final Format Remediation in Adobe Acrobat Pro',
    badge: 'Final Format Remediation',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    interactiveType: 'acrobat-tags-table-editor-lab',
    citation: 'IAAP ADS BoK 2021, Section 2.3 (Remediate in final format) & ISO 14289-1 (PDF/UA)',
    summary: 'Remediate accessibility defects directly in final format PDFs using Adobe Acrobat Pro when source authoring files are unavailable. Master the Acrobat Tags Tree, Reading Order Tool, and Table Editor. Remediate multi-column cell spans (ColSpan/RowSpan), artifact decorative page furniture, repair unassociated link annotations, and resolve content stream mismatches.',
    learningObjectives: [
      'Navigate and restructure the logical structure tree in Adobe Acrobat Pro\'s Tags Navigation Pane.',
      'Configure multi-column and multi-row header cell spans (ColSpan, RowSpan) and scope attributes using the Acrobat Table Editor.',
      'Utilize the Reading Order Tool to mark decorative lines, background shapes, and running footers as /Artifact.',
      'Repair broken interactive hyperlinks by associating link annotations with semantic <Link> tags and child /OBJR objects.',
      'Resolve reading order discrepancies between the visual document stream, Reading Order panel, and logical Tag Tree.'
    ],
    keyConcepts: [
      {
        title: 'Final Format Remediation When Source is Missing',
        explanation: 'While source-level remediation (in Word or InDesign) is preferred, accessibility specialists frequently receive legacy PDFs where source files are lost, locked, or proprietary. In these scenarios, complete PDF/UA conformance must be achieved directly in Adobe Acrobat Pro or dedicated PDF tag editors.'
      },
      {
        title: 'Acrobat Table Editor & Cell Properties',
        explanation: 'Data tables with merged cells frequently fail PAC automated checks ("Irregular table structure"). In Acrobat Pro, remediators use the Table Editor to inspect cell properties, changing cells from <TD> to <TH>, specifying Scope (Row or Column), and declaring multi-cell spanning (ColSpan="2" or RowSpan="2").'
      },
      {
        title: 'Artifacting Page Furniture',
        explanation: 'Headers and footers (e.g. "Page 4 of 24", chapter titles, decorative rules) repeated across every page interrupt screen reader reading flow. Using Acrobat\'s Reading Order tool, remediators select these elements and click "Background / Artifact" to remove them from the tag tree while preserving visual appearance.'
      },
      {
        title: 'Link Annotations & the /OBJR Dictionary',
        explanation: 'In PDF architecture, visual link text (e.g. "Visit our portal") and the interactive click rectangle (/Link annotation) exist as separate objects in the PDF stream. For a link to be accessible under ISO 14289-1, the visual text must be enclosed in a <Link> tag, and the interactive annotation must be attached as an Object Reference (/OBJR) child tag.'
      }
    ],
    examTips: 'ADS Exam Alert: Remember the distinction between the visual Reading Order panel (often called TouchUp Reading Order or TURO) and the logical Tags Tree. Screen readers read from the TAGS TREE. Never rely on the Reading Order panel alone to verify reading order — always verify the hierarchy in the Tags navigation pane.',
    knowledgeCheck: [
      {
        id: 'kc-ads-acro-1',
        question: 'In Adobe Acrobat Pro, which tool must be used to configure ColSpan and RowSpan attributes for header cells that span multiple columns or rows in a data table?',
        options: [
          { id: 'A', text: 'The TouchUp Text Tool' },
          { id: 'B', text: 'The Table Editor (accessible via Table Cell Properties)' },
          { id: 'C', text: 'The Optical Character Recognition (OCR) Engine' },
          { id: 'D', text: 'The Preflight Color Profiler' }
        ],
        answer: 'B',
        explanation: 'The Acrobat Table Editor allows remediators to right-click individual table cells and set Table Cell Properties, including Header vs Data type, Scope, and Column/Row Span counts.'
      },
      {
        id: 'kc-ads-acro-2',
        question: 'Under ISO 14289-1 (PDF/UA), what must be done with repetitive running headers and page number footers in Adobe Acrobat Pro?',
        options: [
          { id: 'A', text: 'They must be tagged as <H1> headings on every single page' },
          { id: 'B', text: 'They must be marked as /Artifact so screen readers ignore them and read the main document body uninterrupted' },
          { id: 'C', text: 'They must be deleted completely from the visual page' },
          { id: 'D', text: 'They must be converted into high-resolution bitmap graphics' }
        ],
        answer: 'B',
        explanation: 'Running headers and footers are pagination furniture that disrupt text reading flow. Marking them as an /Artifact removes them from the screen reader speech stream while preserving print aesthetics.'
      },
      {
        id: 'kc-ads-acro-3',
        question: 'Why does an underlined hyperlink in a PDF sometimes fail to work for screen reader users even though it is visually blue and clickable with a mouse?',
        options: [
          { id: 'A', text: 'Screen readers cannot navigate internet URLs' },
          { id: 'B', text: 'The interactive /Link annotation in the PDF content stream is missing an Object Reference (/OBJR) child tag inside the semantic <Link> structure tag' },
          { id: 'C', text: 'PDF links only work on macOS operating systems' },
          { id: 'D', text: 'The document author did not pay the Adobe licensing fee' }
        ],
        answer: 'B',
        explanation: 'In PDF architecture, the visual text and the interactive link rectangle are distinct objects. Unless the link annotation is linked to the <Link> tag via an /OBJR tag, screen readers treat the text as plain un-clickable text.'
      }
    ]
  },
  {
    id: 'mod-cpacc-treaties',
    cert: 'CPACC',
    domainId: 'CPACC-D3',
    domainLabel: 'Domain 3: Standards, Laws & Management',
    sectionId: 'CPACC-D3-A',
    sectionLabel: 'International Declarations and Conventions on Disability Rights',
    citation: 'IAAP CPACC BoK V3, Domain 3.A (International Declarations and Conventions on Disability Rights), UN CRPD (Articles 9 & 21) & Marrakesh Treaty (WIPO 2013)',
    title: 'UN CRPD & International Human Rights Conventions',
    summary: 'Master the international legal bedrock of disability rights: UN CRPD Article 9 (Accessibility), Article 21 (Freedom of Expression & Information), the Marrakesh Treaty (WIPO 2013), and the UDHR human-rights framework.',
    duration: '22 mins',
    level: 'Core',
    interactiveType: 'uncrpd-treaty-explorer-lab',
    learningObjectives: [
      'Analyze the legal obligations created by UN CRPD Article 9 for physical, transportation, and ICT accessibility.',
      'Distinguish how UN CRPD Article 9.2(b) obligates States Parties to ensure private sector public services are accessible.',
      'Apply UN CRPD Article 21 regarding the provision of public information in accessible formats in a timely manner and without additional cost.',
      'Evaluate the Marrakesh Treaty (WIPO 2013) provisions creating copyright exceptions and authorizing cross-border exchange of accessible works by Authorized Entities.'
    ],
    keyConcepts: [
      {
        title: 'UN CRPD Article 9: Accessibility Across Society',
        explanation: 'Requires States Parties to enable persons with disabilities to live independently and participate fully in all aspects of life by ensuring equal access to the physical environment, transportation, information and communications (including ICT systems), and other public facilities and services in urban and rural areas.'
      },
      {
        title: 'UN CRPD Article 21: Freedom of Expression & Prohibition of Surcharges',
        explanation: 'Guarantees freedom to seek, receive and impart information through all forms of communication of choice. Article 21(a) explicitly mandates that public information must be provided in accessible formats and technologies in a timely manner and WITHOUT ADDITIONAL COST, outlawing disability surcharges.'
      },
      {
        title: 'The Marrakesh Treaty (WIPO 2013): Ending the Global Book Famine',
        explanation: 'Administered by WIPO, the Marrakesh Treaty requires contracting parties to create mandatory copyright exceptions permitting Authorized Entities (libraries, schools, NGOs) to convert published books into accessible formats without rights-holder royalties, and authorizes cross-border import and export between member states.'
      },
      {
        title: 'The Human Rights Model vs Medical & Charity Paradigms',
        explanation: 'Rooted in the Universal Declaration of Human Rights (UDHR 1948), modern international law views accessibility not as medical rehabilitation or discretionary charity, but as an inalienable, legally enforceable human right rooted in personal autonomy and non-discrimination.'
      }
    ],
    practicalTakeaways: [
      'International treaties like the UN CRPD set the constitutional mandate that directs national laws like the European Accessibility Act and Section 508.',
      'Charging extra fees for accessible formats (braille, transcripts, large print) is explicitly prohibited under Article 21.',
      'Authorized entities can legally share accessible books across borders between Marrakesh Treaty contracting parties without paying copyright royalties.'
    ],
    knowledgeCheck: [
      {
        id: 'kc-cpacc-treaty-1',
        question: 'Under UN CRPD Article 9.2(b), what obligation do States Parties have regarding private commercial companies that provide public services (such as e-commerce or private transportation)?',
        options: [
          { id: 'A', text: 'Private companies are completely exempt from all CRPD obligations' },
          { id: 'B', text: 'States Parties must take appropriate measures to ensure that private entities that offer facilities and services to the public take into account all aspects of accessibility' },
          { id: 'C', text: 'Private companies are only regulated if they receive more than 90% direct UN funding' },
          { id: 'D', text: 'Private entities may replace accessible websites with printed paper brochures upon written request' }
        ],
        answer: 'B',
        explanation: 'CRPD Article 9.2(b) explicitly requires States Parties to enact measures ensuring private entities offering public facilities and services take into account all aspects of accessibility for persons with disabilities.'
      },
      {
        id: 'kc-cpacc-treaty-2',
        question: 'What primary barrier to accessible literature does the Marrakesh Treaty (WIPO 2013) address?',
        options: [
          { id: 'A', text: 'It bans all printed paper books worldwide to encourage digital adoption' },
          { id: 'B', text: 'It creates copyright exceptions allowing authorized entities to produce accessible format copies and exchange them across international borders without publisher authorization' },
          { id: 'C', text: 'It requires authors to write books only in Simplified English' },
          { id: 'D', text: 'It sets a mandatory minimum price of $50 for all audiobooks' }
        ],
        answer: 'B',
        explanation: 'The Marrakesh Treaty specifically eliminates legal copyright barriers that previously prevented libraries and non-profits from converting copyrighted books into Braille, audiobooks, and DAISY formats and sharing them across international borders.'
      },
      {
        id: 'kc-cpacc-treaty-3',
        question: 'A state transportation authority charges passengers with disabilities an extra $10 administrative fee to receive monthly schedule updates in large print or Braille. Which international treaty clause is violated?',
        options: [
          { id: 'A', text: 'UN CRPD Article 21(a), which mandates accessible formats in a timely manner and without additional cost' },
          { id: 'B', text: 'Berne Convention Article 7 on copyright terms' },
          { id: 'C', text: 'Geneva Convention Protocol IV' },
          { id: 'D', text: 'No violation exists as long as the fee covers material paper costs' }
        ],
        answer: 'A',
        explanation: 'UN CRPD Article 21(a) explicitly prohibits charging persons with disabilities extra fees for accessible formats of public information, requiring information to be provided in accessible formats "in a timely manner and without additional cost".'
      }
    ]
  },
  {
    id: 'mod-was-interoperability',
    cert: 'WAS',
    domainId: 'WAS-D2',
    domainLabel: 'Domain 2: Identifying Accessibility Issues in Web Solutions',
    sectionId: 'WAS-D2-A',
    sectionLabel: 'Interoperability and Compatibility Issues',
    citation: 'IAAP WAS BoK 2024, Domain 2.A (Interoperability and Compatibility Issues), W3C ARIA in HTML & Platform Accessibility APIs (IA2/UIA/NSAccessibility)',
    title: 'Screen Reader & Browser Interoperability Matrix',
    summary: 'Explore how HTML and WAI-ARIA translate through platform accessibility APIs (IAccessible2, UI Automation, NSAccessibility, Android) into screen reader speech, and troubleshoot cross-browser quirks.',
    duration: '25 mins',
    level: 'Advanced',
    interactiveType: 'cross-browser-compatibility-lab',
    learningObjectives: [
      'Map the assistive technology processing pipeline: DOM/ARIA -> Browser Engine -> Platform Accessibility API -> Screen Reader.',
      'Compare core screen reader / browser baselines: NVDA + Firefox, JAWS + Chrome/Edge, VoiceOver + Safari, TalkBack + Chrome.',
      'Diagnose virtual buffer (Browse Mode) versus direct application (Focus Mode) switching in desktop Windows screen readers.',
      'Remediate platform-specific anomalies such as WebKit/VoiceOver live region double-speech and Android AccessibilityNodeInfo touch event drops.'
    ],
    keyConcepts: [
      {
        title: 'The Accessibility API Translation Pipeline',
        explanation: 'Web accessibility functions through an architectural chain: Authors write HTML/ARIA -> Browser engines (Blink, Gecko, WebKit) construct an Accessibility Tree -> Platform APIs (IAccessible2, UI Automation, NSAccessibility) expose nodes -> Screen readers query nodes and generate speech or Braille.'
      },
      {
        title: 'Standard Screen Reader & Browser Testing Baselines',
        explanation: 'Web applications must be tested against standard industry pairings: NVDA + Firefox (Gecko / IA2), JAWS + Chrome or Edge (Blink / UIA), VoiceOver + Safari (WebKit / NSAccessibility on macOS/iOS), and TalkBack + Chrome (Android Accessibility Framework).'
      },
      {
        title: 'Browse Mode (Virtual Buffer) vs Focus Mode',
        explanation: 'Windows screen readers (NVDA & JAWS) maintain an off-screen virtual buffer (Browse Mode) intercepting arrow keys for text navigation. Entering an editable input or composite widget (role="grid", role="tablist") switches the screen reader into Focus Mode, passing keystrokes directly to the web page.'
      },
      {
        title: 'Common Interoperability Pitfalls & Best Practices',
        explanation: 'Examples include: VoiceOver double-announcing aria-live regions when parent nodes are replaced in the DOM, JAWS failing to report listbox selection without aria-activedescendant, and mobile touch targets failing unless semantic button roles and actions are declared.'
      }
    ],
    practicalTakeaways: [
      'Always test with standard pairings: NVDA with Firefox, JAWS with Chrome or Edge, VoiceOver with Safari on macOS/iOS, and TalkBack with Chrome on Android.',
      'When building composite interactive widgets (grids, tabs, toolbars), manage roving tabIndex and widget roles to trigger automatic switch from Browse Mode to Focus Mode.',
      'Never re-create aria-live container elements in the DOM; keep the container static and mutate only its inner text to prevent duplicate speech announcements in WebKit.'
    ],
    knowledgeCheck: [
      {
        id: 'kc-was-interop-1',
        question: 'When navigating an interactive data spreadsheet with arrow keys in NVDA on Firefox, pressing the Down Arrow reads the next word of text instead of moving to the next spreadsheet cell. Why does this occur?',
        options: [
          { id: 'A', text: 'NVDA is currently operating in Browse Mode (Virtual Buffer), intercepting arrow keys for document reading rather than Focus Mode' },
          { id: 'B', text: 'Mozilla Firefox does not support JavaScript keystroke listeners' },
          { id: 'C', text: 'The user has enabled Windows Speech Recognition by mistake' },
          { id: 'D', text: 'The monitor refresh rate is lower than 60Hz' }
        ],
        answer: 'A',
        explanation: 'In Browse Mode, Windows screen readers intercept navigation keys to browse static document text. To allow web application keystrokes, the widget must implement role="grid" or role="application" with roving tabindex so NVDA automatically switches into Focus Mode.'
      },
      {
        id: 'kc-was-interop-2',
        question: 'A live search results box with aria-live="polite" produces duplicate spoken announcements in VoiceOver on Safari every time a query is executed. What coding anti-pattern is responsible?',
        options: [
          { id: 'A', text: 'The developer completely removes and re-creates the entire <div aria-live="polite"> element in the DOM on each search update' },
          { id: 'B', text: 'The CSS font size is too small' },
          { id: 'C', text: 'VoiceOver on Safari only allows aria-live="assertive"' },
          { id: 'D', text: 'The search box is using an HTML5 <input type="search">' }
        ],
        answer: 'A',
        explanation: 'In WebKit/VoiceOver, replacing a DOM element that contains aria-live triggers both a node insertion utterance and a live region text change utterance. To avoid duplicate speech, keep the live region container permanently in the DOM and mutate only its text content.'
      },
      {
        id: 'kc-was-interop-3',
        question: 'Which underlying platform accessibility API does VoiceOver interface with on macOS?',
        options: [
          { id: 'A', text: 'NSAccessibility' },
          { id: 'B', text: 'Microsoft UI Automation (UIA)' },
          { id: 'C', text: 'Linux AT-SPI2' },
          { id: 'D', text: 'IAccessible2' }
        ],
        answer: 'A',
        explanation: 'On macOS, Safari and other applications communicate with assistive technologies like VoiceOver through Apple\'s native NSAccessibility API (and UIAccessibility on iOS).'
      }
    ]
  },
  {
    id: 'mod-ads-manual-testing',
    cert: 'ADS',
    domainId: 'ADS-D3',
    domainLabel: 'Domain 3: Auditing & Testing Documents',
    sectionId: 'ADS-D3-B',
    sectionLabel: '3.2 Identify and run manual testing processes',
    citation: 'IAAP ADS BoK 2021, Section 3.2 (Identify and run manual testing processes), ISO 14289-1 (PDF/UA-1) & Matterhorn Protocol 1.1',
    title: 'Manual PDF Accessibility Testing & Reflow Protocol',
    summary: 'Execute rigorous manual document testing protocols beyond automated PAC checks: Adobe Acrobat Reflow Mode (Ctrl+4), Screen Reader Quick Keys navigation (H, T, L), Initial View title bar display, and High Contrast inversion.',
    duration: '24 mins',
    level: 'Professional',
    interactiveType: 'manual-document-audit-protocol-lab',
    learningObjectives: [
      'Verify logical reading order and multi-column linear flow using Adobe Acrobat Reflow Mode (Ctrl+4 / Cmd+4) at 400% zoom.',
      'Audit semantic document structure using screen reader quick navigation keys (H for Headings, T for Tables, L for Links) under Matterhorn Protocol.',
      'Inspect Document Properties (Ctrl+D) Initial View window options to guarantee the Document Title displays in the application title bar.',
      'Test visual readability and artifact transparency under OS High Contrast and color inversion modes.'
    ],
    keyConcepts: [
      {
        title: 'Why Automated Testing Is Insufficient for PDF',
        explanation: 'Automated validators (like Acrobat Accessibility Checker or PAC 2024) can verify syntax—confirming that tags exist and alt text strings are non-empty. However, they CANNOT evaluate whether reading order is logical, whether heading hierarchies make sense, or whether alt text accurately describes the image.'
      },
      {
        title: 'Acrobat Reflow Mode (Ctrl+4 / Cmd+4)',
        explanation: 'Reflow mode temporarily displays the PDF as a single responsive column at high magnification. It strips visual styling and linearizes content strictly according to the logical tag tree order, instantly exposing out-of-sequence callout boxes, disjointed columns, and overlapping text.'
      },
      {
        title: 'Screen Reader Quick Keys Navigation (H, T, L)',
        explanation: 'Testing in NVDA or JAWS with single-letter navigation keys (H for Headings, T for Tables, L for Links) allows auditors to experience how users skim documents, verifying that heading levels are not skipped (e.g., H1 directly to H4) and table headers are correctly announced.'
      },
      {
        title: 'Initial View Document Title & High Contrast Verification',
        explanation: 'Under ISO 14289-1 (Matterhorn Protocol 06-001) and WCAG 2.4.2, the PDF /ViewerPreferences must specify /DisplayDocTitle true so the title bar presents a meaningful title rather than cryptic filenames. Testing under High Contrast mode ensures decorative vectors marked as artifacts do not invert into opaque blocks that conceal text.'
      }
    ],
    practicalTakeaways: [
      'Automated validators cannot verify whether reading order makes sense; Reflow mode at 400% is the fastest manual check for reading order sequence.',
      'Acrobat Document Properties Initial View must have "Show: Document Title" selected, or browsers will display cryptic server filenames instead of accessible titles.',
      'Ensure decorative shapes and lines are tagged as /Artifact so they do not render as opaque solid white blocks in high-contrast inverted modes.'
    ],
    knowledgeCheck: [
      {
        id: 'kc-ads-manual-1',
        question: 'Which key shortcut activates Reflow mode in Adobe Acrobat Pro on Windows to manually inspect responsive reading order at high magnification?',
        options: [
          { id: 'A', text: 'Ctrl + 4' },
          { id: 'B', text: 'Ctrl + Alt + Delete' },
          { id: 'C', text: 'F12' },
          { id: 'D', text: 'Shift + Esc' }
        ],
        answer: 'A',
        explanation: 'In Adobe Acrobat Pro, pressing Ctrl+4 (or Cmd+4 on macOS) activates Reflow mode (View -> Zoom -> Reflow), which linearizes tagged content into a single column.'
      },
      {
        id: 'kc-ads-manual-2',
        question: 'A PDF passes PAC 2024 automated validation with zero errors. However, when opened in Adobe Acrobat, the window title displays "FIN_DRAFT_DOC_REV8_FINAL.pdf". How do you resolve this under WCAG 2.4.2 and Matterhorn Protocol 06-001?',
        options: [
          { id: 'A', text: 'Open Document Properties (Ctrl+D) -> Initial View tab -> Set "Show" under Window Options to "Document Title", then save the PDF' },
          { id: 'B', text: 'Delete the PDF metadata entirely' },
          { id: 'C', text: 'Change the screen resolution to 4K' },
          { id: 'D', text: 'Rename the file in Windows Explorer without opening Acrobat' }
        ],
        answer: 'A',
        explanation: 'In Adobe Acrobat Document Properties (Ctrl+D), the Initial View tab includes Window Options. Setting "Show" to "Document Title" configures the PDF viewer preferences to display the title metadata instead of the file name in the application window bar.'
      },
      {
        id: 'kc-ads-manual-3',
        question: 'During manual screen reader testing of a PDF table with NVDA, pressing "T" jumps to the table, but the screen reader does not announce column headers when pressing Ctrl+Alt+Arrow keys. What manual remediation in the Acrobat Tags Tree is needed?',
        options: [
          { id: 'A', text: 'Ensure header cells are tagged as <TH> rather than <TD>, and verify Scope (Column/Row) or ID/Headers associations are declared in Table Cell Properties' },
          { id: 'B', text: 'Delete the entire table and replace it with a screenshot of the table' },
          { id: 'C', text: 'Turn off the screen reader volume' },
          { id: 'D', text: 'Change the table font color to yellow' }
        ],
        answer: 'A',
        explanation: 'Screen readers require explicit <TH> tags with proper Scope attributes (Column or Row) to associate header text with data cells during cell-by-cell navigation.'
      }
    ]
  }
];

export function getModulesByTrack(track = 'all') {
  if (track === 'all') return LEARNING_MODULES;
  return LEARNING_MODULES.filter(m => m.cert.toLowerCase() === track.toLowerCase());
}

export function getModuleById(id) {
  return LEARNING_MODULES.find(m => m.id === id) || null;
}
