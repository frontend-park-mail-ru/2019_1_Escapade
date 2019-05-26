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

    }
    console.log('_getInfo end') 
  }
}
