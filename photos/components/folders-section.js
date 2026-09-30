import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./folder-list-item.js";

export class FoldersSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("list-section");

    this.innerHTML = `
      <item-counter singular="folder" plural="folders" order="a-z"></item-counter>
      <input name="folderSearch" type="text" placeholder="search..." />
      <custom-list>
        <template slot="item">
          <folder-list-item></folder-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("input").addEventListener("keyup", () => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        this.dispatchEvent(new CustomEvent("group-selected", { bubbles: true, composed: true, detail: { ...selection } }));
      }
    });
  }
}

customElements.define("folders-section", FoldersSection);
