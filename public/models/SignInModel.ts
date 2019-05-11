import Bus from '../utils/bus';
import { Net } from '../utils/net';
/**
 *
 */
export default class SignInModel {
  /**
   *
   */
  constructor() {
    Bus.on('login', this._login.bind(this), 'signinModel');
  }

  /**
   * Отправка запроса логина и заполнение объекта User
   * @param {object} data
   */
  _login(data: {}) {
    Net.post(data, '/api/session')
      .then((resp) => {
        if (resp.status === 200) {
          resp.json()
            .then((user) => {
              Bus.emit('onSuccessLogin', user);
            });
        } else {
          resp.json()
            .then((error) => {
              Bus.emit('onFailedLogin', error);
            });
        }
      })
      .catch((error) => {
        console.log('SignIn failed : ', error);
      });
  }
}
