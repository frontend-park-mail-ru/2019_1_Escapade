const ProfileEditTemplate = require('./ProfileEdit.pug');
import { validateEmail, validatePass, validateLogin, makeSafe }
  from '../../utils/validation';
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
import router from '../../main';
/**
 *
 */
export default class ProfileEditView extends BaseView {
  _warnings: any;
  _form: any;
  parent: any;
  _changeButton: any;
  _data: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, ProfileEditTemplate, false);

    Bus.on('onSuccessChange', (usr: any) => {
      User.name = usr.name
      Bus.emit('userUpdate');
      router.open('/profile');
    }, 'profileEditView');
    Bus.on('onFailedChange', (error: { message: any; }) => {
      this._showWarning(this._warnings.email, error.message);
    }, 'profileEditView');
  }

  /** */
  render() {
    this.data = User;
    super.render();

    this._form = this.parent.querySelector('.profile_edit__form');
    this._warnings = {};
    this._warnings.login = this.parent.querySelector('.js-warning-login');
    this._warnings.pass = this.parent.querySelector('.js-warning-password');
    this._warnings.repass = this.parent.querySelector('.js-warning-repassword');
    this._changeButton = this.parent.querySelector('.profile_edit__confirm');
    this._changeButton
      .addEventListener('click', this._onSubmitDataProfile.bind(this));
  }


  /**
   *
   * @param {*} event
   */
  _onSubmitDataProfile(event: { preventDefault: () => void; }) {
    event.preventDefault();
    const data: any = {};
    data.name = this._form.elements['login'].value;
    data.password = this._form.elements['password'].value;
    data.repass = this._form.elements['password-repeat'].value;
    if (this._validateInput(data)) {
      console.log('validated');
      Bus.emit('changeProfile', data);
    }
  }

  /**
   *
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput(data: { name?: any; password?: any; repass?: any; }) {
    let message = '';
    let isValid = true;
    this._hideWarning(this._warnings.login);
    this._hideWarning(this._warnings.pass);
    this._hideWarning(this._warnings.repass);

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
  _showWarning(warning: { classList: { remove: (arg0: string) => void; }; innerHTML: string; }, message: string) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }
  /**
   *
   * @param {*} warning
   */
  _hideWarning(warning: { classList: { add: (arg0: string) => void; }; innerHTML: string; }) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }
}
