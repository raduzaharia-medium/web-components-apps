export class CustomListSkeleton extends HTMLDivElement {
  constructor() {
    super();

    this.classList.add("custom-list-skeleton");
    this.innerHTML = `
      <div class="loading">
        <div class="loader-container">
          <div class="loader-item">
            <div class="loader small-heading"></div>
          </div>

          <div class="loader-item">
            <div class="loader circle"></div>
            <div class="loader line"></div>
          </div>
          <div class="loader-item">
            <div class="loader circle"></div>
            <div class="loader line"></div>
          </div>
          <div class="loader-item">
            <div class="loader circle"></div>
            <div class="loader line"></div>
          </div>
          <div class="loader-item">
            <div class="loader circle"></div>
            <div class="loader line"></div>
          </div>
          <div class="loader-item">
            <div class="loader circle"></div>
            <div class="loader line"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("custom-list-skeleton", CustomListSkeleton, { extends: "div" });
