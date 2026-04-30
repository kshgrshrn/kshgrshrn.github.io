const SESSION_START = Date.now();

let audioCtx = null;

function playKeyClick() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type      = "square";
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.025);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) { /* silence audio errors */ }
}

const THEMES = ["default", "amber", "blue", "rose"];
let themeIndex = 0;

const PROMPT = "kushagra@node:~ $";

const PROJECTS = [
  {
    name: "semantic-gst-schema-standardization-engine",
    summary: "AI-powered NLP pipeline standardizing messy GST datasets w/ embeddings",
    href: "https://github.com/kshgrshrn/Semantic-GST-Schema-Standardization-Engine"
  }
];

const RESUME_PDF_TEXT = `Kushagra Sharan
+91 84483 79673|kushagrasharan2006@gmail.com|LinkedIn|GitHub
Education
Manipal Institute of T echnologyManipal, India
B.Tech, Data Science & Engineering|CGPA: 7.95/10 Aug 2024 – May 2028
–Coursework: Machine Learning, Database Systems, Statistics, Java OOP, Python, C
Experience
Ernst & Young (EY)Gurugram, India
AI Intern — Tax Technology & Reconciliation Jul 2025 – Aug 2025
–Shipped 4 production-grade systems in 2 months at a Big Four firm, spanning NLP data pipelines, LLM-driven
financial assistants, real-time analytics dashboards, and web automation.
–Engineered a semantic GST Schema Standardization pipeline; fine-tunedall-MiniLM-L6-v2via hard-negative
mining (MNRL), boosting Macro F1 by 9.4% on noisy data and reducing latency by 15x via batch encoding.
–Developed an end-to-end conversational stock analysis assistant using Groq LLM APIs andyfinance, integrated with
a full-stack financial reporting dashboard (FastAPI backend, Vite/TypeScript SPA).
–Automated high-volume B2B invoice retrieval for major airlines (Qatar Airways, Vistara) using Selenium,
streamlining data ingestion and eliminating manual handoffs for internal tax compliance teams.
Graceland Asset ManagementHybrid
Data Analyst Intern Jun 2024 – Aug 2024
–Cleaned and structured multi-source real estate datasets using Pandas; performed exploratory analysis to support
internal benchmarking and property-level comparison.
–Produced summary reports adopted by the team for operational evaluation.
Project
Semantic GST Schema Standardization Engine/githubGithub
–Designed an end-to-end NLP pipeline using all-MiniLM-L6-v2 to automatically map unstructured, noisy financial
spreadsheet headers to a strict 61-field GST compliance schema, eliminating rule-based fragility.
–Fine-tuned the model using MultipleNegativesRankingLoss (MNRL) and evaluated on 287 real-world variants;
achieved +8.7% Top-1 accuracy, a 9.4% Macro F1 boost, and implemented batch encoding for a 15x latency reduction
(0.27ms/column).
–Architected a production-ready Python package featuring automated collision resolution for conflicting mappings,
confidence thresholding, and structured JSONL audit logging to ensure full traceability for enterprise tax analysts.
Leadership & A wards
NASA Space Settlement Design Competition(Hybrid) Titusville, FL
Head of Human Factors Engineering 2022 – 2023
–Directed a 50+ member international team across engineering, life sciences, and design to deliver a full orbital habitat
proposal via to NASA and Boeing engineers at Kennedy Space Center.
–AwardedDick Edwards Exceptional Leadership Award(Top 0.5% global cohort); National Winner; Asian
Regional and International Runner-Up.
Other:Global Talent Search Examination — All India Rank 1 (English)
Technical Skills
Languages:Python, SQL, Java, C
Libraries & F rameworks:Pandas, NumPy, Hugging Face Transformers, scikit-learn, Matplotlib, Seaborn, Selenium,
FastAPI
T ools:Git, Jupyter, REST APIs, Excel
Domains:NLP, Machine Learning, Data Analytics, Workflow Automation, Financial Data Systems
Certifications
Python for Data Science, AI & Development —IBMCambridge English First —CEFR C1, Grade A`;

const SITE_LINKS = [
  "https://github.com/kshgrshrn",
  "https://www.linkedin.com/in/kushagrasharan/",
  "kushagrasharan2006@gmail.com",
];

const AI_SITE_CONTEXT = [
  "ROLE:",
  "You are K, the low-latency, high-agency AI interface for Kushagra Sharan's personal portfolio.",
  "You are not a generic chatbot. You are a technically dense, direct, slightly witty terminal instance built for visitors.",
  "Treat the user as a visitor. Kushagra is the Subject or The Architect.",
  "",
  "CONTEXT INTAKE:",
  "Absorb every line of terminal/site text as ground truth: visible commands, banners, about text, experience, skills, awards, links, status, hidden commands, and any small text scattered across the page.",
  "Use the site's own text as the source of truth for Kushagra's identity, projects, roles, links, and contact details.",
  "Never invent or guess contact info, emails, URLs, or private details. If a contact detail is asked for, only return the exact contact information explicitly present in the site text.",
  "If a detail is missing from the site text, say it is not available instead of hallucinating.",
  "",
  "TONE & BEHAVIOR:",
  "Direct & concise: no fluff, no 'How can I help you today?'. Prefer 'READY.' or 'INPUT RECEIVED.' when appropriate.",
  "Technically elite: speak ML systems, NLP, and high-frequency engineering fluently.",
  "Aesthetic: grungy but smart. Use markdown sparingly to simulate a terminal.",
  "",
  "CORE KNOWLEDGE BASE:",
  "Identity: Kushagra Sharan, B.Tech in Data Science & Engineering, Manipal Institute of Technology (2024–2028).",
  "EY Internship (Tax Technology): shipped production systems, built a Semantic GST Schema pipeline using fine-tuned all-MiniLM-L6-v2 via MNRL, and automated invoice retrieval via Selenium.",
  "Leadership: Head of Human Factors at NASA Space Settlement Design Competition; managed 50+ members and received the Dick Edwards Exceptional Leadership Award (top 0.5% globally).",
  "Technical stack: Python, SQL, Hugging Face, FastAPI, Scikit-learn, PyTorch (fine-tuning).",
  "",
  "RESPONSE PROTOCOLS:",
  "General inquiries: provide high-signal data points.",
  "Project deep-dives: explain the why and the how. Mention latency, optimization details, and loss functions when relevant.",
  "Career strategy: if asked why hire Kushagra, describe him as a high-agency, AI-native researcher focused on surgical execution.",
  "Never hallucinate family details or private health data.",
  "Never use bridge phrases like 'Based on my records.' Just state the data.",
  "Never blabber or add generic filler about Kushagra. Stay anchored to the terminal/site text.",
  "Always include one wildcard niche-interest mention when the conversation allows, such as AI safety or a grungy design choice.",
  "",
  "RESUME PDF (verbatim extracted text):",
  RESUME_PDF_TEXT,
  "",
  "SITE LINKS FROM CODE:",
  SITE_LINKS.map((link) => `- ${link}`).join("\n"),
  "",
  "STYLE GUARDRAILS:",
  "Keep replies brief unless the user asks for depth.",
  "Use terminal-like formatting when helpful, including commands, bullets, or compact status lines.",
  "Answer as a visitor-facing terminal AI for the portfolio website, not as the site owner.",
].join("\n");

