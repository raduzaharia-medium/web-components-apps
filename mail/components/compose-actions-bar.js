import { ActionsBar } from "../../shared/components/actions-bar.js";

export class ComposeActionsBar extends ActionsBar {
  get markup() {
    return `
      <img id="saveEml" data-command="save-eml" title="Save as .eml file" src="../shared/images/dark/save.svg" />
      <img id="openMailApp" data-command="open-mail-app" title="Open in your mail application" src="../shared/images/dark/check.svg" />`;
  }
}

customElements.define("actions-bar", ComposeActionsBar);
