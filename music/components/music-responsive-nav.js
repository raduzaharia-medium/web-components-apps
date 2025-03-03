import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class MusicResponsiveNav extends HTMLElement {
  constructor() {
    super();
    this.classList.add("music-responsive-nav");

    this.innerHTML = `
      <responsive-nav options="artists,albums,genres,songs" value="artists"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    this.initChangeHandler();
    this.initBackHandler();
    // this.initPlayerChangeHandler();
  }

  initChangeHandler() {
    document.querySelector("responsive-nav").addEventListener("change", () => {
      const selection = document.querySelector("responsive-nav").value;

      if (selection === "artists") {
        document.body.classList.remove("genre-first");
        document.body.classList.remove("album-first");
        document.body.classList.remove("song-first");
        document.body.classList.add("artist-first");

        document.querySelector("main").innerHTML = `<artist-browser></artist-browser>`;
      } else if (selection === "albums") {
        document.body.classList.remove("artist-first");
        document.body.classList.remove("genre-first");
        document.body.classList.remove("song-first");
        document.body.classList.add("album-first");

        document.querySelector("main").innerHTML = `<album-browser></album-browser>`;
      } else if (selection === "genres") {
        document.body.classList.remove("artist-first");
        document.body.classList.remove("album-first");
        document.body.classList.remove("song-first");
        document.body.classList.add("genre-first");

        document.querySelector("main").innerHTML = `<genre-browser></genre-browser>`;
      } else if (selection === "songs") {
        document.body.classList.remove("artist-first");
        document.body.classList.remove("album-first");
        document.body.classList.remove("genre-first");
        document.body.classList.add("song-first");

        document.querySelector("main").innerHTML = `<song-browser></song-browser>`;
      }
    });
  }

  initPlayerChangeHandler() {
    document.querySelector("audio-player").addEventListener("change", () => {
      const selection = document.querySelector("audio-player").data;
      if (selection) document.querySelector("songs-section custom-list").select(selection.item);
    });
  }

  initBackHandler() {
    window.onpopstate = (e) => {
      if (document.querySelector("artist-browser.artist-selected")) {
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
    if (!ignoreHistory) history.pushState({ page: "artists" }, "Music - browse by artist", ".");

    document.querySelector("responsive-nav").value = "artists";
    document.querySelector("selected-item-nav").value = "";

    document.querySelector("artists-section input").value = "";

    document.querySelector("artists-section").classList.add("has-input");
    document.querySelector("albums-section").classList.remove("has-input");
    document.querySelector("songs-section").classList.remove("has-input");

    document.body.classList.remove("artist-selected");
    document.body.classList.remove("album-selected");
    document.body.classList.remove("song-first");
    document.body.classList.remove("album-first");
    document.body.classList.add("artist-first");
  }
  showGenres(ignoreHistory) {
    if (!ignoreHistory) history.pushState({ page: "genres" }, "Music - browse by genre", ".");

    document.querySelector("responsive-nav").value = "genres";
    document.querySelector("selected-item-nav").value = "";

    document.querySelector("genres-section input").value = "";

    document.querySelector("genres-section").classList.add("has-input");
    document.querySelector("albums-section").classList.remove("has-input");
    document.querySelector("songs-section").classList.remove("has-input");

    document.body.classList.remove("genre-selected");
    document.body.classList.remove("album-selected");
    document.body.classList.remove("song-first");
    document.body.classList.remove("album-first");
    document.body.classList.add("genre-first");
  }
  showAlbums(ignoreHistory) {
    document.querySelector("responsive-nav").value = "albums";
    document.querySelector("selected-item-nav").value = "";

    document.querySelector("albums-section input").value = "";

    document.querySelector("albums-section").classList.add("has-input");
    document.querySelector("songs-section").classList.remove("has-input");

    document.body.classList.remove("album-selected");
    document.body.classList.remove("song-first");
    document.body.classList.add("album-first");
  }
  showSongs(ignoreHistory) {
    document.querySelector("responsive-nav").value = "songs";
    document.querySelector("selected-item-nav").value = "";

    document.querySelector("songs-section input").value = "";
    document.querySelector("songs-section").classList.add("has-input");

    document.body.classList.add("song-first");
  }
}

customElements.define("music-responsive-nav", MusicResponsiveNav);
