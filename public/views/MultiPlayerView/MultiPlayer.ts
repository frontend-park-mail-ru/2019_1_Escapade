/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./MultiPlayer.pug');
import MathGame from '../../utils/math';
import BaseView from '../BaseView';
import { User } from '../../utils/user';
import { MineSweeper } from '../../game/minesweeper';
import { Timer } from '../../utils/timer/timer';
import { checkAuth } from '../../utils/user';
import Bus from '../../utils/bus';
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
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.parent = parent;
    console.log('this.parent ', this.parent)
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 20;
    this.cellsize = 50;
    this.difficult = 1;
    this.minesCount = 20;
    this.flagPlacing = true;
    this.startGame = false;
    this.players = [];
    this.flagCoords = { x: 0, y: 0 };
    this.myID = 0;
    this.infoPanelMode = true;
    this.observerMode = false;
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
    Bus.on('roomObserverExitWS', this._exitObserver.bind(this), 'multiplayerView');

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
    Bus.off('roomObserverExitWS', this._exitObserver.bind(this), 'multiplayerView');

    Bus.off('gameOwerWS', this._gameOver.bind(this), 'multiplayerView');
    Bus.off('sendRoom', this._getRoom.bind(this), 'multiplayerView');
  }
  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    Bus.emit('busAllOffSinglePlayer');
    Bus.emit('addField', { container: '.multi_player__field_container', parent: this.parent });
    Bus.emit('addMessage', { container: '.multi_player__message_container', parent: this.parent });
    Bus.emit('addPlayersList', '.multi_player__playerlist_container');
    Bus.emit('addGameActions', '.multi_player_actions_container');
    Bus.emit('addChat', '.multi_player__chat_container');
    Bus.emit('changeTitleRestartButton', 'Start');
    Bus.emit('messageBoxHide', true);
    this.infoContainer = document.querySelector('.multi_player__info_container');
    this.chatContainer = document.querySelector('.multi_player__chat_container');
    this.chatContainer.style.display = 'none';
    this.infoContainer.style.display = 'flex';
    this.infoPanelMode = true;
    this.quitDocElement = document.querySelector('.game__multi_quit_button');
    this.chatInfoButton = document.querySelector('.multi_player__button_chat');
    this.chatInfoButton.addEventListener('click', this._chatInfoClick.bind(this));
    this.quitDocElement.addEventListener('click', this._quitClick.bind(this));
    this._busAllOff();
    this._busAllOn();
    this.timer = new Timer('.multi_player__timer', this._timeIsOver.bind(this));
    Bus.emit("ClearMessagesGameActions")
    this._showMap();
    console.log('render');
  }


  _currentPathSignalFunc(path: string) {
    if (path === '/multi_player') {
      this._busAllOn();
      this.chatContainer.style.display = 'none';
      this.infoContainer.style.display = 'flex';
      this.infoPanelMode = true;
      Bus.emit('busAllOffSinglePlayer');
      Bus.emit('addField', { container: '.multi_player__field_container', parent: this.parent });
      Bus.emit('addMessage', { container: '.multi_player__message_container', parent: this.parent });
      Bus.emit('addPlayersList', '.multi_player__playerlist_container');
      Bus.emit('changeTitleRestartButton', 'Start');
      Bus.emit('messageBoxHide', true);
      Bus.emit("ClearMessagesGameActions")
      this._showMap();
      this.curPath = path;
      console.log('_currentPathSignalFunc multi_player ');
    } else {
      if (this.curPath === '/multi_player') {

        if (path !== '/lobby') {
          Bus.emit('leaveRoom', 4);
        }
        console.log('Ohohohohohoho');
        console.log('_currentPathSignalFunc else ');
        this._stop_reset_timer();
        this.curPath = '';
        this._busAllOff();
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
    }    
  }

  /** */
  _showMap() {
    this.fieldMatrix = [];
    this.flagPlaceManualy = false;
    this.fieldMatrix = new Array(this.cellNumbersY);
    for (let i = 0; i < this.cellNumbersY; i++) {
      this.fieldMatrix[i] = new Array(this.cellNumbersX).fill(0);
    }
    this.flagPlacing = true;
    this.startGame = false;
    console.log('_showMap');
    this.openCellsCount = 0;
    this.pointsCount = 0;

    Bus.emit('messageBoxHide', true)
    
    Bus.emit('renderField', { width: this.cellNumbersX, height: this.cellNumbersY, cellSize: this.cellsize })

    return;
  }

  _getRoom(data: any) {
    let dataRoomCreate = data.room.date;
    let dataNow = new Date(Date.now());
    let secondsLatency = 0;
    let timeInSeconds = data.room.settings.play - data.room.settings.prepare;
    /*secondsLatency += (dataNow.getHours() - parseInt(dataRoomCreate.substring(11,13))) * 3600;
    secondsLatency += (dataNow.getMinutes() - parseInt(dataRoomCreate.substring(14,16))) * 60;
    secondsLatency += dataNow.getSeconds() - parseInt(dataRoomCreate.substring(17,19));
    if (secondsLatency < data.room.settings.prepare) {
      this.timer.start(this.startTimeFlag);
      this.startTimeFlag.seconds = data.room.settings.prepare - secondsLatency;
      this.gameTime.hour = Math.floor(timeInSeconds / 3600);
      this.gameTime.minute = Math.floor((timeInSeconds - this.gameTime.hour * 3600)/ 60);
      this.gameTime.seconds = Math.floor(timeInSeconds - this.gameTime.minute * 60 - this.gameTime.hour * 3600);
      this.timer.start(this.startTimeFlag);
    } else {
      this.startTimeFlag.seconds = 0;
      secondsLatency -= data.room.settings.prepare;
      timeInSeconds -= secondsLatency;
      this.gameTime.hour = Math.floor(timeInSeconds / 3600);
      this.gameTime.minute = Math.floor((timeInSeconds - this.gameTime.hour * 3600)/ 60);
      this.gameTime.seconds = Math.floor(timeInSeconds - this.gameTime.minute * 60 - this.gameTime.hour * 3600) + 1;
      this.timer.start(this.gameTime);
    }*/
    this.gameTime.hour = Math.floor(timeInSeconds / 3600);
    this.gameTime.minute = Math.floor((timeInSeconds - this.gameTime.hour * 3600) / 60);
    this.gameTime.seconds = Math.floor(timeInSeconds - this.gameTime.minute * 60 - this.gameTime.hour * 3600);
    this.startTimeFlag.seconds = data.room.settings.prepare
    this.timer.start(this.startTimeFlag);
    Bus.emit('addMessageInGameActions', 'Stage of flag placement')
    Bus.emit('addMessageInChatHistory', data.room.messages)
    if (data.room.status === 3) {
      this.observerMode = true;
    } else {
      this.observerMode = false;
      this.flagCoords = { x: data.flag.x, y: data.flag.y };
    }

    this._getPlayers(data.room.players);
    this._getObservers(data.room.observers);
    this._getField(data.room.field);


  }

  _quitClick() {
    this._stop_reset_timer();
    Bus.emit('leaveRoom', 14);
  }

  _timeIsOver() {
    if (this.startGame) {
      return;
    }

    if (!this.observerMode) {
      if (this.flagPlacing) {
        this.flagPlacing = false;
        Bus.emit('setUnsetFlagMultiOnCell', { x: this.flagCoords.x, y: this.flagCoords.y, type: 'flag' })
      }
      this.startGame = true;
    }
    this.timer.start(this.gameTime);
    Bus.emit('addMessageInGameActions', 'Game begins!');
  }

  _createColorForPlayer(i: number) {
    while (i >= this.colorArr.length) {
      i = i - this.colorArr.length;
    }
    return this.colorArr[i];
  }

  _getField(data: any) {
    this.cellNumbersX = data.width;
    this.cellNumbersY = data.height;
    this.countCells = this.cellNumbersX * this.cellNumbersY;
    this.countMines = data.mines; // обнова
    this.countOpenCells = 0;
    this._showMap();
  }

  _getPlayers(data: any) {
    this.players = [];
    this.myID = 0;
    Bus.emit('clearParametersPlayerList');
    const dataConnections = data.connections.get;
    const dataPlayers = data.players;
    const colorRandom = MathGame.randomInteger(0, 8);
    console.log('dataConnections ', dataConnections.length);
    dataConnections.forEach((item: any, i: number) => {
      let color = this._createColorForPlayer(i + colorRandom)
      let me = false;
      if (User.name === item.user.name) {
        this.myID = dataPlayers[item.index].ID;
        me = true;
      }
      Bus.emit('addPlayer', { player: item.user, color: color, me: me });
      this.players.push({ user: item.user, id: dataPlayers[item.index].ID, points: dataPlayers[item.index].Points, me: me, color: color });
    });
  }

  _getObservers(data: any) {
    if (data.value) {
      Bus.emit('addObserver', { player: data.value.user });
    } else {
      const observerArray = data.get;
      observerArray.forEach((item: any, i: number) => {
        Bus.emit('addObserver', { player: item.user });
      });
    }
  }

  _exitObserver(data: any) {
    Bus.emit('delObserver', { player: data.value.user });
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
        Bus.emit('updatePoints', { number: i, points: points.Points });
        this.players[i].points = points.Points;
        break;
      }
    }
  }

  _gameOver(data: any) {
    this.timer.stop();
    const dataPlayers = data.value.players;
    this._openAllCells(data.value.cells);
    for (let i = 0; i < dataPlayers.length; i++) {
      if (!dataPlayers[i].Finished) {
        Bus.emit('winPlayer', i);
        Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} win!`);
      }
      if (dataPlayers[i].ID === this.myID) {
        if (dataPlayers[i].Finished) {
          Bus.emit('showTextInMessageBox', 'You lose!');
        } else {
          Bus.emit('showTextInMessageBox', 'You win!');
        }
      }
    }
    setTimeout(this._writeGameOver.bind(this), 500);
    
  }

  _writeGameOver() {
    Bus.emit('addMessageInGameActions', `Game over!`);
  }

  _roomAction(data: any) {
    const action = data.value;
    console.log(this.players);
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === action.player) {
        switch (action.action) {
          case 7:
            Bus.emit('explosePlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} explose!`);
            break;
          case 10:
            Bus.emit('findFlagPlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} lost his flag!`);
            break;
          case 4:
            Bus.emit('disconnectPlayer', i);
            Bus.emit('addMessageInGameActions', `Player ${this.players[i].user.name} disconnect`);
            break;
          case 15:
            Bus.emit('timeIsOverPlayer', i);
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
}
