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
      if (item[0] === "uid") contact.uid = item[3][0];
    }

    if (!contact.uid) contact.uid = uuidv4();
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

export function deleteContact(uid) {
  data = data.filter((contact) => contact.uid !== uid);
  return "OK";
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

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
