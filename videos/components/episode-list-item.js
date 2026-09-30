import { CustomListItem } from "../../shared/components/custom-list-item.js";
import { getVideoUrl, getThumbnailUrl } from "../scripts/services.js";

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      observer.unobserve(entry.target);
      entry.target.loadThumbnail();
    }
  },
  { rootMargin: "200px" },
);

export class EpisodeListItem extends CustomListItem {
  #episode;

  get data() {
    return this.#episode;
  }

  set data(newValue) {
    this.#episode = newValue;
    this.dataset.item = newValue.location;

    this.querySelector("strong").textContent = newValue.name;
    this.querySelector(".season").textContent = newValue.season;
  }

  constructor() {
    super();

    this.addEventListener("click", (e) => {
      if (!e.target.closest("video")) this.toggle();
    });
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.querySelector("img")) {
      this.innerHTML = `
        <img class="thumbnail preview" decoding="async" src="./images/video-preview.svg" />
        <legend>
          <strong></strong>
          <span class="season"></span>
        </legend>
        <video controls preload="metadata"></video>`;
    }

    observer.observe(this);
  }

  disconnectedCallback() {
    observer.unobserve(this);
  }

  async loadThumbnail() {
    const url = await getThumbnailUrl(this.#episode);
    const thumbnail = this.querySelector("img.thumbnail");

    if (!url) return;

    thumbnail.addEventListener("load", () => thumbnail.classList.remove("preview"), { once: true });
    thumbnail.src = url;
  }

  async toggle() {
    const video = this.querySelector("video");

    this.classList.toggle("open");

    if (!this.classList.contains("open")) video.pause();
    else if (!video.src) video.src = await getVideoUrl(this.#episode);
  }
}

customElements.define("episode-list-item", EpisodeListItem);
