import menuTemplate from './MainMenu.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';
import Bus from '../../utils/bus';
/** */
export class MainMenuView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, menuTemplate);
    Bus.on('userUpdate', this.render.bind(this));
  }

  /**
   * Отрисовка главного меню
  */
  render() {
    this.data = User;
    super.render();
  }
}
