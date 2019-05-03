const menuTemplate = require('./MainMenu.pug');
import BaseView from '../BaseView';
// import headerTmpl from '../HeaderInner.pug';
import { User } from '../../utils/user';
import Bus from '../../utils/bus';
/** */
export class MainMenuView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, menuTemplate, true);
    Bus.on('userUpdate', this.onUserUpdate.bind(this), 'mainMenuView');
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
    super.render();
  }
}
