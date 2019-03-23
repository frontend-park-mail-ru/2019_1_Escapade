import {Net} from '../../utils/net.js';
import {User} from '../../utils/user.js';
import router from '../../main';
/** */
export class SignOut {
  /**
   * Отрисовка главного меню
   * @param {User} User
  */
  signOut() {
    Net.delete({url: '/session'})
        .then((resp) => {
          if (resp.status === 200) {
            User.removeUser();
            router.open('/');
          }
        });
  }
}
