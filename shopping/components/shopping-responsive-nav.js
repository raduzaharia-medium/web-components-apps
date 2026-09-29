import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class ShoppingResponsiveNav extends HTMLElement {
  get value() {
    return this.querySelector("responsive-nav").value;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <responsive-nav options="planning,shopping" value="planning"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    this.querySelector("responsive-nav").addEventListener("change", () => {
      this.dispatchEvent(new CustomEvent("mode-changed", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("shopping-responsive-nav", ShoppingResponsiveNav);
