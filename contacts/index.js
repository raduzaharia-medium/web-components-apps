import "./components/details-section.js";

history.pushState({ page: "all" }, "Contacts", "./");

document.querySelector("contacts-section custom-list").addEventListener("change", async () => {
  const selection = document.querySelector("contacts-section custom-list").selectedData;
  if (!selection) return;

  document.querySelector("section").innerHTML = `<details-section></details-section>`;

  document.querySelector("details-section").classList.add("loading");
  document.body.classList.add("contact-selected");
  document.body.classList.remove("edit");

  document.querySelector("details-section").data = selection;

  history.pushState({ page: selection.name }, "Contacts", "./");
  document.querySelector("selected-item-nav").value = selection.name;
  document.querySelector("details-section").classList.remove("loading");
});
