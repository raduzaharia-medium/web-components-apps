import * as id3 from "//unpkg.com/id3js/lib/id3.js";

let data = [];

export async function loadData(directory) {
  data = await parseMusicFiles(directory);
}

export async function loadDataLegacy(files) {
  data = await parseMusicFilesLegacy(files);
}

async function parseMusicFiles(directory) {
  const files = [];

  for await (const entry of directory.values()) {
    if (entry.kind === "file") {
      if (entry.name.match(/\.(mp3)$/i)) {
        const file = await entry.getFile();
        const tags = await id3.fromFile(file);

        files.push({ title: tags.title, artist: tags.artist, album: tags.album, genre: tags.genre, location: "", file: entry });
      }
    } else if (entry.kind === "directory") files.push(...(await this.getAllFiles(entry)));
  }

  return files;
}

async function parseMusicFilesLegacy(fileList) {
  const files = [];

  for (const file of fileList) {
    if (file.name.match(/\.(mp3)$/i)) {
      const tags = await id3.fromFile(file);

      files.push({
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        genre: tags.genre,
        location: file.webkitRelativePath, // Path within the selected folder
        file: file,
      });
    }
  }

  return files;
}

export async function getFileUrl(handle) {
  const file = await handle.getFile();
  const url = URL.createObjectURL(file);

  return url;
}

export async function getArtists() {
  const artists = data.map((song) => song.artist);
  const uniqueArtists = [...new Set(artists)].sort();
  const result = uniqueArtists.map((artist) => {
    return {
      name: artist,
    };
  });

  return result;
}

export async function getGenres() {
  const genres = data.map((song) => song.genre);
  const uniqueGenres = [...new Set(genres)].sort();
  const result = uniqueGenres.map((genre) => {
    return {
      name: genre,
    };
  });

  return result;
}

export async function getAlbums() {
  const albums = data.map((song) => {
    return { name: song.album, artist: song.artist };
  });
  const uniqueAlbums = [...new Set(albums.map(JSON.stringify))];
  const result = Array.from(uniqueAlbums)
    .map(JSON.parse)
    .sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

export async function getAlbumsByArtist(artistName) {
  const albums = data.filter((song) => song.artist === artistName).map((song) => song.album);
  const uniqueAlbums = [...new Set(albums)].sort();
  const result = uniqueAlbums.map((album) => {
    return {
      name: album,
      artist: artistName,
    };
  });

  return result;
}

export async function getAlbumsByGenre(genreName) {
  const albums = data
    .filter((song) => song.genre === genreName)
    .map((song) => {
      return {
        name: song.album,
        artist: song.artist,
      };
    });
  const uniqueAlbums = [...new Set(albums.map(JSON.stringify))];
  const result = Array.from(uniqueAlbums)
    .map(JSON.parse)
    .sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

export async function getSongsForArtist(artistName, albumName) {
  const songs = data.filter((song) => song.artist === artistName && (albumName === "All Albums" || song.album === albumName));
  const result = songs.map((song) => {
    return {
      title: song.title,
      artist: song.artist,
      file: song.file,
    };
  });

  return result;
}

export async function getSongsForGenre(genreName, albumName) {
  const songs = data.filter((song) => song.genre === genreName && (albumName === "All Albums" || song.album === albumName));
  const result = songs.map((song) => {
    return {
      title: song.title,
      artist: song.artist,
      file: song.file,
    };
  });

  return result;
}

export async function getSongs() {
  const result = data.map((song) => {
    return {
      title: song.title,
      artist: song.artist,
      file: song.file,
    };
  });

  return result;
}
