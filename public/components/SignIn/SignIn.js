import signInTemplate from './SignIn.pug';
import {validatePass} from '../../utils/validation.js';

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
    this._warnings.login = this._el.querySelector('.js-warning-login');
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
    data.login = this._form.elements['login'].value;
    data.pass = this._form.elements['password'].value;
    this._validateInput(data);
  }
  /**
   *
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({email, login, pass, repass}) {
    let isValid = true;

    this._hideWarning(this._warnings.login);
    if (validatePass(login) !== true) {
      let message = 'Invalid login format';
      if (login.length === 0) {
        message = 'Fill login field please';
      }
      this._showWarning(this._warnings.login, message);
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
}
