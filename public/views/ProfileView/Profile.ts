const ProfileTemplate = require('./Profile.pug');
const profileDataTmpl = require('./UserData/Profile__data.pug');
import { User } from '../../utils/user';
import { checkAuth } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
import UserDataComponent from './UserData/userdata'
/**
 *
 */
export default class ProfileView extends BaseView {
  _warnings: any;
  parent: any;
  _user: any;
  userData: UserDataComponent;
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
  }

  /** */
  render() {
    checkAuth(this.renderCallback.bind(this), 0);
  }

  renderCallback() {
    this.user = User;
    console.log('User ', User);
    super.render();
    this._warnings = {};
    this._warnings.email = this.parent.querySelector('.js-warning-email');
    this.userData = new UserDataComponent(this.parent.querySelector('.profile__data'), profileDataTmpl)
    this.userData.render()
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
    console.log('_onSuccessUpload ');
    // Render thumbnail.'
    const img = document.createElement('img');
    img.src = uploadURL;
    User.avatar = uploadURL;
    console.log(User.avatar);
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
}
