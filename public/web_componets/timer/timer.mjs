import { displayPlaylistPage } from '../../pages/playlist-page/playlist.mjs';
import { getPhotoFromID, getPhotos } from '../picture-tools.mjs';
import { fetchTemplate, formatedSeconds, } from '../utilities.mjs';
const messageType = {
  STARTTIMER: "start-timer",
  PAUSETIMER: "pause-timer",
  STARTTIMERFIRST: "start-timer-first",
  TIMERSTOPPED: "timer-stopped",
  COUNTDOWN: "countdown",
  COUNTDOWNFINISH: "countdown-finish",
  SETLIST: "set-list",
  CHANGEEXCERISE: "change-excerise",
  UPDATEMILISECONDS: "update-miliseconds",
  UPDATESECONDS: "update-seconds",
}
export default class TimerComponent extends HTMLElement {
  constructor() {
    super();
    this.timerList = [];
    this.customTile = 'workout';
    this.initilized = false;
    this.timerIndex = 0;
    this.miliseconds = 0
    // add error checking for worker
    this.worker = new Worker(import.meta.resolve("./timer-worker.mjs"))
    this.worker.onmessage = this.handleWorker.bind(this)
  }

  async handleWorker(msg) {
    const { type, payload } = msg.data
    switch (type) {
      case messageType.COUNTDOWN:
        this.shadow.querySelector("#countdown-timer").textContent = payload
        break;
      case messageType.STARTTIMER:
        console.log("started timer")
        this.startTimer()
        break;
      case messageType.COUNTDOWNFINISH:
        this.shadow.querySelector("#countdown-timer").style.display = "none"
        this.sendStartTimerMsg()
        console.log("finished cout down")
        break;
      case messageType.STARTTIMER:
        console.log("started timer")
        this.startTimer()
        break;
      case messageType.STARTTIMERFIRST:
        console.log("started first timer")
        await this.firstStartTimer()
        break;
      case messageType.PAUSETIMER:
        console.log("paused timer")
        this.pauseTimer()
        break
      case messageType.UPDATESECONDS:
        console.log("updating seconds")
        this.incrementSeconds(payload)
        break
      case messageType.UPDATEMILISECONDS:
        console.log("updating miliseconds")
        this.incrementMiliseconds(payload)
        break
      case messageType.CHANGEEXCERISE:
        console.log("change exercise")
        this.timerIndex = payload
        this.nextExcerise()
        break
      case messageType.TIMERSTOPPED:
        console.log("stop exercise")
        await this.stopTimer()
        break
    }
    // console.log("webworker", msg.data, type, payload)
  }
  async nextExcerise() {
    this.titleText.textContent = this.timerList[this.timerIndex].title;
    this.description.textContent = this.timerList[this.timerIndex].description
    this.removePictures()
    await this.appendPictures(this.timerList[this.timerIndex].UUID)
    this.seconds = 0;
    this.miliseconds = 0
  }

  incrementSeconds(s) {
    this.seconds = s
  }
  incrementMiliseconds(ms) {
    this.miliseconds = ms
    this.updateTimerDisplay();
  }

  sendStartTimerMsg() {
    console.log("sdffhbdsjfgsdhjkfgahjkfgdashfjkdsagfhkjadsghfjksagfhdfsukfgdshfjksadkfg")
    this.worker.postMessage({ type: messageType.STARTTIMER })
  }


  startTimer() {
    this.updateTimerDisplay();
    this.time.classList.remove('hidden');
    this.upNext.classList.remove('hidden');
    this.shadow.querySelector("#container").style.display = "flex"
    this.shadow.querySelector("#next-container").style.display = "flex"
    this.clockContainer.classList.remove('hidden');
    this.titleText.textContent = this.timerList[this.timerIndex].title;
    this.close.classList.add('hidden');
    this.clock.style.stroke = 'blue';
    this.start.textContent = 'pause';
    this.stop.classList.remove('hidden');
  }
  async firstStartTimer() {
    this.totalTime.style.display = "none"
    this.removePictures()
    await this.appendPictures(this.timerList[this.timerIndex].UUID)
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
    this.totalTime = this.createText("total-time", `total time of playlist ${this.getFormatStringTime(this.getTotalTime())}`)
    this.pictureContainer.style.display = "none"
    this.container.append(this.totalTime)
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
    for (let item of this.timerList) {
      totalDuration += item.duration
    }
    return totalDuration
  }

