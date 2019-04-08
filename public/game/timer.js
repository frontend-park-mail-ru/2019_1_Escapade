/** */
export class Timer {
  /**
   *
   */
  constructor(timerHTMLElement) {
    this.timerHTMLElement = timerHTMLElement;
    this.running = false;
    this.paused = false;
  }

  /**
   *
   */
  start() {
    this.delay = 0;
    this.running = true;
    this.then = Date.now();
    this.timer = setInterval(this.run.bind(this), 51);
  };

  /**
   *
   */
  _parseTime(elapsed) {
    const d = [3600000, 60000, 1000, 10];
    const time = [];
    let i = 0;

    while (i < d.length) {
      let t = Math.floor(elapsed/d[i]);
      elapsed -= t*d[i];

      t = (i > 0 && t < 10) ? '0' + t : t;
      time.push(t);
      i++;
    }

    return time;
  };

  /**
   *
   */
  run() {
    const time = this._parseTime(Date.now()-this.then-this.delay);
    this.timerHTMLElement.innerHTML = time[0] + ':' + time[1] + ':' + time[2] + '.' + time[3];
  };

  /**
   *
   */
  stop() {
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
    this.delay += Date.now()-this.delayThen;
    this.timer = setInterval(this.run.bind(this), 51);
  };

  /**
   *
   */
  reset() {
    this.running = false;
    this.paused = false;
    this.timerHTMLElement.innerHTML = '0:00:00.00';
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

