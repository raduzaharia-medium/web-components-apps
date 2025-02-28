import "./artist-list-item.js";
import "./album-list-item.js";
import "./song-list-item.js";

import "/shared/components/item-counter.js";
import "/shared/components/action-input.js";
import "/shared/components/custom-list.js";
import "/shared/components/custom-list-skeleton.js";

import { loadArtists, loadAlbumsForArtist, loadSongsForArtist } from "/music/scripts/lists.js";
import { getFileUrl } from "/music/scripts/services.js";

export class ArtistBrowser extends HTMLDivElement {
  constructor() {
    super();

    this.classList.add("artist-browser");
    history.pushState({ page: "artists" }, "Music - browse by artist", "/music");

    this.innerHTML = `<section id="artists" class="full-screen has-title has-input">
      <header is="item-counter" class="section-title" id="artistCount" singular="artist" plural="artists" order="a-z">
      </header>
      <div is="action-input" id="artistFilter" placeholder="search..." trigger="any"></div>
      <ul is="custom-list" id="artistList" class="full-screen">
        <template slot="item">
          <li is="artist-list-item"></li>
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

    document.getElementById("artistFilter").addEventListener("action", () => {
      document.getElementById("artistList").filter(document.getElementById("artistFilter").value);
    });
    document.getElementById("artistList").addEventListener("change", async () => {
      const selection = document.getElementById("artistList").value;

      if (selection) {
        document.querySelector("body").classList.add("artist-selected");
        document.querySelector("nav.selected-item-nav").value = selection;

        await loadAlbumsForArtist(selection);
        document.getElementById("albumList").selectFirst();
      }
    });
    document.getElementById("albumList").addEventListener("change", async () => {
      const selection = document.getElementById("albumList").selectedData;

      if (selection) {
        document.querySelector("body").classList.add("album-selected");
        document.getElementById("albumName").innerText = selection.item;
        // if (updateNav) document.querySelector("nav.selected-item-nav").value = selection.item;

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
    await loadArtists();
  }
}

customElements.define("artist-browser", ArtistBrowser, { extends: "div" });
