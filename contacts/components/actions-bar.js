import { ActionsBar } from "../../shared/components/actions-bar.js";

export class ContactsActionsBar extends ActionsBar {
  get markup() {
    return `
      <img id="editContact" data-command="edit-contact" title="Edit" src="../shared/images/dark/edit.svg" />
      <img id="newContact" data-command="new-contact" title="New contact" src="../shared/images/dark/plus.svg" />
      <img id="deleteContact" data-command="delete-contact" title="Delete" src="../shared/images/dark/delete.svg" />

      <img id="cancelEdit" data-command="cancel-edit" title="Cancel" src="../shared/images/dark/cancel.svg" />
      <img id="commitEdit" data-command="commit-edit" title="Save" src="../shared/images/dark/save.svg" />
      <img id="loadContacts" data-command="import-vcf" title="Import VCF" src="../shared/images/dark/button-load.svg" />`;
  }
}

customElements.define("actions-bar", ContactsActionsBar);