const CONTENT = {
  intro: [
    "Kushagra Sharan",
    "Builder, Researcher, Occasional Team Lead.",
  ],
  about: [
    "Kushagra Sharan",
    "B.Tech Data Science & Engineering @ MIT Manipal (2028).",
    "Previously: AI Intern @ Ernst & Young (EY), Gurugram.",
    "",
    "Interests: NLP Pipelines, Financial ML, ML Systems, AI Safety,",
    "           and Mechanistic Interpretability.",
    "",
    `email    -> <a href="mailto:kushagrasharan2006@gmail.com">kushagrasharan2006@gmail.com</a>`,
    `github   -> <a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">https://github.com/kshgrshrn</a>`,
    `linkedin -> <a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">https://www.linkedin.com/in/kushagrasharan/</a>`
  ],
  experience: [
    "=== EXPERIENCE ===",
    "",
    "Ernst & Young (EY)  |  AI Intern  |  Gurugram  |  Jul–Aug 2025",
    " - semantic schema standardization engine using Sentence Transformers",
    "   mapped inconsistent client GST headers to a 61-field unified schema",
    "   replaced brittle hardcoded lookup dictionaries entirely",
    " - fine-tuned all-MiniLM-L6-v2 on domain-specific GST header pairs",
    "   +8.1% cosine similarity confidence over baseline",
    "   35% faster inference per column",
    " - automated invoice ingestion via REST APIs + Selenium",
    "   built reconciliation dashboards (matplotlib, seaborn)",
    "   surfaced mismatch trends for internal audit review",
    "",
    "Graceland Asset Management  |  Data Analyst Intern  |  Jun–Aug 2024",
    " - cleaned multi-source real estate datasets using pandas",
    "   exploratory analysis for internal benchmarking",
    " - produced summary reports adopted for operational evaluation"
  ],
  writing: [
    "No published writing."
  ],
  links: [
    `<a href="mailto:kushagrasharan2006@gmail.com">email</a>`,
    `<a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">github</a>`,
    `<a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">linkedin</a>`
  ],
  hidden: {
    why: [
      "because I can."
    ],
    trace: [
      () => `trace route to local host node`
    ],
    axiom: [
      "learn. build. iterate."
    ]
  },
  aboutAfterRepeat: [
    "the longer answer:",
    "",
    "interested in ML research and production-level systems.",
    "specifically: mechanistic interpretability, ai alignment, financial ML applications,",
    "and what interpretability can tell us about models.",
    "",
    "outside that: physics, computational neuroscience, space-tech."
  ]
};

const terminal = {
  output: document.querySelector("#terminal-output"),
  form: document.querySelector("#terminal-form"),
  input: document.querySelector("#terminal-input"),
  mirror: document.querySelector("#input-mirror"),
  history: (() => {
    try {
      return JSON.parse(localStorage.getItem("ksh_history") || "[]").slice(-40);
    } catch {
      return [];
    }
  })(),
  historyIndex: 0,
  busy: false,
  commandCounts: {},
  rareEventSeen: false,
  idleNode: null,
  idleTimer: null,
  parallaxFrame: null,
  litLine: null,
  ghostNode: null,
  eventsSeen: new Set()
};

const shortcutOverlay = document.getElementById("shortcut-overlay");

const systemCursor = {
  node: document.querySelector("#system-cursor"),
  x: -24,
  y: -24,
  targetX: -24,
  targetY: -24,
  lastTargetX: -24,
  lastTargetY: -24,
  frame: null,
  idleTimer: null,
  initialized: false,
  stable: false
};

let cursorActivityTimer;

