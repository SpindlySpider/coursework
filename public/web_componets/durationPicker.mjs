import { fetchTemplate } from "./utilities.js";

export class durationPicker extends HTMLElement {
  static observedAttributes = ["inputList"];
  constructor() {
    super();
  }
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(this.shadow, "../templates/durationTimer.html");
    this.inputList = this.shadow.querySelectorAll("input")
  }
  getDuration() {
    let multiplier = 3600
    let seconds = 0;
    for (let input of this.inputList) {
      seconds += input.value * multiplier
      multiplier = multiplier / 60
    }
    return seconds
  }
  setValues(seconds) {
    this.inputList[0].value = Math.floor(seconds/3600)
    this.inputList[1].value =  (seconds/60) % 60
    this.inputList[2].value =  (seconds) % 60
  }

}
customElements.define('duration-picker', durationPicker);
