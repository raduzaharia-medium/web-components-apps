export class CalendarEvent extends HTMLLIElement {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    const [eventYear, eventMonth, eventDay] = parseIsoDate(newValue.startDate);
    const calendarYear = parseInt(this.closest("div").dataset.year);
    const calendarMonth = parseInt(this.closest("div").dataset.month);
    const calendarDay = parseInt(this.closest("div").dataset.day);
    const isoCalendarDate = `${calendarYear}-${calendarMonth.toString().padStart(2, "0")}-${calendarDay
      .toString()
      .padStart(2, "0")}`;

    this.dataset.startDate = newValue.startDate;
    if (newValue.startTime) this.dataset.startTime = newValue.startTime;
    if (newValue.endDate) this.dataset.endDate = newValue.endDate;
    if (newValue.endTime) this.dataset.endTime = newValue.endTime;
    this.dataset.summary = newValue.summary;
    if (newValue.location) this.dataset.location = newValue.location;
    this.dataset.calendar = newValue.calendar;
    this.dataset.id = newValue.id;

    this.querySelector("span.title").innerText = newValue.startTime
      ? `${newValue.startTime} - ${newValue.endTime} ${newValue.summary}`
      : newValue.summary;
    this.querySelector("span.location").innerText = newValue.location ?? "";
    this.style.backgroundColor = getColorFromName(newValue.calendar);

    if (isDateInPast(newValue.startDate)) this.classList.add("past-event");
    if (eventYear === calendarYear && eventMonth === calendarMonth) {
      if (newValue.endDate && newValue.endDate > newValue.startDate) {
        if (newValue.startDate === isoCalendarDate) this.classList.add("multiple-days-start");
        else if (newValue.endDate === isoCalendarDate) this.classList.add("multiple-days-end");
        else this.classList.add("multiple-days-middle");
      } else this.classList.add("single-day");
    } else {
      if (newValue.calendar === "aniversari") this.classList.add("single-day");
      else if (newValue.endDate === 1) this.classList.add("multiple-days-end");
      else this.classList.add("multiple-days-middle");
    }
  }

  constructor() {
    super();

    this.classList.add("calendar-event");

    this.innerHTML = `
      <span class="title"></span>
      <span class="location"></span>`;
  }
}

function getColorFromName(name) {
  const preparedName = name.toLowerCase().replaceAll(" ", "");
  const limitedName = preparedName.substring(0, 6);
  const components = limitedName.split("");
  const numberMap = components.map((e) => parseInt(("abcdefghijklmnopqrstuvwxyz".indexOf(e) + 1) % 16).toString(16));
  const result = numberMap.join("").padEnd(6, "ff");
  const transparentResult = `#${result}44`;

  return transparentResult;
}

function isDateInPast(isoDateString) {
  const today = new Date();
  const [year, month, day] = parseIsoDate(isoDateString);

  return day < today.getDate() || month < today.getMonth() + 1 || year < today.getFullYear();
}

export function parseIsoDate(isoDateString) {
  const year = parseInt(isoDateString.substr(0, 4));
  const month = parseInt(isoDateString.substr(5, 2));
  const day = parseInt(isoDateString.substr(8, 2));

  return [year, month, day];
}

customElements.define("calendar-event", CalendarEvent, { extends: "li" });
