export class SelectedItemNav extends HTMLElement {
  static get observedAttributes() {
    return ["value"];
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
  }

  constructor() {
    super();

    this.addEventListener("click", () => {
      if (this.getAttribute("behavior") === "back-button") history.back();
    });
  }

  connectedCallback() {
    this.innerHTML = `
      <img src="../shared/images/dark/left-arrow.svg">
      <span></span>
    `;

    this.querySelector("span").textContent = this.value ?? "";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const span = this.querySelector("span");

    if (name === "value" && span) span.textContent = newValue ?? "";
  }
}

customElements.define("selected-item-nav", SelectedItemNav);
