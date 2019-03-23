import menuTemplate from './MainMenu.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';
/** */
export class MainMenuView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, menuTemplate);
  }

  /**
   * Отрисовка главного меню
  */
  render() {
    this.data = User;
    super.render();
  }
}
