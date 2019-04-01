import singlePlayerTemplate from './SinglePlayer.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';


/** */
export class SinglePlayerView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, singlePlayerTemplate);
    this.cellsize = 25;
    this.cellNumbersX = 20;
    this.cellNumbersY = 20;
    this.bombsCount = 10;
    this.cellCloseStringName = 'cell_close';
    this.cellOpenStringName = 'cell_open';
    this.cellStringName = 'cell';
    this.cellFlagStringName = 'cell_flag';
    this.mapStringName = 'single_player__map';
    this.pointsFieldStringName = 'single_player__points';
    
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
    const pointsField = document.getElementById(this.pointsFieldStringName);
    if (!pointsField) {
      console.log('error pointsField cannot find ' + this.pointsFieldStringName);
    }
    pointsField.textContent = '0';
    this.map = this._createMap(this.cellNumbersX, this.cellNumbersY, this.bombsCount);
    this._showMap(this.cellNumbersX, this.cellNumbersY);
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
        cell.setAttribute('id', this.cellStringName + '_' + x + '_' +y);
        cell.setAttribute('style', 'top: ' + y * this.cellsize + 'px;' + 'left: ' + x * this.cellsize + 'px;');
        field.appendChild(cell);
      }
    }
    return;
  }

  /** */
  _clickOnCell(e) {
    if (!e.target.classList.contains(this.cellStringName) || e.target.classList.contains(this.cellFlagStringName)) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = parseInt(idArr[1]);
    const y = parseInt(idArr[2]);
    let points;
    if (this.map[x][y] == 9) {
      this._openAllCels(x, y, this.cellNumbersX, this.cellNumbersY);
      alert('You lose!');
    } else {
      points = this._openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    }
    const pointsField = document.getElementById(this.pointsFieldStringName);
    if (!pointsField) {
      console.log('error pointsField cannot find ' + this.pointsFieldStringName);
    }
    // eslint-disable-next-line max-len
    pointsField.textContent = (parseInt(pointsField.textContent) + points[0]).toString();
    if (points[1] == this.cellNumbersX * this.cellNumbersY - this.bombsCount) {
      this._openAllCels(x, y, this.cellNumbersX, this.cellNumbersY);
      alert('You win!');
    }
    return;
  }

  /** */
  _rightСlickOnCell(e) {
    if (!e.target.classList.contains(this.cellStringName) || (!e.target.classList.contains(this.cellCloseStringName) &&
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
  _openCels(x, y, xLen, yLen) {
    if (x < 0 || x >= xLen || y < 0 || y >= yLen) {
      return [0, 0];
    }
    const cell = document.getElementById(this.cellStringName+ '_' + x + '_' +y);
    if (!cell) {
      console.log('error _openCels cannot find ' + this.cellStringName + '_' + x + '_' +y);
    }
    if (!cell.classList.contains(this.cellCloseStringName)) {
      return [0, 0];
    }
    cell.classList.remove(this.cellCloseStringName);
    cell.textContent = this.map[x][y].toString();
    cell.classList.add(this.cellOpenStringName + this.map[x][y].toString());
    const pointsAndNumOpenCells = [0, 0];
    let res;
    if ( this.map[x][y] == 0 ) {
      res = this._openCels(x - 1, y - 1, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x - 1, y + 1, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x - 1, y, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x, y - 1, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x, y + 1, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x + 1, y - 1, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x + 1, y + 1, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
      res = this._openCels(x + 1, y, xLen, yLen);
      pointsAndNumOpenCells[0] += res[0]; pointsAndNumOpenCells[1] += res[1];
    } else {
      if (this.map[x][y] < 9) {
        pointsAndNumOpenCells[0] += this.map[x][y];
      }
    }
    pointsAndNumOpenCells[1] += 1;
    return pointsAndNumOpenCells;
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
          cell.textContent = this.map[x][y].toString();
          cell.classList.add(this.cellOpenStringName + this.map[x][y].toString());
        }
        if (cell.classList.contains(this.cellFlagStringName)) {
          cell.classList.remove(this.cellFlagStringName);
          cell.textContent = this.map[x][y].toString();
          cell.classList.add(this.cellOpenStringName + this.map[x][y].toString());
        }
      }
    }
    return;
  }

  /** */
  _createMap(xLen, yLen, bombNumber) {
    const map = new Array(yLen);

    for (let i = 0; i < yLen; i++) {
      map[i] = new Array(xLen).fill(0);
    }

    for (let i = 0; i < bombNumber; i++) {
      let xBomb = 0;
      let yBomb = 0;
      do {
        xBomb = this._randomInteger(0, xLen - 1);
        yBomb = this._randomInteger(0, yLen - 1);
      } while (map[xBomb][yBomb] == 9);
      map[xBomb][yBomb] = 9;
      this._fillCellsAroundBomb(map, xBomb, yBomb, xLen, yLen);
    }
    return map;
  }

  /** */
  _fillCellsAroundBomb(map, xBomb, yBomb, xLen, yLen) {
    if (xBomb - 1 >= 0 && yBomb - 1 >= 0 && map[xBomb - 1][yBomb - 1] < 9) {
      map[xBomb - 1][yBomb - 1] += 1;
    }
    if (xBomb - 1 >= 0 && yBomb >= 0 && map[xBomb - 1][yBomb] < 9) {
      map[xBomb - 1][yBomb] += 1;
    }
    if (xBomb - 1 >= 0 && yBomb + 1 < yLen && map[xBomb - 1][yBomb + 1] < 9) {
      map[xBomb - 1][yBomb + 1] += 1;
    }
    if (xBomb >= 0 && yBomb - 1 >= 0 && map[xBomb][yBomb - 1] < 9) {
      map[xBomb][yBomb - 1] += 1;
    }
    if (xBomb >= 0 && yBomb + 1 < yLen && map[xBomb][yBomb + 1] < 9) {
      map[xBomb][yBomb + 1] += 1;
    }
    if (xBomb + 1 < xLen && yBomb - 1 >= 0 && map[xBomb + 1][yBomb - 1] < 9) {
      map[xBomb + 1][yBomb - 1] += 1;
    }
    if (xBomb + 1 < xLen && yBomb >= 0 && map[xBomb + 1][yBomb] < 9) {
      map[xBomb + 1][yBomb] += 1;
    }
    if (xBomb + 1 < xLen && yBomb + 1 < yLen && map[xBomb + 1][yBomb + 1] < 9) {
      map[xBomb + 1][yBomb + 1] += 1;
    }
    return;
  }

  /** */
  _randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
}
