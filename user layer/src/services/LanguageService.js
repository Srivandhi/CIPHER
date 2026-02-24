const API_URL = 'http://localhost:8000';

export const LanguageService = {
    currentLang: 'en',

    // Cache to store clean translations: { 'text_lang': 'translated_text' }
    cache: {},

    async translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        if (targetLang === 'en') return text; // Assuming English is source

        const cacheKey = `${text.trim()}_${targetLang}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        try {
            const response = await fetch(`${API_URL}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text.trim(),
                    target_lang: targetLang
                })
            });

            if (!response.ok) throw new Error('Translation failed');

            const data = await response.json();
            this.cache[cacheKey] = data.translated;
            return data.translated;
        } catch (error) {
            console.error('Translation Error:', error);
            return text; // Fallback to original
        }
    },

    // Translate all relevant elements on the page
    async translatePage(targetLang) {
        if (targetLang === this.currentLang && targetLang === 'en') return;
        this.currentLang = targetLang;

        // Elements to translate
        const selector = 'h1, h2, h3, h4, h5, h6, p, span, a, button, label, input[placeholder], textarea[placeholder]';
        const elements = document.querySelectorAll(selector);

        const promises = [];

        elements.forEach(el => {
            // 1. Handle Placeholder logic
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder) {
                // Save original if not present
                if (!el.dataset.originalPlaceholder) {
                    el.dataset.originalPlaceholder = el.placeholder;
                }

                const sourceText = el.dataset.originalPlaceholder;
                if (targetLang === 'en') {
                    el.placeholder = sourceText;
                } else {
                    promises.push(
                        this.translateText(sourceText, targetLang).then(trans => {
                            el.placeholder = trans;
                        })
                    );
                }
                return;
            }

            // 2. Handle Text Content logic (excluding children logic for simplicity, but we need to be careful)
            // A better approach for "text nodes only" to avoid destroying DOM structure:
            this.translateNode(el, targetLang);
        });

        await Promise.all(promises);

        // Dispatch event to notify components if needed
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: targetLang } }));
    },

    async translateNode(element, targetLang) {
        // Basic text node walker
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
                const text = node.nodeValue.trim();

                // Store original text on the parent element for this specific node index?
                // Simpler: Store original text in a map using the node as key? WeakMap!
                // Or attach to parent data-attribute if it has only one text node.

                // Let's use a simpler strategy: wrapper elements or robust re-rendering.
                // For this PoC, we will assume we can rely on `dataset.originalText`.

                if (!element.dataset.originalText) {
                    element.dataset.originalText = text;
                }

                const sourceText = element.dataset.originalText;

                if (targetLang === 'en') {
                    node.nodeValue = " " + sourceText + " "; // Add spacing safety
                } else {
                    const translated = await this.translateText(sourceText, targetLang);
                    node.nodeValue = " " + translated + " ";
                }
            }
        }
    }
};
