const ProfileTemplate = require('./Profile__game.pug');
const profileData = require('./Profile__data.pug');
import { User } from '../../utils/user';
import { checkAuth } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
/**
 *
 */
export default class ProfileView extends BaseView {
  _warnings: any;
  parent: any;
  _user: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, ProfileTemplate, false);

    Bus.on('userUpdate', this.onUserUpdate.bind(this));
    Bus.on('onSuccessUpload', this._onSuccessUpload.bind(this));
    Bus.on('onFailedUpload', (error: { message: any; }) => {
      this._showWarning(this._warnings.email, error.message);
    });
    Bus.on('onSuccessAvatarGet', this._onSuccessAvatarGet.bind(this));
    Bus.on('onFailedAvatarGet', this._onFailedAvatarGet.bind(this));
  }

  /** */
  render() {
    checkAuth(this.renderCallback.bind(this), 0);
  }

  renderCallback() {
    if (!User.bestScore.String) {
      User.bestScore.String = '0'
      User.bestTime.String = '0:00:00:00'
    }
    this.user = User;
    console.log('User ', User);
    super.render();
    this._warnings = {};
    this._warnings.email = this.parent.querySelector('.js-warning-email');
    Bus.emit('getAvatar', User.name);
    document.getElementsByClassName('profile__input_score')[0].innerHTML = User.bestScore.String
    document.getElementsByClassName('profile__input_time')[0].innerHTML = User.bestTime.String
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
    console.log('_onSuccessUpload ');
    // Render thumbnail.'
    const img = document.createElement('img');
    img.src = uploadURL;
    img.className = 'thumb';
    document.getElementById('output').innerHTML = '';
    document.getElementById('output').appendChild(img);
  }

  /**
   *
   */
  _onFailedAvatarGet() {
    console.log('Failed to get avatar');
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

  /**
   *
   */
  onUserUpdate() {
    const userInfo = this.parent.querySelector('.profile__data');
    userInfo.innerHTML = profileData({ user: this._user });
  }
}
