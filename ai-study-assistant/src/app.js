// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const CATEGORIES = [
  {
    id: "cs",
    name: "Computer Science",
    iconName: "Terminal",
    color: "from-blue-500 to-indigo-600",
    suggestedQuestions: [
      "What is Artificial Intelligence?",
      "Explain Machine Learning in simple terms.",
      "How does a neural network work?",
      "What is the difference between an algorithm and a program?"
    ]
  },
  {
    id: "math",
    name: "Mathematics",
    iconName: "Binary",
    color: "from-purple-500 to-pink-600",
    suggestedQuestions: [
      "Explain the fundamental theorem of calculus.",
      "What is Bayes' Theorem and how is it used?",
      "Can you explain standard deviation like I am 5?",
      "What are prime numbers and why are they important?"
    ]
  },
  {
    id: "physics",
    name: "Physics",
    iconName: "Atom",
    color: "from-amber-500 to-orange-600",
    suggestedQuestions: [
      "What are Kepler's laws of planetary motion?",
      "Explain Einstein's special relativity concept.",
      "How do solar panels convert sunlight to electricity?",
      "What is quantum entanglement?"
    ]
  },
  {
    id: "humanities",
    name: "History & Humanities",
    iconName: "BookOpen",
    color: "from-emerald-500 to-teal-600",
    suggestedQuestions: [
      "Summarize the main causes of World War I.",
      "What was the significance of the Magna Carta?",
      "Explain the Renaissance's impact on art and science.",
      "What are the three main branches of government?"
    ]
  }
];

const TONES = [
  {
    id: "encouraging",
    name: "Encouraging Tutor",
    emoji: "🧭",
    description: "Empathetic, guides with warm context, breaks down steps supportive.",
    systemPromptValue: "Warm, highly encouraging, empathetic academic tutor who uses positive reinforcement and clear analogies."
  },
  {
    id: "rigorous",
    name: "Academic Rigor",
    emoji: "🔬",
    description: "Precise, deeply detailed, highlights technical jargon and vocabulary.",
    systemPromptValue: "Strictly precise, deep academic expert, highlighting terminology, formal definitions, and exhaustive explanations."
  },
  {
    id: "concise",
    name: "Visual Summary",
    emoji: "⚡",
    description: "Brief bullet points, fast takeaways, highlights visual structures.",
    systemPromptValue: "Extremely concise, bullet-pointed, using rapid summaries and key formulas without extra wordiness."
  },
  {
    id: "playful",
    name: "Socratic Storyteller",
    emoji: "🎨",
    description: "Slightly conversational, uses storytelling to reveal logic clues.",
    systemPromptValue: "Engaging storyteller, using relatable characters and real-world narratives to build intuition, finishing with Socratic inquiries."
  }
];

// ==========================================
// 2. MARKDOWN RECOGNITION UTILITY
// ==========================================
function parseMarkdown(markdown) {
  if (!markdown) return "";

  const lines = markdown.split("\n");
  let html = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === "") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    // 1. Headers (###, ##, #)
    if (line.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = parseInlineMarkdown(line.slice(4));
      html.push(`<h3 class="text-xs font-bold font-display text-slate-800 tracking-wider uppercase border-l-4 border-blue-500 pl-3.5 py-0.5 mt-6 mb-3 first:mt-2">${text}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = parseInlineMarkdown(line.slice(3));
      html.push(`<h2 class="text-sm font-bold font-display text-slate-800 border-b border-slate-100 pb-1.5 mt-6 mb-3">${text}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = parseInlineMarkdown(line.slice(2));
      html.push(`<h1 class="text-base font-bold font-display text-slate-900 mt-6 mb-3">${text}</h1>`);
      continue;
    }

    // 2. Blockquotes
    if (line.startsWith("> ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = parseInlineMarkdown(line.slice(2));
      html.push(`<blockquote class="bg-indigo-50/50 border-l-4 border-indigo-500 pl-4 py-3 pr-2 rounded-r-xl text-slate-600 italic text-xs leading-relaxed my-4">${text}</blockquote>`);
      continue;
    }

    // 3. Lists
    if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
      if (!inList) {
        html.push('<ul class="mb-4 pl-0 space-y-1.5">');
        inList = true;
      }
      const rawText = line.substring(2);
      const text = parseInlineMarkdown(rawText);
      html.push(`<li class="text-slate-600 text-sm leading-relaxed ml-2 list-none relative pl-5 before:content-[''] before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-500 before:rounded-full">${text}</li>`);
      continue;
    }

    // Default Paragraphs
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    const text = parseInlineMarkdown(line);
    html.push(`<p class="text-slate-600 text-sm leading-relaxed mb-4">${text}</p>`);
  }

  if (inList) {
    html.push("</ul>");
  }

  return html.join("\n");
}

