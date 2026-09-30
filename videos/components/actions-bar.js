import { ActionsBar } from "../../shared/components/actions-bar.js";

export class VideosActionsBar extends ActionsBar {
  get markup() {
    return `
      <img id="load" data-command="load-videos" title="Load videos" src="../shared/images/dark/button-load.svg" />`;
  }
}

customElements.define("actions-bar", VideosActionsBar);
