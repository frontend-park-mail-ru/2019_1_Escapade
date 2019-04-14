import multiPlayerTemplate from './MultiPlayer.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user';
import {MineSweeper} from '../../game/minesweeper';
import {Timer} from '../../game/timer';
import Bus from '../../utils/bus';

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
    super(parent, multiPlayerTemplate, true, 'updateUserInfo');
    this.cellCloseStringName = 'cell_close';
    this.cellOpenStringName = 'cell_open';
    this.cellStringName = 'cell';
    this.cellFlagStringName = 'cell_flag';
    this.mapStringName = 'single_player__map';
    this.timerFieldStringName = 'single_player__timer';

    this.pointsFieldStringName = 'single_player__statistics_row_points';
    this.minesFieldStringName = 'single_player__statistics_row_mines';
    this.leftClicksFieldStringName = 'single_player__statistics_row_left_click';
    this.rightClicksFieldStringName = 'single_player__statistics_row_right_click';
    this.restartFieldStringName = 'single_player__restart_button';
    this.percentOpenFieldStringName = 'single_player__percent';
    this.loadbarFieldStringName = 'single_player__loadbar';
    this.babyFieldStringName = 'single_player__submenu_baby';
    this.normalFieldStringName = 'single_player__submenu_normal';
    this.hardFieldStringName = 'single_player__submenu_hard';
    this.godFieldStringName = 'single_player__submenu_god';
    this.itemListFieldStringName = 'single_player__submenu_item';
    this.infoModeFieldStringName = 'single_player__settings_info_mode';
    this.infoWidthFieldStringName = 'single_player__settings_info_width';
    this.infoHeightFieldStringName = 'single_player__settings_info_height';
    this.infoMinesFieldStringName = 'single_player__settings_info_mines';

    this.playerNameFieldStringName = 'single_player__player_name';
    this.playerScoreFieldStringName = 'single_player__player_score';
    this.playerTimeFieldStringName = 'single_player__player_time';

    this.messageBoxFieldStringName = 'single_player__popup';
    this.messageBoxMessageFieldStringName = 'single_player__popup_text';
    this.messageBoxOkButtonFieldStringName = 'single_player__popup_ok_button';


    this.cellsize = 50;
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
    Bus.emit('connect');

    Bus.emit('get_rooms');

    Bus.emit('send_info');


    Bus.on('show_rooms', this._updateRooms.bind(this));
  }

  /** */
  _findRooms(e) {
    console.log('FFFFF');
    Bus.emit('get_rooms');
    return;
  }

  /** */
  _updateRooms(rooms) {
    const infoRooms = document.getElementsByClassName('multi_player__room_list')[0];
    infoRooms.textContent += rooms.Rooms;
  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    this.pointsDocElement = document.getElementsByClassName(this.pointsFieldStringName)[0];
    this.minesDocElement = document.getElementsByClassName(this.minesFieldStringName)[0];
    this.leftClicksDocElement = document.getElementsByClassName(this.leftClicksFieldStringName)[0];
    this.rightClicksDocElement = document.getElementsByClassName(this.rightClicksFieldStringName)[0];
    this.restartDocElement = document.getElementsByClassName(this.restartFieldStringName)[0];
    this.percentOpenDocElement = document.getElementsByClassName(this.percentOpenFieldStringName)[0];
    this.loadbarDocElement = document.getElementsByClassName(this.loadbarFieldStringName)[0];

    this.infoModeDocElement = document.getElementsByClassName(this.infoModeFieldStringName)[0];
    this.infoWidthDocElement = document.getElementsByClassName(this.infoWidthFieldStringName)[0];
    this.infoHeightDocElement = document.getElementsByClassName(this.infoHeightFieldStringName)[0];
    this.infoMinesDocElement = document.getElementsByClassName(this.infoMinesFieldStringName)[0];

    this.playerNameDocElement = document.getElementsByClassName(this.playerNameFieldStringName)[0];
    this.playerScoreDocElement = document.getElementsByClassName(this.playerScoreFieldStringName)[0];
    this.playerTimeDocElement = document.getElementsByClassName(this.playerTimeFieldStringName)[0];

    this.messageBoxDocElement = document.getElementsByClassName(this.messageBoxFieldStringName)[0];
    this.messageBoxMessageDocElement = document.getElementsByClassName(this.messageBoxMessageFieldStringName)[0];
    this.messageBoxDocElement.hidden = true;

    this.timer = new Timer(document.getElementById(this.timerFieldStringName));

    this.restartDocElement.addEventListener('click', this._restart.bind(this));
    this.restartDocElement.innerHTML = 'Start';
    this.infoModeDocElement.innerHTML = 'Normal mode';
    this.minesCount = 20;
    this.infoMinesDocElement.innerHTML = this.minesCount + ' mines';
    this.infoWidthDocElement.innerHTML = this.cellNumbersX + ' width';
    this.infoHeightDocElement.innerHTML = this.cellNumbersY + ' height';
    this._showMap();
  }

  /** */
  _clickOnBody(e : any) {
    if (e.target.classList.contains(this.itemListFieldStringName)) {
      this._changeHard(e);
    } else if (e.target.classList.contains(this.cellStringName)) {
      this._clickOnCell(e);
    } else if (e.target.classList.contains(this.messageBoxOkButtonFieldStringName)) {
      this._closeMessage();
    }
  }

  _updateUserInfo() {
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
  }

  /** */
  _showMap() {
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

    const field = document.getElementsByClassName(this.mapStringName)[0];
    if (!field) {
      console.log('error field cannot find ' + this.mapStringName);
    }
    field.innerHTML = '';
    field.setAttribute('class', this.mapStringName);
    field.setAttribute('style', 'width: ' + this.cellNumbersX * this.cellsize + 'px; ' + 'height: ' + this.cellNumbersY * this.cellsize + 'px;');
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.createElement('div');
        const strClassClose = this.cellCloseStringName + '_' + this.mineSweeper.randomInteger(1, 3);
        cell.setAttribute('class', this.cellStringName + ' ' + this.cellCloseStringName + ' ' + strClassClose);

        cell.setAttribute('id', this.cellStringName + '_' + x + '_' + y);
        cell.setAttribute('style', 'top: ' + y * this.cellsize + 'px;' + 'left: ' + x * this.cellsize + 'px;'
          + 'width: ' + this.cellsize + 'px;' + 'height: ' + this.cellsize + 'px;');
        field.appendChild(cell);
      }
    }
    return;
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
  _clickOnCell(e : any) {
    if (!e.target.classList.contains(this.cellStringName) ||
      e.target.classList.contains(this.cellFlagStringName) ||
      !this.start) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[1]);
    const y = parseInt(idArr[2]);
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
  _rightСlickOnCell(e : any) {
    if (!e.target.classList.contains(this.cellStringName) || !this.start ||
      (!e.target.classList.contains(this.cellCloseStringName) &&
        !e.target.classList.contains(this.cellFlagStringName))) {
      return;
    }
    this.rightClicksDocElement.innerHTML = (++this.rightClicksCount) + ' right clicks';
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[1]);
    const y = parseInt(idArr[2]);
    const typeOfCell = this.mineSweeper.putRemoveFlag(x, y);

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
      const numClassElem = parseInt(classElems[2]);
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
      const numClassElem = parseInt(classElems[2]);
      e.target.className = this.cellStringName + ' ' +
        this.cellFlagStringName + ' ' +
        this.cellFlagStringName + '_' + numClassElem;
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
