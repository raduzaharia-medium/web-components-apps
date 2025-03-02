import "./artist-list-item.js";
import "./album-list-item.js";
import "./song-list-item.js";

import "./artists-section.js";
import "./albums-section.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadArtists, loadAlbumsForArtist, loadSongsForArtist } from "../scripts/lists.js";
import { getFileUrl } from "../scripts/services.js";

export class ArtistBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "artists" }, "Music - browse by artist", ".");

    this.innerHTML = `
      <artists-section id="artists"></artists-section>
      <albums-section id="albums" class="full-screen has-title"></albums-section>
      <section id="songs" class="full-screen has-title has-subtitle">
        <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
        <span id="albumName" class="subtitle"></span>
        <custom-list id="songList" class="full-screen">
          <template slot="item">
            <song-list-item></song-list-item>
          </template>
        </custom-list>
        <custom-list-skeleton></custom-list-skeleton>
      </section>`;

    this.querySelector("artists-section").addEventListener("change", async () => {
      await loadAlbumsForArtist(this.querySelector("artists-section").selection);
      this.querySelector("#albumList").selectFirst();
    });
    this.querySelector("albums-section").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section").selection;

      this.querySelector("#albumName").innerText = selection;
      await loadSongsForArtist(this.querySelector("artists-section").selection, selection);
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
    await loadArtists();
  }
}

customElements.define("artist-browser", ArtistBrowser);
