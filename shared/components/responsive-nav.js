export class ResponsiveNav extends HTMLElement {
  static get observedAttributes() {
    return ["value", "options"];
  }

  get value() {
    return this.getAttribute("value");
  }
  get options() {
    return this.getAttribute("options");
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
  }
  set options(newValue) {
    this.setAttribute("options", newValue);
  }

  constructor() {
    super();

    this.innerHTML = `
      <ul>${this.options
        .split(",")
        .map((element) => `<li class="${element.trim() === this.value ? "selected" : ""}" data-value="${element.trim().toLowerCase()}">${element.trim()}</li>`)
        .join("")}
      </ul>
      <select class="mobile-only">${this.options
        .split(",")
        .map((element) => `<option value="${element.trim().toLowerCase()}">${element.trim()}</option>`)
        .join("")}
      </select>`;

    this.querySelector("select").addEventListener("change", () => {
      this.value = this.querySelector("select").value;
      this.dispatchEvent(new Event("change"));
    });

    this.querySelector("ul").addEventListener("click", (e) => {
      const selection = e.target.closest("li");

      this.value = selection.dataset.value;
      this.dispatchEvent(new Event("change"));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    newValue = newValue.toLowerCase();

    if (name === "options") {
      this.querySelector("ul").items = newValue.split(",");
      this.querySelector("select").items = newValue.split(",");
    } else if (name === "value") {
      this.querySelector("select").value = newValue.split(",");

      if (oldValue) {
        const selection = this.querySelector(`ul li[data-value='${oldValue}']`);
        if (selection) selection.classList.remove("selected");
      }
      this.querySelector(`ul li[data-value='${newValue}']`).classList.add("selected");
    }
  }
}

customElements.define("responsive-nav", ResponsiveNav);
