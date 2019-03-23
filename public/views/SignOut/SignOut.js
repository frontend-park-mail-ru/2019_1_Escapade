import {Net} from '../../utils/net.js';
import {User} from '../../utils/user.js';
import router from '../../main';
/** */
class SignOut {
  /**
   * Выход и возвращение в главное меню
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
export const signOut = new SignOut();
