# Integrate LibreTranslate into Language Translation Tool

Incorporate the **LibreTranslate** API (`d:\project\api\LibreTranslate`) into the **Language Translation Tool** web application (`d:\project\Language translation tool`), replacing the legacy MyMemory API and broken script code with a robust, feature-packed LibreTranslate integration and a modern UI.

## Proposed Changes

### 1. LibreTranslate API Integration Client
- Create a dedicated, modular LibreTranslate API client (`api.js` / integrated in `script.js`) supporting:
  - `POST /translate`: Plain text and HTML translation with alternative translation candidate support and auto-detection.
  - `GET /languages`: Dynamic retrieval of supported language pairs directly from the LibreTranslate server with graceful fallback.
  - `POST /detect`: Language auto-detection with confidence scores.
  - `POST /translate_file`: Document / file translation support (text files, markdown, etc.).
  - `GET /health`: Real-time health check / server connectivity indicator.
  - Configurable server endpoint (defaults to local `http://127.0.0.1:5000` or customizable remote instances) & optional API key management stored in `localStorage`.

### 2. User Interface Overhaul (`index.html`, `style.css`)
- Rebuild the frontend to adhere to premium web design standards:
  - **Modern Visual Design**: Elegant glassmorphism, dark/light mode toggle, typography (Google Fonts *Outfit* & *Plus Jakarta Sans*), responsive layout.
  - **Interactive Controls**:
    - Source language picker with "Auto Detect" option + Target language picker (searchable & dynamically populated from LibreTranslate).
    - Quick language chips for instant selection.
    - Animated swap language button (`⇄`).
    - Input controls: Character/word counter, Clear button, Paste button, Voice Input (Speech Recognition where supported).
    - Output controls: Copy button with toast feedback, Text-to-Speech (TTS), Download translation, and Alternative translations list.
    - Live Translation mode (with debounced input) & manual Translate button (`Ctrl + Enter`).
    - Document / File Translation Tab for translating text files.
    - Server Status indicator badge showing connection status (Connected / Offline / Latency).
    - Settings modal for configuring LibreTranslate endpoint URL and API Key.
    - History panel for viewing and searching past translations.

### 3. Fixing Existing Code Issues
- Remove broken markdown fence artifacts (````) from [script.js](file:///d:/project/Language%20translation%20tool/script.js).
- Clean up duplicate CSS definitions in [style.css](file:///d:/project/Language%20translation%20tool/style.css).

---

## Verification Plan

### Automated / Browser Verification
- Open [index.html](file:///d:/project/Language%20translation%20tool/index.html) in the browser subagent / local browser.
- Verify that:
  1. UI renders cleanly with theme toggle, responsive layout, and modern controls.
  2. Language dropdowns load dynamically or display supported LibreTranslate languages.
  3. Translating text sends properly formatted payload (`q`, `source`, `target`, `format`) to `/translate`.
  4. Auto-detect works via `/detect` or source `auto`.
  5. Copy to clipboard, text-to-speech, and language swapping work seamlessly.
  6. Settings modal correctly saves and tests custom LibreTranslate server URL and API key.
  7. History saves translations to localStorage.
