const signUpTemplate = require('./SignUp.pug');
import {  validatePass, validateLogin, makeSafe }
  from '../../utils/validation';
import { User } from '../../utils/user';
import Bus from '../../utils/bus';
import BaseView from '../BaseView';
import router from '../../main';
/** */
export default class SignUpView extends BaseView {
  _warnings: any;
  parent: any;
  _form: any;
  _submitButton: any;
  inputs: any;
  _exitButton: any;
  curPath: string;
  /**
   *
   * @param {HTMLElement} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, signUpTemplate, false);

    Bus.on('onSuccessAuth', (usr: any) => {
      console.log('signUp ' + usr);
      User.setUser({ ...usr });
      Bus.emit('userUpdate');
      router.open('/profile');
    }, 'signupView');
    Bus.on('onFailedAuth', (error: any) => {
      this._showWarning(this._warnings.login, error.message);
    }, 'signupView');
    
  }

  /**
   * Отрисовка формы регистрации и добавление лисенеров
  */
  render() {
    super.render();
    this._warnings = {};
    this._warnings.login = this.parent.querySelector('.js-warning-login');
    this._warnings.pass = this.parent.querySelector('.js-warning-password');
    this._warnings.repass = this.parent.querySelector('.js-warning-repassword');
    this.inputs = this.parent.querySelectorAll('.signup__input'); 
    this._form = this.parent.querySelector('.signup__form');

    this._submitButton = this.parent.querySelector('.signup__confirm');
    this._exitButton = this.parent.querySelector('.signup__exit');

    this._exitButton.addEventListener('click', this._onExitButton.bind(this));
    this._submitButton.addEventListener('click', this._onSubmit.bind(this));
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'signUpView');
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/sign_up') {
      this.curPath = path;
      this.inputs.forEach((element: any) => {
        element.value = '';
      });
      this._hideWarning(this._warnings.login);
      this._hideWarning(this._warnings.pass);
      this._hideWarning(this._warnings.repass);
    } else {
      if (this.curPath === '/sign_up') {
        this.curPath = '';
      }
    }
  }

  /**
   * Действие при сабмите формы логина
   * @param {Event} event
   */
  _onSubmit(event: any) {
    console.log('event');
    event.preventDefault();
    const data: any = {};
    data.email = 'hey@mail.ru';
    data.name = this._form.elements['login'].value;
    data.password = this._form.elements['password'].value;
    data.repass = this._form.elements['password-repeat'].value;
    if (this._validateInput(data)) {
      console.log(data);
      Bus.emit('auth', data);
    }
    
  }

  _onExitButton() {
    this.inputs.forEach((element: any) => {
      element.value = '';
    });
    this._hideWarning(this._warnings.login);
    this._hideWarning(this._warnings.pass);
    this._hideWarning(this._warnings.repass);
  }

  /**
   * Валидация формы авторизации
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({ name = '', password = '', repass = '' }) {
    let isValid = true;
    let message = '';

  
    this._hideWarning(this._warnings.login);
    name = makeSafe(name);
    message = validateLogin(name);
    if (message.length !== 0) {
      this._showWarning(this._warnings.login, message);
      isValid = false;
    }

    password = makeSafe(password);
    this._hideWarning(this._warnings.pass);
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
  _showWarning(warning: any, message: string) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }

  /**
   * Скрыть предупреждение валидации
   * @param {*} warning
   */
  _hideWarning(warning: any) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }
}
