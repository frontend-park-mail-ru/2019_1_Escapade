import ProfileTemplate from './Profile.pug';
import {Net} from '../../utils/net.js';
import {validateEmail, validatePass, validateLogin, makeSafe}
  from '../../utils/validation.js';
import {User} from '../../utils/user.js';
import BaseView from '../BaseView';
import router from '../../main';
import Bus from '../../utils/bus';
/**
 *
 */
export class ProfileView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, ProfileTemplate);
  }

  /** */
  render() {
    this.data = User;
    super.render();

    this._getAvatar();
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
    console.log(this._data);
    if (this._validateInput(data)) {
      console.log(' hello56 ' + data.email, ' ',
          data.name, ' ', data.password, ' ', data.repass);
      this._changeProfile(data);
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
   * @param {*} file
   */
  _uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    console.log('upload photo');
    Net.postPhoto({url: '/avatar', body: formData})
        .then((resp) => {
          if (resp.status === 201) {
            resp
                .json()
                .then((json) => {
                  console.log('Okey photo');
                });
          } else {
            resp
                .json()
                .then((error) => {
                  this._showWarning(this._warnings.email, error.error);
                });
          }
        });
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
    this._uploadAvatar(f);
    const reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = ((theFile) => {
      return function(e) {
        // Render thumbnail.
        document.getElementById('output').innerHTML =
          ['<img class="thumb" title="', escape(theFile.name),
            '" src="', e.target.result, '" width="' + w +
            '" height="' + h + '"  />'].join('');
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

  /**
   *
   * @param {*} w
   * @param {*} h
   */
  _getAvatar(w = 250, h = 250) {
    Net.get({url: '/avatar'})
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            const buffer = resp.blob();
            return buffer;
          } else {
            document.getElementById('output')
                .innerHTML = ['<img class="thumb" ', '" src="./img/qrosh.png"'
              + ' width="' + w + '" height="' + h + '"  />'].join('');
            return;
          }
        })
        .then((myBlob) => {
          console.log(myBlob);
          if (myBlob === undefined) {
            return;
          }
          const objectURL = URL.createObjectURL(myBlob);
          console.log('_getAvatar112' + objectURL);
          document.getElementById('output')
              .innerHTML = ['<img class="thumb" ',
                '" src="', objectURL + '"  />'].join('');
        });
  }

  /**
   *
   * @param {*} data
   */
  _changeProfile(data) {
    console.log(data);
    Net.put({url: '/user', body: data})
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            data.password = '';
            data.repassword = '';
            User.setUser({...data});
            Bus.emit('userUpdate', null);
            router.open('/profile');
          } else {
            return resp.json();
          }
        })
        .catch((error) => {
          this._showWarning(this._warnings.email, error.message);
        });
  }
}
