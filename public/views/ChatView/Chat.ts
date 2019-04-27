const signInTemplate = require('./Chat.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import { WebSocketInterface } from '../../utils/webSocket';
const ChatMessageTemplate = require('./ChatMessage.pug');
import Bus from '../../utils/bus';


/** */
export default class ChatView extends BaseView {
  _warnings: any;
  parent: any;
  _form: any;
  _submitButton: any;
  sendButton: any;
  inputMessageField: any;
  wsAdress: string;
  ws: WebSocketInterface;
  chatHistory: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, signInTemplate, false);
    this.wsAdress = 'ws://localhost:3001/ws';
  }

  render() {
    super.render();
    this.sendButton = document.querySelector('.chat__send_button');
    this.inputMessageField = document.querySelector('.chat__input');
    this.chatHistory = document.querySelector('.chat__history');
    this.sendButton.addEventListener('click', this._sendMessage.bind(this));
    this.ws = new WebSocketInterface(this.wsAdress);
    
  }

  _sendMessage() {
    const messageText = this.inputMessageField.value;
    const date = new Date();
    const timeString =  date.getHours().toString() + ':' + date.getMinutes().toString();

    console.log(User.avatar) 
    let message;
    
    if (User.name) {
      message = {photo : User.avatar, name : User.name, text : messageText, time : timeString};
    } else {
      message = {photo : './img/ava_guest.png', name : 'guest', text : messageText, time : timeString};
    }
    this.chatHistory.innerHTML += ChatMessageTemplate({ message : message });
    this.inputMessageField.value = '';
  }

  _sendMessageToServer(message : string) {
    this.ws.sendInfoJSON({message : message});
  }
}
