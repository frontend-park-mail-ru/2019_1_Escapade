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
  chatVisitors: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, signInTemplate, false);
    this.wsAdress = 'ws://localhost:3002/ws';
    this.chatVisitors = null;
  }

  render() {
    super.render();
    this.sendButton = document.querySelector('.chat__send_button');
    this.inputMessageField = document.querySelector('.chat__input');
    this.chatHistory = document.querySelector('.chat__history');
    this.sendButton.addEventListener('click', this._sendMessage.bind(this));
    Bus.on('getInfoFromWS', this._getInfo.bind(this));
    Bus.on('currentPath', this.currentPathSignalFunc.bind(this))
    this.ws = new WebSocketInterface(this.wsAdress);
    this.inputMessageField.addEventListener('onkeyup', this._onkeyupSignal.bind(this))
  }

  currentPathSignalFunc(path: string) {
    if (path === '/chat') {
      console.log('this.ws.connectWS')
      this.ws.closeConnection();
      this.ws.connectWS(this.wsAdress);
    } else {
      console.log('this.ws.closeConnection')
      this.ws.closeConnection();
    }
  }

  _onkeyupSignal() {
    console.log('helloooo');
  }

  /*
  _getMessageHistory(messageHistory) {
    messageHistory.allRooms.get.forEach((item : any, i : number) => {
      message = {photo : User.avatar, name : User.name, text : messageText, time : timeString};
      this.chatHistory.innerHTML += ChatMessageTemplate({ message : message });
    });
  }*/

  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 

    if (data.type === 'Message') {
      console.log('data.time ', data.time.substring(11,16) )
      const message = {photo : './img/ava_guest.png', name : data.user.name, text : data.message, time : data.time.substring(11,16)};
      this._addMessageToChatField(message);
    } else if (data.type === 'Lobby') {
      this._updateChatVisitors(data.waiting.get);
    }
    console.log('_getInfo end') 
  }



  _sendMessage() {
    const messageText = this.inputMessageField.value;
    const date = new Date();
    const timeString =  date.getHours().toString() + ':' + date.getMinutes().toString();

    console.log(User.avatar) 
    let message;
    
    /*
    if (User.name) {
      message = {photo : User.avatar, name : User.name, text : messageText, time : timeString};
    } else {
      message = {photo : './img/ava_guest.png', name : 'guest', text : messageText, time : timeString};
    }
    this._addMessageToChatField(message);*/
    this.ws.sendInfoJSON({message : messageText});
    this.inputMessageField.value = '';
  }

  _addMessageToChatField(messageStruct : any) {
    this.chatHistory.innerHTML += ChatMessageTemplate({ message : messageStruct });
  }

  _updateChatVisitors(chatVisitors : any) {
    this.chatVisitors = chatVisitors;
    console.log('_updateNumberOfChatVisitors ' + chatVisitors.length)
  }

}