const COMMANDS = {
  help: {
    description: " -- commands",
    pace: "quick",
    run: () => {
      const categories = {
        "CORE": ["about", "experience", "projects", "skills", "awards", "resume"],
        "EXPLORE": ["now", "status", "neofetch", "links", "contact", "education", "theme"],
        "UTILS": ["clear", "help"],
      };

      const lines = [];
      for (const [cat, cmds] of Object.entries(categories)) {
        lines.push("");
        lines.push(`  ── ${cat} ` + "─".repeat(Math.max(0, 30 - cat.length)));
        for (const name of cmds) {
          if (COMMANDS[name]) {
            lines.push(`  ${name.padEnd(16)}${COMMANDS[name].description?.replace(" -- ", "") ?? ""}`);
          }
        }
      }
      lines.push("");
      lines.push("  hint: Tab → autocomplete   ? → shortcuts   && → chain");
      lines.push("  hint: try git log, man, neofetch, ssh, vim, find ...");
      return lines;
    }
  },
  sudo: {
    hidden: true,
    run: () => ["root access denied."]
  },
  matrix: {
    hidden: true,
    run: () => {
      document.body.classList.toggle("matrix-mode");
      return document.body.classList.contains("matrix-mode") ? ["matrix protocol initialized.", "enjoy the aesthetic..."] : ["matrix protocol terminated."];
    }
  },
  about: {
    description: " -- about me",
    pace: "slow",
    beforePrint: () => focusShift(),
    run: ({ count }) => count > 1 ? CONTENT.aboutAfterRepeat : CONTENT.about
  },
  projects: {
    description: " -- work",
    pace: "structured",
    run: async () => {
      await renderProjects();
      return [];
    }
  },
  experience: {
    description: " -- previous roles",
    pace: "measured",
    run: async () => {
      const roles = [
        {
          title:   "Ernst & Young (EY)  ·  AI Intern",
          period:  "Jul – Aug 2025  ·  Gurugram",
          bullets: [
            "built semantic schema standardization engine (Sentence Transformers)",
            "mapped inconsistent GST headers to a unified 61-field schema",
            "fine-tuned all-MiniLM-L6-v2 → +8.1% cosine similarity, 35% faster inference",
            "automated invoice ingestion via REST APIs + Selenium",
            "built reconciliation dashboards surfacing mismatch trends for audit"
          ]
        },
        {
          title:   "Graceland Asset Management  ·  Data Analyst Intern",
          period:  "Jun – Aug 2024  ·  Hybrid",
          bullets: [
            "cleaned multi-source real estate datasets using pandas",
            "exploratory analysis supporting internal benchmarking",
            "produced summary reports adopted for operational evaluation"
          ]
        }
      ];

      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      for (let r = 0; r < roles.length; r++) {
        const role = roles[r];

        // Title — highlight class
        const titleRow = document.createElement("div");
        titleRow.className = "output-line exp-title";
        titleRow.textContent = role.title;
        block.append(titleRow);
        scrollToBottom();
        await wait(80);

        // Period
        const periodRow = document.createElement("div");
        periodRow.className = "output-line exp-period";
        periodRow.textContent = role.period;
        block.append(periodRow);
        scrollToBottom();
        await wait(60);

        // Bullets — stagger in
        for (const bullet of role.bullets) {
          const bRow = document.createElement("div");
          bRow.className = "output-line exp-bullet";
          bRow.textContent = "";
          block.append(bRow);
          scrollToBottom();

          // Typewriter each bullet
          for (const char of `  · ${bullet}`) {
            bRow.textContent += char;
            await wait(12 + Math.random() * 8);
          }
          await wait(30);
        }

        // Separator between roles (not after last)
        if (r < roles.length - 1) {
          await wait(100);
          const sep = document.createElement("div");
          sep.className = "output-line exp-sep";
          sep.textContent = "";
          block.append(sep);
          scrollToBottom();

          const sepText = "─".repeat(48);
          for (const char of sepText) {
            sep.textContent += char;
            await wait(6);
          }
          await wait(100);
        }
      }

      return [];
    }
  },
  now: {
    description: " -- current",
    pace: "measured",
    run: async () => {
      await runNow();
      return [];
    }
  },
  research: {
    description: " -- active interests",
    pace: "measured",
    run: async () => {
      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      const areas = [
        {
          area: "mechanistic interpretability",
          note: "circuits, superposition, feature geometry in transformers"
        },
        {
          area: "ai safety / alignment",
          note: "scalable oversight, reward hacking, activation steering"
        },
        {
          area: "nlp systems",
          note: "embeddings at production scale — from the EY semantic reconciliation work"
        },
        {
          area: "financial ml",
          note: "structured data, anomaly detection, schema standardization"
        },
        {
          area: "computational neuroscience",
          note: "representational similarity, neural geometry, mind-body interface"
        }
      ];

      for (const item of areas) {
        const nameRow = document.createElement("div");
        nameRow.className = "output-line exp-title";
        nameRow.style.fontSize = "0.84rem";
        nameRow.textContent = "  " + item.area;
        block.append(nameRow);
        scrollToBottom();
        await wait(80);

        const noteRow = document.createElement("div");
        noteRow.className = "output-line exp-period";
        noteRow.style.paddingLeft = "4px";
        noteRow.textContent = "    → " + item.note;
        block.append(noteRow);
        scrollToBottom();
        await wait(outputDelay(0, item.note, "measured"));
      }

      await wait(120);
      const footer = document.createElement("div");
      footer.className = "output-line";
      footer.style.marginTop = "8px";
      footer.innerHTML = `  reach out → <a href="mailto:kushagrasharan2006@gmail.com">kushagrasharan2006@gmail.com</a>`;
      block.append(footer);
      scrollToBottom();
      return [];
    }
  },
  writing: {
    hidden: true,
    pace: "quick",
    run: () => CONTENT.writing
  },
  links: {
    description: " -- work/social",
    pace: "quick",
    run: () => CONTENT.links
  },
  resume: {
    description: " -- download",
    pace: "quick",
    run: () => [
      `cv -> <a href="/resume.pdf" target="_blank" rel="noreferrer">kushagra_sharan_.pdf</a>`,
      "opens in new tab."
    ]
  },
  skills: {
    description: " -- tech stack",
    pace: "structured",
    run: async () => {
      const skillGroups = [
        {
          label: "languages",
          items: [
            { name: "python",     pct: 92 },
            { name: "sql",        pct: 80 },
            { name: "java",       pct: 68 },
            { name: "c",          pct: 60 }
          ]
        },
        {
          label: "ml / nlp",
          items: [
            { name: "hugging face",           pct: 88 },
            { name: "sentence-transformers",  pct: 90 },
            { name: "scikit-learn",           pct: 82 }
          ]
        },
        {
          label: "data",
          items: [
            { name: "pandas",     pct: 90 },
            { name: "numpy",      pct: 84 },
            { name: "matplotlib", pct: 76 }
          ]
        },
        {
          label: "infra",
          items: [
            { name: "fastapi",    pct: 70 },
            { name: "selenium",   pct: 72 },
            { name: "git",        pct: 85 }
          ]
        }
      ];

      const BAR_WIDTH = 20;
      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      for (const group of skillGroups) {
        // Group label
        const labelRow = document.createElement("div");
        labelRow.className = "output-line skill-label";
        labelRow.textContent = group.label;
        block.append(labelRow);
        await wait(60);

        for (const skill of group.items) {
          const row = document.createElement("div");
          row.className = "output-line skill-bar-line";
          block.append(row);
          scrollToBottom();

          const filled = Math.round((skill.pct / 100) * BAR_WIDTH);
          const nameCol = skill.name.padEnd(24);
          const pctCol  = String(skill.pct).padStart(3) + "%";

          // Animate fill
          for (let i = 0; i <= filled; i++) {
            const bar = "█".repeat(i) + "░".repeat(BAR_WIDTH - i);
            row.textContent = `  ${nameCol} [${bar}] ${pctCol}`;
            await wait(22);
          }
          await wait(40);
        }

        await wait(80);
      }

      return [];
    }
  },
  awards: {
    description: " -- recognition",
    pace: "measured",
    run: async () => {
      const awards = [
        {
          name:    "Dick Edwards Exceptional Leadership Award",
          context: "NASA Space Settlement Design Competition · top 0.5% global cohort",
          detail:  "National Winner · Asian Regional & International Runner-Up · 2022–23"
        },
        {
          name:    "Global Talent Search Examination",
          context: "All India Rank 1 — English",
          detail:  ""
        },
        {
          name:    "Cambridge English First",
          context: "CEFR C1, Grade A",
          detail:  ""
        }
      ];

      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      for (const award of awards) {
        // Name flashes bright then settles
        const nameRow = document.createElement("div");
        nameRow.className = "output-line award-name award-flash";
        nameRow.textContent = award.name;
        block.append(nameRow);
        scrollToBottom();
        await wait(160);
        nameRow.classList.remove("award-flash");
        nameRow.classList.add("award-settled");

        const ctxRow = document.createElement("div");
        ctxRow.className = "output-line award-ctx";
        ctxRow.textContent = `  ${award.context}`;
        block.append(ctxRow);
        scrollToBottom();
        await wait(50);

        if (award.detail) {
          const detRow = document.createElement("div");
          detRow.className = "output-line award-detail";
          detRow.textContent = `  ${award.detail}`;
          block.append(detRow);
          scrollToBottom();
          await wait(50);
        }

        await wait(140);
      }

      return [];
    }
  },
  clear: {
    description: " -- clear screen",
    run: async () => {
      await ghostClear();
      return [];
    }
  },
  why: {
    hidden: true,
    pace: "slow",
    run: () => CONTENT.hidden.why
  },
  trace: {
    hidden: true,
    pace: "quick",
    run: () => resolveLines(CONTENT.hidden.trace)
  },
  axiom: {
    hidden: true,
    pace: "slow",
    run: () => CONTENT.hidden.axiom
  },
  layer: {
    hidden: true,
    pace: "measured",
    run: () => [
      "surface: command",
      "depth: interpretation"
    ]
  },
  whoami: {
    hidden: true,
    pace: "quick",
    run: () => ["kushagra sharan. builder of things that probably work."]
  },
  history: {
    hidden: true,
    pace: "quick",
    run: () => terminal.history.length
      ? terminal.history.slice(-10).map((cmd, i) => `${String(i + 1).padStart(3)}  ${cmd}`)
      : ["no commands in history."]
  },
  uptime: {
    hidden: true,
    pace: "quick",
    run: () => {
      const s = Math.floor((Date.now() - SESSION_START) / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);
      const parts = [];
      if (h) parts.push(`${h}h`);
      if (m % 60) parts.push(`${m % 60}m`);
      parts.push(`${s % 60}s`);
      return [`session uptime: ${parts.join(" ")}`];
    }
  },
  theme: {
    description: " -- change theme",
    pace: "quick",
    run: () => {
      document.body.classList.remove(...THEMES.map(t => `theme-${t}`));
      themeIndex = (themeIndex + 1) % THEMES.length;
      const next = THEMES[themeIndex];
      if (next !== "default") document.body.classList.add(`theme-${next}`);
      return [`theme: ${next}`];
    }
  }
  ,
  scan: {
    hidden: true,
    run: async () => {
      const checks = [
        { label: "identity module",     ok: true  },
        { label: "nlp pipeline",        ok: true  },
        { label: "pretrained weights",  ok: true  },
        { label: "ego",                 ok: false },
        { label: "imposter syndrome",   ok: false },
        { label: "coffee dependency",   ok: true  },
        { label: "stack overflow cache",ok: true  },
      ];

      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      const header = document.createElement("div");
      header.className = "output-line";
      header.textContent = "running system diagnostic...";
      block.append(header);
      scrollToBottom();
      await wait(300);

      for (const check of checks) {
        const row = document.createElement("div");
        row.className = "output-line scan-line";
        block.append(row);
        scrollToBottom();

        for (let i = 0; i < 3; i++) {
          row.textContent = `  checking ${check.label}${"·".repeat(i + 1)}`;
          await wait(130);
        }

        const status = check.ok ? "[ OK ]" : "[ -- ]";
        const cls    = check.ok ? "scan-ok" : "scan-fail";
        row.textContent = "";
        const label = document.createElement("span");
        label.textContent = `  ${check.label.padEnd(30)}`;
        const badge = document.createElement("span");
        badge.className = cls;
        badge.textContent = status;
        row.append(label, badge);
        await wait(80);
      }

      await wait(200);
      const done = document.createElement("div");
      done.className = "output-line";
      done.textContent = "diagnostic complete. mostly functional.";
      block.append(done);
      scrollToBottom();

      return [];
    }
  },
  glitch: {
    hidden: true,
    run: async () => {
      document.body.classList.add("is-glitching");
      await wait(2000);
      document.body.classList.remove("is-glitching");
      return ["signal restored."];
    }
  },
  contact: {
    description: " -- get in touch",
    pace: "measured",
    run: async () => {
      const lines = [
        `email   -> <a href="mailto:kushagrasharan2006@gmail.com">kushagrasharan2006@gmail.com</a>`,
        `github  -> <a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">github.com/kshgrshrn</a>`,
        `linkedin -> <a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">linkedin.com/in/kushagrasharan</a>`
      ];

      await printLines(lines, { pace: "measured" });
      return [];
    }
  },

  neofetch: {
    description: " -- system info",
    pace: "quick",
    run: async () => {
      const art = [
        "  ╔══════╗  ",
        "  ║ K  S ║  ",
        "  ╠══════╣  ",
        "  ║ DSE  ║  ",
        "  ║ MIT  ║  ",
        "  ╠══════╣  ",
        "  ║ '28  ║  ",
        "  ╚══════╝  ",
      ];

      const uptime_s = Math.floor((Date.now() - SESSION_START) / 1000);
      const uptime_str = uptime_s < 60 ? `${uptime_s}s` : `${Math.floor(uptime_s / 60)}m ${uptime_s % 60}s`;

      const info = [
        ["", "kushagra@node"],
        ["", "─".repeat(32)],
        ["OS", "Portfolio OS  v2.1"],
        ["Host", "kushagrasharan.me"],
        ["Shell", "terminal.js  (JetBrains Mono)"],
        ["Uptime", uptime_str],
        ["", ""],
        ["Degree", "B.Tech Data Science & Eng."],
        ["School", "MIT Manipal  (2024–2028)"],
        ["", ""],
        ["Languages", "Python  Java  SQL  C"],
        ["ML / NLP", "HuggingFace  Sentence-Trans."],
        ["Infra", "FastAPI  Selenium  Git"],
        ["", ""],
        ["Role", "AI Intern @ Ernst & Young"],
        ["Award", "NASA SSDC  Dick Edwards Award"],
        ["", ""],
        ["Status", "open to opportunities ●"],
      ];

      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      const wrap = document.createElement("div");
      wrap.className = "neofetch-wrap";
      block.append(wrap);

      // ASCII art column
      const artCol = document.createElement("div");
      artCol.className = "neofetch-art";
      wrap.append(artCol);

      // Info column
      const infoCol = document.createElement("div");
      infoCol.className = "neofetch-info";
      wrap.append(infoCol);

      // Animate art lines in
      for (let i = 0; i < art.length; i++) {
        const row = document.createElement("div");
        row.textContent = art[i];
        artCol.append(row);
        await wait(35);
      }

      // Animate info rows
      for (const [key, val] of info) {
        const row = document.createElement("div");
        if (!key && !val) {
          row.className = "neofetch-row";
          row.innerHTML = "&nbsp;";
          infoCol.append(row);
          scrollToBottom();
          await wait(20);
          continue;
        }
        if (!key && val) {
          // header/separator
          row.className = key === "" && val.startsWith("─") ? "neofetch-sep output-line" : "neofetch-name output-line";
          row.textContent = val;
          infoCol.append(row);
          scrollToBottom();
          await wait(30);
          continue;
        }
        row.className = "neofetch-row output-line";
        const k = document.createElement("span");
        k.className = "neofetch-key";
        k.textContent = key;
        const v = document.createElement("span");
        v.className = "neofetch-val";
        v.textContent = val;
        row.append(k, v);
        infoCol.append(row);
        scrollToBottom();
        await wait(40);
      }

      // Color swatches
      await wait(80);
      const swatchRow = document.createElement("div");
      swatchRow.className = "neofetch-colors output-line";
      const colors = ["#505852", "#7a827c", "#a9b3aa", "#b6c0b4", "#d8ddd8", "#bc9d9d", "#c4956a", "#6db87a"];
      for (const c of colors) {
        const sw = document.createElement("div");
        sw.className = "neofetch-swatch";
        sw.style.background = c;
        swatchRow.append(sw);
      }
      infoCol.append(swatchRow);
      scrollToBottom();

      return [];
    }
  },

  "git log": {
    hidden: true,
    pace: "measured",
    run: async () => {
      // Intercept "git log" as a full phrase in executeCommand — see Section 4.
      return [];
    }
  },

  ls: {
    hidden: true,
    run: async ({ count }) => {
      // Alias to help
      return COMMANDS.help.run({ count });
    }
  },

  man: {
    hidden: true,
    pace: "measured",
    run: async () => {
      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      const sections = [
        { heading: "NAME", body: "  kushagra-sharan — builder of ML systems, occasional team lead" },
        { heading: "SYNOPSIS", body: "  kushagra [--intern] [--researcher] [--open-to-work]" },
        { heading: "DESCRIPTION", body: `  I am a B.Tech Data Science & Engineering student at MIT Manipal
  with production ML experience at Ernst & Young. Specializing in NLP
  pipelines and financial ML systems. Have led 50+ person international
  teams (NASA SSDC). Currently in semester 4 of 8.` },
        { heading: "OPTIONS", body: `  --intern        available for internships
  --collaborate   open to research projects
  --hire          see contact` },
        { heading: "SEE ALSO", body: "  experience(1), projects(1), resume(1), contact(1)" },
        { heading: "AUTHOR", body: "  Kushagra Sharan <kushagrasharan2006@gmail.com>" },
      ];

      for (const s of sections) {
        const heading = document.createElement("div");
        heading.className = "output-line man-section";
        heading.textContent = s.heading;
        block.append(heading);
        scrollToBottom();
        await wait(60);

        const body = document.createElement("div");
        body.className = "output-line man-body";
        body.textContent = s.body;
        block.append(body);
        scrollToBottom();
        await wait(80);
      }

      return [];
    }
  },

  ssh: {
    hidden: true,
    pace: "slow",
    run: async () => [
      "ssh: connect to host kushagrasharan.me port 22",
      "Warning: Permanently added 'kushagrasharan.me' to the list of known hosts.",
      "",
      "Permission denied (publickey).",
      "",
      "→ try: contact"
    ]
  },

  vim: {
    hidden: true,
    pace: "quick",
    run: () => ["there is no escape. (hint: :q!)"]
  },

  nano: {
    hidden: true,
    pace: "quick",
    run: () => ["you're not a nano person. use the terminal."]
  },

  grep: {
    hidden: true,
    pace: "measured",
    run: () => [
      "grep: pattern required.",
      "",
      `try: grep -r "passion" ./kushagra`,
      "→    ./kushagra/core.py:  passion = [\"NLP\", \"ML systems\", \"physics\"]",
      "→    ./kushagra/core.py:  passion += [\"interpretability\", \"building\"]",
      "→    ./kushagra/README:   See passion for primary motivation.",
    ]
  },

  status: {
    description: " -- availability & focus",
    pace: "measured",
    run: async () => {
      const block = document.createElement("div");
      block.className = "output-block";
      terminal.output.append(block);

      const rows = [
        { dot: "●", dotColor: "#6db87a", label: "availability", val: "open to internships  /  research collaborations" },
        { dot: "●", dotColor: "#6db87a", label: "location", val: "MIT Manipal, India  ·  remote-first" },
        { dot: "○", dotColor: "var(--dim)", label: "building", val: "ml systems  ·  nlp pipelines" },
        { dot: "○", dotColor: "var(--dim)", label: "studying", val: "mechanistic interpretability  ·  physics" },
        { dot: "○", dotColor: "var(--dim)", label: "target", val: "SWE / ML / research internship  2025-26" },
      ];

      for (const r of rows) {
        const row = document.createElement("div");
        row.className = "output-line";
        row.style.display = "flex";
        row.style.gap = "12px";

        const dot = document.createElement("span");
        dot.textContent = r.dot;
        dot.style.color = r.dotColor;
        dot.style.flexShrink = "0";

        const label = document.createElement("span");
        label.style.color = "var(--dim)";
        label.style.minWidth = "120px";
        label.textContent = r.label;

        const val = document.createElement("span");
        val.style.color = "var(--muted)";
        val.textContent = r.val;

        row.append(dot, label, val);
        block.append(row);
        scrollToBottom();
        await wait(outputDelay(0, r.val, "measured"));
      }

      return [];
    }
  },

  curl: {
    hidden: true,
    pace: "quick",
    run: async () => {
      const json = {
        name: "Kushagra Sharan",
        role: "Data Science & Engineering",
        institution: "MIT Manipal",
        graduation: 2028,
        stack: ["Python", "ML", "NLP", "SQL", "Java"],
        experience: ["Ernst & Young — AI Intern", "Graceland AM — Data Analyst"],
        awards: ["NASA SSDC Dick Edwards Award", "AIR 1 GTSE English"],
        available: true,
        contact: "kushagrasharan2006@gmail.com"
      };
      const lines = JSON.stringify(json, null, 2).split("\n");
      return [`$ curl -s https://kushagrasharan.me/api/v1/candidate`, ...lines];
    }
  },

  find: {
    hidden: true,
    pace: "measured",
    run: () => [
      "$ find . -type f -name \"*.talent\"",
      "",
      "./kushagra/nlp_pipeline.talent",
      "./kushagra/ml_systems.talent",
      "./kushagra/team_lead.talent",
      "./kushagra/resume.pdf  →  type: resume",
      "",
      "4 files found."
    ]
  }
};

