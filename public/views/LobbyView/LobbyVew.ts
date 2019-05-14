const lobbyTemplate = require('./Lobby.pug');
const lobbyTemplateFreeRoom = require('./LobbyFreeRoom.pug');
const lobbyTemplateBusyRoom = require('./LobbyBusyRoom.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';

/**
 *
 */
export default class LobbyVew extends BaseView {
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
    document.addEventListener('click', this._clickOnFreeRoom.bind(this));

    Bus.on('showCurrentRoomPanel', this._showCurrentRoomPanel.bind(this), 'lobbyView');
    Bus.on('hideCurrentRoomPanel', this._hideCurrentRoomPanel.bind(this), 'lobbyView');
    Bus.on('showPaginatorPanel', this._showPaginatorPanel.bind(this), 'lobbyView');
    Bus.on('hidePaginatorPanel', this._hidePaginatorPanel.bind(this), 'lobbyView');
    Bus.on('showNotFoundRoomPanel', this._notFoundRoomPanelShow.bind(this), 'lobbyView');
    Bus.on('hideNotFoundRoomPanel', this._notFoundRoomPanelHide.bind(this), 'lobbyView');
    Bus.on('clearAllRoomsPanels', this._clearAllRoomsPanels.bind(this), 'lobbyView');
    Bus.on('addBusyRoomView', this._addBusyRoom.bind(this), 'lobbyView');
    Bus.on('addFreeRoomView', this._addFreeRoom.bind(this), 'lobbyView');
    Bus.on('changeRoomStringColor', this._changeRoomStringColor.bind(this), 'lobbyView');
    Bus.on('updateRoomRow', this._updateRoomRow.bind(this), 'lobbyView');
    Bus.on('deleteRoomRow', this._deleteRoomRow.bind(this), 'lobbyView');
    Bus.emit('addRoomSettings', '.lobby_room_settings_container');
    Bus.emit('hideRoomSettingsPanel');
    
  }

  _createRoomEvent() {
    Bus.emit('createRoomEvent');
  }

  _leaveRoom() {
    Bus.emit('leaveRoomEvent');
  }

  _hideCurrentRoomPanel() {
    this.roomStatusField.innerHTML = '';
    this.roomImagesField.innerHTML = '';
    this.currentRoomPanel.hidden = true;
  }

  _showCurrentRoomPanel({name = '', length = 0, capacity = 0}) {
    this.currentRoomPanel.hidden = false;
    this.roomStatusField.innerHTML = `Room ${name} waiting... ${length}/${capacity}`;
  }

  _hidePaginatorPanel() {
    this.paginatorPanel.style.display = 'none';
  }

  _showPaginatorPanel() {
    this.paginatorPanel.style.display = 'flex';
  }

  _notFoundRoomPanelShow() {
    this.roomNotFoundPanel.hidden = false;
  }

  _notFoundRoomPanelHide() {
    this.roomNotFoundPanel.hidden = true;
  }

  _clearAllRoomsPanels() {
    this.freeRoomContainer.innerHTML = ''
    this.busyRoomContainer.innerHTML = '';
  }

  _addFreeRoom(room : any) {
    this.freeRoomContainer.innerHTML = lobbyTemplateFreeRoom({ room : room }) + this.freeRoomContainer.innerHTML;
  }

  _addBusyRoom(room : any) {
    this.busyRoomContainer.innerHTML = lobbyTemplateBusyRoom({ room : room }) + this.busyRoomContainer.innerHTML;
  }


  _changeRoomStringColor({type = 'free', id = 0, typeColor = 1}) {
    let elements = [];
    if (type === 'free') {
      elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
    } else if (type === 'busy') {
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
    const newId = elements.length - 1 - id;
    elements[newId].style.backgroundColor = colorString;
  }

  _updateRoomRow(info : any) {
    const num = info.num
    const type = info.type;
    const data = info.data
    if (type === 'busy') {
      const elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
      const newNum = elements.length - 1 - num;
      elements[newNum].querySelector('.lobby__players').innerHTML = `${data.players.connections.length}/${data.players.capacity} players`;
      elements[newNum].querySelector('.lobby__observers').innerHTML = data.observers.get.length;
      elements[newNum].querySelector('.lobby__status').innerHTML = this._getStatusByCode(data.status);
    } else if (type === 'free'){
      const elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
      const newNum = elements.length - 1 - num;
      elements[newNum].querySelector('.lobby__players').innerHTML = `${data.players.connections.length}/${data.players.capacity} players`;
    }
  }

  _deleteRoomRow(info : any) {
    const num = info.num
    const type = info.type;
    let elements;
    if (type === 'busy') {
      elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
      
    } else if (type === 'free'){
      elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
    }
    const newNum = elements.length - 1 - num;
    elements[newNum].parentNode.removeChild(elements[newNum]);
  }


  _clickOnFreeRoom(e : any) {
    let target = e.target;
    while (!target.classList.contains('lobby__free_room') && !target.classList.contains('lobby__busy_room')) {
      target = target.parentNode;
      if (!target.classList) {
        return;
      }
    }

    if (target.classList.contains('lobby__busy_room')) { 
      const elements = [].slice.call((document.querySelectorAll('.lobby__busy_room')));
      const num = elements.indexOf(target);
      const newNum = elements.length - 1 - num;
      Bus.emit('clickOnFreeRoom', {type : 'busy', num : newNum});
    } else {
      const elements = [].slice.call((document.querySelectorAll('.lobby__free_room')));
      const num = elements.indexOf(target);
      const newNum = elements.length - 1 - num;
      Bus.emit('clickOnFreeRoom', {type : 'free', num : newNum});
    }
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

  

  

}