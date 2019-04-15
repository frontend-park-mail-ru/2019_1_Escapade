/* eslint-disable require-jsdoc */
import singlePlayerTemplate from './SinglePlayer.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user';
import {MineSweeper} from '../../game/minesweeper';
import {Timer} from '../../game/timer';
import { checkAuth } from '../../utils/user';
import Bus from '../../utils/bus';
import { ConfigSinglePlayerView } from './ConfigSinglePlayer';
/** */
export default class SinglePlayerView extends BaseView {
  cellsize: number;
  cellNumbersX: number;
  cellNumbersY: number;
  minesCount: number;
  start: boolean;
  pointsDocElement: Element;
  minesDocElement: Element;
  leftClicksDocElement: Element;
  rightClicksDocElement: Element;
  restartDocElement: Element;
  percentOpenDocElement: Element;
  loadbarDocElement: Element;
  infoModeDocElement: Element;
  infoWidthDocElement: Element;
  infoHeightDocElement: Element;
  infoMinesDocElement: Element;
  playerNameDocElement: Element;
  playerScoreDocElement: Element;
  playerTimeDocElement: Element;
  messageBoxDocElement: Element;
  messageBoxMessageDocElement: Element;
  timer: Timer;
  maxPointsCount: number;
  minTimeCount: string;
  openCellsCount: number;
  pointsCount: number;
  leftClicksCount: number;
  rightClicksCount: number;
  prcentOpen: number;
  minesRemainedCount: any;
  mineSweeper: MineSweeper;
  BBBVCount: any;
  config: ConfigSinglePlayerView;
  difficult: number;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.config = new ConfigSinglePlayerView()
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 1;
    this.start = false;
    
    document.addEventListener('click', this._clickOnBody.bind(this));


    document.addEventListener('contextmenu', this._rightСlickOnCell.bind(this));
    document.body.oncontextmenu = function(e) {
      return false;
    };
    Bus.on('updateUserInfo', this._updateUserInfo.bind(this));
  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    this.pointsDocElement = document.getElementsByClassName(this.config.pointsFieldStringName)[0];
    this.minesDocElement = document.getElementsByClassName(this.config.minesFieldStringName)[0];
    this.leftClicksDocElement = document.getElementsByClassName(this.config.leftClicksFieldStringName)[0];
    this.rightClicksDocElement = document.getElementsByClassName(this.config.rightClicksFieldStringName)[0];
    this.restartDocElement = document.getElementsByClassName(this.config.restartFieldStringName)[0];
    this.percentOpenDocElement = document.getElementsByClassName(this.config.percentOpenFieldStringName)[0];
    this.loadbarDocElement = document.getElementsByClassName(this.config.loadbarFieldStringName)[0];

    this.infoModeDocElement = document.getElementsByClassName(this.config.infoModeFieldStringName)[0];
    this.infoWidthDocElement = document.getElementsByClassName(this.config.infoWidthFieldStringName)[0];
    this.infoHeightDocElement = document.getElementsByClassName(this.config.infoHeightFieldStringName)[0];
    this.infoMinesDocElement = document.getElementsByClassName(this.config.infoMinesFieldStringName)[0];

    this.playerNameDocElement = document.getElementsByClassName(this.config.playerNameFieldStringName)[0];
    this.playerScoreDocElement = document.getElementsByClassName(this.config.playerScoreFieldStringName)[0];
    this.playerTimeDocElement = document.getElementsByClassName(this.config.playerTimeFieldStringName)[0];

    this.messageBoxDocElement = document.getElementsByClassName(this.config.messageBoxFieldStringName)[0];
    this.messageBoxMessageDocElement = document.getElementsByClassName(this.config.messageBoxMessageFieldStringName)[0];
    

    this.timer = new Timer(document.getElementById(this.config.timerFieldStringName));

