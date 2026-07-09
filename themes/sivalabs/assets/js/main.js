(() => {
  const modal = document.querySelector("[data-search-modal]");
  const openButton = document.querySelector("[data-search-open]");
  const closeButtons = document.querySelectorAll("[data-search-close]");
  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("[data-search-input]");

  if (!modal || !openButton || !form || !input) {
    return;
  }

  const openModal = () => {
    modal.hidden = false;
    document.body.classList.add("search-open");
    requestAnimationFrame(() => input.focus());
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("search-open");
    openButton.focus();
  };

  openButton.addEventListener("click", openModal);
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const keywords = input.value.trim();
    if (!keywords) {
      input.focus();
      return;
    }
    const query = encodeURIComponent(`site:sivalabs.in ${keywords}`);
    window.location.href = `https://www.google.com/search?q=${query}`;
  });
})();
