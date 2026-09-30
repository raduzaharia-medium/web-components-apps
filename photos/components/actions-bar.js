import { ActionsBar } from "../../shared/components/actions-bar.js";

export class PhotosActionsBar extends ActionsBar {
  get markup() {
    return `
      <img id="load" data-command="load-photos" title="Load photos" src="../shared/images/dark/button-load.svg" />`;
  }
}

customElements.define("actions-bar", PhotosActionsBar);
