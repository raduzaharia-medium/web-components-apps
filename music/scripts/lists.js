import { getAlbums, getArtists, getGenres, getSongs } from "./services.js";
import { getAlbumsByArtist, getAlbumsByGenre, getSongsForArtist, getSongsForGenre } from "./services.js";

let interactionEntries = [];
let timeout;

// const observer = new IntersectionObserver(
//   (entries, observer) => {
//     interactionEntries.push(...entries);
//     clearTimeout(timeout);

//     timeout = setTimeout(() => {
//       interactionEntries
//         .filter((element) => element.isIntersecting)
//         .slice(-20)
//         .forEach((element) => {
//           console.log(`Processing ${element.target.parentElement.dataset.src}`);

//           element.target.src = element.target.parentElement.dataset.src;
//           observer.unobserve(element.target);
//         });

//       interactionEntries = [];
//     }, 500);
//   },
//   {
//     root: document.getElementById("albumList"),
//     threshold: 1.0,
//   }
// );

export async function loadArtists() {
  document.getElementById("artists").classList.add("loading");
  const artists = await getArtists();

  document.getElementById("artistList").setItems(artists);
  document.querySelector("artists-section item-counter").value = artists.length;
  document.getElementById("artists").classList.remove("loading");
}

export async function loadGenres() {
  document.getElementById("genres").classList.add("loading");
  const genres = await getGenres();

  document.getElementById("genreList").setItems(genres);
  document.querySelector("genres-section item-counter").value = genres.length;
  document.getElementById("genres").classList.remove("loading");
}

export async function loadAlbums() {
  document.getElementById("albums").classList.add("loading");
  document.getElementById("songs").classList.add("loading");
  const albums = await getAlbums();

  document.getElementById("albumList").setItems(albums);
  document.querySelector("albums-section item-counter").value = albums.length;
  document.getElementById("albums").classList.remove("loading");
  document.getElementById("songs").classList.remove("loading");

  // observer.disconnect();
  // document.querySelectorAll("#albumList li img").forEach((element) => observer.observe(element));
}

export async function loadSongs() {
  document.getElementById("songs").classList.add("loading");
  const songs = await getSongs();

  document.getElementById("songList").setItems(songs);
  document.querySelector("songs-section item-counter").value = songs.length;
  document.getElementById("songs").classList.remove("loading");
}

export async function loadSongsForArtist(artist, album) {
  document.getElementById("songs").classList.add("loading");
  const songs = await getSongsForArtist(artist, album);

  document.getElementById("songList").setItems(songs);
  document.querySelector("songs-section item-counter").value = songs.length;
  document.getElementById("songs").classList.remove("loading");
}

export async function loadAlbumsForArtist(artist) {
  document.getElementById("albums").classList.add("loading");
  document.getElementById("songs").classList.add("loading");
  const albums = await getAlbumsByArtist(artist);

  albums.splice(0, 0, { name: "All Albums", artist });
  document.getElementById("albumList").setItems(albums);
  document.querySelector("albums-section item-counter").value = albums.length;
  document.getElementById("albums").classList.remove("loading");
  document.getElementById("songs").classList.remove("loading");

  // observer.disconnect();
  // document.querySelectorAll("#albumList li img").forEach((element) => observer.observe(element));
}

export async function loadAlbumsForGenre(genre) {
  document.getElementById("albums").classList.add("loading");
  document.getElementById("songs").classList.add("loading");
  const albums = await getAlbumsByGenre(genre);

  albums.splice(0, 0, { name: "All Albums", artist: "All Artists" });
  document.getElementById("albumList").setItems(albums);
  document.querySelector("albums-section item-counter").value = albums.length;
  document.getElementById("albums").classList.remove("loading");
  document.getElementById("songs").classList.remove("loading");

  // observer.disconnect();
  // document.querySelectorAll("#albumList li img").forEach((element) => observer.observe(element));
}

export async function loadSongsForGenre(genre, album) {
  document.getElementById("songs").classList.add("loading");
  const songs = await getSongsForGenre(genre, album);

  document.getElementById("songList").setItems(songs);
  document.querySelector("songs-section item-counter").value = songs.length;
  document.getElementById("songs").classList.remove("loading");
}
