const PROMPT = "kushagra@node:~ $";

const PROJECTS = [
  {
    name: "semantic-nlp-system",
    summary: "AI-powered NLP pipeline standardizing messy GST datasets w/ embeddings (EY Internship)",
    href: "https://github.com/kshgrshrn/Semantic-GST-Schema-Standardization-Engine"
  }
];

const CONTENT = {
  intro: [
    "Kushagra Sharan",
    "Connection established.",
    "type help"
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
  now: [
    "building: scalable NLP pipelines & ML systems",
    "studying: Data Science @ MIT Manipal",
    "exploring: Interpretability & AI Safety alignment"
  ],
  experience: [
    "=== PROFESSIONAL EXPERIENCE ===",
    "",
    "Ernst & Young (EY) | Gurugram",
    "Role: AI Intern",
    "Contributions:",
    " - Built an AI-powered NLP pipeline to standardize messy GST datasets.",
    " - Implemented semantic embeddings to map raw data into a unified 61-field schema.",
    " - Automated tax data ingestion across inconsistent inputs."
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
    "Data Science & Engineering @ MIT Manipal.",
    "Engineering & Data Science.",
    "",
    `github   -> <a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">https://github.com/kshgrshrn</a>`,
    `linkedin -> <a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">https://www.linkedin.com/in/kushagrasharan/</a>`
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
    description: "commands",
    pace: "quick",
    run: () => visibleCommands()
  },
  sudo: {
    hidden: true,
    run: () => ["node is not in the sudoers file. This incident will be reported."]
  },
  sound: {
    description: "toggle sounds",
    pace: "quick",
    run: () => {
      document.body.classList.toggle("mute-mode");
      playKeystroke();
      const isMuted = document.body.classList.contains("mute-mode");
      if (isMuted) return ["Terminal sounds muted."];
      return ["Terminal sounds enabled."];
    }
  },
  matrix: {
    hidden: true,
    run: () => {
      document.body.classList.toggle("matrix-mode");
      return document.body.classList.contains("matrix-mode") ? ["matrix protocol initialized.", "enjoy the aesthetic..."] : ["matrix protocol terminated."];
    }
  },
  about: {
    description: "direction",
    pace: "slow",
    beforePrint: () => focusShift(),
    run: ({ count }) => count > 1 ? CONTENT.aboutAfterRepeat : CONTENT.about
  },
  projects: {
    description: "work",
    pace: "structured",
    run: () => projectList()
  },
  experience: {
    description: "resume",
    pace: "measured",
    run: () => CONTENT.experience
  },
  kfetch: {
    description: "sysinfo",
    pace: "quick",
    run: () => [
      "          \\    /       <strong style='color: var(--accent)'>kushagra@node</strong>",
      "           \\  /        -------------",
      "            \\/         <strong>Course</strong>: B.Tech Data Science & Eng (2028)",
      "     -------|-------    <strong>College</strong>: MIT Manipal",
      "            |           <strong>Previous Experience</strong>: AI Intern @ Ernst & Young",
      "           / \\         <strong>Uptime</strong>: ~19 years",
      "          /   \\        <strong>Theme</strong>: Minimal Terminal Dark",
      "         /     \\       ",
      ""
    ]
  },
  now: {
    description: "current",
    pace: "measured",
    run: () => currentNow()
  },
  writing: {
    description: "notes",
    pace: "quick",
    run: () => CONTENT.writing
  },
  links: {
    description: "external",
    pace: "quick",
    run: () => CONTENT.links
  },
  clear: {
    description: "reset",
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
  }
};

function visibleCommands() {
  return Object.entries(COMMANDS)
    .filter(([, command]) => !command.hidden)
    .map(([name]) => name);
}

function projectList() {
  if (!PROJECTS.length) return ["No projects listed."];

  return PROJECTS.flatMap((project) => [
    `<strong>${project.name}</strong> - ${project.summary}`,
    `  <a href="${project.href}" target="_blank" rel="noreferrer">view -></a>`
  ]);
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
  const timeStudy = {
    night: "studying: failure modes / safety",
    morning: "studying: systems before scale",
    day: "studying: interpretability / safety",
    evening: "studying: abstractions under constraint",
    late: "studying: compression / uncertainty"
  };

  return [
    "building: ML systems",
    timeStudy[timeBand()],
    "thinking: physics as compression"
  ];
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

const keyClackAudio = new Audio('data:audio/mp3;base64,UklGRmYBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUMBAAAHAQwAGgA7AEkAWAByAIMAnACqAAMAEwAhADMAOQA9AEkATABXAF4AbQBrAHUAcwBaADMACQABABIAEgAeABoAIQAwADcANwA0AEMAQQAyADEAMAAtACYAJAAXABIAAADe/9z/5v/s/+b/4//V/9X/0f/E/8j/0v/U/9L/tf+l/6z/s/+x/7T/rP+n/6X/r/+1/LMAAA==');
keyClackAudio.volume = 0.05;

function playKeystroke() {
  if (!document.body.classList.contains("mute-mode")) {
    keyClackAudio.currentTime = 0;
    keyClackAudio.play().catch(() => {});
  }
}

terminal.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminal.input.value;
  terminal.input.value = "";
  
  playKeystroke();
  if (navigator.vibrate) navigator.vibrate(15);
  
  syncInput();
  runCommand(command);
});

terminal.input.addEventListener("input", () => {
    playKeystroke();
    syncInput();
});
terminal.input.addEventListener("focus", placeCaretAtEnd);
terminal.input.addEventListener("click", placeCaretAtEnd);

terminal.input.addEventListener("keydown", (event) => {
  markCursorActive();

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

async function boot() {
  terminal.input.focus();
  syncInput();
  await printLines(CONTENT.intro);

  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);
}

boot();
