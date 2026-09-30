import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import "./photo-list-item.js";

export class PhotosSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("list-section");

    this.innerHTML = `
      <item-counter singular="photo" plural="photos" order="date"></item-counter>
      <custom-list>
        <template slot="item">
          <photo-list-item></photo-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>`;
  }
}

customElements.define("photos-section", PhotosSection);
