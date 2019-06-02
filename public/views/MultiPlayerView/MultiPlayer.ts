/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./MultiPlayer.pug');
import MathGame from '../../utils/math';
import BaseView from '../BaseView';
import { MineSweeper } from '../../game/minesweeper';
import { Timer } from '../../utils/timer/timer';
import { checkAuth } from '../../utils/user';
import Bus from '../../utils/bus';
import bus from '../../utils/bus';
import router from '../../main';
/** */
export default class MultiPlayerView extends BaseView {
  cellsize: number;
  cellNumbersX: number;
  cellNumbersY: number;
  minesCount: number;
  start: boolean;
  timer: Timer;
  maxPointsCount: number;
  minTimeCount: string;
  openCellsCount: number;
  pointsCount: number;
  leftClicksCount: number;
  rightClicksCount: number;
  minesRemainedCount: any;
  mineSweeper: MineSweeper;
  BBBVCount: any;
  difficult: number;
  startTimeFlag: { hour: number; minute: number; seconds: number; };
  flagPlacing: boolean;
  startGame: boolean;
  players: any[];
  playersListContainer: any;
  myID: number;
  colorArr: string[];
  fieldMatrix: any[];
  flagCoords: { x: number; y: number; };
  curPath: string;
  cells: any;
  cellNum: number;
  run: any;
  timerId: NodeJS.Timeout;
  gameTime: { hour: number; minute: number; seconds: number; };
  quitDocElement: any;
  countCells: number;
  countOpenCells: number;
  countMines: any;
  flagPlaceManualy: boolean;
  observerMode: boolean;
  chatInfoButton: any;
  infoPanelMode: any;
  infoContainer: any;
  chatContainer: any;
  oncontextmenu: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  restartButton: any;
  timeInSeconds: any;
  isGameOver: boolean;
  observers: any;
  messageCount: number;
  myRoomId: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.parent = parent;
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 20;
    this.cellsize = 50;
    this.difficult = 1;
    this.minesCount = 20;
    this.flagPlacing = true;
    this.startGame = false;
    this.players = [];
    this.observers = [];

