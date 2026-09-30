export class ActionsBar extends HTMLElement {
  get markup() {
    return "";
  }
  get commandDetail() {
    return null;
  }

  constructor() {
    super();

    this.addEventListener("click", (event) => {
      const command = event.target.closest("[data-command]")?.dataset.command;

      if (command) this.dispatchEvent(new CustomEvent(command, { bubbles: true, composed: true, detail: this.commandDetail }));
    });
  }

  connectedCallback() {
    this.innerHTML = this.markup;
  }
}
