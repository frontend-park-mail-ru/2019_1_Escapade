import menuTemplate from './MainMenu.pug';
import BaseView from '../BaseView';

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
    super.render();
  }
}
