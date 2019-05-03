/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class ButtonsGameView {
  restartDocElement: any;
  quitDocElement: any;

  constructor() {
    Bus.on('addListenersButtonsGame', this._addListeners.bind(this), 'buttonsView');
  }

  _addListeners() {
    this.restartDocElement = document.querySelector('.game__restart_button');
    this.restartDocElement.addEventListener('click', this._restartClick.bind(this));
    this.quitDocElement = document.querySelector('.game__quit_button');
    this.quitDocElement.addEventListener('click', this._quitClick.bind(this));
    Bus.on('changeTitleRestartButton', this._changeTitleRestartButton.bind(this), 'buttonsView');
  }
  _quitClick() {
    Bus.emit('quitClick');
  }
  /** */
  _restartClick() {
    Bus.emit('restartClick');
  }
  _changeTitleRestartButton(title : string) {
    this.restartDocElement.innerHTML = title;
  }
}