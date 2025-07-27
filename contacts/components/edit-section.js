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
      category: this.querySelector("#category").value,
      birthday: this.querySelector("#birthday").value,
      email: Array.from(this.querySelectorAll("ul#editEmailInfo li:not(#addEmail) input")).map((element) => element.value),
      phone: Array.from(this.querySelectorAll("ul#editPhoneInfo li:not(#addPhone) input")).map((element) => element.value),
    };
  }

  set data(newValue) {
    this.clear();

    if (newValue === null) return;

    this.#uid = newValue.uid;
    this.setName(newValue.name, newValue.nickname);
    this.setBirthday(newValue.birthday);
    this.setPhoto(newValue.gender);
    this.setGender(newValue.gender);
    this.setOccupation(newValue.title, newValue.company);
    this.setHomeAddress(newValue.homeAddress);
    this.setEmails(newValue.email);
    this.setPhoneNumbers(newValue.phone);
    this.setCategory(newValue.category);
  }

  constructor() {
    super();
  }

  connectedCallback() {
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
                <select id="category">
                  <option value="">Category</option>
                  <option value="family">Family</option>  
                  <option value="friends">Friends</option>
                  <option value="work">Work</option>
                  <option value="services">Services</option>
                  <option value="others">Others</option>
                </select>
                <input id="birthday" placeholder="Birthday (YYYY-MM-DD)">
                <select id="gender">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
            </div>

            <div id="editHomeAddress">
                <input id="homeAddress" placeholder="Home address">
            </div>

            <div id="editWorkAddress">
                <input id="workAddress" placeholder="Work address">
            </div>
        </div>

        <ul id="editPhoneInfo">
            <li id="addPhone"><input placeholder="Phone number"></li>
        </ul>
        <ul id="editEmailInfo">
            <li id="addEmail"><input placeholder="Email address"></li>
        </ul>

        <custom-list-skeleton></custom-list-skeleton>`;

    this.querySelector("ul#editEmailInfo li#addEmail input").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const emailNode = document.createElement("li");
        const emailInput = document.createElement("input");

        emailInput.value = event.target.value;
        event.target.value = "";

        emailNode.appendChild(emailInput);
        this.querySelector("#editEmailInfo").appendChild(emailNode);
      }
    });

    this.querySelector("ul#editPhoneInfo li#addPhone input").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const phoneNode = document.createElement("li");
        const phoneInput = document.createElement("input");

        phoneInput.value = event.target.value;
        event.target.value = "";

        phoneNode.appendChild(phoneInput);
        this.querySelector("#editPhoneInfo").appendChild(phoneNode);
      }
    });
  }

  clear() {
    this.querySelector("#photo").src = "";
    this.querySelector("#name").value = "";
    this.querySelector("#nickname").value = "";
    this.querySelector("#birthday").value = "";
    this.querySelector("#title").value = "";
    this.querySelector("#company").value = "";
    this.querySelector("#gender").value = "";
    this.querySelector("#category").value = "";
    this.querySelector("#homeAddress").value = "";

    this.querySelectorAll("ul#editEmailInfo li").forEach((element) => {
      if (element.id !== "addEmail") element.remove();
    });

    this.querySelectorAll("ul#editPhoneInfo li").forEach((element) => {
      if (element.id !== "addPhone") element.remove();
    });
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
  setCategory(category) {
    this.querySelector("#category").value = "";
    if (!category || category === "undefined") return;

    this.querySelector("#category").value = category;
  }
  setPhoto(gender) {
    this.querySelector("#photo").src = "";

    if (!gender || gender === "undefined") this.querySelector("#photo").src = "./images/man.svg";
    else this.querySelector("#photo").src = gender === "male" ? "./images/man.svg" : "./images/woman.svg";
  }
  setGender(gender) {
    this.querySelector("#gender").value = "";

    if (!gender || gender === "undefined") return;
    else this.querySelector("#gender").value = gender;
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
    this.querySelectorAll("ul#editEmailInfo li").forEach((element) => {
      if (element.id !== "addEmail") element.remove();
    });
    if (!emails) return;

    for (const element of emails.split(",")) {
      const emailNode = document.createElement("li");
      const emailInput = document.createElement("input");

      emailInput.value = element;

      emailNode.appendChild(emailInput);
      this.querySelector("#editEmailInfo").appendChild(emailNode);
    }
  }
  setPhoneNumbers(phoneNumbers) {
    this.querySelectorAll("ul#editPhoneInfo li").forEach((element) => {
      if (element.id !== "addPhone") element.remove();
    });
    if (!phoneNumbers) return;

    for (const element of phoneNumbers.split(",")) {
      const phoneNode = document.createElement("li");
      const phoneInput = document.createElement("input");

      phoneInput.value = element;

      phoneNode.appendChild(phoneInput);
      this.querySelector("#editPhoneInfo").appendChild(phoneNode);
    }
  }
}

customElements.define("edit-section", EditSection);
