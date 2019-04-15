import {Net} from './net';
/** */
class UserSingleton {
  name: string;
  email: string;
  played: number;
  avatar: string;
  /** */
  constructor() {
    this.name = null;
    this.email = null;
    this.played = null;
    this.avatar = null;
  }

  /**
   * Заполнить информацию о юзере при логине
   * @param {string} email
   * @param {string} score
   * @param {string} avatar
   * @param {string} name
   */
  setUser({email = '', played = 0, avatar = '', name = ''} = {}) {
    this.email = email || null;
    this.played = played || 0;
    this.avatar = avatar || './img/qrosh.png';
    this.name = name || null;
  }

  /**
    * Удалить инфоривацию о юзере при логауте
    */
  removeUser() {
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.name = null;
  }
}

export const User = new UserSingleton();

/**
 *
 * Проверка авторизации пользователя при вхлоде на сайт
 * @param {function} callback
 */
export function checkAuth(callback: { (): void; (): void; (): void; (): void; }) {
  Net.get({url: '/user'})
      .then((resp) => {
        if (resp.status === 200) {
          resp.json()
              .then((json) => {
                User.setUser({...json});
                callback();
              });
        } else {
          console.log('No Auth');
          User.removeUser();
          callback();
        }
      })
      .catch((error) => {
        if (!navigator.onLine) {
          callback();
          return;
        }
        User.removeUser();
        callback();
        console.log(error);
      });
}
