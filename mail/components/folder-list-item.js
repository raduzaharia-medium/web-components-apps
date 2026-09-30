import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class FolderListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.path;
    this.dataset.name = newValue.name;
    this.dataset.path = newValue.path;

    this.style.setProperty("--depth", newValue.depth);
    this.classList.toggle("empty-folder", newValue.emailCount === 0 && newValue.name.toLowerCase() !== "inbox");

    this.querySelector(".label").textContent = newValue.name;
    this.querySelector(".counter").textContent = newValue.unreadCount;
    this.querySelector(".counter").classList.toggle("hidden", newValue.unreadCount === 0);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.querySelector(".label")) return;

    this.innerHTML = `
      <span class="label"></span>
      <span class="counter"></span>`;
  }
}

customElements.define("folder-list-item", FolderListItem);
