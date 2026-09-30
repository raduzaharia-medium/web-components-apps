import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./email-list-item.js";

export class EmailsSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("list-section");

    this.innerHTML = `
      <item-counter singular="email" plural="emails" order="date"></item-counter>
      <custom-list multi-select="true">
        <template slot="item">
          <email-list-item></email-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;
  }
}

customElements.define("emails-section", EmailsSection);
