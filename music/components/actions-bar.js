import { loadData, loadDataLegacy } from "../scripts/services.js";

export class ActionsBar extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  get src() {
    return this.getAttribute("src");
  }
  get data() {
    const currentIndex = this.playlist.findIndex((element) => element.selected === "true");
    return this.playlist[currentIndex];
  }

  set src(newValue) {
    this.setAttribute("src", newValue);
  }

  constructor() {
    super();

    this.innerHTML = `
      <progress id="progress" class="progress-indicator" min="0" max="1" value="0"></progress>
      <div></div>
      <div></div>
      <div>
        <img class="media-control secondary previous" id="previous" src="../shared/images/dark/button-previous.svg" />
        <img class="media-control primary play" id="play" src="../shared/images/dark/button-play.svg" />
        <img class="media-control primary pause hidden" id="pause" src="../shared/images/dark/button-pause.svg" />
        <img class="media-control secondary next" id="next" src="../shared/images/dark/button-next.svg" />
      </div>
      <div>
        <img class="media-control secondary repeat" id="repeat" src="../shared/images/dark/button-repeat.svg" />
        <img class="media-control secondary repeat" id="load" src="../shared/images/dark/button-load.svg" />
      </div>

      <audio id="player" autoplay></audio>`;

    this.querySelector("#load").addEventListener("click", async () => {
      if (!window.showDirectoryPicker) {
        const directoryPicker = document.createElement("input");
        directoryPicker.type = "file";
        directoryPicker.setAttribute("webkitdirectory", "");
        directoryPicker.click();

        directoryPicker.addEventListener("change", async () => {
          await loadDataLegacy(directoryPicker.files);
          document.querySelector("main").innerHTML = `<artist-browser></artist-browser>`;
        });

        return;
      }

      const selection = await window.showDirectoryPicker();
      await loadData(selection);

      document.querySelector("main").innerHTML = `<artist-browser></artist-browser>`;
    });
    this.querySelector("#play").addEventListener("click", () => {
      if (!this.querySelector("#player").src) return;

      this.querySelector("#player").play();

      this.querySelector("#play").classList.add("hidden");
      this.querySelector("#pause").classList.remove("hidden");
      this.querySelector("#pause").classList.add("selected");
    });

    this.querySelector("#player").addEventListener("timeupdate", () => {
      const player = this.querySelector("#player");
      if (player.currentTime > 0) this.querySelector("#progress").value = player.currentTime / player.duration;
    });

    this.querySelector("#pause").addEventListener("click", () => {
      this.querySelector("#player").pause();

      this.querySelector("#play").classList.remove("selected");
      this.querySelector("#pause").classList.add("hidden");
      this.querySelector("#play").classList.remove("hidden");
      this.querySelector("#pause").classList.remove("selected");
    });

    this.querySelector("#next").addEventListener("click", () => {
      if (!this.playlist) return;

      const currentLocation = this.src.replace("/stream?location=", "");
      const currentIndex = this.playlist.findIndex((element) => element.location === currentLocation);
      const nextIndex = (currentIndex + 1) % this.playlist.length;

      document.querySelector("songs-section custom-list").selectNext();

      this.src = `/stream?location=${this.playlist[nextIndex].location}`;
    });

    this.querySelector("#previous").addEventListener("click", () => {
      if (!this.playlist) return;

      const currentLocation = this.src.replace("/stream?location=", "");
      const currentIndex = this.playlist.findIndex((element) => element.location === currentLocation);
      let previousIndex = currentIndex - 1;
      if (previousIndex < 0) previousIndex = this.playlist.length - 1;

      document.querySelector("songs-section custom-list").selectPrevious();

      this.src = `/stream?location=${this.playlist[previousIndex].location}`;
    });

    this.querySelector("#repeat").addEventListener("click", () => {
      this.querySelector("#player").loop = !this.querySelector("#player").loop;
      this.querySelector("#repeat").classList.toggle("selected");
    });

    this.querySelector("#player").addEventListener("ended", () => {
      if (!this.playlist) return;

      const currentLocation = this.src.replace("/stream?location=", "");
      const currentIndex = this.playlist.findIndex((element) => element.location === currentLocation);
      const nextIndex = (currentIndex + 1) % this.playlist.length;

      this.src = `/stream?location=${this.playlist[nextIndex].location}`;
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.querySelector("#player").src = newValue;

    if (name === "src" && oldValue !== newValue) {
      this.querySelector("#play").classList.add("hidden");
      this.querySelector("#pause").classList.add("selected");
      this.querySelector("#pause").classList.remove("hidden");

      const oldSelection = this.playlist.filter((element) => element.selected === "true")[0];
      if (oldSelection) oldSelection.selected = false;

      const newSelection = this.playlist.filter((element) => element.location === newValue.replace("/stream?location=", ""))[0];
      if (newSelection) newSelection.selected = true;

      this.dispatchEvent(new Event("change"));
    }
  }

  setPlaylist(playlist) {
    this.playlist = playlist;
  }
}

customElements.define("actions-bar", ActionsBar);
