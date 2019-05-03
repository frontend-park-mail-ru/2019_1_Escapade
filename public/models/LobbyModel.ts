import Bus from '../utils/bus';
import { WebSocketInterface } from '../utils/webSocket';
import router from '../../public/main'
/**
 *
 */
export default class LobbyModel {
  rooms: any;
  dataJSON: any;
  ws: WebSocketInterface;
  wsAdress: string;
  currentRoomInfo: any;
  curPath: string;
  /**
   *
   */
  constructor() {
    this.wsAdress = 'ws://localhost:3002/ws';
    
    this.currentRoomInfo = [];
    
    Bus.on('getInfoFromWS', this._getInfo.bind(this), 'lobbyModel');
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'lobbyModel');
    Bus.on('createRoom', this._createRoom.bind(this), 'lobbyModel');
    Bus.on('connectToRoom', this._connectToRoom.bind(this), 'lobbyModel');
    Bus.on('leaveRoom', this._leaveRoom.bind(this), 'lobbyModel');
    this.curPath = '';
    this.ws = new WebSocketInterface(this.wsAdress);
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/multi_player') {
      console.log('pam pam');
      return;
    }
    if (path === '/lobby') {
      this.curPath = path;
      this.ws.closeConnection();
      this.ws.connectWS(this.wsAdress);
    } else {
      if (this.curPath === '/lobby') {
        this._leaveRoom(14);
        this.ws.closeConnection();
        this.curPath = '';
      }
    }
  }


  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 
    switch(data.type) {
      case 'Lobby' :
        Bus.emit('updateRooms', data.value);
        break;
      case 'LobbyRoomCreate' :
        Bus.emit('addRoom', data.value);
        break;
      case 'LobbyRoomUpdate' :
        Bus.emit('updateRoom', data.value);
        break;
      case 'LobbyRoomDelete' : 
        Bus.emit('deleteRoom', data.value);
        break;
      case 'Room' :
        const roomValue  = data.value;
        if (!roomValue.room.players) {
          return;
        } else {
          const info = {name : roomValue.room.name, length : roomValue.room.players.connections.length, capacity : roomValue.room.players.capacity}
          this._updateCurrentRoom(info);
          this.currentRoomInfo = roomValue;
          if (roomValue.room.status === 2) {
            this._startGame();
          }
        }
        break;
    }
    console.log('_getInfo end') 
  }

  _createRoom() {
    const width = 15;
    const height = 15;
    const players = 2;
    const observers = 10;
    const mines = 20;
    this.ws.sendInfoJSON({send : { RoomSettings : {name : 'my room', id : 'create', width : width, height : height, 
    players : players, observers : observers, prepare:10, play:100, mines : mines}}});
  }

  _connectToRoom(name : any) {
    this.ws.sendInfoJSON({send : { RoomSettings : {name : name}}});
  }

  _leaveRoom(signal : number) {
    this.ws.sendInfoJSON({send:{action:signal}});
  }

  _updateCurrentRoom(data : any) {
    Bus.emit('updateCurrentRoom', data);
  }

  _startGame() {
    router.open('/multi_player');
    Bus.emit('getWS', this.ws);
    Bus.emit('sendRoom', this.currentRoomInfo)
  }

}