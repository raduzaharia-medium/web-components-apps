import { generatePDF, loadEvents } from "./scripts/services.js";
import "./components/event-section.js";

document.addEventListener("export-pdf", () => {
  const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
  const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);

  generatePDF(year, month - 1);
});

document.addEventListener("import-ics", async () => {
  const filePicker = document.createElement("input");

  filePicker.type = "file";
  filePicker.click();

  filePicker.addEventListener("change", async () => {
    loadEvents(filePicker.files);
    this.querySelector("main").innerHTML = `<calendar-grid></calendar-grid>`;
  });
});

document.addEventListener("date-changed", (e) => {
  document.querySelector("main").innerHTML = `<calendar-grid data-year="${e.detail.year}" data-month="${e.detail.month}"></calendar-grid>`;
});

document.addEventListener("event-clicked", (e) => {
  document.body.classList.add("edit");
  document.querySelector("main").innerHTML = `<event-section data-event='${JSON.stringify(e.detail)}'></event-section>`;
});
