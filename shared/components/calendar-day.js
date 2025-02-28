export class CalendarDay extends HTMLDivElement {
  /**
   * Returns the date for the CalendarDay object.
   * @returns {Date} */
  get date() {
    return new Date(this.dataset.year, this.dataset.month, this.dataset.day);
  }

  /**
   * Sets the date for the CalendarDay object.
   * @param {Date} newValue
   */
  set date(newValue) {
    this.querySelector("span.desktop-title").innerText = newValue.getDate();
    this.querySelector("span.mobile-title").innerText = `${newValue.toLocaleString("default", {
      weekday: "long",
    })}, ${newValue.getDate()} ${newValue.toLocaleString("default", {
      month: "long",
    })}`;

    this.dataset.day = newValue.getDate();
    this.dataset.month = newValue.getMonth() + 1;
    this.dataset.year = newValue.getFullYear();

    const today = new Date();
    if (
      newValue.getDate() === today.getDate() &&
      newValue.getMonth() === today.getMonth() &&
      newValue.getFullYear() === today.getFullYear()
    )
      this.classList.add("today");
  }

  constructor() {
    super();

    this.classList.add("calendar-day");
    this.classList.add("valid");
    this.classList.add("no-events");

    this.innerHTML = `
      <span class="desktop-title"></span>
      <span class="mobile-title"></span>

      <ul>
        <template>
          <li is="calendar-event"></li>
        </template>
      </ul>`;
  }

  addEvents(events) {
    for (const event of events) this.addEvent(event);
  }
  addEvent(event) {
    const template = this.querySelector("template").content.firstElementChild;
    const node = template.cloneNode(true);

    this.classList.remove("no-events");
    this.querySelector("ul").appendChild(node);

    node.data = event;
  }
}

customElements.define("calendar-day", CalendarDay, { extends: "div" });
