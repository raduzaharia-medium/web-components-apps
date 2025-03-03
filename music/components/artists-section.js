import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./artist-list-item.js";

export class ArtistsSection extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <item-counter singular="artist" plural="artists" order="a-z"></item-counter>
      <input type="text" placeholder="search..." />
      <custom-list class="full-screen">
        <template slot="item">
          <artist-list-item></artist-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", () => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").value;

      if (selection) {
        document.body.classList.add("artist-selected");
        document.querySelector("selected-item-nav").value = selection;
      }
    });
  }
}

customElements.define("artists-section", ArtistsSection);
