/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class FieldView {
  field: any;
  width: number;
  height: number;
  cellSize: any;
  percentOpenDocElement: any;
  loadbarDocElement: any;
  prcentOpen: number;
  constructor(cellSize : number) {
    this.width = 0;
    this.height = 0;
    this.cellSize = cellSize;
    Bus.on('renderField', this._render.bind(this));
    Bus.on('openCell', this._openCell.bind(this));
    Bus.on('setUnsetFlagOnCell', this._setUnsetFlagOnCell.bind(this));
    Bus.on('progressGameChange', this._progressGameChange.bind(this));
    document.addEventListener('click', this._leftClickOnBody.bind(this));
    document.addEventListener('contextmenu', this._rightСlickOnCell.bind(this));
  }

  _leftClickOnBody(e: any) {
    if (e.target.classList.contains('cell')) {
      let [, x, y] = e.target.id.split('_');
      Bus.emit('leftClickOnCell', {x : x, y : y});
    }
  }

  _rightСlickOnCell(e: any) {
    if (e.target.classList.contains('cell')) {
      if (e.target.classList.length < 3) {
        console.log('error e.target.classList.length < 3');
        return;
      }
      let [, x, y] = e.target.id.split('_');
      Bus.emit('rightClickOnCell', {x : x, y : y});
    }
  }
  _render(fieldSize : any) {
    this.width = fieldSize.width;
    this.height = fieldSize.height;
    this.field = document.querySelector('.game__field__map');
    this.field.innerHTML = '';
    this.field.setAttribute('class', 'game__field__map');
    this.field.setAttribute('style', `width: ${this.width * this.cellSize}px; height: ${this.height * this.cellSize}px;`);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('div');
        const strClassClose = `cell_close_${this._randomInteger(1, 3)}`;
        cell.setAttribute('class', `cell cell_close ${strClassClose}`);
        cell.setAttribute('id', `cell_${x}_${y}`);
        cell.setAttribute('style', `top: ${y * this.cellSize}px; left: ${x * this.cellSize}px;
          width: ${this.cellSize}px; height: ${this.cellSize}px;`);
        this.field.appendChild(cell);
      }
    }

    this.percentOpenDocElement = document.querySelector('.game__field__percent');
    this.loadbarDocElement = document.querySelector('.game__field__loadbar');
    this.percentOpenDocElement.innerHTML = `0%`;
    this.loadbarDocElement.style.width = '0px';
  }

  _openCell({x = 0, y = 0, type = 0 }){
    const cell = document.
      getElementById(`cell_${x}_${y}`);
    if (!cell) {
      console.log('error _openCels cannot find ' +
        `cell${x}_${y}`);
      return;
    }
    cell.className = `cell cell_open cell_open${type}`;
  }

  _setUnsetFlagOnCell({x = 0, y = 0, type = '' }){
    const cell = document.
      getElementById(`cell_${x}_${y}`);
    if (!cell) {
      console.log('error _openCels cannot find ' +
        `cell${x}_${y}`);
      return;
    }
    const classElems = cell.classList[2].split('_');
    const numClassElem = parseInt(classElems[2]);
    if (type === 'flag') {
      cell.className = `cell cell_flag cell_flag_${numClassElem}`;
    } else {
      cell.className = `cell cell_close cell_close_${numClassElem}`;
    }    
  }

  _progressGameChange(percent : number) {
    console.log(percent);
    this.percentOpenDocElement.innerHTML = `${percent}%`;
    this.loadbarDocElement.style.width = `${(percent / 100) * (this.cellSize * this.width - 55)}px`;
  }

  _randomInteger(min: number, max: number) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
  
}