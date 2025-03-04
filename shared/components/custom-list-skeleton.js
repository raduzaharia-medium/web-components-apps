export class CustomListSkeleton extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
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
      </div>`;
  }
}

customElements.define("custom-list-skeleton", CustomListSkeleton);
