/* eslint-disable require-jsdoc */
const singlePlayerTemplate = require('./SinglePlayer.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';
import { Stopwatch } from '../../utils/stopwatch/stopwatch';
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
  oncontextmenu: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {

    super(parent, singlePlayerTemplate, true, 'updateUserInfo');
    this.parent = parent;
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'singlePlayerView');
    this.curPath = '/single_player';

  }

  /**
   *
  */
  render() {
    this.user = User;
    super.render();
    console.log("render singleplayer ");
    Bus.emit('busAllOffMultiplayer');
    Bus.emit('addField', { container: '.single_player__field_container', parent: this.parent });
    Bus.emit('addSettingsGame', '.single_player__settings_container');
    Bus.emit('addStatisticsGame', '.single_player__statistics_container');
    Bus.emit('addUserinfoGame', '.single_player__userinfo_container');
    Bus.emit('addMessage', { container: '.single_player__message_container', parent: this.parent });

    this._getElementsForStyles()
    Bus.on('setStylesOnStartSingle', this._setStylesOnStart.bind(this), 'singlePlayerView');
    Bus.on('rollbackStylesOnEndSingle', this._rollbackStylesOnEnd.bind(this), 'singlePlayerView');
    //this.progressBar.style.display = 'none'
    this.restartDocElement = document.querySelector('.game__restart_button');
    this.restartDocElement.addEventListener('click', this._restart.bind(this).bind(this));
    //Bus.emit('busAllOffSinglePlayer');
    Bus.emit('busAllOnSinglePlayer');
    Bus.emit('newStopwatchSinglePlayer');
    Bus.emit('showMapSinglePlayer');
    Bus.emit('updateUserInfo');

    this.oncontextmenu = document.body.oncontextmenu
    document.body.oncontextmenu = function (e) {
      return false;
    };
  }


  _currentPathSignalFunc(path: string) {
    if (path === '/single_player') {
      console.log('_currentPathSignalFunc single_player');
      Bus.emit('busAllOffMultiplayer');
      Bus.emit('busAllOnSinglePlayer');

      Bus.emit('addField', { container: '.single_player__field_container', parent: this.parent });
      Bus.emit('addMessage', { container: '.single_player__message_container', parent: this.parent });

      Bus.emit('busAllOnSinglePlayer');
      Bus.emit('newStopwatchSinglePlayer');
      Bus.emit('showMapSinglePlayer');
      Bus.emit('updateUserInfo');

      this.curPath = path;
      document.body.oncontextmenu = function (e) {
        return false;
      };
    } else {
      if (this.curPath === '/single_player') {
        this._rollbackStylesOnEnd();
        Bus.emit('stopResetTimer');
        this.curPath = '';
        Bus.emit('busAllOffSinglePlayer');
        document.body.oncontextmenu = this.oncontextmenu;

      }
    }
  }

  _restart() {
    Bus.emit('restartSinglePlayer');
  }

  _setStylesOnStart() {
    const width = screen.width;
    this.settings.style.display = 'none';
    //this.progressBar.style.display = 'flex';

    if (width <= 440) {
      this.playerInfo.style.transform = "translateY(-390px)";
      //this.timerContainer.style.transform = "translateY(-100px)"
      this.fieldContainer.style.transform = "translateY(90px)"
    }
  }

  _rollbackStylesOnEnd() {
    const width = screen.width;
    this.settings.style.display = 'flex';
    //this.progressBar.style.display = 'none';

    if (width <= 440) {
      this.playerInfo.style.transform = "translateY(0)";
      //this.timerContainer.style.transform = "translateY(0)"
      this.fieldContainer.style.transform = "translateY(0)"
    }
  }


  _getElementsForStyles() {
    let rest
    [this.playerInfo, this.timerContainer, ...rest] = this.parent.querySelectorAll('.single_player__row')
    this.settings = this.parent.querySelector('.single_player__settings_container')
    this.progressBar = this.parent.querySelector('.game__field__under_map')
    this.fieldContainer = this.parent.querySelector('.single_player__wrapper')
    this.statisticsPanel = document.querySelector('.single_player__statistics')

  }
}
