import {
  canWrite,
  loadData,
  loadDataLegacy,
  reload,
  getAccounts,
  getFolders,
  getEmails,
  markAsRead,
  moveEmails,
  deleteEmails,
  addFolder,
  deleteFolder,
} from "./scripts/services.js";

let selectedPath = null;
let openEmail = null;

window.addEventListener("popstate", handlePopState);

document.addEventListener("account-changed", () => loadFolders());
document.addEventListener("folder-selected", handleFolderSelected);
document.addEventListener("email-opened", handleEmailOpened);
document.addEventListener("email-closed", handleEmailClosed);
document.addEventListener("email-read", refreshFolders);

document.addEventListener("load-mail", handleLoadMail);
document.addEventListener("reload", handleReload);
document.addEventListener("toggle-empty-folders", handleToggleEmptyFolders);
document.addEventListener("add-folder", handleAddFolder);
document.addEventListener("delete-folder", handleDeleteFolder);
document.addEventListener("mark-as-read", handleMarkAsRead);
document.addEventListener("archive", handleArchive);
document.addEventListener("delete-emails", handleDeleteEmails);
document.addEventListener("reply", () => compose("reply"));
document.addEventListener("reply-all", () => compose("reply-all"));
document.addEventListener("forward", () => compose("forward"));
document.addEventListener("new-email", () => compose());

function handlePopState() {
  document.body.classList.remove("folder-selected", "email-open");
  document.querySelector("selected-item-nav").value = "";
}

function getAccount() {
  return document.querySelector("mail-responsive-nav").value;
}

// ---------------------------------------------------------------- loading

async function handleLoadMail() {
  if (!window.showDirectoryPicker) {
    const directoryPicker = document.createElement("input");

    directoryPicker.type = "file";
    directoryPicker.setAttribute("webkitdirectory", "");
    directoryPicker.click();

    directoryPicker.addEventListener("change", async () => {
      await loadDataLegacy(directoryPicker.files);
      await refreshAccounts();
    });

    return;
  }

  try {
    await loadData(await window.showDirectoryPicker({ mode: "readwrite" }));
  } catch {
    return;
  }

  await refreshAccounts();
}

async function handleReload() {
  await reload();
  await refreshAccounts();
}

async function refreshAccounts() {
  const accounts = await getAccounts();

  document.body.classList.toggle("can-write", canWrite());

  if (accounts.length > 0) document.querySelector("mail-responsive-nav").setAccounts(accounts.map((account) => account.id));

  await loadFolders();
}

async function loadFolders() {
  selectedPath = null;
  openEmail = null;

  document.body.classList.remove("folder-selected", "email-open");
  document.querySelector("selected-item-nav").value = "";
  document.querySelector("emails-section custom-list").clearItems();
  document.querySelector("emails-section item-counter").value = 0;

  document.querySelector("folders-section").classList.add("loading");

  const folders = await getFolders(getAccount());

  document.querySelector("folders-section custom-list").setItems(folders);
  updateFolderCounter(folders);
  document.querySelector("folders-section").classList.remove("loading");
}

// Updates the counters of the folders shown without selecting anything again
async function refreshFolders() {
  const folders = await getFolders(getAccount());

  document.querySelectorAll("folders-section folder-list-item").forEach((element) => {
    const folder = folders.find((item) => item.path === element.dataset.path);

    if (folder) element.data = folder;
  });
  updateFolderCounter(folders);
}

function updateFolderCounter(folders) {
  const showAll = document.body.classList.contains("show-empty-folders");

  document.querySelector("folders-section item-counter").value = folders.filter(
    (folder) => showAll || folder.emailCount > 0 || folder.name.toLowerCase() === "inbox",
  ).length;
}

async function loadEmails() {
  document.querySelector("emails-section").classList.add("loading");

  const emails = await getEmails(getAccount(), selectedPath);

  document.querySelector("emails-section custom-list").setItems(emails);
  document.querySelector("emails-section item-counter").value = emails.length;
  document.querySelector("emails-section").classList.remove("loading");
}

// After a change the folders are shown again and the selected one is selected again, which shows its emails again
async function refresh() {
  const path = selectedPath;

  document.body.classList.remove("email-open");
  await loadFolders();

  if (path !== null) {
    selectedPath = path;
    document.body.classList.add("folder-selected");
    document.querySelector("folders-section custom-list").value = path;
  }
}

