import { displayPlaylistPage } from '../../script/playlist_page.mjs';
import { fetchTemplate, getActivtyFromID } from '../utilities.mjs';

export default class TimerComponent extends HTMLElement {
  constructor() {
    super();
    this.timerList = [];
    this.customTile = 'workout';
    this.initilized = false;
    this.timerIndex = 0;
  }

  playlistMenu() {
    this.radius = 100;
    this.circumference = 2 * this.radius * Math.PI;
    this.seconds = 0;
    this.isTimerRunning = false;
    this.titleText.textContent = this.customTile;
    this.stop.classList.add('hidden');
    this.setProgress(0);
    this.classList.add('popup-active');
    this.clock.style.strokeDasharray = this.circumference;
    this.clockContainer.classList.add('hidden');
  }

  prepareHandle() {
    this.titleText = this.shadow.querySelector('#title');
    this.clock = this.shadow.querySelector('#clock');
    this.start = this.shadow.querySelector('#start');
    this.time = this.shadow.querySelector('#time-display');
    this.stop = this.shadow.querySelector('#stop');
    this.close = this.shadow.querySelector('#close');
    this.upNext = this.shadow.querySelector('#up-next');
    this.clockContainer = this.shadow.querySelector('#clockContainer');
    this.playlistMenu();
  }

  setupEventListener() {
    this.start.addEventListener('click', this.startTimer.bind(this));
    this.stop.addEventListener('click', this.stopTimer.bind(this));
    this.close.addEventListener('click', this.destorySelf.bind(this));
  }

  async attachTemplate() {
    if (this.initilized) {
      return;
    }
    this.shadow = this.attachShadow({ mode: 'open' });
    await fetchTemplate(this.shadow, '../../web_componets/timer/timer.html');
    this.prepareHandle();
    this.setupEventListener();
    this.initilized = true;
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
  }

  destorySelf() {
    displayPlaylistPage();
    this.remove();
  }

  getFormatedTimeFromSeconds(seconds) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }

  stopTimer() {
    this.upNext.classList.add('hidden');
    this.stop.classList.add('hidden');
    this.start.textContent = 'start';
    clearInterval(this.intervalID);
    this.seconds = 0;
    this.playlistMenu();
    this.timerIndex = 0;
    this.isTimerRunning = false;
    this.time.classList.add('hidden');
    this.close.classList.remove('hidden');
    this.clockContainer.classList.add('hidden');
    displayPlaylistPage();
  }

  incrementTimer() {
    if (
      this.getFormatedTimeFromSeconds(
        this.timerList[this.timerIndex].duration,
      ) == this.getFormatedTimeFromSeconds(this.seconds)
    ) {
      if (this.timerList.length - this.timerIndex > 1) {
        // switch over to next activity
        this.timerIndex++;
        this.titleText.textContent = this.timerList[this.timerIndex].title;
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
      this.intervalID = setInterval(this.incrementTimer.bind(this), 1000);
      this.updateTimerDisplay();
      this.time.classList.remove('hidden');
      this.upNext.classList.remove('hidden');
      this.clockContainer.classList.remove('hidden');
      this.titleText.textContent = this.timerList[this.timerIndex].title;
      this.close.classList.add('hidden');
      this.clock.style.stroke = 'blue';
      this.isTimerRunning = true;
      this.start.textContent = 'pause';
      this.stop.classList.remove('hidden');
    } else {
      this.start.textContent = 'start';
      clearInterval(this.intervalID);
      this.isTimerRunning = false;
    }
  }

  updateTimerDisplay() {
    this.upNext.textContent = 'next : end of routine';
    if (this.timerList.length - this.timerIndex > 1) {
      this.upNext.textContent = `next : ${this.timerList[this.timerIndex + 1].title}`;
    }

    const formattedTime = this.getFormatedTimeFromSeconds(this.seconds);
    this.time.textContent = `${formattedTime} / ${this.getFormatedTimeFromSeconds(this.timerList[this.timerIndex].duration)}`;
    const percent =
      (this.seconds / this.timerList[this.timerIndex].duration) * 100;
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
