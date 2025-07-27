import "./calendar-day.js";
import "./calendar-event.js";

export class CalendarGrid extends HTMLElement {
  constructor() {
    super();

    const year = parseInt(document.querySelector("date-navigator #year").value ?? new Date().getFullYear());
    const month = parseInt(document.querySelector("date-navigator #month").value ?? new Date().getMonth() + 1);

    const numberOfDays = new Date(year, month, 0).getDate();
    const startingDayOfWeek = new Date(year, month - 1, 1).getDay() || 7;

    this.innerHTML = `
      ${Array.from({ length: startingDayOfWeek - 1 }, () => '<calendar-day class="invalid"></calendar-day>').join("")}
      ${Array.from(
        { length: numberOfDays },
        (e, index) =>
          `<calendar-day class="valid" 
            data-year="${this.dataset.year ?? new Date().getFullYear()}" 
            data-month="${this.dataset.month ?? new Date().getMonth() + 1}" 
            data-day="${index + 1}"></calendar-day>`
      ).join("")}`;
  }
}

customElements.define("calendar-grid", CalendarGrid);
