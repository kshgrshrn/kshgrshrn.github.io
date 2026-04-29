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
  rareEventSeen: false
};

let cursorActivityTimer;

const COMMANDS = {
  help: {
    description: "commands",
    run: () => visibleCommands()
  },
  about: {
    description: "direction",
    beforePrint: () => focusShift(),
    run: ({ count }) => count > 1 ? CONTENT.aboutAfterRepeat : CONTENT.about
  },
  projects: {
    description: "work",
    run: () => projectList()
  },
  now: {
    description: "current",
    run: () => CONTENT.now
  },
  writing: {
    description: "notes",
    run: () => CONTENT.writing
  },
  links: {
    description: "external",
    run: () => CONTENT.links
  },
  clear: {
    description: "reset",
    run: () => {
      terminal.output.replaceChildren();
      return [];
    }
  },
  why: {
    hidden: true,
    run: () => CONTENT.hidden.why
  },
  trace: {
    hidden: true,
    run: () => resolveLines(CONTENT.hidden.trace)
  },
  axiom: {
    hidden: true,
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

async function printLines(lines, className = "") {
  const block = document.createElement("div");
  block.className = "output-block";
  terminal.output.append(block);

  for (const [index, line] of lines.entries()) {
    block.append(appendOutputLine(line, className));
    scrollToBottom();
    await wait(outputDelay(index, line));
  }
}

function outputDelay(index, line) {
  const lengthBias = Math.min(line.length, 72) * 0.35;
  const phase = (index % 3) * 9;
  return 34 + lengthBias + phase;
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

  if (options.echo !== false) appendCommand(command);
  pushHistory(command);
  const count = recordCommand(command);

  const entry = COMMANDS[command];
  if (!entry) {
    await printLines([`command not found: ${escapeHtml(command)}`, "type help"], "error");
  } else {
    if (entry.beforePrint) await entry.beforePrint();
    const lines = entry.run({ command, count });
    if (lines.length) await printLines(lines);
    await maybePrintRareLine(command);
  }

  terminal.busy = false;
  terminal.input.focus();
  scrollToBottom();
}

function recordCommand(command) {
  terminal.commandCounts[command] = (terminal.commandCounts[command] || 0) + 1;
  return terminal.commandCounts[command];
}

async function maybePrintRareLine(command) {
  if (terminal.rareEventSeen || command === "clear") return;
  if (Math.random() >= 0.008) return;

  terminal.rareEventSeen = true;
  await printLines(["checksum drift: one bit left unclassified."]);
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
});

async function boot() {
  terminal.input.focus();
  syncInput();
  await printLines(CONTENT.intro);

  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);
}

boot();
