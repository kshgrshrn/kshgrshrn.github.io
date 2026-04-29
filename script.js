const CONTENT = {
  intro: [
    "personal system interface",
    "type 'help' for commands"
  ],
  help: [
    "help      list commands",
    "about     identity and current direction",
    "projects  selected work",
    "writing   published notes",
    "now       current status",
    "contact   links",
    "clear     reset terminal"
  ],
  about: [
    "Kushagra Sharan. B.Tech Data Science & Engineering, MIT Manipal. Graduating 2028.",
    "Working around NLP systems, financial ML, interpretability research, and physics."
  ],
  projects: [
    "<strong>Semantic GST Schema Standardization Engine</strong> - 2024, EY internship.",
    "NLP pipeline mapping inconsistent tax headers to a unified 61-field GST schema. <a href=\"https://github.com/kshgrshrn/Semantic-GST-Schema-Standardization-Engine\" target=\"_blank\" rel=\"noreferrer\">github</a>"
  ],
  writing: [
    "Nothing published yet."
  ],
  now: [
    "No current update provided.",
    "Last local note: April 2025."
  ],
  contact: [
    "<a href=\"mailto:kushagrasharan2006@gmail.com\">kushagrasharan2006@gmail.com</a>",
    "<a href=\"https://github.com/kshgrshrn\" target=\"_blank\" rel=\"noreferrer\">github.com/kshgrshrn</a> / <a href=\"https://linkedin.com/in/kushagrasharan\" target=\"_blank\" rel=\"noreferrer\">linkedin.com/in/kushagrasharan</a>"
  ]
};

const output = document.querySelector("#terminal-output");
const form = document.querySelector("#terminal-form");
const input = document.querySelector("#terminal-input");
const statusNode = document.querySelector(".node-status");
const promptText = "ks@node:~$";

const state = {
  history: [],
  historyIndex: -1,
  printing: false
};

const COMMANDS = {
  help: {
    description: "list commands",
    run: () => CONTENT.help
  },
  about: {
    description: "identity and current direction",
    run: () => CONTENT.about
  },
  projects: {
    description: "selected work",
    run: () => CONTENT.projects
  },
  writing: {
    description: "published notes",
    run: () => CONTENT.writing
  },
  now: {
    description: "current status",
    run: () => CONTENT.now
  },
  contact: {
    description: "links",
    run: () => CONTENT.contact
  },
  clear: {
    description: "reset terminal",
    run: () => {
      output.replaceChildren();
      return [];
    }
  }
};

function appendCommand(command) {
  const row = document.createElement("div");
  row.className = "line";

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = promptText;

  const commandText = document.createElement("span");
  commandText.className = "command-text";
  commandText.textContent = command;

  row.append(prompt, commandText);
  output.append(row);
}

function appendOutputLine(line, className = "") {
  const row = document.createElement("div");
  row.className = `output-line ${className}`.trim();
  row.innerHTML = line;
  return row;
}

async function printLines(lines, options = {}) {
  const block = document.createElement("div");
  block.className = "output-block";
  output.append(block);

  for (const line of lines) {
    block.append(appendOutputLine(line, options.className));
    scrollToBottom();
    await wait(options.delay ?? 42);
  }
}

async function runCommand(rawCommand, echo = true) {
  const command = rawCommand.trim().toLowerCase();
  if (!command || state.printing) return;

  state.printing = true;
  input.disabled = true;

  if (echo) appendCommand(command);

  if (!state.history.includes(command)) {
    state.history.push(command);
  } else if (state.history[state.history.length - 1] !== command) {
    state.history.push(command);
  }
  state.historyIndex = state.history.length;

  const entry = COMMANDS[command];
  if (!entry) {
    await printLines([`command not found: ${escapeHtml(command)}`, "type 'help'"], { className: "error" });
  } else {
    const lines = entry.run();
    if (lines.length) await printLines(lines);
  }

  input.disabled = false;
  input.focus();
  state.printing = false;
  scrollToBottom();
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function scrollToBottom() {
  window.requestAnimationFrame(() => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  });
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function commandFromHash() {
  const value = window.location.hash.replace("#", "").trim().toLowerCase();
  return COMMANDS[value] ? value : "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = input.value;
  input.value = "";
  runCommand(command);
});

input.addEventListener("keydown", (event) => {
  if (!state.history.length) return;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    state.historyIndex = Math.max(0, state.historyIndex - 1);
    input.value = state.history[state.historyIndex] ?? "";
    input.setSelectionRange(input.value.length, input.value.length);
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
    input.value = state.history[state.historyIndex] ?? "";
  }
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = "";
    runCommand(button.dataset.command);
  });
});

document.addEventListener("click", (event) => {
  const isLink = event.target.closest("a");
  const isButton = event.target.closest("button");
  if (!isLink && !isButton) input.focus();
});

function scheduleGlitch() {
  const next = 4200 + Math.random() * 7600;
  window.setTimeout(() => {
    statusNode.classList.add("jolt");
    window.setTimeout(() => statusNode.classList.remove("jolt"), 130);
    scheduleGlitch();
  }, next);
}

async function boot() {
  input.focus();
  await printLines(CONTENT.intro, { delay: 65 });
  const initialCommand = commandFromHash();
  if (initialCommand) await runCommand(initialCommand);
}

boot();
scheduleGlitch();
