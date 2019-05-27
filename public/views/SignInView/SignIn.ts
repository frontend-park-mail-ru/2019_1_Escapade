const signInTemplate = require('./SignIn.pug');
import { validateLogin, validatePass, makeSafe } from '../../utils/validation';
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import router from '../../main';
import Bus from '../../utils/bus';


/** */
export default class SignInView extends BaseView {
  _warnings: any;
  parent: any;
  _form: any;
  _submitButton: any;
  inputs: any;
  _exitButton: any;
  curPath: string;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, signInTemplate, false);

    Bus.on('onSuccessLogin', (usr: any) => {
      console.log('signIn ' + usr);
      User.setUser({ ...usr });
      Bus.emit('userUpdate');
      router.open('/profile');
    }, 'signinView');
    Bus.on('onFailedLogin', (error: { message: any; }) => {
      this._showWarning(this._warnings.name, error.message);
    }, 'signinView');
   
  }

  /**
   * Отрисовка формы логина и добавление лисенеров
  */
  render() {
    this.user = User;
    super.render();
    this._warnings = {};
    this._warnings.name = this.parent.querySelector('.js-warning-name');
    this._warnings.pass = this.parent.querySelector('.js-warning-password');
    this._form = this.parent.querySelector('.signin__form');

    this._submitButton = this.parent.querySelector('.signin__confirm');
    this.inputs = this.parent.querySelectorAll('.signin__input'); 
    this._submitButton.addEventListener('click', this._onSubmit.bind(this));

    this._exitButton = this.parent.querySelector('.signin__exit');
    this._exitButton.addEventListener('click', this._onExitButton.bind(this));
    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'signInView');
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/sign_in') {
      this.curPath = path;
      this.inputs.forEach((element: any) => {
        element.value = '';
      });
      this._hideWarning(this._warnings.name);
      this._hideWarning(this._warnings.pass);
    } else {
      if (this.curPath === '/sign_in') {
        this.curPath = '';
      }
    }
  }

  /**
   * Действие при сабмите формы регистрации
   * @param {Event} event
   */
  _onSubmit(event: any) {
    event.preventDefault();
    const data: any = {};
    data.name = this._form.elements['login'].value;
    data.password = this._form.elements['password'].value;
    if (this._validateInput(data)) {
      Bus.emit('login', data);
      
    }
  }

  _onExitButton() {
    this.inputs.forEach((element: any) => {
      element.value = '';
    });
    this._hideWarning(this._warnings.name);
    this._hideWarning(this._warnings.pass);
  }

  /**
   * Валидация формы логина
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({ name = '', password = '' }) {
    let isValid = true;
    let message = '';

    this._hideWarning(this._warnings.name);
    name = makeSafe(name);
    message = validateLogin(name);
    if (message.length !== 0) {
      this._showWarning(this._warnings.name, message);
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
  _showWarning(warning: { classList: { remove: (arg0: string) => void; }; innerHTML: string; }, message: string) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }

  /**
   * Скрыть предупреждение валидации
   * @param {*} warning
   */
  _hideWarning(warning: { classList: { add: (arg0: string) => void; }; innerHTML: string; }) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }
}
