const lobbyTemplate = require('./Lobby.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
/**
 *
 */
export default class LobbyView extends BaseView {
  _warnings: any;
  parent: any;
  _user: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, lobbyTemplate, false);
  }

  /** */
  render() {
    this.user = User;
    console.log('User ', User);
    super.render();
    Bus.emit('connect');
    Bus.on('returnRooms', this._getRooms.bind(this));
    Bus.emit('get_rooms');
  }

  _getRooms(data : any) {
    console.log(data);
  }


}