import Bus from "./bus";

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
  /**
   *
   */
  constructor(htmlElementTitle : string, callback : any) {
    
    this.timerHTMLElement = document.getElementById(htmlElementTitle);
    this.running = false;
    this.paused = false;
    this.timeStr = '';
    this.funcCallback = callback;
  }

  /**
   *
   */
  start({hour = 0, minute = 0, seconds = 0}) {
    console.log('start running timer');
    if (this.running) {
      return;
    }
    console.log('start timer');
    this.startTime = {hour : hour, minute : minute, seconds : seconds};
    const time = this._parseTime();
    this.timeStr = time[0] + ':' + time[1] + ':' + time[2];
    this.timerHTMLElement.innerHTML = this.timeStr;
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
      let strT = ((i > 0 && t < 10) ? '0' + t : t).toString();
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
    this.timeStr = time[0] + ':' + time[1] + ':' + time[2];
    this.timerHTMLElement.innerHTML = this.timeStr;
    console.log('run timer');
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
    console.log('stop running timer');
    if (!this.running) {
      return;
    }
    console.log('stop timer');
    this.running = false;
    clearInterval(this.timer);
  };

  /**
   *
   */
  reset({hour = 0, minute = 0, seconds = 0}) {
    this.startTime = {hour : hour, minute : minute, seconds : seconds};
    
    this.timeStr = this.startTime.hour + ':' + this.startTime.minute + ':' + this.startTime.seconds;
    
    this.timerHTMLElement.innerHTML = this.timeStr;
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

