import {Net} from '../../utils/net.js';
import {User} from '../../utils/user.js';
import router from '../../main';
import Bus from '../../utils/bus';
/** */
class SignOut {
  /**
   *
   */
  constructor() {
    Bus.on('logout', this.signOut.bind(this));
  }
  /**
   * Выход и возвращение в главное меню
   * @param {User} User
  */
  signOut() {
    Net.delete({url: '/session'})
        .then((resp) => {
          if (resp.status === 200) {
            User.removeUser();
            Bus.emit('userUpdate', null);
            router.open('/');
          }
        });
  }
}
export const signOut = new SignOut();
