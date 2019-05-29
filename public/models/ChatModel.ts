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
 }

  _setWS(data : any) {
    this.ws = data;
  }


  _sendMessage(mess: any) {
    console.log('AAAAAA ', mess)
    this.ws.sendInfoJSON({
      message: {
        text: mess
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
        if (data.room) {
          Bus.emit('addMessageInChatHistory', data.room.messages);
        }
        break;
      case  'Lobby' :
        Bus.emit('addMessageInChatHistory', data.value.lobby.messages);
        break;
    }
    console.log('_getInfo end') 
  }
}
