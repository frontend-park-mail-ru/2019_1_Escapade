import Bus from '../utils/bus';
import { Net } from '../utils/net';
/**
 *
 */
export default class SignUpModel {
  /**
   *
   */
  constructor() {
    Bus.on('auth', this._auth.bind(this), 'signupModel');
  }

  /**
   * Отправка запроса авторизации и заполнение объекта User
   * @param {object} data
   */
  _auth(data: object) {
    Net.post(data, '/api/user')
      .then((resp) => {
        if (resp.status === 201) {
          Bus.emit('onSuccessAuth', data);
        } else {
          resp.json()
            .then((error) => {
              Bus.emit('onFailedAuth', error);
            });
        }
      })
      .catch((error) => {
        console.log('SignUp failed : ', error);
      });
  }
}
