const GAME_SCRIPTS = {
  flames: "games/flames.js",
  compat: "games/compat.js",
  ship: "games/ship.js",
  lucky: "games/lucky.js",
  numerology: "games/numerology.js",
  initials: "games/initials.js",
  anagram: "games/anagram.js",
  battle: "games/battle.js",
};

const ALL_RESULTS_ID = "all";

const GAME_OPTIONS = [
  { id: "flames", label: "FLAMES" },
  { id: "compat", label: "Compatibility" },
  { id: "ship", label: "Ship Name" },
  { id: "lucky", label: "Lucky Letter" },
  { id: "numerology", label: "Numerology Lite" },
  { id: "initials", label: "Initials Chemistry" },
  { id: "anagram", label: "Anagram Sprint" },
  { id: "battle", label: "Name Battle" },
  { id: ALL_RESULTS_ID, label: "All Results (Quick View)" },
];

const nameOneInput = document.getElementById("nameOne");
const nameTwoInput = document.getElementById("nameTwo");
const labelOne = document.getElementById("labelOne");
const labelTwo = document.getElementById("labelTwo");
const checkBtn = document.getElementById("checkBtn");
const hint = document.getElementById("hint");
const gameSelect = document.getElementById("gameSelect");
const resultPanel = document.getElementById("resultPanel");
const allResultPanel = document.getElementById("allResultPanel");
const allResultTitle = document.getElementById("allResultTitle");
const allResultNames = document.getElementById("allResultNames");
const allResultList = document.getElementById("allResultList");
const resultTitle = document.getElementById("resultTitle");
const resultLine = document.getElementById("resultLine");
const resultTag = document.getElementById("resultTag");
const resultGif = document.getElementById("resultGif");
const namesChip = document.getElementById("namesChip");
const shareCanvas = document.getElementById("shareCanvas");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const shareBtn = document.getElementById("shareBtn");
const installBtn = document.getElementById("installBtn");
const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatSuggestions = document.getElementById("chatSuggestions");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

let deferredPrompt = null;
let activeGameId = "flames";
let lastResult = null;
const chatState = {
  lastGameId: null,
  lastIntent: null,
};

const registry = {};
const loadedScripts = new Set();

const cleanName = (name) => (name || "").toLowerCase().replace(/[^a-z]/g, "");
const cap = (text) => (text ? text[0].toUpperCase() + text.slice(1) : text);

window.NameArcade = {
  registerGame(game) {
    if (!game || !game.id || typeof game.compute !== "function") return;
    registry[game.id] = game;
  },
};

const utils = { cleanName, cap };

function populateGameOptions() {
  if (!gameSelect) return;
  gameSelect.innerHTML = "";
  GAME_OPTIONS.forEach((g) => {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = g.label;
    gameSelect.appendChild(option);
  });
}

function ensureScriptLoaded(gameId) {
  const src = GAME_SCRIPTS[gameId];
  if (!src) return Promise.reject(new Error("Missing game script mapping"));
  if (loadedScripts.has(src)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load game script: " + src));
    document.head.appendChild(script);
  });
}

async function ensureGameLoaded(gameId) {
  if (registry[gameId]) return registry[gameId];
  await ensureScriptLoaded(gameId);
  return registry[gameId] || null;
}

function validateInputs(nameA, nameB) {
  if (!cleanName(nameA) || !cleanName(nameB)) {
    alert("Please enter valid names using alphabet characters.");
    return false;
  }
  return true;
}

function setTheme(themeClass) {
  const removable = [
    "theme-flames",
    "theme-compat",
    "theme-ship",
    "theme-lucky",
    "theme-numerology",
    "theme-initials",
    "theme-anagram",
    "theme-battle",
  ];
  document.body.classList.remove(...removable);
  document.body.classList.add(themeClass || "theme-flames");
}

async function renderActiveGame() {
  if (activeGameId === ALL_RESULTS_ID) {
    labelOne.textContent = "Your Name";
    labelTwo.textContent = "Their Name";
    nameOneInput.placeholder = "Drop your name";
    nameTwoInput.placeholder = "Drop their name";
    checkBtn.textContent = "Get All Results";
    hint.textContent = "Quick summary from every game in one go.";
    setTheme("theme-all");
    if (gameSelect) gameSelect.value = ALL_RESULTS_ID;
    return;
  }

  const game = await ensureGameLoaded(activeGameId);
  if (!game) {
    alert("Could not load selected game. Please refresh.");
    return;
  }

  labelOne.textContent = game.labels[0];
  labelTwo.textContent = game.labels[1];
  nameOneInput.placeholder = game.placeholders[0];
  nameTwoInput.placeholder = game.placeholders[1];
  checkBtn.textContent = game.buttonText;
  hint.textContent = game.hint;
  setTheme(game.themeClass);

  if (gameSelect) gameSelect.value = game.id;
}

