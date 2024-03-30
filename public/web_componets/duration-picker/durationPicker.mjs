import { fetchTemplate } from '../utilities.mjs';

export class durationPicker extends HTMLElement {
  constructor() {
    super();
    this.seconds = 0;
  }
  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(
      this.shadow,
      '../../web_componets/duration-picker/durationTimer.html',
    );
    this.inputList = await this.shadow.querySelectorAll('.duration_input');
    this.setDuration(this.seconds);
  }
  getDuration() {
    let multiplier = 3600;
    this.seconds = 0;
    for (let input of this.inputList) {
      this.seconds += input.value * multiplier;
      multiplier = multiplier / 60;
    }
    return this.seconds;
  }
  setDuration(seconds) {
    this.inputList[0].value = Math.floor(seconds / 3600);
    this.inputList[1].value = Math.floor((seconds / 60) % 60);
    this.inputList[2].value = seconds % 60;
  }
}
customElements.define('duration-picker', durationPicker);
