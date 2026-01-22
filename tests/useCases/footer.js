// footer.js
(() => {
  const script = document.currentScript;
  if (!script) return;

  const year = new Date().getFullYear();

  const markup = `
    <footer class="site-footer" aria-label="Site footer">
      <div class="site-footer__inner">
        <div class="site-footer__text">©${year} <a class="site-footer__link" href="../Index.html">Daniela</a></div>
      </div>
    </footer>
  `;

  script.insertAdjacentHTML('beforebegin', markup);
  script.remove();
})();
