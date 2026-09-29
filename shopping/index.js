import { getCategories, getProducts, getShoppingList, setShoppingList, deleteShoppingList } from "./scripts/services.js";

window.addEventListener("popstate", handlePopState);

document.addEventListener("mode-changed", handleModeChange);
document.addEventListener("category-selected", handleCategorySelected);
document.addEventListener("save", handleSave);

function handlePopState() {
  document.body.classList.remove("category-selected");
}

async function loadCategories() {
  document.querySelector("categories-section").classList.add("loading");

  const categories = await getCategories();

  document.querySelector("categories-section custom-list").setItems(categories);
  document.querySelector("categories-section").classList.remove("loading");
}

async function loadShoppingList() {
  document.querySelector("shopping-section").classList.add("loading");

  const items = await getShoppingList();

  document.querySelector("shopping-section custom-list").setItems(items);
  document.querySelector("shopping-section").classList.remove("loading");
}

async function handleModeChange() {
  const mode = document.querySelector("shopping-responsive-nav").value;

  document.body.classList.remove("planning", "shopping", "category-selected");
  document.body.classList.add(mode);

  document.querySelector("selected-item-nav").value = "";
  document.querySelector("categories-section custom-list").clearSelection();
  document.querySelector("products-section custom-list").clearItems();

  if (mode === "shopping") await loadShoppingList();
}

async function handleCategorySelected(e) {
  const category = e.detail;

  history.pushState({ page: "category" }, "", "");
  document.body.classList.add("category-selected");
  document.querySelector("selected-item-nav").value = category;

  document.querySelector("products-section").classList.add("loading");

  const products = await getProducts(category);
  const selected = await getShoppingList(category);

  document.querySelector("products-section custom-list").setItems(products);
  document.querySelectorAll("products-section product-list-item").forEach((element) => {
    if (selected.some((item) => item.name === element.dataset.item)) element.select();
  });
  document.querySelector("products-section").classList.remove("loading");
}

async function handleSave() {
  if (document.body.classList.contains("planning")) await savePlanning();
  else await saveShopping();
}

async function savePlanning() {
  const category = document.querySelector("selected-item-nav").value;
  const names = document.querySelector("products-section custom-list").selectedData.map((element) => element.item);

  await setShoppingList(category, names);
  history.back();
}

async function saveShopping() {
  const list = document.querySelector("shopping-section custom-list");
  const others = list.allData.filter((element) => element.category === "Others").map((element) => element.item);
  const bought = list.selectedData.map((element) => ({ name: element.item, category: element.category }));

  await setShoppingList("Others", others);
  await deleteShoppingList(bought);

  await loadShoppingList();
}

await loadCategories();
