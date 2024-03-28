import { fetchTemplate, getActivtyFromID } from './utilities.mjs';
export class Entry extends HTMLElement {
  constructor() {
    super();
    this.entryID;
    this.customTitle;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.append(document.createElement('p'));
  }
  connectedCallback() {
    //called when web componenet is added to page
    this.shadow.querySelector('p').textContent = this.customTitle;
    this.addEventListener('click', this.eventOptionsBottomSheet.bind(this));
  }

  eventOptionsBottomSheet() {
    // creates a event options pop up
    // this is just making a new activity menu but as a pop up menu there must be a way to abstract this in a better manner
    console.log(this.entryID);
    const activity = getActivtyFromID(this.entryID);
    let menu = document.createElement('edit-menu');
    menu.entryID = this.entryID;
    menu.nameInput.value = activity.title;
    menu.descriptionInput.value = activity.description;
    menu.seconds = activity.duration;
    this.parentNode.append(menu);
  }
}

customElements.define('activity-entry', Entry);
