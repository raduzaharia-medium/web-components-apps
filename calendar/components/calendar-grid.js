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

    // this.addEventListener("click", (e) => {
    //   const selection = e.target.closest("li");

    //   document.body.innerHTML = `<event-section></event-section>`;

    //   document.querySelector(".event-calendar").value = selection.dataset.calendar;
    //   document.querySelector(".event-summary").value = selection.dataset.summary;
    //   document.querySelector(".event-start-date").value = selection.dataset.startDate;
    //   document.querySelector(".event-start-time").value = selection.dataset.startTime;
    //   document.querySelector(".event-end-date").value = selection.dataset.endDate;
    //   document.querySelector(".event-end-time").value = selection.dataset.endTime;
    //   document.querySelector(".event-location").value = selection.dataset.location ? selection.dataset.location : "";
    // });
  }
}

customElements.define("calendar-grid", CalendarGrid);
