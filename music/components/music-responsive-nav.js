import "/shared/components/responsive-nav.js";
import "/shared/components/selected-item-nav.js";

export class MusicResponsiveNav extends HTMLElement {
  constructor() {
    super();

    this.classList.add("music-responsive-nav");
    this.classList.add("top");

    this.innerHTML = `
      <nav is="responsive-nav" options="artists,albums,genres,songs" value="artists"></nav>
      <nav is="selected-item-nav" behavior="back-button"></nav>
    `;

    this.initChangeHandler();
    this.initBackHandler();
    // this.initPlayerChangeHandler();
  }

  initChangeHandler() {
    document.querySelector("nav.responsive-nav").addEventListener("change", () => {
      const selection = document.querySelector("nav.responsive-nav").value;

      if (selection === "artists") {
        document.body.classList.remove("genre-first");
        document.body.classList.remove("album-first");
        document.body.classList.remove("song-first");
        document.body.classList.add("artist-first");

        document.querySelector("main").innerHTML = `<div is="artist-browser"></div>`;
      } else if (selection === "albums") {
        document.body.classList.remove("artist-first");
        document.body.classList.remove("genre-first");
        document.body.classList.remove("song-first");
        document.body.classList.add("album-first");

        document.querySelector("main").innerHTML = `<div is="album-browser"></div>`;
      } else if (selection === "genres") {
        document.body.classList.remove("artist-first");
        document.body.classList.remove("album-first");
        document.body.classList.remove("song-first");
        document.body.classList.add("genre-first");

        document.querySelector("main").innerHTML = `<div is="genre-browser"></div>`;
      } else if (selection === "songs") {
        document.body.classList.remove("artist-first");
        document.body.classList.remove("album-first");
        document.body.classList.remove("genre-first");
        document.body.classList.add("song-first");

        document.querySelector("main").innerHTML = `<div is="song-browser"></div>`;
      }
    });
  }

  initPlayerChangeHandler() {
    document.querySelector("audio-player").addEventListener("change", () => {
      const selection = document.querySelector("audio-player").data;
      if (selection) document.getElementById("songList").select(selection.item);
    });
  }

  initBackHandler() {
    window.onpopstate = (e) => {
      if (document.body.classList.contains("artist-first") && document.body.classList.contains("artist-selected")) {
        this.showArtists();
        return;
      }

      if (document.body.classList.contains("album-first") && document.body.classList.contains("album-selected")) {
        this.showAlbums();
        return;
      }

      if (document.body.classList.contains("genre-first") && document.body.classList.contains("genre-selected")) {
        this.showGenres();
        return;
      }

      if (!e.state || !e.state.page) return;

      if (e.state.page == "artists") this.showArtists(true);
      else if (e.state.page == "albums") this.showAlbums(true);
      else if (e.state.page == "genres") this.showGenres(true);
      else if (e.state.page == "songs") this.showSongs(true);
    };
  }

  showArtists(ignoreHistory) {
    if (!ignoreHistory) history.pushState({ page: "artists" }, "Music - browse by artist", "/music");

    document.querySelector("nav.responsive-nav").value = "artists";
    document.querySelector("nav.selected-item-nav").value = "";

    document.getElementById("artistFilter").value = "";

    document.getElementById("artists").classList.add("has-input");
    document.getElementById("albums").classList.remove("has-input");
    document.getElementById("songs").classList.remove("has-input");

    document.body.classList.remove("artist-selected");
    document.body.classList.remove("album-selected");
    document.body.classList.remove("song-first");
    document.body.classList.remove("album-first");
    document.body.classList.add("artist-first");
  }
  showGenres(ignoreHistory) {
    if (!ignoreHistory) history.pushState({ page: "genres" }, "Music - browse by genre", "/music");

    document.querySelector("nav.responsive-nav").value = "genres";
    document.querySelector("nav.selected-item-nav").value = "";

    document.getElementById("genreFilter").value = "";

    document.getElementById("genres").classList.add("has-input");
    document.getElementById("albums").classList.remove("has-input");
    document.getElementById("songs").classList.remove("has-input");

    document.body.classList.remove("genre-selected");
    document.body.classList.remove("album-selected");
    document.body.classList.remove("song-first");
    document.body.classList.remove("album-first");
    document.body.classList.add("genre-first");
  }
  showAlbums(ignoreHistory) {
    document.querySelector("nav.responsive-nav").value = "albums";
    document.querySelector("nav.selected-item-nav").value = "";

    document.getElementById("albumFilter").value = "";

    document.getElementById("albums").classList.add("has-input");
    document.getElementById("songs").classList.remove("has-input");

    document.body.classList.remove("album-selected");
    document.body.classList.remove("song-first");
    document.body.classList.add("album-first");
  }
  showSongs(ignoreHistory) {
    document.querySelector("nav.responsive-nav").value = "songs";
    document.querySelector("nav.selected-item-nav").value = "";

    document.getElementById("songFilter").value = "";
    document.getElementById("songs").classList.add("has-input");

    document.body.classList.add("song-first");
  }
}

customElements.define("music-responsive-nav", MusicResponsiveNav, { extends: "nav" });
