import { fetchTemplate } from "./utilities.js";

class Entry extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = document.createElement("div");
  }
  async connectedCallback() {
    //called when web componenet is added to page 
    this.addEventListener("click", async () => {
      this.eventOptionsBottomSheet();
    });
  }
  async eventOptionsBottomSheet() {
    // creates a event options pop up
    // this is just making a new activity menu but as a pop up menu there must be a way to abstract this in a better manner


    let menu = document.createElement("edit-menu")
    menu.entryID = this.entryID
    menu.customTitle = this.customTitle
    menu.customTitle = this.customTitle
    menu.descriptionInput.value = this.description
    menu.seconds = this.seconds
    this.content.innerHTML = menu
  }
}



customElements.define("activity-entry", Entry);
