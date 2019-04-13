import Bus from '../utils/bus';
import {WebSocketInterface} from '../utils/webSocket';
/**
 *
 */
export default class MultiplayerModel {
  ws: WebSocketInterface;
  rooms: any;
  /**
   *
   */
  constructor() {
    Bus.on('connect', this._connect.bind(this));
    Bus.on('get_rooms', this._getRooms.bind(this));
    Bus.on('send_info', this._sendInfo.bind(this));
    Bus.on('send_cell_coord', this._sendCell.bind(this));
  }

  /**
   * _connect
   */
  _connect() {
    this.ws = new WebSocketInterface('ws://localhost:3001/ws');
  }

  /**
   * _get_rooms
   */
  _getRooms() {
    this.ws.setCallback(this._getRoomsCallBack.bind(this));
  }

  /**
   * _getRoomsCallBack
   */
  _getRoomsCallBack(data) {
    this.rooms = JSON.parse(data);
    console.log(this.rooms);
  }

  /**
   * _sendInfo
   */
  _sendInfo() { // Вступить в комнату
    const roomSettingsData = {name: 'Hey', width: 20, height: 20, players: 2, mines: 50};
    const roomSettings = {roomSettings: roomSettingsData};
    const data = JSON.stringify({send: roomSettings});

    console.log(data);
    
    this.ws.sendMessage(data);
  }

  /**
   * _sendInfo
   */
  _sendCell(cellCoord) {
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
