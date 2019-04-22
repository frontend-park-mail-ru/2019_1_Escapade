const multiPlayerTemplate = require('./MultiPlayer.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';
import { MineSweeper } from '../../game/minesweeper';
import { Timer } from '../../game/timer';
import Bus from '../../utils/bus';
import MathGame from '../../utils/math';

/** */
export default class MultiPlayer extends BaseView {
  cellsize: number;
  cellNumbersX: number;
  cellNumbersY: number;
  bombsCount: number;
  openCellsCount: number;
  cellCloseStringName: string;
  cellOpenStringName: string;
  cellStringName: string;
  cellFlagStringName: string;
  mapStringName: string;
  pointsFieldStringName: string;
  mineSweeper: MineSweeper;
  BBBVCount: any;
  timerFieldStringName: string;
  minesFieldStringName: string;
  leftClicksFieldStringName: string;
  rightClicksFieldStringName: string;
  restartFieldStringName: string;
  percentOpenFieldStringName: string;
  loadbarFieldStringName: string;
  babyFieldStringName: string;
  normalFieldStringName: string;
  hardFieldStringName: string;
  godFieldStringName: string;
  itemListFieldStringName: string;
  infoModeFieldStringName: string;
  infoWidthFieldStringName: string;
  infoHeightFieldStringName: string;
  infoMinesFieldStringName: string;
  playerNameFieldStringName: string;
  playerScoreFieldStringName: string;
  playerTimeFieldStringName: string;
  messageBoxFieldStringName: string;
  messageBoxMessageFieldStringName: string;
  messageBoxOkButtonFieldStringName: string;
  minesCount: number;
  start: boolean;
  pointsDocElement: HTMLElement;
  minesDocElement: HTMLElement;
  leftClicksDocElement: HTMLElement;
  rightClicksDocElement: HTMLElement;
  restartDocElement: HTMLElement;
  percentOpenDocElement: HTMLElement;
  loadbarDocElement: HTMLElement;
  infoModeDocElement: HTMLElement;
  infoWidthDocElement: HTMLElement;
  infoHeightDocElement: HTMLElement;
  infoMinesDocElement: HTMLElement;
  playerNameDocElement: HTMLElement;
  playerScoreDocElement: HTMLElement;
  playerTimeDocElement: HTMLElement;
  messageBoxDocElement: HTMLElement;
  messageBoxMessageDocElement: HTMLElement;
  timer: any;
  maxPointsCount: number;
  minTimeCount: string;
  pointsCount: number;
  leftClicksCount: number;
  rightClicksCount: number;
  prcentOpen: number;
  minesRemainedCount: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, multiPlayerTemplate, true, 'updateUserInfoMult');
    this.cellCloseStringName = 'multi_player_cell_close';
    this.cellOpenStringName = 'multi_player_cell_open';
    this.cellStringName = 'multi_player_cell';
    this.cellFlagStringName = 'multi_player_cell_flag';
    this.mapStringName = 'multi_player__map';
    this.timerFieldStringName = 'multi_player__timer';

    this.pointsFieldStringName = 'multi_player__statistics_row_points';
    this.minesFieldStringName = 'multi_player__statistics_row_mines';
    this.leftClicksFieldStringName = 'multi_player__statistics_row_left_click';
    this.rightClicksFieldStringName = 'multi_player__statistics_row_right_click';
    this.restartFieldStringName = 'multi_player__restart_button';
    this.percentOpenFieldStringName = 'multi_player__percent';
    this.loadbarFieldStringName = 'multi_player__loadbar';
    this.babyFieldStringName = 'multi_player__submenu_baby';
    this.normalFieldStringName = 'multi_player__submenu_normal';
    this.hardFieldStringName = 'multi_player__submenu_hard';
    this.godFieldStringName = 'multi_player__submenu_god';
    this.itemListFieldStringName = 'multi_player__submenu_item';
    this.infoModeFieldStringName = 'multi_player__settings_info_mode';
    this.infoWidthFieldStringName = 'multi_player__settings_info_width';
    this.infoHeightFieldStringName = 'multi_player__settings_info_height';
    this.infoMinesFieldStringName = 'multi_player__settings_info_mines';

    this.playerNameFieldStringName = 'multi_player__player_name';
    this.playerScoreFieldStringName = 'multi_player__player_score';
    this.playerTimeFieldStringName = 'multi_player__player_time';

    this.messageBoxFieldStringName = 'multi_player__popup';
    this.messageBoxMessageFieldStringName = 'multi_player__popup_text';
    this.messageBoxOkButtonFieldStringName = 'multi_player__popup_ok_button';


    this.cellsize = 50;
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 1;
    this.start = false;

    document.addEventListener('click', this._clickOnBody.bind(this));


    document.addEventListener('contextmenu', this._rightСlickOnCell.bind(this));
    document.body.oncontextmenu = function (e) {
      return false;
    };
    Bus.on('updateUserInfoMult', this._updateUserInfo.bind(this));
    Bus.emit('connect');

    Bus.emit('get_rooms');

    Bus.emit('send_info');


    Bus.on('show_rooms', this._updateRooms.bind(this));
  }

  /** */
  _findRooms(e: any) {
    Bus.emit('get_rooms');
    return;
  }

  /** */
  _updateRooms(rooms: any) {
    const infoRooms = document.querySelector('multi_player__room_list');
    infoRooms.textContent += rooms.Rooms;
  }


  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    this.pointsDocElement = document.querySelector(this.pointsFieldStringName);
    this.minesDocElement = document.querySelector(this.minesFieldStringName);
    this.leftClicksDocElement = document.querySelector(this.leftClicksFieldStringName);
    this.rightClicksDocElement = document.querySelector(this.rightClicksFieldStringName);
    this.restartDocElement = document.querySelector(this.restartFieldStringName);
    this.percentOpenDocElement = document.querySelector(this.percentOpenFieldStringName);
    this.loadbarDocElement = document.querySelector(this.loadbarFieldStringName);

    this.infoModeDocElement = document.querySelector(this.infoModeFieldStringName);
    this.infoWidthDocElement = document.querySelector(this.infoWidthFieldStringName);
    this.infoHeightDocElement = document.querySelector(this.infoHeightFieldStringName);
    this.infoMinesDocElement = document.querySelector(this.infoMinesFieldStringName);

    this.playerNameDocElement = document.querySelector(this.playerNameFieldStringName);
    this.playerScoreDocElement = document.querySelector(this.playerScoreFieldStringName);
    this.playerTimeDocElement = document.querySelector(this.playerTimeFieldStringName);

    this.messageBoxDocElement = document.querySelector(this.messageBoxFieldStringName);
    this.messageBoxMessageDocElement = document.querySelector(this.messageBoxMessageFieldStringName);


    this.timer = new Timer('multy_player__timer');

    this.restartDocElement.addEventListener('click', this._restart.bind(this));
    this.restartDocElement.innerHTML = 'Start';
    this.infoModeDocElement.innerHTML = 'Normal mode';
    this.minesCount = 20;
    this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    this.infoWidthDocElement.innerHTML = this.cellNumbersX + ' width';
    this.infoHeightDocElement.innerHTML = this.cellNumbersY + ' height';
    this._showMap();
    Bus.on('stop_reset_timer', this._stop_reset_timer.bind(this))
  }

  /** */
  _clickOnBody(e: any) {
    if (e.target.classList.contains(this.itemListFieldStringName)) {
      this._changeHard(e);
    } else if (e.target.classList.contains(this.cellStringName)) {
      this._clickOnCell(e);
    } else if (e.target.classList.contains(this.messageBoxOkButtonFieldStringName)) {
      this._closeMessage();
    }
  }

  _updateUserInfo() {
    console.log("_updateUserInfo here");
    if (User.name) {
      this.playerNameDocElement.innerHTML = User.name;
      this.playerScoreDocElement.innerHTML = '0'; // получать из user
      this.playerTimeDocElement.innerHTML = '0:00:00:00';
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
    console.log('ahaha');
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
    this.pointsDocElement.innerHTML = this.pointsCount + ' points';
    this.minesDocElement.innerHTML = this.minesRemainedCount + ' mines left';
    this.leftClicksDocElement.innerHTML = this.leftClicksCount + ' left clicks';
    this.rightClicksDocElement.innerHTML = this.rightClicksCount + ' right clicks';
    this.percentOpenDocElement.innerHTML = this.prcentOpen + ' %';
    this.loadbarDocElement.style.width = 0 + 'px';

    if (this.start) {
      this.timer.router();
    }

    const field = document.querySelector(this.mapStringName);
    if (!field) {
      console.log('error field cannot find ' + this.mapStringName);
    }
    field.innerHTML = '';
    field.setAttribute('class', this.mapStringName);
    field.setAttribute('style', 'width: ' + this.cellNumbersX * this.cellsize + 'px; ' + 'height: ' + this.cellNumbersY * this.cellsize + 'px;');
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.createElement('div');
        const strClassClose = this.cellCloseStringName + '_' + MathGame.randomInteger(1, 3);
        cell.setAttribute('class', this.cellStringName + ' ' + this.cellCloseStringName + ' ' + strClassClose);

        cell.setAttribute('id', this.cellStringName + '_' + x + '_' + y);
        cell.setAttribute('style', 'top: ' + y * this.cellsize + 'px;' + 'left: ' + x * this.cellsize + 'px;'
          + 'width: ' + this.cellsize + 'px;' + 'height: ' + this.cellsize + 'px;');
        field.appendChild(cell);
      }
    }
    return;
  }

  _stop_reset_timer() {
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
  _changeHard(e: any) {
    if (e.target.classList.contains(this.babyFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'Baby mode';
      this.minesCount = 10;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    } else if (e.target.classList.contains(this.normalFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'Normal mode';
      this.minesCount = 20;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    } else if (e.target.classList.contains(this.hardFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'Hard mode';
      this.minesCount = 30;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    } else if (e.target.classList.contains(this.godFieldStringName)) {
      this.infoModeDocElement.innerHTML = 'God mode';
      this.minesCount = 40;
      this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    }
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
  _clickOnCell(e: any) {
    console.log('prev check _click')
    if (!e.target.classList.contains(this.cellStringName) || !this.start) {
      return;
    }
    console.log('after check _click')
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[3]);
    const y = parseInt(idArr[4]);
    if (this.mineSweeper.mapLabel[x][y] != 0) { // если не закрыта
      return;
    }
    this.leftClicksDocElement.innerHTML = (++this.leftClicksCount) + ' left clicks';
    if (this.mineSweeper.map[x][y] === 9) {
      this._openAllCels();
      if (this.timer.running) {
        this.timer.stop();
      }
      this.start = false;
      this._showMessage('You lose!');
      return;
    }
    const res = this.mineSweeper.
      openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    this._openCels(res.cellArr);
    this.openCellsCount += res.openCells;
    this.prcentOpen = Math.round((this.openCellsCount / (this.cellNumbersX * this.cellNumbersY - this.minesCount)) * 100);
    this.percentOpenDocElement.innerHTML = this.prcentOpen + ' %';
    this.loadbarDocElement.style.width = (this.prcentOpen / 100) * (this.cellsize * this.cellNumbersX - 55) + 'px';
    console.log(this.openCellsCount, ' ', this.cellNumbersX * this.cellNumbersY - this.minesCount);
    this.pointsDocElement.innerHTML = (this.pointsCount += res.points) + ' points';

    if (this.openCellsCount === this.cellNumbersX * this.cellNumbersY - this.minesCount) {
      this._openAllCels();
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
  _rightСlickOnCell(e: any) {
    if (!e.target.classList.contains(this.cellStringName) || !this.start) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[3]);
    const y = parseInt(idArr[4]);
    const typeOfCell = this.mineSweeper.putRemoveFlag(x, y);
    if (typeOfCell == 1) {
      return;
    }

    this.rightClicksDocElement.innerHTML = (++this.rightClicksCount) + ' right clicks';
    if (typeOfCell == 0) {
      if (this.minesRemainedCount < this.minesCount) {
        ++this.minesRemainedCount;
        if (this.minesRemainedCount < 0) {
          this.minesDocElement.innerHTML = 0 + ' mines left';
        } else {
          this.minesDocElement.innerHTML = this.minesRemainedCount + ' mines left';
        }
      }
      if (e.target.classList.length < 3) {
        console.log('error e.target.classList.length < 3');
        return;
      }
      const classElems = e.target.classList[2].split('_');
      const numClassElem = parseInt(classElems[4]);
      e.target.className = this.cellStringName + ' ' +
        this.cellCloseStringName + ' ' +
        this.cellCloseStringName + '_' + numClassElem;
      return;
    }

    if (typeOfCell == 2) {
      --this.minesRemainedCount;
      if (this.minesRemainedCount < 0) {
        this.minesDocElement.innerHTML = 0 + ' mines left';
      } else {
        this.minesDocElement.innerHTML = this.minesRemainedCount + ' mines left';
      }
      if (e.target.classList.length < 3) {
        console.log('error e.target.classList.length < 3');
        return;
      }
      const classElems = e.target.classList[2].split('_');
      const numClassElem = parseInt(classElems[4]);
      e.target.className = this.cellStringName + ' ' +
        this.cellFlagStringName + ' ' +
        this.cellFlagStringName + '_' + numClassElem;
    }
    return;
  }

  /** */
  _showMessage(mess: string) {
    this.messageBoxDocElement.hidden = false;
    this.messageBoxMessageDocElement.innerHTML = mess;
  }

  _closeMessage() {
    this.messageBoxDocElement.hidden = true;
  }

  /** */
  _openCels(arrCells: any) {
    for (let i = 0; i < arrCells.length; i++) {
      const x = arrCells[i];
      const y = arrCells[i][1];
      const cell = document.
        getElementById(this.cellStringName + '_' + x + '_' + y);
      if (!cell) {
        console.log('error _openCels cannot find ' +
          this.cellStringName + '_' + x + '_' + y);
      }
      cell.className = this.cellStringName + ' ' +
        this.cellOpenStringName + ' ' +
        this.cellOpenStringName + this.mineSweeper.map[x][y].toString();
    }
  }

  /** */
  _openAllCels() {
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.getElementById(this.cellStringName + '_' + x + '_' + y);
        if (!cell) {
          console.log('error _openAllCels cannot find ' + this.cellStringName + '_' + x + '_' + y);
        }
        cell.className = this.cellStringName + ' ' +
          this.cellOpenStringName + ' ' +
          this.cellOpenStringName + this.mineSweeper.map[x][y].toString();
      }
    }
    this.prcentOpen = 100;
    this.percentOpenDocElement.innerHTML = this.prcentOpen + ' %';
    this.loadbarDocElement.style.width = (this.prcentOpen / 100) * (this.cellsize * this.cellNumbersX - 55) + 'px';
    return;
  }
}