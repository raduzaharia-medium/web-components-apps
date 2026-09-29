import "../../shared/components/custom-list.js";

import "./expenses-list-item.js";

export class ExpensesCategory extends HTMLElement {
  get data() {
    return {
      title: this.querySelector("input.category-title").value,
      expenses: [...this.querySelectorAll("expenses-list-item")].map((element) => element.data),
    };
  }

  set data(newValue) {
    this.querySelector("input.category-title").value = newValue.title;
    this.querySelector("custom-list").setItems(newValue.expenses);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.querySelector("input")) return;

    this.innerHTML = `
      <input class="category-title" type="text" />
      <custom-list>
        <template slot="item">
          <expenses-list-item></expenses-list-item>
        </template>
      </custom-list>`;
  }
}

customElements.define("expenses-category", ExpensesCategory);
