/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./SinglePlayer.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';
import { MineSweeper } from '../../game/minesweeper';
import { Stopwatch } from '../../utils/stopwatch';
import { checkAuth } from '../../utils/user';
import Bus from '../../utils/bus';
/** */
export default class SinglePlayerView extends BaseView {
  cellsize: number;
  cellNumbersX: number;
  cellNumbersY: number;
  minesCount: number;
  start: boolean;
  stopwatch: Stopwatch;
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
  curPath: string;
  restartDocElement: any;
  _restartClick: any;
  quitDocElement: any;
  _quitClick: any;
  playerInfo: HTMLElement;
  settings: HTMLElement;
  progressBar: HTMLElement;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    this.minesCount = 20;
    this.cellsize = 50;
    this.difficult = 1;
    this.minesCount = 20;
    this.start = false;
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'singlePlayerView');
    document.body.oncontextmenu = function (e) {
      return false;
    };
  }

  _busAllOn() {
    Bus.on('leftClickOnCell', this._clickOnCell.bind(this), 'singlePlayerView');
    Bus.on('rightClickOnCell', this._rightСlickOnCell.bind(this), 'singlePlayerView');
    Bus.on('updateUserInfo', this._updateUserInfo.bind(this), 'singlePlayerView');
    Bus.on('settingsChangeHard', this._changeHard.bind(this), 'singlePlayerView');
  }

  _busAllOff() {
    Bus.off('leftClickOnCell', this._clickOnCell.bind(this), 'singlePlayerView');
    Bus.off('rightClickOnCell', this._rightСlickOnCell.bind(this), 'singlePlayerView');
    Bus.off('updateUserInfo', this._updateUserInfo.bind(this), 'singlePlayerView');
    Bus.off('settingsChangeHard', this._changeHard.bind(this), 'singlePlayerView');
  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    Bus.emit('addListenersButtonsGame');
    Bus.emit('addListenersField');
    Bus.emit('addListenersSettingsGame');
    Bus.emit('addListenersStatisticsGame');
    Bus.emit('addListenersUserinfoGame');
    Bus.emit('addListenersMessage');

    this.playerInfo = this.parent.querySelector('.single_player__player')
    this.settings = this.parent.querySelector('.single_player__settings')
    this.progressBar = this.parent.querySelector('.game__field__under_map')

    this.progressBar.style.display = 'none'
    this.restartDocElement = document.querySelector('.game__restart_button');
    this.restartDocElement.addEventListener('click', this._restart.bind(this).bind(this));
    this._busAllOff();
    this._busAllOn();
    this.stopwatch = new Stopwatch('single_player__timer');
    this._showMap();
    this.curPath = '/single_player';
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/single_player') {
      console.log('_currentPathSignalFunc single_player');
      this._busAllOn();
      this._showMap();
      this.curPath = path;
    } else {
      if (this.curPath === '/single_player') {
        console.log('_currentPathSignalFunc not single_player');
        this._stop_reset_timer();
        this.curPath = '';
        this._busAllOff();
      }
    }
  }

  /** */
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

    Bus.emit('messageBoxHide', true)
    Bus.emit('renderField', { width: this.cellNumbersX, height: this.cellNumbersY, cellSize: this.cellsize })
    Bus.emit('statisticsResetParameters', this.minesCount)
    Bus.emit('settingsSetParameters', { difficult: this.difficult, width: this.cellNumbersX, height: this.cellNumbersY, mines: this.minesCount })

    this.mineSweeper = new MineSweeper(this.cellNumbersX, this.cellNumbersY, this.minesCount);
    this.BBBVCount = this.mineSweeper.count3BV();

    if (this.start) {
      this.stopwatch.router();
    }
    return;
  }

  _stop_reset_timer() {
    this.stopwatch.stop();
    this.stopwatch.reset();
  }

  /** */
  _restart() {
    if (!this.start) {
      this.start = true;
    } else {
      if (this.stopwatch.running) {
        this.stopwatch.stop();
      }
    }
    this.settings.style.display = 'none';
    this.playerInfo.style.display = 'none';
    this.progressBar.style.display = 'flex';
    this._showMap();
  }

  /** */
  _changeHard(hardStruct: any) {
    this.difficult = hardStruct.difficult;


    switch (this.difficult) {
      case 0:
        this.minesCount = 10;
        break;
      case 1:
        this.minesCount = 20;
        break;
      case 2:
        this.minesCount = 30;
        break;
      case 3:
        this.minesCount = 40;
        break;
    }
    this.cellNumbersX = 15;
    this.cellNumbersY = 15;
    Bus.emit('settingsChangeSize', { width: this.cellNumbersX, height: this.cellNumbersY });
    Bus.emit('settingsChangeMinesCount', this.minesCount);
    checkAuth(this._updateUserInfoCalback.bind(this), this.difficult)
    if (this.stopwatch.running) {
      this.stopwatch.stop();
    }
    if (!this.start) {
      this.start = true;
    }
    this._showMap();
  }

  /** */
  _clickOnCell(coordinatesStruct: any) {
    if (!this.start) {
      return;
    }
    const x = parseInt(coordinatesStruct.x);
    const y = parseInt(coordinatesStruct.y);
    if (this.mineSweeper.mapLabel[x][y] != 0) { // если не закрыта
      return;
    }
    Bus.emit('leftClicksStatisticsChange', 1);

    if (this._checkOnLosing(x, y)) {
      return;
    }

    const res = this.mineSweeper.
      openCels(x, y, this.cellNumbersX, this.cellNumbersY);
    this._openCels(res.cellArr);
    this.openCellsCount += res.openCells;
    this.pointsCount += res.points;
    const prcentOpen = Math.round((this.openCellsCount / (this.cellNumbersX * this.cellNumbersY - this.minesCount)) * 100);
    Bus.emit('progressGameChange', prcentOpen);
    Bus.emit('pointsStatisticsChange', this.pointsCount);
    this._checkOnWinning();
    return;
  }

  _checkOnLosing(x: number, y: number) {
    let loser = false;
    if (this.mineSweeper.map[x][y] === 9) { // losing
      this._openAllCels();
      if (this.stopwatch.running) {
        this.stopwatch.stop();
      }
      this.start = false;
      Bus.emit('sendResultsSingleGame', JSON.stringify({ difficult: this.difficult, singleTotal: 1, singleWin: 0 }));
      Bus.emit('showTextInMessageBox', 'You lose!');

      this.settings.style.display = 'flex';
      this.playerInfo.style.display = 'flex';
      this.progressBar.style.display = 'none';

      loser = true;
    }
    return loser;
  }

  _checkOnWinning() {
    let winner = false;
    if (this.openCellsCount === this.cellNumbersX * this.cellNumbersY - this.minesCount) { // winning
      this._openAllCels();
      const timeArr = this.stopwatch.timeStr.split(':');
      const timeSec = parseInt(timeArr[0]) * 3600 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]) + parseInt(timeArr[3]) / 100
      const data = { score: this.pointsCount, time: timeSec, difficult: this.difficult, singleTotal: 1, singleWin: 1 };
      Bus.emit('sendResultsSingleGame', data);
      if (this.stopwatch.running) {
        this.stopwatch.stop();
      }
      this.start = false;
      if (this.maxPointsCount < this.pointsCount) {
        this.maxPointsCount = this.pointsCount;
        Bus.emit('userScoreInGameChange', this.pointsCount)
      }
      if (this.minTimeCount > this.stopwatch.timeStr) {
        this.minTimeCount = this.stopwatch.timeStr;
        Bus.emit('userTimeInGameChange', this.minTimeCount.toString());
      }
      Bus.emit('showTextInMessageBox', 'You win!');

      this.settings.style.display = 'flex';
      this.playerInfo.style.display = 'flex';
      this.progressBar.style.display = 'none';
      winner = true;
    }
    return winner;
  }

  /** */
  _rightСlickOnCell(coordinatesStruct: any) {
    if (!this.start) {
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
      Bus.emit('setUnsetFlagOnCell', { x: x, y: y, type: 'closing' });
      return;
    }

    if (typeOfCell == 2) {
      Bus.emit('minesStatisticsChange', -1);
      Bus.emit('setUnsetFlagOnCell', { x: x, y: y, type: 'flag' });
    }
    return;
  }

  /** */
  _openCels(arrCells: any) {
    for (let i = 0; i < arrCells.length; i++) {
      const x = arrCells[i][0];
      const y = arrCells[i][1];
      Bus.emit('openCell', { x: x, y: y, type: this.mineSweeper.map[x][y] });
    }
  }

  /** */
  _openAllCels() {
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        Bus.emit('openCell', { x: x, y: y, type: this.mineSweeper.map[x][y] });
      }
    }
    Bus.emit('progressGameChange', 100);
    return;
  }

  // _setCellSize(){
  //   const width = screen.width;

  //   if width
  // }
}
