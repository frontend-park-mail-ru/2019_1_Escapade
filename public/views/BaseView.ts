import Bus from '../utils/bus';


/**
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
  parent: any;
  template: any;
  isOffline: any;
  _emitFuncStr: string;
  _data: any;
  _user: any;
  overlayOffline: any;
  hideButton: any;
  /**
   *
   * @param {HTMLElement} parent
   * @param {*} template
   * @param {*} isOffline
   * @param {*} emitFuncStr
   */
  constructor(parent: HTMLElement, template = '', isOffline = false, emitFuncStr = '') {
    this.parent = parent;
    this.parent.hidden = true;
    this.template = template;
    this.isOffline = isOffline;
    this._emitFuncStr = emitFuncStr;
    this._data = null;
    this._user = null;
  }
  /** */
  get active() {
    return !this.parent.hidden;
  }
  /**
   *
   */
  hide() {
    this.parent.hidden = true;
  }

  /** */
  get rendered() {
    return !(this.parent.innerHTML === '');
  }

  /**
   *
   */
  show() {
    if (!this.rendered) {
      this.render();
    }
    Bus.emit(this._emitFuncStr);
    this.parent.hidden = false;
  }

  /**
   * @param {Object} data
  */
  set data(data: object) {
    this._data = data;
  }

  /**
   * @param {Object} user
  */
  set user(user: object) {
    this._user = user;
  }

  /**
   * @param {Object} data
  */
  set emitFuncStr(data: string) {
    this._emitFuncStr = data;
  }

  /**
   *
   */
  render() {
    this.parent.innerHTML = '';
    this.parent.innerHTML = this.template({ data: this._data, user: this._user });
    this._initOfflinePopup();
  }

  /**
   *
   */
  _initOfflinePopup() {
    this.overlayOffline = this.parent.querySelector('.overlay__offline');
    if (!this.overlayOffline) {
      return;
    }
    this.overlayOffline.hidden = true;
    this.hideButton =
      this.overlayOffline.querySelector('.modal__button');
    this.hideButton.addEventListener('click',
      this._hideOfflineOverlay.bind(this));
  }

  /**
   *
   */
  showOfflineOverlay() {
    if (!this.overlayOffline) {
      return;
    }
    this.overlayOffline.hidden = false;
  }

  /**
   *
   */
  _hideOfflineOverlay() {
    if (!this.overlayOffline) {
      return;
    }
    this.overlayOffline.hidden = true;
  }
}
