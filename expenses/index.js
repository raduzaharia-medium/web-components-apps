import { getData, getAvailableYears, saveData, importData, exportData } from "./scripts/services.js";

document.addEventListener("year-changed", handleYearChanged);
document.addEventListener("month-changed", handleMonthChanged);
document.addEventListener("add-row", handleAddRow);
document.addEventListener("remove-row", handleRemoveRow);
document.addEventListener("save", handleSave);
document.addEventListener("import-json", handleImportJSON);
document.addEventListener("export-json", handleExportJSON);

async function refreshYears(year) {
  const years = await getAvailableYears();

  if (!years.includes(year)) years.push(year);
  years.sort((a, b) => a - b);

  document.querySelector("expenses-responsive-nav").setYears(years, year);
}

async function loadYear(year) {
  document.querySelector("main").classList.add("loading");

  const expenses = await getData(year);

  document.querySelector("expenses-grid").data = expenses;
  document.querySelector("main").classList.remove("loading");
}

function handleYearChanged() {
  loadYear(document.querySelector("expenses-responsive-nav").year);
}

function handleMonthChanged(e) {
  document.querySelector("expenses-grid").setActiveMonth(e.detail);
}

function handleAddRow() {
  document.querySelector("expenses-grid").addNewRow();
}

function handleRemoveRow() {
  document.querySelector("expenses-grid").removeSelectedRow();
}

async function handleSave() {
  const expenses = document.querySelector("expenses-grid").data;

  await saveData(expenses);
  await refreshYears(expenses.year);
  await loadYear(expenses.year);
}

function handleImportJSON() {
  const filePicker = document.createElement("input");

  filePicker.type = "file";
  filePicker.accept = ".json";
  filePicker.multiple = true;
  filePicker.click();

  filePicker.addEventListener("change", async () => {
    const years = await importData(filePicker.files);

    if (years.length === 0) {
      alert("No valid expenses file found.");
      return;
    }

    await refreshYears(years[0]);
    await loadYear(years[0]);
  });
}

function handleExportJSON() {
  exportData(document.querySelector("expenses-grid").data);
}

const year = new Date().getFullYear();

await refreshYears(year);
await loadYear(year);
