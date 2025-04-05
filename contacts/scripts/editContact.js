import { createContact, getContactDetails, updateContactDetails } from "./services.js";

document.getElementById("editContact").addEventListener("click", async () => {
  const selection = document.getElementById("contactList").selectedData;
  if (!selection) return;

  document.getElementById("editDetails").classList.add("loading");
  clearEditContactDetails();
  await loadContactDetails(selection.category, selection.location);
  document.body.classList.add("edit");

  history.pushState({ page: "edit" }, "Contacts", "/");
  document.getElementById("editDetails").classList.remove("loading");
});
document.getElementById("newContact").addEventListener("click", () => {
  clearEditContactDetails();
  document.getElementById("contactList").clearSelection();
  document.body.classList.remove("contact-selected");

  document.body.classList.add("edit");
  document.body.classList.add("new");

  history.pushState({ page: "edit" }, "Contacts", "/");
});

document.getElementById("cancelEdit").addEventListener("click", () => {
  document.body.classList.remove("edit");
});
document.getElementById("commitEdit").addEventListener("click", async () => {
  const selection = document.getElementById("contactList").selectedData;
  if (!document.body.classList.contains("new") && !selection) return;

  let result = "OK";
  if (document.body.classList.contains("new")) {
    result = await createNewContact();
  } else {
    result = await saveContactDetails(selection.location);
  }

  if (result === "OK") document.body.classList.remove("edit");
});

export function clearEditContactDetails() {
  document.getElementById("uid").value = "";
  document.getElementById("editGender").value = "";
  document.getElementById("editCategory").value = "";

  document.getElementById("editFirstName").value = "";
  document.getElementById("editLastName").value = "";
  document.getElementById("editNickname").value = "";

  document.getElementById("editBirthday").value = "";

  document.getElementById("editJobTitle").value = "";
  document.getElementById("editJobCompany").value = "";

  document.getElementById("editHomeStreet").value = "";
  document.getElementById("editHomeLocality").value = "";
  document.getElementById("editHomeCountry").value = "";

  document.getElementById("editWorkStreet").value = "";
  document.getElementById("editWorkLocality").value = "";
  document.getElementById("editWorkCountry").value = "";

  document.querySelectorAll("#editEmailInfo li.existing").forEach((element) => element.remove());
  document.querySelectorAll("#editPhoneInfo li.existing").forEach((element) => element.remove());
}

async function loadContactDetails(category, location) {
  const selection = await getContactDetails(location);

  document.getElementById("uid").value = selection.uid;
  document.getElementById("editGender").value = selection.gender;
  document.getElementById("editCategory").value = category;

  document.getElementById("editFirstName").value = selection.firstName ?? "";
  document.getElementById("editLastName").value = selection.lastName ?? "";
  document.getElementById("editNickname").value = selection.nickname ?? "";

  document.getElementById("editBirthday").value = selection.birthday ?? "";

  document.getElementById("editJobTitle").value = selection.title ?? "";
  document.getElementById("editJobCompany").value = selection.company ?? "";

  document.getElementById("editHomeStreet").value = selection.homeStreet ?? "";
  document.getElementById("editHomeLocality").value = selection.homeLocality ?? "";
  document.getElementById("editHomeCountry").value = selection.homeCountry ?? "";

  document.getElementById("editWorkStreet").value = selection.workStreet ?? "";
  document.getElementById("editWorkLocality").value = selection.workLocality ?? "";
  document.getElementById("editWorkCountry").value = selection.workCountry ?? "";

  for (const element of selection.emails) {
    const emailContainer = document.createElement("li");
    const emailNode = document.createElement("input");

    emailContainer.classList.add("existing");
    emailNode.value = element;
    emailNode.placeholder = "Email address";

    emailContainer.appendChild(emailNode);
    document.getElementById("editEmailInfo").appendChild(emailContainer);
  }

  for (const element of selection.phoneNumbers) {
    const phoneContainer = document.createElement("li");
    const phoneNode = document.createElement("input");

    phoneContainer.classList.add("existing");
    phoneNode.value = element;
    phoneNode.placeholder = "Phone number";

    phoneContainer.appendChild(phoneNode);
    document.getElementById("editPhoneInfo").appendChild(phoneContainer);
  }
}

