export class ActionsBar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
        <img class="danger" id="delete" data-command="delete" src="../shared/images/dark/delete.svg">
        <img id="cancel" data-command="cancel" src="../shared/images/dark/cancel.svg">
        <img id="save" data-command="save" src="../shared/images/dark/save.svg">

        <img id="exportPDF" data-command="export-pdf" src="../shared/images/dark/save.svg">
        <img id="importICS" data-command="import-ics" src="../shared/images/dark/button-load.svg">`;
  }

  connectedCallback() {
    this.querySelectorAll("img").forEach((img) =>
      img.addEventListener("click", (event) => {
        const command = event.target.dataset.command;
        this.dispatchEvent(new CustomEvent(command, { bubbles: true, composed: true }));
      })
    );
  }
}

customElements.define("actions-bar", ActionsBar);