function safeMediaFallback() {
  resultGif.src = "assets/icons/icon.svg";
  resultGif.alt = "Result visual";
}

function renderResult(result) {
  resultTag.textContent = result.tag;
  resultTitle.textContent = result.title;
  resultLine.textContent = result.line;
  resultGif.onerror = safeMediaFallback;
  resultGif.src = result.media;
  resultGif.alt = result.tag + " visual";
  namesChip.textContent = result.namesChip;

  resultPanel.classList.remove("hidden", "pop");
  requestAnimationFrame(() => resultPanel.classList.add("pop"));

  lastResult = {
    ...result,
    gameId: activeGameId,
    gameTitle: registry[activeGameId].title,
    nameA: nameOneInput.value.trim(),
    nameB: nameTwoInput.value.trim(),
  };

  allResultPanel.classList.add("hidden");
}

function summarizeTitle(text) {
  const clean = String(text || "").replace(/[|]/g, " ").trim();
  return clean.length > 42 ? clean.slice(0, 42) + "..." : clean;
}

async function renderAllResults(nameA, nameB) {
  const ids = GAME_OPTIONS.map((g) => g.id);
  const games = await Promise.all(ids.map((id) => ensureGameLoaded(id)));
  const validGames = games.filter(Boolean);

  if (!validGames.length) {
    alert("Could not load games for all-results view.");
    return;
  }

  allResultList.innerHTML = "";

  validGames.forEach((game, idx) => {
    const out = game.compute(nameA, nameB, utils);
    const li = document.createElement("li");
    const title = summarizeTitle(out.title || out.shareLine || out.line);
    li.classList.add("reveal-item");
    li.style.animationDelay = `${idx * 60}ms`;

    const gameName = document.createElement("span");
    gameName.className = "gname";
    gameName.textContent = game.title;

    const gameValue = document.createElement("span");
    gameValue.className = "gvalue";
    gameValue.textContent = title;

    li.appendChild(gameName);
    li.appendChild(gameValue);
    allResultList.appendChild(li);
  });

  allResultTitle.textContent = "Quick Results Across All Games";
  allResultNames.textContent = nameA + " + " + nameB;
  resultPanel.classList.add("hidden");
  allResultPanel.classList.remove("hidden", "pop");
  requestAnimationFrame(() => allResultPanel.classList.add("pop"));
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, cursorY);
      line = `${words[i]} `;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) ctx.fillText(line.trim(), x, cursorY);
}

function drawShareCard(data) {
  const ctx = shareCanvas.getContext("2d");
  const w = shareCanvas.width;
  const h = shareCanvas.height;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, data.colorA);
  grad.addColorStop(1, data.colorB);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.beginPath();
  ctx.arc(w * 0.2, h * 0.2, 150, 0, Math.PI * 2);
  ctx.arc(w * 0.84, h * 0.2, 220, 0, Math.PI * 2);
  ctx.arc(w * 0.72, h * 0.8, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  roundRect(ctx, 70, 90, w - 140, h - 180, 40);

  ctx.fillStyle = "#532342";
  ctx.font = "700 52px Sora";
  ctx.fillText("NAME ARCADE", 130, 220);

  ctx.fillStyle = "#7a3e58";
  ctx.font = "600 34px Sora";
  ctx.fillText(data.gameTitle, 130, 282);

  ctx.fillStyle = "#7a3e58";
  ctx.font = "400 36px Sora";
  ctx.fillText(`${data.nameA} + ${data.nameB}`, 130, 350);

  ctx.fillStyle = "#34192d";
  ctx.font = "66px DM Serif Display";
  ctx.fillText(data.title, 130, 450);

  ctx.fillStyle = "#5f3f6c";
  ctx.font = "400 33px Sora";
  wrapText(ctx, data.line, 130, 528, w - 260, 50);

  ctx.fillStyle = "#4d2d5a";
  ctx.font = "600 30px Sora";
  ctx.fillText(data.shareLine, 130, h - 215);

  ctx.fillStyle = "#6b4c70";
  ctx.font = "400 24px Sora";
  ctx.fillText("For fun only", 130, h - 152);
}

