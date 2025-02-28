import "./genre-list-item.js";
import "./album-list-item.js";
import "./song-list-item.js";

import "/shared/components/item-counter.js";
import "/shared/components/action-input.js";
import "/shared/components/custom-list.js";
import "/shared/components/custom-list-skeleton.js";

import { loadGenres, loadAlbumsForGenre, loadSongsForGenre } from "/music/scripts/lists.js";

export class GenreBrowser extends HTMLDivElement {
  constructor() {
    super();

    this.classList.add("genre-browser");

    this.innerHTML = `<section id="genres" class="full-screen has-title has-input">
      <header is="item-counter" class="section-title" id="genreCount" singular="genre" plural="genres" order="a-z">
      </header>
      <div is="action-input" id="genreFilter" placeholder="search..." trigger="any"></div>
      <ul is="custom-list" id="genreList" class="full-screen">
        <template slot="item">
          <li is="genre-list-item"></li>
        </template>
      </ul>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
     <section id="albums" class="full-screen has-title">
      <header is="item-counter" class="section-title" id="albumCount" singular="album" plural="albums" order="date added"></header>
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

    document.getElementById("genreFilter").addEventListener("action", () => {
      document.getElementById("genreList").filter(document.getElementById("genreFilter").value);
    });
    document.getElementById("genreList").addEventListener("change", async () => {
      const selection = document.getElementById("genreList").value;

      if (selection) {
        document.querySelector("body").classList.add("genre-selected");
        document.querySelector("nav.selected-item-nav").value = selection;

        await loadAlbumsForGenre(selection);
        document.getElementById("albumList").selectFirst();
      }
    });
    document.getElementById("albumList").addEventListener("change", async () => {
      const selection = document.getElementById("albumList").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        document.getElementById("albumName").innerText = selection.item;
        // if (updateNav) document.querySelector("nav.selected-item-nav").value = selection.item;

        await loadSongsForGenre(document.getElementById("genreList").value, selection.item);
      }
    });
    document.getElementById("songList").addEventListener("change", () => {
      const selection = document.getElementById("songList").selectedData;

      if (selection) {
        const songs = document.getElementById("songList").allData;

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

customElements.define("genre-browser", GenreBrowser, { extends: "div" });
