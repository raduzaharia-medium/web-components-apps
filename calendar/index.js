import { generatePDF, loadEvents, getEventsForMonth, getCalendars, deleteEvent, saveEvent } from "./scripts/services.js";

document.addEventListener("export-pdf", handleExportPDF);
document.addEventListener("import-ics", handleImportICS);
document.addEventListener("date-changed", handleDateChanged);
document.addEventListener("event-clicked", handleEventClicked);
document.addEventListener("delete", handleDelete);
document.addEventListener("cancel", handleCancel);
document.addEventListener("save", handleSave);

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
async function handleDateChanged() {
  const year = parseInt(document.querySelector("date-navigator #year")?.value ?? new Date().getFullYear());
  const month = parseInt(document.querySelector("date-navigator #month")?.value ?? new Date().getMonth() + 1);
  const events = await getEventsForMonth(year, month);

  document.querySelector("main").innerHTML = `<calendar-grid data-year="${year}" data-month="${month}"></calendar-grid>`;
  document.querySelector("calendar-grid").setEvents(events);
}
function handleEventClicked(e) {
  const availableCalendars = getCalendars();

  document.querySelector("main").innerHTML = "<event-editor></event-editor>";

  document.body.classList.add("edit");
  document.querySelector("event-editor").setAvailableCalendars(availableCalendars);
  document.querySelector("event-editor").setEvent(e.detail);
}

function handleCancel() {
  document.body.classList.remove("edit");
  handleDateChanged();
}
function handleDelete() {
  const confirmation = confirm("Are you sure you want to delete this event?");
  if (!confirmation) return;

  const event = document.querySelector("event-editor").getEvent();

  deleteEvent(event);
  handleCancel();
}
function handleSave() {
  const event = document.querySelector("event-editor").getEvent();

  saveEvent(event);
  handleCancel();
}

handleDateChanged();
