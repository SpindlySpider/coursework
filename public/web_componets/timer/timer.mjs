import { displayPlaylistPage } from '../../pages/playlist-page/playlist.mjs';
import { getPhotoFromID, getPhotos } from '../picture-tools.mjs';
import { updateUser } from '../user-tools.mjs';
import { USER_KEY, fetchTemplate, formatedSeconds, user } from '../utilities.mjs';
const messageType = {
  STARTTIMER: 'start-timer',
  PAUSETIMER: 'pause-timer',
  STARTTIMERFIRST: 'start-timer-first',
  TIMERSTOPPED: 'timer-stopped',
  COUNTDOWN: 'countdown',
  COUNTDOWNFINISH: 'countdown-finish',
  SETLIST: 'set-list',
  CHANGEEXCERISE: 'change-excerise',
  UPDATEMILISECONDS: 'update-miliseconds',
  UPDATESECONDS: 'update-seconds',
  WORKOUTFINISH: 'workout-finished',
};
export default class TimerComponent extends HTMLElement {
  constructor() {
    super();
    this.playlistUUID = '';
    this.timerList = [];
    this.customTile = 'workout';
    this.initilized = false;
    this.timerIndex = 0;
    this.miliseconds = 0;
    // add error checking for worker
    this.worker = new Worker(import.meta.resolve('./timer-worker.mjs'));
    this.worker.onmessage = this.handleWorker.bind(this);
    this.finishedExerciseList = [];
    this.totalExerciseTime = 0;
  }

  async handleWorker(msg) {
    const { type, payload } = msg.data;
    switch (type) {
      case messageType.COUNTDOWN:
        this.shadow.querySelector('#countdown-timer').textContent = payload;
        break;
      case messageType.STARTTIMER:
        console.log('started timer');
        await this.startTimer();
        break;
      case messageType.COUNTDOWNFINISH:
        this.shadow.querySelector('#countdown-timer').style.display = 'none';
        this.sendStartTimerMsg();
        console.log('finished cout down');
        break;
      case messageType.STARTTIMERFIRST:
        console.log('started first timer');
        await this.firstStartTimer();
        break;
      case messageType.PAUSETIMER:
        console.log('paused timer');
        this.pauseTimer();
        break;
      case messageType.UPDATESECONDS:
        console.log('updating seconds');
        this.totalExerciseTime += 1;
        // add exercise time
        this.incrementSeconds(payload);
        break;
      case messageType.UPDATEMILISECONDS:
        // console.log("updating miliseconds")
        this.incrementMiliseconds(payload);
        break;
      case messageType.CHANGEEXCERISE:
        console.log('change exercise');
        // add workouts finished
        console.log('fionished exercise', this.timerList[this.timerIndex].title, this.timerList[this.timerIndex].UUID);
        this.timerIndex = payload;
        this.nextExcerise();
        break;
      case messageType.TIMERSTOPPED:
        console.log('stop exercise');
        await this.stopTimer();
        break;
      case messageType.WORKOUTFINISH:
        console.log('workoutfinsihed');
        await this.workoutFinish();
        break;
    }
  }

  async workoutFinish() {
    // send the server that the user has finished this workout and all the other exercises done
    // maybe also notification of done
    document.querySelector('toast-notification').addNotification('finished workout', 3000);
    console.log('timer list', this.timerList);
    console.log('JSON', localStorage.getItem(USER_KEY));
    if (!user()) {
      return;
    }
    const userJSON = JSON.parse(localStorage.getItem(USER_KEY));

    userJSON.exercise_time = userJSON.exercise_time + this.totalExerciseTime || this.totalExerciseTime;
    userJSON.workout_finished = userJSON.workout_finished + 1 || 1;
    localStorage.setItem(USER_KEY, JSON.stringify(userJSON));
    console.log('updating user with', userJSON);
    await updateUser(userJSON.workout_finished, userJSON.exercise_time);
    await this.stopTimer();
  }

  async nextExcerise() {
    this.titleText.textContent = this.timerList[this.timerIndex].title;
    this.description.textContent = this.timerList[this.timerIndex].description;
    if (this.description.textContent === '') {
      this.description.style.display = 'none';
    }
    this.removePictures();
    await this.appendPictures(this.timerList[this.timerIndex].UUID);
    this.seconds = 0;
    this.miliseconds = 0;
  }

  incrementSeconds(s) {
    this.seconds = s;
  }

  incrementMiliseconds(ms) {
    this.miliseconds = ms;
    this.updateTimerDisplay();
  }

  sendStartTimerMsg() {
    this.worker.postMessage({ type: messageType.STARTTIMER });
  }

  async startTimer() {
    this.updateTimerDisplay();
    this.time.classList.remove('hidden');
    this.upNext.classList.remove('hidden');
    this.shadow.querySelector('#container').style.display = 'flex';
    this.shadow.querySelector('#next-container').style.display = 'flex';
    this.clockContainer.classList.remove('hidden');
    this.titleText.textContent = this.timerList[this.timerIndex].title;
    // this.close.classList.add('hidden');
    this.clock.style.stroke = 'blue';
    this.start.textContent = 'pause';
    this.stop.classList.remove('hidden');
    this.description.textContent = this.timerList[this.timerIndex].description;
    console.log('first timer start', this.timerList, this.timerIndex);
    if (this.description.textContent === '') {
      this.description.style.display = 'none';
    }
    this.removePictures();
    await this.appendPictures(this.timerList[this.timerIndex].UUID);
  }

