import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class ArtistListItem extends CustomListItem {
  get data() {
    return this.dataset.item;
  }

  set data(newValue) {
    this.innerText = newValue.name;
    this.dataset.item = newValue.name;
  }

  constructor() {
    super();
  }
}

customElements.define("artist-list-item", ArtistListItem, { extends: "li" });
