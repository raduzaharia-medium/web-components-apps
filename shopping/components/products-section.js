import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./product-list-item.js";

export class ProductsSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <custom-list multi-select="true">
        <template slot="item">
          <product-list-item></product-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;
  }
}

customElements.define("products-section", ProductsSection);
