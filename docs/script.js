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
   BULLET -> IMAGE SWAP (E + F)
   - Hover/focus on bullet activates matching image
========================================================= */

(function () {
  const list = document.getElementById('bulletList');
  const panel = document.getElementById('imagePanel');
  if (!list || !panel) return;

  const items = Array.from(list.querySelectorAll('.bulletList__item'));
  const frames = Array.from(panel.querySelectorAll('.imagePanel__frame'));

  function activate(imgId) {
    items.forEach((el) =>
      el.classList.toggle('is-active', el.dataset.img === imgId),
    );
    frames.forEach((el) =>
      el.classList.toggle('is-active', el.dataset.img === imgId),
    );
  }

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => activate(item.dataset.img));
    item.addEventListener('focus', () => activate(item.dataset.img));
    item.addEventListener('click', () => activate(item.dataset.img));

    item.addEventListener('keydown', (e) => {
      const idx = items.indexOf(item);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[Math.min(idx + 1, items.length - 1)];
        next.focus();
        activate(next.dataset.img);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[Math.max(idx - 1, 0)];
        prev.focus();
        activate(prev.dataset.img);
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(item.dataset.img);
      }
    });
  });
})();
