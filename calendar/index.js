import { generatePDF, loadEvents } from "./scripts/services.js";

document.addEventListener("export-pdf", handleExportPDF);
document.addEventListener("import-ics", handleImportICS);
document.addEventListener("date-changed", handleDateChanged);
document.addEventListener("event-clicked", handleEventClicked);

function handleExportPDF() {
  const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
  const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);

  generatePDF(year, month - 1);
}
function handleImportICS() {
  const filePicker = document.createElement("input");

  filePicker.type = "file";
  filePicker.click();

  filePicker.addEventListener("change", async () => {
    loadEvents(filePicker.files);
    this.querySelector("main").innerHTML = `<calendar-grid></calendar-grid>`;
  });
}
function handleDateChanged(e) {
  document.querySelector("main").innerHTML = `<calendar-grid data-year="${e.detail.year}" data-month="${e.detail.month}"></calendar-grid>`;
}
function handleEventClicked(e) {
  document.querySelector("event-editor").dataset.event = JSON.stringify(e.detail);
  document.querySelector("event-editor dialog").showModal();
}
