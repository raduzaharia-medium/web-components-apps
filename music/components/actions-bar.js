import { ActionsBar } from "../../shared/components/actions-bar.js";

export class MusicActionsBar extends ActionsBar {
  static get observedAttributes() {
    return ["src"];
  }

  get src() {
    return this.getAttribute("src");
  }
  get markup() {
    return `
      <progress id="progress" class="progress-indicator" min="0" max="1" value="0"></progress>
      <div></div>
      <div></div>
      <div>
        <img class="secondary" id="previous" data-command="previous" src="../shared/images/dark/button-previous.svg" />
        <img class="primary" id="play" data-command="play" src="../shared/images/dark/button-play.svg" />
        <img class="primary hidden" id="pause" data-command="pause" src="../shared/images/dark/button-pause.svg" />
        <img class="secondary" id="next" data-command="next" src="../shared/images/dark/button-next.svg" />
      </div>
      <div>
        <img class="secondary" id="repeat" data-command="repeat" src="../shared/images/dark/button-repeat.svg" />
        <img class="secondary" id="load" data-command="load" src="../shared/images/dark/button-load.svg" />
      </div>

      <audio id="player" autoplay></audio>`;
  }
  get commandDetail() {
    return { playlist: this.playlist };
  }

  set src(newValue) {
    this.setAttribute("src", newValue);
  }

  connectedCallback() {
    super.connectedCallback();

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

    this.querySelector("#repeat").addEventListener("click", () => {
      this.querySelector("#player").loop = !this.querySelector("#player").loop;
      this.querySelector("#repeat").classList.toggle("selected");
    });

    this.querySelector("#player").addEventListener("ended", () => {
      this.dispatchEvent(new CustomEvent("next", { bubbles: true, composed: true, detail: { playlist: this.playlist } }));
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.querySelector("#player").src = newValue;

    if (name === "src" && oldValue !== newValue) {
      this.querySelector("#play").classList.add("hidden");
      this.querySelector("#pause").classList.add("selected");
      this.querySelector("#pause").classList.remove("hidden");
    }
  }

  setPlaylist(playlist) {
    this.playlist = playlist;
  }
}

customElements.define("actions-bar", MusicActionsBar);
