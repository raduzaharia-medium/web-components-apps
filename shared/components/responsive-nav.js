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
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.querySelector("ul")) return;

    if (name === "options") this.render();
    else this.select(newValue);
  }

  render() {
    const options = this.options.split(",").map((element) => element.trim());

    this.innerHTML = `
      <ul>${options.map((element) => `<li data-value="${element.toLowerCase()}">${element}</li>`).join("")}</ul>
      <select name="responsive-nav-selection">${options.map((element) => `<option value="${element.toLowerCase()}">${element}</option>`).join("")}</select>`;

    this.querySelector("select").addEventListener("change", () => {
      this.value = this.querySelector("select").value;
      this.dispatchEvent(new Event("change"));
    });

    this.querySelector("ul").addEventListener("click", (e) => {
      const selection = e.target.closest("li");
      if (!selection) return;

      this.value = selection.dataset.value;
      this.dispatchEvent(new Event("change"));
    });

    this.select(this.value);
  }

  select(value) {
    const selected = (value ?? "").toLowerCase();

    this.querySelector("select").value = selected;
    this.querySelectorAll("ul li.selected").forEach((element) => element.classList.remove("selected"));
    this.querySelector(`ul li[data-value='${selected}']`)?.classList.add("selected");
  }
}

customElements.define("responsive-nav", ResponsiveNav);
