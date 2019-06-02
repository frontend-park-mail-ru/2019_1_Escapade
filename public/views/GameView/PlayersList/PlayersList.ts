/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
const PlayerRowTemplate = require('./Player.pug');
const ObserverRowTemplate = require('./Observer.pug');
const Template = require('./PlayersList.pug');
/** */
export default class PlayersListView {
  playersListContainer: any;
  observersListContainer: any;
  playersHTML: any[];
  timerHTMLElement: any;
  observersTitle: any;

  constructor() {
    Bus.on('addPlayersList', this._addListeners.bind(this), 'playerListView');
  }

  _addListeners(htmlElementTitle : string) {
    this.timerHTMLElement = document.querySelector(htmlElementTitle);
    this.timerHTMLElement.innerHTML = Template();
    this.playersListContainer = document.querySelector('.game__players_list_container');
    this.observersListContainer = document.querySelector('.game__observer_list_container');
    this.observersTitle =  document.querySelector('.game__players_list_observers_title')
    Bus.on('addPlayer', this._addPlayer.bind(this), 'playerListView');
    Bus.on('addObserver', this._addObserver.bind(this), 'playerListView');
    Bus.on('delObserver', this._delObserver.bind(this), 'playerListView');
    Bus.on('updatePoints', this._updatePoints.bind(this), 'playerListView');
    Bus.on('explosePlayer', this._explosePlayer.bind(this), 'playerListView');
    Bus.on('findFlagPlayer', this._findFlagPlayer.bind(this), 'playerListView');
    Bus.on('winPlayer', this._winPlayer.bind(this), 'playerListView');
    Bus.on('disconnectPlayer', this._disconnectPlayer.bind(this), 'playerListView');
    Bus.on('reconnectPlayer', this._reconnectPlayer.bind(this), 'playerListView');
    
    Bus.on('timeIsOverPlayers', this._timeIsOverPlayers.bind(this), 'playerListView');
    
    Bus.on('clearParametersPlayerList', this._clearParameters.bind(this), 'playerListView');

    

    this._clearParameters();
  }

  _clearParameters() {
    this.playersHTML = [];
    this.playersListContainer.innerHTML = '';
    this.observersListContainer.innerHTML = '';
    this.observersTitle.hidden = true;
  }
  _addPlayer(data : any) {
    const player = data.player;
    const points = data.points;
    const dataJSON = {name : player.name, points : points};
    this.playersListContainer.innerHTML += PlayerRowTemplate({data : dataJSON});

    var elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));

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

  _reconnectPlayer(num : number){
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements[num].querySelector('.game__players_list_disconnect_img').hidden = true;
  }
  _addObserver(data : any) {
    this.observersTitle.hidden = false;
    const observer = data.player;
    const dataJSON = {name : observer.name};
    this.observersListContainer.innerHTML += ObserverRowTemplate({data : dataJSON});
  }

  _delObserver(data : any) {
    console.log('delObserver ', data)
    const elements = [].slice.call(document.querySelectorAll('.game__players_list_observer_row'));
    const observer = data.player;
    for(let i = 0; i < elements.length; i++) {
      if (elements[i].querySelector('.game__players_list_player_name').innerHTML === observer.name) {
        if (elements.length === 1) {
          this.observersTitle.hidden = true;
        }
        elements[i].parentNode.removeChild(elements[i]);
        break;
      }
    }
  }
}