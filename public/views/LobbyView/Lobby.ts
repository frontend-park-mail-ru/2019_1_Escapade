
import Bus from '../../utils/bus';

/**
 *
 */
export default class Lobby {
  currentRoomId: number;
  currentRoomName: string;
  roomsHTML: any[];
  rooms: any[];
  busyRooms: any[];
  createRoomButton: any;
  leaveRoomButton: any;
  roomStatusField: any;
  roomImagesField: any;
  currentRoomPanel: any;
  freeRoomContainer: any;
  busyRoomContainer: any;
  roomNotFoundPanel: any;
  idPlayerBackend: any;
  /**
   *
   * @param {*} parent
   */
  constructor() {
    this._addListeners();
  }

  /** */
  _addListeners() {
    this.currentRoomId = -1;
    this.currentRoomName = '';
    this.roomsHTML = [];
    this.rooms = [];
    this.busyRooms = [];
  
    Bus.on('updateCurrentRoom', this._updateCurrentRoom.bind(this), 'lobbyView');
    Bus.on('createRoomEvent', this._createRoomEvent.bind(this), 'lobbyView');
    Bus.on('leaveRoomEvent', this._leaveRoom.bind(this), 'lobbyView');
    Bus.on('clickOnFreeRoom', this._clickOnFreeRoom.bind(this), 'lobbyView');
    
    Bus.on('updateRooms', this._updateRooms.bind(this), 'lobbyView');
    Bus.on('addRoom', this._addRoom.bind(this), 'lobbyView');
    Bus.on('updateRoom', this._updateRoom.bind(this), 'lobbyView');
    Bus.on('deleteRoom', this._deleteRoom.bind(this), 'lobbyView');

  }

  _updateCurrentRoom(data : any) {
    this.currentRoomName = data.name;
    this.currentRoomId = 0
    for (let i = 0; i < this.rooms.length; i++) {
      if (data.id === this.rooms[i].id) {
        this.currentRoomId = i;
        break;
      }
    }
    Bus.emit('changeRoomStringColor',{type : 'free', id : this.currentRoomId, typeColor : 1})
    Bus.emit('showCurrentRoomPanel', data);
  }

  _createRoomEvent() {
    this.currentRoomId = -2;
    Bus.emit('showRoomSettingsPanel',this.rooms.length);
  }

  _leaveRoom() {
    console.log('_leaveRoom')
    Bus.emit('hideCurrentRoomPanel');
    this.currentRoomId = -1;
    this.currentRoomName = '';
    Bus.emit('leaveRoom', 14);
  }


  _addRoom(data : any) {
    Bus.emit('hideNotFoundRoomPanel');
    let gameTime = data.settings.play;
    
    const d = [3600, 60, 1];
    const time = [];
    let i = 0;
    while (i < d.length) {
      let t = Math.floor(gameTime / d[i]);
      gameTime -= t * d[i];
      let strT = ((t >= 0 && t < 10) ? '0' + t : t).toString();
      time.push(strT);
      i++;
    }

    const room = {name : data.name, playersCount : data.players.connections.get.length,
      playersCapacity : data.players.capacity,
      width : data.field.width, height : data.field.height, mines : data.field.mines, time : `${time[0]}:${time[1]}:${time[2]}`,
      observersCount : data.observers.get.length, status : this._getStatusByCode(data.status)}
    
    if (data.status === 3) {   // busy room
      this.busyRooms.push(data);
      Bus.emit('addBusyRoomView', room);
    } else {
      this.rooms.push(data);
      Bus.emit('addFreeRoomView', room);
    }

  }

