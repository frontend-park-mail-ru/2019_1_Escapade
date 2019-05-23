/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
const MessageTemplate = require('./GameActionsMessage.pug');
const Template = require('./GameActions.pug');
/** */
export default class GameActionsView {
  countMessage: number;
  gameActionsField: any;
  constructor() {
    Bus.on('addGameActions', this._addListeners.bind(this), 'playerListView');
    this.countMessage = 0;
  }

  _addListeners(htmlElementTitle : string) {
    const HTMLElement = document.querySelector(htmlElementTitle);
    HTMLElement.innerHTML = Template();
    this.gameActionsField = document.querySelector('.game__game_actions');
    Bus.on('addMessageInGameActions', this._addMessage.bind(this), 'gameActions')
    Bus.on('ClearMessagesGameActions', this._clearAllMessages.bind(this), 'gameActions')
    this._clearParameters();
  }

  _clearParameters() {
    this.countMessage = 0;
  }

  _addMessage(message : string) {
    var now = new Date();
    const hours = ((now.getHours() >= 0 && now.getHours() < 10) ? '0' + now.getHours() : now.getHours()).toString()
    const minutes = ((now.getMinutes() >= 0 && now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes()).toString()
    const seconds = ((now.getSeconds() >= 0 && now.getSeconds() < 10) ? '0' + now.getSeconds() : now.getSeconds()).toString()

    const time = `${hours}:${minutes}:${seconds}`
    const numberMessage = `#${++this.countMessage}`
    this.gameActionsField.innerHTML += MessageTemplate({number : numberMessage, message : message, time : time})
    this.gameActionsField.scrollTop = this.gameActionsField.scrollHeight;
  }

  _clearAllMessages() {
    this.gameActionsField.innerHTML = ''
    this._clearParameters()
  }

}