import "./artist-list-item.js";
import "./album-list-item.js";
import "./song-list-item.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadArtists, loadAlbumsForArtist, loadSongsForArtist } from "../scripts/lists.js";
import { getFileUrl } from "../scripts/services.js";

export class ArtistBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "artists" }, "Music - browse by artist", ".");

    this.innerHTML = `<section id="artists" class="full-screen has-title has-input">
      <item-counter id="artistCount" singular="artist" plural="artists" order="a-z"></item-counter>
      <input id="artistFilter" type="text" placeholder="search..." />
      <custom-list id="artistList" class="full-screen">
        <template slot="item">
          <artist-list-item></artist-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
     <section id="albums" class="full-screen has-title">
      <item-counter id="albumCount" singular="album" plural="albums" order="date added"></item-counter>
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

    this.querySelector("#artistList").addEventListener("keyup", (e) => {
      this.querySelector("#artistList").filter(this.querySelector("#artistFilter").value);
    });
    this.querySelector("#artistList").addEventListener("change", async () => {
      const selection = this.querySelector("#artistList").value;

      if (selection) {
        document.querySelector("body").classList.add("artist-selected");
        document.querySelector("selected-item-nav").value = selection;

        await loadAlbumsForArtist(selection);
        this.querySelector("#albumList").selectFirst();
      }
    });
    this.querySelector("#albumList").addEventListener("change", async () => {
      const selection = this.querySelector("#albumList").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        this.querySelector("#albumName").innerText = selection.item;
        // if (updateNav) document.querySelector("selected-item-nav").value = selection.item;

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
    await loadArtists();
  }
}

customElements.define("artist-browser", ArtistBrowser);
