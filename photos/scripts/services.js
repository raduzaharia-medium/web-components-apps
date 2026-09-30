import { parse } from "https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/lite.esm.mjs";

const extensions = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;
const thumbnails = new Map();
const images = new Map();

let data = null;

export async function loadData(directory) {
  data = await parseFolder(directory, directory.name);
}

export async function loadDataLegacy(fileList) {
  data = parseFileList(fileList);
}

async function parseFolder(directory, location) {
  const folder = { name: directory.name, location, folders: [], photos: [] };

  for await (const entry of directory.values()) {
    if (entry.name.startsWith(".")) continue;

    if (entry.kind === "directory") folder.folders.push(await parseFolder(entry, `${location}/${entry.name}`));
    else if (entry.name.match(extensions)) folder.photos.push({ name: entry.name, location: `${location}/${entry.name}`, file: entry });
  }

  return folder;
}

function parseFileList(fileList) {
  let root = null;

  for (const file of fileList) {
    const parts = file.webkitRelativePath.split("/");

    if (!file.name.match(extensions) || parts.some((part) => part.startsWith("."))) continue;

    root ??= { name: parts[0], location: parts[0], folders: [], photos: [] };

    let folder = root;

    for (const part of parts.slice(1, -1)) {
      let child = folder.folders.find((element) => element.name === part);

      if (!child) {
        child = { name: part, location: `${folder.location}/${part}`, folders: [], photos: [] };
        folder.folders.push(child);
      }

      folder = child;
    }

    folder.photos.push({ name: file.name, location: file.webkitRelativePath, file });
  }

  return root;
}

function flatten(folder, depth = 0) {
  const sorted = [...folder.folders].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  return [{ ...folder, depth }, ...sorted.flatMap((element) => flatten(element, depth + 1))];
}

function findFolder(location) {
  return data ? flatten(data).find((folder) => folder.location === location) : undefined;
}

async function getFile(photo) {
  return photo.file instanceof File ? photo.file : await photo.file.getFile();
}

async function loadDates(photos) {
  for (let index = 0; index < photos.length; index += 20) {
    await Promise.all(photos.slice(index, index + 20).map(getPhotoDate));
  }
}

function periodOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function byDate(photos) {
  return [...photos].sort((a, b) => a.date - b.date || a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export async function getFolders() {
  return data ? flatten(data).map(({ name, location, depth }) => ({ name, location, depth })) : [];
}

export async function getAlbums() {
  return data
    ? flatten(data)
        .filter((folder) => folder.name.includes(" - "))
        .map(({ name, location }) => ({ name, location }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];
}

export async function getTimeline() {
  const photos = data ? flatten(data).flatMap((folder) => folder.photos) : [];
  const groups = new Map();

  await loadDates(photos);

  for (const photo of photos) {
    const key = periodOf(photo.date);

    if (!groups.has(key)) groups.set(key, { name: photo.date.toLocaleDateString("default", { year: "numeric", month: "long" }), location: key });
  }

  return [...groups.values()].sort((a, b) => b.location.localeCompare(a.location));
}

export async function getPhotos(location) {
  const photos = findFolder(location)?.photos ?? [];

  await loadDates(photos);
  return byDate(photos);
}

export async function getPhotosByPeriod(period) {
  const photos = data ? flatten(data).flatMap((folder) => folder.photos) : [];

  await loadDates(photos);
  return byDate(photos.filter((photo) => periodOf(photo.date) === period));
}

export async function getPhotoDate(photo) {
  if (!photo.date) {
    const file = await getFile(photo);

    try {
      const tags = await parse(file, { ifd0: false, exif: ["DateTimeOriginal", "CreateDate"] });

      photo.date = tags?.DateTimeOriginal ?? tags?.CreateDate;
    } catch {
      photo.date = undefined;
    }

    if (!(photo.date instanceof Date) || isNaN(photo.date)) photo.date = new Date(file.lastModified);
  }

  return photo.date;
}

export async function getImageUrl(photo) {
  if (!images.has(photo.location)) images.set(photo.location, URL.createObjectURL(await getFile(photo)));

  return images.get(photo.location);
}

export function getThumbnailUrl(photo) {
  if (!thumbnails.has(photo.location)) thumbnails.set(photo.location, createThumbnail(photo));

  return thumbnails.get(photo.location);
}

async function createThumbnail(photo) {
  try {
    const bitmap = await createImageBitmap(await getFile(photo), { resizeHeight: 160, resizeQuality: "medium" });
    const canvas = document.createElement("canvas");

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.6));

    return URL.createObjectURL(blob);
  } catch {
    return getImageUrl(photo);
  }
}