    this.restartDocElement.addEventListener('click', this._restart.bind(this));
    this.restartDocElement.innerHTML = 'Start';
    this.infoModeDocElement.innerHTML = 'Normal mode';
    this.difficult = 1;
    this.minesCount = 20;   
    this.infoMinesDocElement.innerHTML = `${this.minesCount} mines`;
    this.infoWidthDocElement.innerHTML = `${this.cellNumbersX} width`;
    this.infoHeightDocElement.innerHTML = `${this.cellNumbersY} height`;
    this._showMap();
    Bus.on('stop_reset_timer', this._stop_reset_timer.bind(this))
  }

  /** */
  _clickOnBody(e : any) {
    if (e.target.classList.contains(this.config.itemListFieldStringName)) {
      this._changeHard(e);
    } else if (e.target.classList.contains(this.config.cellStringName)) {
      this._clickOnCell(e);
    } else if (e.target.classList.contains(this.config.messageBoxOkButtonFieldStringName)) {
      this._closeMessage();
    }
  }
  _updateUserInfo() {
    checkAuth(this._updateUserInfoCalback.bind(this), this.difficult)
  }
  _updateUserInfoCalback() {
    console.log("_updateUserInfo here");
    if (User.name) {
      this.playerNameDocElement.innerHTML = User.name;
      if (User.bestScore.String) {
        this.playerScoreDocElement.innerHTML = User.bestScore.String; // получать из user
        this.playerTimeDocElement.innerHTML = User.bestTime.String;
      } else {
        this.playerScoreDocElement.innerHTML = '-'; // получать из user
        this.playerTimeDocElement.innerHTML = '-';
      }

      this.maxPointsCount = 0;
      this.minTimeCount = '1:24:60:60';
    } else {
      this.playerNameDocElement.innerHTML = 'Guest';
      this.playerScoreDocElement.innerHTML = '0';
      this.playerTimeDocElement.innerHTML = '0:00:00:00';
      this.maxPointsCount = 0;
      this.minTimeCount = '1:24:60:60';
    }
    this._showMap();
  }

  /** */
  _showMap() {
    this.messageBoxDocElement.hidden = true;
    this.openCellsCount = 0;
    this.pointsCount = 0;
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.prcentOpen = 0;
    this.minesRemainedCount = this.minesCount;

    this.mineSweeper = new MineSweeper(this.cellNumbersX, this.cellNumbersY, this.minesCount);
    this.BBBVCount = this.mineSweeper.count3BV();
    console.log('3BV = ' + this.BBBVCount);
    this.pointsDocElement.innerHTML = `${this.pointsCount} points`;
    this.minesDocElement.innerHTML = `${this.minesRemainedCount} mines left`;
    this.leftClicksDocElement.innerHTML = `${this.leftClicksCount} left clicks`;
    this.rightClicksDocElement.innerHTML = `${this.rightClicksCount} right clicks`;
    this.percentOpenDocElement.innerHTML = `${this.prcentOpen}%`;
    this.loadbarDocElement.style.width = '0px';

    if (this.start) {
      this.timer.router();
    }

    const field = document.getElementsByClassName(this.config.mapStringName)[0];
    if (!field) {
      console.log('error field cannot find ' + this.config.mapStringName);
    }
    field.innerHTML = '';
    field.setAttribute('class', this.config.mapStringName);
    field.setAttribute('style', `width: ${this.cellNumbersX * this.config.cellsize}px; height: ${this.cellNumbersY * this.config.cellsize}px;`);
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.createElement('div');
        const strClassClose = `${this.config.cellCloseStringName}_${this.mineSweeper.randomInteger(1, 3)}`;
        cell.setAttribute('class', `${this.config.cellStringName} ${this.config.cellCloseStringName} ${strClassClose}`);

        cell.setAttribute('id', `${this.config.cellStringName}_${x}_${y}`);
        cell.setAttribute('style', `top: ${y * this.config.cellsize}px; left: ${x * this.config.cellsize}px;
          width: ${this.config.cellsize}px; height: ${this.config.cellsize}px;`);
        field.appendChild(cell);
      }
    }
    return;
  }

  _stop_reset_timer(){
    this.timer.stop();
    this.timer.reset();
  }

  /** */
  _restart() {
    if (!this.start) {
      this.restartDocElement.innerHTML = 'Restart';
      this.start = true;
    } else {
      if (this.timer.running) {
        this.timer.stop();
      }
    }

    this._showMap();
  }


  /** */
  _changeHard(e : any) {
    if (e.target.classList.contains(this.config.babyFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'Baby mode';
      this.difficult = 0;
      this.minesCount = 10;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    } else if (e.target.classList.contains(this.config.normalFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'Normal mode';
      this.difficult = 1;
      this.minesCount = 20;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    } else if (e.target.classList.contains(this.config.hardFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'Hard mode';
      this.difficult = 2;
      this.minesCount = 30;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    } else if (e.target.classList.contains(this.config.godFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'God mode';
      this.difficult = 3;
      this.minesCount = 40;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    }
    checkAuth(this._updateUserInfoCalback.bind(this), this.difficult)
    if (this.timer.running) {
      this.timer.stop();
    }

    if (!this.start) {
      this.restartDocElement.innerHTML = 'Restart';
      this.start = true;
    }
    this._showMap();
  }

  /** */
  _clickOnCell(e : any) {
    
    if (!e.target.classList.contains(this.config.cellStringName) || !this.start) {
      return;
    }
    let [,x, y] = e.target.id.split('_');
    x = parseInt(x);
    y = parseInt(y);
    if (this.mineSweeper.mapLabel[x][y] != 0) { // если не закрыта
      return;
    }
    this.leftClicksDocElement.innerHTML = `${++this.leftClicksCount} left clicks`;
    if (this.mineSweeper.map[x][y] === 9) {
      this._openAllCels();
      if (this.timer.running) {
        this.timer.stop();
      }
      this.start = false;
      const data = JSON.stringify({difficult: this.difficult, singleTotal: 1, singleWin: 0});
      Bus.emit('sendResultsSingleGame', data);
      this._showMessage('You lose!');
      return;
    }
    const res = this.mineSweeper.
        openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    console.log(res);
    this._openCels(res.cellArr);
    this.openCellsCount += res.openCells;
    this.prcentOpen = Math.round((this.openCellsCount / (this.cellNumbersX * this.cellNumbersY - this.minesCount)) * 100);
    this.percentOpenDocElement.innerHTML = `${this.prcentOpen}%`;
    this.loadbarDocElement.style.width = `${(this.prcentOpen / 100) * (this.config.cellsize * this.cellNumbersX - 55)}px`;
    console.log(this.openCellsCount, ' ', this.cellNumbersX * this.cellNumbersY - this.minesCount);
    this.pointsDocElement.innerHTML = `${this.pointsCount += res.points} points`;

    if (this.openCellsCount === this.cellNumbersX * this.cellNumbersY - this.minesCount) {
      this._openAllCels();
      console.log(this.timer.timeStr);
      const timeArr = this.timer.timeStr.split(':');
      const timeSec = parseInt(timeArr[0]) * 3600 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]) + parseInt(timeArr[3]) / 100
      const data = {score: this.pointsCount, time: timeSec, difficult: this.difficult, singleTotal: 1, singleWin: 1};
      Bus.emit('sendResultsSingleGame', data);
      if (this.timer.running) {
        this.timer.stop();
      }
      this.start = false;
      if (this.maxPointsCount < this.pointsCount) {
        this.maxPointsCount = this.pointsCount;
        this.playerScoreDocElement.innerHTML = this.pointsCount.toString();
      }
      if (this.minTimeCount > this.timer.timeStr) {
        this.minTimeCount = this.timer.timeStr;
        this.playerTimeDocElement.innerHTML = this.minTimeCount;
      }
      this._showMessage('You win!');
    }
    return;
  }

  /** */
  _rightСlickOnCell(e : any) {
    if (!e.target.classList.contains(this.config.cellStringName) || !this.start) {
      return;
    }
    const [,x, y] = e.target.id.split('_');
    const typeOfCell = this.mineSweeper.putRemoveFlag(x, y);
    if (typeOfCell == 1) {
      return;
    }

    this.rightClicksDocElement.innerHTML = `${++this.rightClicksCount} right clicks`;
    if (typeOfCell == 0) {
      if (this.minesRemainedCount < this.minesCount) {
        ++this.minesRemainedCount;
        if (this.minesRemainedCount < 0) {
          this.minesDocElement.innerHTML = '0 mines left';
        } else {
          this.minesDocElement.innerHTML = `${this.minesRemainedCount} mines left`;
        }
      }
      if (e.target.classList.length < 3) {
        console.log('error e.target.classList.length < 3');
        return;
      }
      const classElems = e.target.classList[2].split('_');
      const numClassElem = parseInt(classElems[2]);
      e.target.className = `${this.config.cellStringName} ${this.config.cellCloseStringName} ${this.config.cellCloseStringName}_${numClassElem}`;
      return;
    }

    if (typeOfCell == 2) {
      --this.minesRemainedCount;
      if (this.minesRemainedCount < 0) {
        this.minesDocElement.innerHTML = '0 mines left';
      } else {
        this.minesDocElement.innerHTML = `${this.minesRemainedCount} mines left`;
      }
      if (e.target.classList.length < 3) {
        console.log('error e.target.classList.length < 3');
        return;
      }
      const classElems = e.target.classList[2].split('_');
      const numClassElem = parseInt(classElems[2]);
      e.target.className = `${this.config.cellStringName} ${this.config.cellFlagStringName} ${this.config.cellFlagStringName}_${numClassElem}`;
    }
    return;
  }

  /** */
  _showMessage(mess : string) {
    this.messageBoxDocElement.hidden = false;
    this.messageBoxMessageDocElement.innerHTML = mess;
  }

  _closeMessage() {
    this.messageBoxDocElement.hidden = true;
  }

  /** */
  _openCels(arrCells : any) {
    for (let i = 0; i < arrCells.length; i++) {
      const x = arrCells[i][0];
      const y = arrCells[i][1];
      const cell = document.
          getElementById(`${this.config.cellStringName}_${x}_${y}`);
      if (!cell) {
        console.log('error _openCels cannot find ' +
        `${this.config.cellStringName}_${x}_${y}`);
      }
      cell.className = `${this.config.cellStringName} ${this.config.cellOpenStringName} ${this.config.cellOpenStringName}` + this.mineSweeper.map[x][y].toString();
    }
  }

  /** */
  _openAllCels() {
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.getElementById(`${this.config.cellStringName}_${x}_${y}`);
        if (!cell) {
          console.log('error _openAllCels cannot find ' + `${this.config.cellStringName}_${x}_${y}`);
        }
        cell.className = `${this.config.cellStringName} ${this.config.cellOpenStringName} ${this.config.cellOpenStringName}` + this.mineSweeper.map[x][y].toString();
      }
    }
    this.prcentOpen = 100;
    this.percentOpenDocElement.innerHTML = `${this.prcentOpen}%`;
    this.loadbarDocElement.style.width = `${(this.prcentOpen / 100) * (this.config.cellsize * this.cellNumbersX - 55)}px`;
    return;
  }
}
