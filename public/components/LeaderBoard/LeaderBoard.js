import boardTemplate from './LeaderBoard.pug';

/** */
export class LeaderBoardComponent {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this.parent = el;
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
