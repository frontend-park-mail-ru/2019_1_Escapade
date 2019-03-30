import headerTmpl from './HeaderInner.pug';
import Bus from '../utils/bus';


/**
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
  /**
   *
   * @param {HTMLElement} parent
   * @param {*} template
   * @param {*} isOffline
   */
  constructor(parent, template, isOffline) {
    this.parent = parent;
    this.parent.hidden = true;
    this.template = template;
    this.isOffline = isOffline;

    Bus.on('userUpdate', this.onUserUpdate.bind(this));
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
    this.parent.hidden = false;
  }

  /**
   * @param {Object} data
  */
  set data(data = []) {
    this._data = data;
  }

  /**
   *
   */
  render() {
    this.parent.innerHTML = '';
    this.parent.innerHTML = this.template({data: this._data});
    this._initOfflinePopup();
  }

  /**
   *
   */
  _initOfflinePopup() {
    this.overlayOffline = this.parent.querySelector('.overlay__offline');
    this.overlayOffline.hidden = true;
    this.hideButton =
      this.overlayOffline.querySelector('.modal__button');
    this.hideButton.addEventListener('click',
        this._hideOfflineOverlay.bind(this));
  }

  /**
   *
   */
  onUserUpdate() {
    const header = this.parent.querySelector('.menu-header');
    if (header) {
      header.innerHTML = headerTmpl({data: this._data});
    }
  }

  /**
   *
   */
  showOfflineOverlay() {
    this.overlayOffline.hidden = false;
  }

  /**
   *
   */
  _hideOfflineOverlay() {
    this.overlayOffline.hidden = true;
  }
}
