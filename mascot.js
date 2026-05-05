/* ─────────────────────────────────────────────────────────────
   mascot.js  —  K, the terminal mascot
   Wires the floating glyph to the AI chatbot. When a reply
   arrives, K floats to the terminal output zone, injects an
   inline speech-bubble block, types the reply out, then drifts
   back to the corner.
   ───────────────────────────────────────────────────────────── */

const MASCOT_IDLE_MIN        = 12000;
const MASCOT_IDLE_MAX        = 28000;
const SPEECH_BUBBLE_DURATION = 2800;
const TYPEWRITER_BASE_MS     = 14;   // ms per character

const REACTION_MAP = {
  about:      "Reading dossier...",
  experience: "Scanning credentials...",
  projects:   "Loading constructs...",
  neofetch:   "System nominal.",
  clear:      "Slate wiped.",
  theme:      "Adjusting optics.",
  contact:    "Channels open.",
  resume:     "Exporting data.",
  skills:     "Analyzing stack.",
  awards:     "Logging achievements.",
  research:   "Indexing interest vectors.",
  status:     "Pinging availability.",
  links:      "Surfacing nodes.",
  now:        "Clocking in.",
};

const IDLE_SPEECH = [
  "I'm K.",
  "What's on your mind?",
  "What now...",
  "Idling.",
  "System optimal.",
  "Awaiting input.",
];

/* Mini SVG glyph (same diamond+square as in index.html) used
   inside the inline chat header so the block feels "authored" by K */
const GLYPH_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke-width="2" fill="var(--bg,#0c0e0f)"/>
  <rect x="20" y="20" width="8" height="8" stroke-width="2" fill="none"/>
