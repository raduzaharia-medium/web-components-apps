import "./album-list-item.js";
import "./song-list-item.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadAlbums, loadSongsForArtist } from "../scripts/lists.js";
import { getFileUrl } from "../scripts/services.js";

export class AlbumBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "albums" }, "Music - browse by album", ".");

    this.innerHTML = `<section id="albums" class="full-screen has-title has-input">
      <item-counter id="albumCount" singular="album" plural="albums" order="date added"></item-counter>
      <input id="albumFilter" type="text" placeholder="search..." />
      <custom-list id="albumList" class="full-screen">
        <template slot="item">
          <album-list-item></album-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    <section id="songs" class="full-screen has-title has-subtitle">
      <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
      <span id="albumName" class="subtitle"></span>
      <custom-list id="songList" class="full-screen">
        <template slot="item">
          <song-list-item></song-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    `;

    this.querySelector("#albumFilter").addEventListener("keyup", () => {
      this.querySelector("#albumList").filter(this.querySelector("#albumFilter").value);
    });
    this.querySelector("#albumList").addEventListener("change", async () => {
      const selection = this.querySelector("#albumList").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        this.querySelector("#albumName").innerText = selection.item;
        document.querySelector("selected-item-nav").value = selection.item;

        await loadSongsForArtist(selection.artist, selection.item);
      }
    });
    this.querySelector("#songList").addEventListener("change", async () => {
      const selection = this.querySelector("#songList").selectedData;

      if (selection) {
        const songs = this.querySelector("#songList").allData;

        document.querySelector("audio-player").setPlaylist(songs);
        document.querySelector("audio-player").src = await getFileUrl(selection.file);
        document.querySelector("body").classList.add("song-selected");
      }
    });
  }

  async connectedCallback() {
    await loadAlbums();
  }
}

customElements.define("album-browser", AlbumBrowser);
