const ProfileTemplate = require('./Profile.pug');
const profileDataTmpl = require('./UserData/Profile__data.pug');
const profileGamesTmpl = require('./UserGames/Profile__game.pug');
import { User } from '../../utils/user';
import { checkAuth } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
import UserDataComponent from './UserData/userdata'
import UserGamesComponent from './UserGames/games'
/**
 *
 */
export default class ProfileView extends BaseView {
  _warnings: any;
  parent: HTMLElement;
  _user: any;
  userData: UserDataComponent;
  userGames: UserGamesComponent;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, ProfileTemplate, false);

    Bus.on('onSuccessUpload', this._onSuccessUpload.bind(this), 'profileView');
    Bus.on('onFailedUpload', (error: { message: any; }) => {
      this._showWarning(this._warnings.email, error.message);
    }, 'profileView');
    Bus.on('onSuccessAvatarGet', this._onSuccessAvatarGet.bind(this), 'profileView');
    Bus.on('onFailedAvatarGet', this._onFailedAvatarGet.bind(this), 'profileView');
    Bus.on('profileGamesScroll', this._onGamesCountChange.bind(this), 'profileView')
  }

  /** */
  render() {
    checkAuth(this.renderCallback.bind(this), 0);
  }

  renderCallback() {
    this.user = User;
    super.render();
    this._warnings = {};
    this._warnings.email = this.parent.querySelector('.js-warning-email');
    this.userData = new UserDataComponent(this.parent.querySelector('.profile__data'), profileDataTmpl)
    this.userData.render()
    this.userGames = new UserGamesComponent(this.parent.querySelector('.profile__games'), profileGamesTmpl)
    Bus.emit('getAvatar', User.name);
    document.getElementById('file')
      .addEventListener('change', this._handleFileSelect.bind(this), false);
  }


  /**
   *
   * @param {*} warning
   * @param {*} message
   */
  _showWarning(warning: any, message: any) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }
  /**
   *
   * @param {*} warning
   */
  _hideWarning(warning: any) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }

  /**
   *
   * @param {*} evt
   * @param {*} h
   * @param {*} w
   */
  _handleFileSelect(evt: any) {
    const file = evt.target.files; // FileList object
    const f = file[0];
    // Only process image files.
    if (!f.type.match('image.*')) {
      alert('Image only please....');
      return;
    }
    Bus.emit('uploadAvatar', f);
  }

  /**
   * @param {*} uploadURL
   */
  _onSuccessUpload(uploadURL: any) {
    // Render thumbnail.'
    const img = document.createElement('img');
    img.src = uploadURL;
    User.avatar = uploadURL;
    img.className = 'thumb';
    document.getElementById('output').innerHTML = '';
    document.getElementById('output').appendChild(img);
  }

  /**
   *
   */
  _onFailedAvatarGet() {
    document.getElementById('output')
      .innerHTML = `<div class=profile__default_avatar></div>`;

  }

  /**
   *
   * @param {*} url
   */
  _onSuccessAvatarGet(url: any) {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'thumb';
    document.getElementById('output').innerHTML = '';
    document.getElementById('output').appendChild(img);
  }

  _onGamesCountChange(count: number) {
    let games = this.parent.querySelector('.profile__games')
    if (count > 3) {
      games.classList.remove('profile__games_noscroll')
    }
  }
}