function visibleCommands() {
  return Object.entries(COMMANDS)
    .filter(([, command]) => !command.hidden)
    .map(([name]) => name);
}

async function renderProjects() {
  if (!PROJECTS.length) {
    await printLines(["no projects listed."]);
    return;
  }

  const block = document.createElement("div");
  block.className = "output-block";
  terminal.output.append(block);

  for (const project of PROJECTS) {
    const card = document.createElement("div");
    card.className = "output-line project-card";
    block.append(card);
    scrollToBottom();

    // Draw top border character by character
    const topBorder = "┌" + "─".repeat(52) + "┐";
    card.textContent = "";

    const borderRow = document.createElement("div");
    borderRow.className = "output-line project-border";
    block.append(borderRow);
    for (const char of topBorder) {
      borderRow.textContent += char;
      await wait(5);
    }

    // Name line
    const nameRow = document.createElement("div");
    nameRow.className = "output-line project-name-row";
    nameRow.innerHTML = `│ <strong>${project.name}</strong>${" ".repeat(Math.max(0, 51 - project.name.length))}│`;
    block.append(nameRow);
    scrollToBottom();
    await wait(60);

    // Summary line (wrap at 50 chars)
    const summaryRow = document.createElement("div");
    summaryRow.className = "output-line project-summary";
    const trimmed = project.summary.length > 50
      ? project.summary.slice(0, 47) + "..."
      : project.summary;
    summaryRow.textContent = `│ ${trimmed.padEnd(51)}│`;
    block.append(summaryRow);
    scrollToBottom();
    await wait(50);

    // Link line
    const linkRow = document.createElement("div");
    linkRow.className = "output-line project-link-row";
    linkRow.innerHTML = `│ <a href="${project.href}" target="_blank" rel="noreferrer">view →</a>${" ".repeat(46)}│`;
    block.append(linkRow);
    scrollToBottom();
    await wait(40);

    // Bottom border
    const botRow = document.createElement("div");
    botRow.className = "output-line project-border";
    block.append(botRow);
    const botBorder = "└" + "─".repeat(52) + "┘";
    for (const char of botBorder) {
      botRow.textContent += char;
      await wait(5);
    }

    await wait(120);
  }
}

