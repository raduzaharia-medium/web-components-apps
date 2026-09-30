import { loadData, loadDataLegacy, getFolders, getAlbums, getTimeline, getPhotos, getPhotosByPeriod } from "./scripts/services.js";

window.addEventListener("popstate", handlePopState);

document.addEventListener("mode-changed", handleModeChange);
document.addEventListener("group-selected", handleGroupSelected);
document.addEventListener("load-photos", handleLoadPhotos);

function handlePopState() {
  document.body.classList.remove("group-selected");
}

async function handleLoadPhotos() {
  if (!window.showDirectoryPicker) {
    const directoryPicker = document.createElement("input");

    directoryPicker.type = "file";
    directoryPicker.setAttribute("webkitdirectory", "");
    directoryPicker.click();

    directoryPicker.addEventListener("change", async () => {
      await loadDataLegacy(directoryPicker.files);
      await handleModeChange();
    });

    return;
  }

  try {
    await loadData(await window.showDirectoryPicker());
  } catch {
    return;
  }

  await handleModeChange();
}

async function handleModeChange() {
  const mode = document.querySelector("photos-responsive-nav").value;
  const section = document.querySelector(`#${mode}`);
  const loaders = { folders: getFolders, albums: getAlbums, timeline: getTimeline };

  document.body.classList.remove("browse-folders", "browse-albums", "browse-timeline", "group-selected");
  document.body.classList.add(`browse-${mode}`);

  document.querySelector("selected-item-nav").value = "";
  document.querySelector("photos-section custom-list").clearItems();
  document.querySelector("photos-section item-counter").value = 0;

  section.classList.add("loading");

  const groups = await loaders[mode]();

  section.querySelector("custom-list").setItems(groups);
  section.querySelector("item-counter").value = groups.length;
  section.classList.remove("loading");
}

async function handleGroupSelected(e) {
  const mode = document.querySelector("photos-responsive-nav").value;

  history.pushState({ page: "group" }, "", "");
  document.body.classList.add("group-selected");
  document.querySelector("selected-item-nav").value = e.detail.name;

  document.querySelector("photos-section").classList.add("loading");

  const photos = mode === "timeline" ? await getPhotosByPeriod(e.detail.location) : await getPhotos(e.detail.location);

  document.querySelector("photos-section custom-list").setItems(photos);
  document.querySelector("photos-section item-counter").value = photos.length;
  document.querySelector("photos-section").classList.remove("loading");
}
