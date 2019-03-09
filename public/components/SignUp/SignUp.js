import signUpTemplate from './SignUp.pug';
import {validateEmail, validatePass} from '../../utils/validation.js';
import {User} from '../../utils/user.js';
import {Net} from '../../utils/net.js';
import {createProfile} from '../../main.js';
/** */
export class SignUpComponent {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this.parent = el;
    this.template = signUpTemplate;
  }

  /**
   * @param {*} d
  */
  set data(d = []) {
    this._data = d;
  }

  /** */
  render() {
    this.parent.innerHTML = this.template({data: this._data});

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
   *
   * @param {*} event
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
      this._auth(data);
    }
  }
  /**
   *
   * @param  {...any} data
   * @return {boolean}
   */
  _validateInput({email, name, password, repass}) {
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

    this._hideWarning(this._warnings.login);
    if (validatePass(name) !== true) {
      let message = 'Invalid login format';
      if (name.length === 0) {
        message = 'Fill login field please';
      }
      this._showWarning(this._warnings.login, message);
      isValid = false;
    }

    this._hideWarning(this._warnings.pass);
    if (validatePass(password) !== true) {
      let message = 'Invalid password format';
      if (password.length === 0) {
        message = 'Fill password field please';
      }
      this._showWarning(this._warnings.pass, message);
      isValid = false;
    }

    this._hideWarning(this._warnings.repass);
    if (repass !== password) {
      let message = 'Passwords dont match';
      if (repass.length === 0) {
        message = 'Repeat password please';
      }
      this._showWarning(this._warnings.repass, message);
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
  _auth(data) {
    console.log(data);
    Net.post({url: '/register', body: data})
        .then((resp) => {
          if (resp.status === 201) {
            User.setUser({...data});
            createProfile();
            console.log(User);
          } else {
            resp
                .json()
                .then((error) => {
                  this._showWarning(this._warnings.email, error.message);
                });
          }
        });
  }
}
