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
  }
];

export function getModulesByTrack(track = 'all') {
  if (track === 'all') return LEARNING_MODULES;
  return LEARNING_MODULES.filter(m => m.cert.toLowerCase() === track.toLowerCase());
}

export function getModuleById(id) {
  return LEARNING_MODULES.find(m => m.id === id) || null;
}
