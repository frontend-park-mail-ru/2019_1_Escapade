/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./SinglePlayer.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';
import { MineSweeper } from '../../game/minesweeper';
import { Timer } from '../../game/timer';
import { checkAuth } from '../../utils/user';
import Bus from '../../utils/bus';
import { ConfigSinglePlayerView } from './ConfigSinglePlayer';
import StatisticsGameView from '../GameView/Statistics/Statistics';
import SettingsGameView from '../GameView/Settings/Settings';
import FieldView from '../GameView/Field/Field';
import UserGameView from '../GameView/Userinfo/Userinfo';
import ButtonsGameView from '../GameView/Buttons/Buttons';
import MessageView from '../MessageView/Message';
/** */
export default class SinglePlayerView extends BaseView {
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
  prcentOpen: number;
  minesRemainedCount: any;
  mineSweeper: MineSweeper;
  BBBVCount: any;
  config: ConfigSinglePlayerView;
  difficult: number;
  settingsPanel: SettingsGameView;
  statisticsPanel: StatisticsGameView;
  fieldPanel: FieldView;
  userGameView: UserGameView;
  messageView: MessageView;
  buttonsGameView: ButtonsGameView;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.config = new ConfigSinglePlayerView()
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 20;
    this.cellsize = 50;
    this.start = false;

