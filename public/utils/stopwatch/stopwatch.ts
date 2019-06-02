/** */
const timerTemplate = require('./stopwatch.pug');

export class Stopwatch {
  timerHTMLElement: any;
  running: boolean;
  paused: boolean;
  timeStr: string;
  delay: number;
  then: number;
  delayThen: number;
  timer: NodeJS.Timeout;
  countdownElement: any;

  /**
   *
   */
  constructor(htmlElementTitle : string) {
    this.timerHTMLElement = document.querySelector(htmlElementTitle);
    this.timerHTMLElement.innerHTML = timerTemplate();
    this.countdownElement = document.querySelector(".countdown__clock");
    this.running = false;
    this.paused = false;
    this.timeStr = '';
  }

  /**
   *
   */
  start() {
    if (this.running) {
      return;
    }
    this.delay = 0;
    this.running = true;
    this.then = Date.now();
    this.timer = setInterval(this.run.bind(this), 51);
  };

  /**
   *
   */
  _parseTime(elapsed: number) {
    const d = [3600000, 60000, 1000, 10];
    const time = [];
    let i = 0;

    while (i < d.length) {
      let t = Math.floor(elapsed / d[i]);
      elapsed -= t * d[i];
      let strT = ((t >= 0 && t < 10) ? '0' + t : t).toString();
      time.push(strT);
      i++;
    }

    return time;
  };

  /**
   *
   */
  run() {
    const time = this._parseTime(Date.now() - this.then - this.delay);
    this.timeStr = `${time[0]}:${time[1]}:${time[2]}`;
    this.countdownElement.innerHTML = this.timeStr;
  };

  /**
   *
   */
  stop() {
    if (!this.running) {
      return;
    }
    this.running = false;
    this.delayThen = Date.now();
    clearInterval(this.timer);
    this.run();
  };

  /**
   *
   */
  resume() {
    this.paused = false;
    this.delay += Date.now() - this.delayThen;
    this.timer = setInterval(this.run.bind(this), 51);
  };

  /**
   *
   */
  reset() {
    this.running = false;
    this.paused = false;
    this.timeStr = `00:00:00`;
    this.countdownElement.innerHTML = this.timeStr;
  };

  /**
   *
   */
  router() {
    if (!this.running) this.start();
    else if (this.paused) this.resume();
    else stop();
  };
}

