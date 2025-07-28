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

  const audioPlayer = document.querySelector("audio");
  const currentLocation = audioPlayer.src.replace("/stream?location=", "");
  const currentIndex = e.detail.playlist.findIndex((element) => element.location === currentLocation);

  let previousIndex = currentIndex - 1;
  if (previousIndex < 0) previousIndex = e.detail.playlist.length - 1;

  document.querySelector("songs-section custom-list").selectPrevious();

  audioPlayer.src = `/stream?location=${e.detail.playlist[previousIndex].location}`;
}
function handleNext(e) {
  if (!e.detail.playlist) return;

  const audioPlayer = document.querySelector("audio");
  const currentLocation = audioPlayer.src.replace("/stream?location=", "");
  const currentIndex = e.detail.playlist.findIndex((element) => element.location === currentLocation);
  const nextIndex = (currentIndex + 1) % e.detail.playlist.length;

  document.querySelector("songs-section custom-list").selectNext();

  audioPlayer.src = `/stream?location=${e.detail.playlist[nextIndex].location}`;
}