function parseInlineMarkdown(text) {
  let parsed = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-slate-800'>$1</strong>");
  parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5 text-[11px] font-mono text-pink-600 font-semibold">$1</code>');
  return parsed;
}

// ==========================================
// 3. VECTOR ICONS SVG REGISTRAR
// ==========================================
function getCategoryIconSvg(iconName, customClass = "w-4 h-4") {
  switch (iconName) {
    case "Terminal":
      return `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
    case "Binary":
      return `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`;
    case "Atom":
      return `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    case "BookOpen":
      return `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`;
    default:
      return `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>`;
  }
}

// ==========================================
// 4. CENTRAL STATE CONTROL ENGINE
// ==========================================
let state = {
  question: "",
  selectedCategoryId: "cs",
  selectedToneId: "encouraging",
  activeAnswer: null,
  activeQuestion: "",
  activeQueryId: null,
  isLoading: false,
  error: null,
  savedQueries: []
};

// ==========================================
// 5. APPLICATION INITIALIZATION
// ==========================================
function init() {
  // Load session logs securely
  try {
    const stored = localStorage.getItem("aira_study_queries_flat");
    if (stored) {
      state.savedQueries = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Local Storage session load error:", e);
  }

  // Draw complete core template
  renderHeader();
  renderApp();
  setupFormListeners();
}

// ==========================================
// 6. UI RENDER ORCHESTRATION SHIFT
// ==========================================
function renderApp() {
  const currentCategory = CATEGORIES.find((c) => c.id === state.selectedCategoryId) || CATEGORIES[0];
  const currentTone = TONES.find((t) => t.id === state.selectedToneId) || TONES[0];

  // 1. Subject category layout buttons
  renderCategoryList(currentCategory);

  // 2. Tone selection option buttons
  renderToneSelector(currentTone);

  // 3. Saved history queries panel
  renderQueries();

  // 4. Update core Response display view
  renderResponseView(currentCategory, currentTone);

  // 5. Fill input textarea field
  const textarea = document.getElementById("question-input");
  if (textarea && document.activeElement !== textarea) {
    textarea.value = state.question;
  }

  // 6. Change submit state button classes
  const submitBtn = document.getElementById("submit-query-btn");
  if (submitBtn) {
    const disable = state.isLoading || !state.question.trim();
    submitBtn.disabled = disable;
    if (disable) {
      submitBtn.className = "h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all outline-none bg-slate-100 text-slate-400 cursor-not-allowed";
    } else {
      submitBtn.className = "h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all outline-none bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer";
    }
  }

  // 7. Render contextual suggested pills prompt links
  renderSuggestedPills(currentCategory);
}

// ==========================================
// 7. MODULAR SUB-TEMPLATE COMPILER FUNCTIONS
// ==========================================
function renderHeader() {
  const container = document.getElementById("header-mount");
  if (!container) return;

  container.innerHTML = `
    <header class="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-10 w-full">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Logo Badge Brand -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0v6.5"></path>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                Study Tool
              </span>
            </div>
            <h1 class="text-xl font-bold font-display tracking-tight text-slate-900">
              AI Study Assistant
            </h1>
          </div>
        </div>

        <!-- Academic service badges container removed -->
      </div>
    </header>
  `;
}

function renderCategoryList(current) {
  const container = document.getElementById("category-selector-mount");
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-display">
          Study Subject / Category
        </label>
        <span class="text-[11px] text-slate-400">Contextualizes answers</span>
      </div>
      <div class="grid grid-cols-2 gap-2" id="category-buttons-grid">
        ${CATEGORIES.map((category) => {
          const isSelected = category.id === current.id;
          const activeClasses = isSelected
            ? "border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm font-semibold"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-600";
          const iconBgClasses = isSelected
            ? "bg-blue-200/50 text-blue-700"
            : "bg-slate-100 text-slate-500";

          return `
            <button
              type="button"
              data-cat-id="${category.id}"
              class="flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${activeClasses}"
            >
              <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBgClasses}">
                ${getCategoryIconSvg(category.iconName, "w-4 h-4")}
              </div>
              <span class="truncate">${category.name}</span>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;

  // Direct element binding clicks
  const buttons = container.querySelectorAll("button[data-cat-id]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedCategoryId = btn.getAttribute("data-cat-id");
      renderApp();
    });
  });
}

function renderToneSelector(current) {
  const container = document.getElementById("tone-selector-mount");
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-display">
          Assistant Persona / Tone
        </label>
        <span class="text-[11px] text-slate-400">Controls feedback style</span>
      </div>
      <div class="grid grid-cols-2 gap-2" id="tone-buttons-grid">
        ${TONES.map((tone) => {
          const isSelected = tone.id === current.id;
          const activeClasses = isSelected
            ? "border-blue-500 bg-blue-50/50 text-blue-900 shadow-sm"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700";

          return `
            <button
              type="button"
              data-tone-id="${tone.id}"
              class="flex flex-col items-start text-left p-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${activeClasses}"
            >
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-lg">${tone.emoji}</span>
                <span class="font-semibold text-xs tracking-tight">${tone.name}</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-normal line-clamp-2" id="desc-${tone.id}"></p>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;

  // Apply texts safely to prevent escaping bugs
  TONES.forEach((t) => {
    const el = container.querySelector(`#desc-${t.id}`);
    if (el) el.textContent = t.description;
  });

  const buttons = container.querySelectorAll("button[data-tone-id]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedToneId = btn.getAttribute("data-tone-id");
      renderApp();
    });
  });
}

function renderQueries() {
  const container = document.getElementById("saved-queries-mount");
  if (!container) return;

  if (state.savedQueries.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2">
        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h4 class="text-xs font-semibold text-slate-600 font-display">No Saved Session Notes</h4>
        <p class="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
          Ask academic questions on the right. Your session questions will be pinned here.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-display">
          Active Session Notes (${state.savedQueries.length})
        </label>
        <button
          id="clear-all-log-btn"
          type="button"
          class="text-[10px] text-red-500 hover:text-red-700 font-semibold focus:outline-none flex items-center gap-1 cursor-pointer"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Clear Log
        </button>
      </div>

      <div class="space-y-2 max-h-[220px] overflow-y-auto pr-1" id="saved-queries-scroll-list">
        ${state.savedQueries.map((q) => {
          const cat = CATEGORIES.find((c) => c.id === q.category);
          const isActive = q.id === state.activeQueryId;
          const bgClass = isActive
            ? "bg-blue-50 border-blue-200 text-blue-900"
            : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700";
          const iconBgClass = isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500";

          return `
            <div
              data-query-id="${q.id}"
              class="group flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${bgClass}"
            >
              <div class="flex gap-2.5 min-w-0 flex-1">
                <div class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${iconBgClass}">
                  ${getCategoryIconSvg(cat?.iconName || "BookOpen", "w-3 h-3 text-slate-600")}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium truncate leading-tight pr-1" id="query-title-${q.id}"></p>
                  <p class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <span>${cat?.name || "General"}</span>
                    <span>•</span>
                    <span>${q.timestamp}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-delete-query-id="${q.id}"
                class="text-slate-400 hover:text-red-500 p-1 rounded-md md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none shrink-0 cursor-pointer"
                title="Remove notes"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  // Safely interpolate query questions as textContent to avoid HTML tags bugs
  state.savedQueries.forEach((q) => {
    const el = container.querySelector(`#query-title-${q.id}`);
    if (el) el.textContent = q.question;
  });

  const cards = container.querySelectorAll("div[data-query-id]");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const qId = card.getAttribute("data-query-id");
      const matched = state.savedQueries.find((q) => q.id === qId);
      if (matched) {
        state.activeQuestion = matched.question;
        state.activeAnswer = matched.answer;
        state.activeQueryId = matched.id;
        state.selectedCategoryId = matched.category;
        state.selectedToneId = matched.tone;
        state.error = null;
        renderApp();
      }
    });
  });

  const deletes = container.querySelectorAll("button[data-delete-query-id]");
  deletes.forEach((delBtn) => {
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const qId = delBtn.getAttribute("data-delete-query-id");
      state.savedQueries = state.savedQueries.filter((q) => q.id !== qId);
      saveToCache();
      if (state.activeQueryId === qId) {
        resetActiveBoard();
      } else {
        renderApp();
      }
    });
  });

  const clearBtn = container.querySelector("#clear-all-log-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (window.confirm("Are you sure you want to clear your local session history? This cannot be undone.")) {
        state.savedQueries = [];
        localStorage.removeItem("aira_study_queries_flat");
        resetActiveBoard();
      }
    });
  }
}

