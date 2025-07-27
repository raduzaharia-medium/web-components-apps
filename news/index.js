import { importOPML, getFeeds, getArticles } from "./scripts/services.js";
import "./components/articles-section.js";

window.addEventListener("popstate", handlePopState);

document.addEventListener("import-opml", handleImportOPML);
document.addEventListener("category-changed", handleCategoryChange);
document.addEventListener("feed-changed", handleFeedChange);

function handlePopState(e) {
  if (document.body.classList.contains("feed-selected")) {
    document.body.classList.remove("feed-selected");
    return;
  }

  if (!e.state || !e.state.page) return;

  history.back();
}

async function handleImportOPML() {
  const filePicker = document.createElement("input");

  filePicker.type = "file";
  filePicker.click();

  filePicker.addEventListener("change", async () => {
    document.body.classList.remove("feed-selected");

    document.querySelector("section").innerHTML = "";
    document.querySelector("feeds-section").classList.add("loading");

    await importOPML(filePicker.files);

    const category = document.querySelector("responsive-nav").value;
    const feeds = getFeeds(category);

    document.querySelector("feeds-section custom-list").setItems(feeds);
    document.querySelector("feeds-section").classList.remove("loading");
  });
}

function handleCategoryChange() {
  document.body.classList.remove("feed-selected");

  document.querySelector("section").innerHTML = "";
  document.querySelector("feeds-section").classList.add("loading");

  const category = document.querySelector("responsive-nav").value;
  const feeds = getFeeds(category);

  document.querySelector("feeds-section item-counter").value = feeds.length;
  document.querySelector("feeds-section custom-list").setItems(feeds);
  document.querySelector("feeds-section").classList.remove("loading");
}

async function handleFeedChange() {
  const selection = document.querySelector("feeds-section custom-list").selectedData;

  history.pushState({ page: "feed" }, "", "");
  document.body.classList.add("feed-selected");
  document.querySelector("selected-item-nav").value = selection.item;
  document.querySelector("section").innerHTML = "<articles-section></articles-section>";

  document.querySelector("articles-section").classList.add("loading");

  const articles = await getArticles(selection);

  document.querySelector("articles-section item-counter").value = articles.length;
  document.querySelector("articles-section custom-list").setItems(articles);
  document.querySelector("articles-section").classList.remove("loading");
}

handleCategoryChange();
