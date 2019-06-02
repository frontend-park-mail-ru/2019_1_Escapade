import Bus from '../../utils/bus';
const Template = require('./MessageAsk.pug');
/** */
export default class MessageAskView {
  timerHTMLElement: any;
  container: any;
  parent: any;
  resetParameters(arg0: number) {
    throw new Error("Method not implemented.");
  }

  messageBoxDocElement: any;
  messageBoxMessageDocElement: any;

  constructor() {
    Bus.on('addAskMessage', this._addListeners.bind(this), 'messageAskView');
  }

  _addListeners(data : any) {
    this.container = data.container;
    this.parent = data.parent;
    this.timerHTMLElement = this.parent.querySelector(this.container);
    this.timerHTMLElement.innerHTML = Template();
    this.messageBoxDocElement = this.parent.querySelector('.messagebox__popup_ask');
    this.messageBoxMessageDocElement = this.parent.querySelector('.messagebox__popup_text_ask');
    Bus.on('messageAskBoxHide', this._hideTextMessage.bind(this), 'messageView');
    Bus.on('showTextInMessageAskBox', this._showTextMessage.bind(this), 'messageView');
    this.parent.addEventListener('click', this._clickOnMessageButton.bind(this));

  }

  _clickOnMessageButton(e: any) {
    if (e.target.classList.contains('messagebox__popup_ok_button_yes')) {
      Bus.emit('clickOnYesAskMessage');
      this._hideTextMessage(true);
    }
    if (e.target.classList.contains('messagebox__popup_ok_button_no')) {
      this._hideTextMessage(true);
    }
  }

  /** */
  _hideTextMessage(hide : any) {
    console.log('_hideTextMessage');
    this.messageBoxDocElement.hidden = hide;
  }

  _showTextMessage(text : string) {
    this.messageBoxMessageDocElement.innerHTML = text;
    this._hideTextMessage(false);
  }
}