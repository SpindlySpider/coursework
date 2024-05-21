import { fetchTemplate } from '../utilities.mjs';

class TagComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.tags = [];
    this.initilized = false;
  }

  async attachTemplate() {
    if (this.initilized) {
      return;
    }
    // setting up DOM
    await fetchTemplate(this.shadow, './tags/tag.html');
    // setting up event listeners
    this.prepareHandles();
    this.attachEventlistners();
    this.initilized = true;
  }

  prepareHandles() {
    this.itemList = this.shadow.querySelector('#itemList');
    this.inputField = this.shadow.querySelector('#newTagInput');
  }

  attachEventlistners() {
    this.inputField.addEventListener('keyup', this.handleTagAdd.bind(this));
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
    this.initilized = true;
  }

  handleTagAdd(e) {
    if (e.key === 'Enter') {
      this.addTag(this.inputField.value);
      this.itemList.prepend(this.inputField);
      this.inputField.focus();
    }
  }

  addTag(inputText) {
    const tag = document.createElement('li');
    const text = document.createElement('p');
    const remove = document.createElement('button');
    text.textContent = inputText;
    remove.textContent = 'X';
    tag.append(text, remove);
    this.itemList.prepend(tag);
    this.tags.push(inputText);
    this.inputField.value = '';
    remove.addEventListener('click', () => {
      this.removeTag(tag);
    });
  }

  setTags(textList = []) {
    for (let tag of textList) {
      this.addTag(tag);
    }
    this.itemList.prepend(this.inputField);
  }

  removeTag(tagObj) {
    console.log(this.tags, tagObj.querySelector('p').textContent);
    this.tags = this.tags.filter(
      (tags) => tags !== tagObj.querySelector('p').textContent,
    );
    tagObj.remove();
  }

  getTags() {
    return this.tags;
  }
}

customElements.define('tag-input', TagComponent);
