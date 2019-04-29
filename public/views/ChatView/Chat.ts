const signInTemplate = require('./Chat.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import { WebSocketInterface } from '../../utils/webSocket';
const ChatMessageTemplate = require('./ChatMessage.pug');
const MyChatMessageTemplate = require('./MyChatMessage.pug');
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
  counterOnlineField: any;
  myMessage: boolean;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, signInTemplate, false);
    //this.wsAdress = 'ws://escapade-chat.herokuapp.com/ws';
    this.wsAdress = 'ws://localhost:3002/ws';
    this.chatVisitors = null;
    this.myMessage = false;
  }

  render() {
    super.render();
    this.sendButton = document.querySelector('.chat__send_button');
    this.inputMessageField = document.querySelector('.chat__input');
    this.chatHistory = document.querySelector('.chat__history');
    this.counterOnlineField = document.querySelector('.chat__online');

    this.sendButton.addEventListener('click', this._sendMessage.bind(this));
    Bus.on('getInfoFromWS', this._getInfo.bind(this));
    Bus.on('currentPath', this.currentPathSignalFunc.bind(this))
    this.ws = new WebSocketInterface(this.wsAdress);
    this.inputMessageField.onkeydown = this._onkeydownSignal.bind(this)
    
  }

  currentPathSignalFunc(path: string) {
    console.log('path ' + path)
    if (path === '/chat' || path === '/') {
      console.log('this.ws.connectWS')
      this.ws.closeConnection();
      this.ws.connectWS(this.wsAdress);
      this.chatHistory.scrollTop = 9999;

    } else {
      console.log('this.ws.closeConnection')
      this.ws.closeConnection();
    }
  }

  _onkeydownSignal(e : any) {
    if (e.keyCode === 13) {
      this._sendMessage();
    }
  }
  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 

    if (data.type === 'Message') {
      console.log('data.time ', data.time.substring(11,16) )
      const message = {photo : './img/ava_guest.png', name : data.user.name, text : data.message, time : data.time.substring(11,16)};
      this._addMessageToChatField(message);
      this.myMessage = false;
    } else if (data.type === 'Lobby') {
      this._updateChatVisitors(data.waiting.get);
    } else if (data.type === 'Messages') {
      this._getMessageHistory(data.messages)
    }
    console.log('_getInfo end') 
  }

  _getMessageHistory(messageHistory : any) {
    messageHistory.forEach((item : any, i : number) => {
      const message = {photo : './img/ava_guest.png', name : item.user.name, text : item.message, time : item.time.substring(11,16)};
      this._addMessageToChatField(message);
    });
  }



  _sendMessage() {
    const messageText = this.inputMessageField.value;
    if (messageText == '') {
      return;
    }
    const date = new Date();
    const timeString =  date.getHours().toString() + ':' + date.getMinutes().toString();
    this.ws.sendInfoJSON({message : messageText});
    this.myMessage = true;
    this.inputMessageField.value = '';
  }

  _addMessageToChatField(messageStruct : any) {

    if (messageStruct.name != User.name) {
      this.chatHistory.innerHTML += ChatMessageTemplate({ message : messageStruct });
    } else {
      this.chatHistory.innerHTML += MyChatMessageTemplate({ message : messageStruct });
    }
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    
  }

  _updateChatVisitors(chatVisitors : any) {
    this.chatVisitors = chatVisitors;
    this.counterOnlineField.innerHTML = `Now Online: ${this.chatVisitors.length}`;
  }

}