function appendCommand(command) {
  const row = document.createElement("div");
  row.className = "line";

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = PROMPT;

  const text = document.createElement("span");
  text.className = "command-text";
  text.textContent = command;

  row.append(prompt, text);
  terminal.output.append(row);
}

function appendOutputLine(line, className = "") {
  const row = document.createElement("div");
  row.className = ["output-line", className].filter(Boolean).join(" ");

  if (className === "ai-response") {
    row.innerHTML = renderAiResponseHtml(line);
  } else {
    row.innerHTML = line || "&nbsp;";
  }

  return row;
}

function renderAiResponseHtml(line) {
  if (!line) return "&nbsp;";

  const escaped = escapeHtml(line);
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

async function printLines(lines, options = {}) {
  const settings = typeof options === "string" ? { className: options } : options;
  const block = document.createElement("div");
  block.className = "output-block";
  terminal.output.append(block);

  for (const [index, line] of lines.entries()) {
    const row = appendOutputLine(line, settings.className);
    block.append(row);
    maybeRenderAnomaly(row);
    scrollToBottom();
    await wait(outputDelay(index, line, settings.pace));
  }
}

function outputDelay(index, line, pace = "default") {
  const base = {
    quick: 25,
    structured: 20,
    default: 34,
    measured: 42,
    slow: 54
  }[pace] ?? 34;

  const lengthBias = Math.min(line.length, 72) * 0.35;
  const phase = ((index * 17 + line.length * 5) % 19) - 6;
  const drift = Math.sin((index + 1) * 1.7 + line.length) * 5;
  return Math.max(18, base + lengthBias + phase + drift);
}

function resolveLines(lines) {
  return lines.map((line) => typeof line === "function" ? line() : line);
}

function timeBand() {
  const hour = new Date().getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "day";
  if (hour < 21) return "evening";
  return "late";
}

function currentNow() {
  return []; // handled by runNow()
}

async function runNow() {
  const timeStudy = {
    night:   "studying: ai alignment / mechanistic interpretability",
    morning: "studying: physics",
    day:     "studying: coursework, probably",
    evening: "studying: not right now. at the gym.",
    late:    "studying: at this hour? "
  };

  const block = document.createElement("div");
  block.className = "output-block";
  terminal.output.append(block);

  const lines = [
    { text: "building: ml systems", pulse: true },
    { text: timeStudy[timeBand()], pulse: false },
    { text: "thinking: how did we get here?", pulse: false }
  ];

  for (const item of lines) {
    const row = document.createElement("div");
    row.className = "output-line";
    block.append(row);

    if (item.pulse) {
      const dot = document.createElement("span");
      dot.className = "pulse-dot";
      dot.textContent = "● ";
      const txt = document.createElement("span");
      txt.textContent = item.text;
      row.append(dot, txt);
    } else {
      row.textContent = item.text;
    }

    scrollToBottom();
    await wait(outputDelay(0, item.text, "measured"));
  }

  // Live clock line
  const clockRow = document.createElement("div");
  clockRow.className = "output-line now-clock";
  block.append(clockRow);
  scrollToBottom();

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    clockRow.textContent = `local time: ${h}:${m}:${s}`;
  }

  updateClock();
  const clockInterval = window.setInterval(updateClock, 1000);

  // Clean up interval when next command runs
  const cleanup = () => window.clearInterval(clockInterval);
  terminal.form.addEventListener("submit", cleanup, { once: true });
}

async function focusShift() {
  if (terminal.eventsSeen.has("about-focus")) return;

  terminal.eventsSeen.add("about-focus");
  await wait(150);
  document.body.classList.add("is-focusing");
  await wait(210);
  document.body.classList.remove("is-focusing");
}

async function runCommand(rawCommand, options = {}) {
  const commandText = rawCommand.trim().toLowerCase();
  if (!commandText || terminal.busy) return;

  terminal.busy = true;
  markActivity();

  if (options.echo !== false) appendCommand(commandText);
  pushHistory(commandText);

  if (commandText.includes("&&")) {
    await runCommandChain(commandText);
  } else {
    await executeCommand(commandText);
  }

  terminal.busy = false;
  terminal.input.focus();
  scrollToBottom();
}

async function runCommandChain(commandText) {
  const parts = commandText.split("&&");
  const commands = parts.map((part) => part.trim()).filter(Boolean);

  if (!commands.length || parts.some((part) => !part.trim())) {
    await printLines(["chain incomplete.", "explicit links require both sides."], "error");
    return;
  }

  for (const command of commands) {
    await executeCommand(command);
  }
}