    document.addEventListener('click', this._clickOnBody.bind(this));
    Bus.on('leftClickOnCell', this._clickOnCell.bind(this));
    Bus.on('rightClickOnCell', this._rightСlickOnCell.bind(this));
    Bus.on('updateUserInfo', this._updateUserInfo.bind(this));
    document.body.oncontextmenu = function (e) {
      return false;
    };
  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    this.statisticsPanel = new StatisticsGameView();
    this.settingsPanel = new SettingsGameView();
    this.fieldPanel = new FieldView(this.cellsize);
    this.userGameView = new UserGameView();
    this.messageView = new MessageView();
    this.buttonsGameView = new ButtonsGameView();
    this.timer = new Timer(document.getElementById(this.config.timerFieldStringName));
    
    
    this.difficult = 1;
    this.minesCount = 20;
    this._showMap();
    Bus.emit('changeTitleRestartButton', 'Start');
    Bus.on('settingsChangeHard', this._changeHard.bind(this));
    Bus.on('stop_reset_timer', this._stop_reset_timer.bind(this))
    Bus.on('restartClick', this._restart.bind(this));
  }

  /** */
  _clickOnBody(e: any) {
    if (e.target.classList.contains(this.config.messageBoxOkButtonFieldStringName)) {
      this._closeMessage();
    }
  }

  _updateUserInfo() {
    checkAuth(this._updateUserInfoCalback.bind(this), this.difficult)
  }
  _updateUserInfoCalback() {
    console.log("_updateUserInfo here");
    if (User.name) {
      Bus.emit('UserNameInGameChange', User.name);
      if (User.bestScore.String) {
        Bus.emit('userScoreInGameChange', User.bestScore) // получать из user
        Bus.emit('userTimeInGameChange', User.bestScore.String);
      } else {
        Bus.emit('userScoreInGameChange', 0)
        Bus.emit('userTimeInGameChange', '0:00:00:00');
      }
      this.maxPointsCount = 0;
      this.minTimeCount = '1:24:60:60';
    } else {
      Bus.emit('userNameInGameChange', 'Guest');
      Bus.emit('userScoreInGameChange', 0)
      Bus.emit('userTimeInGameChange', '0:00:00:00');
      this.maxPointsCount = 0;
      this.minTimeCount = '1:24:60:60';
    }
    this._showMap();
  }

  /** */
  _showMap() {
    this.openCellsCount = 0;
    this.pointsCount = 0;
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.prcentOpen = 0;
    Bus.emit('messageBoxHide', true)
    Bus.emit('renderField',{width : this.cellNumbersX, height : this.cellNumbersY})
    Bus.emit('statisticsResetParameters', this.minesCount)
    Bus.emit('settingsSetParameters', {difficult : this.difficult,  width : this.cellNumbersX, height : this.cellNumbersY, mines : this.minesCount})
    this.minesRemainedCount = this.minesCount;
    this.mineSweeper = new MineSweeper(this.cellNumbersX, this.cellNumbersY, this.minesCount);
    this.BBBVCount = this.mineSweeper.count3BV();
    console.log('3BV = ' + this.BBBVCount);

    if (this.start) {
      this.timer.router();
    }   
    return;
  }

  _stop_reset_timer() {
    this.timer.stop();
    this.timer.reset();
  }

  /** */
  _restart() {
    if (!this.start) {
      Bus.emit('changeTitleRestartButton', 'Restart');
      this.start = true;
    } else {
      if (this.timer.running) {
        this.timer.stop();
      }
    }
    this._showMap();
  }

  /** */
  _changeHard(hardStruct : any) {
    this.difficult = hardStruct.difficult;
    this.minesCount = hardStruct.minesCount;
    this.cellNumbersX = hardStruct.width;
    this.cellNumbersY = hardStruct.height;
    
    checkAuth(this._updateUserInfoCalback.bind(this), this.difficult)
    if (this.timer.running) {
      this.timer.stop();
    }
    if (!this.start) {
      Bus.emit('changeTitleRestartButton', 'Restart');
      this.start = true;
    }
    this._showMap();
  }

  /** */
  _clickOnCell(coordinatesStruct : any) {
    if (!this.start) {
      return;
    }
    let x  = coordinatesStruct.x;
    let y = coordinatesStruct.y;
    x = parseInt(x);
    y = parseInt(y);
    if (this.mineSweeper.mapLabel[x][y] != 0) { // если не закрыта
      return;
    }
    Bus.emit('leftClicksStatisticsChange', 1);
    
    if (this.mineSweeper.map[x][y] === 9) {
      this._openAllCels();
      if (this.timer.running) {
        this.timer.stop();
      }
      this.start = false;
      const data = JSON.stringify({ difficult: this.difficult, singleTotal: 1, singleWin: 0 });
      Bus.emit('sendResultsSingleGame', data);
      this._showMessage('You lose!');
      return;
    }
    const res = this.mineSweeper.
      openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    this._openCels(res.cellArr);
    this.openCellsCount += res.openCells;
    this.prcentOpen = Math.round((this.openCellsCount / (this.cellNumbersX * this.cellNumbersY - this.minesCount)) * 100);
    this.pointsCount += res.points;
    Bus.emit('progressGameChange', this.prcentOpen);
    Bus.emit('pointsStatisticsChange', this.pointsCount);

    if (this.openCellsCount === this.cellNumbersX * this.cellNumbersY - this.minesCount) { // winning
      this._openAllCels();
      console.log(this.timer.timeStr);
      const timeArr = this.timer.timeStr.split(':');
      const timeSec = parseInt(timeArr[0]) * 3600 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]) + parseInt(timeArr[3]) / 100
      const data = { score: this.pointsCount, time: timeSec, difficult: this.difficult, singleTotal: 1, singleWin: 1 };
      Bus.emit('sendResultsSingleGame', data);
      if (this.timer.running) {
        this.timer.stop();
      }
      this.start = false;
      console.log('this.pointsCount' , this.pointsCount);
      if (this.maxPointsCount < this.pointsCount) {
        this.maxPointsCount = this.pointsCount;
        Bus.emit('userScoreInGameChange', this.pointsCount)
      }
      if (this.minTimeCount > this.timer.timeStr) {
        this.minTimeCount = this.timer.timeStr;
        Bus.emit('userTimeInGameChange', this.minTimeCount.toString());
      }
      this._showMessage('You win!');
    }
    return;
  }

  /** */
  _rightСlickOnCell(coordinatesStruct : any) {
    if (!this.start) {
      return;
    }
    let x  = coordinatesStruct.x;
    let y = coordinatesStruct.y;
    const typeOfCell = this.mineSweeper.putRemoveFlag(x, y);
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
      --this.minesRemainedCount;
      Bus.emit('minesStatisticsChange', -1);
      Bus.emit('setUnsetFlagOnCell', {x : x, y : y, type : 'flag'});
    }
    return;
  }

  /** */
  _showMessage(mess: string) {
    Bus.emit('showTextInMessageBox', mess);
  }

  _closeMessage() {
    Bus.emit('messageBoxHide', true);
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
    this.prcentOpen = 100;
    Bus.emit('progressGameChange', 100);
    return;
  }
}
