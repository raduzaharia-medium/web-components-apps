import { loadContacts, deleteContact, getContacts, updateContactDetails } from "./scripts/services.js";
import "./components/details-section.js";

history.pushState({ page: "all" }, "Contacts", "./");

window.addEventListener("popstate", handlePopState);

document.addEventListener("category-changed", handleCategoryChange);
document.addEventListener("contact-selected", handleContactSelected);
document.addEventListener("cancel-edit", handleCancelEdit);
document.addEventListener("delete-contact", handleDeleteContact);
document.addEventListener("edit-contact", handleEditContact);
document.addEventListener("new-contact", handleNewContact);
document.addEventListener("commit-edit", handleCommitEdit);
document.addEventListener("import-vcf", handleImportVCF);

function handlePopState(e) {
  if (document.body.classList.contains("edit")) {
    document.body.classList.remove("edit");
    return;
  }

  if (document.body.classList.contains("contact-selected")) {
    this.refreshContacts();
    return;
  }

  if (!e.state || !e.state.page) return;

  history.back();
  this.refreshContacts();
}

function handleCategoryChange() {
  document.body.classList.remove("edit");
  document.body.classList.remove("contact-selected");

  document.querySelector("section").innerHTML = "";
  document.querySelector("contacts-section").classList.add("loading");

  const category = document.querySelector("responsive-nav").value;
  const contacts = getContacts(category);

  document.querySelector("contacts-section item-counter").value = contacts.length;
  document.querySelector("contacts-section custom-list").setItems(contacts);
  document.querySelector("contacts-section").classList.remove("loading");
}

function handleContactSelected() {
  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  document.body.classList.add("contact-selected");
  document.querySelector("selected-item-nav").value = selection.item;
  document.querySelector("section").innerHTML = `<details-section></details-section>`;

  document.querySelector("details-section").classList.add("loading");
  document.body.classList.add("contact-selected");
  document.body.classList.remove("edit");

  document.querySelector("details-section").data = selection;

  history.pushState({ page: selection.name }, "Contacts", "./");
  document.querySelector("selected-item-nav").value = selection.name;
  document.querySelector("details-section").classList.remove("loading");
}

function handleCancelEdit() {
  document.querySelector("section").innerHTML = `<details-section></details-section>`;
  document.body.classList.remove("edit");

  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  document.querySelector("details-section").data = selection;
}

function handleDeleteContact() {
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
}

function handleEditContact() {
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
}

function handleNewContact() {
  document.querySelector("section").innerHTML = `<edit-section></edit-section>`;

  document.querySelector("edit-section").classList.add("loading");
  document.body.classList.add("contact-selected");
  document.body.classList.add("edit");

  history.pushState({ page: "new-contact" }, "Contacts", "./");
  document.querySelector("edit-section").classList.remove("loading");
}

function handleCommitEdit() {
  const selection = document.querySelector("edit-section").data;
  if (!selection) return;

  updateContactDetails(selection.uid, selection);

  document.body.classList.remove("edit");
  document.querySelector("section").innerHTML = `<details-section></details-section>`;

  const category = document.querySelector("responsive-nav").value;
  const contacts = getContacts(category);

  document.querySelector("contacts-section custom-list").setItems(contacts);
  document.querySelector("contacts-section custom-list").select(selection.uid);
}

function handleImportVCF() {
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
}
