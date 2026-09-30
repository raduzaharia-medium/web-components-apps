import { CustomListItem } from "../../shared/components/custom-list-item.js";
import { getPhotoDate, getImageUrl, getThumbnailUrl } from "../scripts/services.js";

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

export class PhotoListItem extends CustomListItem {
  #photo;

  get data() {
    return this.#photo;
  }

  set data(newValue) {
    this.#photo = newValue;
    this.dataset.item = newValue.location;

    this.querySelector(".name").textContent = newValue.name;
  }

  constructor() {
    super();

    this.addEventListener("click", () => this.toggle());
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.querySelector("img")) {
      this.innerHTML = `
        <img class="thumbnail preview" decoding="async" src="./images/photo-preview.svg" />
        <div class="details">
          <img class="full" decoding="async" />
          <span class="name"></span>
          <span class="date"></span>
        </div>`;
    }

    observer.observe(this);
  }

  disconnectedCallback() {
    observer.unobserve(this);
  }

  async loadThumbnail() {
    const thumbnail = this.querySelector("img.thumbnail");

    thumbnail.addEventListener("load", () => thumbnail.classList.remove("preview"), { once: true });
    thumbnail.src = await getThumbnailUrl(this.#photo);
  }

  async toggle() {
    this.classList.toggle("open");
    if (!this.classList.contains("open")) return;

    const image = this.querySelector("img.full");

    if (!image.src) image.src = await getImageUrl(this.#photo);
    this.querySelector(".date").textContent = (await getPhotoDate(this.#photo)).toLocaleString();
  }
}

customElements.define("photo-list-item", PhotoListItem);