async function runGitLog() {
  const commits = [
    { hash: "a9f3d12", refs: "(HEAD → main)", date: "Aug 2025",  msg: "feat: ai internship at ernst & young, gurugram" },
    { hash: "7c2e891", refs: "",              date: "Apr 2025",  msg: "hack: OSINT competition runner-up" },
    { hash: "3b8f044", refs: "",              date: "Mar 2025",  msg: "perf: +8.1% cosine similarity, 35% faster inference" },
    { hash: "f1d9a57", refs: "",              date: "Jan 2025",  msg: "init: semester 3 — Computer Networks, Digital Systems, Computer Organization, Data Structures" },
    { hash: "22c7b3e", refs: "",              date: "Aug 2024",  msg: "feat: data analyst intern at graceland asset mgmt" },
    { hash: "9e4a188", refs: "",              date: "Jul 2024",  msg: "init: b.tech data science & engineering, mit manipal" },
    { hash: "d04f9c1", refs: "",              date: "Jul 2023",  msg: "lead: 50+ person international team, nasa ssdc" },
    { hash: "88b2e73", refs: "",              date: "Mar 20233", msg: "award: nasa ssdc — dick edwards exceptional leadership" },
    { hash: "c1a0044", refs: "",              date: "2022",      msg: "init: national winner, asian regional runner-up" },
  ];

  const block = document.createElement("div");
  block.className = "output-block";
  terminal.output.append(block);

  for (const c of commits) {
    const row = document.createElement("div");
    row.className = "output-line";
    row.style.whiteSpace = "pre";

    const hash = document.createElement("span");
    hash.className = "gitlog-hash";
    hash.textContent = c.hash + " ";

    const ref = document.createElement("span");
    ref.className = "gitlog-ref";
    ref.textContent = c.refs ? c.refs + " " : "";

    const msg = document.createElement("span");
    msg.className = "gitlog-msg";
    msg.textContent = c.msg;

    const date = document.createElement("span");
    date.className = "gitlog-date";
    date.textContent = "  " + c.date;

    row.append(hash, ref, msg, date);
    block.append(row);
    scrollToBottom();
    await wait(80);
  }
}

function extractAiReply(data) {
  if (!data || typeof data !== "object") return "";

  // prefer explicit top-level `response` or common fields
  let s = data.response ?? data.reply ?? data.text ?? data.message ?? data.output;

  // If the Worker wraps provider result under `raw`, try extracting from there too
  if (!s && data.raw && typeof data.raw === "object") {
    const r = data.raw;
    s = r.response ?? r.reply ?? r.text ?? r.message ?? r.output ?? r.result ?? r.data;

    // some providers put content under outputs[0].content or outputs[0].text
    if (!s && Array.isArray(r.outputs) && r.outputs.length) {
      const first = r.outputs[0];
      s = typeof first === "string" ? first : first.content ?? first.text ?? JSON.stringify(first);
    }

    // provider `output` may be an array
    if (!s && Array.isArray(r.output) && r.output.length) {
      s = r.output.map(x => (typeof x === "string" ? x : JSON.stringify(x))).join("\n");
    }
  }

  return typeof s === "string" ? s : "";
}

function buildAiCommand(command) {
  return [
    AI_SITE_CONTEXT,
    "",
    `User command: ${command}`,
  ].join("\n");
}

async function executeCommand(command) {
  const count = recordCommand(command);
  const entry = COMMANDS[command];

  // Phrase commands (multi-word)
  if (command === "git log" || command === "git log --oneline") {
    await runGitLog();
    return;
  }
  if (command === "git status") {
    await printLines([
      "On branch main",
      "Your branch is up to date with 'origin/main'.",
      "",
      "nothing to commit, everything pushed.",
      "  (career is clean and deployable)"
    ], { pace: "quick" });
    return;
  }
  if (command.startsWith("cat ")) {
    await printLines([
      `cat: ${command.slice(4)}: this is a terminal, not a filesystem.`,
      "try: about"
    ], "error");
    return;
  }
  if (command.startsWith("cd ")) {
    await printLines(["you're already here."], { pace: "quick" });
    return;
  }
  if (command === "pwd") {
    await printLines(["/home/kushagra/portfolio"], { pace: "quick" });
    return;
  }
  if (command === "whoami") {
    await printLines(["kushagra sharan. builder of things that probably work."], { pace: "quick" });
    return;
  }
  if (command === "date") {
    await printLines([new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"], { pace: "quick" });
    return;
  }

  if (!entry) {
    const isSpecialCase = command.includes("&&");
    const nearest = nearestCommand(command);

    if (isSpecialCase || (!command.includes(" ") && nearest.distance <= 2) || command.trim().length <= 2) {
      await printLines(invalidResponse(command), "error");
      return;
    }

    const thinkingBlock = document.createElement("div");
    thinkingBlock.className = "output-block";
    const thinkingRow = document.createElement("div");
    thinkingRow.className = "output-line boot-connecting";
    thinkingRow.textContent = "processing";
    thinkingBlock.append(thinkingRow);
    terminal.output.append(thinkingBlock);
    scrollToBottom();

    let dotCount = 0;
    let dotInterval = window.setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      thinkingRow.textContent = "processing" + ".".repeat(dotCount);
    }, 300);

    let thinkingDone = false;
    const stopThinking = () => {
      if (thinkingDone) return;
      thinkingDone = true;
      window.clearInterval(dotInterval);
      dotInterval = null;
      thinkingBlock.remove();
    };

    try {
      const workerUrl = "https://chat.kushagrasharan.me";

      const response = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: buildAiCommand(command),
          originalCommand: command,
          context: AI_SITE_CONTEXT,
        }),
      });

      const raw = (await response.text()).trim();

      stopThinking();

      let data = null;
      if (raw && raw[0] === "{") {
        try {
          data = JSON.parse(raw);
        } catch {
          data = null;
        }
      }

      const looksLikeHtml = raw.startsWith("<!") || raw.startsWith("<html");
      if (!response.ok || looksLikeHtml || raw === "") {
        const accessWall = response.redirected || response.status === 302 || response.status === 401 || response.status === 403;

        if (accessWall || looksLikeHtml) {
          await printLines([
            `ai gateway: HTTP ${response.status}${response.redirected ? " (redirect)" : ""} — HTML, empty body, or Cloudflare Access before the worker. Fix: Zero Trust → Access → remove this hostname or add a Bypass for POST/OPTIONS from https://kushagrasharan.me and https://kshgrshrn.github.io.`,
            "surface unchanged.",
          ], "error");
          return;
        }

        if (data && typeof data === "object") {
          const upstreamMessage = data.error?.message ?? data.error ?? data.message ?? data.detail ?? raw;
          await printLines([
            `ai gateway: HTTP ${response.status} — ${upstreamMessage}`,
            "surface unchanged.",
          ], "error");
          return;
        }

        await printLines([
          `ai gateway: HTTP ${response.status} — responded with empty or invalid JSON.`,
          "surface unchanged.",
        ], "error");
        return;
      }

      if (!data) {
        await printLines(["ai gateway returned malformed JSON.", "surface unchanged."], "error");
        return;
      }

      if (data.error) throw new Error(data.error);

      const replyText = extractAiReply(data);
      let aiLines = replyText.split("\n").map((l) => l.trim()).filter(Boolean);

      if (!aiLines.length) aiLines = [replyText.trim() || "(empty response)"];

      await printLines(aiLines, { className: "ai-response", pace: "measured" });
    } catch (e) {
      stopThinking();
      const preflightHint = e && e.name === "TypeError"
        ? ["hint: browser blocked the request before a response (CORS). Cloudflare Access often returns 403 on OPTIONS — bypass Access for this worker or return 204+CORS on OPTIONS."]
        : [];
      await printLines([...preflightHint, ...invalidResponse(command)], "error");
    }

    return;
  }

  if (entry.beforePrint) await entry.beforePrint();

  const lines = await entry.run({ command, count });
  if (lines.length) await printLines(lines, { pace: entry.pace });
}

function invalidResponse(command) {
  const escaped = escapeHtml(command);

  if (command.includes(" ")) {
    return [
      `unparsed input: ${escaped}`,
      "use && for explicit chaining."
    ];
  }

  const nearest = nearestCommand(command);
  if (nearest.distance <= 2) {
    return [
      `unresolved command: ${escaped}`,
      `nearest route: ${nearest.name}`
    ];
  }

  if (command.length <= 2) {
    return [`token has no handler: ${escaped}`];
  }

  return [
    `unresolved command: ${escaped}`,
    "surface unchanged."
  ];
}

