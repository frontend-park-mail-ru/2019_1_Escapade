import {Net} from '../../utils/net.js';
import {User} from '../../utils/user.js';
import {MainMenuView} from '../MainMenuView/MainMenu.js';
/** */
export class SignOut {
  /**
   * Отрисовка главного меню
   * @param {User} User
  */
  signOut() {
    Net.delete({url: '/user/logout'})
        .then((resp) => {
          if (resp.status === 200) {
            User.removeUser();
            const menu = new MainMenuView({
              el: application,
            });
            menu.data = User;
            menu.render();
          }
        });
  }
}
