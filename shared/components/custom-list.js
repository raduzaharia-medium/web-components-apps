export class CustomList extends HTMLElement {
  multiselect = true;

  static get observedAttributes() {
    return ["value"];
  }

  get value() {
    return this.getAttribute("value");
  }

  get selectedData() {
    const selection = [...this.querySelectorAll(".custom-list-item")];
    const result = selection.filter((element) => element.isSelected()).map((element) => element.data);

    if (this.getAttribute("multi-select")) return result;
    else return result[0];
  }
  get unselectedData() {
    const selection = [...this.querySelectorAll(".custom-list-item")];
    const result = selection.filter((element) => !element.isSelected()).map((element) => element.data);

    return result;
  }
  get allData() {
    const selection = [...this.querySelectorAll(".custom-list-item")];
    const result = selection.map((element) => element.data);

    return result;
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
  }

  constructor() {
    super();

    this.appendChild(document.createElement("ul"));

    this.addEventListener("click", (e) => {
      const selection = e.target.closest(".custom-list-item");

      if (selection) {
        if (selection.querySelector(".multiselect-target")) {
          if (e.target.classList.contains("multiselect-target")) this.multiselect = true;
          else this.multiselect = false;
        }

        this.value = selection.dataset.item;
      }
    });
  }

  setItems(items) {
    this.clearItems();
    if (items) for (const element of items) this.addItem(element);
  }
  addItem(item) {
    const template = this.querySelector("template") || this.querySelector("slot").assignedNodes()[0];
    const templateNode = template.content.firstElementChild;
    const node = templateNode.cloneNode(true);

    this.querySelector("ul").appendChild(node);
    node.data = item;
  }
  clearItems() {
    this.value = "";
    for (const element of this.querySelectorAll(".custom-list-item")) element.remove();
  }

  selectFirst() {
    const selection = this.querySelector(".custom-list-item");
    if (selection) this.value = selection.dataItem;
  }
  selectLast() {
    const selection = this.querySelector(".custom-list-item:last-child");
    if (selection) this.value = selection.dataItem;
  }
  selectNext() {
    const selection = this.querySelector(".custom-list-item.selected").nextElementSibling;

    if (selection) this.value = selection.dataItem;
    else this.selectFirst();
  }
  selectPrevious() {
    const selection = this.querySelector(".custom-list-item.selected").previousElementSibling;

    if (selection && selection.tagName !== "TEMPLATE") this.value = selection.dataItem;
    else this.selectLast();
  }
  select(dataItem) {
    const selection = this.querySelector(`.custom-list-item[data-item="${dataItem}"]`);
    if (selection) this.value = selection.dataItem;
  }
  clearSelection() {
    this.querySelectorAll(".custom-list-item").forEach((element) => {
      element.deselect();
    });
  }

  filter(word) {
    this.querySelectorAll(".custom-list-item").forEach((element) => {
      if (element.dataItemContains(word)) element.show();
      else element.hide();
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") {
      if (this.getAttribute("multi-select") && this.multiselect) {
        const selection = this.querySelector(`[data-item="${newValue}"]`);
        if (selection) selection.toggleSelect();
      } else {
        [...this.querySelectorAll(".custom-list-item")].filter((element) => element.isSelected()).forEach((element) => element.deselect());

        if (oldValue) {
          const selection = this.querySelector(`[data-item="${oldValue}"]`);
          if (selection) selection.deselect();
        }
        if (newValue) {
          const selection = this.querySelector(`[data-item="${newValue}"]`);
          if (selection) selection.select();
        }
      }

      this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true }));
    }
  }
}

customElements.define("custom-list", CustomList);