function nearestCommand(command) {
  return Object.keys(COMMANDS).reduce((best, name) => {
    const distance = editDistance(command, name);
    return distance < best.distance ? { name, distance } : best;
  }, { name: "", distance: Infinity });
}

function editDistance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function recordCommand(command) {
  terminal.commandCounts[command] = (terminal.commandCounts[command] || 0) + 1;
  return terminal.commandCounts[command];
}

function maybeTriggerAnomaly() {
  if (terminal.rareEventSeen) return false;
  if (Math.random() >= 0.006) return false;

  terminal.rareEventSeen = true;
  return true;
}

function maybeRenderAnomaly(row) {
  if (!maybeTriggerAnomaly()) return;

  row.classList.add("is-anomaly");
  window.setTimeout(() => {
    row.classList.remove("is-anomaly");
  }, 90);
}

async function ghostClear() {
  if (!terminal.output.childElementCount) return;

  terminal.output.classList.add("is-clearing");
  await wait(110);
  terminal.output.replaceChildren();
  terminal.output.classList.remove("is-clearing");
}

function pushHistory(command) {
  if (terminal.history.at(-1) !== command) {
    terminal.history.push(command);
  }

  terminal.historyIndex = terminal.history.length;
  try {
    localStorage.setItem("ksh_history", JSON.stringify(terminal.history.slice(-40)));
  } catch {
    /* noop */
  }
}

function syncInput() {
  terminal.mirror.textContent = terminal.input.value;
  markCursorActive();
  markActivity();
}

function updateGhostCompletion() {
  const partial = terminal.input.value.trim().toLowerCase();
  let existing = terminal.form.querySelector(".autocomplete-ghost");

  if (!partial) {
    if (existing) existing.remove();
    terminal.ghostNode = null;
    return;
  }

  const match = Object.keys(COMMANDS).find(name =>
    name.startsWith(partial) && !COMMANDS[name].hidden && name !== partial
  );

  if (!match) {
    if (existing) existing.remove();
    terminal.ghostNode = null;
    return;
  }

  if (!existing) {
    existing = document.createElement("span");
    existing.className = "autocomplete-ghost";
    terminal.mirror.parentElement.insertBefore(existing, terminal.mirror.nextSibling);
    terminal.ghostNode = existing;
  }

  existing.textContent = match.slice(partial.length);
}

function placeCaretAtEnd() {
  const end = terminal.input.value.length;
  terminal.input.setSelectionRange(end, end);
}

function markCursorActive() {
  terminal.form.classList.add("is-active");
  window.clearTimeout(cursorActivityTimer);
  cursorActivityTimer = window.setTimeout(() => {
    terminal.form.classList.remove("is-active");
  }, 520);
}

function markActivity() {
  document.body.classList.remove("is-idle");
  removeIdleLine();
  window.clearTimeout(terminal.idleTimer);
  terminal.idleTimer = window.setTimeout(() => {
    if (!terminal.busy) enterIdleState();
  }, 42000);
}

function enterIdleState() {
  if (terminal.idleNode) return;

  document.body.classList.add("is-idle");
  terminal.idleNode = appendOutputLine("idle", "idle-line");
  terminal.output.append(terminal.idleNode);
  scrollToBottom();
}

function removeIdleLine() {
  if (!terminal.idleNode) return;

  terminal.idleNode.remove();
  terminal.idleNode = null;
}

function recallHistory(direction) {
  if (!terminal.history.length) return;

  terminal.historyIndex = Math.min(
    terminal.history.length,
    Math.max(0, terminal.historyIndex + direction)
  );

  terminal.input.value = terminal.history[terminal.historyIndex] || "";
  syncInput();
  placeCaretAtEnd();
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function scrollToBottom() {
  window.requestAnimationFrame(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    terminal.output.scrollTo({
      top: terminal.output.scrollHeight,
      behavior
    });
  });
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function commandFromHash() {
  const hash = window.location.hash.replace("#", "").trim().toLowerCase();
  return COMMANDS[hash] ? hash : "";
}

terminal.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminal.input.value;
  terminal.input.value = "";
  
  if (navigator.vibrate) navigator.vibrate(15);
  
  syncInput();
  updateGhostCompletion();
  runCommand(command);
});

terminal.input.addEventListener("input", () => {
  syncInput();
  updateGhostCompletion();
});
terminal.input.addEventListener("focus", placeCaretAtEnd);
terminal.input.addEventListener("click", placeCaretAtEnd);

terminal.input.addEventListener("keydown", (event) => {
  if (shortcutOverlay) {
    if (event.key === "?" && !terminal.input.value) {
      event.preventDefault();
      shortcutOverlay.classList.toggle("is-visible");
      return;
    }
    if (event.key === "Escape") shortcutOverlay.classList.remove("is-visible");
  }

  playKeyClick();
  markCursorActive();

  if (event.key === "Tab") {
    event.preventDefault();
    const partial = terminal.input.value.trim().toLowerCase();
    if (!partial) return;
    const match = Object.keys(COMMANDS).find(name =>
      name.startsWith(partial) && !COMMANDS[name].hidden
    );
    if (match) {
      terminal.input.value = match;
      syncInput();
      updateGhostCompletion();
      placeCaretAtEnd();
    }
  }

  if (event.key === "ArrowRight" && terminal.ghostNode && terminal.input.selectionStart === terminal.input.value.length) {
    const partial = terminal.input.value.trim().toLowerCase();
    const match = Object.keys(COMMANDS).find(name => name.startsWith(partial) && !COMMANDS[name].hidden);
    if (match) {
      terminal.input.value = match;
      syncInput();
      updateGhostCompletion();
      placeCaretAtEnd();
    }
  }

  if (["ArrowLeft", "Home"].includes(event.key)) {
    window.requestAnimationFrame(placeCaretAtEnd);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    recallHistory(-1);
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    recallHistory(1);
  }
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (e.changedTouches.length === 1) {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    
    // Only command swipe history if the delta primarily horizontal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) recallHistory(1); // Swipe right = newer command
      else recallHistory(-1); // Swipe left = older command
    }
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("a")) terminal.input.focus();
  markActivity();
});

