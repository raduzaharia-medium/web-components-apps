const extensions = /\.(mp4|m4v|mov|webm|ogv|mkv)$/i;
const videoUrls = new Map();
const thumbnails = new Map();

let data = [];

export async function loadData(directory) {
  const entries = [];

  await collectEntries(directory, [], entries);
  data = buildLibrary(entries, directory.name);
}

export async function loadDataLegacy(fileList) {
  const entries = [];
  let rootName = "";

  for (const file of fileList) {
    const [root, ...path] = file.webkitRelativePath.split("/");

    rootName = root;
    if (file.name.match(extensions) && !path.some((part) => part.startsWith("."))) entries.push({ path, file });
  }

  data = buildLibrary(entries, rootName);
}

async function collectEntries(directory, path, entries) {
  for await (const entry of directory.values()) {
    if (entry.name.startsWith(".")) continue;

    if (entry.kind === "directory") await collectEntries(entry, [...path, entry.name], entries);
    else if (entry.name.match(extensions)) entries.push({ path: [...path, entry.name], file: entry });
  }
}

// The first folder level is the category, the second one is the title and anything below it is a season
function buildLibrary(entries, rootName) {
  const categories = new Map();

  for (const { path, file } of entries) {
    const category = path.length > 1 ? path[0] : rootName;
    const [title, ...rest] = path.length > 1 ? path.slice(1) : path;
    const name = stem(rest.length > 0 ? rest.at(-1) : title);
    const season = rest.slice(0, -1).join(" / ");
    const location = [category, ...path.slice(path.length > 1 ? 1 : 0)].join("/");

    if (!categories.has(category)) categories.set(category, new Map());

    const titles = categories.get(category);
    const titleName = rest.length > 0 ? title : name;

    if (!titles.has(titleName)) titles.set(titleName, []);
    titles.get(titleName).push({ name, season, location, file });
  }

  return [...categories].map(([name, titles]) => ({ name, titles }));
}

function stem(fileName) {
  return fileName.replace(/\.[^.]+$/, "");
}

// the navigation lowercases its values, folder names keep their case
function findCategory(name) {
  return data.find((element) => element.name.toLowerCase() === name.toLowerCase());
}

async function getFile(episode) {
  return episode.file instanceof File ? episode.file : await episode.file.getFile();
}

export async function getCategories() {
  return data.map((category) => category.name).sort((a, b) => a.localeCompare(b));
}

export async function getTitles(category) {
  const selection = findCategory(category);

  return [...(selection?.titles.keys() ?? [])].map((name) => ({ name, category })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEpisodes(category, title) {
  const episodes = findCategory(category)?.titles.get(title) ?? [];

  return [...episodes].sort((a, b) =>
    `${a.season}-${a.name}`.localeCompare(`${b.season}-${b.name}`, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

export async function getVideoUrl(episode) {
  if (!videoUrls.has(episode.location)) videoUrls.set(episode.location, URL.createObjectURL(await getFile(episode)));

  return videoUrls.get(episode.location);
}

// Resolves to null when the browser cannot decode the video, so the caller can keep the placeholder
export function getThumbnailUrl(episode) {
  if (!thumbnails.has(episode.location)) thumbnails.set(episode.location, createThumbnail(episode));

  return thumbnails.get(episode.location);
}

async function createThumbnail(episode) {
  const video = document.createElement("video");
  const url = await getVideoUrl(episode);

  return new Promise((resolve) => {
    const finish = (result) => {
      clearTimeout(timeout);
      video.removeAttribute("src");
      video.load();
      resolve(result);
    };
    const timeout = setTimeout(() => finish(null), 10000);

    video.muted = true;
    video.preload = "metadata";

    video.addEventListener("error", () => finish(null), { once: true });
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = Number.isFinite(video.duration) ? Math.max(0.1, Math.min(4, video.duration / 2)) : 0.1;
      },
      { once: true },
    );
    video.addEventListener(
      "seeked",
      () => {
        if (!video.videoWidth) return finish(null);

        const canvas = document.createElement("canvas");

        canvas.height = 160;
        canvas.width = Math.round((video.videoWidth / video.videoHeight) * 160);
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => finish(blob ? URL.createObjectURL(blob) : null), "image/jpeg", 0.6);
      },
      { once: true },
    );

    video.src = url;
  });
}
