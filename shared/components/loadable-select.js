export class LoadableSelect extends HTMLSelectElement {
  get items() {
    return (
      this.getAttribute("items").split(",") ?? [...this.querySelectorAll("option")].map((element) => element.value)
    );
  }
  set items(newValue) {
    this.removeAttribute("items");
    this.removeAttribute("preset");

    this.innerHTML = getOptionNodes(newValue);
  }

  constructor() {
    super();

    if (this.getAttribute("preset") === "months") {
      this.innerHTML = `<option value="1">january</option>
        <option value="2">february</option>
        <option value="3">march</option>
        <option value="4">april</option>
        <option value="5">may</option>
        <option value="6">june</option>
        <option value="7">july</option>
        <option value="8">august</option>
        <option value="9">september</option>
        <option value="10">october</option>
        <option value="11">november</option>
        <option value="12">december</option>`;
    } else if (this.getAttribute("preset") === "range") {
      const from = parseInt(this.getAttribute("from"));
      const to = parseInt(this.getAttribute("to"));

      for (let i = from; i <= to; i++) {
        const option = document.createElement("option");

        option.innerText = i;
        option.value = i;

        this.appendChild(option);
      }
    } else this.innerHTML = getOptionNodes(this.items);
  }
}

function getOptionNodes(items) {
  const optionNodes = items.map((element) => `<option value="${element.toLowerCase()}">${element}</option>`);
  return `${optionNodes.join("")}`;
}

customElements.define("loadable-select", LoadableSelect, { extends: "select" });
