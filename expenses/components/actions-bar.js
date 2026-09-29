export class ActionsBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <div>
            <img id="addRow" data-command="add-row" title="Add row" src="../shared/images/dark/plus.svg">
            <img id="removeRow" data-command="remove-row" title="Remove selected row" src="../shared/images/dark/minus.svg">
        </div>

        <div>
            <img id="import" data-command="import-json" title="Import JSON" src="../shared/images/dark/button-load.svg">
            <img id="export" data-command="export-json" title="Export JSON" src="../shared/images/dark/down-arrow.svg">
            <img id="save" data-command="save" title="Save" src="../shared/images/dark/save.svg">
        </div>`;

    this.querySelectorAll("img").forEach((img) =>
      img.addEventListener("click", (event) => {
        const command = event.target.dataset.command;
        this.dispatchEvent(new CustomEvent(command, { bubbles: true, composed: true }));
      })
    );
  }
}

customElements.define("actions-bar", ActionsBar);
