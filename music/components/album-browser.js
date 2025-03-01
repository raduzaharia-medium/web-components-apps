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
      <ul is="custom-list" id="albumList" class="full-screen">
        <template slot="item">
          <li is="album-list-item"></li>
        </template>
      </ul>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    <section id="songs" class="full-screen has-title has-subtitle">
      <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
      <span id="albumName" class="subtitle"></span>
      <ul is="custom-list" id="songList" class="full-screen">
        <template slot="item">
          <li is="song-list-item"></li>
        </template>
      </ul>
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

        document.querySelector("div.audio-player").setPlaylist(songs);
        document.querySelector("div.audio-player").src = await getFileUrl(selection.file);
        document.querySelector("body").classList.add("song-selected");
      }
    });
  }

  async connectedCallback() {
    await loadAlbums();
  }
}

customElements.define("album-browser", AlbumBrowser);
