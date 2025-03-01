import "./genre-list-item.js";
import "./album-list-item.js";
import "./song-list-item.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadGenres, loadAlbumsForGenre, loadSongsForGenre } from "../scripts/lists.js";

export class GenreBrowser extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `<section id="genres" class="full-screen has-title has-input">
      <item-counter id="genreCount" singular="genre" plural="genres" order="a-z"></item-counter>
      <input id="genreFilter" type="text" placeholder="search..." />
      <custom-list id="genreList" class="full-screen">
        <template slot="item">
          <li is="genre-list-item"></li>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
     <section id="albums" class="full-screen has-title">
      <item-counter id="albumCount" singular="album" plural="albums" order="date added"></item-counter>
      <custom-list id="albumList" class="full-screen">
        <template slot="item">
          <li is="album-list-item"></li>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    <section id="songs" class="full-screen has-title has-subtitle">
      <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
      <span id="albumName" class="subtitle"></span>
      <custom-list id="songList" class="full-screen">
        <template slot="item">
          <li is="song-list-item"></li>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    `;

    this.querySelector("#genreFilter").addEventListener("keyup", () => {
      this.querySelector("#genreList").filter(this.querySelector("#genreFilter").value);
    });
    this.querySelector("#genreList").addEventListener("change", async () => {
      const selection = this.querySelector("#genreList").value;

      if (selection) {
        document.querySelector("body").classList.add("genre-selected");
        document.querySelector("selected-item-nav").value = selection;

        await loadAlbumsForGenre(selection);
        this.querySelector("#albumList").selectFirst();
      }
    });
    this.querySelector("#albumList").addEventListener("change", async () => {
      const selection = this.querySelector("#albumList").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        this.querySelector("#albumName").innerText = selection.item;
        // if (updateNav) document.querySelector("selected-item-nav").value = selection.item;

        await loadSongsForGenre(this.querySelector("#genreList").value, selection.item);
      }
    });
    this.querySelector("#songList").addEventListener("change", () => {
      const selection = this.querySelector("#songList").selectedData;

      if (selection) {
        const songs = this.querySelector("#songList").allData;

        document.querySelector("div.audio-player").setPlaylist(songs);
        document.querySelector("div.audio-player").src = `/music/stream?location=${selection.location}`;
        document.querySelector("body").classList.add("song-selected");
      }
    });
  }

  async connectedCallback() {
    await loadGenres();
  }
}

customElements.define("genre-browser", GenreBrowser);
