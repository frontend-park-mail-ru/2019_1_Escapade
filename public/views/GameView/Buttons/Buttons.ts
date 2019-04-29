/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class ButtonsGameView {
  restartDocElement: any;

  constructor() {
    Bus.on('addListenersButtonsGame', this._addListeners.bind(this));
  }

  _addListeners() {
    this.restartDocElement = document.querySelector('.game__restart_button');
    this.restartDocElement.addEventListener('click', this._restartClick.bind(this));
    Bus.on('changeTitleRestartButton', this._changeTitleRestartButton.bind(this));
  }
  /** */
  _restartClick() {
    Bus.emit('restartClick');
  }
  _changeTitleRestartButton(title : string) {
    this.restartDocElement.innerHTML = title;
  }
}