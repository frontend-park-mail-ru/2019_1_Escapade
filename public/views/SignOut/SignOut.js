import {Net} from '../../utils/net.js';
import {User} from '../../utils/user.js';
import {MainMenuComponent} from '../MainMenuView/MainMenu.js';
/** */
export class SignOutComponent {
  /**
   * Отрисовка главного меню
   * @param {User} User
  */
  signOut() {
    Net.delete({url: '/user/logout'})
        .then((resp) => {
          if (resp.status === 200) {
            User.removeUser();
            const menu = new MainMenuComponent({
              el: application,
            });
            menu.data = User;
            menu.render();
          }
        });
  }
}
