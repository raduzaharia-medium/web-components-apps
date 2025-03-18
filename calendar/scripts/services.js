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
