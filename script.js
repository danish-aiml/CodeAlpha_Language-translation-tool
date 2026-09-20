/**
 * LibreTranslate Studio - Language Translation Tool
 * Multi-Engine Architecture with Zero API Key Requirement
 */

// ==========================================
// 1. DEFAULT CONFIGURATION & EXTENDED LANGUAGES
// ==========================================
const CONFIG = {
    DEFAULT_SERVER_URL: "http://127.0.0.1:5000",
    DEFAULT_SOURCE_LANG: "auto",
    DEFAULT_TARGET_LANG: "es",
    DEBOUNCE_DELAY: 500, // ms
    MAX_HISTORY_ITEMS: 50,
};

// Comprehensive list of supported languages
const ALL_LANGUAGES = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" },
    { code: "it", name: "Italian" },
    { code: "ko", name: "Korean" },
    { code: "tr", name: "Turkish" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "uk", name: "Ukrainian" },
    { code: "vi", name: "Vietnamese" },
    { code: "id", name: "Indonesian" },
    { code: "el", name: "Greek" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "fi", name: "Finnish" },
    { code: "hu", name: "Hungarian" },
    { code: "no", name: "Norwegian" },
    { code: "sv", name: "Swedish" },
    { code: "th", name: "Thai" },
    { code: "he", name: "Hebrew" },
    { code: "fa", name: "Persian" },
    { code: "ur", name: "Urdu" },
    { code: "bn", name: "Bengali" },
    { code: "ro", name: "Romanian" },
    { code: "sk", name: "Slovak" },
    { code: "bg", name: "Bulgarian" },
    { code: "hr", name: "Croatian" },
    { code: "sr", name: "Serbian" },
    { code: "lt", name: "Lithuanian" },
    { code: "sl", name: "Slovenian" },
    { code: "et", name: "Estonian" },
    { code: "lv", name: "Latvian" },
    { code: "ms", name: "Malay" },
    { code: "tl", name: "Tagalog" },
    { code: "sw", name: "Swahili" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" }
];

// Free public LibreTranslate mirrors (zero key required)
const FREE_LIBRETRANSLATE_MIRRORS = [
    "https://translate.terraprint.co",
    "https://translate.argosopentech.com",
    "https://libretranslate.de",
    "https://lt.vern.cc"
];

