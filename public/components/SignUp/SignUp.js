import signUpTemplate from './SignUp.pug';

/** */
export class SignUpComponent {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this._el = el;
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
    this._el.innerHTML = this.template({data: this._data});
  }
}
