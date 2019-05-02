/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./MultiPlayer.pug');
import MathGame from '../../utils/math';
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
  myID: number;
  colorArr: string[];
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
    this.myID = 0;
    this.colorArr = ['#b6b4ca', '#cab4be', '#b4cabd', '#cac7b4', '#cab4b4', '#dedede', '#94c9b4', '#b9bfc9'];
    Bus.on('leftClickOnCell', this._clickOnCell.bind(this));
    Bus.on('rightClickOnCell', this._rightСlickOnCell.bind(this));
    Bus.on('updateFieldWS', this._updateField.bind(this));
    Bus.on('updatePointsWS', this._updatePoints.bind(this));
    Bus.on('roomActionWS', this._roomAction.bind(this));
    
    Bus.on('gameOwerWS', this._gameOver.bind(this));
    
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

  /** */
  _showMap() {
    this.flagPlacing = true;
    this.startGame = false;
    console.log('_showMap');
    this.openCellsCount = 0;
    this.pointsCount = 0;
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.myID = 0;
    this.players = [];

    Bus.emit('messageBoxHide', true)
    Bus.emit('renderField',{width : this.cellNumbersX, height : this.cellNumbersY, cellSize : this.cellsize})

    this.timer.start(this.startTimeFlag);
    return;
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

  _fromDecToHex(num : number) {
    if (num < 0 || num > 15) {
      return '0';
    }
    if (num < 10) {
      return num.toString();
    } else {
      return String.fromCharCode('a'.charCodeAt(0) + (num - 10)); 
    }
  }

  _createColorForPlayer(i : number) {
    /*let color = '#'
    for (let i = 0; i < 6; i++) {
      color += this._fromDecToHex(MathGame.randomInteger(0,15));
    }*/
    while (i >= this.colorArr.length) {
      i = i - this.colorArr.length;
    }
    return this.colorArr[i];
  }

  _getPlayers(data : any) {
    Bus.emit('clearParametersPlayerList');
    const dataConnections = data.value.players.connections;
    const dataPlayers = data.value.players.players;
    this.players = [];
    const colorRandom = MathGame.randomInteger(0,8);
    dataConnections.forEach((item : any, i : number) => {
      let color = this._createColorForPlayer(i + colorRandom)
      let me = false;
      if (User.name === item.user.name) {
        this.myID = dataPlayers[item.index].ID;
        me = true;
      }
      Bus.emit('addPlayer',{player : item.user, color : color, me : me});
      this.players.push({user : item.user, id : dataPlayers[item.index].ID, points : dataPlayers[item.index].Points, me : me, color : color});
    });
    
  }

  _updateField(data : any) {
    const cells = data.value;
    let color = '#b9c0c9';
    const my = cells[0].playerID === this.myID;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === cells[0].playerID) {
        color = this.players[i].color;
        break;
      }
    }
    cells.forEach((item : any, i : number) => {
      Bus.emit('openCell', {x: item.x, y: item.y, type: item.value, color : color, my : my})
    });
  }

  _updatePoints(data : any) {
    const points = data.value;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === points.ID) {
        Bus.emit('updatePoints', {number : i, points : points.Points});
        this.players[i].points = points.Points;
        break;
      }
    }
    console.log('this.players ' + this.players[0].id + ' ' + this.players[1].id);
  }


  _gameOver(data : any) {
    const dataPlayers = data.value;
    for (let i = 0; i < dataPlayers.length; i++) {
      if (!dataPlayers[i].Finished) {
        console.log('!dataPlayers[i].Finished');
        Bus.emit('winPlayer', i);
      }
      if (dataPlayers[i].ID === this.myID) {
        if (dataPlayers[i].Finished) {
          Bus.emit('showTextInMessageBox', 'You lose!');
        } else {
          Bus.emit('showTextInMessageBox', 'You win!');
        }
      }
    }
  }

  _roomAction(data : any) {
    const action = data.value;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === action.player) {
        switch(action.action) {
          case 7 :
            Bus.emit('explosePlayer', i);
            break;
          case 10 :
            Bus.emit('findFlagPlayer', i);
            break;
          case 4 :
            Bus.emit('disconnectPlayer', i);
            break;
          case 15 : 
            Bus.emit('timeIsOverPlayer', i);
            break;
        }
        break;
      }
    }
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
    console.log('rightСlickOnCell')
    const x = parseInt(coordinatesStruct.x);
    const y = parseInt(coordinatesStruct.y);
    Bus.emit('setUnsetFlagOnCell', {x : x, y : y, type : 'closing'});
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
