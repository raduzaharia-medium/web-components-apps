import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class FeedListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.title;
    this.dataset.title = newValue.title;
    this.dataset.url = newValue.url;
    this.dataset.unreadCount = 0;

    this.title = newValue.title;
    this.innerHTML = `<span class="title">${newValue.title}</span>
      <span class="counter">0</span>`;
  }

  constructor() {
    super();
  }
}

customElements.define("feed-list-item", FeedListItem);
