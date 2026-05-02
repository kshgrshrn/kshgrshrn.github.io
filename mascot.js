const MASCOT_IDLE_MIN = 12000;
const MASCOT_IDLE_MAX = 28000;
const MASCOT_SIZE = 48;
const SPEECH_BUBBLE_DURATION = 3500;

const REACTION_MAP = {
  about: "Reading dossier...",
  experience: "Scanning credentials...",
  projects: "Loading constructs...",
  neofetch: "System nominal.",
  clear: "Slate wiped.",
  theme: "Adjusting optics.",
  contact: "Channels open.",
  resume: "Exporting data.",
  skills: "Analyzing stack."
};

const IDLE_SPEECH = [
  "I'm K.",
  "What's on your mind?",
  "What now...",
  "Idling.",
  "System optimal.",
  "Awaiting input."
];

class Mascot {
  constructor() {
    this.container = document.getElementById("mascot-container");
    this.bubble = this.container.querySelector(".mascot-bubble");
    this.glyph = this.container.querySelector(".mascot-glyph");
    this.idleTimer = null;
    this.bubbleTimeout = null;
    this.state = "idle";
  }

  init() {
    this.resetIdle();
    this.attachListeners();
    this.startRoaming();
  }

  attachListeners() {
    const form = document.querySelector("#terminal-form");
    const input = document.querySelector("#terminal-input");
    
    if (form && input) {
      let lastVal = "";
      input.addEventListener("input", () => {
        lastVal = input.value;
      });
      
      form.addEventListener("submit", () => {
        const val = lastVal.trim().toLowerCase();
        if (val) this.handleInput(val);
        lastVal = "";
      });
    }

    this.glyph.addEventListener("click", () => {
      this.container.classList.toggle("revealed");
      if (this.state === "idle" || this.state === "error") {
        this.speak("I am K. Listening.");
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target)) {
        this.container.classList.remove("revealed");
      }
    });
  }

  setState(state) {
    this.state = state;
    this.glyph.className = `mascot-glyph state-${state}`;
  }

  speak(text, duration = SPEECH_BUBBLE_DURATION) {
    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    
    const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    this.bubble.innerHTML = html;
    this.bubble.classList.add("visible");
    this.setState("speaking");
    
    this.bubbleTimeout = setTimeout(() => {
      this.bubble.classList.remove("visible");
      this.setState("idle");
    }, duration);
  }

  async handleInput(cmd) {
    this.resetIdle();
    const cmdBase = cmd.split("&&")[0].trim();
    
    if ((typeof COMMANDS !== "undefined" && COMMANDS[cmdBase]) || REACTION_MAP[cmdBase]) {
      const reaction = REACTION_MAP[cmdBase] || "Acknowledged.";
      this.setState("success");
      this.speak(reaction, 2500);
      return;
    }

    this.setState("thinking");
    try {
      const workerUrl = "https://chat.kushagrasharan.me";
      const baseContext = typeof AI_SITE_CONTEXT !== "undefined" ? AI_SITE_CONTEXT : "";
      const recruiterMode = "Recruiter mode: Credibility-first. No oversell. Suggest `contact` command if interest detected. Never break character.";
      
      const body = {
        command: `MASCOT INPUT: ${cmd}. You are K, the terminal mascot. Keep reply to 2-3 sentences max. Highlight **keywords**. Direct, witty, zero fluff. ${recruiterMode}`,
        originalCommand: cmd,
        context: baseContext
      };
      
      const res = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error("Unreachable");
      
      const raw = await res.text();
      let data = null;
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
      
      this.setState("success");
      this.speak(reply, 5500);
    } catch (e) {
      this.setState("error");
      this.speak("Connection failed. Try `contact`.", 3000);
    }
  }

  startRoaming() {
    // Check every 10 seconds if we should move
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
    
    // 30% chance to go back home
    if (Math.random() > 0.7) {
      this.container.style.transform = "translate(0, 0)";
      return;
    }
    
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 250;
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
