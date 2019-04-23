const lobbyTemplate = require('./Lobby.pug');
const lobbyTemplateFreeRoom = require('./LobbyFreeRoom.pug');
const lobbyTemplateBusyRoom = require('./LobbyBusyRoom.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
import { WebSocketInterface } from '../../utils/webSocket';

/**
 *
 */
export default class LobbyView extends BaseView {
  _warnings: any;
  parent: any;
  _user: any;
  createRoomButton: any;
  free_room_container: any;
  ws: WebSocketInterface;
  wsAdress: string;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, lobbyTemplate, false);
    this.wsAdress = 'ws://localhost:3001/ws';
    
    
  }

  /** */
  render() {
    this.user = User;
    console.log('User ', User);
    super.render();
    
    this.free_room_container = this.parent.querySelector('.lobby__free_room_container');
    this.free_room_container = this.parent.querySelector('.lobby__busy_room_container');
    this.createRoomButton = document.querySelector('.lobby__create_game');
    this.createRoomButton.addEventListener('click', this._createRoomEvent.bind(this));
    Bus.on('getInfoFromWS', this._getInfo.bind(this));
    this.ws = new WebSocketInterface(this.wsAdress);
    Bus.on('currentPath', this.currentPathSignalFunc.bind(this))
  }

  currentPathSignalFunc(path: string) {
    if (path === '/lobby') {
      console.log('this.ws.connectWS')
      this.ws.closeConnection();
      this.ws.connectWS(this.wsAdress);
    } else {
      console.log('this.ws.closeConnection')
      this.ws.closeConnection();
    }
  }

  _getInfo(data : any) {
    console.log('_getInfo begin ', data) 
    if (data.type === 'Lobby') {
      this._addRooms(data);
    }
    console.log('_getInfo end') 
  }

  _createRoomEvent() {
    const width = 15;
    const height = 15;
    const players = 2;
    const observers = 10;
    const mines = 20;

    this.ws.sendInfoJSON({send : { RoomSettings : {name : 'create', width : width, height : height, 
    players : players, observers : observers, mines : mines}}});
  }

  _addRooms(data : any) {
    this.free_room_container.innerHTML = ''
    this.free_room_container.innerHTML = '';
    console.log('_addRooms begin ', data);
    data.allRooms.get.forEach((item : any, i : number) => {
      if (item.status === 3) {
      } else {
        const room = {name : item.name, playersCount : item.players.connections.length,
          playersCapacity : item.players.capacity, difficult : this._getModeByMines(item.field.Mines),
          width : item.field.width, height : item.field.height, mines : item.field.Mines, time : '0:00:00'}
        this._addFreeRoom(room);
      }
    });
  }

  _getModeByMines(mines : number) {
    let mode : string;
    switch(mines) {
      case 20 :
        mode = 'Baby';
        break;
      case 30 :
        mode = 'Normal';
        break;
      case 45 :
        mode = 'Hard';
        break;
      case 60 :
        mode = 'God';
        break;
    }
    return mode;
  }

  _getStatusByCode(code : number) {
    let status : string;
    switch(code) {
      case 0 :
        status = 'free';
        break;
      case 2 :
        status = 'flag placing';
        break;
      case 3 :
        status = 'running';
        break;
      case 4 :
        status = 'finished';
        break;
    }
    return status;
  }

  _addFreeRoom(room : any) {
    console.log(room);
    this.free_room_container.innerHTML += lobbyTemplateFreeRoom({ room : room });
  }

  _addBusyRoom(room : any) {
    this.free_room_container.innerHTML += lobbyTemplateBusyRoom({ room : room });
  }

}