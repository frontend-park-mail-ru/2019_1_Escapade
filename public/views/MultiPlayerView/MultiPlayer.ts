/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./MultiPlayer.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';
import { MineSweeper } from '../../game/minesweeper';
import { Timer } from '../../game/timer';
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
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 20;
    this.cellsize = 50;
    this.difficult = 1;
    this.minesCount = 20;
    this.flagPlacing = true;
    this.startGame = false;
    this.players = [];
    Bus.on('leftClickOnCell', this._clickOnCell.bind(this));
    Bus.on('rightClickOnCell', this._rightСlickOnCell.bind(this));
    Bus.on('updateFieldWS', this._updateField.bind(this));
    Bus.on('updatePointsWS', this._updatePoints.bind(this));
    document.body.oncontextmenu = function (e) {
      return false;
    };
    this.startTimeFlag = {hour : 0, minute : 0, seconds : 10};
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this));
  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    Bus.emit('addListenersButtonsGame');
    Bus.emit('addListenersField');
    Bus.emit('addListenersMessage');
    Bus.emit('addListenersPlayersList');
    Bus.emit('changeTitleRestartButton', 'Start');
    Bus.on('sendPlayersToRoom', this._getPlayers.bind(this));
    
    this.timer = new Timer('multi_player__timer', this._timeIsOver.bind(this));
    
    this._showMap();
    
    console.log('render');
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/multi_player') {
      this._showMap();
      console.log('_currentPathSignalFunc multi_player ');
    } else {
      console.log('_currentPathSignalFunc else ');
      this._stop_reset_timer();
    }
  }

  _timeIsOver() {
    this.startGame = true;
    console.log('time is over');
  }

  _getPlayers(data : any) {
    const dataConnections = data.value.players.connections;
    const dataPlayers = data.value.players.players;
    this.players = [];
    dataConnections.forEach((item : any, i : number) => {
      this.players.push({user : item.user, id : dataPlayers[item.index].ID});
    });
    console.log('this.players ' + this.players[0].id + ' ' + this.players[1].id);
    Bus.emit('addPlayers',data);
  }

  /** */
  _showMap() {
    this.flagPlacing = true;
    this.startGame = false;
    console.log('_showMap');
    this.openCellsCount = 0;
    this.pointsCount = 0;
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;

    Bus.emit('messageBoxHide', true)
    Bus.emit('renderField',{width : this.cellNumbersX, height : this.cellNumbersY, cellSize : this.cellsize})

    this.timer.start(this.startTimeFlag);
    return;
  }

  _updateField(data : any) {
    const cells = data.value;
    cells.forEach((item : any, i : number) => {
      if (item.value < 10) {
        Bus.emit('openCell', {x: item.x, y: item.y, type: item.value })
      }
    });
  }

  _updatePoints(data : any) {
    
  }

  _stop_reset_timer() {
    this.timer.stop();
    const timeStr = this.startTimeFlag.hour + ':' + this.startTimeFlag.minute + ':' + this.startTimeFlag.seconds;
    console.log('timeStr ' + timeStr);
    this.timer.reset(this.startTimeFlag);
  }

  

  /** */
  _clickOnCell(coordinatesStruct : any) {
    if (!this.flagPlacing && !this.startGame) {
      return;
    }
    const x = parseInt(coordinatesStruct.x);
    const y = parseInt(coordinatesStruct.y);
    Bus.emit('sendCellWS', {x : x, y : y});
    if (this.flagPlacing) {
      Bus.emit('setUnsetFlagMultiOnCell', {x : x, y : y, type : 'flag'})
      this.flagPlacing = false;
    }
    
    //const prcentOpen = Math.round((this.openCellsCount / (this.cellNumbersX * this.cellNumbersY - this.minesCount)) * 100);
    //Bus.emit('progressGameChange', prcentOpen);
    //Bus.emit('pointsStatisticsChange', this.pointsCount);
    //this._checkOnWinning();
    return;
  }

  /** */
  _rightСlickOnCell(coordinatesStruct : any) {
    if (!this.startGame) {
      return;
    }
    const x = parseInt(coordinatesStruct.x);
    const y = parseInt(coordinatesStruct.y);
    const typeOfCell = this.mineSweeper.putRemoveFlag(x, y); // 0 - закрыта; 1 - открыта; 2 - флаг
    if (typeOfCell == 1) {
      return;
    }
    Bus.emit('rightClicksStatisticsChange', 1);
    if (typeOfCell == 0) {
      Bus.emit('minesStatisticsChange', 1);
      Bus.emit('setUnsetFlagOnCell', {x : x, y : y, type : 'closing'});
      return;
    }

    if (typeOfCell == 2) {
      Bus.emit('minesStatisticsChange', -1);
      Bus.emit('setUnsetFlagOnCell', {x : x, y : y, type : 'flag'});
    }
    return;
  }

  /** */      
  _openCels(arrCells: any) {
    for (let i = 0; i < arrCells.length; i++) {
      const x = arrCells[i][0];
      const y = arrCells[i][1];
      Bus.emit('openCell', {x : x, y : y, type : this.mineSweeper.map[x][y]});
    }
  }

  /** */
  _openAllCels() {
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        Bus.emit('openCell', {x : x, y : y, type : this.mineSweeper.map[x][y]});
      }
    }
    Bus.emit('progressGameChange', 100);
    return;
  }
}
