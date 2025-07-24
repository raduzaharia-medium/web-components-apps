import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./article-list-item.js";

export class ArticlesSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <item-counter singular="article" plural="articles" order="a-z"></item-counter>
      <input name="articleSearch" type="text" placeholder="search..." />
      <custom-list class="full-screen">
        <template slot="item">
          <article-list-item></article-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        this.dispatchEvent(new CustomEvent("article-changed", { bubbles: true, composed: true, detail: selection }));
      }
    });
  }
}

customElements.define("articles-section", ArticlesSection);
