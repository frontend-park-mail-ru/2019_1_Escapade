/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
const PlayerRowTemplate = require('./Player.pug');
const ObserverRowTemplate = require('./Observer.pug');
/** */
export default class PlayersListView {
  playersListContainer: any;
  observersListContainer: any;
  playersHTML: any[];

  constructor() {
    Bus.on('addListenersPlayersList', this._addListeners.bind(this));
  }

  _addListeners() {
    this.playersListContainer = document.querySelector('.game__players_list_container');
    this.observersListContainer = document.querySelector('.game__observer_list_container');
    Bus.on('addPlayer', this._addPlayer.bind(this));
    Bus.on('addObserver', this._addObserver.bind(this));
    Bus.on('updatePoints', this._updatePoints.bind(this));
    Bus.on('explosePlayer', this._explosePlayer.bind(this));
    Bus.on('findFlagPlayer', this._findFlagPlayer.bind(this));
    Bus.on('winPlayer', this._winPlayer.bind(this));
    Bus.on('disconnectPlayer', this._disconnectPlayer.bind(this));
    Bus.on('timeIsOverPlayers', this._timeIsOverPlayers.bind(this));
    
    Bus.on('clearParametersPlayerList', this._clearParameters.bind(this));

    

    this._clearParameters();
  }

  _clearParameters() {
    this.playersHTML = [];
    this.playersListContainer.innerHTML = '';
    this.observersListContainer.innerHTML = '';
  }
  _addPlayer(data : any) {
    const player = data.player;
    const dataJSON = {name : player.name, points : 0};
    this.playersListContainer.innerHTML += PlayerRowTemplate({data : dataJSON});

    var elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    console.log('elements ', elements);
    elements[elements.length - 1].querySelector('.game__players_list_disconnect_img').hidden = true;
    elements[elements.length - 1].querySelector('.game__players_list_explose_img').hidden = true;
    elements[elements.length - 1].querySelector('.game__players_list_win_img').hidden = true;
    elements[elements.length - 1].querySelector('.game__players_list_flag_img').hidden = true;
    elements[elements.length - 1].querySelector('.game__players_list_clock_img').hidden = true;
    elements[elements.length - 1].querySelector('.game__players_list_color').style.backgroundColor = data.color;

    if (data.me) {
      elements[elements.length - 1].style.backgroundColor = '#591a4b';
    }
    this.playersHTML.push(elements[elements.length - 1]);
  }

  _timeIsOverPlayers() {
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements.forEach((item : any, i : number) => {
      item.querySelector('.game__players_list_clock_img').hidden = false;
    });
  }

  _updatePoints({number = 0, points = 0}) {
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements[number].querySelector('.game__players_list_player_points').innerHTML = `${points} points`;
  }
  

  _winPlayer(num : number){
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements[num].querySelector('.game__players_list_win_img').hidden = false;
  }

  _findFlagPlayer(num : number){
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements[num].querySelector('.game__players_list_flag_img').hidden = false;
  }


  _explosePlayer(num : number){
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements[num].querySelector('.game__players_list_explose_img').hidden = false;
  }

  _disconnectPlayer(num : number){
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements[num].querySelector('.game__players_list_disconnect_img').hidden = false;
  }

  _addObserver(data : any) {
    const observers = data.value.observers.get;
    
    observers.forEach((item : any, i : number) => {
      const dataJSON = {name : item.user.name};
      this.observersListContainer.innerHTML += ObserverRowTemplate({data : dataJSON});
    });
  }



}