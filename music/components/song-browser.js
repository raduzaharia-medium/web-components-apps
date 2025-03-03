import "./songs-section.js";

import { loadSongs } from "../scripts/lists.js";

export class SongBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "songs" }, "Music - browse by song", ".");

    this.innerHTML = `
      <songs-section class="full-screen has-title has-input"></songs-section>`;

    this.querySelector("songs-section input").addEventListener("keyup", () => {
      this.querySelector("songs-section custom-list").filter(this.querySelector("songs-section input").value);
    });
    this.querySelector("songs-section custom-list").addEventListener("change", () => {
      const selection = this.querySelector("songs-section custom-list").selectedData;

      if (selection) {
        const songs = this.querySelector("songs-section custom-list").allData;

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
