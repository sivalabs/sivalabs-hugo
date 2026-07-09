(() => {
  const modal = document.querySelector("[data-search-modal]");
  const openButton = document.querySelector("[data-search-open]");
  const closeButtons = document.querySelectorAll("[data-search-close]");
  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("[data-search-input]");
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");
  let previousFocus = null;

  if (!modal || !openButton || !form || !input) {
    return;
  }

  const openModal = () => {
    previousFocus = document.activeElement;
    modal.hidden = false;
    openButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("search-open");
    requestAnimationFrame(() => input.focus());
  };

  const closeModal = () => {
    modal.hidden = true;
    openButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("search-open");
    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    } else {
      openButton.focus();
    }
  };

  openButton.addEventListener("click", openModal);
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      const focusable = Array.from(modal.querySelectorAll(focusableSelector));
      if (!focusable.length) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
