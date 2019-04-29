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
    this.wsAdress = 'ws://localhost:3001/ws';
    
    Bus.on('getInfoFromWS', this._getInfo.bind(this));
    Bus.on('sendPlayersToRoom', this._getPlayers.bind(this));
    this.ws = new WebSocketInterface(this.wsAdress);
  }

  _getPlayers(data : any) {
    console.log('I am here ' + data[0].user.name);
  }

  /**
   * _sendInfo
   */
  _sendInfo(cellCoord: { xCell: any; yCell: any; }) {
    const cellCoordData = {x: cellCoord.xCell, y: cellCoord.yCell};
    const data = JSON.stringify({cell: cellCoordData});

    console.log(data);
    
    this.ws.sendMessage(data);
  }


  /**
   * _getInfo
   */
  _getInfo() {
    // JSON.stringify({"email": "hey@mail.com", "password": "101010"});
  }
}
