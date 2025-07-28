import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

const data = localStorage.getItem("calendarData")
  ? JSON.parse(localStorage.getItem("calendarData"), (key, value) => {
      return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) ? new Date(value) : value;
    })
  : {};
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
      duration: { days: event.duration.days, hours: event.duration.hours, minutes: event.duration.minutes },
    };
  });

  localStorage.setItem("calendarData", JSON.stringify(data));

  yearlyCache = {};
  monthlyCache = {};
}

export function getEventsForYear(year) {
  let eventsForYear = yearlyCache[year];

  if (!eventsForYear || eventsForYear.length === 0) {
    const dateStart = new Date(year, 0, 1);
    const dateEnd = new Date(year, 12, 31);
    eventsForYear = [];

    for (const calendar in data) {
      const selection = data[calendar].filter((e) => e.startDate >= dateStart && e.endDate <= dateEnd);
      eventsForYear = [...eventsForYear, ...selection];
    }

    eventsForYear.sort((a, b) => (a.endDate > a.startDate ? 1000 : a.startDate - b.startDate));
    yearlyCache[year] = eventsForYear;
  }

  return eventsForYear;
}
export function getEventsForMonth(year, month) {
  let eventsForMonth = monthlyCache[`${year}-${month}`];

  if (!eventsForMonth || eventsForMonth.length === 0) {
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

  return eventsForMonth.filter(
    (e) => (e.startDate >= dateStart && e.startDate <= dateEnd) || (e.startDate <= dateStart && e.endDate >= dateStart && e.endTimeString !== "00:00:00")
  );
}
export function getCalendars() {
  return Object.keys(data).map((calendarName) => {
    return {
      id: calendarName,
      name: calendarName,
      color: getColorFromName(calendarName),
    };
  });
}

export async function saveEvent(event) {
  const calendarName = event.calendar;
  const eventId = event.id;

  if (!data[calendarName]) return;

  const selection = data[calendarName].filter((e) => e.id === eventId)[0];
  if (!selection) return;

  selection.summary = event.summary;
  selection.location = event.location;
  selection.startDate = new Date(`${event.startDate}T${event.startTime}`);
  selection.endDate = new Date(`${event.endDate}T${event.endTime}`);
  selection.startDateString = event.startDate;
  selection.startTimeString = event.startTime;
  selection.endDateString = event.endDate;
  selection.endTimeString = event.endTime;
  selection.duration = {
    days: Math.floor((event.endDate - event.startDate) / (1000 * 60 * 60 * 24)),
    hours: Math.floor((event.endDate - event.startDate) / (1000 * 60 * 60)) % 24,
    minutes: Math.floor((event.endDate - event.startDate) / (1000 * 60)) % 60,
  };

  localStorage.setItem("calendarData", JSON.stringify(data));

  yearlyCache = {};
  monthlyCache = {};
}

export async function deleteEvent(event) {
  const calendarName = event.calendar;
  const eventId = event.id;

  if (!data[calendarName]) return;

  data[calendarName] = data[calendarName].filter((e) => e.id !== eventId);
  localStorage.setItem("calendarData", JSON.stringify(data));

  yearlyCache = {};
  monthlyCache = {};
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
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  doc.addImage("../../shared/backgrounds/light-pink.png", "PNG", 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

  // Draw title, header, and calendar in sequence
  drawTitle(doc, monthName, year, settings);
  drawHeader(doc, daysOfWeek, settings);
  drawCalendar(doc, year, month, daysInMonth, adjustedFirstDay, settings);

  doc.save(`${year}-${(month + 1).toString().padStart(2, "0")}.pdf`);
}

function initializeSettings(doc) {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const gap = 1;
  const numColumns = 7;
  const numRows = 6;
  const textColor = "#2a3434";
  const textColorLight = "#778a8a";
  const borderColor = "#bec5c4";
  const titleHeight = 20;
  const headerHeight = 10;
  const footerHeight = 10;
  const availableHeight = pageHeight - 2 * margin - titleHeight - headerHeight - footerHeight;
  const cellWidth = (pageWidth - 2 * margin - (numColumns - 1) * gap) / numColumns;
  const cellHeight = availableHeight / numRows;

  return { margin, gap, numColumns, numRows, titleHeight, headerHeight, footerHeight, cellWidth, cellHeight, textColor, textColorLight, borderColor };
}

function drawTitle(doc, monthName, year, settings) {
  doc.setFontSize(18);
  doc.setTextColor(settings.textColor);
  doc.setFont("Ubuntu-R", "normal");

  doc.text(`${monthName} ${year}`, doc.internal.pageSize.width / 2, settings.margin + settings.titleHeight / 2, { align: "center" });
}

function drawHeader(doc, daysOfWeek, settings) {
  doc.setFontSize(16);
  doc.setTextColor(settings.textColor);
  doc.setFont("Ubuntu-R", "normal");

  daysOfWeek.forEach((day, i) => {
    doc.text(
      day,
      settings.margin + i * (settings.cellWidth + settings.gap) + settings.cellWidth / 2,
      settings.margin + settings.titleHeight + settings.headerHeight / 2,
      { align: "center" }
    );
  });
}

function drawCalendar(doc, year, month, daysInMonth, adjustedFirstDay, settings) {
  let day = 1;
  for (let row = 0; row < settings.numRows; row++) {
    for (let col = 0; col < settings.numColumns; col++) {
      const x = settings.margin + col * (settings.cellWidth + settings.gap);
      const y = settings.margin + settings.titleHeight + settings.headerHeight + row * (settings.cellHeight + settings.gap);

      if ((row === 0 && col >= adjustedFirstDay) || (row > 0 && day <= daysInMonth)) {
        doc.setDrawColor(settings.borderColor);
        doc.rect(x, y, settings.cellWidth, settings.cellHeight);

        doc.setFontSize(16);
        doc.setFont("Ubuntu-L", "normal");
        doc.setDrawColor(settings.textColor);
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
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  let eventY = y + 10;
  let annotationText = "\n";
  let displayedEventCount = 0;

  doc.setTextColor(settings.textColor);
  doc.setFont("Ubuntu-R", "normal");
  doc.setFontSize(8);

  events.forEach((event) => {
    const eventSummary =
      event.startTimeString === "00:00:00"
        ? event.summary
        : `${event.startTimeString.substring(0, 5)} - ${event.endTimeString.substring(0, 5)} ${event.summary}`;

    annotationText += `${eventSummary} ${event.location ? `(${event.location})` : ""}\n`;

    if (eventY + 6 <= y + settings.cellHeight) {
      // Draw the event using the extracted drawEvent method
      drawEvent(doc, x, eventY, event, eventWidth, settings, day, month + 1, year);

      eventY += 4.3 + 1; // Move down for the next event
      displayedEventCount++;
    }
  });

  // If more events exist, add a "More..." label at the bottom
  if (displayedEventCount < events.length) {
    const moreText = "...";
    const textWidth = doc.getTextWidth(moreText); // Get the width of the "More..." text
    const centerX = x + 3 + (eventWidth - textWidth) / 2; // Calculate the X position to center the text

    doc.setTextColor(settings.textColorLight); // Light gray for "More..." text
    doc.text(moreText, centerX, eventY); // Position the "More..." label centered
    doc.setTextColor(settings.textColor); // Reset the text color
  }

  if (annotationText !== "\n")
    doc.createAnnotation({
      type: "text", // A simple text annotation (like a tooltip)
      bounds: { x: x, y: y, w: settings.cellWidth, h: settings.cellHeight }, // Position of the annotation
      title: `${day} ${monthName} ${year}`, // Title of the annotation (optional)
      contents: annotationText, // The content (tooltip) to display when clicked
      open: false, // Set to true to have it initially open, false for it to open on click
    });
}

function drawEvent(doc, x, eventY, event, eventWidth, settings, calendarDay, calendarMonth, calendarYear) {
  const eventSummary = `${event.startTimeString === "00:00:00" ? event.summary : `${event.startTimeString.substring(0, 5)} ${event.summary}`}`;

  // Get the color based on the event summary (or any string you'd like)
  const eventColor = getColorFromName(event.calendar);
  const alpha = 0.8; // Convert alpha to a decimal value (0 to 1)

  // Set the fill color for the event pill (background color)
  const r = parseInt(eventColor.slice(1, 3), 16); // Extract the red component (from hex)
  const g = parseInt(eventColor.slice(3, 5), 16); // Extract the green component (from hex)
  const b = parseInt(eventColor.slice(5, 7), 16); // Extract the blue component (from hex)

  // Lighten the color by blending it with white (rgb(255, 255, 255))
  const lightR = Math.round((1 - alpha) * r + alpha * 255);
  const lightG = Math.round((1 - alpha) * g + alpha * 255);
  const lightB = Math.round((1 - alpha) * b + alpha * 255);

  doc.setFillColor(lightR, lightG, lightB); // Use the RGB values from the hex color
  doc.setDrawColor(settings.borderColor);

  // doc.roundedRect(x + 3, eventY, eventWidth, 4.3, 1, 1, "FD"); // Draw filled rounded rectangle (FD = fill and draw)

  const eventDay = event.startDateString.substring(8, 10);
  const calendarDate = `${calendarYear}-${calendarMonth.toString().padStart(2, "0")}-${calendarDay.toString().padStart(2, "0")}`;
  const isMultiDay = event.endDateString && event.endDate > event.startDate && event.endTimeString !== "00:00:00" && event.duration.days > 0;
  const isMultiDayStart = calendarDay.toString().padStart(2, "0") === eventDay;
  const isMultiDayEnd = event.endDateString === calendarDate;

  if (isMultiDay && !isMultiDayStart && !isMultiDayEnd) {
    doc.rect(x, eventY, settings.cellWidth, 4.3, "FD");
  } else if (isMultiDay && isMultiDayStart) {
    doc.rect(x + 3, eventY, settings.cellWidth - 3, 4.3, "FD");

    // Draw the event text inside the pill
    doc.setTextColor(settings.textColor);
    doc.setFont("Ubuntu-R", "normal");
    doc.text(truncateEventText(doc, eventSummary, eventWidth), x + 4.3, eventY + 3);
  } else if (isMultiDay && isMultiDayEnd) {
    doc.rect(x, eventY, eventWidth + 3, 4.3, "FD");
  } else {
    doc.rect(x + 3, eventY, eventWidth, 4.3, "FD");

    // Draw the event text inside the pill
    doc.setTextColor(settings.textColor);
    doc.setFont("Ubuntu-R", "normal");
    doc.text(truncateEventText(doc, eventSummary, eventWidth), x + 4.3, eventY + 3);
  }
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
