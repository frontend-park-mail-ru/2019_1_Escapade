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
  progressBar: any;
  restartDocElement: any;
  stopwatch: Stopwatch;
  _updateUserInfoCalback: any;
  curPath: string;
  settings: any;
  playerInfo: any;
  controlButtons: any;
  timerContainer: any;
  fieldContainer: any;
  statisticsPanel: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, singlePlayerTemplate, true, 'updateUserInfo');

    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'singlePlayerView');
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
    Bus.emit('addListenersButtonsGame');
    Bus.emit('addListenersField');
    Bus.emit('addListenersSettingsGame');
    Bus.emit('addListenersStatisticsGame');
    Bus.emit('addListenersUserinfoGame');
    Bus.emit('addListenersMessage');

    this._getElementsForStyles()
    Bus.on('setStylesOnStartSingle', this._setStylesOnStart.bind(this), 'singlePlayerView');
    Bus.on('rollbackStylesOnEndSingle', this._rollbackStylesOnEnd.bind(this), 'singlePlayerView');
    this.progressBar.style.display = 'none'
    this.restartDocElement = document.querySelector('.game__restart_button');
    this.restartDocElement.addEventListener('click', this._restart.bind(this).bind(this));
    Bus.emit('busAllOffSinglePlayer');
    Bus.emit('busAllOnSinglePlayer');
    Bus.emit('newStopwatchSinglePlayer');
    Bus.emit('showMapSinglePlayer');
    Bus.emit('updateUserInfo');

    this.curPath = '/single_player';
  }


  _currentPathSignalFunc(path: string) {
    if (path === '/single_player') {
      console.log('_currentPathSignalFunc single_player');
      Bus.emit('busAllOnSinglePlayer');
      Bus.emit('showMapSinglePlayer');
      Bus.emit('updateUserInfo');
      this.curPath = path;
    } else {
      if (this.curPath === '/single_player') {
        this._rollbackStylesOnEnd();
        Bus.emit('stopResetTimer');
        this.curPath = '';
        Bus.emit('busAllOffSinglePlayer');
        
      }
    }
  }

  _restart() {
    Bus.emit('restartSinglePlayer');
  }

  _setStylesOnStart() {
    const width = screen.width;
    this.settings.style.display = 'none';
    this.progressBar.style.display = 'flex';

    if (width <= 440) {
      this.playerInfo.style.display = 'none';
      this.controlButtons.style.transform = "translateY(-350px)"
      this.timerContainer.style.transform = "translateY(-350px)"
      this.fieldContainer.style.transform = "translateY(150px)"
    }
  }

  _rollbackStylesOnEnd() {
    const width = screen.width;
    this.settings.style.display = 'flex';
    this.progressBar.style.display = 'none';

    if (width <= 440) {
      this.playerInfo.style.display = 'flex';
      this.controlButtons.style.transform = "translateY(0)"
      this.timerContainer.style.transform = "translateY(0)"
      this.fieldContainer.style.transform = "translateY(0)"
    }
  }


  _getElementsForStyles() {
    this.playerInfo = this.parent.querySelector('.single_player__player')
    this.settings = this.parent.querySelector('.single_player__settings')
    this.progressBar = this.parent.querySelector('.game__field__under_map')
    this.controlButtons = this.parent.querySelector('.game__right_menu_buttons')
    this.timerContainer = this.parent.querySelector('.single_player__timer')
    this.fieldContainer = this.parent.querySelector('.single_player__wrapper')
    this.statisticsPanel = document.querySelector('.single_player__statistics')
    
  }
}
