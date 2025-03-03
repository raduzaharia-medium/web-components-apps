import "./artists-section.js";
import "./albums-section.js";
import "./songs-section.js";

import { getArtists, getAlbumsByArtist, getSongsForArtist, getFileUrl, getAlbumArt } from "../scripts/services.js";

export class ArtistBrowser extends HTMLElement {
  observer = new IntersectionObserver(this.loadAlbumArt, {
    root: this.querySelector("albums-section custom-list"),
    threshold: 1.0,
  });

  constructor() {
    super();

    history.pushState({ page: "artists" }, "Music - browse by artist", ".");

    this.innerHTML = `
      <artists-section></artists-section>
      <albums-section></albums-section>
      <songs-section></songs-section>`;

    this.querySelector("artists-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("artists-section custom-list").selectedData;

      if (selection) {
        await this.loadAlbums(selection);
        this.querySelector("albums-section custom-list").selectFirst();
      }
    });
    this.querySelector("albums-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section custom-list").selectedData;

      if (selection) {
        this.querySelector("songs-section span.subtitle").innerText = selection.item;
        await this.loadSongs(selection.artist, selection.item);
      }
    });

    this.querySelector("songs-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("songs-section custom-list").selectedData;

      if (selection) {
        const songs = this.querySelector("songs-section custom-list").allData;

        document.querySelector("audio-player").setPlaylist(songs);
        document.querySelector("audio-player").src = await getFileUrl(selection.file);
      }
    });
  }

  loadAlbumArt(entries, observer) {
    let interactionEntries = [];
    let timeout;

    interactionEntries.push(...entries);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      interactionEntries
        .filter((element) => element.isIntersecting)
        .slice(-20)
        .forEach(async (element) => {
          const selection = element.target.parentElement.dataset;

          element.target.src = await getAlbumArt(selection.artist, selection.item);
          observer.unobserve(element.target);
        });

      interactionEntries = [];
    }, 500);
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

    this.observer.disconnect();
    this.querySelectorAll("albums-section custom-list album-list-item img").forEach((element) => this.observer.observe(element));
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
