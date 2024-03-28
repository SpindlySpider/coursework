import { getAllCustomActivites, getUUID, savePlaylist } from './utilities.mjs';
import { bottomSheetMenu } from './bottom_sheet_menu.mjs';

export class newPlaylistMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.donebutton = this.shadow.querySelector('#doneButton');
    this.addButton = this.shadow.querySelector('#bottomsheet-add');
    this.createEmptyPlaylist = document.createElement('button');
    this.importPlaylist = document.createElement('button');
    this.cancel = document.createElement('button');

    this.createEmptyPlaylist.id = 'create-empty-playlist';
    this.importPlaylist.id = 'import-playlist';
    this.cancel.id = 'cancel';

    this.createEmptyPlaylist.textContent = 'create empty playlist';
    this.importPlaylist.textContent = 'import playlist';
    this.createEmptyPlaylist.type = 'button';
    this.cancel.type = 'button';
    this.importPlaylist.type = 'button';
    this.cancel.textContent = 'cancel';

    this.createEmptyPlaylist.classList.add('bottomsheet-content-item');
    this.importPlaylist.classList.add('bottomsheet-content-item');
    this.cancel.classList.add('bottomsheet-header-item');
    this.cancel.classList.add('bottomsheet-header-button');
    this.header.insertBefore(this.cancel, this.addButton);
    this.content.append(this.createEmptyPlaylist);
    this.content.append(this.importPlaylist);
    console.log(getUUID());
  }

  connectedCallback() {
    setTimeout(this.pullupAnimation.bind(this), 25, 75);
    this.doneButton.addEventListener('click', this.destorySelf.bind(this));
    this.addButton.style.display = 'none';
    this.cancel.style.display = 'none';
    this.addButton.textContent = 'add activity';
    this.cancel.addEventListener('click', this.destorySelf.bind(this));
    this.createEmptyPlaylist.addEventListener(
      'click',
      this.playlistCreationTool.bind(this),
    );
    this.setTitle('new playlist');
  }

  playlistCreationTool() {
    this.content.style.height = '0vh';
    setTimeout(this.pullupAnimation.bind(this), 50, 75);
    this.doneButton.addEventListener('click', this.saveNewPlaylist.bind(this));
    this.setTitle('create new workout');
    this.addButton.style.display = 'flex';
    this.cancel.style.display = 'flex';
    this.createEmptyPlaylist.remove();
    this.importPlaylist.remove();
    this.nameInput = document.createElement('input');
    this.nameInput.id = 'playlistTitle';
    this.nameInput.classList.add('bottomsheet-content-item');
    this.content.append(this.nameInput);
    const customActivties = getAllCustomActivites();
    for (let item of Object.keys(customActivties)) {
      // make a web componenet for the event
      const entry = document.createElement('li');
      entry.dataset.id = item;
      entry.textContent = customActivties[item].title;
      entry.classList.add('bottomsheet-content-item');
      this.content.append(entry);
    }
  }
  disconnectedCallback() {}

  async saveNewPlaylist() {
    console.log('yay new playlist');
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const UUID = await getUUID();
    console.log(UUID);
    savePlaylist(UUID, title);
    this.destorySelf();
  }
}
customElements.define('new-playlist-menu', newPlaylistMenu);
