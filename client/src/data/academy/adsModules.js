// IAAP ADS (Accessible Document Specialist) Modules
export const ADS_MODULES = [
  {
    "id": "mod-ads-alt-text",
    "cert": "ADS",
    "domainId": "ADS-D2",
    "domainLabel": "Domain 2: Remediating Electronic Documents",
    "sectionId": "ADS-D2-A",
    "title": "Alternative Text & Graphic Classification",
    "badge": "Document Remediation",
    "difficulty": "Beginner",
    "estimatedMinutes": 9,
    "interactiveType": "alt-text-decision-tree",
    "citation": "ADS BoK 2021, Section 2.1 (Implement alternative text) & WCAG 1.1.1",
    "summary": "Master the alt-text decision tree for documents (PDF, Word, InDesign). Learn when an image is purely decorative (`alt=\"\"` / `/Artifact`), functional (icon button), informative (photo), or complex (charts and graphs).",
    "learningObjectives": [
      "Apply the W3C Alt-Text Decision Tree to determine appropriate alternative text for electronic documents.",
      "Differentiate between decorative images marked as `/Artifact` and informative content requiring alt text.",
      "Write concise, context-rich alternative text without redundant phrases like \"image of\" or \"picture of\".",
      "Provide dual-layer descriptions for complex infographics (short summary alt text + comprehensive data table/caption)."
    ],
    "keyConcepts": [
      {
        "title": "Decorative Images (`alt=\"\"` or `/Artifact`)",
        "explanation": "Images that add purely visual flair (background waves, horizontal separator lines, decorative icons next to text). In PDF/UA, decorative elements MUST be marked as Artifacts so screen readers ignore them."
      },
      {
        "title": "Functional Images",
        "explanation": "Images that trigger an action or serve as a link. The alt text must describe the PURPOSE or DESTINATION of the action, not the visual appearance (e.g. `alt=\"Search\"` not `alt=\"Magnifying glass\"`)."
      },
      {
        "title": "Informative Images",
        "explanation": "Images that convey meaningful concept or information. Describe the key meaning or emotion concisely. Avoid \"Image of...\" or \"Graphic showing...\"."
      },
      {
        "title": "Complex Images (Charts & Graphs)",
        "explanation": "A short alt text gives the high-level takeaway (e.g. \"Bar chart of Q3 sales showing 25% growth in Europe\"). A full text equivalent (table or paragraph) must be provided in the document body."
      }
    ],
    "examTips": "In PDF accessibility (PDF/UA), an image MUST either have alternative text OR be marked as an Artifact. Having an untagged image or an image with no alt and no artifact tag is a critical PAC / PDF-UA validation failure.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-alt-1",
        "question": "An electronic PDF newsletter has a decorative wavy swoosh divider between sections. How should this element be handled in PDF tagging?",
        "options": [
          {
            "id": "A",
            "text": "Mark it as an /Artifact so assistive technologies ignore decorative shapes during reading"
          },
          {
            "id": "B",
            "text": "Assign alternative text describing it: alt=\"Decorative wavy graphic divider\""
          },
          {
            "id": "C",
            "text": "Tag it as an empty sub-heading structure tag (<H3></H3>) to preserve vertical spacing"
          },
          {
            "id": "D",
            "text": "Delete the divider from the print layout to avoid PDF tagging structural issues"
          }
        ],
        "answer": "A",
        "explanation": "In PDF/UA and accessible document authoring, purely decorative graphics must be tagged as `/Artifact` so screen readers do not announce useless noise."
      },
      {
        "id": "kc-ads-alt-2",
        "question": "A button displays only a printer icon without any visible text. What should the alternative text be?",
        "options": [
          {
            "id": "A",
            "text": "alt=\"Print this document\" (describing the action performed upon activation)"
          },
          {
            "id": "B",
            "text": "alt=\"\" (empty string marking the functional control as decorative background)"
          },
          {
            "id": "C",
            "text": "alt=\"Button graphic icon depicting hardware machinery for document output\""
          },
          {
            "id": "D",
            "text": "alt=\"Detailed high-resolution visual rendering of a black office inkjet printer\""
          }
        ],
        "answer": "A",
        "explanation": "For a functional image inside a link or button, the alt text must state the destination or action (e.g., \"Download Annual Report PDF\"), rather than describing visual iconography/resolution, using an empty alt=\"\" string (which hides the link target), or repeating raw filenames."
      },
      {
        "id": "kc-ads-alt-3",
        "question": "Which is the recommended practice for a complex statistical chart in an accessible annual report?",
        "options": [
          {
            "id": "A",
            "text": "Paste a comprehensive 1,000-word descriptive essay directly into the /Alt attribute"
          },
          {
            "id": "B",
            "text": "Provide a concise summary in alt text and a full accessible data table in the document"
          },
          {
            "id": "C",
            "text": "Mark the complex statistical chart as an /Artifact to reduce screen reader output"
          },
          {
            "id": "D",
            "text": "Replace the chart visual with a raster screenshot of the raw statistical source code"
          }
        ],
        "answer": "B",
        "explanation": "Complex graphics require a two-part approach: a brief summary in the alt text and a complete, accessible textual representation (such as a data table) in the document body."
      }
    ]
  },
  {
    "id": "mod-ads-tag-tree",
    "cert": "ADS",
    "domainId": "ADS-D2",
    "domainLabel": "Domain 2: Remediating Electronic Documents",
    "sectionId": "ADS-D2-B",
    "title": "Document Structure & PDF Tag Tree Remediation",
    "badge": "Document Remediation",
    "difficulty": "Intermediate",
    "estimatedMinutes": 11,
    "interactiveType": "pdf-tag-tree-fixer",
    "citation": "ADS BoK 2021, Section 2.2 (Review and correct structure) & ISO 14289-1 (PDF/UA)",
    "summary": "Master PDF/UA logical structure trees. Identify and fix common tagging defects: skipped heading levels (`<H1>` to `<H4>`), missing table header tags (`<TH scope=\"col\">`), untagged content, tagging decorative elements as `/Artifact`, and reading order mismatches.",
    "learningObjectives": [
      "Understand the role of the PDF logical structure tree in PDF/UA ISO 14289 conformance.",
      "Detect and correct skipped heading levels (`<H1>` directly to `<H3>`) to maintain hierarchical navigation.",
      "Tag decorative graphic elements (separators, watermarks, background shapes) as `/Artifact` to prevent screen reader clutter and PAC errors.",
      "Ensure data tables have `<TH>` headers with scope attributes, separating tabular data from layout tables.",
      "Verify reading order between the visual document layout, the tag tree, and the architectural Content stream."
    ],
    "keyConcepts": [
      {
        "title": "The Logical Tag Tree",
        "explanation": "Assistive technologies do not read visual pixels in a PDF; they traverse the logical Tag Tree (`<Document>`, `<Part>`, `<Sect>`, `<H1>`, `<P>`, `<Table>`, `<L>`). Without tags, a PDF is completely inaccessible to screen readers."
      },
      {
        "title": "Decorative Content & /Artifact Tagging",
        "explanation": "Under ISO 14289-1 (PDF/UA), all content in a PDF must either be semantically tagged or explicitly marked as an `/Artifact`. Decorative dividers, background shapes, and non-meaningful graphics must be artifacted so screen readers ignore them and automated tools like PAC do not flag untagged content."
      },
      {
        "title": "Heading Hierarchy Integrity",
        "explanation": "Headings must follow a strict logical hierarchy (`<H1>` -> `<H2>` -> `<H3>`). Never skip heading levels for visual styling (e.g. jumping from `<H1>` to `<H4>`)."
      },
      {
        "title": "Table Tag Semantics",
        "explanation": "Accessible tables require `<Table>`, `<TR>`, `<TH>` (table headers), and `<TD>` (table data). Column and row headers must be tagged with `<TH>` and associated with data cells."
      },
      {
        "title": "PDF/UA & PAC Validation",
        "explanation": "PDF/UA (ISO 14289-1) is the international technical standard for accessible PDF. Free tools like PAC (PDF Accessibility Checker) test machine-verifiable criteria."
      }
    ],
    "examTips": "ADS exam alert: In Adobe Acrobat Pro, there is a visual \"Order Panel\" and a \"Tags Panel\". In PDF/UA, screen readers read from the TAGS TREE, not the Order panel! Always ensure the Tags Tree reflects the correct reading flow.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-tag-1",
        "question": "When remediating a PDF document, which panel determines the exact reading order and semantic structure interpreted by modern screen readers?",
        "options": [
          {
            "id": "A",
            "text": "The visual z-index arrangement of layers in graphic design software"
          },
          {
            "id": "B",
            "text": "The physical coordinates of text bounding boxes from top-left to bottom-right"
          },
          {
            "id": "C",
            "text": "The Logical Structure Tree (Tags panel) dictates the screen reader reading order"
          },
          {
            "id": "D",
            "text": "The chronological timestamp when each text block was typed by the author"
          }
        ],
        "answer": "C",
        "explanation": "Under ISO 14289-1 (PDF/UA), screen readers rely exclusively on the logical Tags Tree structure to read content and announce semantics."
      },
      {
        "id": "kc-ads-tag-2",
        "question": "A document jumps directly from an <H1> title to an <H4> subhead because the author wanted a smaller font size. What is the proper remediation?",
        "options": [
          {
            "id": "A",
            "text": "Change the tag to <H2> and adjust the visual font styling in the authoring tool"
          },
          {
            "id": "B",
            "text": "Retain the <H4> tag because visual font styling takes precedence over hierarchy"
          },
          {
            "id": "C",
            "text": "Remove heading structural semantics and convert the paragraph text into bold copy"
          },
          {
            "id": "D",
            "text": "Insert empty structural heading tags (<H2></H2><H3></H3>) to bridge the skipped numerical gap"
          }
        ],
        "answer": "A",
        "explanation": "Heading levels must strictly follow a logical numerical hierarchy without skipping levels. Visual styling should be adjusted via styles or fonts, not by distorting semantic tags."
      },
      {
        "id": "kc-ads-tag-3",
        "question": "What is required for a data table to be considered accessible in PDF/UA?",
        "options": [
          {
            "id": "A",
            "text": "Header cells must be tagged as <TH> with Scope attributes defining data cell associations"
          },
          {
            "id": "B",
            "text": "Table cells must be tagged strictly as <TD> data cells with no header tags"
          },
          {
            "id": "C",
            "text": "Data tables are restricted from containing currency numbers or statistical symbols"
          },
          {
            "id": "D",
            "text": "The entire data table must be rasterized into a flat bitmap figure with an alternative text string"
          }
        ],
        "answer": "A",
        "explanation": "Data tables require header cells tagged as `<TH>` with scope, allowing screen readers to correlate data cells with their respective column and row headers."
      }
    ]
  },
  {
    "id": "mod-ads-testing-pac",
    "cert": "ADS",
    "domainId": "ADS-D3",
    "domainLabel": "Domain 3: Auditing & Testing Documents",
    "sectionId": "ADS-D3-A",
    "title": "Automated vs Manual Document Auditing (PAC & Screen Readers)",
    "badge": "Auditing & QA",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "interactiveType": "pac-automated-audit-lab",
    "citation": "ADS BoK 2021, Section 3.1 & 3.3 (Testing Processes & Limitations)",
    "summary": "Evaluate the boundaries of automated document testing tools (PAC, Adobe Acrobat Accessibility Checker) versus manual testing with assistive technologies (NVDA, JAWS).",
    "learningObjectives": [
      "Run and interpret automated validation reports from PAC (PDF Accessibility Checker).",
      "Recognize what automated accessibility checkers CAN test (missing alt attributes, tag presence, contrast).",
      "Recognize what automated checkers CANNOT test (alt-text accuracy, logical reading order sense, table header relevance).",
      "Execute screen reader testing protocols in Adobe Acrobat Pro and Microsoft Word."
    ],
    "keyConcepts": [
      {
        "title": "PAC (PDF Accessibility Checker)",
        "explanation": "Industry gold standard automated validator for PDF/UA ISO 14289 conformance and Matterhorn Protocol checkpoint testing."
      },
      {
        "title": "Limitations of Automated Testing",
        "explanation": "Automated tools can only verify that an alt attribute EXISTS; they cannot verify whether `alt=\"image123.jpg\"` is accurate or meaningful. Manual human testing is always required."
      },
      {
        "title": "The Matterhorn Protocol",
        "explanation": "Catalog of 31 checkpoints and 136 failure conditions for PDF/UA conformance, explicitly identifying which items can be tested by software and which require human inspection."
      }
    ],
    "examTips": "Exam classic: \"An automated tool reports 0 accessibility errors on a document. Does this guarantee the document is accessible?\" Never! Automated tools cannot verify context, meaning, or reading clarity.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-test-1",
        "question": "Which of the following can automated PDF testing tools reliably detect without human intervention?",
        "options": [
          {
            "id": "A",
            "text": "Whether the alternative text conveys the emotional intent of an editorial photo"
          },
          {
            "id": "B",
            "text": "Whether narrative paragraphs are written in concise, readable plain language"
          },
          {
            "id": "C",
            "text": "Whether the reading order sequence makes logical sense across complex columns"
          },
          {
            "id": "D",
            "text": "Whether an image tag lacks an /Alt property string in document structural syntax"
          }
        ],
        "answer": "D",
        "explanation": "Automated tools can check for the physical presence or absence of alt text and tags, but human judgment is required to evaluate accuracy, quality, and logic."
      },
      {
        "id": "kc-ads-test-2",
        "question": "What is the Matterhorn Protocol?",
        "options": [
          {
            "id": "A",
            "text": "A technical specification categorizing PDF/UA failure conditions for testing"
          },
          {
            "id": "B",
            "text": "A digital encryption standard for transmitting confidential PDF documents"
          },
          {
            "id": "C",
            "text": "A typographic formatting standard for commercial digital publishing software"
          },
          {
            "id": "D",
            "text": "An international copyright convention governing cross-border distribution of braille publications"
          }
        ],
        "answer": "A",
        "explanation": "The Matterhorn Protocol (published by the PDF Association) catalogs 31 checkpoints and 136 failure conditions for ISO 14289-1 (PDF/UA), rather than serving as an international braille copyright treaty, a browser rendering specification, or a digital encryption standard."
      },
      {
        "id": "kc-ads-test-3",
        "question": "Why must manual screen reader testing be performed on electronic documents even after automated check passes?",
        "options": [
          {
            "id": "A",
            "text": "To verify reading order, table announcements, and alt text equivalence in speech"
          },
          {
            "id": "B",
            "text": "Automated validators run on Windows operating system desktop environments"
          },
          {
            "id": "C",
            "text": "Because Adobe Acrobat Pro terms of service prohibit automated validator scripts"
          },
          {
            "id": "D",
            "text": "Screen readers automatically reconstruct broken tag trees while reading the document aloud"
          }
        ],
        "answer": "A",
        "explanation": "Manual testing with assistive technologies ensures the synthesized speech and navigation actually make sense to real human users in practical usage."
      }
    ]
  },
  {
    "id": "mod-ads-plain-language",
    "cert": "ADS",
    "domainId": "ADS-D1",
    "domainLabel": "Domain 1: Creating Electronic Documents",
    "sectionId": "ADS-D1-A",
    "title": "Writing Accessible Content, Plain Language & Hyperlinks",
    "badge": "Document Remediation",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "interactiveType": "plain-language-links-fixer",
    "citation": "ADS BoK 2021, Section 1.1 (Write accessible inclusive content) & WCAG 2.4.4",
    "summary": "Author documents with crystal-clear readability: Eliminate non-descriptive links (\"click here\"), apply plain language principles, and construct scannable lists and headings.",
    "learningObjectives": [
      "Remediate ambiguous link text into self-descriptive phrases containing target destination and document format.",
      "Simplify dense bureaucratic writing to Grade 8 reading levels per the Plain Writing Act.",
      "Structure lists using genuine semantic list formatting rather than manually typed asterisks or hyphens."
    ],
    "keyConcepts": [
      {
        "title": "Descriptive Hyperlink Text",
        "explanation": "Links must describe their destination even when read completely out of context. Instead of \"Click here for report\", use \"Download the 2025 Annual Diversity Report (PDF)\"."
      },
      {
        "title": "Plain Language Principles",
        "explanation": "Write in active voice, use short paragraphs (1 idea per paragraph), choose familiar everyday words, and target a reading age accessible to users with cognitive limitations."
      },
      {
        "title": "Semantic Lists vs Text Glyphs",
        "explanation": "Always use native numbered and bulleted lists in authoring tools (Word, Google Docs, InDesign). Typing a dash or asterisk does not communicate list item counts to screen readers."
      }
    ],
    "examTips": "ADS exam favorite: What should a link do when it downloads a non-HTML file like a PDF or Word document? It should explicitly state the file format and size in the link text or accessible name (e.g., \"[PDF, 2 MB]\").",
    "knowledgeCheck": [
      {
        "id": "kc-ads-pl-1",
        "question": "Which of the following represents the most accessible hyperlink text in an electronic document?",
        "options": [
          {
            "id": "A",
            "text": "Download Employee Benefits Guide 2025 (PDF, 1.2 MB)"
          },
          {
            "id": "B",
            "text": "Click Here to open the new corporate human resources benefits document"
          },
          {
            "id": "C",
            "text": "https://benefits.example.com/download/secure?doc_id=984128&format=pdf"
          },
          {
            "id": "D",
            "text": "Read More about our comprehensive organization policies and annual plans"
          }
        ],
        "answer": "A",
        "explanation": "Accessible links clearly state the destination, subject, file format, and file size so users know exactly what will occur when activated."
      },
      {
        "id": "kc-ads-pl-2",
        "question": "Why should document authors use native list formatting instead of typing manual dashes or asterisks?",
        "options": [
          {
            "id": "A",
            "text": "Native list tools generate semantic <L>/<LI> tags, announcing count and position"
          },
          {
            "id": "B",
            "text": "Manual dashes prevent automated spellcheck tools from parsing sentence grammar"
          },
          {
            "id": "C",
            "text": "Manual dashes violate ISO PDF/A long-term digital preservation standards"
          },
          {
            "id": "D",
            "text": "Hyphenated bullet characters trigger PostScript rasterization failures on office laser printers"
          }
        ],
        "answer": "A",
        "explanation": "Native list formatting tags items semantically (`<L>`, `<LI>`, `<Lbl>`, `<LBody>`), allowing assistive technology to announce \"List with 5 items, item 1\"."
      },
      {
        "id": "kc-ads-pl-3",
        "question": "What is the primary benefit of adhering to plain language standards in electronic documents?",
        "options": [
          {
            "id": "A",
            "text": "It aids readers with cognitive disabilities, non-native speakers, and broader readers"
          },
          {
            "id": "B",
            "text": "It strips visual font styling, colors, and margins from document page layouts"
          },
          {
            "id": "C",
            "text": "It eliminates the mandatory requirement for providing alternative text on illustrations"
          },
          {
            "id": "D",
            "text": "It enables electronic PDF documents to be indexed faster by automated OCR scanning software"
          }
        ],
        "answer": "A",
        "explanation": "Plain language directly aids comprehension for people with intellectual disabilities, dyslexia, or ADHD, while simultaneously boosting reading speed and clarity for everyone."
      }
    ]
  },
  {
    "id": "mod-ads-ocr-remediation",
    "cert": "ADS",
    "domainId": "ADS-D2",
    "domainLabel": "Domain 2: Remediating Electronic Documents",
    "sectionId": "ADS-D2-E",
    "title": "Optical Character Recognition (OCR) & Scanned Document Remediation",
    "badge": "Scanned Document Remediation",
    "difficulty": "Intermediate",
    "estimatedMinutes": 12,
    "interactiveType": "ocr-document-remediator",
    "citation": "IAAP ADS BoK 2021, Section 2.5 (Use OCR) & ISO 14289-1 (PDF/UA-1)",
    "summary": "Remediate scanned paper documents and image-only PDFs into fully accessible PDF/UA files. Understand OCR limitations, proofread and correct optical glyph misrecognitions (1 vs l, 0 vs O, rn vs m), define document natural languages, and transform raw OCR text into structured PDF/UA tag trees.",
    "learningObjectives": [
      "Explain why a scanned PDF without OCR is completely inaccessible to assistive technology (0% PAC conformance).",
      "Understand the difference between \"Searchable Image\" (OCR text layer behind pixels) and fully tagged PDF/UA-1.",
      "Identify and correct high-frequency optical recognition glyph errors that distort screen reader pronunciation.",
      "Assign document natural language metadata (xml:lang) to ensure accurate screen reader speech synthesis engines.",
      "Structure OCR text layers into semantic PDF tags (<H1>, <H2>, <P>, <Table>, <L>) to pass ISO 14289-1 validation."
    ],
    "keyConcepts": [
      {
        "title": "The \"Searchable Image\" Myth",
        "explanation": "Running OCR in Acrobat generates a \"Searchable Image\" (an invisible text layer placed behind the scanned bitmap). While this enables text searching, IT IS NOT YET ACCESSIBLE under PDF/UA because it lacks structure tags, reading order, and table semantics."
      },
      {
        "title": "Optical Glyph Misrecognitions",
        "explanation": "OCR engines work via pattern matching on pixel clusters. Visual artifacts, speckles, or font ligatures routinely cause misreadings: \"rn\" becomes \"m\", \"cl\" becomes \"d\", \"1\" becomes \"l\", and \"O\" becomes \"0\". Uncorrected glyphs cause severe screen reader pronunciation distortion."
      },
      {
        "title": "Language Tagging (PDF/UA 7.2)",
        "explanation": "ISO 14289-1 mandates that the natural language of all text content must be specified (e.g. en-US, es-ES). Without language tags, screen readers use default synthesizer phonetics, rendering foreign or localized text unintelligible."
      },
      {
        "title": "Document Structuring",
        "explanation": "Once OCR text is proofread, it must be tagged. Headings must be nested (<H1> to <H2>), lists must use <L> and <LI>, and background paper artifacts must be marked as /Artifact."
      }
    ],
    "examTips": "ADS Exam Alert: Remember that running OCR is necessary but NOT sufficient for PDF/UA conformance. An exam question asking \"Is a scanned PDF accessible once OCR has been run?\" has the answer NO — it still requires manual proofreading for glyph errors, document language declaration, and logical tag tree structuring.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-ocr-1",
        "question": "Why is running Optical Character Recognition (OCR) alone insufficient to make a scanned PDF accessible under PDF/UA (ISO 14289-1)?",
        "options": [
          {
            "id": "A",
            "text": "OCR generates raw text; it does not tag headings, tables, reading order, or language"
          },
          {
            "id": "B",
            "text": "OCR rasterizes vector typography into low-resolution bitmap character layers"
          },
          {
            "id": "C",
            "text": "Screen reader software cannot process any PDF document containing raster images"
          },
          {
            "id": "D",
            "text": "Optical Character Recognition software is disallowed under federal Section 508 ICT standards"
          }
        ],
        "answer": "A",
        "explanation": "Optical Character Recognition converts scanned page bitmaps into selectable text characters, but it does not reliably generate PDF/UA semantic tags (<H1>, <Table>, <L>), verify logical reading order, or set document language metadata without human remediation."
      },
      {
        "id": "kc-ads-ocr-2",
        "question": "Which high-frequency OCR transcription defect can severely impair screen reader pronunciation if left uncorrected?",
        "options": [
          {
            "id": "A",
            "text": "Look-alike glyph errors (e.g. mistaking \"rn\" for \"m\", or \"1\" for lowercase \"l\")"
          },
          {
            "id": "B",
            "text": "Lossless vector path compression artifacts in technical architectural drawings"
          },
          {
            "id": "C",
            "text": "Automatic font subset embedding errors during document print spooling"
          },
          {
            "id": "D",
            "text": "Excessive scanning DPI resolution in underlying bitmap document background layers"
          }
        ],
        "answer": "A",
        "explanation": "Optical character engines frequently confuse visually similar character pairs (such as \"rn\" vs \"m\" or \"1\" vs \"l\"), causing screen reader text-to-speech synthesizers to mispronounce words."
      },
      {
        "id": "kc-ads-ocr-3",
        "question": "Under ISO 14289-1 (PDF/UA), what metadata attribute must be defined for an OCR-remediated document so that screen readers pronounce words with correct phonetics?",
        "options": [
          {
            "id": "A",
            "text": "The document primary natural language (e.g. en-US or fr-FR) for pronunciation"
          },
          {
            "id": "B",
            "text": "The personal employee identification number of the scanning machine operator"
          },
          {
            "id": "C",
            "text": "The color separation profile (CMYK vs RGB) for commercial print machinery"
          },
          {
            "id": "D",
            "text": "The optical dots-per-inch (DPI) scanner hardware resolution calibrated when capturing the page"
          }
        ],
        "answer": "A",
        "explanation": "PDF/UA requires the document natural language to be explicitly specified so screen readers activate the correct phonetic pronunciation rules and accent engines."
      }
    ]
  },
  {
    "id": "mod-ads-authoring-format",
    "cert": "ADS",
    "domainId": "ADS-D2",
    "domainLabel": "Domain 2: Remediating Electronic Documents",
    "sectionId": "ADS-D2-D",
    "title": "Remediating Documents in Authoring Formats (Word & InDesign)",
    "badge": "Source Remediation",
    "difficulty": "Intermediate",
    "estimatedMinutes": 12,
    "interactiveType": "authoring-format-remediator",
    "citation": "IAAP ADS BoK 2021, Section 2.4 (Remediate in authoring format) & ISO 14289-1 (PDF/UA)",
    "summary": "Remediate accessibility defects directly in source authoring applications (Microsoft Word, Adobe InDesign, Google Docs) before PDF export. Master built-in paragraph styles, \"Repeat as Header Row\" for data tables, InDesign Export Tagging rules, and embedded graphic metadata to ensure repeatable, permanent PDF/UA conformance.",
    "learningObjectives": [
      "Explain why remediating document accessibility in source authoring tools is exponentially more sustainable than downstream PDF touchups.",
      "Replace visual font bolding/resizing with native Heading Styles (Heading 1, Heading 2) in Microsoft Word and InDesign.",
      "Configure multi-page table properties (\"Repeat as Header Row at Top of Each Page\") to generate valid PDF/UA <TH> headers.",
      "Configure Adobe InDesign Paragraph Style Export Tagging to map custom print layouts to semantic PDF tags (<Aside>, <BlockQuote>).",
      "Embed alternative text directly into source image object properties to persist across all future PDF document revisions."
    ],
    "keyConcepts": [
      {
        "title": "The Fragility of Downstream PDF Remediation",
        "explanation": "Remediating a PDF in Adobe Acrobat Pro modifies only the exported PDF tag tree. If an author later edits a single typo in Microsoft Word or InDesign and re-exports, ALL downstream Acrobat tags, alt text, and reading order touchups are completely overwritten and lost."
      },
      {
        "title": "Native Heading Styles vs Visual Bolding",
        "explanation": "Changing font size to 24pt and bolding text creates visually large text, but exports to a <P> (paragraph) tag in PDF. Applying true built-in styles (Heading 1, Heading 2) maps automatically to <H1> and <H2> in the exported PDF tag tree."
      },
      {
        "title": "Accessible Data Tables in Word",
        "explanation": "To pass PDF/UA table requirements from Word, tables must have a designated header row with \"Repeat as header row at the top of each page\" checked in Table Properties, and \"Allow row to break across pages\" unchecked for data consistency."
      },
      {
        "title": "InDesign Export Tagging",
        "explanation": "Professional desktop publishing layouts often use non-standard style names (e.g., \"PullQuote_Red\", \"Sidebar_Note\"). In InDesign, the Export Tagging panel allows creators to explicitly map styles to semantic PDF tags (<BlockQuote>, <Aside>, <H1>, <P>)."
      }
    ],
    "examTips": "ADS Exam Alert: Remember that source remediation is the primary defense against the \"Re-Export Trap\". When a question asks how to handle recurring quarterly reports, the correct strategy is ALWAYS configuring templates and styles in the authoring tool (Word/InDesign), never manually re-tagging the PDF in Acrobat every quarter.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-auth-1",
        "question": "Why is remediating accessibility in source authoring files (Word/InDesign) preferred over fixing tags downstream in Adobe Acrobat Pro?",
        "options": [
          {
            "id": "A",
            "text": "Source authoring files inherently have smaller file sizes than exported PDFs"
          },
          {
            "id": "B",
            "text": "Re-exporting from source authoring files overwrites custom Acrobat tag tree fixes"
          },
          {
            "id": "C",
            "text": "Federal Section 508 standards strictly prohibit editing PDFs post-export"
          },
          {
            "id": "D",
            "text": "Adobe Acrobat Pro lacks tools to create or modify <H1> and <H2> heading tags in the tag tree"
          }
        ],
        "answer": "B",
        "explanation": "Remediating in the source authoring tool (Word or InDesign) preserves native heading styles, table headers, and export templates across future revisions, whereas manual tag-tree edits inside Adobe Acrobat Pro must be redone whenever the source document is re-exported."
      },
      {
        "id": "kc-ads-auth-2",
        "question": "In Microsoft Word, what action is necessary to ensure a table spanning multiple pages exports to PDF with valid <TH> table header tags on every page?",
        "options": [
          {
            "id": "A",
            "text": "Export the multi-page data table as a sequence of static PNG figures with descriptive alt text"
          },
          {
            "id": "B",
            "text": "In Word Table Properties, check \"Repeat as header row at the top of each page\""
          },
          {
            "id": "C",
            "text": "Manually copy and paste the header row text at the top of each page break"
          },
          {
            "id": "D",
            "text": "Draw a thick visual border around the top row to designate header semantics"
          }
        ],
        "answer": "B",
        "explanation": "Enabling \"Repeat Header Rows\" in the authoring table properties ensures column headers repeat across page breaks and export as semantic <THead>/<TH> tags, unlike pasting manual duplicate rows mid-table, splitting tables into separate frames, or converting tables into static PNG images."
      },
      {
        "id": "kc-ads-auth-3",
        "question": "In Adobe InDesign, what feature must be configured so that custom paragraph styles (such as \"Feature_Callout\") export to semantic PDF tags like <Aside> instead of generic <Div> tags?",
        "options": [
          {
            "id": "A",
            "text": "The Object State Manager configuring interactive multi-state presentation buttons"
          },
          {
            "id": "B",
            "text": "Export Tagging in InDesign Paragraph Style Options (mapping styles to PDF tags)"
          },
          {
            "id": "C",
            "text": "The InDesign Preflight Panel configuring automated document print profiles"
          },
          {
            "id": "D",
            "text": "The InDesign Glyphs Panel inserting specialized typographic Unicode symbols"
          }
        ],
        "answer": "B",
        "explanation": "InDesign's Export Tagging tab in Paragraph Style Options enables designers to explicitly map custom print styles to semantic PDF/UA tags."
      }
    ]
  },
  {
    "id": "mod-ads-testing-limitations",
    "cert": "ADS",
    "domainId": "ADS-D3",
    "domainLabel": "Domain 3: Auditing and Testing Document Accessibility",
    "sectionId": "ADS-D3-C",
    "title": "Limitations of Automated Testing & Assistive Tech Document Auditing",
    "badge": "Audit Limitations",
    "difficulty": "Intermediate",
    "estimatedMinutes": 12,
    "interactiveType": "automated-testing-limitations-lab",
    "citation": "IAAP ADS BoK 2021, Section 3.3 (Identify limitations of automated testing) & ISO 14289-1 (PDF/UA)",
    "summary": "Understand the strict boundary between automated PDF syntax validation (PAC, Acrobat Accessibility Checker) and genuine human accessibility. Discover why automated checkers catch only 30-40% of document barriers, leaving critical defects undetected: filename alt text, scrambled reading order, layout tables, and color contrast over complex raster images.",
    "learningObjectives": [
      "Differentiate syntactic structural conformance (checked by automated tools) from semantic and cognitive usability.",
      "Identify the critical defects automated PDF validators pass as valid: filename alt text, layout tables, and scrambled multi-column reading order.",
      "Understand why automated PDF validators cannot reliably compute color contrast against raster photographs and background graphics.",
      "Execute manual assistive technology inspection protocols using screen readers (NVDA, JAWS) and keyboard navigation.",
      "Formulate a comprehensive document audit workflow integrating automated screening with mandatory manual inspection."
    ],
    "keyConcepts": [
      {
        "title": "The Illusion of the Automated Green Checkmark",
        "explanation": "Automated PDF checkers (like PAC 2024 or Acrobat Accessibility Checker) inspect only programmatically verifiable metadata: \"Does an /Alt attribute exist on the tag?\", \"Does the table have a <TH> tag?\", \"Are heading levels sequential?\". They cannot evaluate whether the alt text is accurate, whether reading order makes sense, or whether table headers are semantically related."
      },
      {
        "title": "Filename & Nonsense Alt Text",
        "explanation": "If a complex bar chart has Alt=\"figure_2026_q3_final_v2.png\", automated tools give it a 100% green checkmark because the attribute is populated. For a blind user, however, the image remains completely inaccessible and uninformative."
      },
      {
        "title": "Reading Order & Content Stream Mismatches",
        "explanation": "Automated checkers verify that all content elements reside inside tags in the logical structure tree. They cannot detect if a multi-column article has been tagged across columns instead of down each column, causing sentences to interleave into gibberish."
      },
      {
        "title": "Limitations on Visual Contrast",
        "explanation": "Automated tools cannot evaluate text contrast against complex background images, gradients, or photographs in PDF content streams. Contrast must be inspected manually using an eyedropper tool over worst-case pixel highlights."
      }
    ],
    "examTips": "ADS Exam Alert: Remember that automated checkers can never certify a document as 100% accessible. A document that passes PAC with zero automated errors can still be completely unusable. Manual screen reader testing and human verification of reading order and alternative text are ALWAYS mandatory for true ISO 14289-1 compliance.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-lim-1",
        "question": "Why can an automated PDF accessibility checker (such as PAC) award a 100% pass rating to a document with useless image descriptions?",
        "options": [
          {
            "id": "A",
            "text": "Automated checkers verify the presence of an /Alt tag, not semantic description accuracy"
          },
          {
            "id": "B",
            "text": "Automated validators disable graphic inspection to accelerate document processing"
          },
          {
            "id": "C",
            "text": "ISO 14289-1 officially exempts photographic graphics from accessibility rules"
          },
          {
            "id": "D",
            "text": "Screen readers do not announce alternative text in electronic PDF documents"
          }
        ],
        "answer": "A",
        "explanation": "Automated validators check syntax (e.g. \"Is the /Alt key present and non-empty?\"). They cannot evaluate whether \"chart_v2.png\" provides meaningful content to a human listener."
      },
      {
        "id": "kc-ads-lim-2",
        "question": "Which critical document defect is virtually impossible for automated PDF validators to detect without manual human auditing?",
        "options": [
          {
            "id": "A",
            "text": "A heading structure that skips numerically from an <H1> directly to an <H4>"
          },
          {
            "id": "B",
            "text": "A multi-column article whose reading order reads horizontally across the columns"
          },
          {
            "id": "C",
            "text": "A missing document title string in Document Properties Initial View settings"
          },
          {
            "id": "D",
            "text": "A missing document primary natural language identifier in metadata (xml:lang)"
          }
        ],
        "answer": "B",
        "explanation": "Automated validators verify that text is enclosed in tags, but cannot assess whether the logical reading order matches the human visual reading sequence across multi-column layouts."
      },
      {
        "id": "kc-ads-lim-3",
        "question": "Approximately what percentage of WCAG and PDF/UA accessibility requirements can be reliably and fully evaluated using automated testing tools alone?",
        "options": [
          {
            "id": "A",
            "text": "Over 95% � automated rule engines verify nearly every WCAG requirement except color aesthetics"
          },
          {
            "id": "B",
            "text": "Approximately 30% to 40% — the remainder requires human cognitive verification"
          },
          {
            "id": "C",
            "text": "100% — modern AI accessibility algorithms have replaced human auditing tasks"
          },
          {
            "id": "D",
            "text": "Less than 1% — automated software tools inspect basic file encryption keys"
          }
        ],
        "answer": "B",
        "explanation": "Automated accessibility checkers catch roughly 25%�35% of WCAG criteria (syntactic rules like missing alt attributes or contrast ratios), while human evaluation is required for reading order, alt-text accuracy, keyboard traps, and cognitive clarity."
      }
    ]
  },
  {
    "id": "mod-ads-acrobat-touchup",
    "cert": "ADS",
    "domainId": "ADS-D2",
    "domainLabel": "Domain 2: Remediating Electronic Documents",
    "sectionId": "ADS-D2-C",
    "title": "PDF Final Format Remediation in Adobe Acrobat Pro",
    "badge": "Final Format Remediation",
    "difficulty": "Advanced",
    "estimatedMinutes": 14,
    "interactiveType": "acrobat-tags-table-editor-lab",
    "citation": "IAAP ADS BoK 2021, Section 2.3 (Remediate in final format) & ISO 14289-1 (PDF/UA)",
    "summary": "Remediate accessibility defects directly in final format PDFs using Adobe Acrobat Pro when source authoring files are unavailable. Master the Acrobat Tags Tree, Reading Order Tool, and Table Editor. Remediate multi-column cell spans (ColSpan/RowSpan), artifact decorative page furniture, repair unassociated link annotations, and resolve content stream mismatches.",
    "learningObjectives": [
      "Navigate and restructure the logical structure tree in Adobe Acrobat Pro's Tags Navigation Pane.",
      "Configure multi-column and multi-row header cell spans (ColSpan, RowSpan) and scope attributes using the Acrobat Table Editor.",
      "Utilize the Reading Order Tool to mark decorative lines, background shapes, and running footers as /Artifact.",
      "Repair broken interactive hyperlinks by associating link annotations with semantic <Link> tags and child /OBJR objects.",
      "Resolve reading order discrepancies between the visual document stream, Reading Order panel, and logical Tag Tree."
    ],
    "keyConcepts": [
      {
        "title": "Final Format Remediation When Source is Missing",
        "explanation": "While source-level remediation (in Word or InDesign) is preferred, accessibility specialists frequently receive legacy PDFs where source files are lost, locked, or proprietary. In these scenarios, complete PDF/UA conformance must be achieved directly in Adobe Acrobat Pro or dedicated PDF tag editors."
      },
      {
        "title": "Acrobat Table Editor & Cell Properties",
        "explanation": "Data tables with merged cells frequently fail PAC automated checks (\"Irregular table structure\"). In Acrobat Pro, remediators use the Table Editor to inspect cell properties, changing cells from <TD> to <TH>, specifying Scope (Row or Column), and declaring multi-cell spanning (ColSpan=\"2\" or RowSpan=\"2\")."
      },
      {
        "title": "Artifacting Page Furniture",
        "explanation": "Headers and footers (e.g. \"Page 4 of 24\", chapter titles, decorative rules) repeated across every page interrupt screen reader reading flow. Using Acrobat's Reading Order tool, remediators select these elements and click \"Background / Artifact\" to remove them from the tag tree while preserving visual appearance."
      },
      {
        "title": "Link Annotations & the /OBJR Dictionary",
        "explanation": "In PDF architecture, visual link text (e.g. \"Visit our portal\") and the interactive click rectangle (/Link annotation) exist as separate objects in the PDF stream. For a link to be accessible under ISO 14289-1, the visual text must be enclosed in a <Link> tag, and the interactive annotation must be attached as an Object Reference (/OBJR) child tag."
      }
    ],
    "examTips": "ADS Exam Alert: Remember the distinction between the visual Reading Order panel (often called TouchUp Reading Order or TURO) and the logical Tags Tree. Screen readers read from the TAGS TREE. Never rely on the Reading Order panel alone to verify reading order — always verify the hierarchy in the Tags navigation pane.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-acro-1",
        "question": "In Adobe Acrobat Pro, which tool must be used to configure ColSpan and RowSpan attributes for header cells that span multiple columns or rows in a data table?",
        "options": [
          {
            "id": "A",
            "text": "The Acrobat Edit PDF TouchUp tool designed for nudging individual glyphs on the visual canvas"
          },
          {
            "id": "B",
            "text": "The Acrobat Table Editor (accessed via Table Cell Properties in TouchUp Reading Order)"
          },
          {
            "id": "C",
            "text": "The Optical Character Recognition (OCR) Engine running in search mode"
          },
          {
            "id": "D",
            "text": "The Preflight Color Management panel configuring PDF/X print separations"
          }
        ],
        "answer": "B",
        "explanation": "The Acrobat Table Editor allows remediators to right-click individual table cells and set Table Cell Properties, including Header vs Data type, Scope, and Column/Row Span counts."
      },
      {
        "id": "kc-ads-acro-2",
        "question": "Under ISO 14289-1 (PDF/UA), what must be done with repetitive running headers and page number footers in Adobe Acrobat Pro?",
        "options": [
          {
            "id": "A",
            "text": "Decorative headers must be flattened into 600 DPI raster background layers on each document page"
          },
          {
            "id": "B",
            "text": "They must be marked as /Artifact so screen readers bypass repetitive header pagination"
          },
          {
            "id": "C",
            "text": "They must be tagged as <H1> headings at the top and bottom of every single page"
          },
          {
            "id": "D",
            "text": "They must be deleted from the document, removing printed page numbers from view"
          }
        ],
        "answer": "B",
        "explanation": "Running headers and footers are pagination furniture that disrupt text reading flow. Marking them as an /Artifact removes them from the screen reader speech stream while preserving print aesthetics."
      },
      {
        "id": "kc-ads-acro-3",
        "question": "Why does an underlined hyperlink in a PDF sometimes fail to work for screen reader users even though it is visually blue and clickable with a mouse?",
        "options": [
          {
            "id": "A",
            "text": "The document author omitted a commercial Adobe Acrobat hyperlink encryption certificate key"
          },
          {
            "id": "B",
            "text": "The /Link annotation lacks an Object Reference (/OBJR) tag inside the <Link> tag"
          },
          {
            "id": "C",
            "text": "Screen readers are technically incapable of launching internet web browser URLs"
          },
          {
            "id": "D",
            "text": "Hyperlinks in PDF documents function when opened on macOS desktop viewers"
          }
        ],
        "answer": "B",
        "explanation": "In PDF architecture, the visual text and the interactive link rectangle are distinct objects. Unless the link annotation is linked to the <Link> tag via an /OBJR tag, screen readers treat the text as plain un-clickable text."
      }
    ]
  },
  {
    "id": "mod-ads-manual-testing",
    "cert": "ADS",
    "domainId": "ADS-D3",
    "domainLabel": "Domain 3: Auditing & Testing Documents",
    "sectionId": "ADS-D3-B",
    "sectionLabel": "3.2 Identify and run manual testing processes",
    "citation": "IAAP ADS BoK 2021, Section 3.2 (Identify and run manual testing processes), ISO 14289-1 (PDF/UA-1) & Matterhorn Protocol 1.1",
    "title": "Manual PDF Accessibility Testing & Reflow Protocol",
    "summary": "Execute rigorous manual document testing protocols beyond automated PAC checks: Adobe Acrobat Reflow Mode (Ctrl+4), Screen Reader Quick Keys navigation (H, T, L), Initial View title bar display, and High Contrast inversion.",
    "duration": "24 mins",
    "level": "Professional",
    "interactiveType": "manual-document-audit-protocol-lab",
    "learningObjectives": [
      "Verify logical reading order and multi-column linear flow using Adobe Acrobat Reflow Mode (Ctrl+4 / Cmd+4) at 400% zoom.",
      "Audit semantic document structure using screen reader quick navigation keys (H for Headings, T for Tables, L for Links) under Matterhorn Protocol.",
      "Inspect Document Properties (Ctrl+D) Initial View window options to guarantee the Document Title displays in the application title bar.",
      "Test visual readability and artifact transparency under OS High Contrast and color inversion modes."
    ],
    "keyConcepts": [
      {
        "title": "Why Automated Testing Is Insufficient for PDF",
        "explanation": "Automated validators (like Acrobat Accessibility Checker or PAC 2024) can verify syntax—confirming that tags exist and alt text strings are non-empty. However, they CANNOT evaluate whether reading order is logical, whether heading hierarchies make sense, or whether alt text accurately describes the image."
      },
      {
        "title": "Acrobat Reflow Mode (Ctrl+4 / Cmd+4)",
        "explanation": "Reflow mode temporarily displays the PDF as a single responsive column at high magnification. It strips visual styling and linearizes content strictly according to the logical tag tree order, instantly exposing out-of-sequence callout boxes, disjointed columns, and overlapping text."
      },
      {
        "title": "Screen Reader Quick Keys Navigation (H, T, L)",
        "explanation": "Testing in NVDA or JAWS with single-letter navigation keys (H for Headings, T for Tables, L for Links) allows auditors to experience how users skim documents, verifying that heading levels are not skipped (e.g., H1 directly to H4) and table headers are correctly announced."
      },
      {
        "title": "Initial View Document Title & High Contrast Verification",
        "explanation": "Under ISO 14289-1 (Matterhorn Protocol 07-001) and WCAG 2.4.2, the PDF /ViewerPreferences must specify /DisplayDocTitle true so the title bar presents a meaningful title rather than cryptic filenames. Testing under High Contrast mode ensures decorative vectors marked as artifacts do not invert into opaque blocks that conceal text."
      }
    ],
    "practicalTakeaways": [
      "Automated validators cannot verify whether reading order makes sense; Reflow mode at 400% is the fastest manual check for reading order sequence.",
      "Acrobat Document Properties Initial View must have \"Show: Document Title\" selected, or browsers will display cryptic server filenames instead of accessible titles.",
      "Ensure decorative shapes and lines are tagged as /Artifact so they do not render as opaque solid white blocks in high-contrast inverted modes."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-ads-manual-1",
        "question": "Which key shortcut activates Reflow mode in Adobe Acrobat Pro on Windows to manually inspect responsive reading order at high magnification?",
        "options": [
          {
            "id": "A",
            "text": "Pressing F12 to launch browser DOM inspector panels while viewing the PDF in a desktop reader"
          },
          {
            "id": "B",
            "text": "Ctrl + 4 (or Cmd + 4 on macOS) activating Acrobat Reflow single-column mode"
          },
          {
            "id": "C",
            "text": "Ctrl + Alt + Delete opening the Windows task management dialog window"
          },
          {
            "id": "D",
            "text": "Shift + Escape closing active background utility processes in the workspace"
          }
        ],
        "answer": "B",
        "explanation": "In Adobe Acrobat Pro, pressing Ctrl+4 (or Cmd+4 on macOS) activates Reflow mode (View -> Zoom -> Reflow), which linearizes tagged content into a single column."
      },
      {
        "id": "kc-ads-manual-2",
        "question": "A PDF passes PAC 2024 automated validation with zero errors. However, when opened in Adobe Acrobat, the window title displays \"FIN_DRAFT_DOC_REV8_FINAL.pdf\". How do you resolve this under WCAG 2.4.2 and Matterhorn Protocol 07-001?",
        "options": [
          {
            "id": "A",
            "text": "Changing the Document Title in Description without updating Initial View settings"
          },
          {
            "id": "B",
            "text": "In Acrobat Properties (Ctrl+D) -> Initial View, set \"Show: Document Title\""
          },
          {
            "id": "C",
            "text": "Running Acrobat Accessibility Full Check with the Show Title flag disabled"
          },
          {
            "id": "D",
            "text": "Re-tagging the root document catalog dictionary manually in the Preflight panel"
          }
        ],
        "answer": "B",
        "explanation": "In Adobe Acrobat Pro, setting \"Show: Document Title\" under File > Properties > Initial View writes /DisplayDocTitle true into /ViewerPreferences (Matterhorn 07-001), whereas renaming the OS filename on disk or editing the Author/Subject fields does not change the window title bar behavior."
      },
      {
        "id": "kc-ads-manual-3",
        "question": "During manual screen reader testing of a PDF table with NVDA, pressing \"T\" jumps to the table, but the screen reader does not announce column headers when pressing Ctrl+Alt+Arrow keys. What manual remediation in the Acrobat Tags Tree is needed?",
        "options": [
          {
            "id": "A",
            "text": "Mute the screen reader audio synthesizer while stepping through the document with arrow keys"
          },
          {
            "id": "B",
            "text": "Ensure header cells are tagged as <TH> with Scope declared in Table Cell Properties"
          },
          {
            "id": "C",
            "text": "Delete the entire table and replace it with a raster screenshot of the cells"
          },
          {
            "id": "D",
            "text": "Change the table background color to bright yellow to force high contrast"
          }
        ],
        "answer": "B",
        "explanation": "Screen readers require explicit <TH> tags with proper Scope attributes (Column or Row) to associate header text with data cells during cell-by-cell navigation."
      }
    ]
  },
  {
    "id": "mod-ads-authoring-layout",
    "cert": "ADS",
    "domainId": "ADS-D1",
    "domainLabel": "Domain 1: Creating Electronic Documents",
    "sectionId": "ADS-D1-B",
    "sectionLabel": "1.2 Design, create, and assemble final form documents",
    "citation": "IAAP ADS BoK 2021, Section 1.2 (Design, create, assemble and produce in the final format), Adobe InDesign Accessibility Guide & ISO 14289-1 (PDF/UA-1)",
    "title": "InDesign & Word Authoring Layout Architecture Remediator",
    "summary": "Master layout authoring architecture in Adobe InDesign and Microsoft Word: threading story frames to establish reading sequence, configuring the Articles Panel, mapping Paragraph Styles to PDF/UA tags, and anchoring figures inline.",
    "duration": "25 mins",
    "level": "Professional",
    "interactiveType": "export-architecture-lab",
    "learningObjectives": [
      "Construct continuous threaded story frames in InDesign and Word to prevent multi-column sentence fragmentation during PDF reflow.",
      "Configure the InDesign Articles Panel and enable the mandatory \"Use for Tagging Order in Tagged PDF\" option to override layer-based tag chaos.",
      "Map custom visual Paragraph Styles (e.g. Chapter_Title, Sidebar_Blurb) directly to semantic PDF tags (<H1>, <H2>, <P>, <Blockquote>) in Export Tagging.",
      "Anchor floating pasteboard figures and callouts inline within the narrative text flow to preserve logical reading order."
    ],
    "keyConcepts": [
      {
        "title": "Story Threading vs Isolated Text Frames",
        "explanation": "When creating multi-column layouts, designers must link text frames together via InDesign's in-ports and out-ports. Unthreaded text frames export as disconnected content streams ordered by visual layer stacking or creation order, breaking sentences and paragraph continuity when read by screen readers."
      },
      {
        "title": "The InDesign Articles Panel & Tagging Order",
        "explanation": "By default, Adobe InDesign exports PDF tags according to the visual stacking order in the Layers panel (bottom layer first). The Articles Panel allows authors to define the exact sequence of content blocks. However, authors MUST enable \"Use for Tagging Order in Tagged PDF\" in the panel menu, or InDesign ignores the Articles order."
      },
      {
        "title": "Paragraph Style Export Tagging Mapping",
        "explanation": "In InDesign Paragraph Style Options -> Export Tagging, authors should map visual styling rules directly to semantic PDF/UA tags. Leaving tags set to \"[Automatic]\" frequently results in headings being exported as generic <P> tags, requiring tedious manual remediation in Acrobat Pro."
      },
      {
        "title": "Anchored Objects vs Floating Pasteboard Elements",
        "explanation": "Floating images placed loose on the pasteboard or page margins are exported at the end of the page or in arbitrary sequence. Anchoring the image frame into the text story flow ensures that assistive technologies read the image and its alt text immediately following the referencing paragraph."
      }
    ],
    "practicalTakeaways": [
      "Always thread multi-column text frames so sentences flow across column boundaries seamlessly in the PDF structure tree.",
      "Remember to check \"Use for Tagging Order in Tagged PDF\" in InDesign's Articles panel flyout menu.",
      "Anchor all figures, callouts, and charts inline with text so they do not export at the bottom of the page."
    ],
    "knowledgeCheck": [
      {
        "id": "kc-ads-arch-1",
        "question": "A designer populates the Adobe InDesign Articles panel with all page elements in logical order. When exported to PDF, the reading order is still scrambled. What setting was missed?",
        "options": [
          {
            "id": "A",
            "text": "The document color space must be converted from RGB to CMYK before exporting tagged PDF files"
          },
          {
            "id": "B",
            "text": "The author must check \"Use for Tagging Order in Tagged PDF\" in the Articles panel menu"
          },
          {
            "id": "C",
            "text": "The document visual font sizes must be enlarged to a minimum of 24pt bold"
          },
          {
            "id": "D",
            "text": "InDesign requires installing third-party Acrobat plugins to output tagged PDFs"
          }
        ],
        "answer": "B",
        "explanation": "In Adobe InDesign, the Articles panel only controls PDF tag order if the option \"Use for Tagging Order in Tagged PDF\" is explicitly checked in the Articles panel flyout menu."
      },
      {
        "id": "kc-ads-arch-2",
        "question": "Why is threading text frames across a two-column magazine layout essential for accessibility?",
        "options": [
          {
            "id": "A",
            "text": "It automatically translates English document text into French and Spanish languages"
          },
          {
            "id": "B",
            "text": "It applies digital rights management encryption so end users cannot copy or print page text"
          },
          {
            "id": "C",
            "text": "It links frames into a unified story, ensuring cross-column text is read continuously"
          },
          {
            "id": "D",
            "text": "It compresses high-resolution raster images, shrinking the overall PDF file size"
          }
        ],
        "answer": "C",
        "explanation": "Unthreaded text frames are treated as distinct independent content containers, causing screen readers and reflow mode (<Ctrl+4>) to fragment sentences that break across columns."
      },
      {
        "id": "kc-ads-arch-3",
        "question": "What happens when a chart graphic is placed as a floating unanchored object on the margin of a page in Adobe InDesign or Microsoft Word?",
        "options": [
          {
            "id": "A",
            "text": "The exported PDF fails to open in standard Adobe Acrobat viewer software"
          },
          {
            "id": "B",
            "text": "The chart graphic is automatically converted into an interactive HTML5 canvas tag"
          },
          {
            "id": "C",
            "text": "The chart is exported at the end of the page tag tree, detached from context"
          },
          {
            "id": "D",
            "text": "The graphic resolution is automatically compressed to 72 DPI monochrome bitmap"
          }
        ],
        "answer": "C",
        "explanation": "Floating unanchored objects are placed at the end of the page content stream or in arbitrary order based on visual z-index. Anchoring the graphic inline guarantees it appears adjacent to its textual reference in the reading order."
      }
    ]
  },
  {
    "id": "mod-ads-screen-reader-testing",
    "cert": "ADS",
    "domainId": "ADS-D3",
    "domainLabel": "Domain 3: Auditing and Testing Document Accessibility",
    "sectionId": "ADS-D3-D",
    "title": "Assistive Tech PDF Auditing with NVDA, JAWS & VoiceOver",
    "badge": "Document Auditing",
    "difficulty": "Intermediate",
    "estimatedMinutes": 13,
    "interactiveType": "document-screen-reader-testing-lab",
    "citation": "ADS BoK 2024, Section 3.4 (Perform tests with assistive technologies)",
    "summary": "Audit electronic PDF documents using desktop screen readers: verify reading order across multi-column layouts, inspect table header announcements, and test interactive form controls in Adobe Acrobat.",
    "learningObjectives": [
      "Configure Adobe Acrobat Pro and Reader settings for representative screen reader evaluation.",
      "Verify that multi-column and sidebar document layouts linearize in meaningful reading order.",
      "Audit complex data tables to ensure row and column headers announce during cell navigation."
    ],
    "keyConcepts": [
      {
        "title": "Acrobat Reading Preferences",
        "explanation": "In Adobe Acrobat, the reading options dialog specifies whether documents linearize page-by-page or process the entire document at once. Auditors must test with tagged document reading order enabled."
      },
      {
        "title": "Multi-Column Text Linearization",
        "explanation": "Visual multi-column articles, callout sidebars, and footnotes must read sequentially through column one before moving to column two, rather than reading horizontally across columns."
      },
      {
        "title": "Data Table Navigation Keystrokes",
        "explanation": "Screen reader users navigate PDF data tables using specialized shortcuts (Ctrl+Alt+Arrows in JAWS/NVDA). Properly tagged `<TH>` headers with Scope attributes announce dynamically on each cell move."
      },
      {
        "title": "Form Tooltips as Accessible Names",
        "explanation": "In fillable PDF forms, screen readers announce the form field's Tooltip property as its primary accessible name, rather than the visual adjacent text."
      }
    ],
    "examTips": "ADS exam questions frequently ask why a screen reader reads across two columns instead of down column one first. The answer is that the underlying tag tree order was not structured into separate sequential content blocks.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-sr-1",
        "question": "When navigating an interactive PDF form with NVDA or JAWS, what field property provides the accessible name announced to the user?",
        "options": [
          {
            "id": "A",
            "text": "The underlying PostScript printer font encoding name embedded in PDF"
          },
          {
            "id": "B",
            "text": "The visual watermark text displayed behind the interactive signature line"
          },
          {
            "id": "C",
            "text": "The Tooltip property defined in the PDF form field properties dialog"
          },
          {
            "id": "D",
            "text": "The default tab index number calculated by the authoring layout engine"
          }
        ],
        "answer": "C",
        "explanation": "In PDF forms, the Tooltip field property serves as the accessible name for assistive technology, matching the functional role of the HTML label element."
      },
      {
        "id": "kc-ads-sr-2",
        "question": "A multi-column magazine article visually displays text in two side-by-side columns, but a screen reader reads line 1 of column 1 followed immediately by line 1 of column 2. What is the root cause?",
        "options": [
          {
            "id": "A",
            "text": "The monitor resolution is too low to support multi-column layout reflow"
          },
          {
            "id": "B",
            "text": "Adobe Reader requires an automated third-party accessibility plugin to read columns"
          },
          {
            "id": "C",
            "text": "The document tag tree was structured in horizontal visual lines instead of sequential columns"
          },
          {
            "id": "D",
            "text": "The operating system speech synthesizer encountered unsupported kerning ligatures"
          }
        ],
        "answer": "C",
        "explanation": "Screen readers strictly follow the sequence of tags in the PDF tag tree; if authoring tools emit tags line-by-line horizontally rather than column-by-column, the reading flow is scrambled."
      },
      {
        "id": "kc-ads-sr-3",
        "question": "When auditing a data table in a tagged PDF using screen reader table navigation keys, how does the user confirm that header cells are properly associated?",
        "options": [
          {
            "id": "A",
            "text": "The screen reader reads the total pixel dimensions of the surrounding page margins"
          },
          {
            "id": "B",
            "text": "The screen reader speech synthesizer switches output voices to announce pixel coordinate bounds on the monitor"
          },
          {
            "id": "C",
            "text": "The screen reader announces the corresponding row and column header text before data"
          },
          {
            "id": "D",
            "text": "The PDF viewer automatically downloads an Excel spreadsheet version of the table"
          }
        ],
        "answer": "C",
        "explanation": "When moving between table cells using table navigation keystrokes, a properly tagged PDF table causes the screen reader to announce the parent column and row `<TH>` headers before reading cell data."
      }
    ]
  },
  {
    "id": "mod-ads-authoring-reference-guides",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-A",
    "title": "Authoring Reference Guides & Style Manuals",
    "badge": "Process Engineering",
    "difficulty": "Intermediate",
    "estimatedMinutes": 11,
    "interactiveType": "authoring-reference-guide-lab",
    "citation": "ADS BoK 2024, Section 4.1 (Create related reference guides and instructional materials)",
    "summary": "Create enterprise authoring style guides, checklists, and quick-reference job aids that embed accessible typography, color palettes, and structural conventions directly into document creation workflows.",
    "learningObjectives": [
      "Incorporate accessibility baselines (4.5:1 text contrast, heading styles) into corporate brand guidelines.",
      "Design practical authoring checklists for Microsoft Word, PowerPoint, and Adobe InDesign.",
      "Standardize alternative text writing rubrics for complex charts, diagrams, and decorative artwork."
    ],
    "keyConcepts": [
      {
        "title": "Brand Guideline Integration",
        "explanation": "Integrating accessible color palettes (ensuring brand primary and secondary hues satisfy 4.5:1 for normal text) prevents corporate design teams from creating inherently inaccessible materials."
      },
      {
        "title": "Authoring Checklists",
        "explanation": "Concise checklists guide authors through essential milestones: applying true Paragraph Styles rather than visual bolding, writing alt text, designating table headers, and adding document titles."
      },
      {
        "title": "Alt Text Decision Trees in Style Manuals",
        "explanation": "Style manuals should define standardized criteria for image classification: decorative images marked as artifacts, organizational logos including company names, and data charts paired with tables."
      },
      {
        "title": "Quick-Reference Job Aids",
        "explanation": "Laminated or digital one-page guides showing exact software menu locations (e.g. Word Table Properties > Repeat Header Row) lower cognitive friction for occasional document creators."
      }
    ],
    "examTips": "ADS exam questions highlight that the most effective time to create accessible documents is during initial drafting in authoring software, supported by clear style guides, rather than remediating exported PDFs.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-ref-1",
        "question": "Why is it advantageous to integrate accessibility color contrast criteria directly into an organization's primary brand guidelines?",
        "options": [
          {
            "id": "A",
            "text": "It automates the conversion of legacy scanned PDFs into EPUB 3 e-book packages"
          },
          {
            "id": "B",
            "text": "It eliminates the traditional engineering need for front-end developers to write semantic HTML heading structures"
          },
          {
            "id": "C",
            "text": "It prevents designers from creating collateral with inherently inaccessible color combinations"
          },
          {
            "id": "D",
            "text": "It restricts corporate document creation to monochrome desktop printers"
          }
        ],
        "answer": "C",
        "explanation": "Baking minimum 4.5:1 text contrast into approved brand color palettes ensures that marketing and communication teams produce accessible designs by default."
      },
      {
        "id": "kc-ads-ref-2",
        "question": "What instruction should an authoring reference guide provide regarding headings in Microsoft Word?",
        "options": [
          {
            "id": "A",
            "text": "Enlarge body text font size and apply bold formatting with manual space breaks"
          },
          {
            "id": "B",
            "text": "Insert text boxes positioned over paragraphs with high-contrast drop shadows"
          },
          {
            "id": "C",
            "text": "Highlight section titles with yellow background fill colors in print layouts"
          },
          {
            "id": "D",
            "text": "Apply native Heading Styles (Heading 1 through Heading 6) in hierarchical order"
          }
        ],
        "answer": "D",
        "explanation": "Native Heading Styles (Heading 1, 2, 3) carry semantic heading tags (`<H1>`, `<H2>`) into exported PDF tag trees, whereas manual bolding produces untagged body text."
      },
      {
        "id": "kc-ads-ref-3",
        "question": "How should an instructional job aid direct document authors to treat purely decorative horizontal separator lines and background flourishes?",
        "options": [
          {
            "id": "A",
            "text": "Write alternative text describing the color and thickness of each divider line"
          },
          {
            "id": "B",
            "text": "Convert the separator graphic lines into hidden hyperlinks pointing to corporate landing pages and legal footers"
          },
          {
            "id": "C",
            "text": "Mark them as decorative or /Artifact so assistive tech bypasses them during reading"
          },
          {
            "id": "D",
            "text": "Assign the image title attribute as 'Separator graphic for visual spacing'"
          }
        ],
        "answer": "C",
        "explanation": "Decorative elements that convey no information must be marked as decorative in authoring software or as /Artifact in PDF structures, preventing screen reader clutter."
      }
    ]
  },
  {
    "id": "mod-ads-training-curriculum",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-B",
    "title": "Developing Organizational Document Accessibility Training",
    "badge": "Instructional Design",
    "difficulty": "Intermediate",
    "estimatedMinutes": 12,
    "interactiveType": "a11y-training-curriculum-lab",
    "citation": "ADS BoK 2024, Section 4.2 (Assist in developing digital accessibility training)",
    "summary": "Design role-tailored document accessibility training programs: build curricula for administrative authors, graphic designers, and leadership, and measure pre- and post-training document compliance.",
    "learningObjectives": [
      "Develop modular accessibility training curricula customized to specific authoring job roles.",
      "Facilitate practical, hands-on document remediation workshops using realistic broken files.",
      "Establish quantitative assessment rubrics to measure organizational training efficacy over time."
    ],
    "keyConcepts": [
      {
        "title": "Role-Based Training Modules",
        "explanation": "A single generic training session fails: administrative staff need Word and PowerPoint structure training; creative teams need InDesign export and color training; procurement officers need VPAT review training."
      },
      {
        "title": "Hands-On Practice Documents",
        "explanation": "Effective adult learning requires active problem solving: learners remediate realistic sample files containing skipped headings, merged data table cells, and missing alt text."
      },
      {
        "title": "Measuring Knowledge Retention",
        "explanation": "Evaluating document pass rates using automated checkers (PAC, Word Accessibility Checker) on production documents before and after training cohorts provides concrete proof of program impact."
      },
      {
        "title": "Sustained Reinforcement",
        "explanation": "Single training events fade without ongoing reinforcement: quarterly micro-learning sessions, drop-in remediation clinics, and peer mentoring sustain accessibility capability."
      }
    ],
    "examTips": "ADS exam questions stress that training programs must include hands-on document remediation practice rather than purely theoretical slide presentations, ensuring authors develop tactical software skills.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-trn-1",
        "question": "When developing an enterprise document accessibility training program, why should instructional content be tailored by authoring role?",
        "options": [
          {
            "id": "A",
            "text": "Different roles use distinct authoring tools and have different compliance responsibilities"
          },
          {
            "id": "B",
            "text": "Union regulations prohibit mixing managerial and operational staff in training rooms"
          },
          {
            "id": "C",
            "text": "Federal accessibility statutes mandate separate licensing for Word and InDesign users"
          },
          {
            "id": "D",
            "text": "Graphic designers are legally exempt from understanding digital document accessibility"
          }
        ],
        "answer": "A",
        "explanation": "Content authors, designers, and procurement managers operate in different authoring environments and address distinct accessibility challenges, requiring tailored instruction."
      },
      {
        "id": "kc-ads-trn-2",
        "question": "What instructional method has been shown to produce the highest knowledge retention during document accessibility workshops?",
        "options": [
          {
            "id": "A",
            "text": "Requiring participants to memorize W3C success criteria numbering schemes"
          },
          {
            "id": "B",
            "text": "Lecturing on the chronological history of international digital publishing treaty negotiations for several hours"
          },
          {
            "id": "C",
            "text": "Hands-on remediation practice repairing intentionally defective sample documents"
          },
          {
            "id": "D",
            "text": "Distributing printed copies of the ISO 14289 specification for home reading"
          }
        ],
        "answer": "C",
        "explanation": "Hands-on practice fixing realistic broken documents allows authors to apply software tools directly, building practical muscle memory and retention."
      },
      {
        "id": "kc-ads-trn-3",
        "question": "How can a training program coordinator objectively evaluate the real-world effectiveness of a document accessibility training series?",
        "options": [
          {
            "id": "A",
            "text": "By counting how many slides were reviewed during the workshop presentation"
          },
          {
            "id": "B",
            "text": "By conducting qualitative surveys asking whether attendees found the venue temperature and event refreshments enjoyable"
          },
          {
            "id": "C",
            "text": "By measuring the reduction in accessibility checker errors across post-training documents"
          },
          {
            "id": "D",
            "text": "By verifying that attendees downloaded the latest operating system update"
          }
        ],
        "answer": "C",
        "explanation": "Measuring the decrease in accessibility checker errors (in PAC or Word) in production documents created after training provides an objective metric of learning transfer."
      }
    ]
  },
  {
    "id": "mod-ads-training-resources",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-C",
    "title": "Curating Digital Accessibility Resources & Knowledge Bases",
    "badge": "Knowledge Management",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "interactiveType": "training-resource-learning-path-lab",
    "citation": "ADS BoK 2024, Section 4.3 (Identify and provide training opportunities and resources)",
    "summary": "Curate accessible document template libraries (.dotx, .potx, .indt), organize centralized micro-learning repositories, and build an internal community of practice across enterprise departments.",
    "learningObjectives": [
      "Build pre-tagged, accessible document template repositories that enforce accessible typography and structures.",
      "Curate reputable industry standards, tutorials, and micro-learning video modules for self-paced learning.",
      "Establish an organizational Accessibility Champions network to drive peer-to-peer document support."
    ],
    "keyConcepts": [
      {
        "title": "Accessible Template Repositories",
        "explanation": "Providing staff with pre-formatted Word (.dotx) and PowerPoint (.potx) templates with configured color contrast, heading styles, and table formatting ensures 80% of accessibility is built in automatically."
      },
      {
        "title": "Asynchronous Micro-Learning",
        "explanation": "Short 2-3 minute video demonstrations showing how to perform single tasks (e.g. adding alternative text in Word or setting table headers in PowerPoint) achieve high engagement when authors encounter specific questions."
      },
      {
        "title": "Accessibility Champions Network",
        "explanation": "Trained champions embedded within marketing, human resources, finance, and legal departments serve as accessible authoring points of contact, scaling expertise throughout the enterprise."
      },
      {
        "title": "Centralized Resource Portals",
        "explanation": "An internal accessibility knowledge hub housing software export guides, PAC validation tools, and brand color palettes creates a single source of truth for the organization."
      }
    ],
    "examTips": "ADS questions frequently highlight that pre-built accessible templates are the single most cost-effective tool for scaling document accessibility across large non-technical employee bases.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-res-1",
        "question": "Why is deploying standardized accessible templates (.dotx, .potx) considered a highly efficient enterprise accessibility strategy?",
        "options": [
          {
            "id": "A",
            "text": "Templates allow Word documents to bypass Adobe Acrobat preflight validation tests"
          },
          {
            "id": "B",
            "text": "Templates prevent document creators from typing grammatical spelling errors into high-level executive summaries"
          },
          {
            "id": "C",
            "text": "Templates embed accessible styles, contrast, and layouts into files before authors begin writing"
          },
          {
            "id": "D",
            "text": "Templates encrypt document metadata against unauthorized external viewing"
          }
        ],
        "answer": "C",
        "explanation": "Pre-configured templates build in accessible color palettes, heading hierarchies, margins, and table styles, ensuring documents start compliant without requiring deep technical knowledge from authors."
      },
      {
        "id": "kc-ads-res-2",
        "question": "What is the primary role of an 'Accessibility Champion' embedded within a departmental business unit?",
        "options": [
          {
            "id": "A",
            "text": "To approve third-party software vendor invoices for enterprise legal department audits"
          },
          {
            "id": "B",
            "text": "To issue formal disciplinary write-up notices to staff members who author untagged portable document files"
          },
          {
            "id": "C",
            "text": "To act as a localized peer mentor and first-line reviewer for document accessibility"
          },
          {
            "id": "D",
            "text": "To rewrite corporate marketing copy to maintain a fifth-grade reading level"
          }
        ],
        "answer": "C",
        "explanation": "Champions act as peer advocates and mentors, answering authoring questions, reviewing critical documents, and escalating complex remediation challenges to central accessibility teams."
      },
      {
        "id": "kc-ads-res-3",
        "question": "How does micro-learning (2-3 minute targeted video demonstrations) benefit busy enterprise staff compared to annual multi-hour seminars?",
        "options": [
          {
            "id": "A",
            "text": "It eliminates the need for software vendors to maintain accessible authoring tools"
          },
          {
            "id": "B",
            "text": "It satisfies international human rights treaty reporting mandates across United Nations member jurisdiction panels"
          },
          {
            "id": "C",
            "text": "It delivers immediate, just-in-time answers at the exact moment authors encounter barriers"
          },
          {
            "id": "D",
            "text": "It restricts document authoring training to certified corporate executives"
          }
        ],
        "answer": "C",
        "explanation": "Micro-learning offers timely, focused problem-solving when authors are actively drafting documents, leading to higher engagement and immediate practical application."
      }
    ]
  },
  {
    "id": "mod-ads-enterprise-workflow",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-D",
    "title": "Enterprise Document Ingestion, Remediation & Approvals",
    "badge": "Enterprise Operations",
    "difficulty": "Advanced",
    "estimatedMinutes": 14,
    "interactiveType": "enterprise-remediation-workflow-lab",
    "citation": "ADS BoK 2024, Section 4.4 (Develop workflow for requests, submissions, remediation, and approvals)",
    "summary": "Establish robust intake triage protocols, implement remediation quality gates, mandate source-first authoring fixes, and formalize sign-off workflows prior to electronic document publication.",
    "learningObjectives": [
      "Design document ingestion and intake triage protocols based on audience reach and legal exposure.",
      "Enforce publication quality gates combining automated PAC validation and human manual review.",
      "Implement source-first remediation policies to eliminate throwaway Acrobat tag-patching workflows."
    ],
    "keyConcepts": [
      {
        "title": "Intake Triage & Prioritization",
        "explanation": "Documents are prioritized by risk: public-facing customer notices and high-volume billing forms receive priority Tier 1 remediation, while internal drafts follow standard baseline checks."
      },
      {
        "title": "Publication Quality Gates",
        "explanation": "No PDF can be uploaded to public websites without passing two gates: an automated PAC validation report with zero errors, and manual sign-off by a certified document accessibility reviewer."
      },
      {
        "title": "Source-First Remediation Rule",
        "explanation": "Fixes must be implemented in Word or InDesign source files first. Remediating tags solely in Acrobat produces a throwaway fix that is wiped out the moment an author edits the original source and re-exports."
      },
      {
        "title": "Document Lifecycle Accountability",
        "explanation": "Clear hand-off agreements between content creators, internal remediators, and publishing webmasters ensure accessibility is verified at each stage rather than deferred to post-launch."
      }
    ],
    "examTips": "ADS exam questions emphasize that remediating solely in Adobe Acrobat without updating the Word or InDesign source file is an unsustainable practice that leads to repeated rework when documents are updated.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-flow-1",
        "question": "Why do enterprise accessibility policies mandate a 'Source-First' remediation rule rather than fixing tags exclusively in Adobe Acrobat Pro?",
        "options": [
          {
            "id": "A",
            "text": "Adobe Acrobat Pro software licenses are restricted on enterprise workstations due to high annual operating costs"
          },
          {
            "id": "B",
            "text": "Source authoring programs run faster encryption algorithms during document export"
          },
          {
            "id": "C",
            "text": "Acrobat Pro fixes are overwritten whenever the author updates the source and re-exports"
          },
          {
            "id": "D",
            "text": "PDF/UA standards require PDF documents to stay under 1 megabyte in size"
          }
        ],
        "answer": "C",
        "explanation": "Fixing accessibility in source documents (Word, InDesign) preserves structural tags across future revisions, whereas fixing only the exported PDF requires re-doing all tag edits upon re-export."
      },
      {
        "id": "kc-ads-flow-2",
        "question": "What criteria should a digital publishing webmaster require before approving a public-facing PDF for upload to the corporate website?",
        "options": [
          {
            "id": "A",
            "text": "A signed affidavit confirming the document was printed and scanned at 300 DPI"
          },
          {
            "id": "B",
            "text": "Verification that the document uses twelve-point serif typography across every chapter"
          },
          {
            "id": "C",
            "text": "Corporate communications departments must route every memorandum through external third-party testing consultants"
          },
          {
            "id": "D",
            "text": "Passing automated validation (e.g. PAC) and certified manual assistive tech review"
          }
        ],
        "answer": "D",
        "explanation": "Quality publication gates require both automated validation (zero PAC/Preflight errors) and manual review (logical reading order and alt text quality) before external publishing."
      },
      {
        "id": "kc-ads-flow-3",
        "question": "How should an enterprise document intake triage workflow prioritize incoming remediation requests during a high-volume publishing cycle?",
        "options": [
          {
            "id": "A",
            "text": "Remediate documents authored by department vice presidents and directors"
          },
          {
            "id": "B",
            "text": "Defer PDF remediations until the end of the annual accounting fiscal year"
          },
          {
            "id": "C",
            "text": "Assign full manual PDF remediation responsibilities to software database administrators during quarterly sprint reviews"
          },
          {
            "id": "D",
            "text": "Prioritize documents based on public audience reach, legal exposure, and core utility"
          }
        ],
        "answer": "D",
        "explanation": "Risk-based triage prioritizes documents with high public visibility, regulatory impact, and essential transaction paths (e.g. healthcare forms, billing notices, public policies)."
      }
    ]
  },
  {
    "id": "mod-ads-production-planning",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-E",
    "title": "Document Production Planning, Scheduling & Capacity",
    "badge": "Program Management",
    "difficulty": "Intermediate",
    "estimatedMinutes": 11,
    "interactiveType": "document-production-plan-lab",
    "citation": "ADS BoK 2024, Section 4.5 (Document production plan)",
    "summary": "Estimate remediation hours across diverse document formats, schedule accessibility milestones within publishing deadlines, manage outsourced remediation vendors, and forecast team capacity.",
    "learningObjectives": [
      "Calculate realistic remediation effort estimates based on page volume, table density, and graphic complexity.",
      "Embed remediation sprints into enterprise publishing calendars to eliminate last-minute release delays.",
      "Establish vendor evaluation rubrics to monitor third-party outsourced remediation quality."
    ],
    "keyConcepts": [
      {
        "title": "Complexity-Based Estimation",
        "explanation": "A 50-page narrative text document may require only 2 hours of remediation, whereas a 20-page financial report with 40 complex nested data tables and charts can require 15+ hours."
      },
      {
        "title": "Parallel Production Schedules",
        "explanation": "Document accessibility remediation should begin as soon as content is finalized, running in parallel with final proofreading and layout styling rather than treated as an afterthought."
      },
      {
        "title": "Vendor Quality Assurance",
        "explanation": "When outsourcing remediation, contracts must stipulate PDF/UA ISO 14289 conformance deliverables, requiring vendors to submit clean PAC validation reports and sample screen reader logs."
      },
      {
        "title": "Capacity & Seasonal Forecasting",
        "explanation": "Anticipating annual organizational surges (open enrollment benefits guides, annual financial reports, academic semester kickoffs) allows managers to scale capacity proactively."
      }
    ],
    "examTips": "ADS exam questions emphasize that estimating remediation effort based solely on page count without assessing table density and graphic complexity leads to severe schedule overruns.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-plan-1",
        "question": "When estimating the hours required to remediate a PDF document for accessibility, why is page count alone an unreliable metric?",
        "options": [
          {
            "id": "A",
            "text": "Adobe Acrobat Pro charges software licensing fees per word rather than per page"
          },
          {
            "id": "B",
            "text": "Remediation time is heavily driven by data table density, formula complexity, and graphics"
          },
          {
            "id": "C",
            "text": "Document page count changes dynamically depending on the user's monitor size"
          },
          {
            "id": "D",
            "text": "PDF/UA standards mandate that documents must feature an even number of pages"
          }
        ],
        "answer": "B",
        "explanation": "Complex elements like nested data tables, technical diagrams, and interactive forms require significantly more remediation time per page than continuous narrative prose."
      },
      {
        "id": "kc-ads-plan-2",
        "question": "What is the best practice for integrating accessibility remediation into corporate publication timelines to prevent release delays?",
        "options": [
          {
            "id": "A",
            "text": "Convert corporate publications into plain text emails without formatting"
          },
          {
            "id": "B",
            "text": "Eliminate final proofreading reviews to reserve time for accessibility audits"
          },
          {
            "id": "C",
            "text": "Wait until after print distribution has finished before beginning accessibility checks"
          },
          {
            "id": "D",
            "text": "Schedule remediation in parallel with editorial reviews once text content is locked"
          }
        ],
        "answer": "D",
        "explanation": "Scheduling accessibility remediation in parallel with final layout and editorial reviews prevents accessibility from becoming a last-minute barrier to launch."
      },
      {
        "id": "kc-ads-plan-3",
        "question": "When contracting a third-party vendor to remediate a backlog of five hundred legacy PDF documents, what quality deliverable should be required?",
        "options": [
          {
            "id": "A",
            "text": "A guarantee that file sizes will be compressed by at least fifty percent"
          },
          {
            "id": "B",
            "text": "A promise that document text has been converted into high-resolution bitmap graphics"
          },
          {
            "id": "C",
            "text": "A statement asserting that the vendor executes proprietary automated repair scripts without manual review"
          },
          {
            "id": "D",
            "text": "Validated PDF/UA compliance reports (e.g. PAC) and sample assistive tech testing logs"
          }
        ],
        "answer": "D",
        "explanation": "Requiring automated PDF/UA validation reports (PAC/Preflight) alongside manual screen reader verification logs holds vendors accountable to verifiable technical standards."
      }
    ]
  },
  {
    "id": "mod-ads-automated-pipeline-ingestion",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-F",
    "title": "Auditing Automated Systems Emitting Inaccessible Documents",
    "badge": "Systems Architecture",
    "difficulty": "Advanced",
    "estimatedMinutes": 13,
    "interactiveType": "automated-pipeline-ingestion-lab",
    "citation": "ADS BoK 2024, Section 4.6 (Identify automated processes that result in inaccessible documents)",
    "summary": "Audit automated backend document generation pipelines (JasperReports, Crystal Reports, Puppeteer, Apache FOP), inject PDF/UA tagging into transactional statements, and establish automated PDF smoke tests.",
    "learningObjectives": [
      "Identify backend reporting and document engines that emit untagged or non-conformant PDF streams.",
      "Configure automated template engines to emit valid tagged headings, tables, and alternative text.",
      "Integrate automated command-line PDF validators (PAC CLI, veraPDF) into continuous delivery pipelines."
    ],
    "keyConcepts": [
      {
        "title": "Transactional Document Challenges",
        "explanation": "Organizations emit millions of automated transactional documents (utility bills, account statements, explanations of benefits). Manual remediation is impossible at this scale; accessibility must be engineered into the generation template."
      },
      {
        "title": "Server-Side Engine Tagging Flags",
        "explanation": "Reporting engines (Apache FOP, JasperReports, iText) often have accessibility tagging disabled by default. Enabling PDF/UA configuration flags ensures output streams include `<Document>`, `<P>`, and `<Table>` structures."
      },
      {
        "title": "Dynamic Data Table Markup",
        "explanation": "Templates that generate tables from database queries must be explicitly coded to generate `<TH>` header cells with Scope attributes for each data column, rather than emitting repeating rows of generic `<TD>` cells."
      },
      {
        "title": "Automated Build Pipeline Smoke Tests",
        "explanation": "Running automated PDF validators (such as veraPDF or PAC command-line runners) on generated sample artifacts in CI/CD pipelines alerts developers to tagging regressions before deployment."
      }
    ],
    "examTips": "ADS exam questions emphasize that when high-volume transactional documents are inaccessible, the solution is NOT manual remediation, but updating the backend generation templates and engine configuration.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-auto-1",
        "question": "A bank generates two million PDF credit card statements each month, and customers report that screen readers cannot read the transaction tables. What is the appropriate remediation strategy?",
        "options": [
          {
            "id": "A",
            "text": "Hire an offshore remediation team to manually fix two million PDFs each month"
          },
          {
            "id": "B",
            "text": "Require customers with disabilities to visit a physical bank branch to hear statements"
          },
          {
            "id": "C",
            "text": "Update the server-side statement generation engine template to emit valid PDF/UA tag trees"
          },
          {
            "id": "D",
            "text": "Convert monthly credit card statements into password-protected raster JPEG images"
          }
        ],
        "answer": "C",
        "explanation": "At enterprise scale, high-volume transactional documents must be made accessible at the template engine level so that every automatically generated document is tagged compliant."
      },
      {
        "id": "kc-ads-auto-2",
        "question": "Why do automated server-side PDF reporting engines (such as older versions of Apache FOP or iText) frequently output inaccessible PDFs by default?",
        "options": [
          {
            "id": "A",
            "text": "Screen readers are technically incapable of rendering documents generated by Java"
          },
          {
            "id": "B",
            "text": "Server operating systems lack the font libraries required for PDF/UA conformance"
          },
          {
            "id": "C",
            "text": "International web standards prohibit backend Linux servers from generating dynamically compiled binary files"
          },
          {
            "id": "D",
            "text": "Their configuration settings often have accessibility tagging options disabled by default"
          }
        ],
        "answer": "D",
        "explanation": "Many backend reporting libraries prioritize rendering speed and file size, disabling tagging by default unless developers explicitly configure the engine for PDF/UA tagged output."
      },
      {
        "id": "kc-ads-auto-3",
        "question": "How can software engineering teams detect accessibility regressions in automated PDF document generation pipelines before code reaches production?",
        "options": [
          {
            "id": "A",
            "text": "By printing five sample documents and measuring paper thickness with calipers"
          },
          {
            "id": "B",
            "text": "By checking whether software database queries complete in time"
          },
          {
            "id": "C",
            "text": "By surveying customer service call logs three months after statement releases"
          },
          {
            "id": "D",
            "text": "By running command-line PDF validators (e.g. veraPDF) in automated CI/CD build tests"
          }
        ],
        "answer": "D",
        "explanation": "Integrating command-line PDF validation tools into automated test suites evaluates generated artifacts during CI/CD, catching missing tags before deployment."
      }
    ]
  },
  {
    "id": "mod-ads-complex-format-support",
    "cert": "ADS",
    "domainId": "ADS-D4",
    "domainLabel": "Domain 4: Document Accessibility Planning and Training",
    "sectionId": "ADS-D4-G",
    "title": "Complex Formats: MathML, LaTeX, Data Visualizations & Forms",
    "badge": "Specialized Media",
    "difficulty": "Advanced",
    "estimatedMinutes": 14,
    "interactiveType": "complex-document-escalation-lab",
    "citation": "ADS BoK 2024, Section 4.7 (Provide support related to accessibility)",
    "summary": "Remediate specialized and complex document media: convert raster math equations into MathML, link multi-layered charts with accessible data tables, and configure interactive fillable PDF form tab structures.",
    "learningObjectives": [
      "Encode mathematical and scientific expressions using MathML and accessible speech alternative text.",
      "Remediate dense data visualizations using dual-presentation strategies (narrative summary + data table).",
      "Configure fillable interactive PDF forms with proper tab ordering, required flags, and tooltip labels."
    ],
    "keyConcepts": [
      {
        "title": "STEM & Mathematical Equations",
        "explanation": "Equations rendered as images cannot be explored by screen readers or output to braille. Using MathML or providing detailed spoken-text expansions allows learners to inspect numerator, denominator, and exponents."
      },
      {
        "title": "Dual Presentation for Infographics",
        "explanation": "Complex multi-variable charts cannot be summarized in a 100-character alt attribute. Authors must provide a high-level summary in text followed by a tagged data table containing the raw metrics."
      },
      {
        "title": "Interactive PDF Form Controls",
        "explanation": "Fillable forms must set Page Properties > Tab Order to 'Use Document Structure'. Each field must have a unique name, tooltip, and clear visual focus indicator."
      },
      {
        "title": "Technical Blueprints & Schematics",
        "explanation": "For dense engineering or architectural diagrams, provide text-based callout descriptions, layer controls, and high-contrast vector lines so low-vision readers can distinguish components."
      }
    ],
    "examTips": "ADS exam questions emphasize that Math equations must never be left as bare raster images; they must be provided as MathML or accompanied by unambiguous text equivalents.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-cpx-1",
        "question": "Why is saving a complex mathematical equation as a bitmap graphic (JPEG/PNG) considered an accessibility failure in educational materials?",
        "options": [
          {
            "id": "A",
            "text": "Bitmap graphics cannot be displayed on monitors running at sixty hertz refresh rates"
          },
          {
            "id": "B",
            "text": "Vector mathematical fonts require dedicated graphics cards to render inside web browsers"
          },
          {
            "id": "C",
            "text": "Mathematical symbols automatically trigger heuristic antivirus warnings inside enterprise desktop browser extensions"
          },
          {
            "id": "D",
            "text": "Screen readers cannot navigate the formula's internal hierarchy or output Nemeth braille"
          }
        ],
        "answer": "D",
        "explanation": "Equations as images prevent screen readers from navigating through fractions, exponents, and sub-expressions step-by-step, and cannot be converted to refreshable braille displays."
      },
      {
        "id": "kc-ads-cpx-2",
        "question": "When including a complex infographic showing ten years of quarterly financial performance across four business units, what is the most accessible presentation?",
        "options": [
          {
            "id": "A",
            "text": "A short text summary of key trends paired with an accessible, properly tagged data table structure"
          },
          {
            "id": "B",
            "text": "A single text string entered in the complex graphic properties dialog"
          },
          {
            "id": "C",
            "text": "A prompt asking users with visual disabilities to email the CFO for a phone call"
          },
          {
            "id": "D",
            "text": "A low-resolution thumbnail image linking to an uncompressed vector EPS file"
          }
        ],
        "answer": "A",
        "explanation": "Dual presentation combines a concise narrative summary in body text with an accessible data table (`<TH>` headers), allowing all users to explore the data points comfortably."
      },
      {
        "id": "kc-ads-cpx-3",
        "question": "What setting in Adobe Acrobat Pro ensures that interactive form fields follow the logical flow of the tag tree during keyboard tabbing?",
        "options": [
          {
            "id": "A",
            "text": "Document Processing > Set Reflow Zoom to two hundred percent"
          },
          {
            "id": "B",
            "text": "Security Properties > Password Protect Form Fields from Editing"
          },
          {
            "id": "C",
            "text": "Print Production > Convert interactive form fields to static raster curves"
          },
          {
            "id": "D",
            "text": "Page Properties > Tab Order > Set to 'Use Document Structure'"
          }
        ],
        "answer": "D",
        "explanation": "Configuring Tab Order to 'Use Document Structure' guarantees that tabbing through form fields moves in the logical order defined by the structure tree rather than raw creation order."
      }
    ]
  },
  {
    "id": "mod-ads-policy-advising",
    "cert": "ADS",
    "domainId": "ADS-D5",
    "domainLabel": "Domain 5: Policy Promotion, Advocacy, and Advising",
    "sectionId": "ADS-D5-A",
    "title": "Advising Leadership on Enterprise Document Policy & Governance",
    "badge": "Governance & Strategy",
    "difficulty": "Advanced",
    "estimatedMinutes": 12,
    "interactiveType": "document-policy-governance-lab",
    "citation": "ADS BoK 2024, Section 5.1 (Advise staff on organizational policy and best practices)",
    "summary": "Formulate comprehensive electronic document accessibility policies, establish executive governance and accountability matrices, mitigate ADA Title III litigation risk, and design formal exception protocols.",
    "learningObjectives": [
      "Draft enterprise document accessibility policy statements specifying standards, scope, and milestone timelines.",
      "Establish governance frameworks with executive sponsorship and departmental accountability scorecards.",
      "Architect formal exception and accommodation procedures for legacy document repositories."
    ],
    "keyConcepts": [
      {
        "title": "Policy Scope & Clear Standards",
        "explanation": "A robust policy explicitly defines what is covered (all public-facing electronic documents, employee-facing intranet resources) and cites clear normative standards (WCAG 2.1/2.2 AA and PDF/UA ISO 14289)."
      },
      {
        "title": "Executive Sponsorship & Accountability",
        "explanation": "Without executive buy-in and clear accountability metrics across business units, document accessibility efforts stall. Departmental leaders must be measured on compliance scorecards."
      },
      {
        "title": "Risk Management & Legal Exposure",
        "explanation": "Inaccessible electronic documents are prominent triggers in digital accessibility litigation. Proactive governance drastically reduces legal settlement liability and protects organizational reputation."
      },
      {
        "title": "Exception & Accommodation Protocols",
        "explanation": "When vast legacy archives cannot be remediated immediately, policies must define formal exception procedures: establishing alternative access paths (accessible HTML or on-demand remediation within 48 hours)."
      }
    ],
    "examTips": "ADS exam questions highlight that an effective accessibility policy must define measurable criteria, deadlines, and responsible roles, rather than vague aspirations like 'we strive to be accessible'.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-pol-1",
        "question": "What core element must be clearly defined within an enterprise electronic document accessibility policy to ensure effective governance?",
        "options": [
          {
            "id": "A",
            "text": "An agreement that the organization will publish documents written in English"
          },
          {
            "id": "B",
            "text": "A requirement that staff members must purchase personally owned screen reading tools"
          },
          {
            "id": "C",
            "text": "A catalog of employee residential addresses and personal computer hardware serial registration identifiers"
          },
          {
            "id": "D",
            "text": "Explicit technical standards, defined document scope, and measurable milestone dates"
          }
        ],
        "answer": "D",
        "explanation": "Actionable governance requires stating specific technical benchmarks (WCAG 2.1 AA, PDF/UA), what documents are covered, and realistic deadlines for compliance."
      },
      {
        "id": "kc-ads-pol-2",
        "question": "When an organization has a repository of fifty thousand legacy PDF documents that cannot be remediated immediately, what policy protocol should be implemented?",
        "options": [
          {
            "id": "A",
            "text": "Convert the historical PDF repository into unindexed raster TIFF archive files"
          },
          {
            "id": "B",
            "text": "Add a disclaimer stating that users with disabilities should avoid the website"
          },
          {
            "id": "C",
            "text": "Delete the entire historical archive immediately to eliminate potential legal exposure from public records"
          },
          {
            "id": "D",
            "text": "A documented exception policy with on-demand remediation upon request within 48 hours"
          }
        ],
        "answer": "D",
        "explanation": "A formal exception policy paired with an accessible on-demand fulfillment procedure provides equally effective alternative access while the organization systematically remediates high-traffic legacy files."
      },
      {
        "id": "kc-ads-pol-3",
        "question": "Why is executive leadership sponsorship critical for the success of an enterprise document accessibility initiative?",
        "options": [
          {
            "id": "A",
            "text": "Executive signatures automatically exempt digital publications from federal procurement audits"
          },
          {
            "id": "B",
            "text": "Accessibility policies cannot take effect without approval from the United Nations"
          },
          {
            "id": "C",
            "text": "Executive officers are required by statutory law to inspect every corporate document produced across divisions"
          },
          {
            "id": "D",
            "text": "Executive sponsorship allocates necessary budgets, tools, and cross-departmental accountability"
          }
        ],
        "answer": "D",
        "explanation": "Executive sponsorship secures necessary funding for tools and training, and holds business unit leaders accountable for document compliance across the organization."
      }
    ]
  },
  {
    "id": "mod-ads-standards-consulting",
    "cert": "ADS",
    "domainId": "ADS-D5",
    "domainLabel": "Domain 5: Policy Promotion, Advocacy, and Advising",
    "sectionId": "ADS-D5-B",
    "title": "Consulting on Global Standards, PDF/UA & ICT Procurement",
    "badge": "Regulatory Advisory",
    "difficulty": "Advanced",
    "estimatedMinutes": 13,
    "interactiveType": "document-regulations-procurement-lab",
    "citation": "ADS BoK 2024, Section 5.2 (Consult on current policies, regulations, standards, and practice)",
    "summary": "Consult on global document compliance: harmonize PDF/UA (ISO 14289) with WCAG 2.1/2.2 AA, verify Section 508 and EN 301 549 conformance, and audit vendor VPAT statements during procurement.",
    "learningObjectives": [
      "Harmonize file format requirements under PDF/UA (ISO 14289) with web standards under WCAG 2.1/2.2.",
      "Understand Section 508 Chapter 5 and European Standard EN 301 549 Chapter 10 document requirements.",
      "Audit vendor VPATs/ACRs during procurement to identify inaccurate or unsupported vendor claims."
    ],
    "keyConcepts": [
      {
        "title": "PDF/UA (ISO 14289-1) Purpose",
        "explanation": "PDF/UA is the international technical standard that defines how PDF reading tools and assistive technologies interpret tagged PDF files, guaranteeing universal accessibility for conforming documents."
      },
      {
        "title": "WCAG Harmonization in Section 508 & EN 301 549",
        "explanation": "Both US Section 508 (Chapter 5) and European EN 301 549 (Chapter 10) apply WCAG 2.1 AA success criteria directly to electronic non-web documents, creating global regulatory consistency."
      },
      {
        "title": "ATAG 2.0 & Authoring Software",
        "explanation": "Enterprise authoring software procurement must evaluate ATAG 2.0 (Authoring Tool Accessibility Guidelines): tools must be accessible to authors with disabilities and support exporting accessible output."
      },
      {
        "title": "VPAT & ACR Evaluation",
        "explanation": "Procurement teams must critically review vendor Accessibility Conformance Reports (ACRs). Blanket claims of 100% 'Supports' without test methodology notes indicate unverified vendor marketing."
      }
    ],
    "examTips": "ADS exam questions highlight that PDF/UA ISO 14289-1 is a technical file format standard, while WCAG is a broad content guideline; achieving PDF/UA conformance generally satisfies WCAG 2.1 AA requirements for PDFs.",
    "knowledgeCheck": [
      {
        "id": "kc-ads-std-1",
        "question": "What is the relationship between the PDF/UA (ISO 14289-1) standard and W3C WCAG 2.1 Level AA?",
        "options": [
          {
            "id": "A",
            "text": "PDF/UA was officially repealed and replaced by WCAG 2.0 in early 2012"
          },
          {
            "id": "B",
            "text": "PDF/UA defines specific technical PDF file requirements that harmonize with WCAG guidelines"
          },
          {
            "id": "C",
            "text": "PDF/UA applies to printed paper documents, whereas WCAG applies to digital PDFs"
          },
          {
            "id": "D",
            "text": "The two standards are mutually incompatible and cannot be achieved simultaneously"
          }
        ],
        "answer": "B",
        "explanation": "PDF/UA provides the exact technical file format rules (syntax, tagging, metadata) for implementing the broad functional accessibility principles of WCAG within PDF documents."
      },
      {
        "id": "kc-ads-std-2",
        "question": "When reviewing a vendor's Voluntary Product Accessibility Template (VPAT) for a document authoring tool, what is a major red flag indicating poor credibility?",
        "options": [
          {
            "id": "A",
            "text": "The vendor includes links to third-party screen reader audit recordings"
          },
          {
            "id": "B",
            "text": "The report is signed by the vendor's chief accessibility engineering officer"
          },
          {
            "id": "C",
            "text": "The vendor acknowledges partial compliance support on complex dynamic data visualization exports and charting widgets"
          },
          {
            "id": "D",
            "text": "The vendor claims 100% 'Supports' across every criterion with no testing remarks or notes"
          }
        ],
        "answer": "D",
        "explanation": "A VPAT that claims complete compliance across all criteria without providing testing remarks, software version numbers, or evaluation methodologies is typically unverified marketing copy."
      },
      {
        "id": "kc-ads-std-3",
        "question": "Under the Authoring Tool Accessibility Guidelines (ATAG 2.0), what dual responsibility does an enterprise document creation software package have?",
        "options": [
          {
            "id": "A",
            "text": "It must be free open-source software and operate without an internet connection"
          },
          {
            "id": "B",
            "text": "It must convert document text into spoken audio recordings upon saving files"
          },
          {
            "id": "C",
            "text": "It must restrict document authoring permissions to staff members holding professional accessibility certificates"
          },
          {
            "id": "D",
            "text": "It must be accessible for authors with disabilities and support generating accessible output"
          }
        ],
        "answer": "D",
        "explanation": "ATAG 2.0 Part A requires the authoring user interface to be accessible, while Part B requires the tool to enable and preserve the creation of accessible content."
      }
    ]
  }
];
