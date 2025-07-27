import { getEvents } from "../scripts/services.js";

export class CalendarDay extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.classList.contains("invalid")) return;

    const events = getEvents(this.dataset.year, this.dataset.month, this.dataset.day);
    const today = new Date();

    if (this.dataset.day == today.getDate() && this.dataset.month == today.getMonth() + 1 && this.dataset.year == today.getFullYear())
      this.classList.add("today");

    if (events.length === 0) this.classList.add("no-events");
    this.innerHTML = `
      <span class="desktop-title">${this.dataset.day}</span>
      <span class="mobile-title">${this.dataset.day}</span>

      <ul>${events
        .map(
          (e) => `<calendar-event data-id="${e.id}" data-start-date="${e.startDateString}" 
          data-end-date="${e.endDateString}" data-start-time="${e.startTimeString}" data-calendar="${e.calendar}"
          data-end-time="${e.endTimeString}" data-summary="${e.summary}" data-location="${e.location}"
          data-calendar-year="${this.dataset.year}" data-calendar-month="${this.dataset.month}" 
          data-calendar-day="${this.dataset.day}"></calendar-event>`
        )
        .join("")}</ul>`;
  }
}

customElements.define("calendar-day", CalendarDay);
