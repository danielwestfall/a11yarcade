// IAAP ADS (Accessible Document Specialist) Modules (10 Modules)
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
            "text": "Assign alternative text describing it: alt=\"Decorative wavy graphic divider\""
          },
          {
            "id": "B",
            "text": "Tag it as an empty sub-heading structure tag (<H3></H3>) to preserve vertical spacing"
          },
          {
            "id": "C",
            "text": "Mark it as an /Artifact so assistive technologies ignore decorative shapes during reading"
          },
          {
            "id": "D",
            "text": "Delete the divider from the print layout to avoid PDF tagging structural issues"
          }
        ],
        "answer": "C",
        "explanation": "In PDF/UA and accessible document authoring, purely decorative graphics must be tagged as `/Artifact` so screen readers do not announce useless noise."
      },
      {
        "id": "kc-ads-alt-2",
        "question": "A button displays only a printer icon without any visible text. What should the alternative text be?",
        "options": [
          {
            "id": "A",
            "text": "alt=\"Detailed high-resolution visual rendering of a black office inkjet printer\""
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
            "text": "alt=\"Print this document\" (describing the action performed upon activation)"
          }
        ],
        "answer": "D",
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
            "text": "Provide a concise summary in alt text and a full accessible data table in the body"
          },
          {
            "id": "C",
            "text": "Mark the complex statistical chart as an /Artifact to reduce screen reader verbosity"
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
            "text": "The chronological timestamp when each text block was typed by the author"
          },
          {
            "id": "D",
            "text": "The Logical Structure Tree (Tags panel) dictates screen reader reading order"
          }
        ],
        "answer": "D",
        "explanation": "Under ISO 14289-1 (PDF/UA), screen readers rely exclusively on the logical Tags Tree structure to read content and announce semantics."
      },
      {
        "id": "kc-ads-tag-2",
        "question": "A document jumps directly from an <H1> title to an <H4> subhead because the author wanted a smaller font size. What is the proper remediation?",
        "options": [
          {
            "id": "A",
            "text": "Retain the <H4> tag because visual font styling takes precedence over hierarchy"
          },
          {
            "id": "B",
            "text": "Remove heading structural semantics and convert the paragraph text into bold copy"
          },
          {
            "id": "C",
            "text": "Change the tag to <H2> and adjust the visual font styling in the authoring tool"
          },
          {
            "id": "D",
            "text": "Insert empty structural heading tags (<H2></H2><H3></H3>) to bridge the skipped numerical gap"
          }
        ],
        "answer": "C",
        "explanation": "Heading levels must strictly follow a logical numerical hierarchy without skipping levels. Visual styling should be adjusted via styles or fonts, not by distorting semantic tags."
      },
      {
        "id": "kc-ads-tag-3",
        "question": "What is required for a data table to be considered accessible in PDF/UA?",
        "options": [
          {
            "id": "A",
            "text": "Table cells must be tagged strictly as <TD> data cells with no header tags"
          },
          {
            "id": "B",
            "text": "The entire data table must be rasterized into a flat bitmap figure with an alternative text string"
          },
          {
            "id": "C",
            "text": "Data tables are restricted from containing currency numbers or statistical symbols"
          },
          {
            "id": "D",
            "text": "Header cells must be tagged as <TH> with Scope attributes defining data cell associations"
          }
        ],
        "answer": "D",
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
            "text": "Whether an image tag lacks an /Alt property string in document structural syntax"
          },
          {
            "id": "C",
            "text": "Whether narrative paragraphs are written in concise, readable plain language"
          },
          {
            "id": "D",
            "text": "Whether the reading order sequence makes logical sense across complex columns"
          }
        ],
        "answer": "B",
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
            "text": "An international copyright convention governing cross-border distribution of braille publications"
          },
          {
            "id": "C",
            "text": "A digital encryption standard for transmitting confidential PDF documents"
          },
          {
            "id": "D",
            "text": "A typographic formatting standard for commercial digital publishing software"
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
            "text": "Automated validators run on Windows operating system desktop environments"
          },
          {
            "id": "B",
            "text": "Because Adobe Acrobat Pro terms of service prohibit automated validator scripts"
          },
          {
            "id": "C",
            "text": "To verify reading order, table announcements, and alt text equivalence in speech"
          },
          {
            "id": "D",
            "text": "Screen readers automatically reconstruct broken tag trees while reading the document aloud"
          }
        ],
        "answer": "C",
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
            "text": "Click Here to open the new corporate human resources benefits document"
          },
          {
            "id": "B",
            "text": "https://benefits.example.com/download/secure?doc_id=984128&format=pdf"
          },
          {
            "id": "C",
            "text": "Read More about our comprehensive organization policies and annual plans"
          },
          {
            "id": "D",
            "text": "Download Employee Benefits Guide 2025 (PDF, 1.2 MB)"
          }
        ],
        "answer": "D",
        "explanation": "Accessible links clearly state the destination, subject, file format, and file size so users know exactly what will occur when activated."
      },
      {
        "id": "kc-ads-pl-2",
        "question": "Why should document authors use native list formatting instead of typing manual dashes or asterisks?",
        "options": [
          {
            "id": "A",
            "text": "Manual dashes prevent automated spellcheck tools from parsing sentence grammar"
          },
          {
            "id": "B",
            "text": "Manual dashes violate ISO PDF/A long-term digital preservation standards"
          },
          {
            "id": "C",
            "text": "Native list tools generate semantic <L>/<LI> tags, announcing count and position"
          },
          {
            "id": "D",
            "text": "Hyphenated bullet characters trigger PostScript rasterization failures on office laser printers"
          }
        ],
        "answer": "C",
        "explanation": "Native list formatting tags items semantically (`<L>`, `<LI>`, `<Lbl>`, `<LBody>`), allowing assistive technology to announce \"List with 5 items, item 1\"."
      },
      {
        "id": "kc-ads-pl-3",
        "question": "What is the primary benefit of adhering to plain language standards in electronic documents?",
        "options": [
          {
            "id": "A",
            "text": "It enables electronic documents to be indexed faster by automated OCR scanning software"
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
            "text": "It aids readers with cognitive disabilities, non-native speakers, and broader readers"
          }
        ],
        "answer": "D",
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
            "text": "OCR rasterizes vector typography into low-resolution bitmap character layers"
          },
          {
            "id": "B",
            "text": "Optical Character Recognition software is disallowed under federal Section 508 ICT standards"
          },
          {
            "id": "C",
            "text": "OCR generates raw text; it does not tag headings, tables, reading order, or language"
          },
          {
            "id": "D",
            "text": "Screen reader software cannot process any PDF document containing raster images"
          }
        ],
        "answer": "C",
        "explanation": "Optical Character Recognition converts scanned page bitmaps into selectable text characters, but it does not reliably generate PDF/UA semantic tags (<H1>, <Table>, <L>), verify logical reading order, or set document language metadata without human remediation."
      },
      {
        "id": "kc-ads-ocr-2",
        "question": "Which high-frequency OCR transcription defect can severely impair screen reader pronunciation if left uncorrected?",
        "options": [
          {
            "id": "A",
            "text": "Lossless vector path compression artifacts in technical architectural drawings"
          },
          {
            "id": "B",
            "text": "Automatic font subset embedding errors during document print spooling"
          },
          {
            "id": "C",
            "text": "Excessive scanning DPI resolution in underlying bitmap document background layers"
          },
          {
            "id": "D",
            "text": "Look-alike glyph errors (e.g. mistaking \"rn\" for \"m\", or \"1\" for lowercase \"l\")"
          }
        ],
        "answer": "D",
        "explanation": "Optical character engines frequently confuse visually similar character pairs (such as \"rn\" vs \"m\" or \"1\" vs \"l\"), causing screen reader text-to-speech synthesizers to mispronounce words."
      },
      {
        "id": "kc-ads-ocr-3",
        "question": "Under ISO 14289-1 (PDF/UA), what metadata attribute must be defined for an OCR-remediated document so that screen readers pronounce words with correct phonetics?",
        "options": [
          {
            "id": "A",
            "text": "The personal employee identification number of the scanning machine operator"
          },
          {
            "id": "B",
            "text": "The document primary natural language (e.g. en-US or fr-FR) for pronunciation"
          },
          {
            "id": "C",
            "text": "The optical dots-per-inch (DPI) scanner hardware resolution calibrated when capturing the page"
          },
          {
            "id": "D",
            "text": "The color separation profile (CMYK vs RGB) for commercial print machinery"
          }
        ],
        "answer": "B",
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
            "text": "Adobe Acrobat Pro lacks tools to create or modify <H1> and <H2> heading tags in the tag tree"
          },
          {
            "id": "B",
            "text": "Source authoring files inherently have smaller file sizes than exported PDFs"
          },
          {
            "id": "C",
            "text": "Federal Section 508 standards strictly prohibit editing PDFs post-export"
          },
          {
            "id": "D",
            "text": "Re-exporting from source authoring files overwrites custom Acrobat tag tree fixes"
          }
        ],
        "answer": "D",
        "explanation": "Remediating in the source authoring tool (Word or InDesign) preserves native heading styles, table headers, and export templates across future revisions, whereas manual tag-tree edits inside Adobe Acrobat Pro must be redone whenever the source document is re-exported."
      },
      {
        "id": "kc-ads-auth-2",
        "question": "In Microsoft Word, what action is necessary to ensure a table spanning multiple pages exports to PDF with valid <TH> table header tags on every page?",
        "options": [
          {
            "id": "A",
            "text": "Manually copy and paste the header row text at the top of each page break"
          },
          {
            "id": "B",
            "text": "In Word Table Properties, check \"Repeat as header row at the top of each page\""
          },
          {
            "id": "C",
            "text": "Draw a thick visual border around the top row to designate header semantics"
          },
          {
            "id": "D",
            "text": "Export the multi-page data table as a sequence of static PNG figures with descriptive alt text"
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
            "text": "Export Tagging in InDesign Paragraph Style Options (mapping styles to PDF tags)"
          },
          {
            "id": "B",
            "text": "The InDesign Preflight Panel configuring automated document print profiles"
          },
          {
            "id": "C",
            "text": "The InDesign Glyphs Panel inserting specialized typographic Unicode symbols"
          },
          {
            "id": "D",
            "text": "The Object State Manager configuring interactive multi-state presentation buttons"
          }
        ],
        "answer": "A",
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
            "text": "Automated validators disable graphic inspection to accelerate document processing"
          },
          {
            "id": "B",
            "text": "Automated checkers verify the presence of an /Alt tag, not semantic description accuracy"
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
        "answer": "B",
        "explanation": "Automated validators check syntax (e.g. \"Is the /Alt key present and non-empty?\"). They cannot evaluate whether \"chart_v2.png\" provides meaningful content to a human listener."
      },
      {
        "id": "kc-ads-lim-2",
        "question": "Which critical document defect is virtually impossible for automated PDF validators to detect without manual human auditing?",
        "options": [
          {
            "id": "A",
            "text": "A multi-column article whose reading order reads horizontally across columns"
          },
          {
            "id": "B",
            "text": "A heading structure that skips numerically from an <H1> directly to an <H4>"
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
        "answer": "A",
        "explanation": "Automated validators verify that text is enclosed in tags, but cannot assess whether the logical reading order matches the human visual reading sequence across multi-column layouts."
      },
      {
        "id": "kc-ads-lim-3",
        "question": "Approximately what percentage of WCAG and PDF/UA accessibility requirements can be reliably and fully evaluated using automated testing tools alone?",
        "options": [
          {
            "id": "A",
            "text": "100% — modern AI accessibility algorithms have replaced human auditing tasks"
          },
          {
            "id": "B",
            "text": "Less than 1% — automated software tools inspect basic file encryption keys"
          },
          {
            "id": "C",
            "text": "Approximately 30% to 40% — the remainder requires human cognitive verification"
          },
          {
            "id": "D",
            "text": "Over 95% � automated rule engines verify nearly every WCAG requirement except color aesthetics"
          }
        ],
        "answer": "C",
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
            "text": "The Acrobat Table Editor (accessed via Table Cell Properties in TouchUp Reading Order)"
          },
          {
            "id": "B",
            "text": "The Acrobat Edit PDF TouchUp tool designed for nudging individual glyphs on the visual canvas"
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
        "answer": "A",
        "explanation": "The Acrobat Table Editor allows remediators to right-click individual table cells and set Table Cell Properties, including Header vs Data type, Scope, and Column/Row Span counts."
      },
      {
        "id": "kc-ads-acro-2",
        "question": "Under ISO 14289-1 (PDF/UA), what must be done with repetitive running headers and page number footers in Adobe Acrobat Pro?",
        "options": [
          {
            "id": "A",
            "text": "They must be tagged as <H1> headings at the top and bottom of every single page"
          },
          {
            "id": "B",
            "text": "They must be deleted from the document, removing printed page numbers from view"
          },
          {
            "id": "C",
            "text": "They must be marked as /Artifact so screen readers bypass repetitive header pagination"
          },
          {
            "id": "D",
            "text": "Decorative headers must be flattened into 600 DPI raster background layers on each document page"
          }
        ],
        "answer": "C",
        "explanation": "Running headers and footers are pagination furniture that disrupt text reading flow. Marking them as an /Artifact removes them from the screen reader speech stream while preserving print aesthetics."
      },
      {
        "id": "kc-ads-acro-3",
        "question": "Why does an underlined hyperlink in a PDF sometimes fail to work for screen reader users even though it is visually blue and clickable with a mouse?",
        "options": [
          {
            "id": "A",
            "text": "Screen readers are technically incapable of launching internet web browser URLs"
          },
          {
            "id": "B",
            "text": "The document author omitted a commercial Adobe Acrobat hyperlink encryption certificate key"
          },
          {
            "id": "C",
            "text": "Hyperlinks in PDF documents function when opened on macOS desktop viewers"
          },
          {
            "id": "D",
            "text": "The /Link annotation lacks an Object Reference (/OBJR) tag inside the <Link> tag"
          }
        ],
        "answer": "D",
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
            "text": "Ctrl + 4 (or Cmd + 4 on macOS) activating Acrobat Reflow single-column mode"
          },
          {
            "id": "B",
            "text": "Ctrl + Alt + Delete opening the Windows task management dialog window"
          },
          {
            "id": "C",
            "text": "Pressing F12 to launch browser DOM inspector panels while viewing the PDF in a desktop reader"
          },
          {
            "id": "D",
            "text": "Shift + Escape closing active background utility processes in the workspace"
          }
        ],
        "answer": "A",
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
            "text": "Running Acrobat Accessibility Full Check with the Show Title flag disabled"
          },
          {
            "id": "C",
            "text": "Re-tagging the root document catalog dictionary manually in the Preflight panel"
          },
          {
            "id": "D",
            "text": "In Acrobat Properties (Ctrl+D) -> Initial View, set \"Show: Document Title\""
          }
        ],
        "answer": "D",
        "explanation": "In Adobe Acrobat Pro, setting \"Show: Document Title\" under File > Properties > Initial View writes /DisplayDocTitle true into /ViewerPreferences (Matterhorn 07-001), whereas renaming the OS filename on disk or editing the Author/Subject fields does not change the window title bar behavior."
      },
      {
        "id": "kc-ads-manual-3",
        "question": "During manual screen reader testing of a PDF table with NVDA, pressing \"T\" jumps to the table, but the screen reader does not announce column headers when pressing Ctrl+Alt+Arrow keys. What manual remediation in the Acrobat Tags Tree is needed?",
        "options": [
          {
            "id": "A",
            "text": "Delete the entire table and replace it with a raster screenshot of the cells"
          },
          {
            "id": "B",
            "text": "Ensure header cells are tagged as <TH> with Scope declared in Table Cell Properties"
          },
          {
            "id": "C",
            "text": "Mute the screen reader audio synthesizer while stepping through the document with arrow keys"
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
            "text": "The document visual font sizes must be enlarged to a minimum of 24pt bold"
          },
          {
            "id": "B",
            "text": "InDesign requires installing third-party Acrobat plugins to output tagged PDFs"
          },
          {
            "id": "C",
            "text": "The document color space must be converted from RGB to CMYK before exporting tagged PDF files"
          },
          {
            "id": "D",
            "text": "The author must check \"Use for Tagging Order in Tagged PDF\" in the Articles panel menu"
          }
        ],
        "answer": "D",
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
            "text": "It links frames into a unified story, ensuring cross-column text is read continuously"
          },
          {
            "id": "C",
            "text": "It applies digital rights management encryption so end users cannot copy or print page text"
          },
          {
            "id": "D",
            "text": "It compresses high-resolution raster images, shrinking the overall PDF file size"
          }
        ],
        "answer": "B",
        "explanation": "Unthreaded text frames are treated as distinct independent content containers, causing screen readers and reflow mode (<Ctrl+4>) to fragment sentences that break across columns."
      },
      {
        "id": "kc-ads-arch-3",
        "question": "What happens when a chart graphic is placed as a floating unanchored object on the margin of a page in Adobe InDesign or Microsoft Word?",
        "options": [
          {
            "id": "A",
            "text": "The chart is exported at the end of the page tag tree, detached from context"
          },
          {
            "id": "B",
            "text": "The chart graphic is automatically converted into an interactive HTML5 canvas tag"
          },
          {
            "id": "C",
            "text": "The exported PDF fails to open in standard Adobe Acrobat viewer software"
          },
          {
            "id": "D",
            "text": "The graphic resolution is automatically compressed to 72 DPI monochrome bitmap"
          }
        ],
        "answer": "A",
        "explanation": "Floating unanchored objects are placed at the end of the page content stream or in arbitrary order based on visual z-index. Anchoring the graphic inline guarantees it appears adjacent to its textual reference in the reading order."
      }
    ]
  }
];
