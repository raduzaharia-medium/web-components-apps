import "./songs-section.js";

import { getSongs, getFileUrl } from "../scripts/services.js";

export class SongBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "songs" }, "Music - browse by song", ".");

    this.innerHTML = `
      <songs-section class="full-screen has-title has-input"></songs-section>`;

    this.querySelector("songs-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("songs-section custom-list").selectedData;

      if (selection) {
        const songs = this.querySelector("songs-section custom-list").allData;

        document.querySelector("actions-bar").setPlaylist(songs);
        document.querySelector("actions-bar").src = await getFileUrl(selection.file);
      }
    });
  }

  async connectedCallback() {
    await this.loadSongs();
  }

  async loadSongs() {
    this.querySelector("songs-section").classList.add("loading");

    const songs = await getSongs();

    this.querySelector("songs-section custom-list").setItems(songs);
    this.querySelector("songs-section item-counter").value = songs.length;
    this.querySelector("songs-section").classList.remove("loading");
  }
}

customElements.define("song-browser", SongBrowser);
