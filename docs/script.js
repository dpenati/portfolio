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

    // Case study data
    // IMPORTANT: keys must match HTML data-card values: pipes, canopy, cyber
    const caseStudies = {
      pipes: {
        title: 'Bringing Structure to Enterprise Engineering Workflows',
        meta: {
          role: 'UX Manager',
          domain: 'Enterprise Engineering Platform',
          year: '2024',
        },
        summary:
          'Re-architected six core engineering workflow domains within a constrained delivery window, sequencing discovery ahead of backend execution to restore predictability and reduce systemic churn across the SDLC — enabling more accurate planning and cross-team alignment at enterprise scale.',
        // Optional:
        // whatWeDid: ['...', '...'],
      },

      canopy: {
        title: 'Designing a Unified Experience for an Accountable Care Network',
        meta: {
          role: 'Lead UX',
          domain: 'Healthcare & Insurance Integration',
          year: '2016',
        },
        summary:
          'Led discovery and experience design for a regional Accountable Care Network, unifying clinical and insurance systems into a cohesive patient portal across multiple organizations and regulatory constraints.',
        // Optional:
        // whatWeDid: ['...', '...'],
      },

      cyber: {
        title: 'Shifting Enterprise Security Toward an Identity-Centric Model',
        meta: {
          role: 'Principal UX',
          domain: 'Enterprise Cybersecurity',
          year: '2012',
        },
        summary:
          'Reframed enterprise data protection around identity, replacing channel-based incident management with a unified user model that correlated cross-system risk and supported investigative workflows at scale — avoiding costly system re-architecture.',
        // Optional:
        // whatWeDid: ['...', '...'],
      },
    };

    function openDetail(cardId) {
      const study = caseStudies[cardId];
      if (!study) return;

      const mainText = study.summary || study.challenge || '';

      const whatWeDidHtml =
        Array.isArray(study.whatWeDid) && study.whatWeDid.length
          ? `
            <div class="work-detail-section">
              <h3 class="work-detail-section-title">What we did</h3>
              <div class="work-detail-section-content">
                <ul>${study.whatWeDid.map((item) => `<li>${item}</li>`).join('')}</ul>
              </div>
            </div>
          `
          : '';

      detailContent.innerHTML = `
        <div class="work-detail-header">
          <h2 class="work-detail-title">${study.title}</h2>
          <div class="work-detail-meta">
            <span><strong>Role:</strong> ${study.meta.role}</span>
            <span><strong>Domain:</strong> ${study.meta.domain}</span>
            <span><strong>Year:</strong> ${study.meta.year}</span>
          </div>
        </div>

        <div class="work-detail-section">
          <h3 class="work-detail-section-title">Summary</h3>
          <div class="work-detail-section-content">
            <p>${mainText}</p>
          </div>
        </div>

        ${whatWeDidHtml}
      `;

      overlay.classList.add('is-open');

      // Scroll modal content to top
      const modal = overlay.querySelector('.work-detail-modal');
      if (modal) modal.scrollTop = 0;

      // Ensure overlay is at top (some browsers keep previous scroll position)
      setTimeout(() => {
        overlay.scrollTop = 0;
      }, 10);
    }

    function closeDetail() {
      overlay.classList.remove('is-open');
    }

    // Bind card clicks
    cards.forEach((card) => {
      // Make cards focusable (keyboard)
      card.setAttribute('tabindex', '0');

      card.addEventListener('click', () => {
        const cardId = card.getAttribute('data-card');
        if (!cardId) return;

        // Respect your flip animation timing
        setTimeout(() => openDetail(cardId), 300);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const cardId = card.getAttribute('data-card');
          if (cardId) openDetail(cardId);
        }
      });
    });

    // Close button
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);

    // Close on overlay click (only when clicking the dark backdrop)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDetail();
    });

    // Close on Escape key
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
