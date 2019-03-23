import authorsTemplate from './Authors.pug';

/** */
export class AuthorsView {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this.parent = el;
    this.template = authorsTemplate;
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
  }
}
