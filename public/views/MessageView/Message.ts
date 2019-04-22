import Bus from '../../utils/bus';
/** */
export default class MessageView {
  resetParameters(arg0: number) {
    throw new Error("Method not implemented.");
  }

  messageBoxDocElement: any;
  messageBoxMessageDocElement: any;

  constructor() {
    Bus.on('addListenersMessage', this._addListeners.bind(this));
  }

  _addListeners() {
    this.messageBoxDocElement = document.querySelector('.messagebox__popup');
    this.messageBoxMessageDocElement = document.querySelector('.messagebox__popup_text');
    Bus.on('messageBoxHide', this._hideMessage.bind(this));
    Bus.on('showTextInMessageBox', this._showTextMessage.bind(this));
    document.addEventListener('click', this._clickOnMessageButton.bind(this));
  }

  _clickOnMessageButton(e: any) {
    if (e.target.classList.contains('messagebox__popup_ok_button')) {
      this._hideMessage(true);
    }
  }

  /** */
  _hideMessage(hide : any) {
    this.messageBoxDocElement.hidden = hide;
  }

  _showTextMessage(text : string) {
    this.messageBoxMessageDocElement.innerHTML = text;
    this._hideMessage(false);
  }
}