import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class VideosResponsiveNav extends HTMLElement {
  categories = ["movies", "shows", "recordings", "programs"];

  get value() {
    return this.querySelector("responsive-nav").value;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.setCategories(this.categories);
  }

  setCategories(categories) {
    this.categories = categories;

    this.innerHTML = `
      <responsive-nav options="${categories.join(",")}" value="${categories[0]}"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    this.querySelector("responsive-nav").addEventListener("change", () => {
      this.dispatchEvent(new CustomEvent("category-changed", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("videos-responsive-nav", VideosResponsiveNav);
