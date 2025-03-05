import { saveEvent, deleteEvent } from "./scripts/services.js";

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
}
