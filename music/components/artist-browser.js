import "./artists-section.js";
import "./albums-section.js";
import "./songs-section.js";

import { getArtists, getAlbumsByArtist, getSongsForArtist, getFileUrl } from "../scripts/services.js";

export class ArtistBrowser extends HTMLElement {
  constructor() {
    super();

    history.pushState({ page: "artists" }, "Music - browse by artist", ".");

    this.innerHTML = `
      <artists-section id="artists"></artists-section>
      <albums-section id="albums"></albums-section>
      <songs-section id="songs"></songs-section>`;

    this.querySelector("artists-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("artists-section custom-list").selectedData;

      if (selection) {
        await this.loadAlbums(selection);
        this.querySelector("albums-section custom-list").selectFirst();
      }
    });
    this.querySelector("albums-section").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section custom-list").selectedData;

      if (selection) {
        this.querySelector("songs-section span.subtitle").innerText = selection.item;
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
    await this.loadArtists();
  }

  async loadArtists() {
    this.querySelector("artists-section").classList.add("loading");

    const artists = await getArtists();

    this.querySelector("artists-section custom-list").setItems(artists);
    this.querySelector("artists-section item-counter").value = artists.length;
    this.querySelector("artists-section").classList.remove("loading");
  }

  async loadAlbums(artist) {
    this.querySelector("albums-section").classList.add("loading");
    this.querySelector("songs-section").classList.add("loading");

    const albums = await getAlbumsByArtist(artist);
    albums.splice(0, 0, { name: "All Albums", artist });

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

customElements.define("artist-browser", ArtistBrowser);
