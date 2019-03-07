import signInTemplate from './SignIn.pug';
import {validatePass, validateEmail} from '../../utils/validation.js';
import {User} from '../../utils/user.js';
import {Net} from '../../utils/net.js';
import {createProfile} from '../../main.js';


/** */
export class SignInComponent {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this._el = el;
    this.template = signInTemplate;
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
    this._warnings = {};
    this._warnings.email = this._el.querySelector('.js-warning-email');
    this._warnings.pass = this._el.querySelector('.js-warning-password');
    this._form = this._el.querySelector('.signup__form');

    this._submitButton = this._el.querySelector('.signup__submit');

    this._submitButton.addEventListener('click', this._onSubmit.bind(this));
  }

  /**
   *
   * @param {*} event
   */
  _onSubmit(event) {
    event.preventDefault();
    const data = {};
    data.email = this._form.elements['email'].value;
    data.pass = this._form.elements['password'].value;
    if (this._validateInput(data)) {
      this._login(data);
    }
  }
  /**
   *
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({email, login, pass, repass}) {
    let isValid = true;

    this._hideWarning(this._warnings.email);
    if (validateEmail(email) !== true) {
      let message = 'Invalid email format';
      if (email.length === 0) {
        message = 'Fill email field please';
      }
      this._showWarning(this._warnings.email, message);
      isValid = false;
    }

    this._hideWarning(this._warnings.pass);
    if (validatePass(pass) !== true) {
      let message = 'Invalid password format';
      if (pass.length === 0) {
        message = 'Fill password field please';
      }
      this._showWarning(this._warnings.pass, message);
      isValid = false;
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
   * @param {object} data
   */
  _login(data) {
    Net.post({url: '/login', body: data})
        .then((resp) => {
          if (resp.status === 200) {
            resp
                .json()
                .then((json) => {
                  User.setUser({...data});
                  createProfile();
                  console.log(User);
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
}