function renderResponseView(categoryOption, toneOption) {
  const container = document.getElementById("response-mount");
  if (!container) return;

  // 1. Loading UI state
  if (state.isLoading) {
    container.innerHTML = `
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm flex-1 animate-pulse h-full min-h-[350px]">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="space-y-2">
            <div class="h-4 w-32 bg-slate-200 rounded-lg"></div>
            <div class="h-6 w-64 bg-slate-200 rounded-lg"></div>
          </div>
          <div class="h-9 w-24 bg-slate-200 rounded-lg"></div>
        </div>
        <div class="space-y-3">
          <div class="h-4 w-full bg-slate-100 rounded-lg"></div>
          <div class="h-4 w-[90%] bg-slate-100 rounded-lg"></div>
          <div class="h-4 w-full bg-slate-100 rounded-lg"></div>
        </div>
        <div class="space-y-3 pt-4 border-t border-slate-50">
          <div class="h-5 w-40 bg-slate-200 rounded-lg mb-2"></div>
          <div class="h-4 w-4/5 bg-slate-100 rounded-lg"></div>
          <div class="h-4 w-full bg-slate-100 rounded-lg"></div>
          <div class="h-4 w-[85%] bg-slate-100 rounded-lg"></div>
        </div>
        <div class="space-y-2 pt-4 border-t border-slate-50">
          <div class="h-5 w-48 bg-slate-200 rounded-lg mb-2"></div>
          <div class="h-12 w-full bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    `;
    return;
  }

  // 2. Error UI state
  if (state.error) {
    container.innerHTML = `
      <div class="bg-red-50/50 border border-red-200 rounded-2xl p-8 text-center space-y-4 shadow-sm flex-1 min-h-[350px]">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold font-display text-red-900">Study Session Error</h3>
          <p class="text-xs text-red-700/80 mt-1 max-w-md mx-auto leading-relaxed" id="error-message-text"></p>
        </div>
        <button
          id="retry-button"
          type="button"
          class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 border border-red-200 font-semibold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/25"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19M9 5h.01M15 5h.01"></path>
          </svg>
          Retry Request
        </button>
      </div>
    `;
    const errText = container.querySelector("#error-message-text");
    if (errText) errText.textContent = state.error;

    const retryBtn = container.querySelector("#retry-button");
    if (retryBtn) retryBtn.addEventListener("click", resetActiveBoard);
    return;
  }

  // 3. Welcome Blank UI state
  if (!state.activeAnswer) {
    container.innerHTML = `
      <div class="bg-white border border-slate-200/80 rounded-2xl p-8 md:p-12 text-center flex flex-col justify-center items-center shadow-sm flex-1 min-h-[400px] hover:border-slate-300/40 transition-colors h-full">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner ring-4 ring-blue-50/50 relative">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span class="absolute -top-1 -right-1 w-4.5 h-4.5 bg-amber-400 text-amber-950 font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
            ★
          </span>
        </div>
        <h3 class="text-lg font-bold font-display text-slate-800 tracking-tight">Your Personal Academic Hub</h3>
        <p class="text-sm text-slate-500 max-w-md mt-2 mb-6 leading-relaxed">
          Type or select a question to generate standard, curriculum-aligned notes complete with breakdowns, handy analogies, and self-test quizzes.
        </p>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left mt-2">
          <div class="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
            <div class="text-xs font-bold font-display text-slate-800 mb-0.5">💡 Core Concepts</div>
            <p class="text-[11px] text-slate-500 leading-normal">Fast definitions with clean direct context.</p>
          </div>
          <div class="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
            <div class="text-xs font-bold font-display text-slate-800 mb-0.5">🌟 Simple Analogies</div>
            <p class="text-[11px] text-slate-500 leading-normal">Translates abstract ideas into tangible reality.</p>
          </div>
          <div class="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50">
            <div class="text-xs font-bold font-display text-slate-800 mb-0.5">⚡ Self-Study Quiz</div>
            <p class="text-[11px] text-slate-500 leading-normal">Quick recalls placed dynamically to test memory.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 4. Content Material Response UI
  container.innerHTML = `
    <div class="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm flex-1 h-full print:border-none print:shadow-none">
      
      <!-- Session Header Info -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <span id="response-category-icon-wrapper"></span>
              ${categoryOption.name}
            </span>
            <span class="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-lg border border-slate-200 flex items-center gap-1">
              <span>${toneOption.emoji}</span>
              Tone Active
            </span>
          </div>
          <h2 class="text-lg md:text-xl font-bold font-display text-slate-900 leading-normal tracking-tight" id="active-response-title"></h2>
        </div>

        <!-- Material Action Controllers -->
        <div class="flex items-center gap-2 w-full md:w-auto shrink-0 print:hidden">
          <button
            id="copy-text-btn"
            type="button"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800 transition-all cursor-pointer"
            title="Copy notes"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
            <span id="copy-btn-text">Copy</span>
          </button>

          <button
            id="download-markdown-btn"
            type="button"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-xl transition-all cursor-pointer"
            title="Download formatted markdown notes"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Download</span>
          </button>

          <button
            id="print-btn"
            type="button"
            class="p-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-xl transition-all cursor-pointer hidden sm:block"
            title="Print notes page"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
          </button>

          <button
            id="reset-response-btn"
            type="button"
            class="p-2 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl transition-all cursor-pointer"
            title="Reset active view"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19M9 5h.01M15 5h.01"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Render formatted rich notes content -->
      <div class="prose prose-slate max-w-none py-6 overflow-y-auto leading-relaxed flex-1 focus:outline-none print:break-inside-avoid print:prose-xl" id="markdown-container">
        ${parseMarkdown(state.activeAnswer)}
      </div>

      <!-- Warning disclosure info -->
      <div class="border-t border-slate-100 pt-3.5 flex items-center justify-between text-[10px] text-slate-400 font-medium print:hidden">
        <span class="flex items-center gap-1">
          <svg class="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
          Review and verify study materials with textbooks.
        </span>
        <span>© AIRA Education & Services</span>
      </div>
    </div>
  `;

  // Safely paint category header icon & strings
  const iconWrapper = container.querySelector("#response-category-icon-wrapper");
  if (iconWrapper) {
    iconWrapper.innerHTML = getCategoryIconSvg(categoryOption.iconName, "w-3.5 h-3.5 text-blue-600");
  }

  const titleEl = container.querySelector("#active-response-title");
  if (titleEl) {
    titleEl.textContent = state.activeQuestion;
  }

  // Bind single response control events
  const copyBtn = container.querySelector("#copy-text-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(state.activeAnswer).then(() => {
        const btnText = container.querySelector("#copy-btn-text");
        if (btnText) btnText.textContent = "Copied!";
        copyBtn.className = "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition-all cursor-pointer";
        setTimeout(() => {
          if (btnText) btnText.textContent = "Copy";
          copyBtn.className = "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800 transition-all cursor-pointer";
        }, 2000);
      });
    });
  }

  const downloadBtn = container.querySelector("#download-markdown-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      downloadMarkdownNotes(state.activeQuestion, state.activeAnswer, categoryOption.name, toneOption.emoji);
    });
  }

  const printBtn = container.querySelector("#print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  const resetBtn = container.querySelector("#reset-response-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetActiveBoard);
  }
}

function renderSuggestedPills(current) {
  const container = document.getElementById("suggested-pills-container");
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-2 pt-1 border-t border-slate-50">
      <p class="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Suggested from <span class="text-blue-600 font-bold">${current.name}</span>:
      </p>
      <div class="flex flex-wrap gap-1.5" id="pills-grid-container">
        ${current.suggestedQuestions.map((sQuestion) => {
          return `
            <button
              type="button"
              data-pill-text="${sQuestion}"
              class="text-[11px] text-slate-600 hover:text-blue-700 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-all text-left outline-none cursor-pointer"
            >
              ${sQuestion}
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;

  const pills = container.querySelectorAll("button[data-pill-text]");
  pills.forEach((p) => {
    p.addEventListener("click", () => {
      const txt = p.getAttribute("data-pill-text");
      state.question = txt;
      const tArea = document.getElementById("question-input");
      if (tArea) tArea.value = txt;
      renderApp();
    });
  });
}

// ==========================================
// 8. FLOW LISTENERS AND LOGIC TRIGGERS
// ==========================================
function setupFormListeners() {
  const textarea = document.getElementById("question-input");
  if (textarea) {
    textarea.addEventListener("input", (e) => {
      state.question = e.target.value;
      
      const submitBtn = document.getElementById("submit-query-btn");
      if (submitBtn) {
        const disable = state.isLoading || !state.question.trim();
        submitBtn.disabled = disable;
        if (disable) {
          submitBtn.className = "h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all outline-none bg-slate-100 text-slate-400 cursor-not-allowed";
        } else {
          submitBtn.className = "h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all outline-none bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer";
        }
      }
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submitQuestion();
      }
    });
  }

  const form = document.getElementById("query-settings-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitQuestion();
    });
  }
}

