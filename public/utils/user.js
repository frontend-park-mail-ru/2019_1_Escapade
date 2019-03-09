import {Net} from './net.js';
/** */
class UserSingleton {
  /** */
  constructor() {
    this.name = null;
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.password = null;
  }

  /**
   * @param {string} email
   * @param {string} score
   * @param {string} avatar
   * @param {string} name
   */
  setUser({email, played, avatar, password, name} = {}) {
    this.email = email || null;
    this.played = played || 0;
    this.avatar = avatar || './img/qrosh.png';
    this.name = name || null;
    this.password = password || null;
  }

  /**
     *
     */
  removeUser() {
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.name = null;
    this.password = null;
  }
}

export const User = new UserSingleton();

/**
 * @param {function} callback
 */
export function checkAuth(callback) {
  Net.get({url: '/me'})
      .then((resp) => {
        if (resp.status === 200) {
          resp
              .json()
              .then((json) => {
                User.setUser({...json});
                callback();
              });
        } else {
          console.log('No Auth');
          User.removeUser();
          callback();
        }
      });
}
