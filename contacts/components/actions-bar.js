import "./edit-section.js";

export class ActionsBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <img id="editContact" data-command="edit-contact" src="../shared/images/dark/edit.svg">
        <img id="newContact" data-command="new-contact" src="../shared/images/dark/plus.svg">
        <img id="deleteContact" data-command="delete-contact" src="../shared/images/dark/delete.svg">

        <img id="cancelEdit" data-command="cancel-edit" src="../shared/images/dark/cancel.svg">
        <img id="commitEdit" data-command="commit-edit" src="../shared/images/dark/save.svg">
        <img id="loadContacts" data-command="import-vcf" src="../shared/images/dark/button-load.svg">`;

    this.querySelectorAll("img").forEach((img) =>
      img.addEventListener("click", (event) => {
        const command = event.target.dataset.command;
        this.dispatchEvent(new CustomEvent(command, { bubbles: true, composed: true }));
      })
    );
  }
}

customElements.define("actions-bar", ActionsBar);
