// Ces sélecteurs relient le script aux champs, boutons et zones du fil.
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#news-search");
const topicButtons = document.querySelectorAll(".topic-list .topic");
const articleList = document.querySelector("#article-list");
const articleCount = document.querySelector("#article-count");
const emptyState = document.querySelector("#empty-state");
const feedStatus = document.querySelector("#feed-status");
const loadMoreButton = document.querySelector("#load-more");
const i18n = window.aiDailyI18n;

// En local, le frontend et l’API utilisent deux serveurs ; sur Vercel, ils partagent un domaine.
const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(
  window.location.hostname,
);
const API_URL = isLocalDevelopment
  ? "http://127.0.0.1:8000/articles"
  : "/articles";
const PAGE_SIZE = 20;

let activeTopic = "all";
let articleCards = [];
let nextOffset = 0;
let hasMoreArticles = true;
let isLoadingArticles = false;

// Retire les accents pour que « actualite » trouve aussi « actualité ».
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

// Le flux ne fournit pas encore de catégorie : cette règle simple classe les titres par mots-clés.
function inferTopic(article) {
  const text = normalizeText(`${article.title} ${article.summary || ""}`);

  if (
    /\b(gpt|chatgpt|sora|api|tool|tools|product|launch|release|modele|outil)\b/.test(
      text,
    )
  ) {
    return "tools";
  }

  if (
    /\b(company|business|partner|partnership|funding|investment|enterprise|entreprise|partenariat)\b/.test(
      text,
    )
  ) {
    return "business";
  }

  return "research";
}

