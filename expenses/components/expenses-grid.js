import "./expenses-category.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export class ExpensesGrid extends HTMLElement {
  activeMonth = new Date().getMonth();

  get data() {
    return {
      categories: [...this.querySelectorAll("expenses-category")].map((element) => element.data),
      year: parseInt(this.dataset.year),
    };
  }

  set data(newValue) {
    this.dataset.year = newValue.year;

    this.querySelectorAll("expenses-category").forEach((element) => element.remove());
    for (const category of newValue.categories) this.addCategory(category);

    this.updateTotals();
    this.setActiveMonth(this.activeMonth);
  }

  constructor() {
    super();

    this.addEventListener("change", (e) => {
      const target = e.target;

      if (target.matches("custom-list")) {
        this.querySelectorAll("custom-list").forEach((element) => {
          if (element !== target) element.clearSelection();
        });
      } else if (target.matches("input.category-title")) {
        this.mergeCategories(target.closest("expenses-category"));
      } else if (target.matches("input")) {
        if (target.matches("input[type='tel']")) this.updateTotals();

        target.nextElementSibling?.focus();
      }
    });
  }

  connectedCallback() {
    if (this.querySelector("header")) return;

    this.innerHTML = `
      <header>
        <span></span>
        ${MONTHS.map((month) => `<span class="month"><strong>${month}</strong><p></p></span>`).join("")}
      </header>

      <div class="categories"></div>`;
  }

  addCategory(category) {
    const element = document.createElement("expenses-category");

    this.querySelector(".categories").appendChild(element);
    element.data = category;

    return element;
  }

  addNewRow() {
    const category = this.addCategory({
      title: "New category...",
      expenses: [{ title: "New item...", paid: Array(12).fill("Pending") }],
    });

    this.setActiveMonth(this.activeMonth);
    category.scrollIntoView({ block: "nearest" });
    category.querySelector("input.category-title").select();
  }

  removeSelectedRow() {
    const selection = this.querySelector("expenses-list-item.selected");
    if (!selection) return;

    const category = selection.closest("expenses-category");

    if (category.querySelectorAll("expenses-list-item").length === 1) category.remove();
    else selection.remove();

    this.updateTotals();
  }

  mergeCategories(category) {
    const title = category.querySelector("input.category-title").value;
    const matches = [...this.querySelectorAll("expenses-category")].filter((element) => element.querySelector("input.category-title").value === title);
    const target = matches[0];

    for (const element of matches.slice(1)) {
      target.querySelector("custom-list ul").append(...element.querySelectorAll("expenses-list-item"));
      element.remove();
    }

    target.querySelector("input.item-title")?.focus();
  }

  setActiveMonth(month) {
    this.activeMonth = month;

    this.querySelectorAll(".active-month").forEach((element) => element.classList.remove("active-month"));
    this.querySelectorAll("header span.month")[month]?.classList.add("active-month");
    this.querySelectorAll("expenses-list-item").forEach((element) => {
      element.querySelectorAll("input[type='tel']")[month]?.classList.add("active-month");
    });
  }

  updateTotals() {
    const totals = Array(12).fill(0);

    for (const item of this.querySelectorAll("expenses-list-item")) {
      item.data.paid.forEach((paid, index) => (totals[index] += paid.value ?? 0));
    }

    this.querySelectorAll("header span.month p").forEach((element, index) => (element.innerText = `${totals[index]} RON`));
  }
}

customElements.define("expenses-grid", ExpensesGrid);
