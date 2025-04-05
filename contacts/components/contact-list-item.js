import { CustomListItem } from "../../shared/components/custom-list-item.js";

export class ContactListItem extends CustomListItem {
  get data() {
    return this.dataset;
  }

  set data(newValue) {
    this.innerText = newValue.name;

    this.dataset.item = newValue.name;
    this.dataset.name = newValue.name;
    this.dataset.nickname = newValue.nickname;
    this.dataset.birthday = newValue.birthday;
    this.dataset.company = newValue.company;
    this.dataset.title = newValue.title;
    this.dataset.email = newValue.email;
    this.dataset.phone = newValue.phone;
    this.dataset.homeAddress = newValue.homeAddress;
  }

  constructor() {
    super();

    this.classList.add("contact-list-item");
  }
}

customElements.define("contact-list-item", ContactListItem);
