/* eslint-disable require-jsdoc */
import singlePlayerTemplate from './SinglePlayer.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';
import {MineSweeper} from '../../game/minesweeper.js';

/** */
export class SinglePlayerView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, singlePlayerTemplate);
    this.cellsize = 50;
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.bombsCount = 20;
    this.openCellsCount = 0;
    this.cellCloseStringName = 'cell_close';
    this.cellOpenStringName = 'cell_open';
    this.cellStringName = 'cell';
    this.cellFlagStringName = 'cell_flag';
    this.mapStringName = 'single_player__map';
    this.pointsFieldStringName = 'single_player__points';
    this.mineSweeper = new MineSweeper(this.cellNumbersX, this.cellNumbersY, this.bombsCount);
    document.addEventListener('click', this._clickOnCell.bind(this));
    document.addEventListener('contextmenu', this._rightСlickOnCell.bind(this));
    document.body.oncontextmenu = function(e) {
      return false;
    };
  }

  /**
   *
  */
  render() {
    this.data = User;
    super.render();
    // const pointsField = document.getElementById(this.pointsFieldStringName);
    /* if (!pointsField) {
      console.log('error pointsField cannot find ' + this.pointsFieldStringName);
      return;
    }*/
    this.BBBVCount = this.mineSweeper.count3BV();
    console.log('3BV = ' + this.BBBVCount);
    // pointsField.textContent = '0';
    this._showMap(this.cellNumbersX, this.cellNumbersY);
  }

  /** */
  _showMap(XLen, YLen) {
    /*           */
    (function timer() {

      // declare
      const output = document.getElementById('single_player__timer');
      let running = false;
      let paused = false;
      let timer;

      // timer start time
      let then;
      // pause duration
      let delay;
      // pause start time
      let delayThen;


      // start timer
      const start = function() {
        delay = 0;
        running = true;
        then = Date.now();
        timer = setInterval(run, 51);
      };


      // parse time in ms for output
      const parseTime = function(elapsed) {
        // array of time multiples [hours, min, sec, decimal]
        const d = [3600000, 60000, 1000, 10];
        const time = [];
        let i = 0;

        while (i < d.length) {
          let t = Math.floor(elapsed/d[i]);

          // remove parsed time for next iteration
          elapsed -= t*d[i];

          // add '0' prefix to m,s,d when needed
          t = (i > 0 && t < 10) ? '0' + t : t;
          time.push(t);
          i++;
        }

        return time;
      };


      // run
      // eslint-disable-next-line no-var
      var run = function() {
        // get output array and print
        const time = parseTime(Date.now()-then-delay);
        output.innerHTML = time[0] + ':' + time[1] + ':' + time[2] + '.' + time[3];
      };


      // stop
      const stop = function() {
        paused = true;
        delayThen = Date.now();
        clearInterval(timer);

        // call one last time to print exact time
        run();
      };


      // resume
      const resume = function() {
        paused = false;
        delay += Date.now()-delayThen;
        timer = setInterval(run, 51);
      };


      // clear
      const reset = function() {
        running = false;
        paused = false;
        output.innerHTML = '0:00:00.00';
      };


      // evaluate and route
      const router = function() {
        if (!running) start();
        else if (paused) resume();
        else stop();
      };
      router();
    })();

    /*            */

    const field = document.getElementsByClassName(this.mapStringName)[0];
    if (!field) {
      console.log('error field cannot find ' + this.mapStringName);
    }
    field.setAttribute('class', this.mapStringName);
    field.setAttribute('style', 'width: ' + this.cellNumbersX * this.cellsize + 'px; ' + 'height: ' + this.cellNumbersY * this.cellsize + 'px;');
    for (let y = 0; y < YLen; y++) {
      for (let x = 0; x < XLen; x++) {
        const cell = document.createElement('div');
        const strClassClose = this.cellCloseStringName + '_' + this.mineSweeper.randomInteger(1, 3);
        cell.setAttribute('class', this.cellStringName + ' ' + this.cellCloseStringName + ' ' + strClassClose);

        cell.setAttribute('id', this.cellStringName + '_' + x + '_' +y);
        cell.setAttribute('style', 'top: ' + y * this.cellsize + 'px;' + 'left: ' + x * this.cellsize + 'px;'
        + 'width: ' + this.cellsize + 'px;' + 'height: ' + this.cellsize + 'px;');
        field.appendChild(cell);
      }
    }
    return;
  }

  /** */
  _clickOnCell(e) {
    if (!e.target.classList.contains(this.cellStringName) ||
      e.target.classList.contains(this.cellFlagStringName)) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[1]);
    const y = parseInt(idArr[2]);
    let res;
    if (this.mineSweeper.map[x][y] === 9) {
      this._openAllCels(x, y, this.cellNumbersX, this.cellNumbersY);
      alert('You lose!');
      return;
    } else {
      res = this.mineSweeper.
          openCels(x, y, this.cellNumbersX, this.cellNumbersY);
      this._openCels(res.cellArr);
      this.openCellsCount += res.openCells;
    }
    /* const pointsField = document.getElementById(this.pointsFieldStringName);
    if (!pointsField) {
      console.log('error pointsField cannot find ' + this.pointsFieldStringName);
      return;
    }*/
    // eslint-disable-next-line max-len
    console.log(this.openCellsCount, ' ', this.cellNumbersX * this.cellNumbersY - this.bombsCount);
    // pointsField.textContent = (parseInt(pointsField.textContent) + res.points).toString();
    if (this.openCellsCount === this.cellNumbersX * this.cellNumbersY - this.bombsCount) {
      this._openAllCels(x, y, this.cellNumbersX, this.cellNumbersY);
      alert('You win!');
    }
    return;
  }

  /** */
  _rightСlickOnCell(e) {
    if (!e.target.classList.contains(this.cellStringName) ||
      (!e.target.classList.contains(this.cellCloseStringName) &&
      !e.target.classList.contains(this.cellFlagStringName))) {
      return;
    }
    if (e.target.classList.contains(this.cellFlagStringName) &&
        e.target.classList.length >= 3) {
      const classElems = e.target.classList[2].split('_');
      const numClassElem = parseInt(classElems[2]);
      e.target.classList.remove(e.target.classList[2]);
      e.target.classList.remove(this.cellFlagStringName);
      e.target.classList.add(this.cellCloseStringName);
      e.target.classList.add(this.cellCloseStringName + '_' + numClassElem);
      return;
    }
    if (e.target.classList.length >= 3) {
      const classElems = e.target.classList[2].split('_');
      const numClassElem = parseInt(classElems[2]);
      e.target.classList.remove(e.target.classList[2]);
      e.target.classList.remove(this.cellCloseStringName);
      e.target.classList.add(this.cellFlagStringName);
      e.target.classList.add(this.cellFlagStringName + '_' + numClassElem);
    }
    return;
  }

  /** */
  _openCels(arrCells) {
    for (let i = 0; i < arrCells.length; i++) {
      const x = arrCells[i][0];
      const y = arrCells[i][1];
      const cell = document.
          getElementById(this.cellStringName+ '_' + x + '_' +y);
      if (!cell) {
        console.log('error _openCels cannot find ' +
           this.cellStringName + '_' + x + '_' +y);
      }
      if (!cell.classList.contains(this.cellCloseStringName)) {
        return {points: 0, openCells: 0};
      }
      cell.classList.remove(this.cellCloseStringName);
      cell.textContent = this.mineSweeper.map[x][y].toString();
      cell.classList.add(this.cellOpenStringName + this.mineSweeper.map[x][y].toString());
    }
  }

  /** */
  _openAllCels() {
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.getElementById(this.cellStringName + '_' + x + '_' +y);
        if (!cell) {
          console.log('error _openAllCels cannot find ' + this.cellStringName + '_' + x + '_' +y);
        }
        if (cell.classList.contains(this.cellCloseStringName)) {
          cell.classList.remove(this.cellCloseStringName);
          cell.textContent = this.mineSweeper.map[x][y].toString();
          cell.classList.add(this.cellOpenStringName + this.mineSweeper.map[x][y].toString());
        }
        if (cell.classList.contains(this.cellFlagStringName)) {
          cell.classList.remove(this.cellFlagStringName);
          cell.textContent = this.mineSweeper.map[x][y].toString();
          cell.classList.add(this.cellOpenStringName + this.mineSweeper.map[x][y].toString());
        }
      }
    }
    return;
  }
}
