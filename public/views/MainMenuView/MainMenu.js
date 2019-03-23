import menuTemplate from './MainMenu.pug';

/** */
export class MainMenuView {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this.parent = el;
    this.template = menuTemplate;
  }

  /**
   * @param {*} d
  */
  set data(d = []) {
    this._data = d;
  }

  /**
   * Отрисовка главного меню
  */
  render() {
    this.parent.innerHTML = this.template({data: this._data});
  }
}
