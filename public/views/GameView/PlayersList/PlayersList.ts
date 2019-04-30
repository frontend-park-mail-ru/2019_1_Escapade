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
    Bus.on('addObservers', this._addObservers.bind(this));
    this.playersHTML = [];
  }


  _addPlayers(data : any) {
    const connections = data.players.connections;
    const players = data.players.players;
    this.playersHTML = [];
    this.playersListContainer.innerHTML = '';
    connections.forEach((item : any, i : number) => {
      const dataJSON = {name : item.user.name, points : 0};
      this.playersListContainer.innerHTML += PlayerRowTemplate({data : dataJSON});
    });

    var elements = [].slice.call(document.querySelectorAll('.game__players_list_row'));
    elements.forEach((element : any, i : number) => {
      element.querySelector('.game__players_list_disconnect_img').hidden = true;
      let hiddenExploseImg = true;
      if (players[i].Finished) {
        hiddenExploseImg = false;
      }
      element.querySelector('.game__players_list_explose_img').hidden = hiddenExploseImg;
      this.playersHTML.push(element);
    });
  }

  _addObservers(data : any) {
    const observers = data.observers.get;
    this.observersListContainer.innerHTML = '';
    observers.forEach((item : any, i : number) => {
      const dataJSON = {name : item.user.name};
      this.observersListContainer.innerHTML += ObserverRowTemplate({data : dataJSON});
    });
  }



}