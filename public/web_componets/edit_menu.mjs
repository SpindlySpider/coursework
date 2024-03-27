export class editMenu extends newActivtyMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.customTitle = "customTitle"
    this.entryID = "";
    this.nameInput.value = ""
    this.descriptionInput.value = ""
    this.photoInput.value = ""
    this.seconds = 0
  }

  connectedCallback() {
    super();
    this.doneButton.addEventListener('click', this.saveNewActivty.bind(this));
    this.addButton.addEventListener('click', this.destorySelf.bind(this));
    this.setTitle(`edit ${this.customTitle}`);
    this.timeInput.setValue(this.seconds)
  }

  disconnectedCallback() {}

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    const description = this.descriptionInput.value;
    const duration = this.timeInput.getDuration();
    const UUID = this.entryID
    console.log(UUID);
    saveActivty(UUID, title, description, duration);
    this.destorySelf();
  }
}
customElements.define('edit-menu', editMenu);
