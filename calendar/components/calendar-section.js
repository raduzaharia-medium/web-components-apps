import "../../shared/components/custom-list-skeleton.js";

import "./calendar-grid.js";
import "./date-navigator.js";

export class CalendarSection extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <date-navigator></date-navigator>

      <header>
        <strong>Mo</strong>
        <strong>Tu</strong>
        <strong>We</strong>
        <strong>Th</strong>
        <strong>Fr</strong>
        <strong>Sa</strong>
        <strong>Su</strong>
      </header>

      <calendar-grid></calendar-grid>
      <custom-list-skeleton></custom-list-skeleton>
      
      <nav>
        <img id="newEvent" src="../shared/images/dark/add-new.svg">
        <img id="loadEvents" src="../shared/images/dark/button-load.svg">
      </nav>`;
  }
}

customElements.define("calendar-section", CalendarSection);