// ==========================================
// 2. MULTI-ENGINE TRANSLATION PROVIDERS (ZERO KEY)
// ==========================================
const TranslationEngine = {
    /**
     * Google Free GTX Engine - 100% Free, Zero Key, Super Fast
     */
    async translateGoogleGTX(text, source, target) {
        const sl = source === "auto" ? "auto" : source;
        const tl = target;
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&dt=bd&q=${encodeURIComponent(text)}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) throw new Error(`Google engine HTTP ${response.status}`);
        const data = await response.json();

        // Parse translated sentences
        let translatedText = "";
        if (Array.isArray(data[0])) {
            translatedText = data[0].map(item => item[0]).join("");
        }

        const detectedLang = data[2] || (source !== "auto" ? source : null);

        return {
            translatedText,
            detectedLanguage: detectedLang ? { language: detectedLang, confidence: 99 } : null,
            alternatives: [],
            engineName: "Google Free Engine (No Key)"
        };
    },

    /**
     * LibreTranslate (Local or Public Mirror)
     */
    async translateLibre(text, source, target, serverUrl, apiKey) {
        const urlsToTry = [];
        if (serverUrl) urlsToTry.push(serverUrl);
        FREE_LIBRETRANSLATE_MIRRORS.forEach(m => {
            if (!urlsToTry.includes(m)) urlsToTry.push(m);
        });

        let lastErr = null;

        for (const url of urlsToTry) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 6000);

                const payload = {
                    q: text,
                    source: source || "auto",
                    target: target,
                    format: "text",
                    alternatives: 3
                };
                if (apiKey) payload.api_key = apiKey;

                const res = await fetch(`${url}/translate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeout);

                if (res.ok) {
                    const data = await res.json();
                    return {
                        translatedText: data.translatedText,
                        detectedLanguage: data.detectedLanguage || null,
                        alternatives: data.alternatives || [],
                        engineName: url.includes("127.0.0.1") || url.includes("localhost") ? "Local LibreTranslate" : "LibreTranslate Free Mirror"
                    };
                }
            } catch (err) {
                lastErr = err;
            }
        }
        throw lastErr || new Error("All LibreTranslate servers unavailable");
    },

    /**
     * MyMemory Free Engine
     */
    async translateMyMemory(text, source, target) {
        const src = source === "auto" ? "en" : source;
        const langPair = `${src}|${target}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) throw new Error(`MyMemory HTTP ${response.status}`);
        const data = await response.json();

        if (data.responseStatus !== 200 && data.responseStatus !== "200") {
            throw new Error(data.responseDetails || "MyMemory translation error");
        }

        return {
            translatedText: data.responseData.translatedText,
            detectedLanguage: source === "auto" ? { language: "en", confidence: 80 } : null,
            alternatives: [],
            engineName: "MyMemory Free (No Key)"
        };
    },

    /**
     * Smart Auto-Cascade: Tries LibreTranslate -> Google GTX -> MyMemory
     */
    async translateSmartAuto(text, source, target, serverUrl, apiKey) {
        // 1. Try LibreTranslate (Local / Free Mirror)
        try {
            return await this.translateLibre(text, source, target, serverUrl, apiKey);
        } catch (e) {
            console.warn("LibreTranslate mirror failed, falling back to Google Free GTX engine:", e);
        }

        // 2. Try Google Free GTX (Fast, Unlimited, Zero Key)
        try {
            return await this.translateGoogleGTX(text, source, target);
        } catch (e) {
            console.warn("Google GTX engine failed, falling back to MyMemory:", e);
        }

        // 3. Try MyMemory
        return await this.translateMyMemory(text, source, target);
    }
};

// ==========================================
// 3. APPLICATION STATE & DOM REFERENCES
// ==========================================
let appState = {
    languages: ALL_LANGUAGES,
    selectedEngine: localStorage.getItem("lt_engine") || "auto",
    serverUrl: localStorage.getItem("lt_server_url") || CONFIG.DEFAULT_SERVER_URL,
    apiKey: localStorage.getItem("lt_api_key") || "",
    isTranslating: false,
    debounceTimer: null,
    selectedFile: null,
    translatedBlob: null,
    speechRecognition: null,
    isListening: false
};

