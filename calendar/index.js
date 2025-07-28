import { generatePDF, loadEvents, getEventsForMonth } from "./scripts/services.js";

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

    const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
    const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);
    const events = await getEventsForMonth(year, month);

    document.querySelector("calendar-grid").setEvents(events);
  });
}
async function handleDateChanged(e) {
  const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
  const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);
  const events = await getEventsForMonth(year, month);

  document.querySelector("main").innerHTML = `<calendar-grid data-year="${e.detail.year}" data-month="${e.detail.month}"></calendar-grid>`;
  document.querySelector("calendar-grid").setEvents(events);
}
function handleEventClicked(e) {
  document.querySelector("event-editor").dataset.event = JSON.stringify(e.detail);
  document.querySelector("event-editor dialog").showModal();
}
