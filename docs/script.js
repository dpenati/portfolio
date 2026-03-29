// script.js – site behavior with parallax reveal effect

(function () {
  const root = document.documentElement;

  // --- Theme handling ---
  const KEY = 'dp-theme';

  function applyTheme(mode) {
    root.setAttribute('data-theme', mode);

    if (mode === 'dark') root.style.colorScheme = 'dark';
    else if (mode === 'light') root.style.colorScheme = 'light';
    else root.style.colorScheme = 'light dark';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(mode) {
    try {
      localStorage.setItem(KEY, mode);
    } catch {}
  }

  function initTheme() {
    const stored = getStoredTheme();
    const mode = stored || root.getAttribute('data-theme') || 'auto';
    applyTheme(mode);
  }

  function bindThemeToggle() {
    const btn =
      document.querySelector('[data-theme-toggle]') ||
      document.getElementById('themeToggle');

    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'auto';
      const next =
        current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
      applyTheme(next);
      setStoredTheme(next);

      btn.setAttribute('aria-label', `Theme: ${next}`);
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });
  }

  // --- Back to top ---
  function bindBackToTop() {
    const a = document.querySelector('a[href="#top"], a[data-back-to-top]');
    if (!a) return;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    });
  }

  // --- Work Cards Detail Modal ---
  function initWorkCards() {
    const cards = document.querySelectorAll('.work-card');
    const overlay = document.getElementById('workDetailOverlay');
    const detailContent = document.getElementById('workDetailContent');
    const closeBtn = overlay?.querySelector('.work-detail-close');

    if (!overlay || !detailContent || !cards.length) return;

    // Map each card to its *private* case-study page
    const CASE_TARGETS = {
      pipes: './work/24pipes.html',
      canopy: './work/16canopy.html',
      cyber: './work/12cyber.html',
    };

    // Temporarily disable unfinished case studies here
    const DISABLED_CASES = ['cyber'];

    const DEFAULT_TARGET = './work/indexWK.html';

    // Case study data
    const caseStudies = {
      pipes: {
        title: 'Bringing Structure to Enterprise Engineering Workflows',
        meta: {
          role: 'UX Manager',
          domain: 'Enterprise Engineering Platform',
          time: '12-week',
        },
        summary:
          'Re-architected six core engineering workflow domains within a constrained delivery window—introducing discovery-first sequencing to restore predictability and reduce systemic churn across the SDLC.',
      },

      canopy: {
        title: 'Designing a Unified Experience for an Accountable Care Network',
        meta: {
          role: 'Lead UX',
          domain: 'Healthcare & Insurance Integration',
          time: 'Jan-May',
        },
        summary:
          'Led discovery and experience design for a regional Accountable Care Network, unifying clinical and insurance systems into a cohesive patient portal across multiple organizations and regulatory constraints.',
      },

      cyber: {
        title: 'Shifting Enterprise Security Toward an Identity-Centric Model',
        meta: {
          role: 'Principal UX',
          domain: 'Enterprise Cybersecurity',
          time: '2-quarter',
        },
        summary:
          'Reframed enterprise data protection around identity, replacing channel-based incident management with a unified user model that correlated cross-system risk and supported investigative workflows at scale — avoiding costly system re-architecture.',
      },
    };

    function normalizeTargetHref(href) {
      if (!href || typeof href !== 'string') return DEFAULT_TARGET;

      const trimmed = href.trim();
      const allowed = /^\.\/work\/[a-zA-Z0-9_-]+\.html$/;
      if (!allowed.test(trimmed)) return DEFAULT_TARGET;

      return trimmed;
    }

    function buildLoginRedirectUrl(targetHref) {
      const safeTarget = normalizeTargetHref(targetHref);
      const next = encodeURIComponent(safeTarget);
      return `./login.html?next=${next}`;
    }

    function openDetail(cardId) {
      const study = caseStudies[cardId];
      if (!study) {
        console.warn('[work modal] Unknown card id:', cardId);
        const fallbackHref = buildLoginRedirectUrl(DEFAULT_TARGET);
        window.location.href = fallbackHref;
        return;
      }

      const isDisabled = DISABLED_CASES.includes(cardId);
      const mainText = study.summary || '';
      const targetHref = normalizeTargetHref(
        CASE_TARGETS[cardId] || DEFAULT_TARGET,
      );
      const loginHref = buildLoginRedirectUrl(targetHref);

      detailContent.innerHTML = `
      <div class="work-detail-header">
        <h2 class="work-detail-title">${study.title}</h2>
        <div class="work-detail-meta">
          <span><strong>Role:</strong> ${study.meta.role}</span>
          <span><strong>Domain:</strong> ${study.meta.domain}</span>
          <span><strong>Time:</strong> ${study.meta.time}</span>
        </div>
      </div>

      <div class="work-detail-section">
        <h3 class="work-detail-section-title">Summary</h3>
        <div class="work-detail-section-content">
          <p>${mainText}</p>
        </div>
      </div>

      <div class="view-all-work" style="margin-top: 18px;">
        ${
          isDisabled
            ? `<button class="view-all-button" type="button" disabled aria-disabled="true" title="Coming soon">
                 Coming Soon
               </button>`
            : `<button class="view-all-button" type="button" data-work-cta="${loginHref}">
                 View Work →
               </button>`
        }
      </div>
    `;

      const ctaBtn = detailContent.querySelector('[data-work-cta]');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
          const href = ctaBtn.getAttribute('data-work-cta');
          if (href) window.location.href = href;
        });
      }

      overlay.classList.add('is-open');

      const modal = overlay.querySelector('.work-detail-modal');
      if (modal) modal.scrollTop = 0;

      setTimeout(() => {
        overlay.scrollTop = 0;
      }, 10);
    }

    function closeDetail() {
      overlay.classList.remove('is-open');
    }

    cards.forEach((card) => {
      card.setAttribute('tabindex', '0');

      card.addEventListener('click', () => {
        const cardId = card.getAttribute('data-card');
        if (!cardId) {
          console.warn('[work modal] Missing data-card on:', card);
          return;
        }

        setTimeout(() => openDetail(cardId), 300);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const cardId = card.getAttribute('data-card');
          if (!cardId) return;
          openDetail(cardId);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDetail);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDetail();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeDetail();
      }
    });
  }

  // --- Set current year in footer ---
  function setCurrentYear() {
    const yearSpan = document.querySelector('[data-year]');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // --- Send email from EmailJS (safe-guarded) ---
  function bindEmailForm() {
    const form = document.getElementById('contact-form');
    if (!form || typeof emailjs === 'undefined') return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      emailjs.sendForm('service_7p3fahn', 'template_an37vz8', this).then(
        function () {
          alert('Message sent successfully!');
          form.reset();
        },
        function (error) {
          alert('Failed to send message.');
          console.log(error);
        },
      );
    });
  }

  // Init
  initTheme();
  bindThemeToggle();
  bindBackToTop();
  initWorkCards();
  setCurrentYear();
  bindEmailForm();
})();
