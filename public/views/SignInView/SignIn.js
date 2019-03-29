import signInTemplate from './SignIn.pug';
import {validateEmail, validatePass, makeSafe} from '../../utils/validation.js';
import {User} from '../../utils/user.js';
import BaseView from '../BaseView';
import router from '../../main';
import Bus from '../../utils/bus';


/** */
export default class SignInView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, signInTemplate, false);

    Bus.on('onSuccessLogin', (usr) => {
      User.setUser({...usr});
      Bus.emit('userUpdate');
      router.open('/profile');
    });
    Bus.on('onFailedLogin', (error) => {
      this._showWarning(this._warnings.email, error.message);
    });
  }

  /**
   * Отрисовка формы логина и добавление лисенеров
  */
  render() {
    this.data = User;
    super.render();
    this._warnings = {};
    this._warnings.email = this.parent.querySelector('.js-warning-email');
    this._warnings.pass = this.parent.querySelector('.js-warning-password');
    this._form = this.parent.querySelector('.signup__form');

    this._submitButton = this.parent.querySelector('.signup__submit');

    this._submitButton.addEventListener('click', this._onSubmit.bind(this));
  }

  /**
   * Действие при сабмите формы регистрации
   * @param {Event} event
   */
  _onSubmit(event) {
    event.preventDefault();
    const data = {};
    data.email = this._form.elements['email'].value;
    data.password = this._form.elements['password'].value;
    if (this._validateInput(data)) {
      Bus.emit('login', data);
    }
  }

  /**
   * Валидация формы логина
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({email, password}) {
    let isValid = true;
    let message = '';

    this._hideWarning(this._warnings.email);
    email = makeSafe(email);
    message = validateEmail(email);
    if (message.length !== 0) {
      this._showWarning(this._warnings.email, message);
      isValid = false;
    }

    this._hideWarning(this._warnings.pass);
    password = makeSafe(password);
    message = validatePass(password);
    if (message.length !== 0) {
      this._showWarning(this._warnings.pass, message);
      isValid = false;
    }

    return isValid;
  }

  /**
   * Показать предупреждение валидации
   * @param {*} warning
   * @param {*} message
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
