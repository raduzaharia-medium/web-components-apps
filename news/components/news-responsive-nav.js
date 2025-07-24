import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class NewsResponsiveNav extends HTMLElement {
  get value() {
    return this.querySelector("responsive-nav").value;
  }

  constructor() {
    super();
    this.classList.add("news-responsive-nav");
  }

  connectedCallback() {
    this.innerHTML = `
      <responsive-nav options="all,curiosity,general,local,technology" value="all"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    this.querySelector("responsive-nav").addEventListener("change", () => {
      this.dispatchEvent(new CustomEvent("category-changed", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("news-responsive-nav", NewsResponsiveNav);
