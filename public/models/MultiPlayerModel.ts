import Bus from '../utils/bus';
import {WebSocketInterface} from '../utils/webSocket';
/**
 *
 */
export default class MultiplayerModel {
  ws: WebSocketInterface;
  rooms: any;
  wsAdress: string;
  /**
   *
   */
  constructor() {
    Bus.on('getInfoFromWS', this._getInfo.bind(this), 'multiPlayerModel');
    Bus.on('getWSMultiplayer', this._setWS.bind(this), 'multiPlayerModel');
    Bus.on('sendCellWS', this._sendCell.bind(this), 'multiPlayerModel');
    Bus.on('restartMultiplayer', this._seandRestart.bind(this), 'multiPlayerModel');
    
 }

  _setWS(data : any) {
    this.ws = data;
  }

  /**
   * _sendInfo
   */
  _sendCell(data : any) {
    const sendInfo = {send : { cell : { x : data.x, y : data.y}}};
    console.log(sendInfo);
    this.ws.sendInfoJSON(sendInfo);
  }

  _seandRestart(data : any) {
    const sendInfo = {send : { action : 16}};
    console.log(sendInfo);
    this.ws.sendInfoJSON(sendInfo);
  }

  /**
   * _getInfo
   */
  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 
    switch(data.type) {
      case 'RoomNewCells' :
        Bus.emit('updateFieldWS', data);
        break;
      case 'RoomPlayerPoints' :
        Bus.emit('updatePointsWS', data);
        break;
      case 'RoomGameOver' :
        Bus.emit('gameOwerWS', data);
        break;
      case 'RoomAction' :
        Bus.emit('roomActionWS', data);
        break;
      case 'ChangeFlagSet':
        Bus.emit('changeFlagSetWS', data);
        break;
      case 'RoomObserverEnter':
        Bus.emit('roomObserverEnterWS', data);
        break;
      case 'RoomObserverExit':
        Bus.emit('roomObserverExitWS', data);
        break;
        
    }
    console.log('_getInfo end') 
  }
}
