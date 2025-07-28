import "./calendar-day.js";

export class CalendarGrid extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
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

  setEvents(events) {
    if (events.length === 0) return;

    const days = this.querySelectorAll("calendar-day.valid");

    for (const element of days) {
      const year = parseInt(element.dataset.year);
      const month = parseInt(element.dataset.month);
      const day = parseInt(element.dataset.day);

      const dateStart = new Date(year, month - 1, day, 0, 0, 0, 0);
      const dateEnd = new Date(year, month - 1, day, 23, 59, 59, 999);
      const dayEvents = events.filter(
        (e) => (e.startDate >= dateStart && e.startDate <= dateEnd) || (e.startDate <= dateStart && e.endDate >= dateStart && e.endTimeString !== "00:00:00")
      );

      if (dayEvents.length > 0) element.setEvents(dayEvents);
    }
  }
}

customElements.define("calendar-grid", CalendarGrid);
