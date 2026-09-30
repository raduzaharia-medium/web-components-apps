import { loadData, loadDataLegacy } from "./scripts/services.js";

document.addEventListener("previous", handlePrevious);
document.addEventListener("next", handleNext);
document.addEventListener("load", handleLoad);

async function handleLoad() {
  if (!window.showDirectoryPicker) {
    const directoryPicker = document.createElement("input");
    directoryPicker.type = "file";
    directoryPicker.setAttribute("webkitdirectory", "");
    directoryPicker.click();

    directoryPicker.addEventListener("change", async () => {
      await loadDataLegacy(directoryPicker.files);
      document.querySelector("main").innerHTML = `<artist-browser></artist-browser>`;
    });

    return;
  }

  const selection = await window.showDirectoryPicker();
  await loadData(selection);

  document.querySelector("main").innerHTML = `<artist-browser></artist-browser>`;
}
function handlePrevious(e) {
  if (!e.detail.playlist) return;

  const songs = document.querySelector("songs-section custom-list");

  if (songs.querySelector(".selected")) songs.selectPrevious();
}
function handleNext(e) {
  if (!e.detail.playlist) return;

  const songs = document.querySelector("songs-section custom-list");

  if (songs.querySelector(".selected")) songs.selectNext();
}