</svg>`;

/* ── Utility ──────────────────────────────────────── */
function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ── Mascot class ─────────────────────────────────── */
class Mascot {
  constructor() {
    this.container    = document.getElementById("mascot-container");
    this.bubble       = this.container.querySelector(".mascot-bubble");
    this.glyph        = this.container.querySelector(".mascot-glyph");
    this.idleTimer    = null;
    this.bubbleTimeout = null;
    this.state        = "idle";

    /* Track the active inline chat block so we can clear it on next use */
    this._activeChatBlock = null;
  }

  /* ── Lifecycle ─────────────────────────────────── */
  init() {
    this.resetIdle();
    this.attachListeners();
    this.startRoaming();
  }

  attachListeners() {
    const form  = document.querySelector("#terminal-form");
    const input = document.querySelector("#terminal-input");

    if (form && input) {
      let lastVal = "";
      input.addEventListener("input", () => { lastVal = input.value; });
      form.addEventListener("submit", () => {
        const val = lastVal.trim().toLowerCase();
        if (val) this.handleInput(val);
        lastVal = "";
      });
    }

    this.glyph.addEventListener("click", () => {
      this.container.classList.toggle("revealed");
      if (this.state === "idle" || this.state === "error") {
        this.speak("K — online. Type anything.");
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target)) {
        this.container.classList.remove("revealed");
      }
    });
  }

  /* ── State management ──────────────────────────── */
  setState(state) {
    this.state = state;
    /* SVG elements use SVGAnimatedString for className — must use setAttribute */
    this.glyph.setAttribute("class", `mascot-glyph state-${state}`);
  }

  /* ── Floating status bubble (brief overlay above glyph) ── */
  /* NOTE: speak() no longer changes glyph state — callers own the state. */
  speak(text, duration = SPEECH_BUBBLE_DURATION, resetStateAfter = true) {
    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    const html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    this.bubble.innerHTML = html;
    this.bubble.classList.add("visible");
    this.bubbleTimeout = setTimeout(() => {
      this.bubble.classList.remove("visible");
      if (resetStateAfter) this.setState("idle");
    }, duration);
  }

  hideBubble() {
    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    this.bubble.classList.remove("visible");
  }

  /** Show text in the floating bubble without touching glyph state at all. */
  _showBubbleText(text, duration = SPEECH_BUBBLE_DURATION) {
    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    const html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    this.bubble.innerHTML = html;
    this.bubble.classList.add("visible");
    this.bubbleTimeout = setTimeout(() => {
      this.bubble.classList.remove("visible");
    }, duration);
  }

  /* ── Inline chat block ─────────────────────────── */

  /** Create and inject a chat block into #terminal-output.
   *  Returns the text container so we can typewrite into it. */
  _injectChatBlock() {
    /* Remove any previous K-reply block to keep output clean */
    if (this._activeChatBlock && this._activeChatBlock.parentNode) {
      // keep it visible — don't remove, just stop referencing it
    }

    const termOutput = document.getElementById("terminal-output");
    if (!termOutput) return null;

    const block = document.createElement("div");
    block.className = "mascot-chat-block is-thinking";

    /* Header: mini glyph + "K ▸" label */
    const header = document.createElement("div");
    header.className = "mascot-chat-header";
    header.innerHTML = `
      <span class="mascot-chat-header-glyph">${GLYPH_SVG} K</span>
      <span style="color:var(--dim);">▸</span>
    `;

    /* Thinking placeholder */
    const thinking = document.createElement("div");
    thinking.className = "mascot-chat-thinking";
    thinking.textContent = "...";

    /* Text node (filled in after reply arrives) */
    const textNode = document.createElement("div");
    textNode.className = "mascot-chat-text";
    textNode.style.display = "none";

    block.append(header, thinking, textNode);
    termOutput.append(block);

    this._activeChatBlock = block;
    this._scrollTerminal();

    return { block, thinking, textNode };
  }

  /** Typewrite text into the chat block's text node */
  async _typeIntoBlock(textNode, text) {
    textNode.style.display = "";
    textNode.innerHTML = "";

    const segments = this._parseBold(text);

    for (const seg of segments) {
      if (seg.bold) {
        /* Build a live <strong> node, adding chars one by one */
        const strong = document.createElement("strong");
        textNode.appendChild(strong);
        for (const ch of seg.text) {
          strong.textContent += ch;
          this._scrollTerminal();
          await wait(TYPEWRITER_BASE_MS + Math.random() * 6);
        }
      } else {
        /* Plain text segment — append text node char by char */
        const tn = document.createTextNode("");
        textNode.appendChild(tn);
        for (const ch of seg.text) {
          tn.textContent += ch;
          this._scrollTerminal();
          await wait(TYPEWRITER_BASE_MS + Math.random() * 6);
        }
      }
    }
    this._scrollTerminal();
  }

  /** Parse **bold** markers into segments */
  _parseBold(text) {
    const segments = [];
    const re = /\*\*(.*?)\*\*/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) segments.push({ bold: false, text: text.slice(last, m.index) });
      segments.push({ bold: true, text: m[1] });
      last = re.lastIndex;
    }
    if (last < text.length) segments.push({ bold: false, text: text.slice(last) });
    return segments;
  }

  _scrollTerminal() {
    const out = document.getElementById("terminal-output");
    if (out) out.scrollTop = out.scrollHeight;
  }

  /* ── Float mascot upward to sit beside the terminal output bottom ── */
  _dockToTerminal() {
    if (window.innerWidth < 620) return; // stay put on mobile

    const termOutput = document.getElementById("terminal-output");
    if (!termOutput) return;
    const termRect = termOutput.getBoundingClientRect();

    /* Mascot is fixed bottom:24px right:24px.
       Its bottom edge is currently at (window.innerHeight - 24) from the top.
       We want its bottom near termRect.bottom.
       Required translation (negative = up):                                 */
    const mascotBottom  = window.innerHeight - 24;  // current bottom edge from top
    const dy = termRect.bottom - mascotBottom;       // negative → move up

    /* Clamp: never send above viewport top, never move down */
    const clampedDy = Math.min(0, Math.max(dy, -(window.innerHeight - 80)));

    this.container.classList.add("is-docked");
    this.container.style.transform = `translate(0, ${clampedDy}px)`;
  }

  _returnToCorner() {
    this.container.classList.add("is-docked");
    this.container.style.transform = "translate(0, 0)";
    setTimeout(() => this.container.classList.remove("is-docked"), 900);
  }

  /* ── Main input handler ────────────────────────── */
  async handleInput(cmd) {
    this.resetIdle();
    const cmdBase = cmd.split("&&")[0].trim();

    /* Known terminal command → quick reaction, hold success state during bubble */
    if ((typeof COMMANDS !== "undefined" && COMMANDS[cmdBase]) || REACTION_MAP[cmdBase]) {
      const reaction = REACTION_MAP[cmdBase] || "Acknowledged.";
      this.setState("success");
      this.speak(reaction, 2200, true); // resetStateAfter=true → back to idle
      return;
    }

    /* AI chatbot path ─────────────────────────────── */
    this.setState("thinking");        // pulse animation fires here
    this._showBubbleText("Thinking..."); // show bubble WITHOUT touching state

    /* Inject the inline block immediately so user sees something */
    const parts = this._injectChatBlock();
    if (!parts) {
      this.hideBubble();
      this.setState("idle");
      return;
    }
    const { block, thinking, textNode } = parts;

    /* Slide mascot to dock near output */
    this._dockToTerminal();

    try {
      const workerUrl  = "https://chat.kushagrasharan.me";
      const baseContext = typeof AI_SITE_CONTEXT !== "undefined" ? AI_SITE_CONTEXT : "";
      const recruiterMode = "Recruiter mode: Credibility-first. No oversell. Suggest `contact` command if interest detected. Never break character.";

      const body = {
        command: `MASCOT INPUT: ${cmd}. You are K, the terminal mascot. Keep reply to 2-3 sentences max. Highlight **keywords**. Direct, witty, zero fluff. ${recruiterMode}`,
        originalCommand: cmd,
        context: baseContext,
      };

      const res = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Unreachable");

      const raw = await res.text();
      let data  = null;
      if (raw && raw.trim().startsWith("{")) {
        try { data = JSON.parse(raw); } catch {}
      }

      let reply = "Processing complete.";
      if (data) {
        if (typeof extractAiReply === "function") {
          reply = extractAiReply(data) || reply;
        } else {
          reply = data.response ?? data.reply ?? data.text ?? reply;
        }
      } else if (raw && !raw.startsWith("<!")) {
        reply = raw;
      }

      /* Swap thinking → typewriter */
      block.classList.remove("is-thinking");
      thinking.style.display = "none";
      this.setState("success");       // green glow

      /* Floating bubble: brief pointer, keep success state */
      this._showBubbleText("↓ reply in terminal");

      await this._typeIntoBlock(textNode, reply);

      /* Float back after reply is typed */
      await wait(600);
      this.hideBubble();
      this._returnToCorner();
      this.setState("idle");

    } catch (e) {
      block.classList.remove("is-thinking");
      thinking.style.display = "none";
      textNode.style.display  = "";
      textNode.className       = "mascot-chat-text is-error";
      textNode.textContent     = "Connection failed. Try `contact`.";
      this._scrollTerminal();

      this.hideBubble();
      this.setState("error");
      this.speak("Connection lost.", 3000);

      await wait(500);
      this._returnToCorner();
    }
  }

  /* ── Idle roaming ──────────────────────────────── */
  startRoaming() {
    setInterval(() => {
      if (this.state === "idle" && Math.random() > 0.5) {
        this.roam();
      }
    }, 10000);
  }

  roam() {
    if (window.innerWidth < 620) {
      this.container.style.transform = "";
      return;
    }
    if (Math.random() > 0.7) {
      this.container.style.transform = "translate(0, 0)";
      return;
    }
    const maxX   = window.innerWidth  - 300;
    const maxY   = window.innerHeight - 250;
    const randomX = -(Math.random() * maxX);
    const randomY = -(Math.random() * maxY);
    this.container.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  resetIdle() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    const interval = Math.random() * (MASCOT_IDLE_MAX - MASCOT_IDLE_MIN) + MASCOT_IDLE_MIN;
    this.idleTimer = setTimeout(() => {
      if (this.state === "idle" && !this.bubble.classList.contains("visible")) {
        const text = IDLE_SPEECH[Math.floor(Math.random() * IDLE_SPEECH.length)];
        this.speak(text, 2500);
      }
      this.resetIdle();
    }, interval);
  }
}

/* ── Boot ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  window._mascot = new Mascot();
  window._mascot.init();
});
