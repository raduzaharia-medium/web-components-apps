import "../../shared/components/custom-list-skeleton.js";

export class EditSection extends HTMLElement {
  #uid = null;

  get data() {
    return {
      uid: this.#uid,
      name: this.querySelector("#name").value,
      nickname: this.querySelector("#nickname").value,
      title: this.querySelector("#title").value,
      company: this.querySelector("#company").value,
      homeAddress: this.querySelector("#homeAddress").value,
      gender: this.querySelector("#gender").value,
    };
  }

  set data(newValue) {
    this.clear();

    if (newValue === null) return;

    this.#uid = newValue.uid;
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
            <input id="uid" type="hidden">

            <div id="editName">
                <input id="name" placeholder="Name">
                <input id="nickname" placeholder="Nickname">
            </div>

            <div id="editOccupation">
                <input id="title" placeholder="Job title">
                <input id="company" placeholder="Company">
            </div>

            <div id="editCategoryBirthdayGender">
                <input id="category" placeholder="Category">
                <input id="birthday" placeholder="Birthday (YYYY-MM-DD)">
                <input id="gender" placeholder="Gender (male/female)">
            </div>

            <div id="editHomeAddress">
                <input id="homeAddress" placeholder="Home address">
            </div>

            <div id="editWorkAddress">
                <input id="workAddress" placeholder="Work address">
            </div>
        </div>

        <ul id="editPhoneInfo">
            <li><input id="addPhone" placeholder="Phone number"></li>
        </ul>
        <ul id="editEmailInfo">
            <li><input id="addEmail" placeholder="Email address"></li>
        </ul>

        <custom-list-skeleton></custom-list-skeleton>`;
  }

  clear() {
    this.querySelector("#photo").src = "";
    this.querySelector("#name").value = "";
    this.querySelector("#nickname").value = "";
    this.querySelector("#birthday").value = "";
    this.querySelector("#title").value = "";
    this.querySelector("#company").value = "";
    this.querySelector("#homeAddress").value = "";
    //this.querySelector("#emailInfo").value = "";
    //this.querySelector("#phoneInfo").value = "";
  }

  setName(name, nickname) {
    this.querySelector("#name").value = "";
    this.querySelector("#nickname").value = "";

    if (name && name !== "undefined") this.querySelector("#name").value = name;
    if (nickname && nickname !== "undefined") this.querySelector("#nickname").value = nickname;
  }
  setBirthday(birthday) {
    this.querySelector("#birthday").value = "";
    if (!birthday || birthday === "undefined") return;

    const date = new Date(birthday);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatted = new Intl.DateTimeFormat("en", options).format(date);

    this.querySelector("#birthday").value = formatted;
  }
  setPhoto(gender) {
    this.querySelector("#photo").src = "";

    if (!gender) this.querySelector("#photo").src = "./images/man.svg";
    else this.querySelector("#photo").src = gender === "male" ? "./images/man.svg" : "./images/woman.svg";
  }
  setOccupation(title, company) {
    this.querySelector("#title").value = "";
    this.querySelector("#company").value = "";

    if (title && title !== "undefined") this.querySelector("#title").value = title;
    if (company && company !== "undefined") this.querySelector("#company").value = company;
  }
  setHomeAddress(homeAddress) {
    this.querySelector("#homeAddress").value = "";
    if (!homeAddress || homeAddress === "undefined") return;

    this.querySelector("#homeAddress").value = homeAddress;
  }
  setEmails(emails) {
    // this.querySelector("#emailInfo").value = "";
    // if (!emails) return;
    // for (const element of emails.split(",")) {
    //   const emailNode = document.createElement("li");
    //   emailNode.value = element;
    //   this.querySelector("#emailInfo").appendChild(emailNode);
    // }
  }
  setPhoneNumbers(phoneNumbers) {
    // this.querySelector("#phoneInfo").value = "";
    // if (!phoneNumbers) return;
    // for (const element of phoneNumbers.split(",")) {
    //   const phoneNode = document.createElement("li");
    //   phoneNode.value = element;
    //   this.querySelector("#phoneInfo").appendChild(phoneNode);
    // }
  }
}

customElements.define("edit-section", EditSection);
