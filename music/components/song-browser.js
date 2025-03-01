import "./song-list-item.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/action-input.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadSongs } from "../scripts/lists.js";

export class SongBrowser extends HTMLDivElement {
  constructor() {
    super();

    this.classList.add("song-browser");
    history.pushState({ page: "songs" }, "Music - browse by song", ".");

    this.innerHTML = `<section id="songs" class="full-screen has-title has-input">
      <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
      <div is="action-input" id="songFilter" placeholder="search..." trigger="any"></div>
      <ul is="custom-list" id="songList" class="full-screen">
        <template slot="item">
          <li is="song-list-item"></li>
        </template>
      </ul>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    `;

    document.getElementById("songFilter").addEventListener("action", () => {
      document.getElementById("songList").filter(document.getElementById("songFilter").value);
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
    await loadSongs();
  }
}

customElements.define("song-browser", SongBrowser, { extends: "div" });
