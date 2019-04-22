import Bus from '../utils/bus';
import {WebSocketInterface} from '../utils/webSocket';
/**
 *
 */
export default class LobbyModel {
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
    console.log('_connect begin');
    this.ws = new WebSocketInterface('ws://localhost:3001/ws');
    console.log('_connect end');
  }

  /**
   * _get_rooms
   */
  _getRooms() {
    console.log('_getRooms begin');
    this.ws.setCallback(this._getRoomsCallBack.bind(this));
    console.log('_getRooms end');
  }

  /**
   * _getRoomsCallBack
   */
  _getRoomsCallBack(data: string) {
    console.log('_getRoomsCallBack begin');
   
    try {
      this.rooms = JSON.parse(data);
    } catch (e) {
      console.log('debugging - ', data);
    }
    Bus.emit('returnRooms', this.rooms);
    console.log('_getRoomsCallBack end');
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
  _sendCell(cellCoord: { xCell: any; yCell: any; }) {
    const cellCoordData = {x: cellCoord.xCell, y: cellCoord.yCell};
    const data = JSON.stringify({cell: cellCoordData});

    console.log(data);
    
    this.ws.sendMessage(data);
  }
}