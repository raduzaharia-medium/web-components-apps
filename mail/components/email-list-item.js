import "../../shared/components/custom-list-skeleton.js";

import { CustomListItem } from "../../shared/components/custom-list-item.js";
import { getMessage, markAsRead, canWrite } from "../scripts/services.js";

const dateFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "numeric", year: "numeric" });

export class EmailListItem extends CustomListItem {
  #email;
  #message = null;

  get data() {
    return this.#email;
  }
  get message() {
    return this.#message;
  }

  set data(newValue) {
    this.#email = newValue;
    this.dataset.item = newValue.id;

    this.querySelector(".sender").textContent = newValue.from.name || newValue.from.address;
    this.querySelector(".subject").textContent = newValue.subject || "(no subject)";
    this.querySelector(".receive-date").textContent = dateFormat.format(newValue.date);
    this.classList.toggle("unread", !newValue.read);
  }

  constructor() {
    super();

    this.addEventListener("click", (e) => {
      if (!e.target.closest(".multiselect-target, .message")) this.toggle();
    });
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.querySelector(".sender")) return;

    this.innerHTML = `
      <div class="summary">
        <img class="check multiselect-target" src="../shared/images/dark/check.svg" />
        <img class="uncheck multiselect-target" src="../shared/images/dark/uncheck.svg" />

        <span class="sender"></span>
        <span class="subject"></span>
        <span class="receive-date"></span>
      </div>
      <div class="message">
        <p class="attachments"></p>
        <div class="content"></div>
        <custom-list-skeleton></custom-list-skeleton>
      </div>`;
  }

  async toggle() {
    if (this.classList.contains("open")) return this.close();

    this.classList.add("open");
    await this.load();

    this.dispatchEvent(new CustomEvent("email-opened", { bubbles: true, composed: true, detail: { email: this.#email, message: this.#message } }));
  }

  close() {
    this.classList.remove("open");
    this.dispatchEvent(new CustomEvent("email-closed", { bubbles: true, composed: true }));
  }

  async load() {
    if (!this.#message) {
      const message = this.querySelector(".message");

      message.classList.add("loading");
      this.#message = await getMessage(this.#email.entry);

      this.querySelector(".attachments").replaceChildren(...createAttachmentLinks(this.#message));
      this.querySelector(".content").replaceChildren(createBodyView(this.#message));
      message.classList.remove("loading");
    }

    if (!this.#email.read && canWrite()) {
      await markAsRead(this.#email);

      this.#email = { ...this.#email, read: true };
      this.classList.remove("unread");
      this.dispatchEvent(new CustomEvent("email-read", { bubbles: true, composed: true }));
    }
  }
}

function createAttachmentLinks(message) {
  return message.attachments
    .filter((attachment) => attachment.disposition === "attachment" || !attachment.contentId)
    .map((attachment) => {
      const link = document.createElement("a");

      link.href = URL.createObjectURL(new Blob([attachment.content], { type: attachment.mimeType }));
      link.download = attachment.filename ?? "attachment";
      link.textContent = attachment.filename ?? "attachment";

      return link;
    });
}

// Emails are untrusted: the HTML is shown in a sandboxed frame without scripts and without remote content
function createBodyView(message) {
  if (!message.html) {
    const text = document.createElement("pre");

    text.textContent = message.text ?? "";
    return text;
  }

  const inline = new Map(
    message.attachments
      .filter((attachment) => attachment.contentId)
      .map((attachment) => [attachment.contentId.replace(/^<|>$/g, ""), URL.createObjectURL(new Blob([attachment.content], { type: attachment.mimeType }))]),
  );
  const html = message.html.replace(/cid:([^"')\s>]+)/gi, (match, id) => inline.get(id) ?? match);
  const frame = document.createElement("iframe");

  frame.setAttribute("sandbox", "allow-same-origin allow-popups allow-popups-to-escape-sandbox");
  frame.srcdoc = `<!doctype html>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src blob: data:; style-src 'unsafe-inline'; font-src data:">
    <base target="_blank">
    <style>body { margin: 0; font-family: sans-serif; color: #2a3434; word-wrap: break-word; } img { max-width: 100%; height: auto; }</style>
    ${html}`;
  frame.addEventListener("load", () => {
    frame.style.height = `${frame.contentDocument.documentElement.scrollHeight}px`;
  });

  return frame;
}

customElements.define("email-list-item", EmailListItem);
