import "../../shared/components/responsive-nav.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export class ExpensesResponsiveNav extends HTMLElement {
  month = new Date().getMonth();

  get year() {
    return parseInt(this.querySelector("#years").value);
  }

  constructor() {
    super();
  }

  setYears(years, year) {
    this.innerHTML = `
      <responsive-nav id="years" options="${years.join(",")}" value="${year}"></responsive-nav>
      <responsive-nav id="months" options="${MONTHS.join(",")}" value="${MONTHS[this.month].toLowerCase()}"></responsive-nav>`;

    this.querySelector("#years").addEventListener("change", () => {
      this.dispatchEvent(new CustomEvent("year-changed", { bubbles: true, composed: true }));
    });
    this.querySelector("#months").addEventListener("change", () => {
      this.month = MONTHS.findIndex((month) => month.toLowerCase() === this.querySelector("#months").value);
      this.dispatchEvent(new CustomEvent("month-changed", { bubbles: true, composed: true, detail: this.month }));
    });
  }
}

customElements.define("expenses-responsive-nav", ExpensesResponsiveNav);
