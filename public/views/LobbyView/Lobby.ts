import lobbyTemplate from './Lobby.pug';
import lobbyData from './Lobby__data.pug';
import {User} from '../../utils/user';
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
  constructor(parent) {
    super(parent, lobbyTemplate, false);
  }

  /** */
  render() {
    this.user = User;
    console.log('User ', User);
    super.render();
  }
}