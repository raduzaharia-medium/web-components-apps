export class LoadableUl extends HTMLUListElement {
  get items() {
    return (
      this.getAttribute("items").split(",") ?? [...this.querySelectorAll("li")].map((element) => element.dataset.value)
    );
  }
  set items(newValue) {
    this.removeAttribute("items");
    this.innerHTML = getOptionNodes(newValue);
  }

  constructor() {
    super();
    this.innerHTML = getOptionNodes(this.items);
  }
}

function getOptionNodes(items) {
  const optionNodes = items.map((element) => `<li data-value="${element.toLowerCase()}">${element}</li>`);
  return `${optionNodes.join("")}`;
}

customElements.define("loadable-ul", LoadableUl, { extends: "ul" });
