export class CalendarDay extends HTMLElement {
  constructor() {
    super();

    const today = new Date();
    if (this.dataset.day == today.getDate() && this.dataset.month == today.getMonth() + 1 && this.dataset.year == today.getFullYear())
      this.classList.add("today");

    this.innerHTML = `
      <span class="desktop-title">${this.dataset.day}</span>
      <span class="mobile-title">${this.dataset.day}</span>

      <ul></ul>`;
  }

  addEvents(events) {
    for (const event of events) this.addEvent(event);
  }
  addEvent(event) {
    const node = document.createElement("calendar-event");

    this.classList.remove("no-events");
    this.querySelector("ul").appendChild(node);

    node.data = event;
  }
}

customElements.define("calendar-day", CalendarDay);
