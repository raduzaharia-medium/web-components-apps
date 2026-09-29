let data = localStorage.getItem("expenses") ? JSON.parse(localStorage.getItem("expenses")) : {};

function normalize(file) {
  const year = parseInt(file?.year);
  if (isNaN(year) || !Array.isArray(file.categories)) return null;

  return {
    categories: file.categories.map((category) => ({
      title: String(category.title ?? ""),
      expenses: (category.expenses ?? []).map((expense) => ({
        title: String(expense.title ?? ""),
        paid: Array.from({ length: 12 }, (_, index) => expense.paid?.[index] ?? "Pending"),
      })),
    })),
    year,
  };
}

export async function getAvailableYears() {
  return Object.keys(data)
    .map((year) => parseInt(year))
    .sort((a, b) => a - b);
}

export async function getData(year) {
  return data[year] ?? { categories: [], year: parseInt(year) };
}

export async function saveData(expenses) {
  data[expenses.year] = expenses;
  localStorage.setItem("expenses", JSON.stringify(data));
}

export async function importData(files) {
  const years = [];

  for (const file of files) {
    if (!file.name.match(/\.(json)$/i)) continue;

    try {
      const parsed = JSON.parse(await file.text());

      for (const element of Array.isArray(parsed) ? parsed : [parsed]) {
        const expenses = normalize(element);
        if (!expenses) continue;

        data[expenses.year] = expenses;
        years.push(expenses.year);
      }
    } catch {
      continue;
    }
  }

  localStorage.setItem("expenses", JSON.stringify(data));
  return years;
}

export function exportData(expenses) {
  const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: "application/json" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `${expenses.year}.json`;
  link.click();

  URL.revokeObjectURL(link.href);
}
