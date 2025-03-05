export class EventSection extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <nav class="top">
        <span class="configure-event-title">configure event</span>
      </nav>

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
      </fieldset>
      
      <nav>
        <img class="configure-event-action danger" id="deleteEvent" src="../shared/images/dark/delete.svg">
        <img class="configure-event-action" id="cancelEvent" src="../shared/images/dark/cancel.svg">
        <img class="configure-event-action" id="saveEvent" src="../shared/images/dark/save.svg">
      </nav>`;
  }
}

customElements.define("event-section", EventSection);
