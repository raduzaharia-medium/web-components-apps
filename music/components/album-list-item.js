import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class AlbumListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.dataset.item = newValue.name;
    this.dataset.artist = newValue.artist;
    this.dataset.src = `/music/album-art?artist=${newValue.artist}&album=${newValue.name}`;

    this.querySelector("strong").innerText = newValue.name;
    this.querySelector("span").innerText = newValue.artist;
  }

  constructor() {
    super();

    this.classList.add("album-list-item");
    this.innerHTML = `<img loading="lazy" decoding="async" src="/music/images/musical-note.svg" />
      <legend>
        <strong></strong>
        <span></span>
      </legend>`;
  }
}

customElements.define("album-list-item", AlbumListItem, { extends: "li" });
