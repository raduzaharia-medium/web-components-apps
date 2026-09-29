import { products } from "./products.js";

let shoppingList = localStorage.getItem("shopping") ? JSON.parse(localStorage.getItem("shopping")) : [];

export async function getCategories() {
  return [...new Set(products.map((product) => product.category))];
}

export async function getProducts(category) {
  return category ? products.filter((product) => product.category === category) : products;
}

export async function getShoppingList(category) {
  return category ? shoppingList.filter((product) => product.category === category) : shoppingList;
}

export async function setShoppingList(category, names) {
  shoppingList = [...shoppingList.filter((product) => product.category !== category), ...names.map((name) => ({ name, category }))];

  localStorage.setItem("shopping", JSON.stringify(shoppingList));
}

export async function deleteShoppingList(items) {
  shoppingList = shoppingList.filter((product) => !items.some((item) => item.name === product.name && item.category === product.category));

  localStorage.setItem("shopping", JSON.stringify(shoppingList));
}
