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

    const behavior = this.getAttribute("behavior");

    this.innerHTML = `
        <img src="../shared/images/dark/left-arrow.svg">
        <span>${this.value}</span>
    `;

    if (behavior === "back-button") this.addEventListener("click", () => history.back());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") this.querySelector("span").innerHTML = newValue;
  }
}

customElements.define("selected-item-nav", SelectedItemNav);
