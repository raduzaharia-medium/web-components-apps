import "./album-list-item.js";
import "./song-list-item.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/action-input.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadAlbums, loadSongsForArtist } from "../scripts/lists.js";
import { getFileUrl } from "../scripts/services.js";

export class AlbumBrowser extends HTMLDivElement {
  constructor() {
    super();

    this.classList.add("album-browser");
    history.pushState({ page: "albums" }, "Music - browse by album", "./music");

    this.innerHTML = `<section id="albums" class="full-screen has-title has-input">
      <header is="item-counter" class="section-title" id="albumCount" singular="album" plural="albums" order="date added"></header>
      <div is="action-input" id="albumFilter" placeholder="search..." trigger="any"></div>
      <ul is="custom-list" id="albumList" class="full-screen">
        <template slot="item">
          <li is="album-list-item"></li>
        </template>
      </ul>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    <section id="songs" class="full-screen has-title has-subtitle">
      <header is="item-counter" class="section-title" id="songCount" singular="song" plural="songs" order="album">
      </header>
      <span id="albumName" class="subtitle"></span>
      <ul is="custom-list" id="songList" class="full-screen">
        <template slot="item">
          <li is="song-list-item"></li>
        </template>
      </ul>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    `;

    document.getElementById("albumFilter").addEventListener("action", () => {
      document.getElementById("albumList").filter(document.getElementById("albumFilter").value);
    });
    document.getElementById("albumList").addEventListener("change", async () => {
      const selection = document.getElementById("albumList").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        document.getElementById("albumName").innerText = selection.item;
        document.querySelector("nav.selected-item-nav").value = selection.item;

        await loadSongsForArtist(selection.artist, selection.item);
      }
    });
    document.getElementById("songList").addEventListener("change", async () => {
      const selection = document.getElementById("songList").selectedData;

      if (selection) {
        const songs = document.getElementById("songList").allData;

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

customElements.define("album-browser", AlbumBrowser, { extends: "div" });
