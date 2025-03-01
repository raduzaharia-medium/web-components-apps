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

    // TODO: put them in teir own components
    // if (this.getAttribute("preset") === "months") {
    //   this.innerHTML = `<option value="1">january</option>
    //     <option value="2">february</option>
    //     <option value="3">march</option>
    //     <option value="4">april</option>
    //     <option value="5">may</option>
    //     <option value="6">june</option>
    //     <option value="7">july</option>
    //     <option value="8">august</option>
    //     <option value="9">september</option>
    //     <option value="10">october</option>
    //     <option value="11">november</option>
    //     <option value="12">december</option>`;
    // } else if (this.getAttribute("preset") === "range") {
    //   const from = parseInt(this.getAttribute("from"));
    //   const to = parseInt(this.getAttribute("to"));

    //   for (let i = from; i <= to; i++) {
    //     const option = document.createElement("option");

    //     option.innerText = i;
    //     option.value = i;

    //     this.appendChild(option);
    //   }
    // }

    this.innerHTML = `
      <ul class="desktop-only">${this.options
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
