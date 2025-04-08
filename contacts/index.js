import { loadContacts, deleteContact, getContacts, updateContactDetails } from "./scripts/services.js";
import "./components/details-section.js";

history.pushState({ page: "all" }, "Contacts", "./");

document.querySelector("contacts-section custom-list").addEventListener("change", async () => {
  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  document.querySelector("section").innerHTML = `<details-section></details-section>`;

  document.querySelector("details-section").classList.add("loading");
  document.body.classList.add("contact-selected");
  document.body.classList.remove("edit");

  document.querySelector("details-section").data = selection;

  history.pushState({ page: selection.name }, "Contacts", "./");
  document.querySelector("selected-item-nav").value = selection.name;
  document.querySelector("details-section").classList.remove("loading");
});

document.addEventListener("cancel-edit", async () => {
  document.querySelector("section").innerHTML = `<details-section></details-section>`;
  document.body.classList.remove("edit");

  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  document.querySelector("details-section").data = selection;
});

document.addEventListener("delete-contact", async () => {
  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  if (confirm("Are you sure?")) {
    document.querySelector("contacts-section").classList.add("loading");

    const result = deleteContact(selection.uid);
    if (result === "OK") {
      const category = document.querySelector("responsive-nav").value;
      const contacts = getContacts(category);

      document.querySelector("contacts-section custom-list").setItems(contacts);
    }

    document.querySelector("contacts-section").classList.remove("loading");
  }
});

document.addEventListener("edit-contact", async () => {
  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  document.querySelector("section").innerHTML = `<edit-section></edit-section>`;

  document.querySelector("edit-section").classList.add("loading");
  document.body.classList.add("contact-selected");
  document.body.classList.add("edit");

  document.querySelector("edit-section").data = selection;

  history.pushState({ page: selection.name }, "Contacts", "./");
  document.querySelector("selected-item-nav").value = selection.name;
  document.querySelector("edit-section").classList.remove("loading");
});

document.addEventListener("commit-edit", async () => {
  const selection = document.querySelector("edit-section").data;
  if (!selection) return;

  updateContactDetails(selection.uid, selection);

  document.body.classList.remove("edit");
  document.querySelector("section").innerHTML = `<details-section></details-section>`;

  const category = document.querySelector("responsive-nav").value;
  const contacts = getContacts(category);

  document.querySelector("contacts-section custom-list").setItems(contacts);
  document.querySelector("contacts-section custom-list").select(selection.uid);
});

document.addEventListener("load-contacts", async () => {
  const filePicker = document.createElement("input");

  filePicker.type = "file";
  filePicker.click();

  filePicker.addEventListener("change", async () => {
    document.body.classList.remove("edit");
    document.body.classList.remove("contact-selected");

    document.querySelector("section").innerHTML = "";
    document.querySelector("contacts-section").classList.add("loading");

    await loadContacts(filePicker.files);

    const category = document.querySelector("responsive-nav").value;
    const contacts = getContacts(category);

    document.querySelector("contacts-section custom-list").setItems(contacts);
    document.querySelector("contacts-section").classList.remove("loading");
  });
});