const elements = {
    // Header & Controls
    html: document.documentElement,
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeMoonIcon: document.getElementById("themeMoonIcon"),
    themeSunIcon: document.getElementById("themeSunIcon"),
    engineSelect: document.getElementById("engineSelect"),
    serverStatusBtn: document.getElementById("serverStatusBtn"),
    serverStatusText: document.getElementById("serverStatusText"),
    activeEngineBadge: document.getElementById("activeEngineBadge"),
    openSettingsBtn: document.getElementById("openSettingsBtn"),
    closeSettingsBtn: document.getElementById("closeSettingsBtn"),
    settingsModal: document.getElementById("settingsModal"),
    serverUrlInput: document.getElementById("serverUrlInput"),
    apiKeyInput: document.getElementById("apiKeyInput"),
    testConnectionBtn: document.getElementById("testConnectionBtn"),
    testConnectionResult: document.getElementById("testConnectionResult"),
    saveSettingsBtn: document.getElementById("saveSettingsBtn"),
    resetSettingsBtn: document.getElementById("resetSettingsBtn"),
    presetBtns: document.querySelectorAll(".preset-btn"),

    // Navigation Tabs
    navTabs: document.querySelectorAll(".nav-tab"),
    tabContents: document.querySelectorAll(".tab-content"),

    // Translation Elements
    sourceLanguage: document.getElementById("sourceLanguage"),
    targetLanguage: document.getElementById("targetLanguage"),
    sourceChips: document.getElementById("sourceChips"),
    targetChips: document.getElementById("targetChips"),
    swapButton: document.getElementById("swapButton"),
    inputText: document.getElementById("inputText"),
    translatedText: document.getElementById("translatedText"),
    translateButton: document.getElementById("translateButton"),
    autoTranslateToggle: document.getElementById("autoTranslateToggle"),
    translationSpinner: document.getElementById("translationSpinner"),
    statusMessage: document.getElementById("statusMessage"),
    detectedPill: document.getElementById("detectedPill"),
    detectedLangName: document.getElementById("detectedLangName"),
    charCount: document.getElementById("charCount"),
    wordCount: document.getElementById("wordCount"),
    outputCharCount: document.getElementById("outputCharCount"),
    alternativesContainer: document.getElementById("alternativesContainer"),
    alternativesList: document.getElementById("alternativesList"),

    // Actions
    clearInputBtn: document.getElementById("clearInputBtn"),
    pasteBtn: document.getElementById("pasteBtn"),
    voiceInputBtn: document.getElementById("voiceInputBtn"),
    copyButton: document.getElementById("copyButton"),
    copyBtnText: document.getElementById("copyBtnText"),
    speakButton: document.getElementById("speakButton"),
    downloadTextBtn: document.getElementById("downloadTextBtn"),

    // File Translation
    fileDropZone: document.getElementById("fileDropZone"),
    fileInput: document.getElementById("fileInput"),
    fileDetailsCard: document.getElementById("fileDetailsCard"),
    fileName: document.getElementById("fileName"),
    fileSize: document.getElementById("fileSize"),
    removeFileBtn: document.getElementById("removeFileBtn"),
    translateFileBtn: document.getElementById("translateFileBtn"),
    downloadFileBtn: document.getElementById("downloadFileBtn"),

    // History
    historyList: document.getElementById("historyList"),
    historyCountBadge: document.getElementById("historyCountBadge"),
    historySearch: document.getElementById("historySearch"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn"),

    // Toast
    toastContainer: document.getElementById("toastContainer")
};

// ==========================================
// 4. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initSettings();
    populateLanguageDropdowns(ALL_LANGUAGES);
    initSpeechRecognition();
    setupEventListeners();
    renderHistory();
    updateTextStats();
    checkEngineStatus();
});

function initTheme() {
    const savedTheme = localStorage.getItem("lt_theme") || "light";
    setTheme(savedTheme);
}

function setTheme(theme) {
    elements.html.setAttribute("data-theme", theme);
    localStorage.setItem("lt_theme", theme);
    if (theme === "dark") {
        elements.themeMoonIcon.classList.add("hidden");
        elements.themeSunIcon.classList.remove("hidden");
    } else {
        elements.themeMoonIcon.classList.remove("hidden");
        elements.themeSunIcon.classList.add("hidden");
    }
}

function initSettings() {
    elements.serverUrlInput.value = appState.serverUrl;
    elements.apiKeyInput.value = appState.apiKey;
    elements.engineSelect.value = appState.selectedEngine;
}

async function checkEngineStatus() {
    elements.serverStatusBtn.className = "status-badge checking";
    elements.serverStatusText.textContent = "Checking...";

    // Test local or remote LibreTranslate
    let localOk = false;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(`${appState.serverUrl}/health`, { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) localOk = true;
    } catch {}

    elements.serverStatusBtn.className = "status-badge online";
    if (localOk) {
        elements.serverStatusText.textContent = "Local Server Active";
    } else {
        elements.serverStatusText.textContent = "Free Cloud Mode (Ready)";
    }
}

