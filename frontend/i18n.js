// Cette table regroupe les textes de l’interface pour les deux langues proposées.
const translations = {
  fr: {
    "page.feedTitle": "AI Daily — Actualités sur l’IA",
    "page.feedDescription": "Un fil clair pour découvrir les actualités de l’intelligence artificielle.",
    "page.articleTitle": "Actualité — AI Daily",
    "page.articleDescription": "Résumé et source d’une actualité sur l’intelligence artificielle.",
    "brand.label": "AI Daily, accueil",
    "nav.label": "Navigation principale",
    "nav.news": "Actualités",
    "search.label": "Rechercher une actualité",
    "search.placeholder": "Rechercher une actualité",
    "intro.eyebrow": "Votre veille IA, en un fil",
    "intro.title": "L’actualité de l’IA,",
    "intro.title.highlight": "en clair.",
    "intro.copy": "Les nouveautés et les idées à suivre dans le domaine de l’intelligence artificielle.",
    "feed.kicker": "Le fil",
    "feed.title": "Actualités récentes",
    "feed.loading": "Chargement…",
    "feed.filters": "Filtrer les actualités par thème",
    "topic.all": "Tout",
    "topic.research": "Recherche",
    "topic.tools": "Outils",
    "topic.business": "Entreprises",
    "feed.loadingNotice": "Chargement des actualités depuis OpenAI News…",
    "feed.loadMore": "Charger la suite",
    "feed.empty": "Aucune actualité ne correspond à ta recherche.",
    "feed.noSummary": "Aucun extrait fourni par la source.",
    "feed.detailLink": "Comprendre cette actualité →",
    "feed.sourceLink": "Source originale ↗",
    "feed.loadError": "Impossible de charger les actualités. Vérifie que le backend FastAPI est lancé sur http://127.0.0.1:8000.",
    "feed.connectionError": "Le navigateur ne peut pas joindre le backend. Lance FastAPI depuis le dossier backend, puis réessaie.",
    "feed.unavailable": "Indisponible",
    "feed.moreError": "Impossible de charger la suite. Tu peux réessayer.",
    "feed.loaded": "{count} actualité(s) chargée(s) depuis OpenAI News.",
    "feed.count.one": "{count} actualité",
    "feed.count.many": "{count} actualités",
    "footer.attribution": "Les articles appartiennent à leurs sources originales.",
    "detail.back": "Retour aux actualités",
    "detail.loading": "Chargement de l’actualité…",
    "detail.missing": "Aucune actualité n’a été sélectionnée. Retourne au fil pour en choisir une.",
    "detail.notFound": "Cette actualité n’est plus présente dans le flux RSS.",
    "detail.loadError": "L’actualité n’a pas pu être chargée.",
    "detail.sourceSummaryTitle": "Extrait fourni par la source",
    "detail.sourceSummaryContext": "Cet extrait vient du flux RSS de la source. L’explication AI Daily est générée séparément.",
    "detail.noSourceSummary": "La source n’a pas fourni d’extrait dans son flux RSS.",
    "detail.explanationTitle": "L’actualité expliquée simplement",
    "detail.explanationIntro": "Une explication générée à partir du texte fourni par la source.",
    "detail.generate": "Générer l’explication en français et en anglais",
    "detail.generating": "Génération en cours…",
    "detail.generateError": "L’explication n’a pas pu être générée. Réessaie plus tard.",
    "detail.sourceKicker": "Pour aller plus loin",
    "detail.originalTitle": "Article original",
    "detail.originalCopy": "Consulte la publication complète sur le site de l’éditeur.",
    "detail.originalLink": "Lire l’article original",
    "detail.summaryUnavailable": "Le service de résumé n’est pas encore configuré.",
    "detail.summaryTemporary": "Le service de résumé est temporairement indisponible.",
    "detail.summaryInvalid": "Le service n’a pas renvoyé les deux résumés attendus.",
  },
  en: {
    "page.feedTitle": "AI Daily — AI News",
    "page.feedDescription": "A clear feed for discovering artificial intelligence news.",
    "page.articleTitle": "Story — AI Daily",
    "page.articleDescription": "Explanation and source for an artificial intelligence story.",
    "brand.label": "AI Daily, home",
    "nav.label": "Main navigation",
    "nav.news": "News",
    "search.label": "Search news",
    "search.placeholder": "Search news",
    "intro.eyebrow": "Your AI news, in one feed",
    "intro.title": "AI news,",
    "intro.title.highlight": "made clear.",
    "intro.copy": "The latest developments and ideas to follow in artificial intelligence.",
    "feed.kicker": "The feed",
    "feed.title": "Recent news",
    "feed.loading": "Loading…",
    "feed.filters": "Filter news by topic",
    "topic.all": "All",
    "topic.research": "Research",
    "topic.tools": "Tools",
    "topic.business": "Business",
    "feed.loadingNotice": "Loading news from OpenAI News…",
    "feed.loadMore": "Load more",
    "feed.empty": "No news matches your search.",
    "feed.noSummary": "No excerpt was provided by the source.",
    "feed.detailLink": "Understand this story →",
    "feed.sourceLink": "Original source ↗",
    "feed.loadError": "Could not load the news. Check that the FastAPI backend is running at http://127.0.0.1:8000.",
    "feed.connectionError": "The browser cannot reach the backend. Start FastAPI from the backend folder, then try again.",
    "feed.unavailable": "Unavailable",
    "feed.moreError": "Could not load more stories. You can try again.",
    "feed.loaded": "{count} story/stories loaded from OpenAI News.",
    "feed.count.one": "{count} story",
    "feed.count.many": "{count} stories",
    "footer.attribution": "Articles belong to their original sources.",
    "detail.back": "Back to the news",
    "detail.loading": "Loading story…",
    "detail.missing": "No story was selected. Go back to the feed and choose one.",
    "detail.notFound": "This story is no longer in the RSS feed.",
    "detail.loadError": "Could not load this story.",
    "detail.sourceSummaryTitle": "Excerpt from the source",
    "detail.sourceSummaryContext": "This excerpt comes from the source’s RSS feed. The AI Daily explanation is generated separately.",
    "detail.noSourceSummary": "The source did not provide an excerpt in its RSS feed.",
    "detail.explanationTitle": "The story, explained simply",
    "detail.explanationIntro": "An explanation generated from the text provided by the source.",
    "detail.generate": "Generate the explanation in French and English",
    "detail.generating": "Generating…",
    "detail.generateError": "Could not generate the explanation. Please try again later.",
    "detail.sourceKicker": "Read more",
    "detail.originalTitle": "Original article",
    "detail.originalCopy": "Read the full publication on the publisher’s website.",
    "detail.originalLink": "Read the original article",
    "detail.summaryUnavailable": "The summary service is not configured yet.",
    "detail.summaryTemporary": "The summary service is temporarily unavailable.",
    "detail.summaryInvalid": "The service did not return both expected summaries.",
  },
};

