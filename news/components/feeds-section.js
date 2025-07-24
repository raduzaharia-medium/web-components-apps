import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./feed-list-item.js";

export class FeedsSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <item-counter singular="feed" plural="feeds" order="a-z"></item-counter>
      <input name="feedSearch" type="text" placeholder="search..." />
      <custom-list class="full-screen">
        <template slot="item">
          <feed-list-item></feed-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        this.dispatchEvent(new CustomEvent("feed-changed", { bubbles: true, composed: true, detail: selection }));
      }
    });
  }
}

customElements.define("feeds-section", FeedsSection);
