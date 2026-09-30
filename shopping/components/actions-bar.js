import { ActionsBar } from "../../shared/components/actions-bar.js";

export class ShoppingActionsBar extends ActionsBar {
  get markup() {
    return `
      <img id="save" data-command="save" title="Save" src="../shared/images/dark/save.svg" />`;
  }
}

customElements.define("actions-bar", ShoppingActionsBar);
