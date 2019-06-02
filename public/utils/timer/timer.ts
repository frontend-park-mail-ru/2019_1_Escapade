const timerTemplate = require('./timer.pug');

/** */
export class Timer {
  timerHTMLElement: any;
  running: boolean;
  paused: boolean;
  timeStr: string;
  then: number;
  timer: NodeJS.Timeout;
  startTime: any;
  funcCallback: any;
  countdownElement: any;
  /**
   *
   */

  constructor(htmlElementTitle : string, callback : any) {
    this.timerHTMLElement = document.querySelector(htmlElementTitle);
    this.timerHTMLElement.innerHTML = timerTemplate();
    this.countdownElement = document.querySelector(".timer__clock");
    this.running = false;
    this.paused = false;
    this.timeStr = '';
    this.funcCallback = callback;
  }


  /**
   *
   */
  start({hour = 0, minute = 0, seconds = 0}) {
    if (this.running) {
      return;
    }
    this.startTime = {hour : hour, minute : minute, seconds : seconds};
    const time = this._parseTime();
    this.timeStr = `${time[0]}:${time[1]}:${time[2]}`;
    this.countdownElement.innerHTML = this.timeStr;
    this.running = true;
    this.timer = setInterval(this.run.bind(this), 1000);
  };

  /**
   *
   */
  _parseTime() {
    const d = [this.startTime.hour, this.startTime.minute, this.startTime.seconds];
    const time = [];
    let i = 0;

    while (i < d.length) {
      let t = d[i];
      let strT = ((i >= 0 && t < 10) ? '0' + t : t).toString();
      time.push(strT);
      i++;
    }

    return time;
  };

  /**
   *
   */
  run() {
    this.startTime.seconds -= 1;
    if (this.startTime.seconds < 0) {
      this.startTime.seconds = 59;
      this.startTime.minute -= 1;
      if (this.startTime.minute < 0) {
        this.startTime.minute = 59;
        this.startTime.hour -= 1;
      }
    }
     

    const time = this._parseTime();
    this.timeStr = `${time[0]}:${time[1]}:${time[2]}`;;
    this.countdownElement.innerHTML = this.timeStr;
    if ((this.startTime.seconds === 0) && (this.startTime.minute === 0) && (this.startTime.hour === 0)) {
      this.stop();
      this.funcCallback();
      return;
    }  
  };

  /**
   *
   */
  stop() {
    if (!this.running) {
      return;
    }
    this.running = false;
    clearInterval(this.timer);
  };

  /**
   *
   */
  reset({hour = 0, minute = 0, seconds = 0}) {
    this.startTime = {hour : hour, minute : minute, seconds : seconds};
    
    this.timeStr = '00:00:00';
    
    this.countdownElement.innerHTML = this.timeStr;
  };

  /**
   *
   */
  router(startTime : any) {
    if (!this.running) this.start(startTime);
    else  {
      this.stop();
      this.reset(this.startTime);
    }
  };
}