// Une carte reste visible si elle correspond à la fois au thème choisi et au texte recherché.
function updateFeed() {
  const searchTerm = normalizeText(searchInput.value.trim());
  let visibleCount = 0;

  articleCards.forEach((article) => {
    const matchesTopic =
      activeTopic === "all" || article.dataset.topic === activeTopic;
    const matchesSearch = normalizeText(article.textContent).includes(searchTerm);
    const isVisible = matchesTopic && matchesSearch;

    article.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  const countKey = visibleCount === 1 ? "feed.count.one" : "feed.count.many";
  articleCount.textContent = i18n.translate(countKey, { count: visibleCount });
  emptyState.hidden = visibleCount > 0;
}

// Construit chaque carte avec les données reçues de l’API, sans injecter de HTML externe.
function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = "article-card";
  card.dataset.topic = inferTopic(article);

  const metadata = document.createElement("div");
  metadata.className = "article-meta";

  const topic = document.createElement("span");
  const topicKeys = {
    research: "topic.research",
    tools: "topic.tools",
    business: "topic.business",
  };
  topic.className = `article-topic topic-${card.dataset.topic}`;
  topic.dataset.topicLabel = topicKeys[card.dataset.topic];
  topic.textContent = i18n.translate(topic.dataset.topicLabel);

  const source = document.createElement("span");
  source.textContent = article.source;
  metadata.append(topic, createSeparator(), source);

  if (article.published_at) {
    const date = new Date(article.published_at);
    if (!Number.isNaN(date.getTime())) {
      const time = document.createElement("time");
      time.dateTime = date.toISOString();
      time.textContent = new Intl.DateTimeFormat(i18n.getLanguage() === "fr" ? "fr-FR" : "en-US", {
        dateStyle: "medium",
      }).format(date);
      metadata.append(createSeparator(), time);
    }
  }

  const title = document.createElement("h3");
  title.textContent = article.title;

  const summary = document.createElement("p");
  summary.className = "article-summary";
  summary.textContent =
    article.summary || i18n.translate("feed.noSummary");

  const actions = document.createElement("div");
  actions.className = "article-actions";

  const detailLink = document.createElement("a");
  detailLink.className = "text-link";
  detailLink.href = `article.html?url=${encodeURIComponent(article.url)}`;
  detailLink.dataset.i18n = "feed.detailLink";
  detailLink.textContent = i18n.translate("feed.detailLink");

  const originalLink = document.createElement("a");
  originalLink.className = "source-link";
  originalLink.href = article.url;
  originalLink.target = "_blank";
  originalLink.rel = "noopener noreferrer";
  originalLink.dataset.i18n = "feed.sourceLink";
  originalLink.textContent = i18n.translate("feed.sourceLink");
  actions.append(detailLink, originalLink);

  card.append(metadata, title, summary, actions);
  return card;
}

// Ajoute un séparateur décoratif entre les informations de la carte.
function createSeparator() {
  const separator = document.createElement("span");
  separator.className = "meta-separator";
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "·";
  return separator;
}

// Demande une page d’articles au backend, puis l’ajoute au fil.
async function loadArticles() {
  if (isLoadingArticles || !hasMoreArticles) {
    return;
  }

  isLoadingArticles = true;
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = i18n.translate("feed.loading");

  try {
    // Une entrée supplémentaire permet de savoir s’il reste une autre page.
    const pageUrl = `${API_URL}?offset=${nextOffset}&limit=${PAGE_SIZE + 1}`;
    const response = await fetch(pageUrl);
    if (!response.ok) {
      let errorDetails = null;
      try {
        errorDetails = await response.json();
      } catch {
        // Certaines erreurs réseau renvoient du texte brut au lieu d’un JSON.
      }
      throw new Error(
        errorDetails?.detail || `L’API a répondu avec le statut ${response.status}.`,
      );
    }

    const articles = await response.json();
    const pageArticles = articles.slice(0, PAGE_SIZE);
    articleList.append(...pageArticles.map(createArticleCard));
    articleCards = Array.from(articleList.querySelectorAll(".article-card"));
    nextOffset += pageArticles.length;
    hasMoreArticles = articles.length > PAGE_SIZE;
    loadMoreButton.hidden = !hasMoreArticles;
    feedStatus.textContent = i18n.translate("feed.loaded", { count: articleCards.length });
    updateFeed();
  } catch (error) {
    if (articleCards.length === 0) {
      const isConnectionError = error instanceof TypeError;
      feedStatus.textContent = isConnectionError
        ? i18n.translate("feed.connectionError")
        : error.message || i18n.translate("feed.loadError");
      articleCount.textContent = i18n.translate("feed.unavailable");
      emptyState.textContent = i18n.translate("feed.loadError");
      emptyState.hidden = false;
    } else {
      feedStatus.textContent = i18n.translate("feed.moreError");
      loadMoreButton.hidden = false;
    }
    console.error("Erreur lors du chargement des actualités :", error);
  } finally {
    isLoadingArticles = false;
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = i18n.translate("feed.loadMore");
  }
}

// Quand un thème est choisi, le script met à jour son apparence et son état accessible.
topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTopic = button.dataset.topic;

    topicButtons.forEach((topicButton) => {
      const isSelected = topicButton === button;
      topicButton.classList.toggle("topic-selected", isSelected);
      topicButton.setAttribute("aria-pressed", String(isSelected));
    });

    updateFeed();
  });
});

// La recherche filtre les cartes pendant la saisie, sans recharger la page quand on valide le formulaire.
searchInput.addEventListener("input", updateFeed);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateFeed();
});

// Charger la suite repasse sur « Tout » pour rendre visibles les nouveaux articles.
loadMoreButton.addEventListener("click", () => {
  activeTopic = "all";

  topicButtons.forEach((button) => {
    const isAllTopics = button.dataset.topic === "all";
    button.classList.toggle("topic-selected", isAllTopics);
    button.setAttribute("aria-pressed", String(isAllTopics));
  });

  updateFeed();
  loadArticles();
});

// Actualise les textes créés par JavaScript lorsque la personne change de langue.
window.addEventListener("languagechange", () => {
  updateFeed();
  articleList.querySelectorAll("[data-topic-label]").forEach((label) => {
    label.textContent = i18n.translate(label.dataset.topicLabel);
  });
  articleList.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = i18n.translate(element.dataset.i18n);
  });
  emptyState.textContent = i18n.translate("feed.empty");
  loadMoreButton.textContent = i18n.translate("feed.loadMore");
  if (articleCards.length > 0) {
    feedStatus.textContent = i18n.translate("feed.loaded", { count: articleCards.length });
  }
});

// Le chargement démarre dès que le script du fil est prêt.
loadArticles();
