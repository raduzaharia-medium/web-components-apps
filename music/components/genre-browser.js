import "./genres-section.js";
import "./albums-section.js";
import "./songs-section.js";

import { getGenres, getAlbumsByGenre, getSongsForGenre, getFileUrl, getAlbumArt } from "../scripts/services.js";

export class GenreBrowser extends HTMLElement {
  observer = new IntersectionObserver(this.loadAlbumArt, {
    root: this.querySelector("albums-section custom-list"),
    threshold: 1.0,
  });

  constructor() {
    super();

    this.innerHTML = `
      <genres-section></genres-section>
      <albums-section></albums-section>
      <songs-section></songs-section>`;

    this.querySelector("genres-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("genres-section custom-list").selectedData;

      if (selection) {
        await this.loadAlbums(selection);
        this.querySelector("albums-section custom-list").selectFirst();
      }
    });
    this.querySelector("albums-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("albums-section custom-list").selectedData;

      if (selection) {
        this.querySelector("songs-section span.subtitle").innerText = selection.item;
        await this.loadSongs(selection.genre, selection.item);
      }
    });

    this.querySelector("songs-section custom-list").addEventListener("change", async () => {
      const selection = this.querySelector("songs-section").selectedData;

      if (selection) {
        const songs = this.querySelector("songs-section custom-list").allData;

        document.querySelector("actions-bar").setPlaylist(songs);
        document.querySelector("actions-bar").src = await getFileUrl(selection.file);
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
    await this.loadGenres();
  }

  async loadGenres() {
    this.querySelector("genres-section").classList.add("loading");

    const genres = await getGenres();

    this.querySelector("genres-section custom-list").setItems(genres);
    this.querySelector("genres-section item-counter").value = genres.length;
    this.querySelector("genres-section").classList.remove("loading");
  }
  async loadAlbums(genre) {
    this.querySelector("albums-section").classList.add("loading");
    this.querySelector("songs-section").classList.add("loading");

    const albums = await getAlbumsByGenre(genre);

    albums.splice(0, 0, { name: "All Albums", artist: "All Artists", genre: genre });
    document.querySelector("albums-section custom-list").setItems(albums);
    document.querySelector("albums-section item-counter").value = albums.length;
    document.querySelector("albums-section").classList.remove("loading");
    document.querySelector("songs-section").classList.remove("loading");

    this.observer.disconnect();
    this.querySelectorAll("albums-section custom-list album-list-item img").forEach((element) => this.observer.observe(element));
  }
  async loadSongs(genre, album) {
    this.querySelector("songs-section").classList.add("loading");

    const songs = await getSongsForGenre(genre, album);

    this.querySelector("songs-section custom-list").setItems(songs);
    this.querySelector("songs-section item-counter").value = songs.length;
    this.querySelector("songs-section").classList.remove("loading");
  }
}

customElements.define("genre-browser", GenreBrowser);