    this.flagCoords = { x: 0, y: 0 };
    this.myID = 0;
    this.isGameOver = false;
    this.infoPanelMode = true;
    this.myRoomId = '';
    this.observerMode = false;
    this.messageCount = 0;
    this.colorArr = ['#b6b4ca', '#cab4be', '#b4cabd', '#cac7b4', '#cab4b4', '#dedede', '#94c9b4', '#b9bfc9'];
    this.startTimeFlag = { hour: 0, minute: 0, seconds: 10 };
    this.gameTime = { hour: 0, minute: 10, seconds: 0 };
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'multiplayerView');
    Bus.on('busAllOffMultiplayer', this._busAllOff.bind(this), 'multiplayerView');
  }

  _busAllOn() {
    Bus.on('leftClickOnCell', this._clickOnCell.bind(this), 'multiplayerView');
    Bus.on('rightClickOnCell', this._rightСlickOnCell.bind(this), 'multiplayerView');
    Bus.on('updateFieldWS', this._updateField.bind(this), 'multiplayerView');
    Bus.on('updatePointsWS', this._updatePoints.bind(this), 'multiplayerView');
    Bus.on('roomActionWS', this._roomAction.bind(this), 'multiplayerView');
    Bus.on('changeFlagSetWS', this._changeFlagSet.bind(this), 'multiplayerView');
    Bus.on('roomObserverEnterWS', this._getObservers.bind(this), 'multiplayerView');
    Bus.on('roomStatusWS', this._getStatus.bind(this), 'multiplayerView');
    Bus.on('getChatMessage', this._updateCountMessage.bind(this), 'multiplayerView' )
    Bus.on('clickOnYesAskMessage', this._restartClick.bind(this), 'multiplayerView' )
    
    this.isGameOver = false;
    Bus.on('gameOwerWS', this._gameOver.bind(this), 'multiplayerView');
    Bus.on('sendRoom', this._getRoom.bind(this), 'multiplayerView');
  }

  _busAllOff() {
    Bus.off('leftClickOnCell', this._clickOnCell.bind(this), 'multiplayerView');
    Bus.off('rightClickOnCell', this._rightСlickOnCell.bind(this), 'multiplayerView');
    Bus.off('updateFieldWS', this._updateField.bind(this), 'multiplayerView');
    Bus.off('updatePointsWS', this._updatePoints.bind(this), 'multiplayerView');
    Bus.off('roomActionWS', this._roomAction.bind(this), 'multiplayerView');
    Bus.off('changeFlagSetWS', this._changeFlagSet.bind(this), 'multiplayerView');
    Bus.off('roomObserverEnterWS', this._getObservers.bind(this), 'multiplayerView');
    Bus.off('roomStatusWS', this._getStatus.bind(this), 'multiplayerView');
    Bus.off('gameOwerWS', this._gameOver.bind(this), 'multiplayerView');
    Bus.off('sendRoom', this._getRoom.bind(this), 'multiplayerView');
    Bus.off('clickOnYesAskMessage', this._restartClick.bind(this), 'multiplayerView' )
  }
  /**
   *
  */
  render() {
    super.render();
    Bus.emit('busAllOffSinglePlayer');
    Bus.emit('addField', { container: '.multi_player__field_container', parent: this.parent });
    Bus.emit('addMessage', { container: '.multi_player__message_container', parent: this.parent });
    Bus.emit('addAskMessage', { container: '.multi_player__message_ask_container', parent: this.parent });
    Bus.emit('addPlayersList', '.multi_player__playerlist_container');
    Bus.emit('addGameActions', '.multi_player_actions_container');
    Bus.emit('addChat', { container: '.multi_player__chat_container', parent: this.parent, place: 'multiplayer'  });
    Bus.emit('changeTitleRestartButton', 'Start');
    Bus.emit('messageBoxHide', true);
    Bus.emit('messageAskBoxHide', true);
    
    this.infoContainer = document.querySelector('.multi_player__info_container');
    this.chatContainer = document.querySelector('.multi_player__chat_container');
    this.chatContainer.style.display = 'none';
    this.infoContainer.style.display = 'flex';
    this.infoPanelMode = true;
    this.quitDocElement = document.querySelector('.game__multi_quit_button');
    this.chatInfoButton = document.querySelector('.multi_player__button_chat');
    this.restartButton = document.querySelector('.multi_player__button_restart');
    this.restartButton.addEventListener('click', this._restartClick.bind(this));
    this.chatInfoButton.addEventListener('click', this._chatInfoClick.bind(this));
    this.quitDocElement.addEventListener('click', this._quitClick.bind(this));
    this.restartButton.style.display = 'none';
    this._busAllOn();
    this.timer = new Timer('.multi_player__timer', this._timeIsOver.bind(this));
    Bus.emit("ClearMessagesGameActions")
    this._showMap();
    this.oncontextmenu = document.body.oncontextmenu
    document.body.oncontextmenu = function (e) {
      return false;
    };
  }


  _currentPathSignalFunc(path: string) {
    if (path === '/multi_player') {
      this._busAllOn();
      this.chatContainer.style.display = 'none';
      this.infoContainer.style.display = 'flex';
      this.infoPanelMode = true;
      Bus.emit('busAllOffSinglePlayer');
      Bus.emit('addField', { container: '.multi_player__field_container', parent: this.parent });
      Bus.emit('addChat', { container: '.multi_player__chat_container', parent: this.parent, place: 'multiplayer'  });
      Bus.emit('addMessage', { container: '.multi_player__message_container', parent: this.parent });
      Bus.emit('addPlayersList', '.multi_player__playerlist_container');
      Bus.emit('changeTitleRestartButton', 'Start');
      Bus.emit('messageBoxHide', true);
      Bus.emit('messageAskBoxHide', true);
      Bus.emit("ClearMessagesGameActions");
      this.chatInfoButton.innerHTML = 'Chat';

      this.restartButton.style.display = 'none';
      this._showMap();
      this.curPath = path;
      document.body.oncontextmenu = function (e) {
        return false;
      };
    } else {
      if (this.curPath === '/multi_player') {
        this._stop_reset_timer();
        this.curPath = '';
        this._busAllOff();
        document.body.oncontextmenu = this.oncontextmenu;
      }
    }
  }

  /** */
  _chatInfoClick() {
    this.infoPanelMode = !this.infoPanelMode
    if (!this.infoPanelMode) {
      this.chatInfoButton.innerHTML = 'Game info';
      this.infoContainer.style.display = 'none';
      this.chatContainer.style.display = 'flex';
    } else {
      this.chatInfoButton.innerHTML = 'Chat';
      this.infoContainer.style.display = 'flex';
      this.chatContainer.style.display = 'none';
      this.messageCount = 0;
    }    
  }

  _restartClick() {
    Bus.emit('restartMultiplayer');
  }

  /** */
  _showMap() {
    this.fieldMatrix = [];
    
    this.fieldMatrix = new Array(this.cellNumbersY);
    for (let i = 0; i < this.cellNumbersY; i++) {
      this.fieldMatrix[i] = new Array(this.cellNumbersX).fill(0);
    }
    
    this.openCellsCount = 0;
    this.pointsCount = 0;

    Bus.emit('messageBoxHide', true)
    Bus.emit('messageAskBoxHide', true);
    
    Bus.emit('renderField', { width: this.cellNumbersX, height: this.cellNumbersY, cellSize: this.cellsize })

    return;
  }

  _getRoom(data: any) {
 
    if (!data.isPlayer) {
      this.observerMode = true;
    } else {
      this.observerMode = false;
      this.flagCoords = { x: data.flag.cell.x, y: data.flag.cell.y };
    }

    this.timeInSeconds = data.room.settings.play + data.room.settings.prepare;
    this.myRoomId = data.room.id;
    this._getPlayers(data);
    this._getObservers(data.room.observers);
    this._getField(data.room.field);

    Bus.emit('ClearMessagesGameActions');
    data.room.history.forEach((element: any)  => {
      if (element.action != 1 && element.action != 2 && element.action != 4 && element.action != 5) {
        this._roomAction({value : element});
      }
    })
    Bus.emit('addMessageInChatHistory', {data: data, place: 'room'});
    this.countOpenCells = data.room.field.history.length;
    this.countCells = data.room.field.width * data.room.field.height;
    this.countMines = data.room.field.mines;
    const prcentOpen = Math.round((this.countOpenCells / (this.countCells - this.countMines) * 100));
    Bus.emit('progressGameChange', prcentOpen);
  }

  _getStatus(data : any) {
    let timeLeft = data.value.time;
    if (data.value.status === 2) { //flag placing
      this.timer.stop();
      this.gameTime.hour = Math.floor(this.timeInSeconds / 3600);
      this.gameTime.minute = Math.floor((this.timeInSeconds - this.gameTime.hour * 3600) / 60);
      this.gameTime.seconds = Math.floor(this.timeInSeconds - this.gameTime.minute * 60 - this.gameTime.hour * 3600);
      this.startTimeFlag.seconds = timeLeft;
      this.timer.start(this.startTimeFlag);
      this.startGame = false;
      this.flagPlacing = true;
      this.flagPlaceManualy = false;
      Bus.emit('ClearMessagesGameActions');
      Bus.emit('addMessageInGameActions', 'Stage of flag placement')
    } else if (data.value.status === 3) {
      this.timer.stop();
      this.gameTime.hour = Math.floor(timeLeft / 3600);
      this.gameTime.minute = Math.floor((timeLeft - this.gameTime.hour * 3600) / 60);
      this.gameTime.seconds = Math.floor(timeLeft - this.gameTime.minute * 60 - this.gameTime.hour * 3600);
      this.timer.start(this.gameTime);
      this.startGame = true;
      this.flagPlaceManualy = false;
      if (!this.observerMode) {
        this.flagPlacing = false;
        if (!this.flagPlaceManualy) {
          Bus.emit('setUnsetFlagMultiOnCell', { x: this.flagCoords.x, y: this.flagCoords.y, type: 'flag' })
        }
        this.startGame = true;
      }
      
      
      Bus.emit('addMessageInGameActions', 'Game begins!');
    }
  }

  _quitClick() {
    this._stop_reset_timer();
    Bus.emit('leaveRoom', 14);
    Bus.emit('deleteRoom', this.myRoomId);
    Bus.emit('hideCurrentRoomPanel');
  }

  _timeIsOver() {
    if (this.startGame) {
      return;
    }    
  }

  _createColorForPlayer(i: number) {
    i = i % this.colorArr.length;
    return this.colorArr[i];
  }

  _getField(data: any) {
    this.cellNumbersX = data.width;
    this.cellNumbersY = data.height;
    this.countCells = this.cellNumbersX * this.cellNumbersY;
    this.countMines = data.mines; // обнова
    this.countOpenCells = 0;
    this._showMap();
    data.history.forEach((element: any)  => {
      let color = '#b9c0c9';
      const my = element.playerID === this.myID;
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === element.playerID) {
          color = this.players[i].color;
          break;
        }
      }
      Bus.emit('openCell', { x: element.x, y: element.y, type: element.value, color: color, my: my })
    });
  }

  _getPlayers(data: any) {
    this.players = [];
    this.myID = 0;
    Bus.emit('clearParametersPlayerList');
    const dataConnections = data.room.players.connections.get;
    const dataPlayers = data.room.players.players;
    const colorRandom = MathGame.randomInteger(0, 8);

    dataConnections.forEach((item: any, i: number) => {
      let color = this._createColorForPlayer(i + colorRandom)
      let me = false;
      if (data.you.id === item.user.id) {
        this.myID = dataPlayers[item.index].ID;
        me = true;
      }
      const points = Math.round(dataPlayers[item.index].Points);
      Bus.emit('addPlayer', { player: item.user, points : points, color: color, me: me });
      this.players.push({ user: item.user, id: item.user.id, points: Math.round(dataPlayers[item.index].Points), me: me, color: color });
    });
  }

  _getObservers(data: any) {
    if (data.value) {
      Bus.emit('addObserver', { player: data.value.User });
      this.observers.push(data.value.User);
    } else {
      const observerArray = data.get;
      observerArray.forEach((item: any, i: number) => {
        Bus.emit('addObserver', { player: item.user });
        this.observers.push(item.user);
      });
    }
  }

  _updateField(data: any) {
    const cells = data.value;
    let color = '#b9c0c9';
    const my = cells[0].playerID === this.myID;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === cells[0].playerID) {
        color = this.players[i].color;
        break;
      }
    }
    this.countOpenCells += cells.length;
    cells.forEach((item: any, i: number) => {
      Bus.emit('openCell', { x: item.x, y: item.y, type: item.value, color: color, my: my })
    });

    const prcentOpen = Math.round((this.countOpenCells / (this.countCells - this.countMines) * 100));
    Bus.emit('progressGameChange', prcentOpen);
  }
  _updatePoints(data: any) {
    const points = data.value;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === points.ID) {
        Bus.emit('updatePoints', { number: i, points: Math.round(points.Points) });
        this.players[i].points = Math.round(points.Points);
        break;
      }
    }
  }

  _gameOver(data: any) {
    this.timer.stop();
    if (data.value.timer) {
      this.timer.reset({});
    }
    const dataPlayers = data.value.players;
    const winners = data.value.winners;
    this._openAllCells(data.value.cells);
    for (let i = 0; i < dataPlayers.length; i++) {
      let flagNotWinner = true;
      for (let j = 0; j < winners.length; j++) {
        if (i === winners[j]) {
          Bus.emit('winPlayer', i);
          Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} win!`);
          if (dataPlayers[i].ID === this.myID) {
            Bus.emit('showTextInMessageBox', 'You win!');
          }
          flagNotWinner = false;
          break;
        }
      }
      if (dataPlayers[i].ID === this.myID && flagNotWinner && !this.isGameOver) {
        Bus.emit('showTextInMessageBox', 'You lose!');
      }
    }
    if (!this.observerMode) {
      this.restartButton.style.display = 'flex';
    }
    setTimeout(this._writeGameOver.bind(this), 500);
    if (this.observerMode) {
      Bus.emit('showTextInMessageBox', 'Game over!');
    }
    
  }

  _writeGameOver() {
    Bus.emit('addMessageInGameActions', `Game over!`);
  }

  _roomAction(data: any) {
    const action = data.value;
    let boolObserverExit = false;
    if (action.action == 4) {
      for (let i = 0; i < this.observers.length; i++) {
        if (this.observers[i].id === action.player) {
          Bus.emit('delObserver', { player: this.observers[i] });
          this.observers.splice(i, 1);
          boolObserverExit = true;
          break;
        }
      }
      if (boolObserverExit) {
        return;
      }
    } 
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === action.player) {
        switch (action.action) {
          case 3:
            Bus.emit('reconnectPlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} reconnect!`);
            break;
          case 1:
            Bus.emit('reconnectPlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} reconnect!`);
            break;
          case 4:
            Bus.emit('disconnectPlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} disconnect`);
            break;
          case 7:
            Bus.emit('explosePlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} explose!`);
            if (this.myID === action.player) {
              this.isGameOver = true;
              Bus.emit('showTextInMessageBox', 'You lose!');
            }
            break;
          case 10:
            Bus.emit('findFlagPlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} lost his flag!`);
            if (this.myID === action.player) {
              this.isGameOver = true;
              Bus.emit('showTextInMessageBox', 'You lose!');
            }
            break;
          case 15:
            Bus.emit('timeIsOverPlayer', i);
            break;
          case 16:
            Bus.emit('showTextInMessageAskBox', `Player ${this.players[i].user.name}<br>wants revenge!`);
            break;
        }
        break;
      }
    }
  }

  _stop_reset_timer() {
    this.timer.stop();
    this.timer.reset({});
  }

  /** */
  _clickOnCell(coordinatesStruct: any) {

    if (!this.flagPlacing && !this.startGame || this.observerMode) {
      return;
    }
    const x = parseInt(coordinatesStruct.x);
    const y = parseInt(coordinatesStruct.y);
    if (this.fieldMatrix[x][y] == 1) {
      return;
    }
    this.fieldMatrix[x][y] = -1;
    Bus.emit('sendCellWS', { x: x, y: y });
    if (this.flagPlacing) {
      if (this.flagPlaceManualy) {
        {
          Bus.emit('setUnsetFlagMultiOnCell', { x: this.flagCoords.x, y: this.flagCoords.y, type: 'closing' });
        }
      }
      this.flagCoords = { x: x, y: y };
      Bus.emit('setUnsetFlagMultiOnCell', { x: x, y: y, type: 'flag' })
      this.flagPlaceManualy = true;
    }
    return;
  }

  /** */
  _rightСlickOnCell(coordinatesStruct: any) {
    if (!this.startGame || this.observerMode) {
      return;
    }
    const x = parseInt(coordinatesStruct.x);
    const y = parseInt(coordinatesStruct.y);
    if (this.fieldMatrix[x][y] === 0) {
      console.log('flag');
      Bus.emit('setUnsetFlagOnCell', { x: x, y: y, type: 'flag' });
      this.fieldMatrix[x][y] = 1;
    } else if (this.fieldMatrix[x][y] === 1) {
      console.log('closing');
      Bus.emit('setUnsetFlagOnCell', { x: x, y: y, type: 'closing' });
      this.fieldMatrix[x][y] = 0;
    }
    return;
  }

  _changeFlagSet(data: any) {
    const coords = data.value;
    Bus.emit('addMessageInGameActions', `The location of your flag coincided with the opponen`);
    Bus.emit('addMessageInGameActions', `We chose a new location for your and his flags`);
    Bus.emit('setUnsetFlagMultiOnCell', { x: this.flagCoords.x, y: this.flagCoords.y, type: 'closing' })
    Bus.emit('setUnsetFlagMultiOnCell', { x: coords.x, y: coords.y, type: 'flag' })
    this.flagCoords.x = coords.x;
    this.flagCoords.y = coords.y;

  }

  /** */
  _openAllCells(cells: []) {
    cells.forEach((item: any, i: number) => {
      Bus.emit('openCell', { x: item.x, y: item.y, type: item.value })
    });
    Bus.emit('progressGameChange', 100);
    return;
  }

  _updateCountMessage() {
    if (this.infoPanelMode) {
      this.messageCount++;
      this.chatInfoButton.innerHTML = `Chat (${this.messageCount})`;
    }  
  }
}
