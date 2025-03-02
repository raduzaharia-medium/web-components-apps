import "./songs-section.js";

import { loadSongs } from "../scripts/lists.js";

export class SongBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "songs" }, "Music - browse by song", ".");

    this.innerHTML = `
      <songs-section id="songs" class="full-screen has-title has-input"></songs-section>`;

    this.querySelector("#songFilter").addEventListener("keyup", () => {
      this.querySelector("#songList").filter(this.querySelector("#songFilter").value);
    });
    this.querySelector("#songList").addEventListener("change", () => {
      const selection = this.querySelector("#songList").selectedData;

      if (selection) {
        const songs = this.querySelector("#songList").allData;

        document.querySelector("audio-player").setPlaylist(songs);
        document.querySelector("audio-player").src = `/music/stream?location=${selection.location}`;
        document.querySelector("body").classList.add("song-selected");
      }
    });
  }

  async connectedCallback() {
    await loadSongs();
  }
}

customElements.define("song-browser", SongBrowser);
