// Ces sélecteurs relient le script aux champs, boutons et zones du fil.
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#news-search");
const topicButtons = document.querySelectorAll(".topic");
const articleList = document.querySelector("#article-list");
const articleCount = document.querySelector("#article-count");
const emptyState = document.querySelector("#empty-state");
const feedStatus = document.querySelector("#feed-status");
const loadMoreButton = document.querySelector("#load-more");

// L’API tourne sur le port 8000 pendant le développement local.
const API_URL = "http://127.0.0.1:8000/articles";
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

  const plural = visibleCount === 1 ? "actualité" : "actualités";
  articleCount.textContent = `${visibleCount} ${plural}`;
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
  const topicLabels = {
    research: "Recherche",
    tools: "Outils",
    business: "Entreprises",
  };
  topic.className = `article-topic topic-${card.dataset.topic}`;
  topic.textContent = topicLabels[card.dataset.topic];

  const source = document.createElement("span");
  source.textContent = article.source;
  metadata.append(topic, createSeparator(), source);

  if (article.published_at) {
    const date = new Date(article.published_at);
    if (!Number.isNaN(date.getTime())) {
      const time = document.createElement("time");
      time.dateTime = date.toISOString();
      time.textContent = new Intl.DateTimeFormat("fr-FR", {
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
    article.summary || "Aucun résumé n’est disponible pour cet article.";

  const actions = document.createElement("div");
  actions.className = "article-actions";
  const originalLink = document.createElement("a");
  originalLink.className = "text-link";
  originalLink.href = article.url;
  originalLink.target = "_blank";
  originalLink.rel = "noopener noreferrer";
  originalLink.textContent = "Lire l’article original →";
  actions.append(originalLink);

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
  loadMoreButton.textContent = "Chargement…";

  try {
    // Une entrée supplémentaire permet de savoir s’il reste une autre page.
    const pageUrl = `${API_URL}?offset=${nextOffset}&limit=${PAGE_SIZE + 1}`;
    const response = await fetch(pageUrl);
    if (!response.ok) {
      throw new Error(`L’API a répondu avec le statut ${response.status}.`);
    }

    const articles = await response.json();
    const pageArticles = articles.slice(0, PAGE_SIZE);
    articleList.append(...pageArticles.map(createArticleCard));
    articleCards = Array.from(articleList.querySelectorAll(".article-card"));
    nextOffset += pageArticles.length;
    hasMoreArticles = articles.length > PAGE_SIZE;
    loadMoreButton.hidden = !hasMoreArticles;
    feedStatus.textContent = `${articleCards.length} actualité(s) chargée(s) depuis OpenAI News.`;
    updateFeed();
  } catch (error) {
    if (articleCards.length === 0) {
      feedStatus.textContent =
        "Impossible de charger les actualités. Vérifie que le backend FastAPI est lancé sur http://127.0.0.1:8000.";
      articleCount.textContent = "Indisponible";
      emptyState.textContent = "Le fil n’a pas pu être chargé.";
      emptyState.hidden = false;
    } else {
      feedStatus.textContent = "Impossible de charger la suite. Tu peux réessayer.";
      loadMoreButton.hidden = false;
    }
    console.error("Erreur lors du chargement des actualités :", error);
  } finally {
    isLoadingArticles = false;
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Charger la suite";
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

// Le chargement démarre dès que le script du fil est prêt.
loadArticles();
