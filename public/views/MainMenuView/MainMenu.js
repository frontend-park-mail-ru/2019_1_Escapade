import menuTemplate from './MainMenu.pug';
import BaseView from '../BaseView';
import headerTmpl from '../HeaderInner.pug';
import {User} from '../../utils/user.js';
import Bus from '../../utils/bus';
/** */
export class MainMenuView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, menuTemplate, true);
    Bus.on('userUpdate', this.onUserUpdate.bind(this));
  }

  /**
   * Отрисовка главного меню
  */
  render() {
    this.user = User;
    super.render();
  }

  /**
   *
   */
  onUserUpdate() {
    const header = this.parent.querySelector('.menu-header');
    if (header) {
      header.innerHTML = headerTmpl({user: this._user});
    }
  }
}
