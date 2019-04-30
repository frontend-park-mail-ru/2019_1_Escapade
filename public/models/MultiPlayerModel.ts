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
    Bus.on('getWS', this._getWS.bind(this));
    Bus.on('leftClickOnCellWS', this._sendCell.bind(this));
    
    //this.ws = new WebSocketInterface(this.wsAdress);
  }

  _getWS(data : any) {
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


  /**
   * _getInfo
   */
  _getInfo() {
    // JSON.stringify({"email": "hey@mail.com", "password": "101010"});
  }
}
