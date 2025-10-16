// Language Module - PT/EN toggle with dropdown

let currentLanguage = localStorage.getItem('language') || 'en';

export function initLanguage() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    // Apply saved language
    setLanguage(currentLanguage);
    updateActiveLanguage();

    // Toggle dropdown
    if (languageToggle) {
        languageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
    }

    // Select language from dropdown
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = option.getAttribute('data-lang');
            if (selectedLang !== currentLanguage) {
                currentLanguage = selectedLang;
                setLanguage(currentLanguage);
                localStorage.setItem('language', currentLanguage);
                updateActiveLanguage();
            }
            languageDropdown.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('active');
        }
    });

    // Apply translations immediately after DOM updates
    setTimeout(() => {
        setLanguage(currentLanguage);
    }, 100);
}

function updateActiveLanguage() {
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    loadTranslations(lang);

    // Dispatch custom event to notify modules that language has changed
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`data/translations.json`);
        const translations = await response.json();

        if (translations[lang]) {
            applyTranslations(translations[lang]);
        }
    } catch (error) {
        console.log('Translations file not found, using default text');
    }
}

function applyTranslations(translations) {
    // Apply translations to elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder !== undefined) {
                    element.placeholder = translations[key];
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });

    // Apply translations for placeholder-specific attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });
}

export function getCurrentLanguage() {
    return currentLanguage;
}