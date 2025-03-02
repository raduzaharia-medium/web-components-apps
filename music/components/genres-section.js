import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./genre-list-item.js";

export class GenresSection extends HTMLElement {
  get selection() {
    return this.querySelector("custom-list").value;
  }
  get selectedData() {
    return this.querySelector("custom-list").selectedData;
  }

  constructor() {
    super();

    this.innerHTML = `
        <item-counter id="genreCount" singular="genre" plural="genres" order="a-z"></item-counter>
        <input id="genreFilter" type="text" placeholder="search..." />
        <custom-list id="genreList" class="full-screen">
            <template slot="item">
                <genre-list-item></genre-list-item>
            </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").value;

      if (selection) {
        document.querySelector("body").classList.add("genre-selected");
        document.querySelector("selected-item-nav").value = selection;

        this.dispatchEvent(new Event("change"));
      }
    });
  }
}

customElements.define("genres-section", GenresSection);
