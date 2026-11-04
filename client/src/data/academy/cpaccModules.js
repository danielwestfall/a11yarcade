// IAAP CPACC (Certified Professional in Accessibility Core Competencies) Modules
export const CPACC_MODULES = [
  {
    "id": "mod-cpacc-models",
    "cert": "CPACC",
    "domainId": "CPACC-D1",
    "domainLabel": "Domain 1: Disabilities, Challenges & Assistive Tech",
    "sectionId": "CPACC-D1-A",
    "title": "Theoretical Models of Disability",
    "badge": "Core Competency",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "interactiveType": "model-classifier",
    "citation": "CPACC BoK V3, Section 1.1 (Theoretical Models)",
    "summary": "Analyze how society conceives disability across Medical, Social, Biopsychosocial, Functional, Charity, and Human Rights frameworks. Understand why the Social Model is the cornerstone of modern accessibility.",
    "learningObjectives": [
      "Distinguish between the Medical Model (deficit in individual) and Social Model (barriers created by environment).",
      "Understand the Biopsychosocial synthesis adopted by the World Health Organization (WHO ICF).",
      "Identify Functional Solutions, Charity/Tragedy, and Human Rights models in real-world policies and public campaigns."
    ],
    "keyConcepts": [
      {
        "title": "Social Model of Disability",
        "explanation": "Disability is not an inherent trait of a person; it is caused by the way society is organized. Environmental, physical, digital, and attitudinal barriers prevent people with impairments from participating equally."
      },
      {
        "title": "Medical Model",
        "explanation": "Views disability as a pathology, deficit, or medical problem residing solely within the individual. The primary goal is curing or fixing the person to fit into an unyielding society."
      },
      {
        "title": "Biopsychosocial Model (WHO ICF)",
        "explanation": "Integrates biological impairments, individual psychology, and social participation restrictions. Recognized by the World Health Organization as the comprehensive standard."
      },
      {
        "title": "Functional Solutions Model",
        "explanation": "Focuses pragmatically on using technology, engineering, and accommodations to overcome limitations, regardless of socio-political debates."
      },
      {
        "title": "Charity / Tragedy Model",
        "explanation": "Views disabled people as victims deserving pity, inspiration, or charity. Widely rejected by disability rights advocates because it strips individuals of agency and rights."
      }
    ],
    "examTips": "IAAP exam scenarios often ask: \"An employee cannot access a second-floor office because there is no elevator. How does the social model view this?\" The answer is always that the building's architectural barrier disables the person, not their wheelchair.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-1",
        "question": "Under the Social Model of Disability, what is considered the primary cause of disability?",
        "options": [
          {
            "id": "A",
            "text": "Barriers created by societal structures, physical environments, and systemic attitudes"
          },
          {
            "id": "B",
            "text": "Biological pathology and physiological impairments residing within the person's body"
          },
          {
            "id": "C",
            "text": "Economic dependency resulting from public assistance programs and welfare structures"
          },
          {
            "id": "D",
            "text": "Insufficient personal effort toward physical rehabilitation and functional compensation"
          }
        ],
        "answer": "A",
        "explanation": "The Social Model locates disability in societal barriers (inaccessible architecture, digital systems, and systemic attitudes), whereas the Medical Model focuses on biological pathology and physiological impairments within the person, and economic or rehabilitation paradigms focus on welfare dependency or personal functional compensation."
      },
      {
        "id": "kc-cpacc-2",
        "question": "Which model of disability combines biological factors, individual psychological experiences, and social context into an integrated framework adopted by the WHO?",
        "options": [
          {
            "id": "A",
            "text": "The Biopsychosocial Model integrating biological, personal, and social contexts"
          },
          {
            "id": "B",
            "text": "The Functional Solutions Model addressing pragmatic engineering accommodations"
          },
          {
            "id": "C",
            "text": "The Economic Productivity Paradigm measuring workplace vocational output"
          },
          {
            "id": "D",
            "text": "The Charity Framework portraying individuals as recipients of philanthropic care"
          }
        ],
        "answer": "A",
        "explanation": "The Biopsychosocial Model (used in the WHO ICF) synthesizes biological, personal, and social dimensions, unlike the Functional Solutions Model (which focuses on pragmatic engineering accommodations), the Economic Productivity Paradigm (workplace vocational output), or the Charity Framework (philanthropic care)."
      },
      {
        "id": "kc-cpacc-3",
        "question": "A telethon portrays people with disabilities as tragic victims who depend on the generosity of benefactors. Which model does this reflect?",
        "options": [
          {
            "id": "A",
            "text": "The Charity / Tragedy Model depicting disabled persons as victims requiring pity"
          },
          {
            "id": "B",
            "text": "The Social Model advocating systemic barrier removal and environmental access"
          },
          {
            "id": "C",
            "text": "The Human Rights Model affirming inherent dignity and equal legal participation"
          },
          {
            "id": "D",
            "text": "The Universal Design Model developing flexible environments usable across broad populations"
          }
        ],
        "answer": "A",
        "explanation": "The Charity / Tragedy Model portrays disabled people as pitiful victims needing benevolence, contrasting with the Social Model (systemic barrier removal), the Human Rights Model (inherent dignity and equal legal participation), and Universal Design (flexible environments for diverse populations)."
      }
    ]
  },
  {
    "id": "mod-cpacc-categories",
    "cert": "CPACC",
    "domainId": "CPACC-D1",
    "domainLabel": "Domain 1: Disabilities, Challenges & Assistive Tech",
    "sectionId": "CPACC-D1-B",
    "title": "Disability Categories, Barriers & Assistive Tech",
    "badge": "Core Competency",
    "difficulty": "Beginner",
    "estimatedMinutes": 10,
    "interactiveType": "vision-contrast-simulator",
    "citation": "CPACC BoK V3, Section 1.2 (Categories & Barriers)",
    "summary": "Explore the major disability categories: Visual, Auditory, Physical/Motor, Cognitive/Learning, Speech, and Deafblindness. Test how color blindness, cataracts, and tunnel vision affect visual perception.",
    "learningObjectives": [
      "Identify the spectrum of visual impairments (low vision, color blindness, total blindness) and adaptive strategies.",
      "Recognize auditory barriers and solutions including CART, closed captions, and sign language interpreters.",
      "Understand motor barriers (tremors, paralysis, limited dexterity) and input devices like switches, eye gaze, and head pointers.",
      "Analyze cognitive accessibility barriers including complex language, memory load, and unpredictable layout changes."
    ],
    "keyConcepts": [
      {
        "title": "Visual Disabilities Spectrum",
        "explanation": "Includes low vision (acuity < 20/70), total blindness, tunnel vision (glaucoma), central vision loss (macular degeneration), cataracts (blur/glare), and color vision deficiencies (Protanopia, Deuteranopia, Tritanopia)."
      },
      {
        "title": "Auditory Disabilities",
        "explanation": "Deaf, hard of hearing, and deafblindness. Requires synchronized captioning (WCAG 1.2.2), audio descriptions, transcripts, and plain language."
      },
      {
        "title": "Cognitive & Neurodiversity",
        "explanation": "Dyslexia, ADHD, autism, intellectual disabilities, and dementia. Accommodated by clear visual hierarchy, distraction-free reading, predictable navigation, and adjustable timers."
      },
      {
        "title": "Temporary & Situational Disabilities",
        "explanation": "Disabilities are not only permanent. A broken arm is temporary; glare on a phone in sunlight or holding a baby while cooking is situational."
      }
    ],
    "examTips": "Remember Microsoft’s Inclusive Design persona spectrum: Permanent (one arm), Temporary (arm in cast), Situational (holding groceries). Solutions designed for permanent disabilities benefit everyone!",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-cat-1",
        "question": "Which of the following is an example of a situational disability?",
        "options": [
          {
            "id": "A",
            "text": "A commuter trying to understand a video on a noisy train without earphones"
          },
          {
            "id": "B",
            "text": "A university graduate student with a long-term clinical dyslexia diagnosis"
          },
          {
            "id": "C",
            "text": "A software programmer whose fractured dominant arm is immobilized in a cast"
          },
          {
            "id": "D",
            "text": "A bank employee who has bilateral sensorineural deafness from early childhood"
          }
        ],
        "answer": "A",
        "explanation": "A commuter on a noisy train experiences a temporary, situational auditory barrier caused by the environment, unlike permanent congenital sensorineural deafness, a long-term clinical dyslexia diagnosis, or a temporary physical injury such as a fractured arm immobilized in a cast."
      },
      {
        "id": "kc-cpacc-cat-2",
        "question": "What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against its background?",
        "options": [
          {
            "id": "A",
            "text": "4.5:1 for standard body text (and 3:1 for large text 18pt+ or 14pt+ bold)"
          },
          {
            "id": "B",
            "text": "3:1 for text elements regardless of typography weight or font size metrics"
          },
          {
            "id": "C",
            "text": "7:1 for body copy across standard consumer digital web interfaces"
          },
          {
            "id": "D",
            "text": "2:1 for body copy provided decorative elements maintain 4.5:1 border contrast"
          }
        ],
        "answer": "A",
        "explanation": "WCAG SC 1.4.3 Contrast (Minimum) requires at least 4.5:1 for normal text and 3:1 for large text (18pt / 24px or 14pt bold)."
      },
      {
        "id": "kc-cpacc-cat-3",
        "question": "A user with tremors or limited fine motor control benefits most from which digital design accommodation?",
        "options": [
          {
            "id": "A",
            "text": "Generous target sizes (at least 24×24px per SC 2.5.8) with adequate target spacing"
          },
          {
            "id": "B",
            "text": "Hover-dependent flyout menus that collapse immediately when pointer paths waver"
          },
          {
            "id": "C",
            "text": "Touch targets grouped tightly together without spacing to conserve layout area"
          },
          {
            "id": "D",
            "text": "Complex multi-finger gestures requiring synchronized simultaneous screen taps"
          }
        ],
        "answer": "A",
        "explanation": "Large target sizes with spacing prevent accidental activation by users with hand tremors or motor limitations (WCAG 2.5.5 / 2.5.8)."
      }
    ]
  },
  {
    "id": "mod-cpacc-universal-design",
    "cert": "CPACC",
    "domainId": "CPACC-D2",
    "domainLabel": "Domain 2: Accessibility & Universal Design",
    "sectionId": "CPACC-D2-E",
    "title": "The 7 Principles of Universal Design",
    "badge": "Core Competency",
    "difficulty": "Intermediate",
    "estimatedMinutes": 9,
    "interactiveType": "universal-design-sorter",
    "citation": "CPACC BoK V3, Section 2.5 (Center for Universal Design)",
    "summary": "Study the 7 Principles of Universal Design formulated by Ronald Mace and North Carolina State University. Learn how inclusive design creates environments usable by all people without need for specialized adaptation.",
    "learningObjectives": [
      "Master the 7 Principles of Universal Design: Equitable Use, Flexibility, Simple & Intuitive, Perceptible Information, Tolerance for Error, Low Physical Effort, Size and Space.",
      "Differentiate between individualized retrofitted accommodations and proactive universal design.",
      "Apply the \"Curb-Cut Effect\" to digital user experience and physical architecture."
    ],
    "keyConcepts": [
      {
        "title": "Principle 1: Equitable Use",
        "explanation": "The design is useful and marketable to people with diverse abilities. It avoids segregating or stigmatizing any users. Example: Power sliding doors at building entrances."
      },
      {
        "title": "Principle 2: Flexibility in Use",
        "explanation": "The design accommodates a wide range of individual preferences and abilities. Example: Right- or left-handed scissors; customizable playback speeds."
      },
      {
        "title": "Principle 3: Simple and Intuitive Use",
        "explanation": "Use of the design is easy to understand regardless of user experience, knowledge, language skills, or current concentration level."
      },
      {
        "title": "Principle 4: Perceptible Information",
        "explanation": "The design communicates necessary information effectively through redundant sensory channels (visual, verbal, tactile)."
      },
      {
        "title": "Principle 5: Tolerance for Error",
        "explanation": "Minimizes hazards and adverse consequences of accidental actions. Example: Confirmation dialogs and undo mechanisms."
      },
      {
        "title": "Principle 6: Low Physical Effort",
        "explanation": "The design can be used efficiently and comfortably with minimal fatigue. Example: Lever handles instead of round twist knobs."
      },
      {
        "title": "Principle 7: Size and Space for Approach and Use",
        "explanation": "Appropriate size and space is provided for approach, reach, manipulation, and use regardless of body size, posture, or mobility."
      }
    ],
    "examTips": "Exam questions often contrast Universal Design with Assistive Technology. Universal Design is inherent in the environment; Assistive Technology is personal equipment brought by the user. They work together synergistically!",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-ud-1",
        "question": "Which Universal Design principle is illustrated by an automatic door that opens smoothly for wheelchair users, parents with strollers, and delivery workers carrying boxes?",
        "options": [
          {
            "id": "A",
            "text": "Equitable Use by providing the exact same automated entry pathway for everyone"
          },
          {
            "id": "B",
            "text": "Perceptible Information by providing redundant chime signals at the entrance"
          },
          {
            "id": "C",
            "text": "Low Physical Effort by reducing mechanical resistance on interior manual doors"
          },
          {
            "id": "D",
            "text": "Tolerance for Error by mitigating hazards during emergency building evacuations"
          }
        ],
        "answer": "A",
        "explanation": "Principle 1 (Equitable Use) provides the same entrance pathway for everyone, whereas Principle 5 (Tolerance for Error) mitigates hazards during emergencies, Principle 4 (Perceptible Information) adds redundant sensory cues, and Principle 6 (Low Physical Effort) reduces mechanical door resistance."
      },
      {
        "id": "kc-cpacc-ud-2",
        "question": "A web application includes an \"Undo\" button after deleting a file to prevent accidental loss of data. Which Universal Design principle is this?",
        "options": [
          {
            "id": "A",
            "text": "Tolerance for Error providing warnings and undo mechanisms for accidental actions"
          },
          {
            "id": "B",
            "text": "Simple and Intuitive Use eliminating unnecessary design and visual complexity"
          },
          {
            "id": "C",
            "text": "Size and Space for Approach ensuring physical wheelchair reach ranges at desks"
          },
          {
            "id": "D",
            "text": "Flexibility in Use accommodating both left-handed and right-handed pointer input devices"
          }
        ],
        "answer": "A",
        "explanation": "Principle 5 (Tolerance for Error) provides warnings and undo mechanisms for accidental actions, whereas Flexibility in Use accommodates left- and right-handed mouse operation, Simple and Intuitive Use reduces cognitive complexity, and Size and Space for Approach addresses physical wheelchair reach ranges."
      },
      {
        "id": "kc-cpacc-ud-3",
        "question": "What is the primary conceptual difference between Universal Design and an Individualized Accommodation?",
        "options": [
          {
            "id": "A",
            "text": "Accommodations are designed for groups, while Universal Design is personalized"
          },
          {
            "id": "B",
            "text": "Universal Design proactively serves diverse groups; accommodations provide targeted retrofits"
          },
          {
            "id": "C",
            "text": "Universal Design addresses architecture; accommodations govern software platforms"
          },
          {
            "id": "D",
            "text": "Accommodations require civil court orders, whereas Universal Design is optional"
          }
        ],
        "answer": "B",
        "explanation": "Universal Design is proactive and universal; accommodations are reactive adjustments requested by and configured for a specific individual."
      }
    ]
  },
  {
    "id": "mod-cpacc-laws",
    "cert": "CPACC",
    "domainId": "CPACC-D3",
    "domainLabel": "Domain 3: Standards, Laws & Management",
    "sectionId": "CPACC-D3-D",
    "title": "Accessibility Laws, Regulations & Standards",
    "badge": "Core Competency",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "interactiveType": "a11y-laws-regulations-lab",
    "citation": "CPACC BoK V3, Section 3.1 & 3.2 (Laws & Regulations)",
    "summary": "Master key digital accessibility laws: ADA Title II & III, Rehabilitation Act Sections 504 & 508, European Accessibility Act (EAA), EN 301 549, and the UN Convention on the Rights of Persons with Disabilities (CRPD).",
    "learningObjectives": [
      "Distinguish between civil rights non-discrimination laws (ADA) and procurement laws (Section 508, EN 301 549).",
      "Understand the April 2024 DOJ Title II rule requiring WCAG 2.1 AA compliance for state and local government digital services.",
      "Explain the global impact of the UN CRPD Article 9 on national legislation."
    ],
    "keyConcepts": [
      {
        "title": "Americans with Disabilities Act (ADA)",
        "explanation": "Title I covers employment; Title II covers state and local governments (formalized April 2024 to mandate WCAG 2.1 AA); Title III covers public accommodations and commercial facilities."
      },
      {
        "title": "Rehabilitation Act of 1973",
        "explanation": "Section 504 prohibits discrimination in federally funded programs. Section 508 mandates accessible Information and Communication Technology (ICT) for federal agencies."
      },
      {
        "title": "European Accessibility Act (EAA / Directive 2019/882)",
        "explanation": "Enforceable across all EU member states from June 2025, harmonizing accessibility standards for consumer hardware, banking, e-commerce, e-books, and ticketing."
      },
      {
        "title": "EN 301 549",
        "explanation": "The European standard for accessibility requirements suitable for public procurement of ICT products and services in Europe (maps directly to WCAG 2.1 AA)."
      }
    ],
    "examTips": "Watch out for jurisdictional differences on the exam: ADA is US civil rights; Section 508 is US federal ICT procurement; EN 301 549 is European ICT procurement; EAA applies to the European private consumer sector.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-law-1",
        "question": "Which United States law specifically mandates that federal government agencies must procure, develop, maintain, and use accessible electronic and information technology?",
        "options": [
          {
            "id": "A",
            "text": "Section 508 of the Rehabilitation Act governing federal government ICT"
          },
          {
            "id": "B",
            "text": "Title III of the Americans with Disabilities Act (Public Accommodations)"
          },
          {
            "id": "C",
            "text": "Section 255 of the Communications Act governing telecommunications gear"
          },
          {
            "id": "D",
            "text": "Section 504 of the Rehabilitation Act applying to federal grant recipients"
          }
        ],
        "answer": "A",
        "explanation": "Section 508 of the Rehabilitation Act governs federal agency ICT procurement and development, whereas ADA Title III covers private-sector public accommodations, the Communications and Video Accessibility Act (CVAA) covers telecommunications/video, and Section 504 covers federally funded programs."
      },
      {
        "id": "kc-cpacc-law-2",
        "question": "Under the DOJ's 2024 final rule for ADA Title II, which technical standard must state and local government digital web and mobile apps comply with?",
        "options": [
          {
            "id": "A",
            "text": "State and local governments under Title II must ensure WCAG 2.1 AA compliance"
          },
          {
            "id": "B",
            "text": "Public websites may fulfill compliance by offering an analog telephone helpline"
          },
          {
            "id": "C",
            "text": "Federal agencies are granted indefinite waivers from Section 508 technical rules"
          },
          {
            "id": "D",
            "text": "Commercial web applications are permanently exempted from federal civil rights laws"
          }
        ],
        "answer": "A",
        "explanation": "The US Department of Justice finalized its ADA Title II rule requiring public entities to conform to WCAG 2.1 Level AA."
      },
      {
        "id": "kc-cpacc-law-3",
        "question": "What is the role of UN CRPD Article 9?",
        "options": [
          {
            "id": "A",
            "text": "It establishes statutory monetary damages and criminal fines for bad software"
          },
          {
            "id": "B",
            "text": "It obligates State Parties to ensure access to physical and digital environments"
          },
          {
            "id": "C",
            "text": "It gives the W3C direct legal authority to prosecute non-compliant companies"
          },
          {
            "id": "D",
            "text": "It creates copyright fair-use exemptions for screen reader users in North/South America"
          }
        ],
        "answer": "B",
        "explanation": "Article 9 of the UN Convention on the Rights of Persons with Disabilities specifically establishes accessibility as a core human right."
      }
    ]
  },
  {
    "id": "mod-cpacc-assistive-tech",
    "cert": "CPACC",
    "domainId": "CPACC-D1",
    "domainLabel": "Domain 1: Disabilities, Challenges & Assistive Tech",
    "sectionId": "CPACC-D1-C",
    "title": "Individual Assistive Technologies & Adaptive Strategies",
    "badge": "Core Competency",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "interactiveType": "assistive-tech-simulator",
    "citation": "CPACC BoK V3, Section 1.3 (Assistive Technologies & Adaptive Strategies)",
    "summary": "Master the diverse ecosystem of assistive hardware and software: Screen readers, refreshable Braille displays, single-switch scanning, screen magnification, voice recognition, and captions.",
    "learningObjectives": [
      "Understand how single-switch and dual-switch scanning devices enable users with motor paralysis to operate software.",
      "Explain how refreshable Braille displays translate dynamic digital text into tactile 6-dot and 8-dot Braille cells.",
      "Analyze the visual restrictions experienced by screen magnification users operating at 400%+ zoom."
    ],
    "keyConcepts": [
      {
        "title": "Switch Access Scanning",
        "explanation": "Used when motor impairments prevent keyboard or mouse operation. Scanning highlights items sequentially; the user triggers an adaptive switch (sip-and-puff, head button, or eye blink) to select."
      },
      {
        "title": "Refreshable Braille Displays",
        "explanation": "Electromechanical devices that dynamically raise plastic or metal pins through holes in a flat surface to represent Braille cells. Essential for deafblind individuals and technical coding."
      },
      {
        "title": "Screen Magnification Limitations",
        "explanation": "Magnification increases pixel scale but drastically shrinks the visible field of view. Content spaced far to the right or bottom of a viewport is completely lost without horizontal panning."
      }
    ],
    "examTips": "IAAP CPACC questions frequently highlight that screen reader users do not read pages top-to-bottom like sighted readers; they navigate by headings, landmarks, links, and forms using shortcut keys.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-at-1",
        "question": "How does an individual with quadriplegia typically navigate an interface using single-switch scanning?",
        "options": [
          {
            "id": "A",
            "text": "By manipulating a high-resistance physical joystick across full 360-degree vectors"
          },
          {
            "id": "B",
            "text": "By waiting for an auto-scan highlight to reach an item and clicking a switch"
          },
          {
            "id": "C",
            "text": "By typing continuous chord combinations on an ergonomic mechanical keyboard"
          },
          {
            "id": "D",
            "text": "By speaking commands continuously into automated speech recognition engines"
          }
        ],
        "answer": "B",
        "explanation": "Single-switch scanning automatically cycles focus through options at a configurable speed, allowing the user to select an item with a single physical activation."
      },
      {
        "id": "kc-cpacc-at-2",
        "question": "Which population of users relies most critically on refreshable Braille displays for digital communication?",
        "options": [
          {
            "id": "A",
            "text": "Users with red-green color vision deficiency reviewing statistical data charts on mobile"
          },
          {
            "id": "B",
            "text": "Individuals who are deafblind who utilize refreshable tactile braille for reading"
          },
          {
            "id": "C",
            "text": "Individuals with moderate presbyopia who require larger typographic font sizes"
          },
          {
            "id": "D",
            "text": "People with expressive aphasia who rely upon text-to-speech voice output tools"
          }
        ],
        "answer": "B",
        "explanation": "Deafblind individuals cannot use synthesized auditory speech from screen readers or visual displays; tactile Braille is their primary digital medium."
      },
      {
        "id": "kc-cpacc-at-3",
        "question": "Why do widely separated layout elements create severe barriers for screen magnification users?",
        "options": [
          {
            "id": "A",
            "text": "Magnification utilities automatically suppress standard mouse pointer click interactions"
          },
          {
            "id": "B",
            "text": "High zoom (e.g. 400%) creates a small viewport, making distant elements easy to miss"
          },
          {
            "id": "C",
            "text": "Screen magnifiers invert background graphics into solid black opaque rectangles"
          },
          {
            "id": "D",
            "text": "Operating system zoom settings disable client-side JavaScript execution loops"
          }
        ],
        "answer": "B",
        "explanation": "High screen magnification (400%�800%) creates a narrow keyhole viewport where distant toast alerts and wide multi-column gaps fall outside the visible area, rather than inverting CSS color tokens, stripping semantic heading tags, or disabling mouse pointer tracking."
      }
    ]
  },
  {
    "id": "mod-cpacc-benefits-business",
    "cert": "CPACC",
    "domainId": "CPACC-D2",
    "domainLabel": "Domain 2: Accessibility & Universal Design",
    "sectionId": "CPACC-D2-B",
    "title": "The Business Case, Curb-Cut Effect & Social Inclusion",
    "badge": "Core Competency",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "interactiveType": "business-case-curb-cut-lab",
    "citation": "CPACC BoK V3, Section 2.2 (Benefits of Accessibility)",
    "summary": "Analyze the multifaceted business case for accessibility: market expansion, innovation, brand reputation, search engine optimization (SEO), and legal risk mitigation.",
    "learningObjectives": [
      "Articulate the commercial size of the disability market: 1.3 billion people globally with over $13 trillion in disposable income.",
      "Explain the \"Curb-Cut Effect\": how accessibility features created for disabled persons benefit the wider mainstream population.",
      "Understand the relationship between semantic accessibility and Search Engine Optimization (SEO)."
    ],
    "keyConcepts": [
      {
        "title": "The Curb-Cut Effect",
        "explanation": "Originally concrete sidewalk ramps built for wheelchair users in Berkeley, California, curb cuts were quickly embraced by parents with strollers, travelers with wheeled luggage, skateboarders, and delivery workers. In digital spaces, captions, transcripts, and high contrast exhibit the exact same universal benefit."
      },
      {
        "title": "Market Reach & Demographics",
        "explanation": "16% of the world population (1 in 6 people) lives with significant disability. Families and friends also choose accessible brands, creating massive commercial network effects."
      },
      {
        "title": "Accessibility & SEO Synergy",
        "explanation": "Search engine crawlers index web pages in almost the exact same way screen readers do: parsing clean HTML structure, `<title>`, `<h1>-<h6>`, `<main>`, descriptive anchor text, and alternative text."
      }
    ],
    "examTips": "Exam questions often ask which department in an enterprise benefits from digital accessibility. The answer is virtually ALL departments: Engineering (cleaner code), Marketing (SEO and reach), Legal (risk mitigation), and HR (inclusive hiring).",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-biz-1",
        "question": "What is the \"Curb-Cut Effect\" in accessibility theory?",
        "options": [
          {
            "id": "A",
            "text": "A corporate risk-management strategy used to settle digital litigation out of court"
          },
          {
            "id": "B",
            "text": "Features created for disability (e.g. ramps, captions) that benefit everyone"
          },
          {
            "id": "C",
            "text": "An engineering approach that eliminates accessibility code auditing budgets"
          },
          {
            "id": "D",
            "text": "A visual branding system featuring high-contrast neon palettes on mobile apps"
          }
        ],
        "answer": "B",
        "explanation": "The Curb-Cut Effect describes how features designed for people with disabilities (curb ramps, closed captions, voice control) benefit the broader public, rather than representing a municipal sidewalk engineering tax, a corporate charity write-off, or a replacement for WCAG audits."
      },
      {
        "id": "kc-cpacc-biz-2",
        "question": "How does creating accessible digital content directly enhance Search Engine Optimization (SEO)?",
        "options": [
          {
            "id": "A",
            "text": "Assistive screen reader software automatically sends browsing telemetry to engines"
          },
          {
            "id": "B",
            "text": "Search engine crawlers rely on semantic markup, headings, links, and alt text"
          },
          {
            "id": "C",
            "text": "Search engines give preferential search positioning to verified W3C member sites"
          },
          {
            "id": "D",
            "text": "Accessible semantic markups block search engine tracking cookies and crawler bots"
          }
        ],
        "answer": "B",
        "explanation": "Search engine crawlers rely on the same machine-readable text semantics as screen readers�heading hierarchies, image alt attributes, descriptive link text, and video transcripts�rather than giving automatic ranking boosts to sites with third-party accessibility overlay widgets."
      },
      {
        "id": "kc-cpacc-biz-3",
        "question": "According to the World Health Organization, approximately what percentage of the global population lives with a significant disability?",
        "options": [
          {
            "id": "A",
            "text": "Approximately 30% of the global population (nearly 2.4 billion individuals worldwide)"
          },
          {
            "id": "B",
            "text": "Approximately 16% of the world population (about 1.3 billion individuals globally)"
          },
          {
            "id": "C",
            "text": "Approximately 2% of the world population (about 160 million individuals globally)"
          },
          {
            "id": "D",
            "text": "Over 50% of the world population (representing the demographic majority of people)"
          }
        ],
        "answer": "B",
        "explanation": "WHO estimates that approximately 1.3 billion people—16% of the global population—experience significant disability, representing the world's largest minority group."
      }
    ]
  },
  {
    "id": "mod-cpacc-maturity",
    "cert": "CPACC",
    "domainId": "CPACC-D3",
    "domainLabel": "Domain 3: Standards, Laws & Management",
    "sectionId": "CPACC-D3-F",
    "title": "Integrating Accessibility & Capability Maturity Models",
    "badge": "Core Competency",
    "difficulty": "Advanced",
    "estimatedMinutes": 9,
    "interactiveType": "a11y-maturity-model-auditor",
    "citation": "CPACC BoK V3, Section 3.4 (Integrating ICT Accessibility Across the Organization)",
    "summary": "Apply the Capability Maturity Model (CMM) and the W3C Accessibility Maturity Model (AMM) to transition organizations from reactive ad-hoc compliance to sustainable cultural inclusion.",
    "learningObjectives": [
      "Evaluate organizational readiness across Governance, Culture, Personnel, Procurement, and Technology.",
      "Distinguish between Level 1 (Ad-hoc / Chaos) and Level 5 (Optimizing / Co-design) maturity stages.",
      "Implement procurement verification workflows utilizing Accessibility Conformance Reports (ACRs / VPATs)."
    ],
    "keyConcepts": [
      {
        "title": "Maturity Levels in Accessibility",
        "explanation": "Level 1: Initial (unplanned, reactive to lawsuits); Level 2: Planned (ad-hoc projects); Level 3: Defined (enterprise policy and standardized testing); Level 4: Measured (metrics & automated gates); Level 5: Optimizing (continuous innovation and inclusive culture)."
      },
      {
        "title": "ICT Procurement & VPATs",
        "explanation": "Organizations cannot be accessible if they purchase inaccessible third-party software. Voluntary Product Accessibility Templates (VPATs) completed by vendors produce Accessibility Conformance Reports (ACRs)."
      },
      {
        "title": "Executive Governance & Culture",
        "explanation": "Sustainable accessibility requires top-down leadership sponsorship, dedicated executive budget, and cross-functional representation (design, engineering, legal, HR)."
      }
    ],
    "examTips": "Exam trap: IAAP tests whether an accessibility team should exist in a silo. The correct answer is that accessibility must be decentralized across every functional role (Designers own contrast, Devs own semantic HTML, Authors own alt-text, Procurement owns VPATs).",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-mat-1",
        "question": "An enterprise only addresses digital accessibility when threatened with a federal lawsuit or customer complaint. What stage of the Accessibility Maturity Model does this represent?",
        "options": [
          {
            "id": "A",
            "text": "Level 3: Defined, where processes are formally documented in standard operating plans"
          },
          {
            "id": "B",
            "text": "Level 1: Initial / Ad Hoc, relying on sporadic individual efforts without governance"
          },
          {
            "id": "C",
            "text": "Level 5: Optimizing, driven by continuous automated metrics and proactive innovation"
          },
          {
            "id": "D",
            "text": "Level 4: Managed, where quantitative quality metrics dictate executive performance"
          }
        ],
        "answer": "B",
        "explanation": "Level 1 (Initial / Ad-hoc) is characterized by reactive, disorganized responses to external pressure with no documented strategy or proactive policies."
      },
      {
        "id": "kc-cpacc-mat-2",
        "question": "What is a VPAT (Voluntary Product Accessibility Template)?",
        "options": [
          {
            "id": "A",
            "text": "An automated color contrast analyzer tool developed for front-end web developers"
          },
          {
            "id": "B",
            "text": "A standardized reporting format documenting product conformance to WCAG and 508"
          },
          {
            "id": "C",
            "text": "An open-source screen reader software utility distributed by federal agencies"
          },
          {
            "id": "D",
            "text": "An ISO-certified digital encryption security protocol for web applications"
          }
        ],
        "answer": "B",
        "explanation": "A VPAT is the standardized reporting template created by the Information Technology Industry Council (ITI) that vendors fill out to create an Accessibility Conformance Report (ACR)."
      },
      {
        "id": "kc-cpacc-mat-3",
        "question": "What is the most effective approach for integrating digital accessibility into an organization long-term?",
        "options": [
          {
            "id": "A",
            "text": "Assigning a junior engineer to patch accessibility tickets following release"
          },
          {
            "id": "B",
            "text": "Purchasing commercial insurance policies to defend against civil rights litigation"
          },
          {
            "id": "C",
            "text": "Embedding role-based accessibility training, testing gates, and governance across teams"
          },
          {
            "id": "D",
            "text": "Installing third-party automated JavaScript overlay widgets across the domain"
          }
        ],
        "answer": "C",
        "explanation": "At the Optimizing (Integrated) maturity stage, accessibility is embedded across executive governance, procurement, design systems, and CI/CD pipelines, rather than being delegated to a single junior QA tester, handled via ad-hoc legal patches, or outsourced to automated widgets."
      }
    ]
  },
  {
    "id": "mod-cpacc-built-environment",
    "cert": "CPACC",
    "domainId": "CPACC-D2",
    "domainLabel": "Domain 2: Accessibility and Universal Design",
    "sectionId": "CPACC-D2-D",
    "title": "Accessibility Principles for the Built Environment",
    "badge": "Physical Accessibility",
    "difficulty": "Intermediate",
    "estimatedMinutes": 12,
    "interactiveType": "built-environment-blueprint-lab",
    "citation": "IAAP CPACC BoK V3, Domain 2.D (Accessibility Principles for the Built Environment), ADAAG (2010 ADA Standards) & ISO 21542",
    "summary": "Explore physical and architectural accessibility principles in the built environment. Master critical dimensional standards: wheelchair ramp slopes (1:12 maximum), doorway clear opening widths (32\" minimum), 360-degree wheelchair turning clearances (60\" diameter), closed-fist operable hardware, and tactile/Braille signage placement.",
    "learningObjectives": [
      "Calculate maximum running slopes for wheelchair ramps (1:12 ratio / 8.33% grade) and landing spacing requirements.",
      "Specify minimum doorway clear opening width (32 inches) and accessible hardware operable without tight grasping or twisting.",
      "Apply spatial standards for wheelchair turning (60-inch diameter circle or T-shaped turn) in hallways, restrooms, and vestibules.",
      "Determine compliant tactile and Braille signage mounting heights (48\"-60\" character baseline) and latch-side wall locations.",
      "Understand the interplay between physical accessibility (ADA Title III / ISO 21542) and digital accessibility kiosk/terminal design."
    ],
    "keyConcepts": [
      {
        "title": "Ramp Running Slopes & Restings (ADAAG 405)",
        "explanation": "Under ADAAG Section 405, ramp runs shall have a running slope not steeper than 1:12 (8.33% grade). Cross slope must not exceed 1:48. Level landings of at least 60\" x 60\" are required at the top, bottom, and at every 30 inches of maximum vertical rise to allow wheelchair users to rest."
      },
      {
        "title": "Accessible Doorways & Operable Hardware (ADAAG 404)",
        "explanation": "Door openings must provide a minimum clear width of 32 inches (815 mm) measured between the face of the door and the opposite stop with the door open 90 degrees. Door hardware must be operable with one hand without tight grasping, pinching, or twisting of the wrist (operable with a closed fist; maximum 5 lbf of operational force)."
      },
      {
        "title": "Wheelchair Turning Space (ADAAG 304)",
        "explanation": "A full 360-degree wheelchair turn requires a circular space of 60 inches (1525 mm) minimum diameter, or a T-shaped turning space within a 60\" by 60\" boundary with 36\" wide arms."
      },
      {
        "title": "Tactile & Braille Signage Mounting (ADAAG 703)",
        "explanation": "Tactile signs identifying permanent rooms must be mounted on the wall on the latch side of the door. Tactile character baselines must be between 48 inches minimum and 60 inches maximum above the finish floor, with an 18\" x 18\" clear floor space centered on the tactile sign."
      }
    ],
    "examTips": "CPACC Exam Alert: Remember the rule of thumb \"1:12\" for ramps (1 inch of vertical rise requires at least 12 inches of horizontal run). Watch out for trap questions claiming 1:8 or 1:10 is standard — those are illegal tipping hazards. For door hardware, the key test is \"operable with a closed fist\" with 5 pounds of force or less. For signs, NEVER place them on the door face itself if the door swings into the user.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-be-1",
        "question": "Under the 2010 ADA Standards (ADAAG 405.2), what is the maximum running slope allowed for an accessible wheelchair ramp in new construction?",
        "options": [
          {
            "id": "A",
            "text": "1:20 running slope without requiring handrail installations or level landings"
          },
          {
            "id": "B",
            "text": "1:8 maximum running slope (12.5% incline) with unrestricted cross-slope dimensions"
          },
          {
            "id": "C",
            "text": "1:12 maximum running slope (8.33% incline) with a 1:48 maximum cross-slope"
          },
          {
            "id": "D",
            "text": "1:6 running slope provided that warning paver tiles are embedded at the top run"
          }
        ],
        "answer": "C",
        "explanation": "ADAAG Section 405 specifies a maximum running slope of 1:12 (8.33% grade) for wheelchair ramps, whereas steeper inclines like 1:6 or 1:8 create tipping hazards and level landings are still required every 30 inches of vertical rise."
      },
      {
        "id": "kc-cpacc-be-2",
        "question": "What is the minimum clear opening width required for accessible doors and gates under ADAAG 404.2.3?",
        "options": [
          {
            "id": "A",
            "text": "A minimum clear opening width of 28 inches fitted with high-tension deadbolt bars"
          },
          {
            "id": "B",
            "text": "A minimum clear opening width of 24 inches operated with traditional round twist doorknobs"
          },
          {
            "id": "C",
            "text": "A minimum clear opening width of 32 inches operated with closed-fist lever handles"
          },
          {
            "id": "D",
            "text": "A minimum clear opening width of 48 inches with automated revolving turnstiles"
          }
        ],
        "answer": "C",
        "explanation": "Door openings must provide a minimum clear width of 32 inches (815 mm), measured between the face of the door and the stop with the door open 90 degrees."
      },
      {
        "id": "kc-cpacc-be-3",
        "question": "Where must tactile and Braille signs identifying permanent interior rooms be mounted according to ADAAG 703.4?",
        "options": [
          {
            "id": "A",
            "text": "Suspended from the ceiling with an 80-inch minimum vertical overhead clearance"
          },
          {
            "id": "B",
            "text": "Mounted directly on the push side of the swinging door face at 72 inches above the floor"
          },
          {
            "id": "C",
            "text": "On the wall adjacent to the latch side of the door, 48 to 60 inches to baseline"
          },
          {
            "id": "D",
            "text": "Embedded into the floor threshold material directly centered before the entry"
          }
        ],
        "answer": "C",
        "explanation": "Mounting tactile signs on the wall on the latch side of the door between 48\" and 60\" ensures that blind individuals reading Braille do not get struck by a swinging door."
      }
    ]
  },
  {
    "id": "mod-cpacc-etiquette",
    "cert": "CPACC",
    "domainId": "CPACC-D1",
    "domainLabel": "Domain 1: Disabilities, Challenges, and Assistive Technologies",
    "sectionId": "CPACC-D1-E",
    "title": "Disability Etiquette & Respectful Professional Interactions",
    "badge": "Disability Etiquette",
    "difficulty": "Beginner",
    "estimatedMinutes": 10,
    "interactiveType": "disability-etiquette-lab",
    "citation": "IAAP CPACC BoK V3, Domain 1.E (Disability Etiquette) & ADA Title III Guidance",
    "summary": "Master professional disability etiquette and interpersonal communication principles. Understand the boundary between personal bodily space and assistive equipment, working service dog protocol, direct communication with Deaf individuals working with sign language interpreters, and community-driven terminology preferences (Person-First vs Identity-First language).",
    "learningObjectives": [
      "Treat wheelchairs, guide dogs, white canes, and assistive devices as extensions of personal bodily space.",
      "Apply service animal etiquette: never distract, pet, or feed a working service animal.",
      "Maintain direct communication and eye contact with the person with a disability rather than addressing an interpreter, companion, or caregiver.",
      "Navigate the nuances of Person-First language (\"person with a disability\") and Identity-First language (\"Deaf person\", \"Autistic person\") across distinct communities.",
      "Recognize and eliminate patronizing euphemisms (\"differently abled\", \"special needs\", \"handi-capable\")."
    ],
    "keyConcepts": [
      {
        "title": "Assistive Devices as Bodily Space",
        "explanation": "A wheelchair, white cane, guide dog harness, or walker is an integral extension of an individual's personal physical space. Leaning on someone's wheelchair, touching equipment without permission, or grabbing handles to push them is equivalent to touching their physical body without consent."
      },
      {
        "title": "Service Animal Protocol",
        "explanation": "Service animals (primarily dogs trained to perform specific tasks related to a person's disability under ADA Title II/III) are working medical equipment. Distracting, petting, or feeding them disrupts their focus on medical alerts, navigation, or seizure detection."
      },
      {
        "title": "Direct Address & Eye Contact",
        "explanation": "When speaking with a person who uses an ASL interpreter, speech synthesizer, or personal assistant, always look directly at the person and speak in the first person (\"What is your goal?\"). Never say \"Ask them...\" or look exclusively at the interpreter. For wheelchair users, pull up a chair to speak at eye level to prevent neck strain and patronizing posturing."
      },
      {
        "title": "Terminology: Person-First vs Identity-First Language",
        "explanation": "Person-First Language (\"person who is blind\", \"people with disabilities\") emphasizes humanity before disability and is common in legal/policy contexts. Identity-First Language (\"Autistic adult\", \"Deaf individual\") views disability as an inseparable, proud cultural identity. Both are valid within their respective communities; patronizing euphemisms like \"differently abled\" or \"special needs\" are rejected by disability advocacy groups."
      }
    ],
    "examTips": "CPACC Exam Alert: Watch out for questions offering \"helpful\" actions that violate autonomy — such as pushing someone's wheelchair without asking or speaking to an interpreter instead of the individual. Remember the core rule: ALWAYS ask before offering assistance, and respect their answer if they decline.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-et-1",
        "question": "When conversing with a person who uses a wheelchair during an extended meeting, what is the recommended etiquette?",
        "options": [
          {
            "id": "A",
            "text": "Lean casually on the wheelchair push handles to signal informal team warmth"
          },
          {
            "id": "B",
            "text": "Stand directly behind the wheelchair backrest and speak with an elevated voice"
          },
          {
            "id": "C",
            "text": "Take hold of the wheelchair handrims to steer the person toward conference rooms"
          },
          {
            "id": "D",
            "text": "Sit down to converse at eye level, treating the wheelchair as part of personal space"
          }
        ],
        "answer": "D",
        "explanation": "Sitting down to converse at eye level avoids neck strain and respects the wheelchair as part of the user's personal space, whereas leaning on push handles, standing behind the backrest speaking loudly, or grabbing handrims to steer uninvited violates personal boundaries."
      },
      {
        "id": "kc-cpacc-et-2",
        "question": "When interacting with a colleague who is accompanied by a certified working guide dog in the office, what is the correct behavioral rule?",
        "options": [
          {
            "id": "A",
            "text": "Direct your attention and speech to the handler while ignoring the working animal"
          },
          {
            "id": "B",
            "text": "Offer food snacks to the service animal to build welcoming workplace rapport"
          },
          {
            "id": "C",
            "text": "Pet the service animal whenever encountering it in office hallways or rooms"
          },
          {
            "id": "D",
            "text": "Demand that the handler produce certified veterinary medical documentation"
          }
        ],
        "answer": "A",
        "explanation": "When a service animal is in harness and working, speak directly to the handler and never pet, feed,offer snacks, whistle at, or distract the animal, nor demand medical diagnostic paperwork beyond the two permissible ADA service-animal inquiries."
      },
      {
        "id": "kc-cpacc-et-3",
        "question": "Why do disability rights organizations and the IAAP strongly discourage the use of terms like \"differently abled\", \"special needs\", or \"handi-capable\"?",
        "options": [
          {
            "id": "A",
            "text": "They are proprietary commercial trademarks owned by clinical therapy firms"
          },
          {
            "id": "B",
            "text": "They are specialized legal classifications codified in statutes outside of North America"
          },
          {
            "id": "C",
            "text": "They are patronizing euphemisms that avoid the direct, accepted word \"disabled\""
          },
          {
            "id": "D",
            "text": "They describe temporary occupational injuries in medical compensation charts"
          }
        ],
        "answer": "C",
        "explanation": "Person-first (\"person with a disability\") and identity-first (\"autistic person\", \"Deaf person\") are both respected community frameworks; best practice is to honor the individual's stated preference rather than enforcing medical diagnostic labels or euphemisms like \"differently abled\"."
      }
    ]
  },
  {
    "id": "mod-cpacc-udl",
    "cert": "CPACC",
    "domainId": "CPACC-D2",
    "domainLabel": "Domain 2: Accessibility and Universal Design",
    "sectionId": "CPACC-D2-F",
    "title": "Universal Design for Learning (UDL) & Inclusive Pedagogy",
    "badge": "Educational Accessibility",
    "difficulty": "Intermediate",
    "estimatedMinutes": 12,
    "interactiveType": "udl-course-designer-lab",
    "citation": "IAAP CPACC BoK V3, Domain 2.F (Universal Design for Learning) & CAST UDL Guidelines 2.2",
    "summary": "Explore the Universal Design for Learning (UDL) framework developed by CAST. Understand how proactive curricular design based on cognitive neuroscience eliminates educational barriers across 3 brain networks: Multiple Means of Engagement (Affective Networks), Multiple Means of Representation (Recognition Networks), and Multiple Means of Action & Expression (Strategic Networks).",
    "learningObjectives": [
      "Map CAST's 3 UDL pillars to the underlying brain networks: Affective (\"Why\"), Recognition (\"What\"), and Strategic (\"How\").",
      "Differentiate proactive universal instructional design from reactive post-enrollment accommodations.",
      "Apply multiple means of engagement through student choice, authentic tasks, and self-regulation scaffolding.",
      "Provide multiple means of representation via multimodal media, synchronized captions, transcripts, and customizable display options.",
      "Support multiple means of action and expression with flexible response formats, assistive technology integration, and executive function supports."
    ],
    "keyConcepts": [
      {
        "title": "Affective Networks & Engagement (The \"Why\" of Learning)",
        "explanation": "The affective brain network determines what captures learners' interest, how they sustain effort, and how they self-regulate. Providing options for student choice, real-world authenticity, and low-stakes progress milestones fosters intrinsically motivated, purposeful learners."
      },
      {
        "title": "Recognition Networks & Representation (The \"What\" of Learning)",
        "explanation": "The recognition network identifies facts, letters, symbols, and concepts. Relying solely on printed text erects barriers for blind, dyslexic, or ESL students. Offering multimodal media (captioned video, transcripts, interactive diagrams) and embedded vocabulary supports ensures perception and comprehension for all."
      },
      {
        "title": "Strategic Networks & Action/Expression (The \"How\" of Learning)",
        "explanation": "The strategic network plans, executes, and monitors physical and communicative activities. Forcing a single evaluation medium (e.g. handwritten paper) discriminates against students with physical or motor disabilities, dysgraphia, or speech impediments. Providing multiple channels (typed report, podcast, video presentation) allows learners to demonstrate mastery authentically."
      },
      {
        "title": "Universal Design vs Individual Accommodations",
        "explanation": "Individual accommodations (e.g., granting 1.5x time or brailling a test after a student discloses a disability) are reactive, costly, and can isolate the student. Universal Design for Learning proactively designs flexibility into the syllabus so the greatest number of diverse learners succeed without needing to petition for separate accommodations."
      }
    ],
    "examTips": "CPACC Exam Alert: Be prepared to match each of the 3 UDL pillars to its corresponding brain network and question: Engagement = Affective Network (\"Why\"), Representation = Recognition Network (\"What\"), Action & Expression = Strategic Network (\"How\"). Also remember: UDL benefits ALL students (curb-cut effect in education), not just students with diagnosed disabilities.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-udl-1",
        "question": "Which neurological network corresponds to the UDL principle of providing \"Multiple Means of Representation\" and the \"What\" of learning?",
        "options": [
          {
            "id": "A",
            "text": "The Strategic Network governing executive function, planning, and motor expression"
          },
          {
            "id": "B",
            "text": "The Affective Network regulating learner motivation, interest, and emotional engagement"
          },
          {
            "id": "C",
            "text": "The Recognition Network processing sensory patterns, symbols, and conceptual facts"
          },
          {
            "id": "D",
            "text": "The Autonomic Somatic Network controlling involuntary physiological reflex responses"
          }
        ],
        "answer": "C",
        "explanation": "In CAST Universal Design for Learning, the Recognition Network (the \"What\" of learning) perceives and interprets information through Multiple Means of Representation, alongside the Affective (\"Why\") and Strategic (\"How\") networks."
      },
      {
        "id": "kc-cpacc-udl-2",
        "question": "How does Universal Design for Learning (UDL) fundamentally differ from traditional individualized accommodations in higher education?",
        "options": [
          {
            "id": "A",
            "text": "UDL eliminates traditional letter grading standards and course examinations"
          },
          {
            "id": "B",
            "text": "UDL builds multimodal flexibility into core curricula proactively for diverse students"
          },
          {
            "id": "C",
            "text": "Accommodations are designed by CAST, while UDL is administered by state courts"
          },
          {
            "id": "D",
            "text": "UDL applies strictly to physical architectural classrooms, desks, and campuses"
          }
        ],
        "answer": "B",
        "explanation": "UDL is proactive and universal: flexible learning options are built into the initial course architecture, drastically reducing the need for retrofitted, reactive individual accommodations."
      },
      {
        "id": "kc-cpacc-udl-3",
        "question": "Allowing students to submit an assignment as a written essay, an audio podcast, or an interactive demonstration directly embodies which UDL principle?",
        "options": [
          {
            "id": "A",
            "text": "Multiple Means of Engagement fostering learner autonomy and collaborative motivation"
          },
          {
            "id": "B",
            "text": "Multiple Means of Representation providing synchronized captions and audio descriptions"
          },
          {
            "id": "C",
            "text": "Multiple Means of Action and Expression allowing flexible ways to demonstrate mastery"
          },
          {
            "id": "D",
            "text": "Standardized Norm-Referenced Assessment ranking students along a fixed bell curve"
          }
        ],
        "answer": "C",
        "explanation": "Allowing learners to demonstrate knowledge through varied formats (written essay, podcast, or interactive demonstration) embodies Multiple Means of Action and Expression (the Strategic Network)."
      }
    ]
  },
  {
    "id": "mod-cpacc-regional-laws",
    "cert": "CPACC",
    "domainId": "CPACC-D3",
    "domainLabel": "Domain 3: Standards, Laws, and Management Strategies",
    "sectionId": "CPACC-D3-B",
    "title": "Regional & National Civil Rights Legislation (EU, US, Canada, UK, Japan)",
    "badge": "International Law",
    "difficulty": "Intermediate",
    "estimatedMinutes": 14,
    "interactiveType": "global-legal-compass-lab",
    "citation": "IAAP CPACC BoK V3, Domain 3.B (Regional Instruments), EAA Directive 2019/882, ADA Title II DOJ Final Rule 2024, ACA 2019 & EN 301 549",
    "summary": "Master the landscape of regional and national disability rights and digital accessibility statutes. Analyze the European Accessibility Act (EAA Directive 2019/882, June 2025 enforcement) and EN 301 549, the US Americans with Disabilities Act (2024 Title II DOJ final rule mandating WCAG 2.1 AA) and Section 508, Canada's ACA and AODA, the UK Equality Act 2010, and Japan's JIS X 8341-3.",
    "learningObjectives": [
      "Distinguish the scope, deadlines, and technical standards of the European Accessibility Act (EAA Directive 2019/882) and EN 301 549.",
      "Analyze US legal mandates: ADA Title II (2024 DOJ final rule mandating WCAG 2.1 AA), ADA Title III commercial application, and Section 508.",
      "Understand Canadian federal and provincial frameworks: the Accessible Canada Act (ACA 2019) vs Ontario's AODA.",
      "Identify UK (Equality Act 2010, PSBAR 2018) and Japanese (JIS X 8341-3, 2024 private sector mandate) accessibility statutes.",
      "Compare civil rights / anti-discrimination frameworks against procurement and standard harmonization models."
    ],
    "keyConcepts": [
      {
        "title": "European Union Frameworks (EAA & EN 301 549)",
        "explanation": "The EU Web Accessibility Directive (2016/2102) covers public sector bodies. The European Accessibility Act (Directive 2019/882) expands mandatory compliance to the private commercial sector (e-commerce, online banking, e-books, transport, ATMs) with strict enforcement starting June 28, 2025. Technical standard EN 301 549 harmonizes requirements across all 27 EU member states."
      },
      {
        "title": "United States Regulatory Evolution",
        "explanation": "The Americans with Disabilities Act (ADA 1990) contains Title II (state and local governments) and Title III (public accommodations). In April 2024, the DOJ issued a historic Final Rule under Title II explicitly adopting WCAG 2.1 Level AA as the mandatory technical standard for state/local websites and mobile apps. Section 508 of the Rehabilitation Act governs federal agencies and their ICT vendors."
      },
      {
        "title": "Canadian Federal & Provincial Governance",
        "explanation": "The Accessible Canada Act (ACA 2019) aims for a barrier-free Canada by 2040, applying to federally regulated industries (telecoms, banking, transport). At the provincial level, Ontario's Accessibility for Ontarians with Disabilities Act (AODA 2005) mandates WCAG Level AA conformance for organizations with 50+ employees."
      },
      {
        "title": "UK & Asia-Pacific Legal Instruments",
        "explanation": "The UK Equality Act 2010 mandates reasonable adjustments in goods, services, and employment, reinforced by the Public Sector Bodies Accessibility Regulations 2018 (PSBAR). In Japan, the Act on Elimination of Discrimination Against Persons with Disabilities (amended April 2024) mandates reasonable accommodation for private businesses, supported by technical standard JIS X 8341-3."
      }
    ],
    "examTips": "CPACC Exam Alert: Be prepared for questions testing specific jurisdictional scopes: EAA = EU private commercial sector (June 28, 2025); EN 301 549 = EU ICT standard; DOJ Title II 2024 Rule = US state/local government mandating WCAG 2.1 AA; AODA = Ontario, Canada; ACA = Canadian federal sector.",
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-reg-1",
        "question": "Starting June 28, 2025, which European Union statute mandates accessibility for private sector e-commerce, banking, e-books, and ticketing services across all member states?",
        "options": [
          {
            "id": "A",
            "text": "EU Web Accessibility Directive 2016/2102 (covering public sector web bodies)"
          },
          {
            "id": "B",
            "text": "The European General Data Protection Regulation (GDPR Article 9 Special Categories)"
          },
          {
            "id": "C",
            "text": "European Accessibility Act (Directive 2019/882 covering key private services)"
          },
          {
            "id": "D",
            "text": "The Bologna Declaration on European Higher Education Academic Qualifications"
          }
        ],
        "answer": "C",
        "explanation": "The European Accessibility Act (Directive 2019/882) regulates commercial private-sector products and services (e-commerce, banking, e-books, ticketing kiosks), whereas Directive 2016/2102 covers public-sector government bodies and the Bologna Process covers higher-education degree alignment."
      },
      {
        "id": "kc-cpacc-reg-2",
        "question": "In April 2024, the United States Department of Justice (DOJ) published a landmark Final Rule under ADA Title II. What technical standard does it officially codify for state and local government web content and mobile apps?",
        "options": [
          {
            "id": "A",
            "text": "ISO/IEC 40500 draft working group notes for voluntary federal agency adoption"
          },
          {
            "id": "B",
            "text": "W3C Web Content Accessibility Guidelines (WCAG) 2.0 Level A foundational baseline rules"
          },
          {
            "id": "C",
            "text": "W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA technical standard"
          },
          {
            "id": "D",
            "text": "Section 504 legacy architectural facility guidelines for physical courtrooms"
          }
        ],
        "answer": "C",
        "explanation": "In April 2024, the U.S. Department of Justice published its ADA Title II Final Rule codifying WCAG 2.1 Level AA as the mandatory technical standard for state and local government websites and mobile apps."
      },
      {
        "id": "kc-cpacc-reg-3",
        "question": "Which European standard specifies the functional accessibility requirements for ICT products and services, harmonizing WCAG 2.1 AA with non-web hardware, software, and kiosk technologies?",
        "options": [
          {
            "id": "A",
            "text": "ISO 9001 Quality Management Systems governing enterprise manufacturing workflows"
          },
          {
            "id": "B",
            "text": "The Berne Convention for the International Protection of Literary and Artistic Works"
          },
          {
            "id": "C",
            "text": "EN 301 549 harmonizing WCAG 2.1 AA across European web, software, and ICT hardware"
          },
          {
            "id": "D",
            "text": "W3C Authoring Tool Accessibility Guidelines (ATAG 2.0) for web content editors"
          }
        ],
        "answer": "C",
        "explanation": "EN 301 549 is the harmonized European technical standard specifying functional accessibility requirements across web, documents, software, and non-web ICT hardware (such as kiosks and telecommunications)."
      }
    ]
  },
  {
    "id": "mod-cpacc-treaties",
    "cert": "CPACC",
    "domainId": "CPACC-D3",
    "domainLabel": "Domain 3: Standards, Laws & Management",
    "sectionId": "CPACC-D3-A",
    "sectionLabel": "International Declarations and Conventions on Disability Rights",
    "citation": "IAAP CPACC BoK V3, Domain 3.A (International Declarations and Conventions on Disability Rights), UN CRPD (Articles 9 & 21) & Marrakesh Treaty (WIPO 2013)",
    "title": "UN CRPD & International Human Rights Conventions",
    "summary": "Master the international legal bedrock of disability rights: UN CRPD Article 9 (Accessibility), Article 21 (Freedom of Expression & Information), the Marrakesh Treaty (WIPO 2013), and the UDHR human-rights framework.",
    "duration": "22 mins",
    "level": "Core",
    "interactiveType": "uncrpd-treaty-explorer-lab",
    "learningObjectives": [
      "Analyze the legal obligations created by UN CRPD Article 9 for physical, transportation, and ICT accessibility.",
      "Distinguish how UN CRPD Article 9.2(b) obligates States Parties to ensure private sector public services are accessible.",
      "Apply UN CRPD Article 21 regarding the provision of public information in accessible formats in a timely manner and without additional cost.",
      "Evaluate the Marrakesh Treaty (WIPO 2013) provisions creating copyright exceptions and authorizing cross-border exchange of accessible works by Authorized Entities."
    ],
    "keyConcepts": [
      {
        "title": "UN CRPD Article 9: Accessibility Across Society",
        "explanation": "Requires States Parties to enable persons with disabilities to live independently and participate fully in all aspects of life by ensuring equal access to the physical environment, transportation, information and communications (including ICT systems), and other public facilities and services in urban and rural areas."
      },
      {
        "title": "UN CRPD Article 21: Freedom of Expression & Prohibition of Surcharges",
        "explanation": "Guarantees freedom to seek, receive and impart information through all forms of communication of choice. Article 21(a) explicitly mandates that public information must be provided in accessible formats and technologies in a timely manner and WITHOUT ADDITIONAL COST, outlawing disability surcharges."
      },
      {
        "title": "The Marrakesh Treaty (WIPO 2013): Ending the Global Book Famine",
        "explanation": "Administered by WIPO, the Marrakesh Treaty requires contracting parties to create mandatory copyright exceptions permitting Authorized Entities (libraries, schools, NGOs) to convert published books into accessible formats without rights-holder royalties, and authorizes cross-border import and export between member states."
      },
      {
        "title": "The Human Rights Model vs Medical & Charity Paradigms",
        "explanation": "Rooted in the Universal Declaration of Human Rights (UDHR 1948), modern international law views accessibility not as medical rehabilitation or discretionary charity, but as an inalienable, legally enforceable human right rooted in personal autonomy and non-discrimination."
      }
    ],
    "practicalTakeaways": [
      "International treaties like the UN CRPD set the constitutional mandate that directs national laws like the European Accessibility Act and Section 508.",
      "Charging extra fees for accessible formats (braille, transcripts, large print) is explicitly prohibited under Article 21.",
      "Authorized entities can legally share accessible books across borders between Marrakesh Treaty contracting parties without paying copyright royalties."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-treaty-1",
        "question": "Under UN CRPD Article 9.2(b), what obligation do States Parties have regarding private commercial companies that provide public services (such as e-commerce or private transportation)?",
        "options": [
          {
            "id": "A",
            "text": "Commercial enterprises are exempt from accessibility under international treaties"
          },
          {
            "id": "B",
            "text": "Commercial firms are bound if receiving over 90% direct UN operating grants"
          },
          {
            "id": "C",
            "text": "States Parties must ensure private entities offering public services provide barrier-free access"
          },
          {
            "id": "D",
            "text": "Private firms may substitute accessible websites with paper brochures on demand"
          }
        ],
        "answer": "C",
        "explanation": "CRPD Article 9.2(b) explicitly requires States Parties to enact measures ensuring private entities offering public facilities and services take into account all aspects of accessibility for persons with disabilities."
      },
      {
        "id": "kc-cpacc-treaty-2",
        "question": "What primary barrier to accessible literature does the Marrakesh Treaty (WIPO 2013) address?",
        "options": [
          {
            "id": "A",
            "text": "It requires commercial publishing houses to author literature in Basic English"
          },
          {
            "id": "B",
            "text": "It sets a mandatory minimum price of $50 on commercial digital audiobook sales"
          },
          {
            "id": "C",
            "text": "It prohibits printed paper books internationally to mandate electronic reading devices"
          },
          {
            "id": "D",
            "text": "It creates copyright exceptions to exchange accessible format copies across borders"
          }
        ],
        "answer": "D",
        "explanation": "The WIPO Marrakesh Treaty creates mandatory copyright exceptions so authorized entities can produce and share accessible-format books (braille, DAISY audio, large print) across borders without publisher royalties, rather than banning printed paper books or regulating hardware tariffs."
      },
      {
        "id": "kc-cpacc-treaty-3",
        "question": "A state transportation authority charges passengers with disabilities an extra $10 administrative fee to receive monthly schedule updates in large print or Braille. Which international treaty clause is violated?",
        "options": [
          {
            "id": "A",
            "text": "Geneva Convention Protocol IV protecting civilians from commercial surcharges"
          },
          {
            "id": "B",
            "text": "Berne Convention Article 7 establishing standard international copyright terms"
          },
          {
            "id": "C",
            "text": "No violation exists under international law provided fees match paper costs"
          },
          {
            "id": "D",
            "text": "UN CRPD Article 21(a) mandating accessible formats in a timely manner at no extra cost"
          }
        ],
        "answer": "D",
        "explanation": "UN CRPD Article 21(a) explicitly prohibits charging persons with disabilities extra fees for accessible formats of public information, requiring information to be provided in accessible formats \"in a timely manner and without additional cost\"."
      }
    ]
  },
  {
    "id": "mod-cpacc-demographics",
    "cert": "CPACC",
    "domainId": "CPACC-D1",
    "domainLabel": "Domain 1: Disabilities, Challenges & Assistive Tech",
    "sectionId": "CPACC-D1-D",
    "sectionLabel": "Disability Demographics and Statistics",
    "citation": "IAAP CPACC BoK V3, Domain 1.D (Disability Demographics and Statistics), WHO World Report on Disability & UN Washington Group on Disability Statistics",
    "title": "Disability Demographics, Global Census & Aging Simulator",
    "summary": "Explore global disability prevalence: the WHO 16% benchmark (~1.3 billion individuals), the high proportion of acquired versus congenital limitations (>70%), population aging curves, and the Microsoft Persona Spectrum.",
    "duration": "22 mins",
    "level": "Core",
    "interactiveType": "demographics-census-lab",
    "learningObjectives": [
      "Cite and interpret the World Health Organization standard for global disability prevalence (16% / 1.3 billion individuals).",
      "Analyze the disproportionate prevalence of acquired disabilities (>70-80%) occurring in working adulthood and later life compared to congenital disabilities.",
      "Evaluate how global population aging drives compounding functional limitations across vision, hearing, motor dexterity, and cognition.",
      "Apply the Microsoft Inclusive Design Persona Spectrum (Permanent, Temporary, Situational) to demonstrate the exponential market reach of accessible design."
    ],
    "keyConcepts": [
      {
        "title": "WHO World Report Benchmark: 16% of Humanity",
        "explanation": "The World Health Organization (WHO) and World Bank establish that approximately 1.3 billion people—about 16% of the global population, or 1 in every 6 individuals—experience significant disability, making people with disabilities the world's largest minority group."
      },
      {
        "title": "Acquired vs Congenital Limitations (>70% Acquired)",
        "explanation": "A common misconception is that disability is predominantly congenital (present at birth). In reality, over 70% to 80% of functional limitations are acquired during working-age adulthood or later life due to chronic conditions (diabetes, arthritis), accidents, and natural physiological aging."
      },
      {
        "title": "Global Aging & the Demographic Transition",
        "explanation": "Advancements in medicine and falling birth rates mean populations are living significantly longer. Disability rates surge from ~9% in young adulthood to ~49% for individuals aged 75 and older, meaning nearly everyone will experience temporary or permanent disability if they live long enough."
      },
      {
        "title": "The Persona Spectrum (Permanent, Temporary, Situational)",
        "explanation": "Developed by Microsoft Inclusive Design, the Persona Spectrum shows that designing for a small permanent disability cohort (e.g., 25,000 people with one arm) creates solutions that naturally benefit millions with temporary limitations (broken arm in a cast) and situational constraints (holding an infant)."
      }
    ],
    "practicalTakeaways": [
      "Never treat accessibility as an edge-case for a 1% minority; 1 in 6 people globally have a significant disability.",
      "Most people with acquired limitations do not identify as \"disabled\"; they simply need scalable text, high contrast, and forgiving click targets.",
      "Designing for accessibility expands your customer base exponentially by capturing temporary and situational needs."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-demo-1",
        "question": "According to the World Health Organization (WHO), what proportion of the global population experiences a significant disability?",
        "options": [
          {
            "id": "A",
            "text": "Approximately 3% of the global population (primarily specialized care cohorts)"
          },
          {
            "id": "B",
            "text": "Approximately 35% of the global population (including minor optical refraction)"
          },
          {
            "id": "C",
            "text": "Approximately 1% of the global population (restricted to permanent wheelchair users)"
          },
          {
            "id": "D",
            "text": "Approximately 16% of the global population (roughly 1.3 billion individuals)"
          }
        ],
        "answer": "D",
        "explanation": "The WHO and World Bank estimate that 16% of the global population (~1.3 billion people, or 1 in 6) experience significant disability, rather than 2% in specialized care, 8% in low-income regions, or 30% (2.4 billion) worldwide."
      },
      {
        "id": "kc-cpacc-demo-2",
        "question": "Which of the following statements accurately reflects global demographic data on the acquisition of disabilities?",
        "options": [
          {
            "id": "A",
            "text": "Disabilities frequently present at birth through congenital genetic factors"
          },
          {
            "id": "B",
            "text": "Disabilities manifest primarily past age 75 during end-of-life elderly care"
          },
          {
            "id": "C",
            "text": "Acquired conditions are excluded from international civil rights treaty coverage"
          },
          {
            "id": "D",
            "text": "The majority of disabilities (>70%) are acquired during working adulthood years"
          }
        ],
        "answer": "D",
        "explanation": "Epidemiological census data show that over 70%�80% of disabilities are acquired during working adulthood or later life through chronic health conditions, injury, and aging, rather than being predominantly congenital at birth or disappearing upon retirement."
      },
      {
        "id": "kc-cpacc-demo-3",
        "question": "In Microsoft's Inclusive Design Persona Spectrum, a person carrying a crying baby in one arm while trying to tap a phone screen is an example of what type of constraint?",
        "options": [
          {
            "id": "A",
            "text": "A Permanent congenital impairment present continuously from early childhood"
          },
          {
            "id": "B",
            "text": "A Temporary clinical injury requiring short-term medical rehabilitation care"
          },
          {
            "id": "C",
            "text": "A Biopsychosocial diagnostic classification under the WHO ICD-11 medical code"
          },
          {
            "id": "D",
            "text": "A Situational limitation caused by the person's current environment or task"
          }
        ],
        "answer": "D",
        "explanation": "Microsoft's Inclusive Design Persona Spectrum maps functional one-arm constraints across Permanent (one arm), Temporary (arm in a cast), and Situational (new parent holding a crying baby)."
      }
    ]
  },
  {
    "id": "mod-cpacc-accommodations-ud",
    "cert": "CPACC",
    "domainId": "CPACC-D2",
    "domainLabel": "Domain 2: Accessibility & Universal Design",
    "sectionId": "CPACC-D2-A",
    "sectionLabel": "Individualized Accommodations and Universal Design",
    "citation": "IAAP CPACC BoK V3, Domain 2.A (Individualized Accommodations and Universal Design), Job Accommodation Network (JAN) & ADA Title I",
    "title": "Individual Accommodations vs Systemic Universal Design",
    "summary": "Distinguish between reactive individualized accommodations (retrofits for an individual upon medical disclosure) and proactive systemic universal design (built-in, stigma-free access for all), backed by Job Accommodation Network (JAN) cost metrics.",
    "duration": "22 mins",
    "level": "Core",
    "interactiveType": "accommodations-vs-universal-design-lab",
    "learningObjectives": [
      "Distinguish the philosophical, operational, and legal differences between individualized accommodations and universal design.",
      "Cite empirical research from the Job Accommodation Network (JAN) establishing that over 50% of workplace accommodations cost $0.",
      "Analyze the economic and social benefits of systemic universal design over continuous reactive retrofits.",
      "Apply the legal thresholds of \"Undue Hardship\" and the \"Interactive Process\" under ADA Title I and international employment conventions."
    ],
    "keyConcepts": [
      {
        "title": "Reactive Accommodation vs Proactive Universal Design",
        "explanation": "Individualized accommodations are reactive, bespoke modifications implemented only after an individual formally discloses a disability and requests adjustments (e.g. purchasing a specialized screen magnifier). Universal design is proactive and systemic—designing tools, environments, and curricula from the start so that virtually everyone can use them naturally without retrofits."
      },
      {
        "title": "JAN Workplace Cost Realities (56% Cost $0)",
        "explanation": "Hiring managers often fear that accommodating employees with disabilities requires immense financial expense. Long-term studies by the Job Accommodation Network (JAN) demonstrate that 56% of workplace accommodations cost nothing ($0), and the median one-time cost for the remaining minority is approximately $500."
      },
      {
        "title": "The Legal Threshold of \"Undue Hardship\"",
        "explanation": "Under ADA Title I and global labor statutes, an employer must provide reasonable accommodations unless doing so imposes an \"undue hardship\"—defined legally as requiring significant difficulty or expense relative to the overall financial resources, size, and operational budget of the entire employer."
      },
      {
        "title": "Privacy & The Interactive Dialogue Process",
        "explanation": "Accommodations must be determined through a collaborative, confidential \"interactive process\" between employee and employer. Inquiries and medical documentation must be strictly confined to verifying the functional limitations that impact essential job duties, protecting employee privacy."
      }
    ],
    "practicalTakeaways": [
      "Proactive universal design eliminates the need for 80% of individual accommodation requests by making standard tools accessible by default.",
      "Over 50% of workplace accommodations cost $0 (flexible hours, telework, quiet desk, existing software feature toggles).",
      "Accommodations can never be denied on financial grounds unless the cost constitutes an undue hardship on the entire organization."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-accom-1",
        "question": "According to empirical data collected by the Job Accommodation Network (JAN), what is the cost of the majority of workplace accommodations?",
        "options": [
          {
            "id": "A",
            "text": "The typical workplace accommodation requires capital expenditure above $10,000"
          },
          {
            "id": "B",
            "text": "Workplace accommodations are required by law to consume 5% of gross payroll"
          },
          {
            "id": "C",
            "text": "Workplace accommodations routinely mandate hiring a full-time dedicated personal assistant"
          },
          {
            "id": "D",
            "text": "56% of workplace accommodations cost $0, with a median cost of $500 for the rest"
          }
        ],
        "answer": "D",
        "explanation": "The Job Accommodation Network (JAN) has consistently shown that 56% of workplace accommodations have zero direct cost (such as schedule adjustments or telework), and the median one-time expenditure for those that do have a cost is approximately $500."
      },
      {
        "id": "kc-cpacc-accom-2",
        "question": "How does Universal Design differ from Individualized Accommodations in an educational or corporate environment?",
        "options": [
          {
            "id": "A",
            "text": "Accommodations provide reactive individualized retrofits; Universal Design proactively builds access"
          },
          {
            "id": "B",
            "text": "Accommodations are typically free, whereas Universal Design is often expensive"
          },
          {
            "id": "C",
            "text": "Accommodations are collective, whereas Universal Design is tailored to one person"
          },
          {
            "id": "D",
            "text": "Universal Design applies to buildings; accommodations govern operating systems"
          }
        ],
        "answer": "A",
        "explanation": "Accommodations are reactive, one-off modifications tailored to a single individual after formal disability disclosure. Universal design is proactive and systemic, creating environments and digital tools that work for the widest possible audience by default without requiring disclosure."
      },
      {
        "id": "kc-cpacc-accom-3",
        "question": "Under ADA Title I, what standard must an employer meet to lawfully deny a requested reasonable accommodation on financial grounds?",
        "options": [
          {
            "id": "A",
            "text": "The employer shows that a local department depleted its quarterly travel budget"
          },
          {
            "id": "B",
            "text": "The employer proves Undue Hardship: significant difficulty or expense to overall budget"
          },
          {
            "id": "C",
            "text": "The employer surveys department coworkers to confirm unanimous consensus approval"
          },
          {
            "id": "D",
            "text": "The employer establishes that adjusting schedules causes minor scheduling friction"
          }
        ],
        "answer": "B",
        "explanation": "An employer can only deny a reasonable accommodation under the ADA if it can demonstrate that providing it would impose an \"undue hardship\"—defined as an action requiring significant difficulty or expense when assessed against the employer's overall budget and operational resources."
      }
    ]
  },
  {
    "id": "mod-cpacc-pour-principles",
    "cert": "CPACC",
    "domainId": "CPACC-D2",
    "domainLabel": "Domain 2: Accessibility & Universal Design",
    "sectionId": "CPACC-D2-C",
    "sectionLabel": "WCAG Principles and Application",
    "citation": "IAAP CPACC BoK V3, Domain 2.C (WCAG Principles and Application), W3C WCAG 2.1/2.2 & W3C WCAG2ICT Guidance",
    "title": "WCAG POUR Principles & Non-Web ICT Application",
    "summary": "Master the four foundational pillars of digital accessibility—Perceivable, Operable, Understandable, Robust (POUR)—and learn how to apply them across web pages, mobile apps, digital documents, and closed self-service kiosks (WCAG2ICT).",
    "duration": "24 mins",
    "level": "Core",
    "interactiveType": "wcag-pour-principles-lab",
    "learningObjectives": [
      "Define each of the 4 WCAG foundational principles: Perceivable, Operable, Understandable, and Robust (POUR).",
      "Map specific user barriers and WCAG success criteria to their governing POUR principle.",
      "Apply the W3C WCAG2ICT guidance to extend POUR principles to non-web software, mobile applications, and electronic documents.",
      "Evaluate closed-functionality products (ATMs, ticketing kiosks) under Principle 1 (speech output) and Principle 2 (tactile keys)."
    ],
    "keyConcepts": [
      {
        "title": "Principle 1: Perceivable (Sensory Access)",
        "explanation": "Information and user interface components must be presentable to users in ways they can perceive; content cannot be invisible to all of a user's senses. Governs text alternatives for non-text content (1.1.1), captions and transcripts for multimedia (1.2), color contrast (1.4.3), and responsive reflow (1.4.10)."
      },
      {
        "title": "Principle 2: Operable (Interaction & Navigation)",
        "explanation": "User interface components and navigation must be operable; the interface cannot require an interaction that a user cannot perform. Governs keyboard accessibility (2.1.1), absence of keyboard traps (2.1.2), sufficient time (2.2.1), seizure prevention (2.3), and minimum touch target sizes (2.5.8)."
      },
      {
        "title": "Principle 3: Understandable (Comprehension & Predictability)",
        "explanation": "Information and the operation of the user interface must be understandable; the content or operation cannot be beyond the user's understanding. Governs language identification (3.1.1), predictable focus and input behavior (3.2.1, 3.2.2), and clear error identification and correction suggestions (3.3.1, 3.3.3)."
      },
      {
        "title": "Principle 4: Robust (Compatibility & Longevity)",
        "explanation": "Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies. Governs semantic markup, exposing accessible Name, Role, and Value for all interactive components (4.1.2), and status messages via ARIA live regions (4.1.3)."
      }
    ],
    "practicalTakeaways": [
      "Every accessibility failure maps directly back to a breakdown in one of the 4 POUR principles.",
      "Under WCAG2ICT, closed kiosks fulfill Principle 1 by providing speech output via a headphone jack because users cannot connect personal screen readers.",
      "Principle 4 (Robust) requires code to work with future assistive technologies by adhering strictly to standard platform accessibility APIs."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-pour-1",
        "question": "Which WCAG foundation principle is violated when an interactive website requires a user to perform complex multi-touch gestures (like pinching or 3-finger swiping) with no simple single-pointer alternative?",
        "options": [
          {
            "id": "A",
            "text": "Principle 3 (Understandable) requiring predictable navigation and input error help"
          },
          {
            "id": "B",
            "text": "Principle 4 (Robust) requiring valid ARIA roles and compatibility with user agents"
          },
          {
            "id": "C",
            "text": "Principle 1 (Perceivable) requiring text alternatives and sufficient color contrast"
          },
          {
            "id": "D",
            "text": "Principle 2 (Operable) requiring single-pointer alternatives to complex gestures"
          }
        ],
        "answer": "D",
        "explanation": "Principle 2 (Operable) requires that interface components and navigation be operable across input modalities, including WCAG 2.5.1 (Pointer Gestures), which mandates single-pointer alternatives to multi-point or path-based gestures."
      },
      {
        "id": "kc-cpacc-pour-2",
        "question": "Under W3C WCAG2ICT guidance, how does a closed-functionality touchscreen ticketing kiosk satisfy Principle 1 (Perceivable) for blind users who cannot install their own screen reader?",
        "options": [
          {
            "id": "A",
            "text": "By attaching a printed braille instruction booklet to the side of the metal casing"
          },
          {
            "id": "B",
            "text": "Closed hardware machines are exempt from POUR criteria under W3C guidance"
          },
          {
            "id": "C",
            "text": "By flashing high-frequency visual strobe alert lights whenever a touchscreen button is hit"
          },
          {
            "id": "D",
            "text": "By providing speech output through a 3.5mm headphone jack with tactile keypad inputs"
          }
        ],
        "answer": "D",
        "explanation": "In closed products where users cannot attach personal assistive technologies, Principle 1 (Perceivable) requires the hardware to provide built-in speech output (auditory presentation of visual content) accessible via a standard audio jack or speaker."
      },
      {
        "id": "kc-cpacc-pour-3",
        "question": "When a web application uses non-standard HTML <div> tags to build custom tabs and buttons without exposing their ARIA role, name, or expanded state to assistive technologies, which POUR principle is violated?",
        "options": [
          {
            "id": "A",
            "text": "Principle 1 (Perceivable) ensuring interface colors match brand visual standards"
          },
          {
            "id": "B",
            "text": "Principle 2 (Operable) providing enough time for users to read moving carousels"
          },
          {
            "id": "C",
            "text": "Principle 3 (Understandable) ensuring manuals are written at a middle-school level"
          },
          {
            "id": "D",
            "text": "Principle 4 (Robust) requiring semantic Name, Role, and Value exposure to AT APIs"
          }
        ],
        "answer": "D",
        "explanation": "Principle 4 (Robust) mandates that content can be reliably interpreted by user agents and assistive technologies; WCAG 4.1.2 (Name, Role, Value) requires custom widgets to expose their role and state programmatically."
      }
    ]
  },
  {
    "id": "mod-cpacc-ict-procurement",
    "cert": "CPACC",
    "domainId": "CPACC-D3",
    "domainLabel": "Domain 3: Standards, Laws & Management",
    "sectionId": "CPACC-D3-E",
    "sectionLabel": "Applying Accessibility Standards and Regulations to ICT",
    "citation": "IAAP CPACC BoK V3, Domain 3.E (Applying Accessibility Standards and Regulations to ICT), Section 508 (36 CFR 1194) & EN 301 549 V3.2.1",
    "title": "Applying Standards to ICT & Technical Specifications",
    "summary": "Master the scoping and application of digital accessibility standards across information and communication technology (ICT): Section 508, EN 301 549, closed functionality kiosks, Real-Time Text (RTT), and procurement RFP requirements.",
    "duration": "24 mins",
    "level": "Core",
    "interactiveType": "ict-standards-procurement-lab",
    "learningObjectives": [
      "Identify how technical accessibility standards apply across diverse ICT domains: web, electronic documents, non-web software, telecommunications, and closed hardware.",
      "Explain the global harmonization of Section 508, EN 301 549, and JIS X 8341-3 around W3C WCAG 2.1 Level AA.",
      "Evaluate specific requirements for closed functionality products (Section 508 Chapter 4 / EN 301 549 Clause 5), including audio output and tactile orientation.",
      "Draft and enforce contractual accessibility specifications, VPAT/ACR evaluation criteria, and remediation service level agreements (SLAs)."
    ],
    "keyConcepts": [
      {
        "title": "Global Technical Harmonization (WCAG 2.1 AA)",
        "explanation": "Rather than maintaining divergent national standards, major global procurement frameworks—including US Revised Section 508, European Standard EN 301 549, and Japanese Standard JIS X 8341-3—have harmonized around W3C WCAG 2.1 Level AA as their unified technical core."
      },
      {
        "title": "Closed Functionality Hardware (Kiosks, ATMs, Printers)",
        "explanation": "Closed functionality refers to ICT where users cannot attach their own assistive technologies or install software. Standards mandate that closed systems must provide built-in speech output, standard 3.5mm audio jacks, volume amplification (up to 20 dB gain), tactile key markers (dot on the \"5\"), and operable reach ranges between 15\" and 48\" above the floor."
      },
      {
        "title": "Real-Time Text (RTT) for Telecommunications",
        "explanation": "Under Section 508 Section 412 and EN 301 549 Clause 6, two-way voice communication systems must support Real-Time Text (RTT). Unlike conventional messaging where text is transmitted after clicking \"send\", RTT transmits characters instantaneously as typed, enabling natural conversation and vital 911 emergency communication."
      },
      {
        "title": "Procurement Governance & Contractual SLAs",
        "explanation": "Procuring accessible ICT requires embedding technical requirements into Requests for Proposals (RFPs), evaluating vendor Accessibility Conformance Reports (ACRs), and binding vendors to contractual warranties with mandatory 30-to-60-day defect remediation SLAs at the vendor's expense."
      }
    ],
    "practicalTakeaways": [
      "WCAG 2.1 AA applies not just to websites, but across PDFs, native mobile apps, desktop software, and closed self-service hardware.",
      "Closed products must provide built-in speech synthesis and an audio jack because users cannot run personal screen readers on them.",
      "Never accept a vendor VPAT at face value without an enforceable contractual remediation SLA in the Master Services Agreement."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-cpacc-ict-1",
        "question": "Under US Revised Section 508 Chapter 4 and European Standard EN 301 549 Clause 5, what must a closed-functionality ATM or self-service airport kiosk provide for blind users?",
        "options": [
          {
            "id": "A",
            "text": "A dedicated telephone handset connecting users to customer support personnel"
          },
          {
            "id": "B",
            "text": "A printed braille document binder cataloging every possible interactive screen"
          },
          {
            "id": "C",
            "text": "An analog optical magnifying lens attached to the kiosk casing with security wire"
          },
          {
            "id": "D",
            "text": "Speech output, 3.5mm headphone jack, volume control, and tactile keys"
          }
        ],
        "answer": "D",
        "explanation": "Because users cannot connect their own assistive technology to closed hardware, standards mandate built-in speech output accessible via a standard audio jack, volume control, and physical tactile keys (such as a raised dot on the \"5\" key)."
      },
      {
        "id": "kc-cpacc-ict-2",
        "question": "What is the primary technical baseline that harmonizes US Section 508, European EN 301 549, and Japanese JIS X 8341-3 across web content and software?",
        "options": [
          {
            "id": "A",
            "text": "IEEE 802.11ac Wireless Networking Standards for Local Area Computer Networks"
          },
          {
            "id": "B",
            "text": "ANSI Z87.1 Occupational and Educational Personal Eye Protection Standards"
          },
          {
            "id": "C",
            "text": "Bluetooth SIG Core Specification 5.2 Low Energy Audio Operating Profiles"
          },
          {
            "id": "D",
            "text": "W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA conformance"
          }
        ],
        "answer": "D",
        "explanation": "Global digital accessibility standards are unified around W3C WCAG 2.1 Level AA, which forms the normative technical benchmark for Section 508, EN 301 549, and JIS X 8341-3."
      },
      {
        "id": "kc-cpacc-ict-3",
        "question": "Why is Real-Time Text (RTT) mandated for two-way voice telecommunications under Section 508 Section 412 and EN 301 549 Clause 6?",
        "options": [
          {
            "id": "A",
            "text": "Because RTT reduces cellular voice licensing fees and network bandwidth overhead"
          },
          {
            "id": "B",
            "text": "Because RTT automatically archives phone conversations for regulatory review"
          },
          {
            "id": "C",
            "text": "Because RTT transmits characters as typed, enabling real-time conversation cadence"
          },
          {
            "id": "D",
            "text": "Because RTT prevents users from sending SMS messages during peak working hours"
          }
        ],
        "answer": "C",
        "explanation": "RTT transmits characters as they are being typed in real-time without buffering, enabling immediate two-way conversational flow, life-saving 911 responsiveness, and full communication parity for deaf and speech-disabled individuals."
      }
    ]
  }
];
