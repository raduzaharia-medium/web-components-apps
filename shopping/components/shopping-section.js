import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./product-list-item.js";

export class ShoppingSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <input name="shoppingInsert" type="text" placeholder="add new..." />
      <custom-list multi-select="true">
        <template slot="item">
          <product-list-item></product-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      const word = this.querySelector("input").value.trim();
      if (!word) return;

      const [first, ...rest] = [...word];

      this.querySelector("custom-list").addItem({ name: `${first.toUpperCase()}${rest.join("")}`, category: "Others" });
      this.querySelector("input").value = "";
    });
  }
}

customElements.define("shopping-section", ShoppingSection);
