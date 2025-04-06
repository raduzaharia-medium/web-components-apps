import { getContacts } from "../scripts/services.js";

import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class ContactsResponsiveNav extends HTMLElement {
  constructor() {
    super();
    this.classList.add("music-responsive-nav");

    this.innerHTML = `
      <responsive-nav options="all,family,friends,work,services,others" value="all"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    window.onpopstate = async (e) => {
      if (document.body.classList.contains("edit")) {
        document.body.classList.remove("edit");
        return;
      }

      if (document.body.classList.contains("contact-selected")) {
        this.refreshContacts();
        return;
      }

      if (!e.state || !e.state.page) return;

      history.back();
      this.refreshContacts();
    };

    this.querySelector("responsive-nav").addEventListener("change", this.refreshContacts);
  }

  refreshContacts() {
    document.body.classList.remove("edit");
    document.body.classList.remove("contact-selected");

    document.querySelector("section").innerHTML = "";
    document.querySelector("contacts-section").classList.add("loading");

    const category = document.querySelector("responsive-nav").value;
    const contacts = getContacts(category);

    document.querySelector("contacts-section item-counter").value = contacts.length;
    document.querySelector("contacts-section custom-list").setItems(contacts);
    document.querySelector("contacts-section").classList.remove("loading");
  }
}

customElements.define("contacts-responsive-nav", ContactsResponsiveNav);
