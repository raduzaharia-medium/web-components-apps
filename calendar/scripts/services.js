import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

const data = {};
let yearlyCache = {};
let monthlyCache = {};

export async function loadEvents(files) {
  const file = files[0];
  if (!file.name.match(/\.(ics)$/i)) return;

  const text = await file.text();
  const parsedData = ICAL.parse(text);
  const component = new ICAL.Component(parsedData);
  const calendarName = component.getFirstPropertyValue("x-wr-calname") || component.getFirstPropertyValue("name") || "Unknown Calendar";
  const events = component.getAllSubcomponents("vevent");

  data[calendarName] = events.map((element) => {
    const event = new ICAL.Event(element);

    return {
      id: event.uid,
      calendar: calendarName,
      summary: event.summary,
      location: event.location,
      startDate: event.startDate.toJSDate(),
      startDateString: `${event.startDate.year}-${String(event.startDate.month).padStart(2, 0)}-${String(event.startDate.day).padStart(2, 0)}`,
      startTimeString: `${String(event.startDate.hour).padStart(2, 0)}:${String(event.startDate.minute).padStart(2, 0)}:${String(
        event.startDate.second
      ).padStart(2, 0)}`,
      endDate: event.endDate.toJSDate(),
      endDateString: `${event.endDate.year}-${String(event.endDate.month).padStart(2, 0)}-${String(event.endDate.day).padStart(2, 0)}`,
      endTimeString: `${String(event.endDate.hour).padStart(2, 0)}:${String(event.endDate.minute).padStart(2, 0)}:${String(event.endDate.second).padStart(
        2,
        0
      )}`,
      duration: event.duration,
    };
  });

  yearlyCache = {};
  monthlyCache = {};
}

export function getEventsForYear(year) {
  let eventsForYear = yearlyCache[year];

  if (!eventsForYear) {
    const dateStart = new Date(year, 0, 1);
    const dateEnd = new Date(year, 12, 31);
    eventsForYear = [];

    for (const calendar in data) {
      const selection = data[calendar].filter((e) => e.startDate >= dateStart && e.endDate <= dateEnd);
      eventsForYear = [...eventsForYear, ...selection];
    }

    eventsForYear.sort((a, b) => a.startDate - b.startDate);
    yearlyCache[year] = eventsForYear;
  }

  return eventsForYear;
}
export function getEventsForMonth(year, month) {
  let eventsForMonth = monthlyCache[`${year}-${month}`];

  if (!eventsForMonth) {
    const dateStart = new Date(year, month - 1, 1);
    const dateEnd = new Date(year, month, 0);
    const eventsForYear = getEventsForYear(year);

    eventsForMonth = eventsForYear.filter((e) => e.startDate >= dateStart && e.endDate <= dateEnd);
    monthlyCache[`${year}-${month}`] = eventsForMonth;
  }

  return eventsForMonth;
}
export function getEvents(year, month, day) {
  const eventsForMonth = getEventsForMonth(year, month);
  const dateStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const dateEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

  return eventsForMonth.filter((e) => (e.startDate >= dateStart && e.startDate <= dateEnd) || (e.startDate <= dateStart && e.endDate >= dateStart));
}

export async function saveEvent(event) {
  // add the event to the data object
}

export async function deleteEvent(event) {
  // remove the event from the data object
}

export function getColorFromName(name) {
  const preparedName = name.toLowerCase().replaceAll(" ", "");
  const limitedName = preparedName.substring(0, 6);
  const components = limitedName.split("");
  const numberMap = components.map((e) => parseInt(("abcdefghijklmnopqrstuvwxyz".indexOf(e) + 1) % 16).toString(16));
  const result = numberMap.join("").padEnd(6, "ff");
  const transparentResult = `#${result}44`;

  return transparentResult;
}

export function isDateInPast(isoDateString) {
  const today = new Date();
  const [year, month, day] = parseIsoDate(isoDateString);

  return day < today.getDate() || month < today.getMonth() + 1 || year < today.getFullYear();
}

export function parseIsoDate(isoDateString) {
  const year = parseInt(isoDateString.substr(0, 4));
  const month = parseInt(isoDateString.substr(5, 2));
  const day = parseInt(isoDateString.substr(8, 2));

  return [year, month, day];
}

