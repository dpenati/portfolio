const script = document.currentScript;
  // const title = script.getAttribute("data-title") || "Use Case";

  const container = script.parentElement;
  container.innerHTML = `
    <div id="header-container">
    <a class="skip-link" href="#main">Skip to content</a>

    <!-- ====================== TOPBAR (INTERNAL) ====================== -->
    <div class="topbar">
      <div class="topbar-inner" role="banner" aria-label="Site header">
        <div class="masthead-left">
          <!-- Exit /UseCases folder to reach top-level pages -->
          <a class="masthead-title" href="../Index.html" aria-label="Home">.<span class="logo-accent">DaNiela</span>.</a>
        </div>

        <nav class="masthead-right" aria-label="Site navigation">
          <a class="masthead-link" href="../About.html">About</a>
          <a class="masthead-link" href="../UseCases.html">Use Cases</a>
          <a class="masthead-link" href="../Notes.html">Notes</a>
        </nav>
      </div>

      <div class="topbar-nav">
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
    </div>
    </div>
  `;
