export class DateNavigator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <img id="previousMonth" src="../shared/images/light/left-arrow.svg">
        <select id="month">
            ${Array.from(
              { length: 12 },
              (e, index) => `<option value="${index + 1}">${new Date(2000, index).toLocaleDateString("default", { month: "long" })}</option>`
            ).join("")}
        </select>
        <select id="year">
            ${Array.from({ length: new Date().getFullYear() - 2003 + 2 }, (e, index) => `<option value="${2003 + index}">${2003 + index}</option>`).join("")}
        </select>
        <img id="nextMonth" src="../shared/images/light/right-arrow.svg">`;

    this.querySelector("#year").value = new Date().getFullYear();
    this.querySelector("#month").value = new Date().getMonth() + 1;

    this.querySelector("#year").addEventListener("change", () => {
      const year = parseInt(this.querySelector("#year")?.value ?? new Date().getFullYear());
      const month = parseInt(this.querySelector("#month")?.value ?? new Date().getMonth() + 1);

      this.dispatchEvent(new CustomEvent("date-changed", { bubbles: true, composed: true, detail: { year, month } }));
    });
    document.querySelector("#month").addEventListener("change", () => {
      const year = parseInt(this.querySelector("#year")?.value ?? new Date().getFullYear());
      const month = parseInt(this.querySelector("#month")?.value ?? new Date().getMonth() + 1);

      this.dispatchEvent(new CustomEvent("date-changed", { bubbles: true, composed: true, detail: { year, month } }));
    });
    document.querySelector("#previousMonth").addEventListener("click", () => {
      if (this.querySelector("#month").value === "1") {
        this.querySelector("#month").value = 12;
        this.querySelector("#year").value = parseInt(this.querySelector("#year").value) - 1;
      } else this.querySelector("#month").value = parseInt(this.querySelector("#month").value) - 1;

      const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
      const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);

      this.dispatchEvent(new CustomEvent("date-changed", { bubbles: true, composed: true, detail: { year, month } }));
    });
    this.querySelector("#nextMonth").addEventListener("click", () => {
      if (this.querySelector("#month").value === "12") {
        this.querySelector("#month").value = 1;
        this.querySelector("#year").value = parseInt(this.querySelector("#year").value) + 1;
      } else this.querySelector("#month").value = parseInt(this.querySelector("#month").value) + 1;

      const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
      const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);

      this.dispatchEvent(new CustomEvent("date-changed", { bubbles: true, composed: true, detail: { year, month } }));
    });
  }
}

customElements.define("date-navigator", DateNavigator);
