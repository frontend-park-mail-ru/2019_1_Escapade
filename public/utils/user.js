
/** */
class UserSingleton {
  /** */
  constructor() {
    this.login = null;
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.guid = null;
  }

  /**
   * @param {string} email
   * @param {string} score
   * @param {string} avatar
   * @param {string} guid
   * @param {string} login
   */
  setUser({email, played, avatar, guid, login} = {}) {
    this.email = email || null; ;;
    this.played = played || 0;
    this.avatar = avatar || './img/qrosh.png';
    this.guid = guid || null;
    this.login = login || null;
  }

  /**
     *
     */
  removeUser() {
    this.email = null;
    this.played = null;
    this.avatar = null;
    this.guid = null;
    this.login = null;
  }
}

export const User = new UserSingleton();
