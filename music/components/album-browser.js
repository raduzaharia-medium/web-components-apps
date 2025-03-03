import "./albums-section.js";
import "./songs-section.js";

import { getAlbums, getSongsForArtist, getFileUrl } from "../scripts/services.js";

export class AlbumBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "albums" }, "Music - browse by album", ".");

    this.innerHTML = `
      <albums-section></albums-section>
      <songs-section></songs-section>`;

    this.querySelector("albums-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section custom-list").selectedData;

      if (selection) {
        await this.loadSongs(selection.artist, selection.item);
      }
    });

    this.querySelector("songs-section").addEventListener("change", async () => {
      const selection = this.querySelector("songs-section custom-list").selectedData;

      if (selection) {
        const songs = this.querySelector("songs-section custom-list").allData;

        document.querySelector("audio-player").setPlaylist(songs);
        document.querySelector("audio-player").src = await getFileUrl(selection.file);
      }
    });
  }

  async connectedCallback() {
    await this.loadAlbums();
  }

  async loadAlbums() {
    this.querySelector("albums-section").classList.add("loading");
    this.querySelector("songs-section").classList.add("loading");

    const albums = await getAlbums();

    this.querySelector("albums-section custom-list").setItems(albums);
    this.querySelector("albums-section item-counter").value = albums.length;
    this.querySelector("albums-section").classList.remove("loading");
    this.querySelector("songs-section").classList.remove("loading");

    // observer.disconnect();
    // document.querySelectorAll("albums-section custom-list li img").forEach((element) => observer.observe(element));
  }

  async loadSongs(artist, album) {
    this.querySelector("songs-section").classList.add("loading");

    const songs = await getSongsForArtist(artist, album);

    this.querySelector("songs-section custom-list").setItems(songs);
    this.querySelector("songs-section item-counter").value = songs.length;
    this.querySelector("songs-section").classList.remove("loading");
  }
}

customElements.define("album-browser", AlbumBrowser);
