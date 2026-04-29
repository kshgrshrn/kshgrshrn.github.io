const PROMPT = "kushagra@node:~ $";

const PROJECTS = [
  {
    name: "semantic-gst-schema-standardization-engine",
    summary: "embedding-based tax schema mapping system",
    href: "https://github.com/kshgrshrn/Semantic-GST-Schema-Standardization-Engine"
  }
];

const CONTENT = {
  intro: [
    "Kushagra Sharan",
    "type 'help'"
  ],
  about: [
    "B.Tech Data Science & Engineering, MIT Manipal. Graduating 2028.",
    "NLP systems, financial ML, interpretability research, physics."
  ],
  writing: [
    "No published writing."
  ],
  now: [
    "No current update provided.",
    "Last local note: April 2025."
  ],
  links: [
    `<a href="https://github.com/kshgrshrn" target="_blank" rel="noreferrer">github.com/kshgrshrn</a>`,
    `<a href="https://www.linkedin.com/in/kushagrasharan/" target="_blank" rel="noreferrer">linkedin.com/in/kushagrasharan</a>`
  ]
};

const terminal = {
  output: document.querySelector("#terminal-output"),
  form: document.querySelector("#terminal-form"),
  input: document.querySelector("#terminal-input"),
  mirror: document.querySelector("#input-mirror"),
  history: [],
  historyIndex: 0,
  busy: false
};

let cursorActivityTimer;

const COMMANDS = {
  help: {
    description: "list commands",
    run: () => commandList()
  },
  about: {
    description: "identity",
    run: () => [...CONTENT.about, "", ...CONTENT.links]
  },
  projects: {
    description: "selected work",
    run: () => projectList()
  },
  writing: {
    description: "published notes",
    run: () => CONTENT.writing
  },
  now: {
    description: "current state",
    run: () => CONTENT.now
  },
  links: {
    description: "external links",
    run: () => CONTENT.links
  },
  clear: {
    description: "clear terminal",
    run: () => {
      terminal.output.replaceChildren();
      return [];
    }
  }
};

function commandList() {
  return Object.entries(COMMANDS).map(([name, command]) => {
    return `${name.padEnd(9, " ")}${command.description}`;
  });
}

function projectList() {
  if (!PROJECTS.length) return ["No projects listed."];

  return PROJECTS.flatMap((project) => [
    `<strong>${project.name}</strong> - ${project.summary}`,
    `  <a href="${project.href}" target="_blank" rel="noreferrer">view &rarr;</a>`
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

  for (const line of lines) {
    block.append(appendOutputLine(line, className));
    scrollToBottom();
    await wait(46);
  }
}

async function runCommand(rawCommand, options = {}) {
  const command = rawCommand.trim().toLowerCase();
  if (!command || terminal.busy) return;

  terminal.busy = true;

  if (options.echo !== false) appendCommand(command);
  pushHistory(command);

  const entry = COMMANDS[command];
  if (!entry) {
    await printLines([`command not found: ${escapeHtml(command)}`, "type 'help'"], "error");
  } else {
    const lines = entry.run();
    if (lines.length) await printLines(lines);
  }

  terminal.busy = false;
  terminal.input.focus();
  scrollToBottom();
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

function scheduleGlitch() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const delay = 14000 + Math.random() * 22000;
  window.setTimeout(() => {
    const lines = [...document.querySelectorAll(".output-line")].filter((line) => {
      return !line.querySelector("a");
    });
    const line = lines[Math.floor(Math.random() * lines.length)];

    if (line) {
      line.classList.add("glitch");
      window.setTimeout(() => line.classList.remove("glitch"), 120);
    }

    scheduleGlitch();
  }, delay);
}

async function boot() {
  terminal.input.focus();
  syncInput();
  await printLines(CONTENT.intro);

  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);
}

boot();
scheduleGlitch();
