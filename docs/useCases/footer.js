const scriptFooter = document.currentScript;

const containerFooter = scriptFooter.parentElement;
containerFooter.innerHTML = `
  <footer class="footer-container">
    <div class="footer-text">©2026 <a style="color: #e8f2cc" href="#">Daniela</a></div>
  </footer>
  `;
