// components/site-header.js
// Lightweight "component" that loads header markup into <site-header>
// Keeps your existing CSS working by injecting into the light DOM (no Shadow DOM).

async function loadFragment(el, url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  el.innerHTML = await res.text();
}

class SiteHeader extends HTMLElement {
  async connectedCallback() {
    if (this.dataset.loaded === "true") return;
    const src = this.getAttribute("src") || "./components/header.html";
    await loadFragment(this, src);
    this.dataset.loaded = "true";
  }
}

customElements.define("site-header", SiteHeader);
