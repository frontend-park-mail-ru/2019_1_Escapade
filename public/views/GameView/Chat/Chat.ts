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
  allMessages: any[];
  myMessages: any[];
  editButtonSend: any;
  editMessId: any;
  clickOnMessageButtonsBindThis: any;
  sendEditMessageBindThis: any;
  sendMessageBindThis: any;
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


  _addListeners(data : any) {
    this._clearParameters();
    let container = data.container;
    let place = data.place;
    let parent = data.parent;
    const HTMLElement = parent.querySelector(container);
    HTMLElement.innerHTML = Template();
    this.sendButton = parent.querySelector('.chat__send_button');
    this.inputMessageField = parent.querySelector('.chat__input');
    this.chatHistory = parent.querySelector('.chat__history');
    this.counterOnlineField = parent.querySelector('.chat__online');
    this.editButtonSend = parent.querySelector('.chat__edit_button_send');
    this.editButtonSend.style.display = 'none';
    
    this.editButtonSend.removeEventListener('click', this.sendEditMessageBindThis);
    this.sendButton.removeEventListener('click', this.sendMessageBindThis);
    this.editButtonSend.addEventListener('click', this.sendEditMessageBindThis);
    this.sendButton.addEventListener('click', this.sendMessageBindThis);


    Bus.on('getChatMessage', this._getMessage.bind(this), 'chat');
    Bus.on('addMessageInChatHistory', this._getMessageHistory.bind(this), 'chat');
    
    this.inputMessageField.onkeydown = this._onkeydownSignal.bind(this)
    this.chatHistory.scrollTop = 9999;
    

    document.removeEventListener('click', this.clickOnMessageButtonsBindThis);
    document.addEventListener('click', this.clickOnMessageButtonsBindThis);
  }

  _clickOnMessageButtons(e : any) {
    let target = e.target;
    while (!target.classList.contains('chat__edit_button') && !target.classList.contains('chat__remove_button')) {
      target = target.parentNode;
      if (!target.classList) {
        return;
      }
    }

    if (target.classList.contains('chat__edit_button')) { 
      const elements = [].slice.call((document.querySelectorAll('.chat__edit_button')));
      const num = elements.indexOf(target);
      if (num < 0 || num >= this.myMessages.length) {
        return;
      }
      this.editMessId = this.myMessages[num].messID;
      this._editMessage(this.myMessages[num]);
    } else if (target.classList.contains('chat__remove_button')) {  
      const elements = [].slice.call((document.querySelectorAll('.chat__remove_button')));
      const num = elements.indexOf(target);
      Bus.emit('removeMessageWS', { id : this.myMessages[num].messID});
    }
  }


  _clearParameters() {
    this.allMessages = [];
    this.myMessages = [];
    this.editMessId = null;
    this.countMessage = 0;
  }


  _editMessage(message : any) {
    this.inputMessageField.value = message.text;
    this.editButtonSend.style.display = 'flex';
    this.sendButton.style.display = 'none';
  }
  
  _sendEditMessage() {
    const messageText = this.inputMessageField.value;
    console.log(messageText, ' ', this.editMessId)
    
    if (messageText == '' || this.editMessId == null) {
      return;
    }
    this.editButtonSend.style.display = 'none';
    this.sendButton.style.display = 'flex';
    Bus.emit('editChatMessage',  { id : this.editMessId, text: messageText})
    this.editMessId = null;
    this.myMessage = true;
    this.inputMessageField.value = '';
  }

  _onkeydownSignal(e : any) {
    if (e.keyCode === 13) {
      if (this.editMessId == null) {
        this._sendMessage();
      } else {  
        this._sendEditMessage();
      }
    }
  }
  _getMessage(data : any) {
    if (data.action === 2) { // delete
      let allNnum = -1;
      let myNum = -1;
      for (let i = 0; i < this.allMessages.length; i++) {
        if (this.allMessages[i].messID === data.id) {
          allNnum = i;
          break;
        }
      }
      for (let i = 0; i < this.myMessages.length; i++) {
        if (this.myMessages[i].messID === data.id) {
          myNum = i;
          break;
        }
      }
      const messages = [].slice.call((document.querySelectorAll('.chat__message')));
      if (allNnum < 0 || allNnum >= messages.length) {
        return;
      }
      messages[allNnum].parentNode.removeChild(messages[allNnum]); 
      this.myMessages.splice(allNnum,1);
      this.allMessages.splice(myNum,1);
    }

    if (data.action === 1) { // delete
      let allNnum = -1;
      let myNum = -1;
      for (let i = 0; i < this.allMessages.length; i++) {
        if (this.allMessages[i].messID === data.id) {
          allNnum = i;
          break;
        }
      }
      for (let i = 0; i < this.myMessages.length; i++) {
        if (this.myMessages[i].messID === data.id) {
          myNum = i;
          break;
        }
      }
      const messages = [].slice.call((document.querySelectorAll('.chat__message')));
      if (allNnum < 0 || allNnum >= messages.length) {
        return;
      }
      messages[allNnum].querySelector('.chat__text').innerHTML =  data.text; 
      this.myMessages[myNum].text = data.text;
      this.allMessages[allNnum].text = data.text;
    }
    const message = {photo : data.user.photo, messID: data.id, messEdited: data.edited, id : data.user.id, name : data.user.name, text : data.text, time : data.time.substring(11,16)};

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

    if (data.lobby.messages == null) {
      return;
    }
    messageHistory.forEach((item : any) => {
      const message = {photo : item.user.photo, messID: item.id, messEdited: item.edited, id : item.user.id, name : item.user.name, text : item.text, time : item.time.substring(11,16)};
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
      this.myMessages.push(messageStruct);
    }
    this.allMessages.push(messageStruct);
    this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    
  }

  _updateChatVisitors(chatVisitors : any) {
    this.chatVisitors = chatVisitors;
    this.counterOnlineField.innerHTML = `Now Online: ${this.chatVisitors.length}`;
  }

}
