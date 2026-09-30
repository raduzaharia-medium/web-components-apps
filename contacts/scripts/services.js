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
      if (item[0] === "org") contact.company = first(item[3]);
      if (item[0] === "uid") contact.uid = first(item[3]);
      if (item[0] === "gender") contact.gender = first(item[3]);
      if (item[0] === "categories") contact.category = first(item[3]);
    }

    if (!contact.uid) contact.uid = uuidv4();
    data.push(contact);
  }

  data.sort((a, b) => a.name.localeCompare(b.name));
  saveContacts();
}

export function getContacts(category) {
  const result = data;

  if (category === "all") return result;
  else return result.filter((contact) => contact.category === category);
}

export async function updateContactDetails(uid, contactDetails) {
  const selection = data.filter((contact) => contact.uid === uid)[0];
  if (!selection) return "Contact not found";

  selection.name = contactDetails.name;
  selection.nickname = contactDetails.nickname;
  selection.birthday = contactDetails.birthday;
  selection.title = contactDetails.title;
  selection.company = contactDetails.company;
  selection.homeAddress = contactDetails.homeAddress;
  selection.phone = contactDetails.phone;
  selection.email = contactDetails.email;
  selection.category = contactDetails.category;
  selection.gender = contactDetails.gender;

  saveContacts();
  return "OK";
}

export function deleteContact(uid) {
  data = data.filter((contact) => contact.uid !== uid);

  saveContacts();
  return "OK";
}

export async function createContact(contactDetails) {
  const contact = { ...contactDetails, uid: uuidv4() };

  data.push(contact);
  data.sort((a, b) => a.name.localeCompare(b.name));

  saveContacts();
  return contact.uid;
}

// ical.js returns single values as strings and structured values as arrays
function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(data));
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
