import { loadData, loadDataLegacy, getCategories, getTitles, getEpisodes } from "./scripts/services.js";

window.addEventListener("popstate", handlePopState);

document.addEventListener("category-changed", handleCategoryChange);
document.addEventListener("title-selected", handleTitleSelected);
document.addEventListener("load-videos", handleLoadVideos);

function handlePopState() {
  document.body.classList.remove("title-selected");
}

async function handleLoadVideos() {
  if (!window.showDirectoryPicker) {
    const directoryPicker = document.createElement("input");

    directoryPicker.type = "file";
    directoryPicker.setAttribute("webkitdirectory", "");
    directoryPicker.click();

    directoryPicker.addEventListener("change", async () => {
      await loadDataLegacy(directoryPicker.files);
      await refreshCategories();
    });

    return;
  }

  try {
    await loadData(await window.showDirectoryPicker());
  } catch {
    return;
  }

  await refreshCategories();
}

async function refreshCategories() {
  const categories = await getCategories();

  if (categories.length > 0) document.querySelector("videos-responsive-nav").setCategories(categories);

  await handleCategoryChange();
}

async function handleCategoryChange() {
  const category = document.querySelector("videos-responsive-nav").value;

  document.body.classList.remove("title-selected");
  document.querySelector("selected-item-nav").value = "";
  document.querySelector("episodes-section custom-list").clearItems();
  document.querySelector("episodes-section item-counter").value = 0;

  document.querySelector("titles-section").classList.add("loading");

  const titles = await getTitles(category);

  document.querySelector("titles-section custom-list").setItems(titles);
  document.querySelector("titles-section item-counter").value = titles.length;
  document.querySelector("titles-section").classList.remove("loading");
}

async function handleTitleSelected(e) {
  const category = document.querySelector("videos-responsive-nav").value;

  history.pushState({ page: "title" }, "", "");
  document.body.classList.add("title-selected");
  document.querySelector("selected-item-nav").value = e.detail.name;

  document.querySelector("episodes-section").classList.add("loading");

  const episodes = await getEpisodes(category, e.detail.name);

  document.querySelector("episodes-section custom-list").setItems(episodes);
  document.querySelector("episodes-section item-counter").value = episodes.length;
  document.querySelector("episodes-section").classList.remove("loading");
}
