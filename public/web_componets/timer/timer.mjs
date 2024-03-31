import { fetchTemplate, getActivtyFromID } from '../utilities.mjs';

export default class TimerComponent extends HTMLElement {
  constructor() {
    super();
    this.timerList = [];
    this.customTile = 'workout';
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(this.shadow, '../../web_componets/timer/timer.html');

    this.titleText = this.shadow.querySelector('#title');
    this.clock = this.shadow.querySelector('#clock');
    this.start = this.shadow.querySelector('#start');
    this.time = this.shadow.querySelector('#time-display');
    this.stop = this.shadow.querySelector('#stop');
    this.close = this.shadow.querySelector('#close');
    this.clockContainer = this.shadow.querySelector('#clockContainer');
    this.radius = 100;
    this.circumference = 2 * this.radius * Math.PI;
    this.seconds = 0;
    this.isTimerRunning = false;

    this.titleText.textContent = this.customTile;
    this.stop.classList.add('hidden');
    this.start.addEventListener('click', this.startTimer.bind(this));
    this.setProgress(0);
    this.stop.addEventListener('click', this.stopTimer.bind(this));
    this.close.addEventListener('click', this.destorySelf.bind(this));
    this.classList.add('popup-active');
    this.clock.style.strokeDasharray = this.circumference;
    this.clockContainer.classList.add('hidden');
  }

  destorySelf() {
    this.remove();
  }
  updateTime() {
    const formatedTime = this.getFormatedTimeFromSeconds(
      this.studyInput.value * 60,
    );
    this.time.textContent = `${formatedTime} study time`;
  }
  getFormatedTimeFromSeconds(seconds) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }
  stopTimer() {
    this.stop.classList.add('hidden');
    this.start.textContent = 'start';
    clearInterval(this.intervalID);
    this.seconds = 0;
    // this.updateTimerDisplay();
    this.isTimerRunning = false;
    this.timerList = [];
    this.close.classList.remove('hidden');
    this.clockContainer.classList.add('hidden');
  }
  incrementTimer() {
    if (
      this.getFormatedTimeFromSeconds(this.timerList[0].duration) ==
      this.getFormatedTimeFromSeconds(this.seconds)
    ) {
      if (this.timerList.length > 1) {
        // switch over to next activity
        this.timerList.shift();
        this.titleText.textContent = this.timerList[0].title;
        //get activty name
        this.seconds = 0;
      } else {
        // end the timer
        this.stopTimer();
        console.log('finished');
        return;
      }
    }
    this.updateTimerDisplay();
    this.seconds++;
  }
  startTimer() {
    if (!this.isTimerRunning) {
      this.clockContainer.classList.remove('hidden');
      this.titleText.textContent = this.timerList[0].title;
      this.close.classList.add('hidden');
      this.clock.style.stroke = 'blue';
      this.intervalID = setInterval(this.incrementTimer.bind(this), 1000);
      this.isTimerRunning = true;
      this.start.textContent = 'pause';
      this.stop.classList.remove('hidden');
      console.log('started timer');
    } else {
      this.start.textContent = 'start';
      clearInterval(this.intervalID);
      this.isTimerRunning = false;
    }
  }

  updateTimerDisplay() {
    const formattedTime = this.getFormatedTimeFromSeconds(this.seconds);
    this.time.innerText = `${formattedTime} / ${this.getFormatedTimeFromSeconds(this.timerList[0].duration)}`;
    const percent = (this.seconds / this.timerList[0].duration) * 100;
    this.setProgress(percent);
  }
  setProgress(percent) {
    this.clock.style.strokeDashoffset =
      this.circumference - (percent / 100) * this.circumference;
  }

  disconnectedCallback() {
    clearInterval(this.intervalID);
  }
}
customElements.define('timer-component', TimerComponent);