  _updateRoom(data : any) {
    
    if (data.status === 3) {
      for (let i = 0; i < this.busyRooms.length; i++) {
        if (this.busyRooms[i].id === data.id) {
          Bus.emit('updateRoomRow', {type : 'busy', data : data, num : i});
          break;
        }
      }
    } else {
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === data.id) {
          Bus.emit('updateRoomRow', {type : 'free', data : data, num : i});
          break;
        }
      }
    }

    //console.log('currRoomId ', this.currentRoomId, this.rooms)
    
    if (this.currentRoomId < 0 || this.currentRoomId >= this.rooms.length) {
      return;
    }
    //console.log(data, ' ',  data.id, ' eeee ', this.rooms[this.currentRoomId].id)
    if (this.rooms[this.currentRoomId].id === data.id) {
        Bus.emit('showCurrentRoomPanel', {name: data.name, length: data.players.connections.get.length, capacity: data.players.capacity});
    }
  }

  _deleteRoom(data : any) {
    console.log(this.busyRooms, ' ', this.rooms, ' ', data)
    let busyRoomsDelete = false;
    for (let i = 0; i < this.busyRooms.length; i++) {
      if (this.busyRooms[i].id === data) {
        Bus.emit('deleteRoomRow', {type : 'busy', num : i});
        this.busyRooms.splice(i, 1);
        busyRoomsDelete = true;
        break;
      }
    } 
    
    if (!busyRoomsDelete) {
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === data) {
          Bus.emit('deleteRoomRow', {type : 'free', num : i});
          this.rooms.splice(i, 1);
          break;
        }
      }
    }

    if (this.rooms.length === 0 && this.busyRooms.length === 0) { // not found rooms
      Bus.emit('showNotFoundRoomPanel');
    }
  }

  _updateRooms(data : any) {
    console.log('_updateRooms')
    this.currentRoomId = -1;
    this.rooms = []
    this.busyRooms = []
    let lobby = data.lobby;
  
    Bus.emit('clearAllRoomsPanels');
    Bus.emit('hideCurrentRoomPanel');
    Bus.emit('hideNotFoundRoomPanel');
    
    if (lobby.allRooms.get.length === 0) { // not found rooms
      Bus.emit('showNotFoundRoomPanel');
    }

    lobby.allRooms.get.forEach((item : any) => {

      let gameTime = item.settings.play;
      const d = [3600, 60, 1];
      const time = [];
      let i = 0;
      while (i < d.length) {
        let t = Math.floor(gameTime / d[i]);
        gameTime -= t * d[i];
        let strT = ((t >= 0 && t < 10) ? '0' + t : t).toString();
        time.push(strT);
        i++;
      }

      const room = {name : item.name, playersCount : item.players.connections.get.length,
        playersCapacity : item.players.capacity,
        width : item.field.width, height : item.field.height, mines : item.field.mines, time : `${time[0]}:${time[1]}:${time[2]}`,
        observersCount : item.observers.get.length, status : this._getStatusByCode(item.status)}
      
      if (item.status === 3 || item.status === 2) {   // busy room
        this.busyRooms.push(item);
        Bus.emit('addBusyRoomView', room);
      } else {
        this.rooms.push(item);
        Bus.emit('addFreeRoomView', room);
      }
      
    });
  }

  _clickOnFreeRoom({type = 'free', num = 0}) {
    if (this.currentRoomId >= 0) {
      Bus.emit('changeRoomStringColor',{type : 'free', id : this.currentRoomId, typeColor : 0})
    }

    if (type === 'busy') { 
      Bus.emit('changeRoomStringColor',{type : 'busy', id : num, typeColor : 2})
      Bus.emit('connectToRoom', this.busyRooms[num].id)
    } else if (type === 'free'){
      this.currentRoomId = num;
      Bus.emit('changeRoomStringColor',{type : 'free', id : this.currentRoomId, typeColor : 1})
      const info = {name : this.rooms[this.currentRoomId].name, length : this.rooms[this.currentRoomId].players.connections.get.length,
        capacity : this.rooms[this.currentRoomId].players.capacity}
      this._updateCurrentRoom(info);
      Bus.emit('connectToRoom', this.rooms[this.currentRoomId].id)
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
    mode = 'Normal'; //  заглушка
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