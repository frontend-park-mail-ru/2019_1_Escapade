import Bus from '../utils/bus';
import {Net} from '../utils/net';
/**
 *
 */
export default class SignUpModel {
  /**
   *
   */
  constructor() {
    Bus.on('auth', this._auth.bind(this));
  }

  /**
   * Отправка запроса авторизации и заполнение объекта User
   * @param {object} data
   */
  _auth(data) {
    console.log(data);
    Net.post({url: '/user', body: data})
        .then((resp) => {
          if (resp.status === 201) {
            Bus.emit('onSuccessAuth', data);
          } else {
            return resp.json();
          }
        })
        .then((error) => {
          Bus.emit('onFailedAuth', error);
        })
        .catch((error) => {
          console.log('SignUp failed : ', error);
        });
  }
}
