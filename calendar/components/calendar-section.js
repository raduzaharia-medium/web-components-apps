import "../../shared/components/custom-list-skeleton.js";
import { generatePDF, loadEvents } from "../scripts/services.js";

import "./calendar-grid.js";
import "./date-navigator.js";

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
      
      <nav>
        <img id="newEvent" src="../shared/images/dark/add-new.svg">
        <img id="loadEvents" src="../shared/images/dark/button-load.svg">
      </nav>`;

    this.querySelector("#newEvent").addEventListener("click", () => {
      const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
      const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);

      // this.querySelector("main").innerHTML = `<event-editor></event-editor>`;
      generatePDF(year, month - 1);
    });

    this.querySelector("#loadEvents").addEventListener("click", async () => {
      const filePicker = document.createElement("input");

      filePicker.type = "file";
      filePicker.click();

      filePicker.addEventListener("change", async () => {
        loadEvents(filePicker.files);
        this.querySelector("main").innerHTML = `<calendar-grid></calendar-grid>`;
      });
    });
  }
}

customElements.define("calendar-section", CalendarSection);
