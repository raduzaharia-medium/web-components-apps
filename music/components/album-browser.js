import "./albums-section.js";
import "./songs-section.js";

import { loadAlbums, loadSongsForArtist } from "../scripts/lists.js";
import { getFileUrl } from "../scripts/services.js";

export class AlbumBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "albums" }, "Music - browse by album", ".");

    this.innerHTML = `
      <albums-section id="albums"></albums-section>
      <songs-section id="songs"></songs-section>`;

    this.querySelector("albums-section").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section").selectedData;

      this.querySelector("songs-section span.subtitle").innerText = selection.item;
      await loadSongsForArtist(selection.artist, selection.item);
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
    await loadAlbums();
  }
}

customElements.define("album-browser", AlbumBrowser);
