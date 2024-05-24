import {
  getUUID,
  fetchTemplate,
  fetchFragment,
  user,
} from '../utilities.mjs';
import { bottomSheetMenu } from '../bottom-sheet/bottom_sheet_menu.mjs';
import {
  displayCategoryPage,
  displayCustomCateogryPage,
} from '../../pages/category-page/category.mjs';
import { ACTIVTIES_KEY, saveActivty } from '../activity-tools.mjs';
import { cleanLocalTag, saveTags } from '../tag-tools.mjs';
import { getPhotoFromID, uploadPhoto } from '../picture-tools.mjs';

export class newActivtyMenu extends bottomSheetMenu {
  // also if any of the attributes change then we need to update local storage + server cache
  constructor() {
    // must do all of the selections within the constructor
    super();
    this.initilized = false;
  }

  async createActivtyInputs() {
    const frag = await fetchFragment(import.meta.resolve("./content.inc"))
    this.content.innerHTML = frag.innerHTML
    this.timeInput = this.content.querySelector("#timeInput")
    this.tags = this.content.querySelector("#tag")
    await this.tags.attachTemplate()
    await this.timeInput.attachTemplate()
    this.nameInput = this.content.querySelector("#activityNameInput")
    this.descriptionInput = this.content.querySelector("#descriptionInput")
    this.photoInput = this.content.querySelector("#addPhoto")
    this.cancelButton.style.display = "flex"
    this.cancelButton.textContent = "<"
  }

  async selectedPhoto() {
    // https://www.youtube.com/watch?v=Uo9Jme8IwlM&t=810s
    const photo = this.photoInput.files[0]
    const urlReader = new FileReader()
    urlReader.readAsDataURL(photo)
    urlReader.onload = async () => {
      const imageHolder = await this.createImageHolder();
      this.pictureURL = urlReader.result
      imageHolder.querySelector("img").src = this.pictureURL
      imageHolder.querySelector("button").addEventListener("click", () => {
        imageHolder.remove()
        this.content.querySelector("#add-photo-label").style.display = "flex"
      })
      this.content.querySelector("#add-photo-label").style.display = "none"
      this.content.querySelector("#photo-duration-container").prepend(imageHolder)
    }
  }
  async getPhotoURL(id) {
    const response = await getPhotoFromID(id)
    if (!response.ok) throw Error("couldnt get photo")
    return response.url
  }

  async appendPictures() {
    for (let id of this.pictures) {
      const imageHolder = await this.createImageHolder();
      this.pictureURL = await this.getPhotoURL(id)
      imageHolder.querySelector("img").src = this.pictureURL
      imageHolder.querySelector("button").addEventListener("click", () => {
        this.deletePicture(id);
        imageHolder.remove()
        this.content.querySelector("#add-photo-label").style.display = "flex"
      })
      this.content.querySelector("#add-photo-label").style.display = "none"
      this.content.querySelector("#photo-duration-container").prepend(imageHolder)
    }
  }
  async deletePicture(pictureID) {
    await fetch(`picture/${this.entryID}/${pictureID}`, { method: "delete" })
  }

  async createImageHolder() {
    const template = await fetchFragment(import.meta.resolve("../new-activity-menu/picture-holder.inc"))
    return template
  }

  resizingTextarea(e) {
    this.descriptionInput.style.height = 'auto';
    const scrollHeight = e.target.scrollHeight;
    this.descriptionInput.style.height = `${scrollHeight}px`;
  }

  setupActivityEventListeners() {
    this.doneButton.addEventListener('click', this.saveNewActivty.bind(this));
    this.cancelButton.addEventListener('click', this.destorySelf.bind(this));
    this.photoInput.addEventListener("change", this.selectedPhoto.bind(this))
    this.descriptionInput.addEventListener('keyup', this.resizingTextarea.bind(this));
  }

  async attachTemplate() {
    // extracting this out of the on connectedCallback because it means we can invoke this in javacript to ensure everything is set up correctly
    if (this.initilized) return;
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/bottom-sheet/bottomsheet.html',
    );
    this.bottomSheetPrepareHandles();
    await this.createActivtyInputs();
    this.setupActivityEventListeners();
    setTimeout(this.pullupAnimation.bind(this), 25, 50);
    this.setTitle('new activity');
    this.initilized = true;
  }

  async connectedCallback() {
    if (this.initilized) return;
    await this.attachTemplate();
  }

  destorySelf() {
    this.content.style.height = '0vh';
    setTimeout(async () => {
      this.enableNavbarBorder();
      await displayCategoryPage();
      this.remove();
    }, 300);
  }

  toastNotification(str) {
    document.querySelector("toast-notification").addNotification(str, 1500)
  }

  async saveNewActivty() {
    // should abtract this to a general store activties/ edit activites
    const title = this.nameInput.value;
    if (title == "") {
      this.toastNotification(`cannot save as there is no title`)
      throw Error("no title")
    }
    const duration = this.timeInput.getDuration();
    if (duration <= 0) {
      this.toastNotification(`cannot save ${title} there is no duration`)
      throw Error("no duration")
    }
    const description = this.descriptionInput.value;
    const UUID = await getUUID();
    await saveActivty(UUID, title, description, duration, false, user());
    cleanLocalTag(UUID, ACTIVTIES_KEY);
    await saveTags(UUID, ACTIVTIES_KEY, this.tags.getTags(), false);
    let photoURL = null
    console.log("number of photos", this.photoInput.files.length)
    if (this.photoInput.files.length > 0) {
      for (let file of this.photoInput.files) {
        const input = new FormData()
        input.append("file", file)
        await uploadPhoto(UUID, input)
      }
      photoURL = this.pictureURL
    }
    document.querySelector("toast-notification").addNotification(`saved ${title}`, 1500, photoURL)
    this.destorySelf();
  }
}
customElements.define('new-activty-menu', newActivtyMenu);
