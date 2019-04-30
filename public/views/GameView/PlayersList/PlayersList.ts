/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
const PlayerRowTemplate = require('./Player.pug');
/** */
export default class PlayersListView {
  playersListContainer: any;
  observersListContainer: any;


  constructor() {
    Bus.on('addListenersPlayersList', this._addListeners.bind(this));
  }

  _addListeners() {
    this.playersListContainer = document.querySelector('.game__players_list_container');
    this.observersListContainer = document.querySelector('.game__observer_list_container');
    Bus.on('addPlayers', this._addPlayers.bind(this));
  }

  /** */
  resetParameters() {

  };

  /** */
  _addPlayers(data: any) {
    data.forEach((item : any, i : number) => {
      const dataJSON = {name : item.user.name, points : 0};
      this.playersListContainer.innerHTML += PlayerRowTemplate({data : dataJSON});
    });
    
  }
}