async function saveContactDetails(location) {
  const contactDetails = {};

  contactDetails.category = document.getElementById("editCategory").value;
  contactDetails.emails = [...document.querySelectorAll("#editEmailInfo input")].map((element) => element.value).filter((element) => element.length > 0);
  contactDetails.phoneNumbers = [...document.querySelectorAll("#editPhoneInfo input")].map((element) => element.value).filter((element) => element.length > 0);

  if (document.getElementById("uid").value) contactDetails.uid = document.getElementById("uid").value;
  if (document.getElementById("editGender").value) contactDetails.gender = document.getElementById("editGender").value;
  if (document.getElementById("editFirstName").value) contactDetails.firstName = document.getElementById("editFirstName").value;
  if (document.getElementById("editLastName").value) contactDetails.lastName = document.getElementById("editLastName").value;
  if (document.getElementById("editNickname").value) contactDetails.nickname = document.getElementById("editNickname").value;
  if (document.getElementById("editBirthday").value) contactDetails.birthday = document.getElementById("editBirthday").value;
  if (document.getElementById("editJobTitle").value) contactDetails.title = document.getElementById("editJobTitle").value;
  if (document.getElementById("editJobCompany").value) contactDetails.company = document.getElementById("editJobCompany").value;
  if (document.getElementById("editHomeStreet").value) contactDetails.homeStreet = document.getElementById("editHomeStreet").value;
  if (document.getElementById("editHomeLocality").value) contactDetails.homeLocality = document.getElementById("editHomeLocality").value;
  if (document.getElementById("editHomeCountry").value) contactDetails.homeCountry = document.getElementById("editHomeCountry").value;
  if (document.getElementById("editWorkStreet").value) contactDetails.workStreet = document.getElementById("editWorkStreet").value;
  if (document.getElementById("editWorkLocality").value) contactDetails.workLocality = document.getElementById("editWorkLocality").value;
  if (document.getElementById("editWorkCountry").value) contactDetails.workCountry = document.getElementById("editWorkCountry").value;

  const result = await updateContactDetails(contactDetails, location);

  return result;
}

async function createNewContact() {
  const contactDetails = {};

  contactDetails.category = document.getElementById("editCategory").value;
  contactDetails.emails = [...document.querySelectorAll("#editEmailInfo input")].map((element) => element.value).filter((element) => element.length > 0);
  contactDetails.phoneNumbers = [...document.querySelectorAll("#editPhoneInfo input")].map((element) => element.value).filter((element) => element.length > 0);
  contactDetails.uid = uuidv4();

  if (document.getElementById("editGender").value) contactDetails.gender = document.getElementById("editGender").value;
  if (document.getElementById("editFirstName").value) contactDetails.firstName = document.getElementById("editFirstName").value;
  if (document.getElementById("editLastName").value) contactDetails.lastName = document.getElementById("editLastName").value;
  if (document.getElementById("editNickname").value) contactDetails.nickname = document.getElementById("editNickname").value;
  if (document.getElementById("editBirthday").value) contactDetails.birthday = document.getElementById("editBirthday").value;
  if (document.getElementById("editJobTitle").value) contactDetails.title = document.getElementById("editJobTitle").value;
  if (document.getElementById("editJobCompany").value) contactDetails.company = document.getElementById("editJobCompany").value;
  if (document.getElementById("editHomeStreet").value) contactDetails.homeStreet = document.getElementById("editHomeStreet").value;
  if (document.getElementById("editHomeLocality").value) contactDetails.homeLocality = document.getElementById("editHomeLocality").value;
  if (document.getElementById("editHomeCountry").value) contactDetails.homeCountry = document.getElementById("editHomeCountry").value;
  if (document.getElementById("editWorkStreet").value) contactDetails.workStreet = document.getElementById("editWorkStreet").value;
  if (document.getElementById("editWorkLocality").value) contactDetails.workLocality = document.getElementById("editWorkLocality").value;
  if (document.getElementById("editWorkCountry").value) contactDetails.workCountry = document.getElementById("editWorkCountry").value;

  const result = await createContact(contactDetails);

  return result;
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
