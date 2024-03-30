import {
  fetchTemplate,
  getActivtyFromID,
  getAllCustomActivites,
  getUUID,
  savePlaylist,
} from '../utilities.mjs';
import { bottomSheetMenu } from '../bottom-sheet/bottom_sheet_menu.mjs';
import { displayPlaylistPage } from '/../../script/playlist_page.mjs';

export class newPlaylistMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.activityItems = [];
    this.nameInput = document.createElement('input');
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.content = this.shadow.querySelector('#bottomsheet-content');
    this.bottomSheetPrepareHandles();
    this.doneButton = this.shadow.querySelector('#bottomsheet-done');
    this.addButton = this.shadow.querySelector('#bottomsheet-add');
    this.backButton = this.shadow.querySelector('#bottomsheet-back');
    this.cancel = this.shadow.querySelector('#bottomsheet-cancel');

    this.createEmptyPlaylist = document.createElement('button');
    this.importPlaylist = document.createElement('button');

    this.cancel.style.display = 'flex';

    this.createEmptyPlaylist.id = 'create-empty-playlist';
    this.importPlaylist.id = 'import-playlist';
    this.nameInput.id = 'playlistTitle';

    this.createEmptyPlaylist.textContent = 'create empty playlist';
    this.importPlaylist.textContent = 'import playlist';
    this.createEmptyPlaylist.type = 'button';
    this.importPlaylist.type = 'button';
    this.doneButton.textContent = 'save';

    this.createEmptyPlaylist.classList.add('bottomsheet-content-item');
    this.importPlaylist.classList.add('bottomsheet-content-item');
    this.nameInput.classList.add('bottomsheet-content-item');
    this.nameInput.style.display = 'none';
    this.backButton.style.display = 'none';
    this.content.append(this.createEmptyPlaylist);
    this.content.append(this.importPlaylist);
    this.content.append(this.nameInput);
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.addButton.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.textContent = 'add activity';

    this.addButton.addEventListener(
      'click',
      this.customActivitesSelection.bind(this),
    );
    this.backButton.addEventListener(
      'click',
      this.playlistCreationTool.bind(this),
    );
    this.createEmptyPlaylist.addEventListener(
      'click',
      this.playlistCreationTool.bind(this),
    );
    this.cancel.addEventListener('click', this.destorySelf.bind(this));
    this.doneButton.addEventListener(
      'click',
      this.saveNewPlaylist.bind(this, this.UUID),
    );
    this.setTitle('new playlist');
  }
  addEntryToList(entry) {
    console.log(`add ${entry.dataset.id}`);
    this.activityItems.push(entry.dataset.id);
  }
  customActivitesSelection() {
    setTimeout(this.pullupAnimation.bind(this), 50, 90);
    this.cleanContent();
    console.log('add activity');
    this.nameInput.style.display = 'none';
    this.cancel.style.display = 'none';
    this.doneButton.style.display = 'none';
    this.addButton.style.display = 'none';
    this.backButton.style.display = 'flex';
    this.setTitle('add activity');

    const customActivties = getAllCustomActivites();

    for (let item of Object.keys(customActivties)) {
      // make a web componenet for the event
      const entry = document.createElement('li');
      entry.dataset.id = item;
      entry.textContent = customActivties[item].title;
      entry.classList.add('bottomsheet-content-item');
      entry.classList.add('activty-item');
      entry.addEventListener('click', this.addEntryToList.bind(this, entry));
      this.content.append(entry);
    }
  }
  cleanContent() {
    let items = this.content.querySelectorAll('.activty-item');
    for (let item of items) {
      item.remove();
    }
  }

  playlistCreationTool() {
    setTimeout(this.pullupAnimation.bind(this), 50, 75);
    console.log('donbe');
    this.cleanContent();
    this.nameInput.style.display = 'flex';
    this.doneButton.style.display = 'flex';
    this.backButton.style.display = 'none';
    this.content.style.height = '0vh';
    this.setTitle('create new workout');
    this.addButton.style.display = 'flex';
    this.cancel.style.display = 'flex';
    this.createEmptyPlaylist.remove();
    this.importPlaylist.remove();

    const customActivties = getAllCustomActivites();
    for (let item of this.activityItems) {
      const entry = document.createElement('li');
      entry.dataset.id = item;
      entry.textContent = customActivties[item].title;
      entry.classList.add('bottomsheet-content-item');
      entry.classList.add('activty-item');
      this.content.append(entry);
    }
  }
  disconnectedCallback() {}

  async saveNewPlaylist() {
    if (this.UUID == undefined) {
      this.UUID = await getUUID();
    }
    console.log('yay new playlist');
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    savePlaylist(this.UUID, title, this.activityItems);
    displayPlaylistPage();
    this.destorySelf();
  }
}
customElements.define('new-playlist-menu', newPlaylistMenu);
