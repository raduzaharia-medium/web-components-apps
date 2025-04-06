import { loadContacts, deleteContact, getContacts } from "../scripts/services.js";
import "./edit-section.js";

export class ActionsBar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
        <img id="editContact" src="../shared/images/dark/edit.svg">
        <img id="newContact" src="../shared/images/dark/plus.svg">
        <img id="deleteContact" src="../shared/images/dark/delete.svg">

        <img id="cancelEdit" src="../shared/images/dark/cancel.svg">
        <img id="commitEdit" src="../shared/images/dark/save.svg">
        <img id="loadContacts" src="../shared/images/dark/button-load.svg">`;

    this.querySelector("#cancelEdit").addEventListener("click", () => {
      document.querySelector("section").innerHTML = `<details-section></details-section>`;
      document.body.classList.remove("edit");

      const selection = document.querySelector("contacts-section custom-list").selectedData;
      if (!selection) return;
      document.querySelector("details-section").data = selection;
    });

    this.querySelector("#deleteContact").addEventListener("click", () => {
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

    this.querySelector("#editContact").addEventListener("click", () => {
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

    this.querySelector("#loadContacts").addEventListener("click", async () => {
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
  }
}

customElements.define("actions-bar", ActionsBar);
