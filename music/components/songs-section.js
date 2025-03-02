export class SongsSection extends HTMLElement {
  get selection() {
    return this.querySelector("custom-list").value;
  }

  constructor() {
    super();

    this.innerHTML = `
        <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
        <span id="albumName" class="subtitle"></span>
        <custom-list id="songList" class="full-screen">
          <template slot="item">
            <song-list-item></song-list-item>
          </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("custom-list").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("song-selected");
        this.dispatchEvent(new Event("change"));
      }
    });
  }
}

customElements.define("songs-section", SongsSection);
