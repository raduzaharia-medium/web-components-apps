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
      <custom-list>
        <template slot="item">
          <folder-list-item></folder-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("change", () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        this.dispatchEvent(new CustomEvent("folder-selected", { bubbles: true, composed: true, detail: { ...selection } }));
      }
    });
  }
}

customElements.define("folders-section", FoldersSection);