async function submitQuestion() {
  const text = state.question.trim();
  if (!text || state.isLoading) return;

  state.isLoading = true;
  state.error = null;
  state.activeQuestion = text;
  state.activeAnswer = null;
  state.activeQueryId = null;
  renderApp();

  const activeCat = CATEGORIES.find((c) => c.id === state.selectedCategoryId) || CATEGORIES[0];
  const activeTone = TONES.find((t) => t.id === state.selectedToneId) || TONES[0];

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: text,
        category: activeCat.name,
        tone: activeTone.systemPromptValue
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Academic Service returned error status ${res.status}`);
    }

    if (!data.answer) {
      throw new Error("No study materials found returned for query.");
    }

    state.activeAnswer = data.answer;

    // Pin query notes to the active logs list
    const logItem = {
      id: crypto.randomUUID(),
      question: text,
      answer: data.answer,
      category: state.selectedCategoryId,
      tone: state.selectedToneId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    state.savedQueries = [logItem, ...state.savedQueries];
    saveToCache();
    state.activeQueryId = logItem.id;
    state.question = ""; // Clear active input

  } catch (err) {
    console.error(err);
    state.error = err.message || "An error occurred. Check if GEMINI_API_KEY is configured correctly.";
  } finally {
    state.isLoading = false;
    renderApp();
  }
}

function resetActiveBoard() {
  state.activeAnswer = null;
  state.activeQuestion = "";
  state.activeQueryId = null;
  state.error = null;
  renderApp();
}

function downloadMarkdownNotes(question, answer, categoryName, emoji) {
  if (!answer) return;
  const element = document.createElement("a");
  const file = new Blob([
    `# Academic Explanation: ${question}\n`,
    `Subject: ${categoryName}\n`,
    `Style: ${emoji}\n`,
    `Date: ${new Date().toLocaleDateString()}\n`,
    `----------------------------------------\n\n`,
    answer,
    `\n\n----------------------------------------\n`,
    `Generated by AIRA Education AI Study Assistant.`
  ], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = `AIRA-Study_${question.slice(0, 20).replace(/\s+/g, "_")}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function saveToCache() {
  try {
    localStorage.setItem("aira_study_queries_flat", JSON.stringify(state.savedQueries));
  } catch (err) {
    console.error("Local Storage sync storage error:", err);
  }
}

// Bootstrap Event
document.addEventListener("DOMContentLoaded", init);
if (document.readyState === "complete" || document.readyState === "interactive") {
  init();
}
