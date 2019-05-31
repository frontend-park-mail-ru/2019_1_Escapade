import Bus from '../utils/bus';
import {WebSocketInterface} from '../utils/webSocket';
/**
 *
 */
export default class ChatModel {
  ws: WebSocketInterface;
  rooms: any;
  wsAdress: string;
  /**
   *
   */
  constructor() {
    Bus.on('getInfoFromWS', this._getInfo.bind(this), 'chatModel');
    Bus.on('sendChatMessage', this._sendMessage.bind(this), 'chatModel');
    Bus.on('getWSMultiplayer', this._setWS.bind(this), 'chatModel');
    Bus.on('removeMessageWS', this._sendRemoveMessage.bind(this), 'chatModel');
    Bus.on('editChatMessage', this._sendEditMessage.bind(this), 'chatModel');
    
    
 }

  _setWS(data : any) {
    this.ws = data;
  }


  _sendMessage(mess: any) {
    this.ws.sendInfoJSON({
      message: {
        text: mess
      }
    });
  }

  _sendRemoveMessage(mess : any) {
    console.log('AAAAAA ', mess)
    this.ws.sendInfoJSON({
      message: {
        action : 2, 
        id : mess.id
      }
    });
  }

  _sendEditMessage(mess : any) {
    console.log('AAAAAA ', mess)
    this.ws.sendInfoJSON({
      message: {
        action : 1, 
        id : mess.id,
        text : mess.text,
      }
    });
  }

  /**
   * _getInfo
   */
  _getInfo(data : any) {
    switch(data.type) {
      case 'GameMessage' :
        Bus.emit('getChatMessage', data.value);
        break;
      case  'Room' :
        if (data.value.room && (data.value.room.status === 2 || data.value.room.status === 3)) {
          Bus.emit('addMessageInChatHistory', {data: data.value, place: 'room'});
        }
        break;
      case  'Lobby' :
        Bus.emit('addMessageInChatHistory', {data: data.value, place: 'lobby'});
        break;
    }
    console.log('_getInfo end') 
  }
}
