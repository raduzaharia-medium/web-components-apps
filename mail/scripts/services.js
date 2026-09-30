import PostalMime from "https://cdn.jsdelivr.net/npm/postal-mime@2.4.3/+esm";

const maildirs = ["cur", "new"];
const parsedHeaders = new WeakMap();
const parsedMessages = new WeakMap();

let rootHandle = null;
let accounts = [];

// An account is a Maildir: folders that contain "cur" (read) and "new" (unread) folders of email files.
// Folder node: { name, path, handle, folders, cur, new }
// Email entry: { id, name, file, folder, dir }

export function canWrite() {
  return rootHandle !== null;
}

export async function loadData(directory) {
  rootHandle = directory;
  accounts = await scanAccounts(directory);
}

export async function loadDataLegacy(fileList) {
  rootHandle = null;
  accounts = buildAccounts(fileList);
}

export async function reload() {
  if (rootHandle) accounts = await scanAccounts(rootHandle);
}

// ---------------------------------------------------------------- scanning

async function scanAccounts(directory) {
  const children = [];

  for await (const entry of directory.values()) {
    if (entry.kind === "directory") children.push(entry);
  }

  // a Maildir picked directly is a single account
  if (children.some((entry) => maildirs.includes(entry.name))) return [{ id: directory.name, title: directory.name, root: await scanFolder(directory, "") }];

  return Promise.all(children.map(async (entry) => ({ id: entry.name, title: entry.name, root: await scanFolder(entry, "") })));
}

async function scanFolder(directory, path) {
  const node = { name: directory.name, path, handle: directory, folders: [], cur: [], new: [] };

  for await (const entry of directory.values()) {
    if (entry.kind !== "directory") continue;

    if (maildirs.includes(entry.name)) {
      for await (const file of entry.values()) {
        if (file.kind === "file" && !file.name.startsWith(".")) node[entry.name].push(createEntry(file.name, file, node, entry.name));
      }
    } else if (entry.name !== "tmp") {
      node.folders.push(await scanFolder(entry, path ? `${path}/${entry.name}` : entry.name));
    }
  }

  return node;
}

function buildAccounts(fileList) {
  const found = [];
  const rootName = fileList[0]?.webkitRelativePath.split("/")[0] ?? "";

  for (const file of fileList) {
    const segments = file.webkitRelativePath.split("/").slice(1);
    const dir = segments.at(-2);

    if (!maildirs.includes(dir) || file.name.startsWith(".")) continue;

    found.push({ folders: segments.slice(0, -2), dir, file });
  }

  // a Maildir picked directly has no account level above its folders
  const single = found.some((element) => element.folders.length === 0);
  const result = new Map();

  for (const { folders, dir, file } of found) {
    const accountName = single ? rootName : folders[0];

    if (!result.has(accountName)) result.set(accountName, { id: accountName, title: accountName, root: createFolder(accountName, "", null) });

    let node = result.get(accountName).root;

    for (const name of single ? folders : folders.slice(1)) {
      let child = node.folders.find((element) => element.name === name);

      if (!child) {
        child = createFolder(name, node.path ? `${node.path}/${name}` : name, null);
        node.folders.push(child);
      }

      node = child;
    }

    node[dir].push(createEntry(file.name, file, node, dir));
  }

  return [...result.values()];
}

function createFolder(name, path, handle) {
  return { name, path, handle, folders: [], cur: [], new: [] };
}

function createEntry(name, file, folder, dir) {
  return { id: name.replace(/\.eml$/i, ""), name, file, folder, dir };
}

// ---------------------------------------------------------------- reading

function findAccount(id) {
  return accounts.find((account) => account.id.toLowerCase() === id.toLowerCase());
}

function findFolder(account, path) {
  let node = account.root;

  for (const name of path.split("/").filter((element) => element && element !== ".")) node = node?.folders.find((element) => element.name === name);

  return node;
}

