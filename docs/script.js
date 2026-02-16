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
        window.location.pathname + window.location.search
      );
    });
  }

  // --- Login functionality ---
  function initLogin() {
    const brandTrigger = document.querySelector('.brand-trigger');
    const brand = document.querySelector('.brand');
    const loginDropdown = document.getElementById('loginDropdown');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const loginError = document.getElementById('loginError');
    const viewAllWorkBtn = document.getElementById('viewAllWorkBtn');

    // Correct password (change this to your desired password)
    const correctPassword = 'uxleader2024';

    // Mobile: Toggle dropdown on click
    if (brandTrigger && window.innerWidth <= 768) {
      brandTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        loginDropdown.classList.toggle('is-open');
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (loginDropdown && !brand.contains(e.target)) {
        loginDropdown.classList.remove('is-open');
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginDropdown) {
        loginDropdown.classList.remove('is-open');
      }
    });

    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;

        if (password === correctPassword) {
          // Store login state
          sessionStorage.setItem('isLoggedIn', 'true');
          // Redirect to work index
          window.location.href = './work/indexWK.html';
        } else {
          // Show error
          loginError.style.display = 'block';
          passwordInput.value = '';
          passwordInput.focus();

          // Hide error after 3 seconds
          setTimeout(() => {
            loginError.style.display = 'none';
          }, 3000);
        }
      });
    }

    // Handle View All Work button
    if (viewAllWorkBtn) {
      viewAllWorkBtn.addEventListener('click', () => {
        // Check if already logged in
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
          window.location.href = './work/indexWK.html';
        } else {
          // Show login dropdown
          loginDropdown.classList.add('is-open');
          passwordInput.focus();

          // Scroll to top so dropdown is visible
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
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
      
      // Scroll modal content to top
      const modal = overlay.querySelector('.work-detail-modal');
      if (modal) {
        modal.scrollTop = 0;
      }
      
      // Small delay to ensure overlay is rendered, then scroll it to show modal from top
      setTimeout(() => {
        overlay.scrollTop = 0;
      }, 10);
    }

    // Close modal
    function closeDetail() {
      overlay.classList.remove('is-open');
    }

    // Bind card clicks
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const cardId = card.getAttribute('data-card');
        if (cardId) {
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

  // --- Set current year in footer ---
  function setCurrentYear() {
    const yearSpan = document.querySelector('[data-year]');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // Init
  initTheme();
  bindThemeToggle();
  bindBackToTop();
  initLogin();
  initWorkCards();
  setCurrentYear();
})();
