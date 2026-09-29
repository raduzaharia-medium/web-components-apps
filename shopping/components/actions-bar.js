export class ActionsBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<img id="save" data-command="save" title="Save" src="../shared/images/dark/save.svg">`;

    this.querySelectorAll("img").forEach((img) =>
      img.addEventListener("click", (event) => {
        const command = event.target.dataset.command;
        this.dispatchEvent(new CustomEvent(command, { bubbles: true, composed: true }));
      })
    );
  }
}

customElements.define("actions-bar", ActionsBar);
