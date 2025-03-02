export class AlbumsSection extends HTMLElement {
  get selection() {
    return this.querySelector("custom-list").value;
  }

  constructor() {
    super();

    this.innerHTML = `
        <item-counter id="albumCount" singular="album" plural="albums" order="date added"></item-counter>
        <custom-list id="albumList" class="full-screen">
          <template slot="item">
            <album-list-item></album-list-item>
          </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        this.dispatchEvent(new Event("change"));
      }
    });
  }
}

customElements.define("albums-section", AlbumsSection);
