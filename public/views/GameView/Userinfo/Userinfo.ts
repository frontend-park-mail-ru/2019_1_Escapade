/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class UserinfoGameView {
  playerNameDocElement: any;
  playerTimeDocElement: any;
  playerScoreDocElement: any;
  playerPhotoDocElement: any;

  constructor() {
    Bus.on('addListenersUserinfoGame', this._addListeners.bind(this), 'userinfoView');
  }

  _addListeners() {
    console.log('addListenersUserinfoGame');
    this.playerNameDocElement = document.querySelector('.single_player__player_name');
    this.playerScoreDocElement = document.querySelector('.single_player__player_score');
    this.playerTimeDocElement = document.querySelector('.single_player__player_time');
    this.playerPhotoDocElement = document.querySelector('.single_player__player_photo');
    Bus.on('userNameInGameChange', this._userNameInGameChange.bind(this), 'userinfoView');
    Bus.on('userScoreInGameChange', this._userScoreInGameChange.bind(this), 'userinfoView');
    Bus.on('userTimeInGameChange', this._userTimeInGameChange.bind(this), 'userinfoView');
    Bus.on('userPhotoInGameChange', this._userPhotoInGameChange.bind(this), 'userinfoView');
  }

  _userPhotoInGameChange(src : string) {
    this.playerPhotoDocElement.style.backgroundImage = "url(" + src + ")";
  }
  
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