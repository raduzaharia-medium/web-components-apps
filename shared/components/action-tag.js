export class ActionTag extends HTMLSpanElement {
  tag = null;

  get text() {
    return this.querySelector("span").innerText;
  }
  get tag() {
    return this.tag;
  }

  set text(newValue) {
    this.querySelector("span").innerText = newValue;
  }
  set tag(newValue) {
    this.tag = newValue;
  }

  constructor() {
    super();

    this.classList.add("action-tag");
    this.innerHTML = `
      <span></span>
      <img src="/shared/images/light/cancel.svg">
    `;

    this.querySelector("img").addEventListener("click", () => {
      if (this.getAttribute("behavior") === "delete") this.remove();
    });
  }
}

customElements.define("action-tag", ActionTag, { extends: "span" });
