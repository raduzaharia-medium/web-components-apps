export class CalendarGrid extends HTMLDivElement {
  /**
   * Returns the year for this calendar.
   * @returns {number} year
   */
  get year() {
    return this.dataset.year ? parseInt(this.dataset.year) : null;
  }

  /**
   * Returns the month for this calendar.
   * @returns {number} month
   */
  get month() {
    return this.dataset.month ? parseInt(this.dataset.month) : null;
  }

  /**
   * Sets the year for this calendar.
   * @param {number} newValue
   */
  set year(newValue) {
    this.dataset.year = newValue;
  }

  /**
   * Sets the month for this calendar.
   * @param {number} newValue
   */
  set month(newValue) {
    this.dataset.month = newValue;
  }

  constructor() {
    super();

    this.classList.add("calendar-grid");

    this.innerHTML = ` 
      <template>
        <div is="calendar-day"></div>
      </template>`;
  }

  generate() {
    if (!this.year || !this.month) return;

    this.querySelectorAll("div").forEach((element) => element.remove());

    const numberOfDays = getLastDayOfMonth(this.year, this.month);
    const startingDayOfWeek = getStartingDayOfWeek(this.year, this.month);

    for (let i = 0; i < startingDayOfWeek - 1; i++) this.appendChild(createEmptyDay());
    for (let i = 1; i <= numberOfDays; i++) {
      const template = this.querySelector("template");
      const node = template.content.firstElementChild.cloneNode(true);

      this.appendChild(node);
      node.date = new Date(`${this.year}-${this.month}-${i}`);
    }
  }

  addEvents(events) {
    for (const event of events) {
      const adjustedDay = getAdjustedEventDay(event, this.year, this.month);
      const selectedDay = this.querySelector(`div.calendar-day[data-day="${adjustedDay}"]`);
      const eventDuration = getEventDuration(event, this.year, this.month);

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
  return (eventYear === calendarYear && eventMonth === calendarMonth) || event.calendar === "aniversari" ? eventDay : 1;
}

function createEmptyDay() {
  const result = document.createElement("div");

  result.classList.add("calendar-day");
  result.classList.add("invalid");

  return result;
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getStartingDayOfWeek(year, month) {
  let result = new Date(`${year}-${month}-01`).getDay();

  if (result === 0) result = 7;
  return result;
}

customElements.define("calendar-grid", CalendarGrid, { extends: "div" });
