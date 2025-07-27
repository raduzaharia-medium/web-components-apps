import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./contact-list-item.js";
import { getContacts } from "../scripts/services.js";

export class ContactsSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <item-counter singular="contact" plural="contacts" order="a-z"></item-counter>
      <input type="text" placeholder="search..." />
      <custom-list class="full-screen">
        <template slot="item">
          <contact-list-item></contact-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        this.dispatchEvent(new CustomEvent("contact-selected", { bubbles: true, composed: true, detail: selection }));
      }
    });

    const category = document.querySelector("contacts-responsive-nav").value;
    const contacts = getContacts(category);

    this.querySelector("custom-list").setItems(contacts);
    this.querySelector("item-counter").value = contacts.length;
  }
}

customElements.define("contacts-section", ContactsSection);
