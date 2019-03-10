import ProfileTemplate from './Profile.pug';
import {Net} from '../../utils/net.js';
import {validateEmail, validatePass} from '../../utils/validation.js';
import {User} from '../../utils/user.js';
import {createProfile} from '../../main.js';
/**
 *
 */
export class ProfileComponent {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this._el = el;
    this.template = ProfileTemplate;
  }

  /**
   * @param {*} d
  */
  set data(d = []) {
    this._data = d;
  }

  /** */
  render() {
    this._el.innerHTML = this.template({data: this._data});
    this._getAvatar();
    this._form = this._el.querySelector('.signup__form');
    this._warnings = {};
    this._warnings.email = this._el.querySelector('.js-warning-email');
    this._warnings.login = this._el.querySelector('.js-warning-login');
    this._warnings.pass = this._el.querySelector('.js-warning-password');
    this._warnings.repass = this._el.querySelector('.js-warning-repassword');
    this._changeButton = this._el.querySelector('.change__submit');
    this._changeButton.addEventListener('click', this._onSubmitDataProfile.bind(this));

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
      console.log(' hello56 ' + data.email, ' ', data.name, ' ', data.password, ' ', data.repass);
      this._changeProfile(data);
    }
  }

  /**
   *
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput(data) {
    let isValid = true;
    this._hideWarning(this._warnings.email);
    this._hideWarning(this._warnings.login);
    this._hideWarning(this._warnings.pass);
    this._hideWarning(this._warnings.repass);
    if (data.email != this._data.email) {
      if (validateEmail(data.email) !== true) {
        let message = 'Invalid email format';
        if (data.email.length === 0) {
          message = 'Fill email field please';
        }
        this._showWarning(this._warnings.email, message);
        isValid = false;
      }
    }

    if (data.name != this._data.name) {
      this._hideWarning(this._warnings.login);
      if (validatePass(data.name) !== true) {
        let message = 'Invalid login format';
        if (data.name.length === 0) {
          message = 'Fill login field please';
        }
        this._showWarning(this._warnings.login, message);
        isValid = false;
      }
    }

    if (data.password != '') {
      this._hideWarning(this._warnings.pass);
      if (validatePass(data.password) !== true) {
        let message = 'Invalid password format';
        if (data.password.length === 0) {
          message = 'Fill password field please';
        }
        this._showWarning(this._warnings.pass, message);
        isValid = false;
      }

      this._hideWarning(this._warnings.repass);
      if (data.repass !== data.password) {
        let message = 'Passwords dont match';
        if (data.repass.length === 0) {
          message = 'Repeat password please';
        }
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
    Net.postPhoto({url: '/user/Avatar', body: formData})
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
    Net.get({url: '/user/Avatar'})
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
            createProfile();
          } else {
            return resp.json();
          }
        })
        .then((error) => {
          this._showWarning(this._warnings.email, error.message);
        });
  }
}
