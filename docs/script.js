// script.js – minimal site behavior (theme toggle + back-to-top + work cards)
// Keeps the page readable even if JS fails.

(function () {
  const root = document.documentElement;

  // --- Theme handling ---
  // Storage key used by the site
  const KEY = 'dp-theme'; // "light" | "dark" | "auto"

  function applyTheme(mode) {
    // mode can be "light", "dark", or "auto"
    root.setAttribute('data-theme', mode);

    // For browsers that respect color-scheme, mirror intent
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

  // Wire up any theme toggle buttons if present
  // Supports either:
  // - button[data-theme-toggle]
  // - button#themeToggle
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

      // Optional ARIA label updates
      btn.setAttribute('aria-label', `Theme: ${next}`);
    });
  }

  // --- Back to top ---
  function bindBackToTop() {
    const a = document.querySelector('a[href="#top"], a[data-back-to-top]');
    if (!a) return;

    a.addEventListener('click', (e) => {
      // Allow normal anchor behavior, but add smooth scroll
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Keep URL clean by not adding #top to history:
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

    if (!overlay || !detailContent) return;

    // Case study data
    const caseStudies = {
      atlas: {
        title: 'Atlas Discovery & Navigation',
        meta: {
          services: 'UX Research, Information Architecture, Interaction Design',
          industries: 'Financial Services',
          year: '2024',
        },
        challenge:
          'The essential task was to create a unified discovery experience that helps users navigate complex enterprise tools while reducing cognitive load and improving findability across multiple product ecosystems.',
        whatWeDid: [
          'Conducted comprehensive user research to understand navigation pain points and mental models',
          'Designed intuitive search and filtering mechanisms that adapt to user context',
          'Created a scalable taxonomy system that grows with the platform',
          'Implemented progressive disclosure patterns to manage information complexity',
        ],
      },
      ide: {
        title: 'IDE Platform Reframing',
        meta: {
          services: 'Product Strategy, UX Design, Developer Experience',
          industries: 'Technology & Software',
          year: '2023-2024',
        },
        challenge:
          'The challenge was to reimagine a legacy development environment as a modern, extensible platform that empowers developers while maintaining backwards compatibility and minimizing disruption to established workflows.',
        whatWeDid: [
          'Led strategic workshops to align stakeholders on platform vision and priorities',
          'Redesigned core workflows with focus on developer productivity and joy',
          'Created a flexible design system that enables third-party extensions',
          'Established patterns for progressive feature adoption',
        ],
      },
      pipes: {
        title: 'Pipes End-to-End Experience',
        meta: {
          services: 'Service Design, UX Strategy, Process Optimization',
          industries: 'Enterprise Software',
          year: '2023',
        },
        challenge:
          'The essential task was to design a seamless end-to-end experience for data pipeline management, balancing technical complexity with usability while ensuring reliability and visibility across the entire workflow.',
        whatWeDid: [
          'Mapped comprehensive user journeys across all pipeline stages',
          'Designed clear status visualization and error handling patterns',
          'Created unified monitoring and debugging experiences',
          'Implemented feedback loops that reduced time-to-resolution',
        ],
      },
    };

    // Open modal
    function openDetail(cardId) {
      const study = caseStudies[cardId];
      if (!study) return;

      const whatWeDidList = study.whatWeDid
        .map((item) => `<li>${item}</li>`)
        .join('');

      detailContent.innerHTML = `
        <div class="work-detail-header">
          <h2 class="work-detail-title">${study.title}</h2>
          <div class="work-detail-meta">
            <span><strong>Services:</strong> ${study.meta.services}</span>
            <span><strong>Industries:</strong> ${study.meta.industries}</span>
            <span><strong>Year:</strong> ${study.meta.year}</span>
          </div>
        </div>

        <div class="work-detail-section">
          <h3 class="work-detail-section-title">Challenge</h3>
          <div class="work-detail-section-content">
            <p>${study.challenge}</p>
          </div>
        </div>

        <div class="work-detail-section">
          <h3 class="work-detail-section-title">What we did</h3>
          <div class="work-detail-section-content">
            <ul>${whatWeDidList}</ul>
          </div>
        </div>
      `;

      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeDetail() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Bind card clicks - use mousedown/touchstart to not interfere with hover
    cards.forEach((card) => {
      let clickTimer = null;

      card.addEventListener('click', (e) => {
        const cardId = card.getAttribute('data-card');
        if (cardId) {
          // Small delay to allow flip to be seen
          setTimeout(() => {
            openDetail(cardId);
          }, 300);
        }
      });

      // Keyboard accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const cardId = card.getAttribute('data-card');
          if (cardId) openDetail(cardId);
        }
      });

      // Make cards focusable
      card.setAttribute('tabindex', '0');
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDetail);
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeDetail();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeDetail();
      }
    });
  }

  // Init
  initTheme();
  bindThemeToggle();
  bindBackToTop();
  initWorkCards();
})();
