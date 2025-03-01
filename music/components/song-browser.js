import "./song-list-item.js";

import "../../shared/components/item-counter.js";
import "../../shared/components/custom-list.js";
import "../../shared/components/custom-list-skeleton.js";

import { loadSongs } from "../scripts/lists.js";

export class SongBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "songs" }, "Music - browse by song", ".");

    this.innerHTML = `<section id="songs" class="full-screen has-title has-input">
      <item-counter id="songCount" singular="song" plural="songs" order="album"></item-counter>
      <input id="songFilter" type="text" placeholder="search..." />
      <custom-list id="songList" class="full-screen">
        <template slot="item">
          <song-list-item></song-list-item>
        </template>
      </custom-list>
      <custom-list-skeleton></custom-list-skeleton>
    </section>
    `;

    this.querySelector("#songFilter").addEventListener("keyup", () => {
      this.querySelector("#songList").filter(this.querySelector("#songFilter").value);
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
    await loadSongs();
  }
}

customElements.define("song-browser", SongBrowser);
