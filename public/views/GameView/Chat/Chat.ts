/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
import { User } from '../../../utils/user';
const MessageTemplate = require('./ChatMessage.pug');
const MyMessageTemplate = require('./MyChatMessage.pug');
const Template = require('./Chat.pug');
/** */
export default class ChatView {
  countMessage: number;
  gameActionsField: any;
  counterOnlineField: any;
  sendButton: any;
  inputMessageField: any;
  chatHistory: any;
  currentPathSignalFunc: any;
  myMessage: boolean;
  chatVisitors: any;
  idPlayerBackend: any;
  constructor() {
    Bus.on('addChat', this._addListeners.bind(this), 'chatView');
    this.countMessage = 0;
    this.idPlayerBackend = -1;
  }

  _addListeners(data : any) {
    let container = data.container;
    let place = data.place;
    let parent = data.parent;
    const HTMLElement = parent.querySelector(container);
    HTMLElement.innerHTML = Template();
    this.sendButton = parent.querySelector('.chat__send_button');
    this.inputMessageField = parent.querySelector('.chat__input');
    this.chatHistory = parent.querySelector('.chat__history');
    this.counterOnlineField = parent.querySelector('.chat__online');

    this.sendButton.addEventListener('click', this._sendMessage.bind(this));
    Bus.on('getChatMessage', this._getMessage.bind(this), 'chat');
    Bus.on('addMessageInChatHistory', this._getMessageHistory.bind(this), 'chat');
    
    this.inputMessageField.onkeydown = this._onkeydownSignal.bind(this)
    this.chatHistory.scrollTop = 9999;
    this._clearParameters();
  }

  _clearParameters() {
    this.countMessage = 0;
  }

  _onkeydownSignal(e : any) {
    if (e.keyCode === 13) {
      this._sendMessage();
    }
  }
  _getMessage(data : any) {
    const message = {photo : data.user.photo,  id : data.user.id, name : data.user.name, text : data.text, time : data.time.substring(11,16)};
    this._addMessageToChatField(message);
    this.myMessage = false;
  }

  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 


    if (data.type === 'Lobby') {
      this._updateChatVisitors(data.value.lobby.waiting.get);
    } else if (data.type === 'Messages') {
      this._getMessageHistory(data.messages)
    }
    console.log('_getInfo end') 
  }

  _getMessageHistory(data : any) {
    this.chatHistory.innerHTML = ''; 
    let messageHistory = data.lobby.messages;
    this.idPlayerBackend = data.you.id;
    console.log(this.idPlayerBackend, " hghg  ", data.you.id)

    messageHistory.forEach((item : any) => {
      const message = {photo : item.user.photo, id : item.user.id, name : item.user.name, text : item.text, time : item.time.substring(11,16)};
      this._addMessageToChatField(message);
    });
  }



  _sendMessage() {
    const messageText = this.inputMessageField.value;
    if (messageText == '') {
      return;
    }
    Bus.emit('sendChatMessage', messageText)
    
    this.myMessage = true;
    this.inputMessageField.value = '';
  }

  _addMessageToChatField(messageStruct : any) {
    console.log(this.idPlayerBackend, " ", messageStruct.id)
    if (messageStruct.id != this.idPlayerBackend) {
      this.chatHistory.innerHTML += MessageTemplate({ message : messageStruct });
    } else {
      this.chatHistory.innerHTML += MyMessageTemplate({ message : messageStruct });
    }
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    
  }

  _updateChatVisitors(chatVisitors : any) {
    this.chatVisitors = chatVisitors;
    this.counterOnlineField.innerHTML = `Now Online: ${this.chatVisitors.length}`;
  }

}
