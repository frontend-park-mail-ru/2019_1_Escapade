const lobbyTemplate = require('./Lobby.pug');
const lobbyTemplateFreeRoom = require('./LobbyFreeRoom.pug');
const lobbyTemplateBusyRoom = require('./LobbyBusyRoom.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';

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
  roomNotFoundPanel: any;
  busyRooms: any[];
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
    this.busyRooms = [];

    this.freeRoomContainer = this.parent.querySelector('.lobby__free_room_container');
    this.busyRoomContainer = this.parent.querySelector('.lobby__busy_room_container');
    this.leaveRoomButton = this.parent.querySelector('.room__exit');
    this.currentRoomPanel = this.parent.querySelector('.lobby__current_room_panel');
    this.paginatorPanel = this.parent.querySelector('.lobby__paginator'); 
    this.createRoomButton = this.parent.querySelector('.lobby__create_game');
    this.roomNotFoundPanel = this.parent.querySelector('.lobby__room_not_found');
    this.roomStatusField = this.currentRoomPanel.querySelector('.room_status');
    this.roomImagesField = this.currentRoomPanel.querySelector('.room_status_images_players');
    
    
    this._hideCurrentRoomPanel();

    this.createRoomButton.addEventListener('click', this._createRoomEvent.bind(this));
    this.leaveRoomButton.addEventListener('click', this._leaveRoom.bind(this));

    Bus.on('updateCurrentRoom', this._updateCurrentRoom.bind(this), 'lobbyView');
    Bus.on('updateRooms', this._updateRooms.bind(this), 'lobbyView');
    Bus.on('addRoom', this._addRoom.bind(this), 'lobbyView');
    Bus.on('updateRoom', this._updateRoom.bind(this), 'lobbyView');
    Bus.on('deleteRoom', this._deleteRoom.bind(this), 'lobbyView');
    document.addEventListener('click', this._clickOnFreeRoom.bind(this));
    
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
    console.log('_leaveRoom')
    this._hideCurrentRoomPanel();
    this.currentRoomId = -1;
    this.currentRoomName = '';
    Bus.emit('leaveRoom', 14);
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

  _addRoom(data : any) {
    this._notFoundRoomPanelHide();
    this._showPaginatorPanel();
    const room = {name : data.name, playersCount : data.players.connections.length,
      playersCapacity : data.players.capacity, difficult : this._getModeByMines(data.field.Mines),
      width : data.field.width, height : data.field.height, mines : data.field.Mines, time : '0:00:00',
      observersCount : data.observers.get.length, status : this._getStatusByCode(data.status)}
    
    if (data.status === 3) {   // busy room
      this._addBusyRoom(room);
      this.busyRooms.push(data);
    } else {
      this.rooms.push(data);
      this._addFreeRoom(room);
    }

    if (this.currentRoomId === -2) { 
      const elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
      this.currentRoomId = elements.length - 1;
      console.log('currentRoomId ' + this.currentRoomId);
      this._changeRoomStringColor('free', this.currentRoomId, 1);
      const info = {name : this.rooms[this.currentRoomId].name, length : this.rooms[this.currentRoomId].players.connections.length,
        capacity : this.rooms[this.currentRoomId].players.capacity}
     this._updateCurrentRoom(info);
    }
  }

  _updateRoom(data : any) {
    if (data.status === 3) {
      const elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
      for (let i = 0; i < this.busyRooms.length; i++) {
        if (this.busyRooms[i].id === data.id) {
          elements[i].querySelector('.lobby__players').innerHTML = `${data.players.connections.length}/${data.players.capacity} players`;
          const observersHTML = elements[i].querySelector('.lobby__observers');
          if (observersHTML) {
            elements[i].querySelector('.lobby__observers').innerHTML = data.observers.get.length;
            elements[i].querySelector('.lobby__status').innerHTML = this._getStatusByCode(data.status);
          }
          break;
        }
      }
    } else {
      const elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === data.id) {
          elements[i].querySelector('.lobby__players').innerHTML = `${data.players.connections.length}/${data.players.capacity} players`;
          break;
        }
      }
    }
  }

  _deleteRoom(data : any) {
    if (data.status === 3) {
      let elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
      for (let i = 0; i < this.busyRooms.length; i++) {
        if (this.busyRooms[i].id === data) {
          elements[i].parentNode.removeChild(elements[i]);
          this.busyRooms.splice(i, 1);
          break;
        }
      } 
    } else {
      let elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === data) {
          elements[i].parentNode.removeChild(elements[i]);
          this.rooms.splice(i, 1);
          break;
        }
      }
    }
    
    if (this.rooms.length === 0 && this.busyRooms.length === 0) { // not found rooms
      this._notFoundRoomPanelShow();
      this._hidePaginatorPanel();
    }
  }

  _updateRooms(data : any) {
    console.log('_updateRooms')
    this.currentRoomId = -1;
    this.rooms = []
    this.busyRooms = []
    this.freeRoomContainer.innerHTML = ''
    this.busyRoomContainer.innerHTML = '';
    this._showPaginatorPanel();
    this._notFoundRoomPanelHide();
    this._hideCurrentRoomPanel();
    
    if (data.allRooms.get.length === 0) { // not found rooms
      this._notFoundRoomPanelShow();
      this._hidePaginatorPanel();
    }

    data.allRooms.get.forEach((item : any, i : number) => {
      const room = {name : item.name, playersCount : item.players.connections.length,
        playersCapacity : item.players.capacity, difficult : this._getModeByMines(item.field.Mines),
        width : item.field.width, height : item.field.height, mines : item.field.Mines, time : '0:00:00',
        observersCount : item.observers.get.length, status : this._getStatusByCode(item.status)}
      
      if (item.status === 3 || item.status === 2) {   // busy room
        this.busyRooms.push(item);
        this._addBusyRoom(room);
      } else {
        this.rooms.push(item);
        this._addFreeRoom(room);
      }
      
    });
  }

  _clickOnFreeRoom(e : any) {
    let target = e.target;
    while (!target.classList.contains('lobby__free_room') && !target.classList.contains('lobby__busy_room')) {
      target = target.parentNode;
      if (!target.classList) {
        return;
      }
    }

    if (this.currentRoomId >= 0) {
      this._changeRoomStringColor('free', this.currentRoomId, 0);
    }

    if (target.classList.contains('lobby__busy_room')) { 
      const elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
      const id = elements.indexOf(target);
      this._changeRoomStringColor('busy', id, 2);
      console.log('AAAa' + this.busyRooms[id].id + ' ' + id);
      Bus.emit('connectToRoom', this.busyRooms[id].id)
    } else {
      const elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
      this.currentRoomId = elements.indexOf(target);
      this._changeRoomStringColor('free', this.currentRoomId, 1);
      const info = {name : this.rooms[this.currentRoomId].name, length : this.rooms[this.currentRoomId].players.connections.length,
        capacity : this.rooms[this.currentRoomId].players.capacity}
      this._updateCurrentRoom(info);
      Bus.emit('connectToRoom', this.rooms[this.currentRoomId].id)
    }
    
  }

  _changeRoomStringColor(typeRoom : string, i : number, typeColor : number) {
    let elements = [];
    if (typeRoom === 'free') {
      elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
    } else if (typeRoom === 'busy') {
      elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
    }
    let colorString = '';
    switch(typeColor) {
      case 0 :
        colorString = '#46535e';
        break;
      case 1 :
        colorString = '#a54f4f';
        break;
      case 2 :
        colorString = '#4f9fa5';
        break;
    }
    elements[i].style.backgroundColor = colorString;
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

  _notFoundRoomPanelShow() {
    this.roomNotFoundPanel.hidden = false;
  }

  _notFoundRoomPanelHide() {
    this.roomNotFoundPanel.hidden = true;
  }

}