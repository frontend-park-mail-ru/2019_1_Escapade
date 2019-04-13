import menuTemplate from './MainMenu.pug';
import BaseView from '../BaseView';
// import headerTmpl from '../HeaderInner.pug';
import {User} from '../../utils/user';
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
    /*
    let value = 1;
    let width = elems[0].style.width
    let maxWidth = elems[0].style.width
    var elems = document.getElementsByClassName('menu__logo');
    let elem = elems[0]
    setInterval(function(){
          if (elems[0].style.width >
          elems[0].style.width++;
          elems[0].style.width++;

    },60);
    */
    super.render();
  }

  /**
   *
   */
  onUserUpdate() {
    super.render();
  }
}
