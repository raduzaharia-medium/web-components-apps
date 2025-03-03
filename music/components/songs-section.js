import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./song-list-item.js";

export class SongsSection extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
        <item-counter singular="song" plural="songs" order="album"></item-counter>
        <span class="subtitle"></span>
        <input type="text" placeholder="search..." />
        <custom-list class="full-screen">
          <template slot="item">
            <song-list-item></song-list-item>
          </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        document.body.classList.add("song-selected");
      }
    });
  }
}

customElements.define("songs-section", SongsSection);
