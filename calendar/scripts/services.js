export async function getEvents(year, month) {
  const response = await fetch(`/data?year=${year}&month=${month}`);
  const events = await response.json();

  events.sort((a, b) => {
    if (
      a.endDate &&
      a.endDate > a.startDate &&
      (!b.endDate || b.endDate === b.startDate)
    )
      return -1;
    if (
      b.endDate &&
      b.endDate > b.startDate &&
      (!a.endDate || a.endDate === a.startDate)
    )
      return 1;

    return (
      parseInt(a.startDate.substr(8, 2)) - parseInt(b.startDate.substr(8, 2))
    );
  });

  return events;
}

export async function saveEvent(event) {
  event.id = null;

  await fetch('/data', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event)
  });
}

export async function deleteEvent(event) {
  await fetch('/data', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event)
  });
}
