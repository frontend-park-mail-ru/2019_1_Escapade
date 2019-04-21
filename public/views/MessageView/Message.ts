/* eslint-disable require-jsdoc */
import Bus from '../../utils/bus';
import { throwStatement } from 'babel-types';
/** */
export default class MessageView {
  resetParameters(arg0: number) {
    throw new Error("Method not implemented.");
  }

  messageBoxDocElement: any;
  messageBoxMessageDocElement: any;

  constructor() {
    this.messageBoxDocElement = document.querySelector('.single_player__popup');
    this.messageBoxMessageDocElement = document.querySelector('.single_player__popup_text');

    Bus.on('messageBoxHide', this._hideMessage.bind(this));
    Bus.on('showTextInMessageBox', this._showTextMessage.bind(this));
}

  /** */
  _hideMessage(hide : any) {
    console.log(hide);
    this.messageBoxDocElement.hidden = hide;
  }

  _showTextMessage(text : string) {
    this.messageBoxMessageDocElement.innerHTML = text;
    this._hideMessage(false);
  }
}