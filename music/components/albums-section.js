import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./album-list-item.js";

export class AlbumsSection extends HTMLElement {
  get selection() {
    return this.querySelector("custom-list").value;
  }
  get selectedData() {
    return this.querySelector("custom-list").selectedData;
  }

  constructor() {
    super();

    this.innerHTML = `
        <item-counter singular="album" plural="albums" order="date added"></item-counter>
        <input id="albumFilter" type="text" placeholder="search..." />
        <custom-list id="albumList" class="full-screen">
          <template slot="item">
            <album-list-item></album-list-item>
          </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        document.querySelector("selected-item-nav").value = selection.item;

        this.dispatchEvent(new Event("change"));
      }
    });
  }
}

customElements.define("albums-section", AlbumsSection);
