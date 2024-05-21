import { fetchFragment, fetchTemplate } from '../utilities.mjs';
export class toast extends HTMLElement {
  constructor() {
    super();
    this.initilized = false;
  }

  async prepareHandle() {
    this.container = this.shadow.querySelector("#toast-container")
  }

  async attachTemplate() {
    // extracting this out of the on connectedCallback because it means we can invoke this in javacript to ensure everything is set up correctly
    if (this.initilized) {
      return;
    }
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      import.meta.resolve("./toast-container.html"),
    );
    await this.prepareHandle()
    this.initilized = true;
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
  }

  async addNotification(str, timeout, imgURL) {
    // has the option to add a img url if the user wants to
    // if no image url is provided then it will fetch a specific fragment
    imgURL = imgURL || null;
    timeout = timeout || 1500
    const URL = imgURL === null ? "./toast-item.inc" : "./toast-item-img.inc"
    const notification = await fetchFragment(import.meta.resolve(URL))
    const image = notification.querySelector("#toast-img")
    if(image){
      image.src =imgURL
    }
    notification.querySelector("#toast-text").textContent = str
    this.container.appendChild(notification)
    setTimeout(() => {
      notification.classList.add("remove")
      setTimeout(() => {
        notification.remove()
      }, 500)
    }, timeout)
  }
}

customElements.define('toast-notification', toast);
