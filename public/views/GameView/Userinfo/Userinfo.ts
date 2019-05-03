/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class UserinfoGameView {
  playerNameDocElement: any;
  playerTimeDocElement: any;
  playerScoreDocElement: any;

  constructor() {
    Bus.on('addListenersUserinfoGame', this._addListeners.bind(this), 'userinfoView');
  }

  _addListeners() {
    this.playerNameDocElement = document.querySelector('.single_player__player_name');
    this.playerScoreDocElement = document.querySelector('.single_player__player_score');
    this.playerTimeDocElement = document.querySelector('.single_player__player_time');
    Bus.on('userNameInGameChange', this._userNameInGameChange.bind(this), 'userinfoView');
    Bus.on('userScoreInGameChange', this._userScoreInGameChange.bind(this), 'userinfoView');
    Bus.on('userTimeInGameChange', this._userTimeInGameChange.bind(this), 'userinfoView');
  }

  /** */
  _userNameInGameChange(name : string) {
    this.playerNameDocElement.innerHTML = name;
  }
  _userScoreInGameChange(score : number) {
    this.playerScoreDocElement.innerHTML = score.toString();
  }
  _userTimeInGameChange(time : string) {
    this.playerTimeDocElement.innerHTML = time;
  }
  
}