export function generatePDF(year, month) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape");

  const settings = initializeSettings(doc);
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const adjustedFirstDay = getAdjustedFirstDay(year, month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Draw title, header, and calendar in sequence
  drawTitle(doc, monthName, year, settings);
  drawHeader(doc, daysOfWeek, settings);
  drawCalendar(doc, year, month, daysInMonth, adjustedFirstDay, settings);

  doc.save(`${monthName.toLowerCase()}_${year}_calendar.pdf`);
}

function initializeSettings(doc) {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const gap = 1;
  const numColumns = 7;
  const numRows = 6;
  const textColor = "#2a3434";
  const titleHeight = 20;
  const headerHeight = 10;
  const footerHeight = 10;
  const availableHeight = pageHeight - 2 * margin - titleHeight - headerHeight - footerHeight;
  const cellWidth = (pageWidth - 2 * margin - (numColumns - 1) * gap) / numColumns;
  const cellHeight = availableHeight / numRows;

  return { margin, gap, numColumns, numRows, titleHeight, headerHeight, footerHeight, cellWidth, cellHeight, textColor };
}

function drawTitle(doc, monthName, year, settings) {
  doc.setFontSize(18);
  doc.setTextColor(settings.textColor);
  doc.text(`${monthName} ${year}`, doc.internal.pageSize.width / 2, settings.margin + settings.titleHeight / 2, { align: "center" });
}

function drawHeader(doc, daysOfWeek, settings) {
  doc.setFontSize(16);
  daysOfWeek.forEach((day, i) => {
    doc.text(
      day,
      settings.margin + i * (settings.cellWidth + settings.gap) + settings.cellWidth / 2,
      settings.margin + settings.titleHeight + settings.headerHeight / 2,
      { align: "center" }
    );
  });
}

function getAdjustedFirstDay(year, month) {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  return firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
}

function drawCalendar(doc, year, month, daysInMonth, adjustedFirstDay, settings) {
  let day = 1;
  for (let row = 0; row < settings.numRows; row++) {
    for (let col = 0; col < settings.numColumns; col++) {
      const x = settings.margin + col * (settings.cellWidth + settings.gap);
      const y = settings.margin + settings.titleHeight + settings.headerHeight + row * (settings.cellHeight + settings.gap);

      if ((row === 0 && col >= adjustedFirstDay) || (row > 0 && day <= daysInMonth)) {
        doc.setDrawColor("#bec5c4");
        doc.rect(x, y, settings.cellWidth, settings.cellHeight);
        doc.setFontSize(16);
        doc.text(day.toString(), x + 3, y + 7); // Draw day number

        // Draw events
        drawEvents(doc, x, y, day, year, month, settings);
        day++;
      }
    }
  }
}

function drawEvents(doc, x, y, day, year, month, settings) {
  const events = getEvents(year, month + 1, day);
  const eventWidth = settings.cellWidth - 6;

  let eventY = y + 10;
  let annotationText = "";

  doc.setTextColor(settings.textColor);
  doc.setFontSize(8);

  events.forEach((event) => {
    if (eventY + 6 <= y + settings.cellHeight) {
      annotationText += `${
        event.startTimeString === "00:00:00"
          ? event.summary
          : `${event.startTimeString.substring(0, 5)} - ${event.endTimeString.substring(0, 5)} ${event.summary}`
      } ${event.location ?? ""}\n`;
      const eventSummary = `${event.startTimeString === "00:00:00" ? event.summary : `${event.startTimeString.substring(0, 5)} ${event.summary}`}`;

      doc.setDrawColor("#bec5c4");
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x + 3, eventY, eventWidth, 4.3, 1, 1); // Draw rounded rectangle for the event
      doc.text(truncateEventText(doc, eventSummary, eventWidth), x + 4.3, eventY + 3); // Draw event text inside the pill

      eventY += 4.3 + 1; // Move down for the next event
    }
  });

  if (annotationText)
    doc.createAnnotation({
      type: "text", // A simple text annotation (like a tooltip)
      bounds: { x: x + 11, y: y + 1, w: eventWidth, h: 2 }, // Position of the annotation
      title: "Events", // Title of the annotation (optional)
      contents: annotationText, // The content (tooltip) to display when clicked
      open: false, // Set to true to have it initially open, false for it to open on click
    });
}

function truncateEventText(doc, eventSummary, eventWidth) {
  let truncatedText = "";
  for (let i = 0; i < eventSummary.length; i++) {
    truncatedText += eventSummary[i];
    if (doc.getTextWidth(truncatedText + "...") > eventWidth - 3) {
      return truncatedText + "...";
    }
  }
  return eventSummary;
}
