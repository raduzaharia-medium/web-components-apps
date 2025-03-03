import "./genres-section.js";
import "./albums-section.js";
import "./songs-section.js";

import { loadGenres, loadAlbumsForGenre, loadSongsForGenre } from "../scripts/lists.js";

export class GenreBrowser extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <genres-section></genres-section>
      <albums-section></albums-section>
      <songs-section></songs-section>`;

    this.querySelector("genres-section").addEventListener("change", async () => {
      await loadAlbumsForGenre(this.querySelector("genres-section").selection);
      this.querySelector("albums-section custom-list").selectFirst();
    });
    this.querySelector("albums-section").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section").selection;

      this.querySelector("songs-section span.subtitle").innerText = selection;
      await loadSongsForGenre(this.querySelector("genres-section").selection, selection);
    });

    this.querySelector("songs-section").addEventListener("change", async () => {
      const selection = this.querySelector("songs-section").selection;

      if (selection) {
        const songs = this.querySelector("songs-section custom-list").allData;

        document.querySelector("audio-player").setPlaylist(songs);
        document.querySelector("audio-player").src = await getFileUrl(selection.file);
      }
    });
  }

  async connectedCallback() {
    await loadGenres();
  }
}

customElements.define("genre-browser", GenreBrowser);
