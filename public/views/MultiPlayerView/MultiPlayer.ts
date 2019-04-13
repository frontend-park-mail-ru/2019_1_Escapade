import multiPlayerTemplate from './MultiPlayer.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user';
import {MineSweeper} from '../../game/minesweeper';
import Bus from '../../utils/bus';

/** */
export default class MultiPlayer extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, multiPlayerTemplate, false);
    this.cellsize = 25;
    this.cellNumbersX = 20;
    this.cellNumbersY = 20;
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
    Bus.emit('connect');

    Bus.emit('get_rooms');

    Bus.emit('send_info');


    Bus.on('show_rooms', this._updateRooms.bind(this));
  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    const pointsField = document.getElementById(this.pointsFieldStringName);
    if (!pointsField) {
      console.log('error pointsField cannot find ' + this.pointsFieldStringName);
      return;
    }
    this.BBBVCount = this.mineSweeper.count3BV();
    console.log('3BV = ' + this.BBBVCount);
    pointsField.textContent = '0';
    this._showMap(this.cellNumbersX, this.cellNumbersY);
    const findRoomsButton = document.getElementsByClassName('multi_player__find_room')[0];
    findRoomsButton.addEventListener('click', this._findRooms.bind(this));
  }
  /** */
  _showMap(XLen, YLen) {
    const field = document.getElementById(this.mapStringName);
    if (!field) {
      console.log('error field cannot find ' + this.mapStringName);
    }
    field.setAttribute('class', this.mapStringName);
    field.setAttribute('style', 'width: ' + this.cellNumbersX * this.cellsize + 'px; ' + 'height: ' + this.cellNumbersY * this.cellsize + 'px;');
    for (let y = 0; y < YLen; y++) {
      for (let x = 0; x < XLen; x++) {
        const cell = document.createElement('div');
        cell.setAttribute('class', this.cellStringName + ' ' + this.cellCloseStringName);
        cell.setAttribute('id', this.cellStringName + '_' + x + '_' + y);
        cell.setAttribute('style', 'top: ' + y * this.cellsize + 'px;' + 'left: ' + x * this.cellsize + 'px;');
        field.appendChild(cell);
      }
    }
    return;
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

  /** */
  _clickOnCell(e) {
    if (!e.target.classList.contains(this.cellStringName) ||
      e.target.classList.contains(this.cellFlagStringName)) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[1]);
    const y = parseInt(idArr[2]);
    Bus.emit('send_cell_coord', {xCell: x, yCell: y});
    return;
  }

  /** */
  _rightСlickOnCell(e) {
    if (!e.target.classList.contains(this.cellStringName) ||
      (!e.target.classList.contains(this.cellCloseStringName) &&
        !e.target.classList.contains(this.cellFlagStringName))) {
      return;
    }
    if (e.target.classList.contains(this.cellFlagStringName)) {
      e.target.classList.remove(this.cellFlagStringName);
      e.target.classList.add(this.cellCloseStringName);
      return;
    }
    e.target.classList.remove(this.cellCloseStringName);
    e.target.classList.add(this.cellFlagStringName);
    return;
  }

  /** */
  _openCels(arrCells) {
    for (let i = 0; i < arrCells.length; i++) {
      const x = arrCells[i][0];
      const y = arrCells[i][1];
      const cell = document.
          getElementById(this.cellStringName + '_' + x + '_' + y);
      if (!cell) {
        console.log('error _openCels cannot find ' +
          this.cellStringName + '_' + x + '_' + y);
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
        const cell = document.getElementById(this.cellStringName + '_' + x + '_' + y);
        if (!cell) {
          console.log('error _openAllCels cannot find ' + this.cellStringName + '_' + x + '_' + y);
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
