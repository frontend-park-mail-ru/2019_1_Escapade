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
  sendButton: any;
  inputMessageField: any;
  chatHistory: any;
  currentPathSignalFunc: any;
  myMessage: boolean;
  chatVisitors: any;
  idPlayerBackend: any;
  allMessages: any[];
  myMessages: any[];
  editButtonSend: any;
  editMessId: any;
  clickOnMessageButtonsBindThis: any;
  sendEditMessageBindThis: any;
  sendMessageBindThis: any;
  parent: any;
  chatPlayerVisitors: any;
  constructor() {
    Bus.on('addChat', this._addListeners.bind(this), 'chatView');
    this.countMessage = 0;
    this.idPlayerBackend = -1;
    this.allMessages = [];
    this.myMessages = [];
    this.clickOnMessageButtonsBindThis = this._clickOnMessageButtons.bind(this);
    this.sendEditMessageBindThis = this._sendEditMessage.bind(this);
    this.sendMessageBindThis = this._sendMessage.bind(this);
  }


  _addListeners(data: any) {
    this._clearParameters();
    let container = data.container;
    let place = data.place;
    this.parent = data.parent;

    const HTMLElement = this.parent.querySelector(container);
    HTMLElement.innerHTML = Template();
    this.sendButton = this.parent.querySelector('.chat__send_button');
    this.inputMessageField = this.parent.querySelector('.chat__input');
    this.chatHistory = this.parent.querySelector('.chat__history');
    //this.counterOnlineField = this.parent.querySelector('.chat__online');
    this.editButtonSend = this.parent.querySelector('.chat__edit_button_send');
    this.editButtonSend.style.display = 'none';

    this.editButtonSend.removeEventListener('click', this.sendEditMessageBindThis);
    this.sendButton.removeEventListener('click', this.sendMessageBindThis);
    this.editButtonSend.addEventListener('click', this.sendEditMessageBindThis);
    this.sendButton.addEventListener('click', this.sendMessageBindThis);


    Bus.on('getChatMessage', this._getMessage.bind(this), 'chat');
    Bus.on('addMessageInChatHistory', this._getMessageHistory.bind(this), 'chat');
    // Bus.on('addWaiterInChat', this._addWaiterInChat.bind(this), 'chat');
    // Bus.on('delWaiterInChat', this._delWaiterInChat.bind(this), 'chat');
    // Bus.on('addPlayerInChat', this._addPlayerInChat.bind(this), 'chat');
    // Bus.on('delPlayerInChat', this._delPlayerInChat.bind(this), 'chat');
    this.inputMessageField.onkeydown = this._onkeydownSignal.bind(this)
    this.chatHistory.scrollTop = 9999;


    this.parent.removeEventListener('click', this.clickOnMessageButtonsBindThis);
    this.parent.addEventListener('click', this.clickOnMessageButtonsBindThis);
    // if (place === 'multiplayer') {
    //   this.counterOnlineField.parentNode.removeChild(this.counterOnlineField);
    // }
  }

  _clickOnMessageButtons(e: any) {
    let target = e.target;
    while (!target.classList.contains('chat__edit_button') && !target.classList.contains('chat__remove_button')) {
      target = target.parentNode;
      if (!target.classList) {
        return;
      }
    }

    if (target.classList.contains('chat__edit_button')) {
      const elements = [].slice.call((this.parent.querySelectorAll('.chat__edit_button')));
      const num = elements.indexOf(target);
      if (num < 0 || num >= this.myMessages.length) {
        return;
      }
      this.editMessId = this.myMessages[num].messID;
      this._editMessageClick(this.myMessages[num]);
    } else if (target.classList.contains('chat__remove_button')) {
      const elements = [].slice.call((this.parent.querySelectorAll('.chat__remove_button')));
      const num = elements.indexOf(target);
      Bus.emit('removeMessageWS', { id: this.myMessages[num].messID });
    }
  }


  _clearParameters() {
    this.allMessages = [];
    this.myMessages = [];
    this.editMessId = null;
    this.countMessage = 0;
  }


  _editMessageClick(message: any) {
    this.inputMessageField.value = message.text;
    this.editButtonSend.style.display = 'flex';
    this.sendButton.style.display = 'none';
  }

  _sendEditMessage() {
    const messageText = this.inputMessageField.value;

    if (messageText == '' || this.editMessId == null) {
      return;
    }
    this.editButtonSend.style.display = 'none';
    this.sendButton.style.display = 'flex';
    Bus.emit('editChatMessage', { id: this.editMessId, text: messageText })
    this.editMessId = null;
    this.myMessage = true;
    this.inputMessageField.value = '';
  }

  _onkeydownSignal(e: any) {
    if (e.keyCode === 13) {
      if (this.editMessId == null) {
        this._sendMessage();
      } else {
        this._sendEditMessage();
      }
    }
  }

  _deleteMessage(data : any) {
    let allNnum = -1;
    let myNum = -1;
    for (let i = 0; i < this.allMessages.length; i++) {
      if (this.allMessages[i].messID === data.id) {
        allNnum = i;
        break;
      }
    }
    const messages = [].slice.call((this.parent.querySelectorAll('.chat__message')));
    if (allNnum < 0 || allNnum >= messages.length || allNnum >= this.allMessages.length) {
      return;
    }
    messages[allNnum].parentNode.removeChild(messages[allNnum]);
    this.allMessages.splice(allNnum, 1);
    for (let i = 0; i < this.myMessages.length; i++) {
      if (this.myMessages[i].messID === data.id) {
        myNum = i;
        break;
      }
    }
    if (myNum < 0 || myNum >= this.myMessages.length) {
      return;
    }
    this.myMessages.splice(myNum, 1);


    return;
  }

  _editMessage(data : any) {
    let allNnum = -1;
    let myNum = -1;
    for (let i = 0; i < this.allMessages.length; i++) {
      if (this.allMessages[i].messID === data.id) {
        allNnum = i;
        break;
      }
    }
    const messages = [].slice.call((this.parent.querySelectorAll('.chat__message')));
    if (allNnum < 0 || allNnum >= this.allMessages.length) {
      return;
    }
    this.allMessages[allNnum].text = data.text;
    messages[allNnum].querySelector('.chat__text').innerHTML = data.text;
    let div = document.createElement('div');
    div.className = "chat__edited_message";
    div.innerHTML = '(edit)';
    messages[allNnum].querySelector('.chat__edited_message_container').appendChild(div);

    for (let i = 0; i < this.myMessages.length; i++) {
      if (this.myMessages[i].messID === data.id) {
        myNum = i;
        break;
      }
    }
    if (myNum < 0 || allNnum >= this.myMessages.length) {
      return;
    }
    
    this.myMessages[myNum].text = data.text;
    
    return;
  }

  _getMessage(data: any) {
    if (data.action === 2) { // delete
      this._deleteMessage(data);
      return;
    }

    if (data.action === 1) { // edit
      this._editMessage(data);
      return;
    }
    
    const message = { photo: data.user.photo, messID: data.id, status : data.status, messEdited: data.edited, id: data.user.id, name: data.user.name, text: data.text, time: data.time.substring(11, 16) };

    this._addMessageToChatField(message);
    this.myMessage = false;
    return;
  }

  _getMessageHistory(dataStruct: any) {
    
    const data = dataStruct.data;
    const place = dataStruct.place;
    this.allMessages = [];
    this.myMessages = [];
    this.chatHistory.innerHTML = '';
    let messageHistory = [];
    if (place === 'lobby') {
      messageHistory = data.lobby.messages;
      if (data.lobby.messages == null) {
        return;
      }
      this.chatVisitors = data.lobby.waiting.get.length;
      this.chatPlayerVisitors = data.lobby.playing.get.length;
      //this._updateChatVisitors();
    } else {
      messageHistory = data.room.messages;
    }
    this.idPlayerBackend = data.you.id;


    messageHistory.forEach((item: any) => {
      const message = { photo: item.user.photo, messID: item.id, status : item.status, messEdited: item.edited, id: item.user.id, name: item.user.name, text: item.text, time: item.time.substring(11, 16) };
      this._addMessageToChatField(message);
    });

    
  }

  
  _sendMessage() {
    const maxLenMessage = 500;
    let messageText = this.inputMessageField.value;
    if (messageText == '') {
      return;
    }

    while(messageText.length > maxLenMessage) {
      Bus.emit('sendChatMessage', messageText.substr(0, maxLenMessage));
      messageText = messageText.substr(maxLenMessage, messageText.length - 1);
    }

    if (messageText.length > 0) {
      Bus.emit('sendChatMessage', messageText);
    }

    this.myMessage = true;
    this.inputMessageField.value = '';
  }

  _addMessageToChatField(messageStruct: any) {
    if (messageStruct.id < 0) {
      messageStruct.photo = './img/anonymous.jpg'
    }

    if (messageStruct.id != this.idPlayerBackend) {
      this.chatHistory.innerHTML += MessageTemplate({ message: messageStruct });
    } else {
      this.chatHistory.innerHTML += MyMessageTemplate({ message: messageStruct });
      this.myMessages.push(messageStruct);
    }
    this.allMessages.push(messageStruct);
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;

  }

  // _addWaiterInChat() {
  //   ++this.chatVisitors;
  //   this._updateChatVisitors();
  // }

  // _delWaiterInChat() {
  //   --this.chatVisitors;
  //   if (this.chatVisitors < 0) {
  //     this.chatVisitors = 0;
  //   }
  //   this._updateChatVisitors();
  // }


  // _addPlayerInChat() {
  //   ++this.chatPlayerVisitors;
  //   this._updateChatVisitors();
  // }

  // _delPlayerInChat() {
  //   --this.chatPlayerVisitors;
  //   if (this.chatPlayerVisitors < 0) {
  //     this.chatPlayerVisitors = 0;
  //   }
  //   this._updateChatVisitors();
  // }

  // _updateChatVisitors() {
  //   this.counterOnlineField.innerHTML = `Now in lobby: ${this.chatVisitors}, in game: ${this.chatPlayerVisitors}`;
  // }

}
