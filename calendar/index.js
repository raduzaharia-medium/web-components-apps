import { getEvents, saveEvent, deleteEvent } from "./scripts/services.js";

async function drawCalendar() {
  document.querySelector("section").classList.add("loading");
  document.querySelector("calendar-grid").year = document.getElementById("year").value;
  document.querySelector("calendar-grid").month = document.getElementById("month").value;
  document.querySelector("calendar-grid").generate();

  const events = await getEvents(document.getElementById("year").value, document.getElementById("month").value);
  document.querySelector("calendar-grid").addEvents(events);
  document.querySelector("section").classList.remove("loading");
}

function addEvents() {
  document.getElementById("newEvent").addEventListener("click", () => {
    const today = new Date();

    document.querySelector(".event-calendar").value = "";
    document.querySelector(".event-summary").value = "";
    document.querySelector(".event-start-date").value = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, 0)}-${today.getDate()}`;
    document.querySelector(".event-start-time").value = "";
    document.querySelector(".event-end-date").value = "";
    document.querySelector(".event-end-time").value = "";
    document.querySelector(".event-location").value = "";

    document.body.classList.add("add-event");
  });

  document.getElementById("saveEvent").addEventListener("click", async () => {
    document.querySelector("section").classList.add("loading");
    document.body.classList.remove("add-event");
    document.body.classList.remove("edit-event");

    await saveEvent({
      calendar: document.querySelector(".event-calendar").value.toLowerCase(),
      summary: document.querySelector(".event-summary").value,
      location: document.querySelector(".event-location").value,
      startDate: document.querySelector(".event-start-date").value,
      startTime: document.querySelector(".event-start-time").value,
      endDate: document.querySelector(".event-end-date").value,
      endTime: document.querySelector(".event-end-time").value,
    });

    drawCalendar();
  });

  document.getElementById("cancelEvent").addEventListener("click", () => {
    document.body.classList.remove("add-event");
    document.body.classList.remove("edit-event");
  });

  document.getElementById("deleteEvent").addEventListener("click", async () => {
    if (confirm("Are you sure?")) {
      document.querySelector("section").classList.add("loading");
      document.body.classList.remove("edit-event");

      await deleteEvent({
        calendar: document.querySelector(".event-calendar").value.toLowerCase(),
        summary: document.querySelector(".event-summary").value,
        location: document.querySelector(".event-location").value,
        startDate: document.querySelector(".event-start-date").value,
        startTime: document.querySelector(".event-start-time").value,
        endDate: document.querySelector(".event-end-date").value,
        endTime: document.querySelector(".event-end-time").value,
      });

      drawCalendar();
    }
  });

  document.querySelector(".calendar-grid").addEventListener("click", (e) => {
    const selection = e.target.closest("li");

    document.body.classList.add("edit-event");

    document.querySelector(".event-calendar").value = selection.dataset.calendar;
    document.querySelector(".event-summary").value = selection.dataset.summary;
    document.querySelector(".event-start-date").value = selection.dataset.startDate;
    document.querySelector(".event-start-time").value = selection.dataset.startTime;
    document.querySelector(".event-end-date").value = selection.dataset.endDate;
    document.querySelector(".event-end-time").value = selection.dataset.endTime;
    document.querySelector(".event-location").value = selection.dataset.location ? selection.dataset.location : "";
  });
}
