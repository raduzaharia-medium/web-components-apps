import "./artists-section.js";
import "./albums-section.js";
import "./songs-section.js";

import { loadArtists, loadAlbumsForArtist, loadSongsForArtist } from "../scripts/lists.js";
import { getFileUrl } from "../scripts/services.js";

export class ArtistBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "artists" }, "Music - browse by artist", ".");

    this.innerHTML = `
      <artists-section id="artists"></artists-section>
      <albums-section id="albums"></albums-section>
      <songs-section id="songs"></songs-section>`;

    this.querySelector("artists-section").addEventListener("change", async () => {
      await loadAlbumsForArtist(this.querySelector("artists-section").selection);
      this.querySelector("albums-section custom-list").selectFirst();
    });
    this.querySelector("albums-section").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section").selection;

      this.querySelector("songs-section span.subtitle").innerText = selection;
      await loadSongsForArtist(this.querySelector("artists-section").selection, selection);
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
    await loadArtists();
  }
}

customElements.define("artist-browser", ArtistBrowser);
