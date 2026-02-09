/* =========================================================
   THEME TOGGLE
   - data-theme: "light" | "dark" | "auto"
   - Stores explicit choice in localStorage
========================================================= */

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getSavedTheme() {
    return localStorage.getItem('dp_theme'); // "light" | "dark" | "auto" | null
  }

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    localStorage.setItem('dp_theme', mode);

    if (toggle) {
      const pressed =
        mode === 'dark' || (mode === 'auto' && getSystemTheme() === 'dark');
      toggle.setAttribute('aria-pressed', String(pressed));
    }
  }

  function initTheme() {
    const saved = getSavedTheme();
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      setTheme(saved);
      return;
    }
    setTheme('auto');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'auto';
      const next =
        current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
      setTheme(next);
    });
  }

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', () => {
      if ((root.getAttribute('data-theme') || 'auto') === 'auto') {
        setTheme('auto');
      }
    });
  }

  initTheme();
})();

/* =========================================================
   PILLARS HOVER SWAP (D + E + F)
   - Uses data-index on .bulletList__item and .imagePanel__frame
   - Keeps exactly one active bullet + one active frame
   - Marks loaded frames (optional)
========================================================== */
(() => {
  const root = document.querySelector('#pillars');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.bulletList__item'));
  const frames = Array.from(root.querySelectorAll('.imagePanel__frame'));

  const setActive = (index) => {
    items.forEach((el) =>
      el.classList.toggle('is-active', el.dataset.index === String(index)),
    );
    frames.forEach((el) =>
      el.classList.toggle('is-active', el.dataset.index === String(index)),
    );
  };

  // Ensure starting state is consistent
  const firstActive =
    items.find((el) => el.classList.contains('is-active')) || items[0];
  if (firstActive) setActive(firstActive.dataset.index ?? 0);

  // Hover/focus behavior
  items.forEach((item) => {
    const idx = item.dataset.index;

    item.addEventListener('mouseenter', () => setActive(idx));
    item.addEventListener('focus', () => setActive(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(idx);
      }
    });
  });

  // Loaded handling
  frames.forEach((frame) => {
    const shot = frame.querySelector('.shotFrame');
    const img = frame.querySelector('.shotFrame__img');
    if (!shot || !img) return;

    const markLoaded = () => shot.classList.add('is-loaded');

    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
    }
  });
})();
