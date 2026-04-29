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

const THEMES = ["default", "amber", "blue"];
let themeIndex = 0;

const PROMPT = "kushagra@node:~ $";

const PROJECTS = [
  {
    name: "semantic-gst-schema-standardization-engine",
    summary: "AI-powered NLP pipeline standardizing messy GST datasets w/ embeddings",
    href: "https://github.com/kshgrshrn/Semantic-GST-Schema-Standardization-Engine"
  }
];

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
  history: [],
  historyIndex: 0,
  busy: false,
  commandCounts: {},
  rareEventSeen: false,
  idleNode: null,
  idleTimer: null,
  parallaxFrame: null,
  litLine: null,
  eventsSeen: new Set()
};

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
    run: () => Object.entries(COMMANDS)
      .filter(([, cmd]) => !cmd.hidden)
      .map(([name, cmd]) => `${name.padEnd(14)}${cmd.description ?? ""}`)
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
  row.innerHTML = line || "&nbsp;";
  return row;
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
    night:   "studying: failure modes / safety",
    morning: "studying: systems before scale",
    day:     "studying: interpretability / safety",
    evening: "studying: abstractions under constraint",
    late:    "studying: compression / uncertainty"
  };

  const block = document.createElement("div");
  block.className = "output-block";
  terminal.output.append(block);

  const lines = [
    { text: "building: ml systems", pulse: true },
    { text: timeStudy[timeBand()], pulse: false },
    { text: "thinking: physics as compression", pulse: false }
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

async function executeCommand(command) {
  const count = recordCommand(command);
  const entry = COMMANDS[command];

  if (!entry) {
    const isSpecialCase = command.includes("&&");
    const nearest = nearestCommand(command);
    
    if (isSpecialCase || (!command.includes(" ") && nearest.distance <= 2) || command.trim().length <= 2) {
      await printLines(invalidResponse(command), "error");
      return;
    }

    await printLines([`processing...`], { className: "idle-line", pace: "quick" });

    try {
      const workerUrl = "https://kushagra-terminal-ai.kushagrasharan2006.workers.dev";
      
      const response = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      
      if (!response.ok) throw new Error("API Network Error");
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiLines = data.response.split("\n").map(l => l.trim()).filter(Boolean);
      await printLines(aiLines, { className: "ai-response", pace: "measured" });
    } catch (e) {
      await printLines(invalidResponse(command), "error");
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
}

function syncInput() {
  terminal.mirror.textContent = terminal.input.value;
  markCursorActive();
  markActivity();
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
  runCommand(command);
});

terminal.input.addEventListener("input", () => {
    syncInput();
});
terminal.input.addEventListener("focus", placeCaretAtEnd);
terminal.input.addEventListener("click", placeCaretAtEnd);

terminal.input.addEventListener("keydown", (event) => {
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

  // ASCII name banner — draws in letter by letter
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

  await wait(180);

  // Tagline types in character by character
  await typewriterLine("data science & engineering. nlp. ml systems.", "banner-sub");
  await wait(120);
  await typewriterLine("type help", "banner-hint");
  await wait(80);

  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);
}

boot();
