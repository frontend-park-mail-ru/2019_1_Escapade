import ProfileTemplate from './Profile.pug';
import {validateEmail, validatePass, validateLogin, makeSafe}
  from '../../utils/validation.js';
import {User} from '../../utils/user.js';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
/**
 *
 */
export default class ProfileView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, ProfileTemplate);

    Bus.on('onSuccessChange', (usr) => {
      usr.password = '';
      usr.repassword = '';
      User.setUser({...usr});
      Bus.emit('userUpdate');
    });
    Bus.on('onFailedChange', (error) => {
      this._showWarning(this._warnings.email, error.message);
    });
    Bus.on('onSuccessUpload', this._onSuccessUpload.bind(this));
    Bus.on('onFailedUpload', (error) => {
      this._showWarning(this._warnings.email, error.message);
    });
    Bus.on('onSuccessAvatarGet', this._onSuccessAvatarGet.bind(this));
    Bus.on('onFailedAvatarGet', this._onFailedAvatarGet.bind(this));
  }

  /** */
  render() {
    this.data = User;
    super.render();

    Bus.emit('getAvatar');
    this._form = this.parent.querySelector('.profile__form');
    this._warnings = {};
    this._warnings.email = this.parent.querySelector('.js-warning-email');
    this._warnings.login = this.parent.querySelector('.js-warning-login');
    this._warnings.pass = this.parent.querySelector('.js-warning-password');
    this._warnings.repass = this.parent.querySelector('.js-warning-repassword');
    this._changeButton = this.parent.querySelector('.change__submit');
    this._changeButton
        .addEventListener('click', this._onSubmitDataProfile.bind(this));

    document.getElementById('file')
        .addEventListener('change', this._handleFileSelect.bind(this), false);
  }


  /**
   *
   * @param {*} event
   */
  _onSubmitDataProfile(event) {
    event.preventDefault();
    console.log('event _onSubmitDataProfile');
    const data = {};
    data.email = this._form.elements['email'].value;
    data.name = this._form.elements['login'].value;
    data.password = this._form.elements['password'].value;
    data.repass = this._form.elements['password-repeat'].value;
    if (this._validateInput(data)) {
      console.log(' Data : ' + data.email, ' ',
          data.name, ' ', data.password, ' ', data.repass);
      Bus.emit('changeProfile', data);
    }
  }

  /**
   *
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput(data) {
    let message = '';
    let isValid = true;
    this._hideWarning(this._warnings.email);
    this._hideWarning(this._warnings.login);
    this._hideWarning(this._warnings.pass);
    this._hideWarning(this._warnings.repass);
    data.email = makeSafe(data.email);
    if (data.email != this._data.email) {
      message = validateEmail(data.email);
      if (message.length !== 0) {
        this._showWarning(this._warnings.email, message);
        isValid = false;
      }
    }

    data.name = makeSafe(data.name);
    if (data.name != this._data.name) {
      message = validateLogin(data.name);
      if (message.length !== 0) {
        this._showWarning(this._warnings.login, message);
        isValid = false;
      }
    }

    data.password = makeSafe(data.password);
    data.repass = makeSafe(data.repass);
    if (data.password != '') {
      message = validatePass(data.password);
      if (message.length !== 0) {
        this._showWarning(this._warnings.pass, message);
        isValid = false;
      }
      if (data.repass !== data.password) {
        message = 'Passwords dont match';
        this._showWarning(this._warnings.repass, message);
        isValid = false;
      }
    }
    return isValid;
  }
  /**
   *
   * @param {*} warning
   * @param {*} message
   */
  _showWarning(warning, message) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }
  /**
   *
   * @param {*} warning
   */
  _hideWarning(warning) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }

  /**
   *
   * @param {*} evt
   * @param {*} h
   * @param {*} w
   */
  _handleFileSelect(evt, h = 250, w = 250) {
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
   * @param {*} img
   */
  _onSuccessUpload(img) {
    const reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = ((theFile) => {
      return function(e) {
        // Render thumbnail.
        document.getElementById('output').innerHTML =
          ['<img class="thumb" title="', escape(theFile.name),
            '" src="', e.target.result, '" width="' + 250 +
            '" height="' + 250 + '"  />'].join('');
      };
    })(img);
    // Read in the image file as a data URL.
    reader.readAsDataURL(img);
  }

  /**
   *
   */
  _onFailedAvatarGet() {
    console.log('Failed to get avatar');
    document.getElementById('output')
        .innerHTML = ['<img class="thumb" ', '" src="./img/qrosh.png"'
        + ' width="' + 250 + '" height="' + 250 + '"  />'].join('');
  }

  /**
   *
   * @param {*} blob
   */
  _onSuccessAvatarGet(blob) {
    const objectURL = URL.createObjectURL(blob);
    console.log('_getAvatar' + objectURL);
    document.getElementById('output')
        .innerHTML = ['<img class="thumb" ',
          '" src="', objectURL + '"  />'].join('');
  }
}