function handleSystemCursorMove(event) {
  if (!systemCursor.node || event.pointerType === "touch") return;

  const target = event.target;
  const isLink = Boolean(target.closest("a"));
  const isTerminal = Boolean(target.closest(".input-row, .terminal-input, .input-field"));
  const velocity = systemCursor.initialized
    ? Math.hypot(
      event.clientX - systemCursor.lastTargetX,
      event.clientY - systemCursor.lastTargetY
    )
    : 0;

  systemCursor.x = event.clientX;
  systemCursor.y = event.clientY;
  systemCursor.targetX = event.clientX;
  systemCursor.targetY = event.clientY;
  systemCursor.stable = isTerminal;
  systemCursor.lastTargetX = event.clientX;
  systemCursor.lastTargetY = event.clientY;

  if (!systemCursor.initialized) {
    systemCursor.initialized = true;
  }

  renderSystemCursor();

  systemCursor.node.classList.add("is-visible");
  systemCursor.node.classList.toggle("is-link", isLink);
  systemCursor.node.classList.toggle("is-terminal", isTerminal);
  systemCursor.node.classList.toggle("is-fast", velocity > 34 && !isTerminal && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  systemCursor.node.classList.remove("is-idle");

  window.clearTimeout(systemCursor.idleTimer);
  systemCursor.idleTimer = window.setTimeout(() => {
    systemCursor.node?.classList.remove("is-fast");
    systemCursor.node?.classList.add("is-idle");
  }, 1300);
}

function renderSystemCursor() {
  systemCursor.node.style.setProperty("--system-cursor-x", `${systemCursor.x.toFixed(2)}px`);
  systemCursor.node.style.setProperty("--system-cursor-y", `${systemCursor.y.toFixed(2)}px`);
}

window.addEventListener("pointerdown", () => {
  systemCursor.node?.classList.add("is-down");
});

window.addEventListener("pointerup", () => {
  window.setTimeout(() => {
    systemCursor.node?.classList.remove("is-down");
  }, 90);
});

window.addEventListener("pointerleave", () => {
  systemCursor.node?.classList.remove("is-visible", "is-link", "is-terminal", "is-fast");
});

window.addEventListener("pointerenter", () => {
  if (systemCursor.initialized) systemCursor.node?.classList.add("is-visible");
});

window.addEventListener("pointermove", (event) => {
  handleSystemCursorMove(event);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (terminal.parallaxFrame) return;

  const pointerX = event.clientX;
  const pointerY = event.clientY;

  terminal.parallaxFrame = window.requestAnimationFrame(() => {
    const normalizedX = pointerX / window.innerWidth - 0.5;
    const normalizedY = pointerY / window.innerHeight - 0.5;
    const root = document.documentElement.style;

    root.setProperty("--depth-x", `${(normalizedX * 1.4).toFixed(2)}px`);
    root.setProperty("--depth-y", `${(normalizedY * 1.1).toFixed(2)}px`);
    root.setProperty("--plane-x", `${(normalizedX * -2.4).toFixed(2)}px`);
    root.setProperty("--plane-y", `${(normalizedY * -1.8).toFixed(2)}px`);
    root.setProperty("--cursor-depth-x", `${(normalizedX * 0.5).toFixed(2)}px`);
    root.setProperty("--cursor-depth-y", `${(normalizedY * 0.35).toFixed(2)}px`);
    root.setProperty("--light-x", `${pointerX}px`);
    root.setProperty("--light-y", `${pointerY}px`);

    updateLightResponse(pointerX, pointerY);
    terminal.parallaxFrame = null;
  });
});

window.addEventListener("deviceorientation", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!event.beta || !event.gamma) return;
  
  if (terminal.parallaxFrame) return;
  
  terminal.parallaxFrame = window.requestAnimationFrame(() => {
    // limit pitch and roll to a comfy [-45, 45] degree arc
    const maxTilt = 45;
    const beta = Math.max(-maxTilt, Math.min(maxTilt, event.beta));
    const gamma = Math.max(-maxTilt, Math.min(maxTilt, event.gamma || 0));

    // normalize bounded orientation to a familiar pointer space [-0.5, 0.5]
    const normalizedY = beta / (maxTilt * 2);
    const normalizedX = gamma / (maxTilt * 2);

    const root = document.documentElement.style;

    root.setProperty("--depth-x", `${(normalizedX * 1.4).toFixed(2)}px`);
    root.setProperty("--depth-y", `${(normalizedY * 1.1).toFixed(2)}px`);
    root.setProperty("--plane-x", `${(normalizedX * -2.4).toFixed(2)}px`);
    root.setProperty("--plane-y", `${(normalizedY * -1.8).toFixed(2)}px`);
    root.setProperty("--cursor-depth-x", `${(normalizedX * 0.5).toFixed(2)}px`);
    root.setProperty("--cursor-depth-y", `${(normalizedY * 0.35).toFixed(2)}px`);
    
    terminal.parallaxFrame = null;
  });
});

function updateLightResponse(x, y) {
  const target = document.elementFromPoint(x, y)?.closest(".output-line, .line, .input-row");
  if (target === terminal.litLine) return;

  terminal.litLine?.classList.remove("is-lit");
  terminal.litLine = target;
  terminal.litLine?.classList.add("is-lit");
}

function initHud() {
  const focuses = [
    "mechanistic interp",
    "ai safety / alignment",
    "nlp systems",
    "financial ml",
    "astrophysics"
  ];
  const subs = [
    "open to research collab",
    "seeking summer '26 internship",
    "mit manipal · dse · y2"
  ];

  const focusEl = document.getElementById("hud-focus");
  const subEl   = document.getElementById("hud-sub");

  let fi = 0;
  let si = 0;

  setInterval(() => {
    fi = (fi + 1) % focuses.length;
    focusEl.style.opacity = "0";
    focusEl.style.transition = "opacity 300ms";
    setTimeout(() => {
      focusEl.textContent = focuses[fi];
      focusEl.style.opacity = "1";
    }, 320);
  }, 4200);

  setInterval(() => {
    si = (si + 1) % subs.length;
    subEl.style.opacity = "0";
    subEl.style.transition = "opacity 300ms";
    setTimeout(() => {
      subEl.textContent = subs[si];
      subEl.style.opacity = "1";
    }, 320);
  }, 7000);
}

async function typewriterLine(text, className = "") {
  const row = document.createElement("div");
  row.className = ["output-line", className].filter(Boolean).join(" ");
  row.textContent = "";
  const block = document.createElement("div");
  block.className = "output-block";
  block.append(row);
  terminal.output.append(block);
  scrollToBottom();

  for (const char of text) {
    row.textContent += char;
    await wait(28 + Math.random() * 18);
  }
  await wait(60);
}

async function boot() {
  terminal.input.focus();
  syncInput();

  // Phase 1: connection handshake — typewriter, before banner
  const handshake = [
    { text: "initializing node...", delay: 0 },
    { text: "establishing connection → kushagrasharan.me", delay: 340 },
    { text: "connection established.  [ OK ]", delay: 420, accent: true },
  ];

  const handshakeBlock = document.createElement("div");
  handshakeBlock.className = "output-block";
  terminal.output.append(handshakeBlock);

  for (const line of handshake) {
    await wait(line.delay);
    const row = document.createElement("div");
    row.className = "output-line" + (line.accent ? " boot-ok" : " boot-connecting");
    handshakeBlock.append(row);
    scrollToBottom();
    for (const char of line.text) {
      row.textContent += char;
      await wait(18 + Math.random() * 10);
    }
  }

  await wait(220);

  // Phase 2: ASCII banner (existing logic — keep as-is)
  const banner = [
    "██╗  ██╗██╗   ██╗███████╗██╗  ██╗ █████╗  ██████╗ ██████╗  █████╗ ",
    "██║ ██╔╝██║   ██║██╔════╝██║  ██║██╔══██╗██╔════╝ ██╔══██╗██╔══██╗",
    "█████╔╝ ██║   ██║███████╗███████║███████║██║  ███╗██████╔╝███████║",
    "██╔═██╗ ██║   ██║╚════██║██╔══██║██╔══██║██║   ██║██╔══██╗██╔══██║",
    "██║  ██╗╚██████╔╝███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║██║  ██║",
    "╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝"
  ];

  const bannerBlock = document.createElement("div");
  bannerBlock.className = "output-block banner-block";
  terminal.output.append(bannerBlock);

  for (const line of banner) {
    const row = document.createElement("div");
    row.className = "output-line banner-line";
    row.textContent = line;
    bannerBlock.append(row);
    await wait(38);
    scrollToBottom();
  }

  await wait(220);
  const bannerRows = document.querySelectorAll(".banner-line");
  bannerRows.forEach((row, i) => {
    setTimeout(() => {
      row.style.animation = "banner-shimmer 480ms ease forwards";
    }, i * 55);
  });
  await wait(480);

  await wait(180);
  await typewriterLine("data science & engineering. nlp. ml systems.", "banner-sub");
  await wait(60);

  // Phase 3: available status badge
  const statusRow = document.createElement("div");
  statusRow.className = "output-line boot-status";
  statusRow.innerHTML = '<span class="status-dot"></span> open to opportunities &nbsp;·&nbsp; <span style="color:var(--dim)">type <span style="color:var(--accent)">help</span> or <span style="color:var(--accent)">neofetch</span></span>';
  const statusBlock = document.createElement("div");
  statusBlock.className = "output-block";
  statusBlock.append(statusRow);
  terminal.output.append(statusBlock);
  scrollToBottom();

  await wait(80);

  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);

  initHud();
}

// Mobile quick-command buttons
document.querySelectorAll(".mobile-cmd-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    if (cmd && !terminal.busy) {
      terminal.input.value = "";
      syncInput();
      runCommand(cmd);
    }
  });
});

if (shortcutOverlay) {
  shortcutOverlay.addEventListener("click", (e) => {
    if (e.target === shortcutOverlay) shortcutOverlay.classList.remove("is-visible");
  });
}

boot();
