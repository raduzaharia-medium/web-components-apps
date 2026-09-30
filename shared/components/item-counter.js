export class ItemCounter extends HTMLElement {
  static get observedAttributes() {
    return ["singular", "plural", "order", "value"];
  }

  get singular() {
    return this.getAttribute("singular");
  }
  get plural() {
    return this.getAttribute("plural");
  }
  get order() {
    return this.getAttribute("order");
  }
  get value() {
    return this.getAttribute("value") ?? 0;
  }

  set singular(newValue) {
    this.setAttribute("singular", newValue);
  }
  set plural(newValue) {
    this.setAttribute("plural", newValue);
  }
  set order(newValue) {
    this.setAttribute("order", newValue);
  }
  set value(newValue) {
    this.setAttribute("value", newValue);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <strong></strong>
      <span></span>
    `;

    this.update();
  }

  attributeChangedCallback() {
    if (this.querySelector("strong")) this.update();
  }

  update() {
    const intValue = parseInt(this.value);

    this.querySelector("strong").innerText = `${this.value} ${intValue === 0 || intValue > 1 ? this.plural : this.singular}`;
    this.querySelector("span").innerText = `BY ${this.order}`;
  }
}

customElements.define("item-counter", ItemCounter);
