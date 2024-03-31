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

  async eventOptionsBottomSheet() {
    // creates a event options pop up
    const activity = getActivtyFromID(this.entryID);
    let menu = document.createElement('edit-menu');
    menu.seconds = activity.duration;
    await menu.attachTemplate();
    this.parentNode.append(menu);
    menu.entryID = this.entryID;
    menu.nameInput.value = activity.title;
    menu.setTitle(`edit ${activity.title}`);
    menu.descriptionInput.value = activity.description;
  }
}

customElements.define('activity-entry', Entry);
