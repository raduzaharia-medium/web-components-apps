import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class SongListItem extends CustomListItem {
  get data() {
    return { ...this.dataset, file: this.file };
  }

  set data(newValue) {
    this.dataset.item = newValue.title;
    this.dataset.artist = newValue.artist;
    this.file = newValue.file;

    this.querySelector(".title").innerText = newValue.title;
    this.querySelector(".artist").innerText = newValue.artist;
  }

  constructor() {
    super();

    this.classList.add("song-list-item");
    this.innerHTML = `<img loading="lazy" decoding="async" src="../images/play.svg" />
      <span class="title"></span>
      <span class="artist"></span>`;
  }
}

customElements.define("song-list-item", SongListItem, { extends: "li" });
