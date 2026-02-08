// header.js
(() => {
  const script = document.currentScript;
  if (!script) return;

  // Optional: allow per-page title override via data-title
  const pageTitle = (script.dataset.title || '').trim();
  if (pageTitle) document.title = pageTitle;

  const markup = `
    <div id="header-container">
      <a class="skip-link" href="#main">Skip to content</a>

      <!-- ====================== TOPBAR ====================== -->
      <header class="topbar" role="banner" aria-label="Site header">
        <div class="topbar-inner">
          <div class="masthead-left">
            <!-- Exit /useCases folder to reach top-level pages -->
            <a class="masthead-title" href="../Index.html" aria-label="Home">
              .<span class="logo-accent">DaNiela</span>.
            </a>
          </div>

          <nav class="masthead-right" aria-label="Site navigation">
            <a class="masthead-link" href="../About.html">About</a>
            <a class="masthead-link" href="../UseCases.html">Use Cases</a>
            <a class="masthead-link" href="../Notes.html">Notes</a>
          </nav>
        </div>

        <div class="topbar-nav" aria-label="On-page sections">
          <div class="nav-wrap">
            <div class="nav-kicker">Sections</div>
            <nav class="nav" aria-label="On-page navigation">
              <a href="#context">Context</a>
              <a href="#approach">Approach</a>
              <a href="#execution">Execution</a>
              <a href="#impact">Impact</a>
              <a href="#reflection">Reflection</a>
            </nav>
          </div>
        </div>
      </header>
    </div>
  `;

  // Insert header before the script tag, then remove the script tag
  script.insertAdjacentHTML('beforebegin', markup);
  script.remove();
})();
