import Bus from '../../utils/bus';
const Template = require('./Message.pug');
/** */
export default class MessageView {
  timerHTMLElement: any;
  resetParameters(arg0: number) {
    throw new Error("Method not implemented.");
  }

  messageBoxDocElement: any;
  messageBoxMessageDocElement: any;

  constructor() {
    Bus.on('addMessage', this._addListeners.bind(this), 'messageView');
  }

  _addListeners(htmlElementTitle : string) {
    this.timerHTMLElement = document.querySelector(htmlElementTitle);
    this.timerHTMLElement.innerHTML = Template();
    this.messageBoxDocElement = document.querySelector('.messagebox__popup');
    this.messageBoxMessageDocElement = document.querySelector('.messagebox__popup_text');
    Bus.on('messageBoxHide', this._hideTextMessage.bind(this), 'messageView');
    Bus.on('showTextInMessageBox', this._showTextMessage.bind(this), 'messageView');
    document.addEventListener('click', this._clickOnMessageButton.bind(this));
  }

  _clickOnMessageButton(e: any) {
    if (e.target.classList.contains('messagebox__popup_ok_button')) {
      this._hideTextMessage(true);
    }
  }

  /** */
  _hideTextMessage(hide : any) {
    this.messageBoxDocElement.hidden = hide;
  }

  _showTextMessage(text : string) {
    this.messageBoxMessageDocElement.innerHTML = text;
    this._hideTextMessage(false);
  }
}