let data = localStorage.getItem("news") ? JSON.parse(localStorage.getItem("news")) : [];

export async function importOPML(files) {
  const file = files[0];
  if (!file.name.match(/\.(opml)$/i)) return;

  const fileText = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fileText, "application/xml");

  data = [...xmlDoc.querySelectorAll("outline:not([type])")].map((e) => ({
    category: e.getAttribute("title"),
    feeds: [...e.children].map((i) => ({
      title: i.getAttribute("title"),
      url: i.getAttribute("xmlUrl"),
    })),
  }));

  localStorage.setItem("news", JSON.stringify(data));
}

export function getCategories() {
  return data.map((e) => e.category);
}

export function getFeeds(category) {
  return data
    .filter((e) => e.category.toLocaleLowerCase() === category.toLocaleLowerCase() || category === "all")
    .map((e) => e.feeds)
    .flat()
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getArticles(feed) {
  const response = await fetch(feed.url);
  const articlesText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(articlesText, "application/xml");
  const result = [...xmlDoc.querySelectorAll("item")].map((item) => ({
    title: item.querySelector("title")?.textContent || "No Title",
    link: item.querySelector("link")?.textContent || "#",
    description: item.querySelector("description")?.textContent || "No Description",
    pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
    content: item.querySelector("content\\:encoded")?.textContent || "",
    guid: item.querySelector("guid")?.textContent || "",
  }));

  const localData = localStorage.getItem("newsData");
  const localArticles = localData ? JSON.parse(localData) : {};
  const selectedFeed = localArticles[feed.title];

  if (!selectedFeed) {
    localArticles[feed.title] = result.map((article) => ({
      ...article,
      read: false,
    }));
    localStorage.setItem("newsData", JSON.stringify(localArticles));
  } else {
    result.forEach((article) => {
      const existingArticle = selectedFeed.find((a) => a.guid === article.guid);
      if (existingArticle) {
        article.read = existingArticle.read;
      } else {
        selectedFeed.push({ ...article, read: false });
      }
    });

    localArticles[feed.title] = selectedFeed;
    localStorage.setItem("newsData", JSON.stringify(localArticles));
  }

  return result;
}

export async function markAllAsRead(category, feed) {}
