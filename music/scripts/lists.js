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
//     root: document.querySelector("albums-section custom-list"),
//     threshold: 1.0,
//   }
// );

export async function loadArtists() {
  document.querySelector("artists-section").classList.add("loading");
  const artists = await getArtists();

  document.querySelector("artists-section custom-list").setItems(artists);
  document.querySelector("artists-section item-counter").value = artists.length;
  document.querySelector("artists-section").classList.remove("loading");
}

export async function loadGenres() {
  document.querySelector("genres-section").classList.add("loading");
  const genres = await getGenres();

  document.querySelector("genres-section custom-list").setItems(genres);
  document.querySelector("genres-section item-counter").value = genres.length;
  document.querySelector("genres-section").classList.remove("loading");
}

export async function loadAlbums() {
  document.querySelector("albums-section").classList.add("loading");
  document.querySelector("songs-section").classList.add("loading");
  const albums = await getAlbums();

  document.querySelector("albums-section custom-list").setItems(albums);
  document.querySelector("albums-section item-counter").value = albums.length;
  document.querySelector("albums-section").classList.remove("loading");
  document.querySelector("songs-section").classList.remove("loading");

  // observer.disconnect();
  // document.querySelectorAll("albums-section custom-list li img").forEach((element) => observer.observe(element));
}

export async function loadSongs() {
  document.querySelector("songs-section").classList.add("loading");
  const songs = await getSongs();

  document.querySelector("songs-section custom-list").setItems(songs);
  document.querySelector("songs-section item-counter").value = songs.length;
  document.querySelector("songs-section").classList.remove("loading");
}

export async function loadSongsForArtist(artist, album) {
  document.querySelector("songs-section").classList.add("loading");
  const songs = await getSongsForArtist(artist, album);

  document.querySelector("songs-section custom-list").setItems(songs);
  document.querySelector("songs-section item-counter").value = songs.length;
  document.querySelector("songs-section").classList.remove("loading");
}

export async function loadAlbumsForArtist(artist) {
  document.querySelector("albums-section").classList.add("loading");
  document.querySelector("songs-section").classList.add("loading");
  const albums = await getAlbumsByArtist(artist);

  albums.splice(0, 0, { name: "All Albums", artist });
  document.querySelector("albums-section custom-list").setItems(albums);
  document.querySelector("albums-section item-counter").value = albums.length;
  document.querySelector("albums-section").classList.remove("loading");
  document.querySelector("songs-section").classList.remove("loading");

  // observer.disconnect();
  // document.querySelectorAll("albums-section custom-list li img").forEach((element) => observer.observe(element));
}

export async function loadAlbumsForGenre(genre) {
  document.querySelector("albums-section").classList.add("loading");
  document.querySelector("songs-section").classList.add("loading");
  const albums = await getAlbumsByGenre(genre);

  albums.splice(0, 0, { name: "All Albums", artist: "All Artists" });
  document.querySelector("albums-section custom-list").setItems(albums);
  document.querySelector("albums-section item-counter").value = albums.length;
  document.querySelector("albums-section").classList.remove("loading");
  document.querySelector("songs-section").classList.remove("loading");

  // observer.disconnect();
  // document.querySelectorAll("albums-section custom-list li img").forEach((element) => observer.observe(element));
}

export async function loadSongsForGenre(genre, album) {
  document.querySelector("songs-section").classList.add("loading");
  const songs = await getSongsForGenre(genre, album);

  document.querySelector("songs-section custom-list").setItems(songs);
  document.querySelector("songs-section item-counter").value = songs.length;
  document.querySelector("songs-section").classList.remove("loading");
}
