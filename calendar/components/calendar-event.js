import { getColorFromName, isDateInPast } from "../scripts/services.js";

export class CalendarEvent extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <span class="title" title="${
        this.dataset.startTime === "00:00:00"
          ? this.dataset.summary
          : `${this.dataset.startTime.substring(0, 5)} - ${this.dataset.endTime.substring(0, 5)} ${this.dataset.summary}`
      } ${this.dataset.location === "null" ? "" : `(${this.dataset.location})`}">
        ${this.dataset.startTime === "00:00:00" ? this.dataset.summary : `${this.dataset.startTime.substring(0, 5)} ${this.dataset.summary}`}
      </span>
      <span class="location">${this.dataset.location === "null" ? "" : this.dataset.location}</span>`;
  }

  connectedCallback() {
    const eventYear = this.dataset.startDate.substring(0, 4);
    const eventMonth = this.dataset.startDate.substring(5, 7);
    const eventDay = this.dataset.startDate.substring(8, 10);
    const calendarDate = `${this.dataset.calendarYear}-${this.dataset.calendarMonth.padStart(2, "0")}-${this.dataset.calendarDay.padStart(2, "0")}`;

    this.style.backgroundColor = getColorFromName(this.dataset.calendar);

    if (isDateInPast(this.dataset.startDate)) this.classList.add("past-event");
    if (eventYear === this.dataset.calendarYear && eventMonth === this.dataset.calendarMonth.padStart(2, "0")) {
      if (this.dataset.endDate && this.dataset.endDate > this.dataset.startDate && this.dataset.endTime !== "00:00:00") {
        if (this.dataset.calendarDay.padStart(2, "0") === eventDay) this.classList.add("multiple-days-start");
        else if (this.dataset.endDate === calendarDate) this.classList.add("multiple-days-end");
        else this.classList.add("multiple-days-middle");
      } else this.classList.add("single-day");
    } else {
      if (this.dataset.calendar === "Birthdays") this.classList.add("single-day");
      else if (this.dataset.endDate === 1) this.classList.add("multiple-days-end");
      else this.classList.add("multiple-days-middle");
    }
  }
}

customElements.define("calendar-event", CalendarEvent);
