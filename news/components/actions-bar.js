import { ActionsBar } from "../../shared/components/actions-bar.js";

export class NewsActionsBar extends ActionsBar {
  get markup() {
    return `
      <div>
        <img id="import" data-command="import-opml" title="Import OPML" src="../shared/images/dark/button-load.svg" />
        <img id="refresh" data-command="refresh" title="Refresh" src="../shared/images/dark/sync.svg" />
      </div>

      <img id="markAsRead" data-command="mark-as-read" title="Mark as read" src="../shared/images/dark/check.svg" />`;
  }
}

customElements.define("actions-bar", NewsActionsBar);
