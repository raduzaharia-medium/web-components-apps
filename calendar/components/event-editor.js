export class EventEditor extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <fieldset>
        <label for="calendar">In calendar</label>
        <select id="calendar" class="event-calendar">
            <option value="events">Events</option>
        </select>

        <label for="summary">Summary</label>
        <input id="summary" type="text" class="event-summary" />

        <label for="location">Location</label>
        <input id="location" type="text" class="event-location" />

        <label for="startDate">Starting on</label>
        <input id="startDate" type="date" class="event-start-date" />
        <label for="startTime">at</label>
        <input id="startTime" type="time" class="event-start-time" />

        <label for="endDate">Ending on</label>
        <input id="endDate" type="date" class="event-end-date" />
        <label for="endTime">at</label>
        <input id="endTime" type="time" class="event-end-time" />
      </fieldset>
      <nav>
        
      </nav>`;
  }

  setAvailableCalendars(calendars) {
    const calendarSelect = this.querySelector(".event-calendar");

    calendarSelect.innerHTML = "";

    calendars.forEach((calendar) => {
      const option = document.createElement("option");

      option.value = calendar.id;
      option.textContent = calendar.name;

      calendarSelect.appendChild(option);
    });
  }
  setEvent(event) {
    this.id = event.id || "";
    this.querySelector(".event-calendar").value = event.calendar || "events";
    this.querySelector(".event-summary").value = event.summary || "";
    this.querySelector(".event-location").value = event.location || "";
    this.querySelector(".event-start-date").value = event.startDate || "";
    this.querySelector(".event-start-time").value = event.startTime || "";
    this.querySelector(".event-end-date").value = event.endDate || "";
    this.querySelector(".event-end-time").value = event.endTime || "";
  }
  getEvent() {
    return {
      id: this.id,
      calendar: this.querySelector(".event-calendar").value,
      summary: this.querySelector(".event-summary").value,
      location: this.querySelector(".event-location").value,
      startDate: this.querySelector(".event-start-date").value,
      startTime: this.querySelector(".event-start-time").value,
      endDate: this.querySelector(".event-end-date").value,
      endTime: this.querySelector(".event-end-time").value,
    };
  }
}

customElements.define("event-editor", EventEditor);
