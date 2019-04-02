import Bus from '../utils/bus';
import {WebSocketInterface} from '../utils/webSocket.js';
/**
 *
 */
export default class MultiplayerModel {
  /**
   *
   */
  constructor() {
    Bus.on('connect', this._connect.bind(this));
    Bus.on('get_rooms', this._getRooms.bind(this));
    Bus.on('send_info', this._sendInfo.bind(this));
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
  _sendInfo() {
    const roomSettingsData = {ID: -1, Width: 20, Height: 20, Players: 2, Percent: 50};
    const cellData = {X: 0, Y: 0};
    const data = JSON.stringify({Send: 1, RoomSettings: roomSettingsData, Cell: cellData, PlayerAction: 0});

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
