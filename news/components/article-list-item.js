import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class ArticleListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.title;
    this.dataset.description = newValue.description;
    this.dataset.link = newValue.link;
    this.dataset.guid = newValue.guid;

    this.innerHTML = `<details>
      <summary>
        🗞️
        <span>${newValue.title}</span>
        <a target="_blank" href="${newValue.link}"><img src="../../shared/images/dark/link.svg"></a>
      </summary>
      <section>${newValue.description}</section>
    </details>`;
  }

  constructor() {
    super();
  }
}

customElements.define("article-list-item", ArticleListItem);
