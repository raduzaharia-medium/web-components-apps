import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./album-list-item.js";

export class AlbumsSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("list-section");

    this.innerHTML = `
      <item-counter singular="album" plural="albums" order="date added"></item-counter>
      <input type="text" placeholder="search..." />
      <custom-list>
        <template slot="item">
          <album-list-item></album-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        document.body.classList.add("album-selected");
        document.querySelector("selected-item-nav").value = selection.item;
      }
    });
  }
}

customElements.define("albums-section", AlbumsSection);
