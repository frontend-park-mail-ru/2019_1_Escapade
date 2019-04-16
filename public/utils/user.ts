import {Net} from './net';
/** */
class UserSingleton {
  name: string;
  email: string;
  played: number;
  avatar: string;
  bestScore: any;
  bestTime: any;
  /** */
  constructor() {
    this.name = null;
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.bestScore = null;
    this.bestTime = null;
  }

  /**
   * Заполнить информацию о юзере при логине
   * @param {string} email
   * @param {string} score
   * @param {string} avatar
   * @param {string} name
   */
  setUser({email = '', played = 0, avatar = '', name = '', bestTime = '', bestScore = ''} = {}) {
    this.email = email || null;
    this.played = played || 0;
    this.avatar = avatar || './img/qrosh.png';
    this.name = name || null;
    this.bestTime = bestTime;
    this.bestScore = bestScore;
  }

  /**
    * Удалить инфоривацию о юзере при логауте
    */
  removeUser() {
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.name = null;
    this.bestTime = null;
    this.bestScore = null;
  }
}

export const User = new UserSingleton();

/**
 *
 * Проверка авторизации пользователя при вхлоде на сайт
 * @param {function} callback
 */
export function checkAuth(callback: any, difficult = 1) {
  Net.get({url: `/user?difficult=${difficult}`})
      .then((resp) => {
        if (resp.status === 200) {
          resp.json()
              .then((json) => {
                console.log(json);
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