// Lit la langue sauvegardée et revient au français lors de la première visite.
function getLanguage() {
  return localStorage.getItem("ai-daily-language") === "en" ? "en" : "fr";
}

// Renvoie un texte traduit et remplace les paramètres variables comme le nombre d’articles.
function translate(key, values = {}) {
  let text = translations[getLanguage()][key] || translations.fr[key] || key;
  Object.entries(values).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

// Met à jour les textes et attributs traduisibles présents dans la page.
function applyTranslations() {
  const language = getLanguage();
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = translate(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.setAttribute("content", translate(element.dataset.i18nContent));
  });
  const languageButton = document.querySelector("#language-toggle");
  if (languageButton) {
    languageButton.textContent = language === "fr" ? "English" : "Français";
    languageButton.setAttribute(
      "aria-label",
      language === "fr" ? "Switch to English" : "Passer en français",
    );
  }
  window.dispatchEvent(new CustomEvent("languagechange", { detail: language }));
}

// Expose les fonctions de langue aux scripts du fil et de la page d’article.
window.aiDailyI18n = { getLanguage, translate, applyTranslations };

// Le bouton change la langue et la garde en mémoire pour les prochaines pages.
document.querySelector("#language-toggle")?.addEventListener("click", () => {
  localStorage.setItem("ai-daily-language", getLanguage() === "fr" ? "en" : "fr");
  applyTranslations();
});

applyTranslations();
