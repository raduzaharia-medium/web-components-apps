import "../../shared/components/custom-list-skeleton.js";

import "./calendar-grid.js";
import "./date-navigator.js";
import "./actions-bar.js";

export class CalendarSection extends HTMLElement {
  constructor() {
    super();

    const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
    const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);

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

      <main>
        <calendar-grid data-year="${year}" data-month="${month}"></calendar-grid>
      </main>
      <custom-list-skeleton></custom-list-skeleton>
      
      <actions-bar></actions-bar>`;
  }
}

customElements.define("calendar-section", CalendarSection);
