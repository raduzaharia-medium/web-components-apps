export class CustomListItem extends HTMLLIElement {
  get data() {
    return this.dataset;
  }
  get dataItem() {
    return this.dataset.item;
  }

  set data(newValue) {
    this.innerText = newValue;
    this.dataset.item = newValue;
  }

  constructor() {
    super();
    this.classList.add("custom-list-item");
  }

  select() {
    this.classList.add("selected");
  }
  deselect() {
    this.classList.remove("selected");
  }
  isSelected() {
    return this.classList.contains("selected");
  }
  toggleSelect() {
    this.classList.toggle("selected");
  }

  hide() {
    this.classList.add("hidden");
  }
  show() {
    this.classList.remove("hidden");
  }
  isHidden() {
    return this.classList.contains("hidden");
  }

  dataItemContains(word) {
    return this.dataItem.toLowerCase().indexOf(word.toLowerCase()) !== -1;
  }
}

customElements.define("custom-list-item", CustomListItem, { extends: "li" });
