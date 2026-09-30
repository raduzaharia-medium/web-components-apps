import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./episode-list-item.js";

export class EpisodesSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("list-section");

    this.innerHTML = `
      <item-counter singular="episode" plural="episodes" order="a-z"></item-counter>
      <input name="episodeSearch" type="text" placeholder="search..." />
      <custom-list>
        <template slot="item">
          <episode-list-item></episode-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", () => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
  }
}

customElements.define("episodes-section", EpisodesSection);
