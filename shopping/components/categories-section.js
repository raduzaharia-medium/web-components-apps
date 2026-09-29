import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./category-list-item.js";

export class CategoriesSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <custom-list>
        <template slot="item">
          <category-list-item></category-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("change", () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        this.dispatchEvent(new CustomEvent("category-selected", { bubbles: true, composed: true, detail: selection.item }));
      }
    });
  }
}

customElements.define("categories-section", CategoriesSection);
