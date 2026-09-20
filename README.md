# 🌐 Language Translation Tool

A fast, modern, and free language translation web application powered by **LibreTranslate** and open neural engines. 

> **✨ 100% Free & No API Key Required!** You can use it immediately without signing up, paying, or creating any API keys.

---

## ⚡ Quick Start (Run in 5 Seconds)

You don't need to install anything to start translating:

1. Go to the **`Language translation tool`** folder.
2. Double-click **`index.html`** to open it in your web browser (Chrome, Edge, Firefox, Brave, etc.).
3. Type any text — it will translate automatically!

---

## 🌟 What Can This App Do?

| Feature | Description |
| :--- | :--- |
| **⚡ Instant Translation** | Translates text as you type (or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd>). |
| **✨ Auto Language Detection** | Automatically detects the language you are typing in. |
| **⇄ 1-Click Swap** | Swap source and target languages instantly (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>). |
| **🔊 Listen (Text-to-Speech)** | Hear the translated text spoken out loud in native accent. |
| **🎙️ Voice Input (Dictation)** | Speak into your microphone instead of typing. |
| **📋 Copy & Save** | 1-click copy to clipboard or download translation as a `.txt` file. |
| **🕒 Translation History** | Automatically saves your past translations so you never lose them. |
| **🌙 Dark & Light Mode** | Switch between a clean light look and an eye-friendly dark theme. |

---

## 🔑 How Does It Work Without an API Key?

The tool uses a **Smart Multi-Engine System**:
- **Automatic Fallback**: If one free engine is busy, the app seamlessly switches to another working free engine in the background.
- **Multiple Free Engines Included**:
  1. **Smart Auto (Default)**: Automatically picks the fastest available free engine.
  2. **Google Free Engine**: Supports 100+ languages with high accuracy.
  3. **LibreTranslate Free Mirrors**: Open-source neural translation powered by Argos Translate.
  4. **MyMemory Free**: Community-powered translation memory.
  5. **Local LibreTranslate**: Your private offline server (`http://127.0.0.1:5000`).

You can also change the engine anytime using the **Engine Dropdown** in the top-right corner.

---

## ⌨️ Useful Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Translate text immediately |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> | Swap Source & Target languages |
| <kbd>Esc</kbd> | Close Settings modal |

---

## 💻 (Optional) Run Your Own Offline LibreTranslate Server

If you want **100% private, offline translation** running directly on your computer:

### Step 1: Open the API Folder
Navigate to:
```
D:\project\api\LibreTranslate
```

### Step 2: Start the Server
- **Double-click** `start_free_local_server.bat`  
  *OR* run this command in terminal:
  ```bash
  python main.py --host 127.0.0.1 --port 5000
  ```

### Step 3: Connect
The web app at `index.html` will automatically detect your local server at `http://127.0.0.1:5000` and switch the status badge to **"Local Server Active"**.

---

## 📂 Project Structure

```text
d:\project\
│
├── Language translation tool\        # The Web Application
│   ├── index.html                    # Main web page and user interface
│   ├── style.css                     # Modern styling, animations & dark mode
│   ├── script.js                     # Translation engine, speech & history logic
│   └── README.md                     # Easy-to-read guide (this file)
│
└── api\LibreTranslate\               # Open-source LibreTranslate backend engine
    ├── main.py                       # Python server entry point
    ├── start_free_local_server.bat   # 1-click launcher for local server
    └── ...                           # Core translation models and API modules
```

---

## ❓ Frequently Asked Questions (FAQ)

### 1. Do I need an internet connection?
- **With Cloud Engines (Default)**: Yes, an active internet connection is used to reach free public translation endpoints.
- **With Local LibreTranslate Server**: No internet needed once local language models are installed.

### 2. Is my text private?
- Yes. You can run LibreTranslate completely self-hosted locally on your own machine without sending data to third parties.

### 3. How do I clear my translation history?
- Click the **History** tab at the top, then click **Clear All**.
