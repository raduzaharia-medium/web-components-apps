import "../../shared/components/custom-list-skeleton.js";

export class DetailsSection extends HTMLElement {
  #data;

  get data() {
    return this.#data;
  }

  set data(newValue) {
    this.#data = newValue;
    this.clear();

    if (newValue === null) return;

    this.setName(newValue.name, newValue.nickname);
    this.setBirthday(newValue.birthday);
    this.setPhoto(newValue.gender);
    this.setOccupation(newValue.title, newValue.company);
    this.setHomeAddress(newValue.homeAddress);
    this.setEmails(newValue.email);
    this.setPhoneNumbers(newValue.phone);
  }

  constructor() {
    super();

    this.innerHTML = `
        <div class="main-info">
            <img id="photo" src="">
            <span id="name"></span>
            <span id="nameMobile"></span>
            <span id="birthday"></span>
            <span id="occupation"></span>
            <span id="homeAddress"></span>
            <span id="workAddress"></span>
        </div>

        <ul id="phoneInfo"></ul>
        <ul id="emailInfo"></ul>

        <custom-list-skeleton></custom-list-skeleton>`;
  }

  clear() {
    this.querySelector("#photo").src = "";
    this.querySelector("#name").innerText = "";
    this.querySelector("#nameMobile").innerText = "";
    this.querySelector("#birthday").innerText = "";
    this.querySelector("#occupation").innerText = "";
    this.querySelector("#homeAddress").innerText = "";
    this.querySelector("#emailInfo").innerText = "";
    this.querySelector("#phoneInfo").innerText = "";
  }

  setName(name, nickname) {
    this.querySelector("#name").innerText = "";
    this.querySelector("#nameMobile").innerText = "";

    if (name && nickname && name !== "undefined" && nickname != "undefined") this.querySelector("#name").innerText = `${name} (${nickname})`;
    else if (name && name !== "undefined") this.querySelector("#name").innerText = name;
    else if (nickname && nickname !== "undefined") this.querySelector("#nameMobile").innerText = nickname;
  }
  setBirthday(birthday) {
    this.querySelector("#birthday").innerText = "";
    if (!birthday || birthday === "undefined") return;

    const date = new Date(birthday);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatted = new Intl.DateTimeFormat("en", options).format(date);

    this.querySelector("#birthday").innerText = formatted;
  }
  setPhoto(gender) {
    this.querySelector("#photo").src = "";

    if (!gender || gender === "undefined") this.querySelector("#photo").src = "./images/man.svg";
    else this.querySelector("#photo").src = gender === "male" ? "./images/man.svg" : "./images/woman.svg";
  }
  setOccupation(title, company) {
    this.querySelector("#occupation").innerText = "";

    if (title && company && title !== "undefined" && company !== "undefined") this.querySelector("#occupation").innerText += `${title} - ${company}`;
    else if (title && title !== "undefined") this.querySelector("#occupation").innerText = title;
    else if (company && company !== "undefined") this.querySelector("#occupation").innerText = company;
  }
  setHomeAddress(homeAddress) {
    this.querySelector("#homeAddress").innerText = "";
    if (!homeAddress || homeAddress === "undefined") return;

    this.querySelector("#homeAddress").innerText = homeAddress;
  }
  setEmails(emails) {
    this.querySelector("#emailInfo").innerText = "";
    if (!emails) return;

    for (const element of emails.split(",")) {
      const emailNode = document.createElement("li");

      emailNode.innerText = element;
      this.querySelector("#emailInfo").appendChild(emailNode);
    }
  }
  setPhoneNumbers(phoneNumbers) {
    this.querySelector("#phoneInfo").innerText = "";
    if (!phoneNumbers) return;

    for (const element of phoneNumbers.split(",")) {
      const phoneNode = document.createElement("li");

      phoneNode.innerText = element;
      this.querySelector("#phoneInfo").appendChild(phoneNode);
    }
  }
}

customElements.define("details-section", DetailsSection);
