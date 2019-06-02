import { UserSingleton } from '../utils/user';

export default class BaseComponent {
  parent: HTMLElement;
  template: any;
  _data: Object;
  _user: UserSingleton;

  constructor(parent: HTMLElement, template: any) {
    this.parent = parent;
    this.parent.hidden = true;
    this.template = template;
  }

  hide() {
    this.parent.hidden = true;
  }

  get rendered() {
    return !(this.parent.innerHTML === '');
  }

  show() {
    if (!this.rendered) {
      this.render();
    }
    this.parent.hidden = false;
  }

  set data(data: object) {
    this._data = data;
  }

  /**
   * @param {Object} user
  */
  set user(user: UserSingleton) {
    this._user = user;
  }

  // set emitFuncStr(data: string) {
  //   this._emitFuncStr = data;
  // }

  /**
   *
   */
  render() {
    this.parent.innerHTML = '';
    this.parent.innerHTML = this.template({ data: this._data, user: this._user });
  }

}
