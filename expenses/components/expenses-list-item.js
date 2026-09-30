import { CustomListItem } from "../../shared/components/custom-list-item.js";

let nextId = 0;

export class ExpensesListItem extends CustomListItem {
  get data() {
    return {
      title: this.querySelector("input.item-title").value,
      paid: [...this.querySelectorAll("input[type='tel']")].map((element) => {
        if (element.dataset.paid) return element.dataset.paid;
        if (element.classList.contains("not-available")) return "Inactive";
        if (element.value === "") return "Pending";

        return { value: parseInt(element.value) };
      }),
    };
  }

  set data(newValue) {
    const itemValues = [...this.querySelectorAll("input[type='tel']")];

    this.dataset.item = `expenses-item-${nextId++}`;
    this.querySelector("input.item-title").value = newValue.title;

    for (let i = 0; i < 12; i++) {
      const paid = newValue.paid[i];

      if (paid === "Inactive" || paid === "NotDue" || paid === "Unknown") {
        itemValues[i].classList.add("not-available");

        // keep the original state so saving does not turn it into "Inactive"
        if (paid !== "Inactive") itemValues[i].dataset.paid = paid;
      } else if (paid?.value !== undefined) {
        if (paid.value === 0) itemValues[i].classList.add("zero");
        itemValues[i].value = `${paid.value} RON`;
      }
    }
  }

  constructor() {
    super();

    this.addEventListener("change", (e) => {
      if (e.target.matches("input[type='tel']")) this.formatCell(e.target);
    });
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.querySelector("input")) return;

    this.innerHTML = `
      <input class="item-title" type="text" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />
      <input type="tel" />`;
  }

  formatCell(cell) {
    const value = parseInt(cell.value);

    delete cell.dataset.paid;
    cell.classList.remove("zero", "not-available");

    if (value) cell.value = `${value} RON`;
    else if (value === 0) {
      cell.value = `${value} RON`;
      cell.classList.add("zero");
    } else if (cell.value !== "") {
      cell.value = "";
      cell.classList.add("not-available");
    }
  }
}

customElements.define("expenses-list-item", ExpensesListItem);
