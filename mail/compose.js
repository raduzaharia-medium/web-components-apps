import { createEml, createMailtoUrl, downloadEml } from "./scripts/services.js";

const attachments = [];

document.addEventListener("save-eml", handleSaveEml);
document.addEventListener("open-mail-app", handleOpenMailApp);
document.getElementById("newAttachment").addEventListener("change", handleAddAttachment);
document.getElementById("emailFrom").addEventListener("change", () => localStorage.setItem("mailFrom", document.getElementById("emailFrom").value));

init();

// Replies and forwards are prepared by the mail page, which has the email that was open
function init() {
  const draft = JSON.parse(sessionStorage.getItem("mail-compose") ?? "{}");

  sessionStorage.removeItem("mail-compose");

  document.getElementById("emailFrom").value = localStorage.getItem("mailFrom") ?? "";
  document.getElementById("emailTo").value = draft.to ?? "";
  document.getElementById("emailCc").value = draft.cc ?? "";
  document.getElementById("emailSubject").value = draft.subject ?? "";
  document.getElementById("emailBody").valueAsHTML = toHtml(draft.text ?? "");
}

function toHtml(text) {
  const element = document.createElement("div");

  element.innerText = text;
  return element.innerHTML.replaceAll("\n", "<br>");
}

function handleAddAttachment() {
  const input = document.getElementById("newAttachment");
  const tag = document.createElement("action-tag");

  tag.setAttribute("behavior", "delete");
  document.getElementById("attachments").append(tag);

  tag.text = input.files[0].name;
  tag.tag = input.files[0];
  input.value = "";
}

function getMessage() {
  const fields = ["emailFrom", "emailTo", "emailCc", "emailBcc"];

  if (!fields.every((id) => document.getElementById(id).reportValidity())) return null;

  return {
    from: document.getElementById("emailFrom").value,
    to: document.getElementById("emailTo").value,
    cc: document.getElementById("emailCc").value,
    bcc: document.getElementById("emailBcc").value,
    subject: document.getElementById("emailSubject").value,
    html: document.getElementById("emailBody").valueAsHTML,
    text: document.getElementById("emailBody").valueAsText,
    attachments: [...document.querySelectorAll("action-tag")].map((element) => element.tag),
  };
}

async function handleSaveEml() {
  const message = getMessage();

  if (message) downloadEml(await createEml(message), message.subject);
}

function handleOpenMailApp() {
  const message = getMessage();

  if (!message) return;

  if (message.attachments.length > 0) {
    alert("A mail link cannot carry attachments. Save the message as an .eml file to keep them.");
    return;
  }

  location.href = createMailtoUrl(message);
}
