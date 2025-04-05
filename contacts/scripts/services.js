import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

let data = localStorage.getItem("contacts") ? JSON.parse(localStorage.getItem("contacts")) : [];

export async function loadContacts(files) {
  const file = files[0];
  if (!file.name.match(/\.(vcf)$/i)) return;

  const text = await file.text();
  const parsedData = ICAL.parse(text);
  data = [];

  for (const element of parsedData) {
    const selection = element[1];
    const contact = { email: [], phone: [] };

    for (const item of selection) {
      if (item[0] === "fn") contact.name = item[3];
      if (item[0] === "nickname") contact.nickname = item[3];
      if (item[0] === "bday") contact.birthday = item[3];
      if (item[0] === "email") contact.email.push(item[3]);
      if (item[0] === "tel") contact.phone.push(item[3]);
      if (item[0] === "adr") contact.homeAddress = item[3].filter(Boolean).join(", ");
      if (item[0] === "title") contact.title = item[3];
      if (item[0] === "org") contact.company = item[3][0];
    }

    data.push(contact);
  }

  data.sort((a, b) => a.name.localeCompare(b.name));
  localStorage.setItem("contacts", JSON.stringify(data));
}

export function getContacts(category) {
  const result = data;

  if (category === "all") return result;
  else return result.filter((contact) => contact.category === category);
}

export async function getContactDetails(location) {
  const request = await fetch(`contact?location=${location}`);
  const result = await request.json();

  result.name = `${result.firstName} ${result.lastName}`;

  if (result.homeStreet && result.homeLocality && result.homeCountry)
    result.homeAddress = `${result.homeStreet}, ${result.homeLocality}, ${result.homeCountry}`;
  else if (result.homeStreet && result.homeCountry) result.homeAddress = `${result.homeStreet}, ${result.homeCountry}`;
  else if (result.homeStreet && result.homeLocality) result.homeAddress = `${result.homeStreet}, ${result.homeLocality}`;
  else if (result.homeLocality && result.homeCountry) result.homeAddress = `${result.homeLocality}, ${result.homeCountry}`;
  else if (result.homeStreet) result.homeAddress = `${result.homeStreet}`;
  else if (result.homeLocality) result.homeAddress = `${result.homeLocality}`;
  else if (result.homeCountry) result.homeAddress = `${result.homeCountry}`;

  if (result.workStreet && result.workLocality && result.workCountry)
    result.homeAddress = `${result.workStreet}, ${result.workLocality}, ${result.workCountry}`;
  else if (result.workStreet && result.workCountry) result.homeAddress = `${result.workStreet}, ${result.workCountry}`;
  else if (result.workStreet && result.workLocality) result.homeAddress = `${result.workStreet}, ${result.workLocality}`;
  else if (result.workLocality && result.workCountry) result.homeAddress = `${result.workLocality}, ${result.workCountry}`;
  else if (result.workStreet) result.homeAddress = `${result.workStreet}`;
  else if (result.workLocality) result.homeAddress = `${result.workLocality}`;
  else if (result.workCountry) result.homeAddress = `${result.workCountry}`;

  return result;
}

export async function updateContactDetails(contactDetails, location) {
  const request = await fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...contactDetails, location: location }),
  });
  const response = await request.text();

  return response;
}

export async function deleteContact(location) {
  const request = await fetch(`/contact?location=${location}`, { method: "DELETE" });
  const response = await request.text();

  return response;
}

export async function createContact(contactDetails) {
  const request = await fetch("/contact", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactDetails),
  });
  const response = await request.text();

  return response;
}