  createText(id, str) {
    const elem = document.createElement("p")
    elem.textContent = str
    elem.id = id
    elem.style.fontSize = "5vw"
    return elem
  }


  prepareHandle() {
    this.titleText = this.shadow.querySelector('#title');
    this.container = this.shadow.querySelector("#container")
    this.clock = this.shadow.querySelector('#clock');
    this.start = this.shadow.querySelector('#start');
    this.time = this.shadow.querySelector('#time-display');
    this.stop = this.shadow.querySelector('#stop');
    this.close = this.shadow.querySelector('#close');
    this.upNext = this.shadow.querySelector('#up-next');
    this.clockContainer = this.shadow.querySelector('#clockContainer');
    this.description = this.shadow.querySelector('#description');
    this.pictureContainer = this.shadow.querySelector("#picture-container")
    this.playlistMenu();
  }

  setupEventListener() {
    this.start.addEventListener('click', this.sendStartTimerMsg.bind(this));
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
    this.timerStartCountdown()
  }

  timerStartCountdown() {
    this.worker.postMessage({ type: messageType.COUNTDOWN })
    this.worker.postMessage({ type: messageType.SETLIST, payload: this.timerList })
  }

  async connectedCallback() {
    if (this.initilized) {
      return;
    }
    await this.attachTemplate();
  }

  async destorySelf() {
    this.remove();
  }

  getFormatedTimeFromSeconds(seconds) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }

  async stopTimer() {
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
    await displayPlaylistPage();
  }

  async incrementTimer() {
    if (
      this.timerList[this.timerIndex].duration === this.seconds) {
      if (this.timerList.length - this.timerIndex > 1) {
        // switch over to next activity
        this.timerIndex++;
        this.titleText.textContent = this.timerList[this.timerIndex].title;
        // get change photos here
        this.description.textContent = this.timerList[this.timerIndex].description
        this.removePictures()
        await this.appendPictures(this.timerList[this.timerIndex].UUID)
        this.seconds = 0;
        this.miliseconds = 0

      } else {
        // end the timer
        await this.stopTimer();
        console.log('finished');
        return;
      }
    }
    // this.updateTimerDisplay();
    if (this.miliseconds % 1000 === 0) {
      this.seconds++;
    }
    this.miliseconds += 100
    this.updateTimerDisplay();
    return
  }

  async appendPictures(UUID) {
    let image = this.shadow.querySelector("#picture-container")
    image.style.display = "flex"
    const pictures = await getPhotos(UUID);
    console.log("pictues", pictures)
    if (pictures[0] != undefined) {
      for (let id of pictures) {
        // add a delete button to the images somewhere here
        image.style = "object-fit: contain;height: 100%;"
        const response = await getPhotoFromID(id)
        image.src = response.url
        // add next and prevouis image button here
      }
    }
    else {

      this.pictureContainer.style.display = "none"
    }

  }
  removePictures() {
    this.pictureContainer.textContent = ""
  }

  updateTimerDisplay() {
    this.upNext.textContent = 'end of workout';
    if (this.timerList.length - this.timerIndex > 1) {
      this.upNext.textContent = `${this.timerList[this.timerIndex + 1].title}`;
    }
    const formattedTime = this.getFormatStringTime(this.seconds);
    this.time.textContent = `${formattedTime} / ${this.getFormatStringTime(this.timerList[this.timerIndex].duration)}`;
    const max = this.timerList[this.timerIndex].duration
    let percent =
      ((this.miliseconds / 1000) / (max - 1)) * 100;
    console.log(percent, (max - 1), (this.miliseconds / 1000))
    if (this.miliseconds / 1000 > (max - 1)) {
      percent = 0
    }
    this.setProgress(percent);
  }

  setProgress(percent) {
    this.clock.style.strokeDashoffset =
      this.circumference - (percent / 100) * this.circumference;
  }

  async disconnectedCallback() {
    clearInterval(this.intervalID);
    await this.destorySelf()
  }
}
customElements.define('timer-component', TimerComponent);
