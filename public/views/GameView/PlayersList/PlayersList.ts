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
    Bus.on('addPlayers', this._addPlayers.bind(this));
    Bus.on('addObserver', this._addObserver.bind(this));
    Bus.on('updatePoints', this._updatePoints.bind(this));
    
    
    this.playersHTML = [];
  }


  _addPlayers(data : any) {
    const connections = data.value.players.connections;
    const players = data.value.players.players;
    this.playersHTML = [];
    this.playersListContainer.innerHTML = '';
    connections.forEach((item : any, i : number) => {
      const dataJSON = {name : item.user.name, points : 0};
      this.playersListContainer.innerHTML += PlayerRowTemplate({data : dataJSON});
    });

    var elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements.forEach((element : any, i : number) => {
      element.querySelector('.game__players_list_disconnect_img').hidden = true;
      element.querySelector('.game__players_list_explose_img').hidden = true;
      this.playersHTML.push(element);
    });
  }

  _updatePoints() {
    
  }
  

  _explosePlayer(i : number){
    this.playersHTML[i].querySelector('.game__players_list_explose_img').hidden = false;
  }

  _disconnectPlayer(i : number){
    this.playersHTML[i].querySelector('.game__players_list_disconnect_img').hidden = false;
  }

  _addObserver(data : any) {
    const observers = data.value.observers.get;
    this.observersListContainer.innerHTML = '';
    observers.forEach((item : any, i : number) => {
      const dataJSON = {name : item.user.name};
      this.observersListContainer.innerHTML += ObserverRowTemplate({data : dataJSON});
    });
  }



}