export class ActionsBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <div>
            <img id="import" data-command="import-opml" title="Import OPML" src="../shared/images/dark/button-load.svg">
            <img id="refresh" data-command="refresh" title="Refresh" src="../shared/images/dark/sync.svg">
        </div>

        <img id="markAsRead" data-command="mark-as-read" title="Mark as read" src="../shared/images/dark/check.svg">`;

    this.querySelectorAll("img").forEach((img) =>
      img.addEventListener("click", (event) => {
        const command = event.target.dataset.command;
        this.dispatchEvent(new CustomEvent(command, { bubbles: true, composed: true }));
      })
    );
  }
}

customElements.define("actions-bar", ActionsBar);