async function exportCard(share = false) {
  if (!lastResult) {
    alert("Play a game first to create your card.");
    return;
  }

  drawShareCard(lastResult);

  const blob = await new Promise((resolve) => shareCanvas.toBlob(resolve, "image/png"));
  if (!blob) {
    alert("Could not create card image. Try again.");
    return;
  }

  if (share && navigator.share && navigator.canShare) {
    const file = new File([blob], "name-arcade-result.png", { type: "image/png" });
    const payload = {
      title: "My Name Arcade Result",
      text: `${lastResult.nameA} + ${lastResult.nameB} | ${lastResult.gameTitle}`,
      files: [file],
    };

    if (navigator.canShare(payload)) {
      await navigator.share(payload);
      return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `name-arcade-${lastResult.gameId}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

checkBtn.addEventListener("click", async () => {
  const nameA = nameOneInput.value.trim();
  const nameB = nameTwoInput.value.trim();
  if (!validateInputs(nameA, nameB)) return;

  if (activeGameId === ALL_RESULTS_ID) {
    await renderAllResults(nameA, nameB);
    return;
  }

  const game = await ensureGameLoaded(activeGameId);
  if (!game) {
    alert("Selected game could not be loaded.");
    return;
  }

  const result = game.compute(nameA, nameB, utils);
  renderResult(result);
});

downloadCardBtn.addEventListener("click", () => {
  exportCard(false).catch(() => alert("Download failed. Please try again."));
});

shareBtn.addEventListener("click", () => {
  exportCard(true).catch(() => alert("Share failed. Card downloaded instead."));
});

gameSelect?.addEventListener("change", async () => {
  const next = gameSelect.value;
  if (!GAME_SCRIPTS[next] && next !== ALL_RESULTS_ID) return;
  if (next === activeGameId) return;
  activeGameId = next;
  await renderActiveGame();
  resultPanel.classList.add("hidden");
  allResultPanel.classList.add("hidden");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

window.addEventListener("appinstalled", () => {
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Ignore registration errors in local/offline preview.
    });
  });
}

function appendChatBubble(text, role = "bot") {
  const bubble = document.createElement("p");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = text;
  // Insert before suggestions so chips stay at the bottom
  chatMessages.insertBefore(bubble, chatSuggestions);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showSuggestions(items) {
  if (!chatSuggestions) return;

  chatSuggestions.innerHTML = "";
  const list = (items || []).filter(Boolean).slice(0, 4);
  if (!list.length) return;

  list.forEach((text) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chat-suggestion-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      handleChatQuestion(text);
      chatInput?.focus();
    });
    chatSuggestions.appendChild(btn);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function normalize(text) {
  return tokenize(text).join(" ");
}

async function getAllLoadedGames() {
  const ids = GAME_OPTIONS.map((g) => g.id).filter((id) => id !== ALL_RESULTS_ID);
  const games = await Promise.all(ids.map((id) => ensureGameLoaded(id)));
  return games.filter(Boolean);
}

async function findGameFromQuestion(question) {
  const q = normalize(question);
  const games = await getAllLoadedGames();

  for (const game of games) {
    const title = normalize(game.title);
    if (q.includes(title) || q.includes(game.id)) {
      return game;
    }

    const titleWords = title.split(" ").filter(Boolean);
    if (titleWords.some((w) => q.includes(w))) {
      return game;
    }
  }

  return null;
}

function getGeneralResponse(question) {
  const q = normalize(question);
  if (/^hi|hello|hey\b/.test(q)) {
    return {
      text: "Hey! I can walk you through any game, compare games, or suggest what to try next.",
      suggestions: ["What games are available?", "Which game should I try first?", "How do all results work?"],
      intent: "greeting",
    };
  }

  if (q.includes("what games") || q.includes("list games") || q.includes("available games")) {
    return {
      text: "You can play FLAMES, Compatibility, Ship Name, Lucky Letter, Numerology Lite, Initials Chemistry, Anagram Sprint, and Name Battle.",
      suggestions: ["Explain FLAMES", "Explain Compatibility", "Which is best for sharing?"],
      intent: "list-games",
    };
  }

  if (q.includes("which game") || q.includes("what should i play") || q.includes("recommend")) {
    return {
      text: "Start with FLAMES for nostalgia, try Ship Name for sharing, and use All Results for a quick full snapshot.",
      suggestions: ["Explain Ship Name", "Explain All Results", "How to share result?"],
      intent: "recommend",
    };
  }

  if (q.includes("all results") || q.includes("quick view")) {
    return {
      text: "Pick All Results in the dropdown, enter two names, then tap Get Result. You will get a compact summary for every game.",
      suggestions: ["How to share result?", "Is data saved?", "Explain FLAMES"],
      intent: "all-results",
    };
  }

  if (q.includes("share") || q.includes("download")) {
    return {
      text: "After a game result appears, tap Share for quick sharing. More > Download Card saves the image locally.",
      suggestions: ["How to install app?", "Explain Name Battle", "What games are available?"],
      intent: "share",
    };
  }

  if (q.includes("install") || q.includes("home screen") || q.includes("pwa")) {
    return {
      text: "Open from mobile browser, then use Add to Home Screen or the Install App button when it appears.",
      suggestions: ["Is this offline?", "How to share result?", "What games are available?"],
      intent: "install",
    };
  }

  if (q.includes("offline") || q.includes("internet") || q.includes("data") || q.includes("privacy")) {
    return {
      text: "Core gameplay runs locally in your browser. No account is required, and this app does not ask for personal login data.",
      suggestions: ["How to install app?", "How do all results work?", "Who made this?"],
      intent: "privacy",
    };
  }

  if (q.includes("who made") || q.includes("creator") || q.includes("linkedin")) {
    return {
      text: "Made by KHRV. Use the footer Made by link to open the LinkedIn profile.",
      suggestions: ["What games are available?", "Explain FLAMES", "How to share result?"],
      intent: "creator",
    };
  }

  if (q.includes("thanks") || q.includes("thank you")) {
    return {
      text: "Always. Want a quick game suggestion before you go?",
      suggestions: ["Recommend one game", "Explain All Results", "Explain Compatibility"],
      intent: "thanks",
    };
  }

  return null;
}

function formatGameExplainer(game) {
  const about = game.about || game.hint || "Fun name-based mini game.";
  const how = game.howItWorks || `Use ${game.labels[0]} and ${game.labels[1]}, then tap ${game.buttonText}.`;
  return `${game.title}: ${about} ${how}`;
}

async function handleChatQuestion(question) {
  const raw = String(question || "").trim();
  if (!raw) return;

  appendChatBubble(raw, "user");

  const q = normalize(raw);
  const followUp = /(that|this|it|more|how does it work|tell me more|example)/.test(q);
  let targetGame = await findGameFromQuestion(q);

  if (!targetGame && followUp && chatState.lastGameId) {
    targetGame = await ensureGameLoaded(chatState.lastGameId);
  }

  if (targetGame) {
    chatState.lastGameId = targetGame.id;
    chatState.lastIntent = "game-detail";
    appendChatBubble(formatGameExplainer(targetGame), "bot");
    showSuggestions([
      `How does ${targetGame.title} work?`,
      `Give an example for ${targetGame.title}`,
      "Which game should I try first?",
      "How do all results work?",
    ]);
    return;
  }

  const general = getGeneralResponse(raw);
  if (general) {
    chatState.lastIntent = general.intent;
    appendChatBubble(general.text, "bot");
    showSuggestions(general.suggestions);
    return;
  }

  const games = await getAllLoadedGames();
  const samples = games.map((g) => g.examplePrompt).filter(Boolean).slice(0, 3);
  appendChatBubble(
    "I can help with game explanations, setup, sharing, install steps, and quick recommendations. Ask me anything about this app.",
    "bot"
  );
  showSuggestions(samples.length ? samples : ["What games are available?", "Which game should I try first?"]);
}

chatToggle?.addEventListener("click", () => {
  chatPanel?.classList.remove("hidden");
  chatInput?.focus();
});

chatClose?.addEventListener("click", () => {
  chatPanel?.classList.add("hidden");
});

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  chatInput.value = "";

  await handleChatQuestion(question);
});

appendChatBubble("Hey! I am your local game guide. Ask for any game explanation or recommendation.", "bot");
showSuggestions(["What games are available?", "Which game should I try first?", "How do all results work?"]);
populateGameOptions();
renderActiveGame();
