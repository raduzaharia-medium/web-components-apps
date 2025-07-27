export class EventSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <fieldset>
        <label>In calendar</label>
        <select class="event-calendar">
            <option value="events">Events</option>
            <option value="birthdays">Birthdays</option>
        </select>

        <label>Summary</label>
        <input type="text" class="event-summary" />

        <label>Location</label>
        <input type="text" class="event-location" />

        <label>Starting on</label>
        <input type="date" class="event-start-date" />
        <label>at</label>
        <input type="time" class="event-start-time" />

        <label>Ending on</label>
        <input type="date" class="event-end-date" />
        <label>at</label>
        <input type="time" class="event-end-time" />
      </fieldset>`;
  }
}

customElements.define("event-section", EventSection);
