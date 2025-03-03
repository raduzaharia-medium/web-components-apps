import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./genre-list-item.js";

export class GenresSection extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
        <item-counter singular="genre" plural="genres" order="a-z"></item-counter>
        <input type="text" placeholder="search..." />
        <custom-list class="full-screen">
          <template slot="item">
            <genre-list-item></genre-list-item>
          </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        document.body.classList.add("genre-selected");
        document.querySelector("selected-item-nav").value = selection.item;
      }
    });
  }
}

customElements.define("genres-section", GenresSection);
