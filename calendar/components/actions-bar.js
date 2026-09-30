import { ActionsBar } from "../../shared/components/actions-bar.js";

export class CalendarActionsBar extends ActionsBar {
  get markup() {
    return `
      <div id="event">
        <img id="delete" data-command="delete" title="Delete" src="../shared/images/dark/delete.svg" />

        <div>
          <img id="cancel" data-command="cancel" title="Cancel" src="../shared/images/dark/cancel.svg" />
          <img id="save" data-command="save" title="Save" src="../shared/images/dark/save.svg" />
        </div>
      </div>

      <div id="data">
        <img id="exportPDF" data-command="export-pdf" title="Export PDF" src="../shared/images/dark/save.svg" />
        <img id="importICS" data-command="import-ics" title="Import ICS" src="../shared/images/dark/button-load.svg" />
      </div>`;
  }
}

customElements.define("actions-bar", CalendarActionsBar);
