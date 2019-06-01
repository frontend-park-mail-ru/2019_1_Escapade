const menuTemplate = require('./MainMenu.pug');
import BaseView from '../BaseView';
// import headerTmpl from '../HeaderInner.pug';
import { User } from '../../utils/user';
import Bus from '../../utils/bus';
/** */

export var anotherConnectionDetected: boolean;
export class MainMenuView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, menuTemplate, true);
    this.parent = parent;
    Bus.on('userUpdate', this.onUserUpdate.bind(this), 'mainMenuView');
  }

  /**
   * Отрисовка главного меню
  */
  render() {
    this.user = User;
    super.render();
    Bus.emit('addMessage', { container: '.menu__message_container', parent: this.parent });
    Bus.emit('messageBoxHide', true);

  }

  /**
   *
   */
  onUserUpdate() {
    super.render();
  }
}
