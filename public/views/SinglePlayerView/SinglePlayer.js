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
    this.map = this._createMap(this.cellNumbersX, this.cellNumbersY, 380);
  }

  /**
   * 
  */
  render() {
    this.data = User;
    super.render();

    this._showMap(this.cellNumbersX, this.cellNumbersY);
    document.addEventListener('click', this._clickOnCell.bind(this));
    document.addEventListener('contextmenu', this._rightСlickOnCell.bind(this));
    
    /* for (let y = 0; y < this.cellNumbersY; y++) {
      let str = '';
      for (let x = 0; x < this.cellNumbersX; x++) {
        str += this.map[x][y].toString();
      }
      console.log(str + '\n');
    } */
  }
  /** */
  _showMap(XLen, YLen) {
    const field = document.getElementById('map');
    field.setAttribute('class', 'map');
    field.setAttribute('style', 'width: ' + this.cellNumbersX * this.cellsize + 'px; ' + 'height: ' + this.cellNumbersY * this.cellsize + 'px;');
    for (let y = 0; y < YLen; y++) {
      for (let x = 0; x < XLen; x++) {
        const cell = document.createElement('div');
        cell.setAttribute('class', 'cell cell_close');
        cell.setAttribute('id', 'cell'+ '_' + x + '_' +y);
        cell.setAttribute('style', 'top: ' + y * this.cellsize + 'px;' + 'left: ' + x * this.cellsize + 'px;');
        field.appendChild(cell);
      }
    }
    return;
  }

  /** */
  _clickOnCell(e) {
    if (!e.target.classList.contains('cell')) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = idArr[1];
    const y = idArr[2];
    if (this.map[x][y] == 9) {
      this._openAllCels(x, y, this.cellNumbersX, this.cellNumbersY);
      alert('You lose!');
    } else {
      this._openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    }
    return;
  }

  /** */
  _rightСlickOnCell(e) {
    if (!e.target.classList.contains('cell')) {
      return;
    }
    const idArr = e.target.id.split('_');
    const x = idArr[1];
    const y = idArr[2];
    if (this.map[x][y] == 9) {
      this._openAllCels(x, y, this.cellNumbersX, this.cellNumbersY);
      alert('You lose!');
    } else {
      this._openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    }
    return;
  }


  
  /** */
  _openCels(x, y, xLen, yLen) {
    if (x < 0 || x >= xLen || y < 0 || y >= yLen) {
      return;
    }
    const cell = document.getElementById('cell'+ '_' + x + '_' +y);
    if (!cell.classList.contains('cell_close')) {
      return;
    }
    cell.classList.remove('cell_close');
    cell.textContent = this.map[x][y].toString();
    cell.classList.add('cell_open' + this.map[x][y].toString());
    if ( this.map[x][y] == 0 ) {
      this._openCels(x - 1, y - 1, xLen, yLen);
      this._openCels(x - 1, y + 1, xLen, yLen);
      this._openCels(x - 1, y, xLen, yLen);
      this._openCels(x, y - 1, xLen, yLen);
      this._openCels(x, y + 1, xLen, yLen);
      this._openCels(x + 1, y - 1, xLen, yLen);
      this._openCels(x + 1, y + 1, xLen, yLen);
      this._openCels(x + 1, y, xLen, yLen);
    }
    return;
  }

  /** */
  _openAllCels() {
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        const cell = document.getElementById('cell'+ '_' + x + '_' +y);
        if (cell.classList.contains('cell_close')) {
          cell.classList.remove('cell_close');
          cell.textContent = this.map[x][y].toString();
          cell.classList.add('cell_open' + this.map[x][y].toString());
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
