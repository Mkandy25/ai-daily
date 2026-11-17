// Ces sélecteurs relient le script aux champs, boutons et cartes définis dans index.html.
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#news-search");
const topicButtons = document.querySelectorAll(".topic");
const articleCards = document.querySelectorAll(".article-card");
const articleCount = document.querySelector("#article-count");
const emptyState = document.querySelector("#empty-state");

let activeTopic = "all";

// Retire les accents pour que « actualite » trouve aussi « actualité ».
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
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
