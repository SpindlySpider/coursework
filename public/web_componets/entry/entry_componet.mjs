import { fetchTemplate, getActivtyFromID } from '../utilities.mjs';
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
    console.log(this.entryID);
    const activity = getActivtyFromID(this.entryID);
    let menu = document.createElement('edit-menu');
    this.parentNode.append(menu);

    menu.entryID = this.entryID;
    menu.nameInput.value = activity.title;
    menu.descriptionInput.value = activity.description;
    menu.seconds = activity.duration;
  }
}

customElements.define('activity-entry', Entry);