function populateLanguageDropdowns(languages) {
    const currentSource = elements.sourceLanguage.value || "auto";
    const currentTarget = elements.targetLanguage.value || "es";

    // Source Language Dropdown (starts with Auto Detect)
    elements.sourceLanguage.innerHTML = '<option value="auto">✨ Auto Detect</option>';
    languages.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l.code;
        opt.textContent = l.name;
        elements.sourceLanguage.appendChild(opt);
    });

    // Target Language Dropdown
    elements.targetLanguage.innerHTML = '';
    languages.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l.code;
        opt.textContent = l.name;
        elements.targetLanguage.appendChild(opt);
    });

    elements.sourceLanguage.value = currentSource;
    elements.targetLanguage.value = currentTarget;
    updateLanguageChips();
}

function updateLanguageChips() {
    const srcVal = elements.sourceLanguage.value;
    elements.sourceChips.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.lang === srcVal);
    });

    const tgtVal = elements.targetLanguage.value;
    elements.targetChips.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.lang === tgtVal);
    });
}

// ==========================================
// 5. EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Theme
    elements.themeToggleBtn.addEventListener("click", () => {
        const currentTheme = elements.html.getAttribute("data-theme");
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });

    // Engine Selector
    elements.engineSelect.addEventListener("change", e => {
        appState.selectedEngine = e.target.value;
        localStorage.setItem("lt_engine", appState.selectedEngine);
        showToast(`Engine set to: ${e.target.options[e.target.selectedIndex].text}`);
        triggerTranslation();
    });

    // Navigation Tabs
    elements.navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            elements.navTabs.forEach(t => t.classList.remove("active"));
            elements.tabContents.forEach(c => c.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    // Language Dropdowns
    elements.sourceLanguage.addEventListener("change", () => {
        updateLanguageChips();
        triggerTranslation();
    });

    elements.targetLanguage.addEventListener("change", () => {
        updateLanguageChips();
        triggerTranslation();
    });

    // Quick Chips
    elements.sourceChips.addEventListener("click", e => {
        if (e.target.classList.contains("chip")) {
            elements.sourceLanguage.value = e.target.dataset.lang;
            updateLanguageChips();
            triggerTranslation();
        }
    });

    elements.targetChips.addEventListener("click", e => {
        if (e.target.classList.contains("chip")) {
            elements.targetLanguage.value = e.target.dataset.lang;
            updateLanguageChips();
            triggerTranslation();
        }
    });

    // Swap Languages
    elements.swapButton.addEventListener("click", swapLanguages);

    // Text Input Typing
    elements.inputText.addEventListener("input", () => {
        updateTextStats();
        if (elements.autoTranslateToggle.checked) {
            clearTimeout(appState.debounceTimer);
            appState.debounceTimer = setTimeout(() => {
                triggerTranslation();
            }, CONFIG.DEBOUNCE_DELAY);
        }
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            triggerTranslation();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "S" || e.key === "s")) {
            e.preventDefault();
            swapLanguages();
        }
        if (e.key === "Escape" && !elements.settingsModal.classList.contains("hidden")) {
            elements.settingsModal.classList.add("hidden");
        }
    });

    // Translate Button
    elements.translateButton.addEventListener("click", () => {
        triggerTranslation();
    });

    // Clear Button
    elements.clearInputBtn.addEventListener("click", () => {
        elements.inputText.value = "";
        elements.translatedText.innerHTML = '<span class="placeholder-text">Your translation will appear here...</span>';
        elements.detectedPill.classList.add("hidden");
        elements.alternativesContainer.classList.add("hidden");
        hideStatus();
        updateTextStats();
    });

    // Paste Button
    elements.pasteBtn.addEventListener("click", async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                elements.inputText.value = text;
                updateTextStats();
                triggerTranslation();
                showToast("Text pasted from clipboard");
            }
        } catch {
            showToast("Failed to paste from clipboard", "error");
        }
    });

    // Copy Button
    elements.copyButton.addEventListener("click", async () => {
        const text = getCleanTranslatedText();
        if (!text) {
            showToast("No translated text to copy", "error");
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            elements.copyBtnText.textContent = "Copied!";
            showToast("Copied to clipboard!");
            setTimeout(() => {
                elements.copyBtnText.textContent = "Copy";
            }, 2000);
        } catch {
            showToast("Failed to copy text", "error");
        }
    });

    // Text to Speech
    elements.speakButton.addEventListener("click", () => {
        const text = getCleanTranslatedText();
        if (!text) {
            showToast("No translation to speak", "error");
            return;
        }
        speakText(text, elements.targetLanguage.value);
    });

    // Download Text
    elements.downloadTextBtn.addEventListener("click", () => {
        const text = getCleanTranslatedText();
        if (!text) {
            showToast("No text to download", "error");
            return;
        }
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `translation_${elements.targetLanguage.value}_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Translation downloaded!");
    });

    // Voice Input
    elements.voiceInputBtn.addEventListener("click", toggleVoiceDictation);

    // Settings Modal
    elements.serverStatusBtn.addEventListener("click", openSettingsModal);
    elements.openSettingsBtn.addEventListener("click", openSettingsModal);
    elements.closeSettingsBtn.addEventListener("click", closeSettingsModal);
    elements.settingsModal.addEventListener("click", e => {
        if (e.target === elements.settingsModal) closeSettingsModal();
    });

    elements.presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            elements.serverUrlInput.value = btn.dataset.url;
        });
    });

    elements.testConnectionBtn.addEventListener("click", async () => {
        elements.testConnectionResult.textContent = "Testing...";
        elements.testConnectionResult.style.color = "var(--text-muted)";

        const url = elements.serverUrlInput.value.trim();
        try {
            const start = performance.now();
            const res = await fetch(`${url}/languages`, { method: "GET" });
            const lat = Math.round(performance.now() - start);
            if (res.ok) {
                elements.testConnectionResult.textContent = `✓ Connected (${lat}ms)`;
                elements.testConnectionResult.style.color = "var(--success)";
            } else {
                elements.testConnectionResult.textContent = `✕ Server HTTP ${res.status}`;
                elements.testConnectionResult.style.color = "var(--danger)";
            }
        } catch {
            elements.testConnectionResult.textContent = `✕ Server unreachable (Cloud mode will be used)`;
            elements.testConnectionResult.style.color = "var(--warning)";
        }
    });

    elements.saveSettingsBtn.addEventListener("click", () => {
        appState.serverUrl = elements.serverUrlInput.value.trim() || CONFIG.DEFAULT_SERVER_URL;
        appState.apiKey = elements.apiKeyInput.value.trim();
        localStorage.setItem("lt_server_url", appState.serverUrl);
        localStorage.setItem("lt_api_key", appState.apiKey);
        closeSettingsModal();
        showToast("Settings saved!");
        checkEngineStatus();
    });

    elements.resetSettingsBtn.addEventListener("click", () => {
        elements.serverUrlInput.value = CONFIG.DEFAULT_SERVER_URL;
        elements.apiKeyInput.value = "";
    });

    // File translation & history
    setupFileTranslationHandlers();
    elements.clearHistoryBtn.addEventListener("click", clearAllHistory);
    elements.historySearch.addEventListener("input", e => {
        renderHistory(e.target.value);
    });
}

// ==========================================
// 6. CORE TRANSLATION DISPATCHER
// ==========================================
async function triggerTranslation() {
    const text = elements.inputText.value.trim();
    const source = elements.sourceLanguage.value;
    const target = elements.targetLanguage.value;

    if (!text) {
        elements.translatedText.innerHTML = '<span class="placeholder-text">Your translation will appear here...</span>';
        elements.detectedPill.classList.add("hidden");
        elements.alternativesContainer.classList.add("hidden");
        elements.outputCharCount.textContent = "0 characters";
        hideStatus();
        return;
    }

    if (source !== "auto" && source === target) {
        elements.translatedText.textContent = text;
        elements.outputCharCount.textContent = `${text.length} characters`;
        elements.detectedPill.classList.add("hidden");
        elements.alternativesContainer.classList.add("hidden");
        hideStatus();
        return;
    }

    setLoading(true);
    hideStatus();

    try {
        let result;
        const engine = appState.selectedEngine;

        if (engine === "google_gtx") {
            result = await TranslationEngine.translateGoogleGTX(text, source, target);
        } else if (engine === "libretranslate_public" || engine === "libretranslate_local") {
            result = await TranslationEngine.translateLibre(text, source, target, appState.serverUrl, appState.apiKey);
        } else if (engine === "mymemory") {
            result = await TranslationEngine.translateMyMemory(text, source, target);
        } else {
            // Default: Smart Auto-Cascade (Zero Key)
            result = await TranslationEngine.translateSmartAuto(text, source, target, appState.serverUrl, appState.apiKey);
        }

        // Update output text
        elements.translatedText.textContent = result.translatedText;
        elements.outputCharCount.textContent = `${result.translatedText.length} characters`;

        // Update engine badge
        elements.activeEngineBadge.querySelector("span").textContent = `⚡ ${result.engineName || "Free Engine"}`;

        // Handle detected language
        if (result.detectedLanguage && result.detectedLanguage.language) {
            const detectedCode = result.detectedLanguage.language;
            const langObj = appState.languages.find(l => l.code === detectedCode);
            const langName = langObj ? langObj.name : detectedCode.toUpperCase();
            const conf = result.detectedLanguage.confidence ? ` (${Math.round(result.detectedLanguage.confidence)}%)` : "";

            elements.detectedLangName.textContent = `Detected: ${langName}${conf}`;
            elements.detectedPill.classList.remove("hidden");
        } else {
            elements.detectedPill.classList.add("hidden");
        }

        // Handle alternatives if available
        if (result.alternatives && result.alternatives.length > 0) {
            elements.alternativesList.innerHTML = "";
            result.alternatives.forEach(alt => {
                const altChip = document.createElement("button");
                altChip.className = "alt-chip";
                altChip.textContent = alt;
                altChip.title = "Click to use this translation";
                altChip.addEventListener("click", () => {
                    elements.translatedText.textContent = alt;
                    showToast("Alternative translation selected");
                });
                elements.alternativesList.appendChild(altChip);
            });
            elements.alternativesContainer.classList.remove("hidden");
        } else {
            elements.alternativesContainer.classList.add("hidden");
        }

        // Save to History
        saveToHistory({
            source: source,
            target: target,
            original: text,
            translated: result.translatedText,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error("Translation error:", error);
        elements.translatedText.innerHTML = `<span style="color: var(--danger)">Translation failed: ${escapeHtml(error.message)}</span>`;
        showStatus(`Error: ${error.message}. Try switching engine to 'Smart Auto' or 'Google Free Engine'.`, "error");
    } finally {
        setLoading(false);
    }
}

function swapLanguages() {
    const sourceVal = elements.sourceLanguage.value;
    const targetVal = elements.targetLanguage.value;

    if (sourceVal === "auto") {
        elements.sourceLanguage.value = targetVal;
        elements.targetLanguage.value = "en";
    } else {
        elements.sourceLanguage.value = targetVal;
        elements.targetLanguage.value = sourceVal;
    }

    const currentOutput = getCleanTranslatedText();
    if (currentOutput) {
        elements.inputText.value = currentOutput;
    }

    updateLanguageChips();
    updateTextStats();
    triggerTranslation();
}

function setLoading(isLoading) {
    appState.isTranslating = isLoading;
    elements.translateButton.disabled = isLoading;
    if (isLoading) {
        elements.translationSpinner.classList.remove("hidden");
    } else {
        elements.translationSpinner.classList.add("hidden");
    }
}

function getCleanTranslatedText() {
    const text = elements.translatedText.textContent;
    if (!text || text === "Your translation will appear here...") {
        return "";
    }
    return text.trim();
}

function updateTextStats() {
    const text = elements.inputText.value;
    elements.charCount.textContent = `${text.length} / 10,000`;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    elements.wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;
}

// ==========================================
// 7. SPEECH & VOICE
// ==========================================
function speakText(text, langCode) {
    if (!window.speechSynthesis) {
        showToast("Speech synthesis not supported in this browser", "error");
        return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => elements.speakButton.classList.add("active");
    utterance.onend = utterance.onerror = () => elements.speakButton.classList.remove("active");

    window.speechSynthesis.speak(utterance);
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        elements.voiceInputBtn.title = "Voice recognition not supported";
        return;
    }

    appState.speechRecognition = new SpeechRecognition();
    appState.speechRecognition.continuous = false;
    appState.speechRecognition.interimResults = false;

    appState.speechRecognition.onresult = event => {
        const transcript = event.results[0][0].transcript;
        elements.inputText.value = (elements.inputText.value + " " + transcript).trim();
        updateTextStats();
        triggerTranslation();
    };

    appState.speechRecognition.onerror = event => {
        showToast(`Voice error: ${event.error}`, "error");
        stopListening();
    };

    appState.speechRecognition.onend = () => stopListening();
}

function toggleVoiceDictation() {
    if (!appState.speechRecognition) {
        showToast("Voice recognition not supported in this browser", "error");
        return;
    }
    if (appState.isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    const srcLang = elements.sourceLanguage.value;
    appState.speechRecognition.lang = srcLang === "auto" ? "en-US" : srcLang;
    try {
        appState.speechRecognition.start();
        appState.isListening = true;
        elements.voiceInputBtn.classList.add("active");
        showToast("Listening... Speak now");
    } catch (e) {
        console.error(e);
    }
}

function stopListening() {
    appState.isListening = false;
    elements.voiceInputBtn.classList.remove("active");
    try {
        appState.speechRecognition.stop();
    } catch {}
}

// ==========================================
// 8. FILE TRANSLATION
// ==========================================
function setupFileTranslationHandlers() {
    elements.fileDropZone.addEventListener("click", () => elements.fileInput.click());

    elements.fileDropZone.addEventListener("dragover", e => {
        e.preventDefault();
        elements.fileDropZone.classList.add("dragover");
    });

    elements.fileDropZone.addEventListener("dragleave", () => elements.fileDropZone.classList.remove("dragover"));

    elements.fileDropZone.addEventListener("drop", e => {
        e.preventDefault();
        elements.fileDropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) handleSelectedFile(e.dataTransfer.files[0]);
    });

    elements.fileInput.addEventListener("change", e => {
        if (e.target.files.length > 0) handleSelectedFile(e.target.files[0]);
    });

    elements.removeFileBtn.addEventListener("click", () => {
        appState.selectedFile = null;
        appState.translatedBlob = null;
        elements.fileDetailsCard.classList.add("hidden");
        elements.downloadFileBtn.classList.add("hidden");
        elements.fileInput.value = "";
    });

    elements.translateFileBtn.addEventListener("click", async () => {
        if (!appState.selectedFile) return;

        const source = elements.sourceLanguage.value;
        const target = elements.targetLanguage.value;

        elements.translateFileBtn.disabled = true;
        elements.translateFileBtn.textContent = "Translating Document...";

        try {
            const text = await appState.selectedFile.text();
            const result = await TranslationEngine.translateSmartAuto(text, source, target, appState.serverUrl, appState.apiKey);

            appState.translatedBlob = new Blob([result.translatedText], { type: "text/plain;charset=utf-8" });
            elements.downloadFileBtn.classList.remove("hidden");
            showToast("Document translated successfully (100% Free)!");
        } catch (err) {
            showToast(`File translation failed: ${err.message}`, "error");
        } finally {
            elements.translateFileBtn.disabled = false;
            elements.translateFileBtn.textContent = "Translate Document";
        }
    });

    elements.downloadFileBtn.addEventListener("click", () => {
        if (!appState.translatedBlob) return;
        const url = URL.createObjectURL(appState.translatedBlob);
        const a = document.createElement("a");
        a.href = url;
        const origName = appState.selectedFile ? appState.selectedFile.name : "document.txt";
        a.download = `translated_${elements.targetLanguage.value}_${origName}`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function handleSelectedFile(file) {
    appState.selectedFile = file;
    elements.fileName.textContent = file.name;
    elements.fileSize.textContent = formatBytes(file.size);
    elements.fileDetailsCard.classList.remove("hidden");
    elements.downloadFileBtn.classList.add("hidden");
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ==========================================
// 9. HISTORY MANAGEMENT
// ==========================================
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem("lt_history")) || [];
    } catch {
        return [];
    }
}

function saveToHistory(item) {
    let history = getHistory();
    if (history.length > 0 && history[0].original === item.original && history[0].target === item.target) {
        return;
    }
    history.unshift(item);
    if (history.length > CONFIG.MAX_HISTORY_ITEMS) {
        history = history.slice(0, CONFIG.MAX_HISTORY_ITEMS);
    }
    localStorage.setItem("lt_history", JSON.stringify(history));
    renderHistory();
}

function clearAllHistory() {
    if (confirm("Clear all translation history?")) {
        localStorage.removeItem("lt_history");
        renderHistory();
        showToast("History cleared");
    }
}

function renderHistory(searchQuery = "") {
    const history = getHistory();
    elements.historyCountBadge.textContent = history.length;

    const filtered = searchQuery.trim()
        ? history.filter(item => 
            item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.translated.toLowerCase().includes(searchQuery.toLowerCase()))
        : history;

    if (filtered.length === 0) {
        elements.historyList.innerHTML = `
            <div class="empty-state">
                <p>${searchQuery ? "No matching translations found." : "No translation history yet."}</p>
            </div>
        `;
        return;
    }

    elements.historyList.innerHTML = "";
    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";

        const srcName = getLangName(item.source);
        const tgtName = getLangName(item.target);
        const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="history-item-top">
                <span class="history-item-lang">${srcName} → ${tgtName}</span>
                <span>${timeStr}</span>
            </div>
            <div class="history-item-content">
                <div class="history-orig">${escapeHtml(item.original)}</div>
                <div class="history-trans">${escapeHtml(item.translated)}</div>
            </div>
            <div class="history-item-actions">
                <button class="action-btn copy-hist-btn" title="Copy Translation">
                    <span>Copy</span>
                </button>
                <button class="action-btn use-hist-btn" title="Use This Text">
                    <span>Load</span>
                </button>
            </div>
        `;

        div.querySelector(".copy-hist-btn").addEventListener("click", () => {
            navigator.clipboard.writeText(item.translated);
            showToast("Copied to clipboard!");
        });

        div.querySelector(".use-hist-btn").addEventListener("click", () => {
            elements.inputText.value = item.original;
            elements.sourceLanguage.value = item.source;
            elements.targetLanguage.value = item.target;
            elements.translatedText.textContent = item.translated;
            updateLanguageChips();
            updateTextStats();
            document.querySelector('.nav-tab[data-tab="textTab"]').click();
            showToast("Translation loaded into studio");
        });

        elements.historyList.appendChild(div);
    });
}

function getLangName(code) {
    if (code === "auto") return "Auto";
    const found = appState.languages.find(l => l.code === code);
    return found ? found.name : code.toUpperCase();
}

// ==========================================
// 10. MODALS & UTILITIES
// ==========================================
function openSettingsModal() {
    elements.serverUrlInput.value = appState.serverUrl;
    elements.apiKeyInput.value = appState.apiKey;
    elements.testConnectionResult.textContent = "";
    elements.settingsModal.classList.remove("hidden");
}

function closeSettingsModal() {
    elements.settingsModal.classList.add("hidden");
}

function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    if (type === "error") {
        toast.style.borderColor = "var(--danger)";
        toast.style.color = "var(--danger)";
    }

    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showStatus(message, type = "error") {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-banner ${type}`;
    elements.statusMessage.classList.remove("hidden");
}

function hideStatus() {
    elements.statusMessage.classList.add("hidden");
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