// ---------------------------------------------------------------- events

async function handleFolderSelected(e) {
  if (!document.body.classList.contains("folder-selected")) history.pushState({ page: "folder" }, "", "");

  selectedPath = e.detail.path;
  document.body.classList.add("folder-selected");
  document.body.classList.remove("email-open");
  document.querySelector("selected-item-nav").value = e.detail.name;

  await loadEmails();
}

function handleEmailOpened(e) {
  document.querySelectorAll("emails-section email-list-item.open").forEach((element) => {
    if (element.data.id !== e.detail.email.id) element.classList.remove("open");
  });

  openEmail = e.detail;
  document.body.classList.add("email-open");
}

function handleEmailClosed() {
  openEmail = null;
  document.body.classList.remove("email-open");
}

function handleToggleEmptyFolders() {
  document.body.classList.toggle("show-empty-folders");
  refreshFolders();
}

// ---------------------------------------------------------------- actions

function getSelectedEmails() {
  return document.querySelector("emails-section custom-list").selectedData ?? [];
}

async function run(action) {
  try {
    await action();
  } catch (error) {
    alert(`This could not be done: ${error.message}`);
  }
}

async function handleMarkAsRead() {
  const selection = getSelectedEmails().filter((email) => !email.read);

  if (selection.length === 0 || !confirm("Are you sure you want to mark the selected items as read?")) return;

  await run(async () => {
    for (const email of selection) await markAsRead(email);
  });
  await refresh();
}

async function handleDeleteEmails() {
  const selection = getSelectedEmails();

  if (selection.length === 0 || !confirm("Are you sure you want to delete the selected items?")) return;

  await run(() => deleteEmails(selection));
  await refresh();
}

async function handleArchive() {
  const selection = getSelectedEmails();

  if (selection.length === 0) return;

  const account = prompt("Account name", getAccount());
  const folder = account && prompt("Folder name");

  if (!folder) return;

  await run(() => moveEmails(selection, account, folder));
  await refresh();
}

async function handleAddFolder() {
  const name = prompt("Folder name", "");

  if (!name) return;

  await run(() => addFolder(getAccount(), selectedPath ?? "", name));
  await refresh();
}

async function handleDeleteFolder() {
  if (selectedPath === null || !confirm("Are you sure you want to delete this folder and its emails?")) return;

  await run(() => deleteFolder(getAccount(), selectedPath));

  selectedPath = null;
  await refresh();
}

// ---------------------------------------------------------------- composing

function compose(action) {
  if (action && openEmail) sessionStorage.setItem("mail-compose", JSON.stringify(createDraft(action, openEmail.email, openEmail.message)));
  else sessionStorage.removeItem("mail-compose");

  location.href = "compose.html";
}

function createDraft(action, email, message) {
  const sender = email.from.name ? `${email.from.name} <${email.from.address}>` : email.from.address;
  const text = getText(message);
  const quoted = text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const subject = email.subject.replace(/^(re|fw|fwd):\s*/i, "");
  const addresses = (list = []) => list.map((address) => address.address).filter(Boolean);

  if (action === "forward") {
    return {
      subject: `Fw: ${subject}`,
      text: `\n\n---------- Forwarded message ----------\nFrom: ${sender}\nDate: ${email.date.toLocaleString()}\nSubject: ${email.subject}\n\n${text}`,
    };
  }

  return {
    subject: `Re: ${subject}`,
    to: (message.replyTo?.length ? addresses(message.replyTo) : addresses([email.from])).join(", "),
    cc: action === "reply-all" ? [...addresses(message.to), ...addresses(message.cc)].filter((address) => address !== email.from.address).join(", ") : "",
    text: `\n\nOn ${email.date.toLocaleString()}, ${sender} wrote:\n${quoted}`,
  };
}

// The quoted text is always plain text, never the HTML of the email
function getText(message) {
  if (message.text) return message.text.trim();
  if (!message.html) return "";

  const document = new DOMParser().parseFromString(message.html, "text/html");

  document.querySelectorAll("script, style").forEach((element) => element.remove());
  return document.body.textContent.trim().replace(/\n{3,}/g, "\n\n");
}
