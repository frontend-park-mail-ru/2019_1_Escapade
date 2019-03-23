import {Net} from '../../utils/net.js';
import {User} from '../../utils/user.js';
import router from '../../main';
import Bus from '../../utils/bus';


/**
 * Выход и возвращение в главное меню
*/
export default function signOut() {
  Net.delete({url: '/session'})
      .then((resp) => {
        if (resp.status === 200) {
          User.removeUser();
          Bus.emit('userUpdate', null);
          router.open('/');
        }
      });
};
console.log('logout on')
;