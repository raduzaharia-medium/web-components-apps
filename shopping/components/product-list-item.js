import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class ProductListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.name;
    this.dataset.category = newValue.category;

    this.innerHTML = `
      <img class="check" src="../shared/images/dark/check.svg" />
      <img class="uncheck" src="../shared/images/dark/uncheck.svg" />

      <span></span>`;
    this.querySelector("span").textContent = newValue.name;
  }

  constructor() {
    super();
  }
}

customElements.define("product-list-item", ProductListItem);
