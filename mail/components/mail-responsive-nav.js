import "../../shared/components/responsive-nav.js";
import "../../shared/components/selected-item-nav.js";

export class MailResponsiveNav extends HTMLElement {
  accounts = ["mail"];

  get value() {
    return this.querySelector("responsive-nav").value;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.setAccounts(this.accounts);
  }

  setAccounts(accounts) {
    this.accounts = accounts;

    this.innerHTML = `
      <responsive-nav options="${accounts.join(",")}" value="${accounts[0]}"></responsive-nav>
      <selected-item-nav behavior="back-button"></selected-item-nav>`;

    this.querySelector("responsive-nav").addEventListener("change", () => {
      this.dispatchEvent(new CustomEvent("account-changed", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("mail-responsive-nav", MailResponsiveNav);
