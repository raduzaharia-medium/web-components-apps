import { getContacts } from "../scripts/services.js";

import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class ContactsResponsiveNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <responsive-nav options="all,family,friends,work,services,others" value="all"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    this.querySelector("responsive-nav").addEventListener("change", () => {
      this.dispatchEvent(new CustomEvent("category-changed", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("contacts-responsive-nav", ContactsResponsiveNav);
