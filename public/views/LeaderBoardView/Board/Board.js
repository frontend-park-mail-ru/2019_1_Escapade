import boardTemplate from './Board.pug';

/** */
export class BoardComponent {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    this.parent = parent;
    this.template = boardTemplate;
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
