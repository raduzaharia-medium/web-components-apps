import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class GroupListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.location;
    this.dataset.name = newValue.name;
    this.dataset.location = newValue.location;

    this.textContent = newValue.name;
  }

  constructor() {
    super();
  }
}

customElements.define("group-list-item", GroupListItem);
