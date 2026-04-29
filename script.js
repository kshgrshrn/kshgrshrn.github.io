const PROMPT = "kushagra@node:~ $";

const PROJECTS = [
  {
    name: "semantic-nlp-system",
    summary: "embedding-based semantic data standardization",
    href: "https://github.com/kshgrshrn/Semantic-GST-Schema-Standardization-Engine"
  }
];

const CONTENT = {
  intro: [
    "node: kushagra.sharan",
    "type help"
  ],
  about: [
    "     /\\",
    "    /  \\",
    "   /____\\",
    "",
    "Data Science & Engineering @ MIT Manipal.",
    "Direction: interpretability, alignment, ML systems, physics.",
    "Work: semantic systems for noisy structured data.",
    "",
    `github   -> <a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">https://github.com/kshgrshrn</a>`,
    `linkedin -> <a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">https://www.linkedin.com/in/kushagrasharan/</a>`
  ],
  now: [
    "building: ML systems",
    "studying: interpretability / safety",
    "thinking: physics as compression"
  ],
  writing: [
    "No published writing."
  ],
  links: [
    `<a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">github</a>`,
    `<a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">linkedin</a>`
  ],
  hidden: {
    why: [
      "understanding precedes control.",
      "systems become useful when their failure modes become visible."
    ],
    trace: [
      () => `trace: ${timeBand()} / local`,
      "signal retained. context compressed."
    ],
    axiom: [
      "explain the system before optimizing it.",
      "alignment is an interface problem at scale."
    ]
  },
  aboutAfterRepeat: [
    "Same node. Lower verbosity.",
    "Interpretability as instrumentation. Physics as constraint.",
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
  parallaxFrame: null
};

let cursorActivityTimer;

const COMMANDS = {
  help: {
    description: "commands",
    pace: "quick",
    run: () => visibleCommands()
  },
  about: {
    description: "direction",
    pace: "slow",
    beforePrint: () => focusShift(),
    run: ({ count }) => count > 1 ? CONTENT.aboutAfterRepeat : CONTENT.about
  },
  projects: {
    description: "work",
    pace: "measured",
    run: () => projectList()
  },
  now: {
    description: "current",
    pace: "measured",
    run: () => CONTENT.now
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

async function focusShift() {
  await wait(150);
  document.body.classList.add("is-focusing");
  await wait(210);
  document.body.classList.remove("is-focusing");
}

async function runCommand(rawCommand, options = {}) {
  const command = rawCommand.trim().toLowerCase();
  if (!command || terminal.busy) return;

  terminal.busy = true;
  markActivity();

  if (options.echo !== false) appendCommand(command);
  pushHistory(command);
  const count = recordCommand(command);

  const entry = COMMANDS[command];
  if (!entry) {
    await printLines([`command not found: ${escapeHtml(command)}`, "type help"], "error");
  } else {
    if (entry.beforePrint) await entry.beforePrint();
    const lines = await entry.run({ command, count });
    if (lines.length) await printLines(lines, { pace: entry.pace });
  }

  terminal.busy = false;
  terminal.input.focus();
  scrollToBottom();
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
    terminal.output.scrollIntoView({ block: "end" });
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
  syncInput();
  runCommand(command);
});

terminal.input.addEventListener("input", syncInput);
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

document.addEventListener("click", (event) => {
  if (!event.target.closest("a")) terminal.input.focus();
  markActivity();
});

window.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (terminal.parallaxFrame) return;

  terminal.parallaxFrame = window.requestAnimationFrame(() => {
    const x = (event.clientX / window.innerWidth - 0.5) * 1.8;
    const y = (event.clientY / window.innerHeight - 0.5) * 1.4;
    document.documentElement.style.setProperty("--depth-x", `${x.toFixed(2)}px`);
    document.documentElement.style.setProperty("--depth-y", `${y.toFixed(2)}px`);
    terminal.parallaxFrame = null;
  });
});

async function boot() {
  terminal.input.focus();
  syncInput();
  await printLines(CONTENT.intro);

  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);
}

boot();
