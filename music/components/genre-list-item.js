import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class GenreListItem extends CustomListItem {
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

customElements.define("genre-list-item", GenreListItem, { extends: "li" });