  async firstStartTimer() {
    this.titleText.textContent = this.timerList[this.timerIndex].title;
    this.description.textContent = this.timerList[this.timerIndex].description;
    console.log('first timer start', this.timerList, this.timerIndex);
    if (this.description.textContent === '') {
      this.description.style.display = 'none';
    }
    this.removePictures();
    await this.appendPictures(this.timerList[this.timerIndex].UUID);
  }

  pauseTimer() {
    this.start.textContent = 'start';
    clearInterval(this.intervalID);
    this.isTimerRunning = false;
  }

  playlistMenu() {
    this.radius = 100;
    this.circumference = ((2) * (Math.PI) * (this.radius));
    this.seconds = 0;
    this.isTimerRunning = false;
    this.titleText.textContent = this.customTile;
    this.stop.classList.add('hidden');
    this.setProgress(0);
    this.classList.add('popup-active');
    this.clock.style.strokeDasharray = this.circumference;
    this.clockContainer.classList.add('hidden');
    this.pictureContainer.style.display = 'none';
  }

  getFormatStringTime(seconds) {
    const duration = formatedSeconds(seconds);
    const hour = duration.hour === 0 ? '' : `${duration.hour}h`;
    const mins = duration.minutes === 0 ? '' : `${duration.minutes}m`;
    const secs = duration.seconds === 0 ? '0s' : `${duration.seconds}s`;
    return `${hour}${mins}${secs}`;
  }

  getTotalTime() {
    let totalDuration = 0;
    for (const item of this.timerList) {
      totalDuration += item.duration;
    }
    return totalDuration;
  }

  createText(id, str) {
    const elem = document.createElement('p');
    elem.textContent = str;
    elem.id = id;
    elem.style.fontSize = '5vw';
    return elem;
  }


  prepareHandle() {
    this.titleText = this.shadow.querySelector('#title');
    this.container = this.shadow.querySelector('#container');
    this.clock = this.shadow.querySelector('#clock');
    this.start = this.shadow.querySelector('#start');
    this.time = this.shadow.querySelector('#time-display');
    this.stop = this.shadow.querySelector('#stop');
    this.close = this.shadow.querySelector('#close');
    this.upNext = this.shadow.querySelector('#up-next');
    this.clockContainer = this.shadow.querySelector('#clockContainer');
    this.description = this.shadow.querySelector('#description');
    this.pictureContainer = this.shadow.querySelector('#picture-container');
    this.playlistMenu();
  }

  setupEventListener() {
    this.start.addEventListener('click', this.sendStartTimerMsg.bind(this));
    this.stop.addEventListener('click', this.stopTimer.bind(this));
    // this.close.addEventListener('click', this.destorySelf.bind(this));
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
    this.timerStartCountdown();
  }

  timerStartCountdown() {
    this.worker.postMessage({ type: messageType.COUNTDOWN });
    this.worker.postMessage({ type: messageType.SETLIST, payload: this.timerList });
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
  }

  destorySelf() {
    this.remove();
  }

  getFormatedTimeFromSeconds(seconds) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }

  async stopTimer() {
    this.worker.postMessage({ type: messageType.TIMERSTOPPED });
    this.upNext.classList.add('hidden');
    this.stop.classList.add('hidden');
    this.start.textContent = 'start';
    this.seconds = 0;
    this.timerIndex = 0;
    this.isTimerRunning = false;
    this.time.classList.add('hidden');
    this.clockContainer.classList.add('hidden');
    await displayPlaylistPage();
  }

  async appendPictures(UUID) {
    const image = this.shadow.querySelector('#picture-container');
    image.style.display = 'flex';
    const pictures = await getPhotos(UUID);
    console.log('pictues', pictures);
    if (pictures[0] !== undefined) {
      for (const id of pictures) {
        // add a delete button to the images somewhere here
        image.style = 'object-fit: contain;height: 100%;';
        const response = await getPhotoFromID(id);
        image.src = response.url;
        // add next and prevouis image button here
      }
    } else {
      this.pictureContainer.style.display = 'none';
    }
  }

  removePictures() {
    this.pictureContainer.textContent = '';
  }

  updateTimerDisplay() {
    this.upNext.textContent = 'end of workout';
    if (this.timerList.length - this.timerIndex > 1) {
      this.upNext.textContent = `${this.timerList[this.timerIndex + 1].title}`;
    }
    const formattedTime = this.getFormatStringTime(this.seconds);
    this.time.textContent = `${formattedTime} / ${this.getFormatStringTime(this.timerList[this.timerIndex].duration)}`;
    const max = this.timerList[this.timerIndex].duration;
    let percent =
      ((this.miliseconds / 1000) / (max - 1)) * 100;
    if (this.miliseconds / 1000 > (max - 1)) {
      percent = 0;
    }
    this.setProgress(percent);
  }

  setProgress(percent) {
    this.clock.style.strokeDashoffset =
      this.circumference - (percent / 100) * this.circumference;
  }

  async disconnectedCallback() {
    this.worker.postMessage({ type: messageType.TIMERSTOPPED });
    await this.destorySelf();
  }
}
customElements.define('timer-component', TimerComponent);
