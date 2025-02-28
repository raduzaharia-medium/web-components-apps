export class ActionInput extends HTMLDivElement {
  static get observedAttributes() {
    return ["value", "placeholder"];
  }

  get value() {
    return this.getAttribute("value");
  }
  get placeholder() {
    return this.getAttribute("placeholder");
  }
  get trigger() {
    return this.getAttribute("trigger");
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
  }
  set placeholder(newValue) {
    this.setAttribute("placeholder", newValue);
  }
  set trigger(newValue) {
    this.setAttribute("trigger", newValue);
  }

  constructor() {
    super();

    this.innerHTML = `
      <input part="input" type="text" placeholder="${this.placeholder}" />
    `;

    this.querySelector("input").addEventListener("keyup", (e) => {
      this.value = this.querySelector("input").value;

      if (this.trigger === "enter" && e.key === "Enter") this.dispatchEvent(new Event("action"));
      else if (this.trigger === "any") this.dispatchEvent(new Event("action"));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "placeholder") this.querySelector("input").setAttribute("placeholder", newValue);
    else if (name === "value") this.querySelector("input").value = newValue;
  }
}

customElements.define("action-input", ActionInput, { extends: "div" });
