export class ActionTag extends HTMLElement {
  #tag = null;

  get text() {
    return this.querySelector("span").innerText;
  }
  get tag() {
    return this.#tag;
  }

  set text(newValue) {
    this.querySelector("span").innerText = newValue;
  }
  set tag(newValue) {
    this.#tag = newValue;
  }

  constructor() {
    super();

    this.addEventListener("click", (e) => {
      if (e.target.closest("img") && this.getAttribute("behavior") === "delete") this.remove();
    });
  }

  connectedCallback() {
    this.innerHTML = `
      <span></span>
      <img src="../shared/images/light/cancel.svg">
    `;
  }
}

customElements.define("action-tag", ActionTag);
