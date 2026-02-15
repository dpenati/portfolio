// script.js — minimal site behavior (theme toggle + back-to-top)
// Keeps the page readable even if JS fails.

(function () {
  const root = document.documentElement;

  // --- Theme handling ---
  // Storage key used by the site
  const KEY = "dp-theme"; // "light" | "dark" | "auto"

  function applyTheme(mode) {
    // mode can be "light", "dark", or "auto"
    root.setAttribute("data-theme", mode);

    // For browsers that respect color-scheme, mirror intent
    if (mode === "dark") root.style.colorScheme = "dark";
    else if (mode === "light") root.style.colorScheme = "light";
    else root.style.colorScheme = "light dark";
  }

  function getStoredTheme() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function setStoredTheme(mode) {
    try { localStorage.setItem(KEY, mode); } catch {}
  }

  function initTheme() {
    const stored = getStoredTheme();
    const mode = stored || root.getAttribute("data-theme") || "auto";
    applyTheme(mode);
  }

  // Wire up any theme toggle buttons if present
  // Supports either:
  // - button[data-theme-toggle]
  // - button#themeToggle
  function bindThemeToggle() {
    const btn =
      document.querySelector("[data-theme-toggle]") ||
      document.getElementById("themeToggle");

    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "auto";
      const next = current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
      applyTheme(next);
      setStoredTheme(next);

      // Optional ARIA label updates
      btn.setAttribute("aria-label", `Theme: ${next}`);
    });
  }

  // --- Back to top ---
  function bindBackToTop() {
    const a = document.querySelector('a[href="#top"], a[data-back-to-top]');
    if (!a) return;

    a.addEventListener("click", (e) => {
      // Allow normal anchor behavior, but add smooth scroll
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Keep URL clean by not adding #top to history:
      history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  }

  // Init
  initTheme();
  bindThemeToggle();
  bindBackToTop();
})();
