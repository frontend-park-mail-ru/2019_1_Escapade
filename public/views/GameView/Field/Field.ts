/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
import MathGame from '../../../utils/math';
const Template = require('./Field.pug');
/** */
export default class FieldView {
  field: any;
  width: number;
  height: number;
  cellSize: any;
  percentOpenDocElement: any;
  loadbarDocElement: any;
  prcentOpen: number;
  percent: number;
  mapElement: any;
  HTMLElement: any;
  container: any;
  parent: any;

  constructor() {
    this.width = 0;
    this.height = 0;
    Bus.on('addField', this._addListeners.bind(this), 'fieldView');
    Bus.on('removeField', this._removeListeners.bind(this), 'fieldView');
  }

  _addListeners(data : any) {
    this.container = data.container;
    this.parent = data.parent;
    this.HTMLElement = this.parent.querySelector(this.container);
    this.HTMLElement.innerHTML = Template();
    this._removeListeners();
    Bus.on('renderField', this._render.bind(this), 'fieldView');
    Bus.on('openCell', this._openCell.bind(this), 'fieldView');
    Bus.on('setUnsetFlagOnCell', this._setUnsetFlagOnCell.bind(this), 'fieldView');
    Bus.on('setUnsetFlagMultiOnCell', this._setUnsetFlagMultiOnCell.bind(this), 'fieldView');
    Bus.on('progressGameChange', this._progressGameChange.bind(this), 'fieldView');
    this.parent.removeEventListener('click', this._leftClickOnBody);
    this.parent.removeEventListener('contextmenu', this._rightСlickOnCell);
    this.parent.addEventListener('click', this._leftClickOnBody);
    this.parent.addEventListener('contextmenu', this._rightСlickOnCell);
    this.percent = 0;
  }


  _removeListeners() {
    Bus.off('renderField', this._render.bind(this), 'fieldView');
    Bus.off('openCell', this._openCell.bind(this), 'fieldView');
    Bus.off('setUnsetFlagOnCell', this._setUnsetFlagOnCell.bind(this), 'fieldView');
    Bus.off('setUnsetFlagMultiOnCell', this._setUnsetFlagMultiOnCell.bind(this), 'fieldView');
    Bus.off('progressGameChange', this._progressGameChange.bind(this), 'fieldView');
    this.parent.removeEventListener('click', this._leftClickOnBody);
    this.parent.removeEventListener('contextmenu', this._rightСlickOnCell);
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
        return;
      }
      let [, x, y] = e.target.id.split('_');
      Bus.emit('rightClickOnCell', {x : x, y : y});
    }
  }
  _render(fieldSize : any) {
    this.percent = 0;
    this.width = fieldSize.width;
    this.height = fieldSize.height;
    this.cellSize = fieldSize.cellSize;
    this.field = this.parent.querySelector('.game__field__map');
    this.field.innerHTML = '';
    this.field.setAttribute('class', 'game__field__map');
    this.field.setAttribute('style', `width: ${this.width * this.cellSize}px; height: ${this.height * this.cellSize}px;`);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('div');
        const strClassClose = `cell_close_${MathGame.randomInteger(1, 3)}`;
        cell.setAttribute('class', `cell cell_close ${strClassClose}`);
        cell.setAttribute('id', `cell_${x}_${y}`);
        cell.setAttribute('style', `top: ${y * this.cellSize}px; left: ${x * this.cellSize}px;
          width: ${this.cellSize}px; height: ${this.cellSize}px;`);
        this.field.appendChild(cell);
      }
    }

    this.percentOpenDocElement = this.parent.querySelector('.game__field__percent');
    this.loadbarDocElement = this.parent.querySelector('.game__field__loadbar');
    this.percentOpenDocElement.innerHTML = `0%`;
    this.loadbarDocElement.style.width = '0px';

  }

  _openCell({x = 0, y = 0, type = 0, color = '#b9c0c9', my = false}){
    const cell = this.parent.
      querySelector(`#cell_${x}_${y}`);
    if (!cell) {
      return;
    }
    if (type > 13) {
      if (my) {
        cell.className = `cell cell_open cell_open10`;
      } else {
        cell.className = `cell cell_open cell_open11`;
      }
    } else {
      cell.className = `cell cell_open cell_open${type}`;
    }
    cell.style.backgroundColor = color;
  }

  _setUnsetFlagOnCell({x = 0, y = 0, type = 'flag' }){
    const cell = this.parent.
      querySelector(`#cell_${x}_${y}`);
    if (!cell) {
      return;
    }
    const classElems = cell.classList[2].split('_');
    const numClassElem = parseInt(classElems[2]);
    if (type === 'flag') {
      cell.className = `cell cell_flag cell_flag_${numClassElem}`;
    } else if (type === 'closing') {
      cell.className = `cell cell_close cell_close_${numClassElem}`;
    }    
  }

  _setUnsetFlagMultiOnCell({x = 0, y = 0, type = 'flag' }){
    const cell = this.parent.
      querySelector(`#cell_${x}_${y}`);
    if (!cell) {
      return;
    }
    const classElems = cell.classList[2].split('_');
    const numClassElem = parseInt(classElems[2]);
    if (type === 'flag') {
      cell.className = `cell cell_flag cell_flagmulti_${numClassElem}`;
    } else if (type === 'closing') {
      cell.className = `cell cell_close cell_close_${numClassElem}`;
    }    
  }

  _progressGameChange(percent : number) {
    if (this.percent > percent || percent > 100) {
      return;
    }
    this.percent = percent;
    this.percentOpenDocElement.innerHTML = `${percent}%`;
    this.mapElement = this.parent.querySelector('.game__field__map');
    this.loadbarDocElement.style.width = `${(percent / 100) * (this.mapElement.offsetWidth - 58)}px`;
  }  
}