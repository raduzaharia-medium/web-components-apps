import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class CategoryListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue;

    this.innerHTML = `<img loading="lazy" decoding="async" src="./images/${newValue.toLowerCase()}.svg" />
      <legend>
        <span>${newValue}</span>
      </legend>`;
  }

  constructor() {
    super();
  }
}

customElements.define("category-list-item", CategoryListItem);
