const languageSelectors = document.querySelectorAll('.language');

languageSelectors.forEach((selector, index) =>
  selector.addEventListener('change', (event) => {
    const selectedLang = event.target.value;
    translateLanguage(selectedLang);

    // Sync the other dropdown
    const otherIndex = index === 0 ? 1 : 0;
    languageSelectors[otherIndex].value = selectedLang;
  }),
);

function translateLanguage(lang) {
  if (!lang) return;

  sessionStorage.setItem('selectedLanguage', lang);

  function applyTranslation() {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = lang;
      googleSelect.dispatchEvent(new Event('change'));
    } else {
      setTimeout(applyTranslation, 300);
    }
  }

  applyTranslation();
}

window.addEventListener('load', () => {
  const savedLang = sessionStorage.getItem('selectedLanguage');
  if (savedLang) {
    languageSelectors.forEach((selector) => {
      selector.value = savedLang;
    });
    translateLanguage(savedLang);
  }
});
