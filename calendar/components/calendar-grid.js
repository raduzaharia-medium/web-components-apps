import "./calendar-day.js";
import "./calendar-event.js";

export class CalendarGrid extends HTMLElement {
  constructor() {
    super();

    const numberOfDays = getLastDayOfMonth(this.dataset.year ?? new Date().getFullYear(), this.dataset.month ?? new Date().getMonth() + 1);
    const startingDayOfWeek = getStartingDayOfWeek(this.dataset.year ?? new Date().getFullYear(), this.dataset.month ?? new Date().getMonth() + 1);

    this.innerHTML = `
      ${Array.from({ length: startingDayOfWeek - 1 }, () => '<calendar-day class="invalid"></calendar-day>').join("")}
      ${Array.from(
        { length: numberOfDays },
        (e, index) =>
          `<calendar-day class="valid no-events" 
            data-year="${this.dataset.year ?? new Date().getFullYear()}" 
            data-month="${this.dataset.month ?? new Date().getMonth() + 1}" 
            data-day="${index + 1}"></calendar-day>`
      ).join("")}`;

    this.addEventListener("click", (e) => {
      const selection = e.target.closest("li");

      document.body.innerHTML = `<event-section></event-section>`;

      document.querySelector(".event-calendar").value = selection.dataset.calendar;
      document.querySelector(".event-summary").value = selection.dataset.summary;
      document.querySelector(".event-start-date").value = selection.dataset.startDate;
      document.querySelector(".event-start-time").value = selection.dataset.startTime;
      document.querySelector(".event-end-date").value = selection.dataset.endDate;
      document.querySelector(".event-end-time").value = selection.dataset.endTime;
      document.querySelector(".event-location").value = selection.dataset.location ? selection.dataset.location : "";
    });
  }

  addEvents(events) {
    for (const event of events) {
      const adjustedDay = getAdjustedEventDay(event, this.dataset.year, this.dataset.month);
      const selectedDay = this.querySelector(`div.calendar-day[data-day="${adjustedDay}"]`);
      const eventDuration = getEventDuration(event, this.dataset.year, this.dataset.month);

      selectedDay.addEvent(event);

      for (let i = 0; i < eventDuration; i++) {
        const selectedExtraDay = this.querySelector(`div.calendar-day[data-day="${adjustedDay + i + 1}"]`);
        if (selectedExtraDay) selectedExtraDay.addEvent(event);
      }
    }
  }
}

function getEventDuration(event, calendarYear, calendarMonth) {
  const [eventYear, eventMonth, eventDay] = parseIsoDate(event.startDate);
  let result = (new Date(event.endDate) - new Date(event.startDate)) / (24 * 60 * 60 * 1000);

  if (eventYear < calendarYear || eventMonth < calendarMonth) {
    result = (new Date(event.endDate) - new Date(`${calendarYear}-${calendarMonth}-01`)) / (24 * 60 * 60 * 1000);
  }

  return result;
}

function parseIsoDate(isoDateString) {
  const year = parseInt(isoDateString.substr(0, 4));
  const month = parseInt(isoDateString.substr(5, 2));
  const day = parseInt(isoDateString.substr(8, 2));

  return [year, month, day];
}

function getAdjustedEventDay(event, calendarYear, calendarMonth) {
  const [eventYear, eventMonth, eventDay] = parseIsoDate(event.startDate);
  return eventYear === calendarYear && eventMonth === calendarMonth ? eventDay : 1;
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getStartingDayOfWeek(year, month) {
  let result = new Date(`${year}-${month}-01`).getDay();

  if (result === 0) result = 7;
  return result;
}

customElements.define("calendar-grid", CalendarGrid);
