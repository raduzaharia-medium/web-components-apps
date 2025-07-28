export class ActionsBar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
        <div id="event">
          <img id="delete" data-command="delete" src="../shared/images/dark/delete.svg">

          <div>
            <img id="cancel" data-command="cancel" src="../shared/images/dark/cancel.svg">
            <img id="save" data-command="save" src="../shared/images/dark/save.svg">
          </div>
        </div>

        <div id="data">
          <img id="exportPDF" data-command="export-pdf" src="../shared/images/dark/save.svg">
          <img id="importICS" data-command="import-ics" src="../shared/images/dark/button-load.svg">
        </div>`;
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
