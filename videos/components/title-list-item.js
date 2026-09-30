import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class TitleListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.name;
    this.dataset.name = newValue.name;
    this.dataset.category = newValue.category;

    this.textContent = newValue.name;
  }

  constructor() {
    super();
  }
}

customElements.define("title-list-item", TitleListItem);
