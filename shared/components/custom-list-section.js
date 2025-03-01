import { CustomList } from "/shared/components/custom-list.js";
import { CustomListItem } from "/shared/components/custom-list-item.js";
import { CustomListSkeleton } from "/shared/components/custom-list-skeleton.js";
import { ItemCounter } from "/shared/components/item-counter.js";
import { ActionInput } from "/shared/components/action-input.js";

export class CustomListSection extends HTMLElement {
  get singular() {
    return this.getAttribute("singular");
  }
  get plural() {
    return this.getAttribute("plural");
  }
  get order() {
    return this.getAttribute("order");
  }

  get selectedData() {
    return this.querySelector("ul").selectedData;
  }
  get allData() {
    return this.querySelector("ul").allData;
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/shared/components/custom-list.css" />
      <link rel="stylesheet" href="/shared/components/custom-list-item.css" />
      <link rel="stylesheet" href="/shared/components/item-counter.css" />
      <link rel="stylesheet" href="/shared/components/action-input.css" />

      <link rel="stylesheet" href="/shared/styles/generic-ui.css" />
      <link rel="stylesheet" href="/shared/styles/loaders.css" />

      <div is="item-counter" singular="${this.singular}" plural="${this.plural}" order="${this.order}"></item-counter>
      <action-input placeholder="search..." trigger="any"></action-input>
      <custom-list>
        <slot name="item"></slot>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    `;

    this.shadowRoot.querySelector("action-input").addEventListener("action", () => {
      document.querySelector("ul").filter(document.querySelector("action-input").value);
    });
  }

  clearItems() {
    this.shadowRoot.querySelector("item-counter").value = 0;
    this.shadowRoot.querySelector("ul").clearItems();
  }
  setItems(items, selectFirst) {
    this.shadowRoot.querySelector("item-counter").value = items.length;
    this.shadowRoot.querySelector("ul").setItems(items);

    if (selectFirst) this.shadowRoot.querySelector("ul").selectFirst();
  }
}

customElements.define("custom-list-section", CustomListSection, { extends: "section" });
