import signUpTemplate from './SignUp.pug';
import {validateEmail, validatePass, validateLogin, makeSafe}
  from '../../utils/validation';
import {User} from '../../utils/user';
import Bus from '../../utils/bus';
import BaseView from '../BaseView';
import router from '../../main';
/** */
export default class SignUpView extends BaseView {
  _warnings: any;
  parent: any;
  _form: any;
  _submitButton: any;
  /**
   *
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent, signUpTemplate, false);

    Bus.on('onSuccessAuth', (usr) => {
      User.setUser({...usr});
      Bus.emit('userUpdate');
      router.open('/profile');
    });
    Bus.on('onFailedAuth', (error) => {
      this._showWarning(this._warnings.email, error.message);
    });
  }

  /**
   * Отрисовка формы регистрации и добавление лисенеров
  */
  render() {
    this.user = User;
    super.render();
    this._warnings = {};
    this._warnings.email = this.parent.querySelector('.js-warning-email');
    this._warnings.login = this.parent.querySelector('.js-warning-login');
    this._warnings.pass = this.parent.querySelector('.js-warning-password');
    this._warnings.repass = this.parent.querySelector('.js-warning-repassword');
    this._form = this.parent.querySelector('.signup__form');

    this._submitButton = this.parent.querySelector('.signup__submit');

    this._submitButton.addEventListener('click', this._onSubmit.bind(this));
  }

  /**
   * Действие при сабмите формы логина
   * @param {Event} event
   */
  _onSubmit(event) {
    console.log('event');
    event.preventDefault();
    const data = {};
    data.email = this._form.elements['email'].value;
    data.name = this._form.elements['login'].value;
    data.password = this._form.elements['password'].value;
    data.repass = this._form.elements['password-repeat'].value;
    if (this._validateInput(data)) {
      console.log(data);
      Bus.emit('auth', data);
    }
  }

  /**
   * Валидация формы авторизации
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({email, name, password, repass}) {
    let isValid = true;
    let message = '';

    this._hideWarning(this._warnings.email);
    email = makeSafe(email);
    message = validateEmail(email);
    if (message.length !== 0) {
      this._showWarning(this._warnings.email, message);
      isValid = false;
    }

    this._hideWarning(this._warnings.login);
    name = makeSafe(name);
    message = validateLogin(name);
    if (message.length !== 0) {
      this._showWarning(this._warnings.login, message);
      isValid = false;
    }

    password = makeSafe(password);
    message = validatePass(password);
    if (message.length !== 0) {
      this._showWarning(this._warnings.pass, message);
      isValid = false;
    }

    repass = makeSafe(repass);
    this._hideWarning(this._warnings.repass);
    if (repass !== password) {
      message = 'Passwords dont match';
      this._showWarning(this._warnings.repass, message);
      isValid = false;
    }
    return isValid;
  }

  /**
   * Показать предупреждение валидации
   * @param {HTMLElement} warning
   * @param {String} message
   */
  _showWarning(warning, message) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }

  /**
   * Скрыть предупреждение валидации
   * @param {*} warning
   */
  _hideWarning(warning) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }
}
