const lobbyTemplate = require('./Lobby.pug');
const lobbyTemplateFreeRoom = require('./LobbyFreeRoom.pug');
const lobbyTemplateBusyRoom = require('./LobbyBusyRoom.pug');
const lobbyTemplateRoomsNotFound = require('./LobbyRoomsNotFound.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
import { throwStatement } from 'babel-types';
import { runInThisContext } from 'vm';

/**
 *
 */
export default class LobbyView extends BaseView {
  _warnings: any;
  parent: any;
  _user: any;
  createRoomButton: any;
  freeRoomContainer: any;
  wsAdress: string;
  leaveRoomButton: any;
  busyRoomContainer: any;
  currentRoomPanel: any;
  roomStatusField: any;
  roomImagesField: any;
  rooms: any[];
  roomsHTML: any[];
  currentRoomId: number;
  currentRoomName: string;
  paginatorPanel: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, lobbyTemplate, false);
  }

  /** */
  render() {
    this.user = User;
    super.render();
    this.currentRoomId = -1;
    this.currentRoomName = '';
    this.roomsHTML = [];
    this.rooms = [];

    this.freeRoomContainer = this.parent.querySelector('.lobby__free_room_container');
    this.busyRoomContainer = this.parent.querySelector('.lobby__busy_room_container');
    this.leaveRoomButton = this.parent.querySelector('.room__exit');
    this.currentRoomPanel = this.parent.querySelector('.lobby__current_room_panel');
    this.paginatorPanel = this.parent.querySelector('.lobby__paginator'); 
    this.createRoomButton = this.parent.querySelector('.lobby__create_game');
    this.roomStatusField = this.currentRoomPanel.querySelector('.room_status');
    this.roomImagesField = this.currentRoomPanel.querySelector('.room_status_images_players');
    
    this._hideCurrentRoomPanel();

    this.createRoomButton.addEventListener('click', this._createRoomEvent.bind(this));
    this.leaveRoomButton.addEventListener('click', this._leaveRoom.bind(this));

    Bus.on('updateCurrentRoom', this._updateCurrentRoom.bind(this));
    Bus.on('addRooms', this._addRooms.bind(this));
  }

  _updateCurrentRoom(data : any) {
    this.currentRoomName = data.name;
    this._showCurrentRoomPanel();
    this.roomStatusField.innerHTML = `Room ${data.name} waiting... ${data.length}/${data.capacity}`;
  }

  _createRoomEvent() {
    this.currentRoomId = -2;
    Bus.emit('createRoom');
  }

  _leaveRoom() {
    this._hideCurrentRoomPanel();
    this.currentRoomId = -1;
    this.currentRoomName = '';
    Bus.emit('leaveRoom');
  }

  _hideCurrentRoomPanel() {
    this.roomStatusField.innerHTML = '';
    this.roomImagesField.innerHTML = '';
    this.currentRoomPanel.hidden = true;
  }

  _showCurrentRoomPanel() {
    this.currentRoomPanel.hidden = false;
  }

  _hidePaginatorPanel() {
    this.paginatorPanel.style.display = 'none';
  }

  _showPaginatorPanel() {
    this.paginatorPanel.style.display = 'flex';
  }

  _addRooms(data : any) {
    this.currentRoomId = -1;
    this.roomsHTML = []
    this.rooms = []
    this.freeRoomContainer.innerHTML = ''
    this.busyRoomContainer.innerHTML = '';
    this._showPaginatorPanel();
    
    let hideCurrentRoomPanel = true;
    
    if (data.allRooms.get.length === 0) { // not found rooms
      this._notFoundRoom();
      this._hidePaginatorPanel();
    }

    data.allRooms.get.forEach((item : any, i : number) => {
      const room = {name : item.name, playersCount : item.players.connections.length,
        playersCapacity : item.players.capacity, difficult : this._getModeByMines(item.field.Mines),
        width : item.field.width, height : item.field.height, mines : item.field.Mines, time : '0:00:00',
        observersCount : item.observers.get.length, status : this._getStatusByCode(item.status)}
      
      if (item.status === 3) {   // busy room
        this._addBusyRoom(room);
      } else {
        this._addFreeRoom(room);
      }
      this.rooms.push(item);
      if (this.currentRoomName === item.name) {
        this.currentRoomId = i;
        hideCurrentRoomPanel = false;
      }
    });

    if (hideCurrentRoomPanel) {
      this._hideCurrentRoomPanel();
    }

    var elements = [].slice.call(document.querySelectorAll('.lobby__free_room'));
    elements.forEach((element : any, i : number) => {
      this.roomsHTML.push(element);
      element.addEventListener('click', this._clickOnFreeRoom.bind(this))
    });
    if (this.currentRoomId >= 0) {
      this._changeRoomStringColor(this.currentRoomId, 1);
    }
    if (this.currentRoomId === -2) { 
      this.currentRoomId = this.rooms.length - 1;
      this._changeRoomStringColor(this.currentRoomId, 1);
    }
  }

  _clickOnFreeRoom(e : any) {
    let target = e.target;
    while (!target.classList.contains('lobby__free_room')) {
      target = target.parentNode;
      if (!target.classList) {
        return;
      }
    }
    if (this.currentRoomId >= 0) {
      this._changeRoomStringColor(this.currentRoomId, 0);
    }
    this.currentRoomId = this.roomsHTML.indexOf(target);
    this._changeRoomStringColor(this.currentRoomId, 1);
    const info = {name : this.rooms[this.currentRoomId].name, length : this.rooms[this.currentRoomId].players.connections.length,
       capacity : this.rooms[this.currentRoomId].players.capacity}
    this._updateCurrentRoom(info);
    Bus.emit('connectToRoom', this.rooms[this.currentRoomId].name)
  }

  _changeRoomStringColor(i : number, typeColor : number) {
    let colorString = '';
    switch(typeColor) {
      case 0 :
        colorString = '#46535e';
        break;
      case 1 :
        colorString = '#a54f4f';
        break;
    }
    this.roomsHTML[i].style.backgroundColor = colorString;
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
    this.freeRoomContainer.innerHTML += lobbyTemplateFreeRoom({ room : room });
  }

  _addBusyRoom(room : any) {
    this.busyRoomContainer.innerHTML += lobbyTemplateBusyRoom({ room : room });
  }

  _notFoundRoom() {
    this.freeRoomContainer.innerHTML = lobbyTemplateRoomsNotFound();
  }

}