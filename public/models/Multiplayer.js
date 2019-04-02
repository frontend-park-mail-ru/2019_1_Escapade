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
    this.ws.setCallback(this._getRoomsCallBack);
  }

  /**
   * _getRoomsCallBack
   */
  _getRoomsCallBack(data) {
    const rooms = JSON.parse(data);
    console.log(rooms);
  }
}
