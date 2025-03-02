export class ArtistsSection extends HTMLElement {
  get selection() {
    return this.querySelector("custom-list").value;
  }

  constructor() {
    super();

    this.innerHTML = `
        <item-counter id="artistCount" singular="artist" plural="artists" order="a-z"></item-counter>
        <input id="artistFilter" type="text" placeholder="search..." />
        <custom-list id="artistList" class="full-screen">
            <template slot="item">
            <artist-list-item></artist-list-item>
            </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("keyup", (e) => {
      this.querySelector("custom-list").filter(this.querySelector("input").value);
    });
    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").value;

      if (selection) {
        document.querySelector("body").classList.add("artist-selected");
        document.querySelector("selected-item-nav").value = selection;

        this.dispatchEvent(new Event("change"));
      }
    });
  }
}

customElements.define("artists-section", ArtistsSection);
