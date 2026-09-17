const inputText = document.getElementById("inputText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const translateButton = document.getElementById("translateButton");
const translatedText = document.getElementById("translatedText");
const copyButton = document.getElementById("copyButton");
const speakButton = document.getElementById("speakButton");
const swapButton = document.getElementById("swapButton");
const status = document.getElementById("status");

const API_URL = "https://api.mymemory.translated.net/get";

translateButton.addEventListener("click", async () => {
const text = inputText.value.trim();
const source = sourceLanguage.value;
const target = targetLanguage.value;

if (!text) {
    status.textContent = "Please enter some text.";
    return;
}

if (source === target) {
    translatedText.textContent = text;
    status.textContent = "Translation completed.";
    return;
}

translateButton.disabled = true;
translateButton.textContent = "Translating...";
status.textContent = "Please wait...";

try {
    const langPair = `${source}|${target}`;

    const url =
        `${API_URL}?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Translation request failed.");
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
        throw new Error("Translation failed.");
    }

    translatedText.textContent =
        data.responseData.translatedText;

    status.textContent = "Translation completed successfully.";

} catch (error) {
    translatedText.textContent = "Unable to translate the text.";
    status.textContent = error.message;

} finally {
    translateButton.disabled = false;
    translateButton.textContent = "Translate";
}
```

});

// Copy translated text
copyButton.addEventListener("click", async () => {
const text = translatedText.textContent;

```
if (!text || text === "Your translation will appear here.") {
    status.textContent = "No translated text available.";
    return;
}

try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Text copied successfully.";
} catch {
    status.textContent = "Copy failed.";
}
```

});

// Text-to-speech
speakButton.addEventListener("click", () => {
const text = translatedText.textContent;

```
if (!text || text === "Your translation will appear here.") {
    status.textContent = "No translated text available.";
    return;
}

speechSynthesis.cancel();

const speech = new SpeechSynthesisUtterance(text);
speech.lang = targetLanguage.value;

speechSynthesis.speak(speech);
```

});

// Swap languages
swapButton.addEventListener("click", () => {
const oldSource = sourceLanguage.value;

```
sourceLanguage.value = targetLanguage.value;
targetLanguage.value = oldSource;

const oldInput = inputText.value;

inputText.value = translatedText.textContent;
translatedText.textContent = oldInput || "Your translation will appear here.";

status.textContent = "Languages swapped.";


});