function flatten(folders, depth = 0) {
  const sorted = [...folders].sort((a, b) => (a.name.toUpperCase() === "INBOX" ? -1 : b.name.toUpperCase() === "INBOX" ? 1 : a.name.localeCompare(b.name)));

  return sorted.flatMap((folder) => [
    { name: folder.name, path: folder.path, depth, emailCount: folder.cur.length + folder.new.length, unreadCount: folder.new.length },
    ...flatten(folder.folders, depth + 1),
  ]);
}

async function getFile(entry) {
  return entry.file instanceof File ? entry.file : await entry.file.getFile();
}

export async function getAccounts() {
  return accounts.map(({ id, title }) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
}

export async function getFolders(accountId) {
  const account = findAccount(accountId);

  if (!account) return [];

  // a Maildir picked directly has its own emails, shown as the folder of the account ("." is its path)
  const { root } = account;
  const ownEmails = root.cur.length + root.new.length > 0;
  const folders = flatten(root.folders, ownEmails ? 1 : 0);

  if (ownEmails) folders.unshift({ name: account.title, path: ".", depth: 0, emailCount: root.cur.length + root.new.length, unreadCount: root.new.length });

  return folders;
}

export async function getEmails(accountId, path) {
  const account = findAccount(accountId);
  const folder = account && findFolder(account, path);

  if (!folder) return [];

  const entries = [...folder.new, ...folder.cur];
  const result = [];

  for (let index = 0; index < entries.length; index += 25) {
    result.push(...(await Promise.all(entries.slice(index, index + 25).map((entry) => getHeader(account.id, path, entry)))));
  }

  return result.sort((a, b) => b.date - a.date);
}

// Only the start of each file is parsed for the list, the whole message is parsed when it is opened
async function getHeader(accountId, path, entry) {
  if (!parsedHeaders.has(entry)) {
    const file = await getFile(entry);
    let parsed = {};

    try {
      parsed = await PostalMime.parse(await file.slice(0, 32768).arrayBuffer());
    } catch {
      parsed = {};
    }

    parsedHeaders.set(entry, {
      accountId,
      path,
      entry,
      id: entry.id,
      subject: parsed.subject ?? "",
      from: parsed.from ?? { name: "", address: "" },
      date: parsed.date && !isNaN(new Date(parsed.date)) ? new Date(parsed.date) : new Date(file.lastModified),
    });
  }

  return { ...parsedHeaders.get(entry), read: entry.dir === "cur" };
}

export async function getMessage(entry) {
  if (!parsedMessages.has(entry)) parsedMessages.set(entry, PostalMime.parse(await (await getFile(entry)).arrayBuffer()));

  return parsedMessages.get(entry);
}

// ---------------------------------------------------------------- writing (needs a picked folder handle)

async function moveEntry(entry, target, dir = "cur") {
  const file = await getFile(entry);
  const directory = await target.handle.getDirectoryHandle(dir, { create: true });
  let name = entry.name;

  try {
    await directory.getFileHandle(name);
    name = `${Date.now()}.${name}`;
  } catch {
    // no file with this name in the target yet
  }

  const handle = await directory.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();

  await writable.write(file);
  await writable.close();
  await (await entry.folder.handle.getDirectoryHandle(entry.dir)).removeEntry(entry.name);

  // the entry is updated in place, so the emails already shown in a list stay valid
  entry.folder[entry.dir] = entry.folder[entry.dir].filter((element) => element !== entry);
  Object.assign(entry, { name, file: handle, folder: target, dir });
  target[dir].push(entry);
}

export async function markAsRead(email) {
  if (email.entry.dir === "new") await moveEntry(email.entry, email.entry.folder, "cur");
}

export async function moveEmails(emails, targetAccountId, targetPath) {
  const account = findAccount(targetAccountId);
  const target = account && findFolder(account, targetPath);

  if (!target) throw new Error("Folder not found");

  for (const email of emails) await moveEntry(email.entry, target);
}

// The backend moved deleted emails to the trash folder of the account, so they can still be recovered
export async function deleteEmails(emails) {
  for (const email of emails) {
    const account = findAccount(email.accountId);
    let trash = account.root.folders.find((folder) => folder.name.toLowerCase() === "trash");

    if (!trash) trash = await addFolder(account.id, "", "Trash");

    await moveEntry(email.entry, trash);
  }
}

export async function addFolder(accountId, parentPath, name) {
  const account = findAccount(accountId);
  const parent = findFolder(account, parentPath);
  const handle = await parent.handle.getDirectoryHandle(name, { create: true });
  const node = createFolder(name, parentPath && parentPath !== "." ? `${parentPath}/${name}` : name, handle);

  for (const dir of maildirs) await handle.getDirectoryHandle(dir, { create: true });

  parent.folders.push(node);
  return node;
}

export async function deleteFolder(accountId, path) {
  if (path === ".") throw new Error("The folder of the account cannot be deleted");

  const account = findAccount(accountId);
  const parent = findFolder(account, path.split("/").slice(0, -1).join("/"));
  const name = path.split("/").at(-1);

  await parent.handle.removeEntry(name, { recursive: true });
  parent.folders = parent.folders.filter((folder) => folder.name !== name);
}

// ---------------------------------------------------------------- composing
// Browsers cannot talk SMTP, so a message is either handed to the mail application or saved as an .eml file

export function createMailtoUrl({ to, cc, bcc, subject, text }) {
  const parameters = new URLSearchParams();

  if (cc) parameters.set("cc", cc);
  if (bcc) parameters.set("bcc", bcc);
  if (subject) parameters.set("subject", subject);
  if (text) parameters.set("body", text);

  const recipients = to
    .split(",")
    .map((address) => encodeURIComponent(address.trim()).replace("%40", "@"))
    .join(",");

  return `mailto:${recipients}?${parameters.toString().replaceAll("+", "%20")}`;
}

export async function createEml({ from, to, cc, bcc, subject, html, text, attachments }) {
  const alternative = `alternative-${crypto.randomUUID()}`;
  const mixed = `mixed-${crypto.randomUUID()}`;
  const headers = [`Date: ${new Date().toUTCString().replace("GMT", "+0000")}`, `Message-ID: <${crypto.randomUUID()}@mail.local>`, "MIME-Version: 1.0"];

  if (from) headers.push(`From: ${from}`);
  if (to) headers.push(`To: ${to}`);
  if (cc) headers.push(`Cc: ${cc}`);
  if (bcc) headers.push(`Bcc: ${bcc}`);

  headers.push(`Subject: ${encodeHeader(subject)}`);

  const body = [
    `--${alternative}`,
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeBase64(new TextEncoder().encode(text)),
    `--${alternative}`,
    'Content-Type: text/html; charset="utf-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeBase64(new TextEncoder().encode(html)),
    `--${alternative}--`,
  ];

  if (attachments.length === 0) return [...headers, `Content-Type: multipart/alternative; boundary="${alternative}"`, "", ...body, ""].join("\r\n");

  const parts = [`--${mixed}`, `Content-Type: multipart/alternative; boundary="${alternative}"`, "", ...body];

  for (const file of attachments) {
    parts.push(
      `--${mixed}`,
      `Content-Type: ${file.type || "application/octet-stream"}; name="${encodeHeader(file.name)}"`,
      `Content-Disposition: attachment; filename="${encodeHeader(file.name)}"`,
      "Content-Transfer-Encoding: base64",
      "",
      encodeBase64(new Uint8Array(await file.arrayBuffer())),
    );
  }

  return [...headers, `Content-Type: multipart/mixed; boundary="${mixed}"`, "", ...parts, `--${mixed}--`, ""].join("\r\n");
}

export function downloadEml(content, subject) {
  const link = document.createElement("a");

  link.href = URL.createObjectURL(new Blob([content], { type: "message/rfc822" }));
  link.download = `${subject.replace(/[^\p{L}\p{N}\- ]+/gu, "").trim() || "message"}.eml`;
  link.click();

  URL.revokeObjectURL(link.href);
}

function encodeHeader(value) {
  return /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${encodeBase64(new TextEncoder().encode(value), false)}?=`;
}

function encodeBase64(bytes, wrap = true) {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 8192) binary += String.fromCharCode(...bytes.subarray(index, index + 8192));

  return wrap
    ? btoa(binary)
        .replace(/.{1,76}/g, "$&\r\n")
        .trimEnd()
    : btoa(binary);
}
