const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#news-search");
const topicButtons = document.querySelectorAll(".topic");
const articleCards = document.querySelectorAll(".article-card");
const articleCount = document.querySelector("#article-count");
const emptyState = document.querySelector("#empty-state");

let activeTopic = "all";

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

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

searchInput.addEventListener("input", updateFeed);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateFeed();
});
