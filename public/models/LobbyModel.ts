import Bus from '../utils/bus';
import { WebSocketInterface } from '../utils/webSocket';
/**
 *
 */
export default class LobbyModel {
  rooms: any;
  dataJSON: any;
  ws: WebSocketInterface;
  wsAdress: string;
  currentRoomConnections: any;
  /**
   *
   */
  constructor() {
    this.wsAdress = 'ws://localhost:3001/ws';
    
    this.currentRoomConnections = [];
    
    Bus.on('getInfoFromWS', this._getInfo.bind(this));
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this));
    Bus.on('createRoom', this._createRoom.bind(this));
    Bus.on('connectToRoom', this._connectToRoom.bind(this));
    Bus.on('leaveRoom', this._leaveRoom.bind(this));
    this.ws = new WebSocketInterface(this.wsAdress);
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/lobby') {
      this.ws.closeConnection();
      this.ws.connectWS(this.wsAdress);
    } else {
      this.ws.closeConnection();
    }
  }


  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 
    if (data.type === 'Lobby') {
      if (data.allRooms) {
        Bus.emit('addRooms', data);
      }
    } else if (data.type === 'Room') {
      if (!data.players) {
        return;
      } else {
        const info = {name : data.name, length : data.players.connections.length, capacity : data.players.capacity}
        this._updateCurrentRoom(info);
        this.currentRoomConnections = data.players.connections;
        if (data.status === 2) {
          this._startGame();
        }
      }
    }
    console.log('_getInfo end') 
  }

  _createRoom() {
    const width = 15;
    const height = 15;
    const players = 2;
    const observers = 10;
    const mines = 20;
    this.ws.sendInfoJSON({send : { RoomSettings : {name : 'create', width : width, height : height, 
    players : players, observers : observers, prepare:10, play:100, mines : mines}}});
  }

  _connectToRoom(name : any) {
    this.ws.sendInfoJSON({send : { RoomSettings : {name : name}}});
  }

  _leaveRoom() {
    this.ws.sendInfoJSON({send:{action:14}});
  }

  _updateCurrentRoom(data : any) {
    Bus.emit('updateCurrentRoom', data);
  }

  _startGame() {
    //window.location.replace("http://stackoverflow.com");
    window.location.href = "http://localhost:8080/multi_player";
    Bus.emit('sendPlayersToRoom', this.currentRoomConnections)
  }

}