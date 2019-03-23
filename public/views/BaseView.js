
/**
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
  /**
   *
   * @param {HTMLElement} parent
   * @param {*} template
   */
  constructor(parent, template) {
    this.parent = parent;
    this.parent.hidden = true;

    this.template = template;
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
    this.parent.innerHTML = this.template({data: this._data});
  }
}
