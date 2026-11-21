// Ces sélecteurs relient la page d’article à ses données et à ses actions.
const detailStatus = document.querySelector("#detail-status");
const detailArticle = document.querySelector("#detail-article");
const detailMeta = document.querySelector("#detail-meta");
const detailTitle = document.querySelector("#detail-title");
const detailSummary = document.querySelector("#detail-summary");
const sourceExcerpt = document.querySelector("#source-excerpt");
const detailContext = document.querySelector("#detail-context");
const detailSourceLink = document.querySelector("#detail-source-link");
const generateSummaryButton = document.querySelector("#generate-summary");
const summaryStatus = document.querySelector("#summary-status");
const { getLanguage, translate } = window.aiDailyI18n;

// Le domaine local utilise FastAPI sur son port ; Vercel partage le même domaine.
const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(
  window.location.hostname,
);
const API_BASE_URL = isLocalDevelopment ? "http://127.0.0.1:8000" : "";
let selectedArticle = null;
let bilingualSummary = null;

// Ajoute un séparateur décoratif entre les informations de l’article.
function createSeparator() {
  const separator = document.createElement("span");
  separator.className = "meta-separator";
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "·";
  return separator;
}

// Affiche le résumé généré dans la langue actuellement choisie sur le site.
function renderGeneratedSummary() {
  if (!bilingualSummary) {
    return;
  }

  detailSummary.textContent = bilingualSummary[getLanguage()];
  detailSummary.hidden = false;
}

// Affiche les champs réels de l’article sans interpréter le texte source comme du HTML.
function renderArticle(article) {
  selectedArticle = article;
  detailTitle.textContent = article.title;
  sourceExcerpt.textContent =
    article.summary || translate("feed.noSummary");
  detailContext.textContent = article.summary
    ? translate("detail.sourceSummaryContext")
    : translate("detail.noSourceSummary");

  const source = document.createElement("span");
  source.textContent = article.source;
  detailMeta.replaceChildren(source);

  if (article.published_at) {
    const date = new Date(article.published_at);
    if (!Number.isNaN(date.getTime())) {
      const time = document.createElement("time");
      time.dateTime = date.toISOString();
      time.textContent = new Intl.DateTimeFormat(
        getLanguage() === "fr" ? "fr-FR" : "en-US",
        { dateStyle: "medium" },
      ).format(date);
      detailMeta.append(createSeparator(), time);
    }
  }

  detailSourceLink.href = article.url;
  document.title = `${article.title} — AI Daily`;
  detailStatus.hidden = true;
  detailArticle.hidden = false;
}

// Charge l’article choisi grâce à son URL d’origine placée dans l’adresse.
async function loadArticle() {
  const articleUrl = new URLSearchParams(window.location.search).get("url");
  if (!articleUrl) {
    detailStatus.textContent = translate("detail.missing");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/article?url=${encodeURIComponent(articleUrl)}`,
    );
    if (response.status === 404) {
      throw new Error(translate("detail.notFound"));
    }
    if (!response.ok) {
      throw new Error(translate("detail.loadError"));
    }

    renderArticle(await response.json());
  } catch (error) {
    detailStatus.textContent = error.message;
    console.error("Erreur lors du chargement de l’actualité :", error);
  }
}

// Demande une explication dans les deux langues seulement lorsque la personne le souhaite.
async function generateBilingualSummary() {
  if (!selectedArticle || generateSummaryButton.disabled) {
    return;
  }

  generateSummaryButton.disabled = true;
  generateSummaryButton.textContent = translate("detail.generating");
  summaryStatus.hidden = true;

  try {
    const response = await fetch(
      `${API_BASE_URL}/article-summary?url=${encodeURIComponent(selectedArticle.url)}`,
    );
    if (!response.ok) {
      const errorKey = response.status === 503
        ? "detail.summaryUnavailable"
        : "detail.generateError";
      throw new Error(translate(errorKey));
    }

    const result = await response.json();
    bilingualSummary = result.summary;
    renderGeneratedSummary();
    generateSummaryButton.hidden = true;
  } catch (error) {
    summaryStatus.textContent = error.message || translate("detail.generateError");
    summaryStatus.hidden = false;
  } finally {
    generateSummaryButton.disabled = false;
    if (!generateSummaryButton.hidden) {
      generateSummaryButton.textContent = translate("detail.generate");
    }
  }
}

// Lie l’action de génération au bouton et respecte la langue choisie après chargement.
generateSummaryButton.addEventListener("click", generateBilingualSummary);
window.addEventListener("languagechange", () => {
  if (selectedArticle) {
    renderArticle(selectedArticle);
  }
  renderGeneratedSummary();
  if (!generateSummaryButton.hidden && !generateSummaryButton.disabled) {
    generateSummaryButton.textContent = translate("detail.generate");
  }
});

loadArticle();
