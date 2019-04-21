/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class UserGameView {
  playerNameDocElement: any;
  playerTimeDocElement: any;
  playerScoreDocElement: any;

  constructor() {
    this.playerNameDocElement = document.querySelector('.single_player__player_name');
    this.playerScoreDocElement = document.querySelector('.single_player__player_score');
    this.playerTimeDocElement = document.querySelector('.single_player__player_time');

    Bus.on('userNameInGameChange', this._userNameInGameChange.bind(this));
    Bus.on('userScoreInGameChange', this._userScoreInGameChange.bind(this));
    Bus.on('userTimeInGameChange', this._userTimeInGameChange.bind(this));
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