import leaderBoardTemplate from './LeaderBoard.pug';
import {BoardComponent} from './Board/Board.js';
import {Net} from '../../utils/net.js';

/** */
export class LeaderBoardView {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this.parent = el;
    this.template = leaderBoardTemplate;
    this._currPage = 1;
  }

  /**
   * @param {*} d
  */
  set data(d = []) {
    this._data = d;
  }

  /**
   * Отрисовка лидербода и получение необходимой информации с бэкэнда
  */
  render() {
    Net.get({url: '/users/pages_amount'})
        .then((resp) => {
          return resp.json();
        })
        .then((count) => {
          this._pagesCount = count.amount;
          console.log('Pages amount', count.amount);
          this.parent.innerHTML = this.template();
          this._initButtons();
          this.board = new BoardComponent({
            el:
            this.parent.querySelector('.leaderboard__wrapper'),
          });
          this._getPage(1)
              .then((data) => {
                this.board.data = data;
                this.board.render();
              });
        });
  }

  /**
   * Установка листенеров на кнопки пагинации
   */
  _initButtons() {
    ([this._leftArrow, this._rightArrow] =
      this.parent.querySelectorAll('.arrow'));
    this._leftArrow.addEventListener('click', this._prevPage.bind(this));
    this._rightArrow.addEventListener('click', this._nextPage.bind(this));
    if (this._pagesCount === 1) {
      this._rightArrow.classList.add('arrow__inactive');
    }
  }

  /**
   * Переключение на сл.страницу
   */
  _nextPage() {
    if (this._currPage === this._pagesCount) {
      return;
    }
    this._getPage(this._currPage + 1)
        .then((data) => {
          console.log(data);
          this.board.data = data;
          this.board.render();
        });
    if (this._currPage === 1) {
      this._leftArrow.classList.remove('arrow__inactive');
    }
    this._currPage += 1;
    if (this._currPage === this._pagesCount) {
      this._rightArrow.classList.add('arrow__inactive');
    }
  }

  /**
   * Переключение на пред.страницу
   */
  _prevPage() {
    if (this._currPage == 1) {
      return;
    }
    this._getPage(this._currPage - 1)
        .then((data) => {
          this.board.data = data;
          this.board.render();
        });
    if (this._currPage === this._pagesCount) {
      this._rightArrow.classList.remove('arrow__inactive');
    }
    this._currPage -= 1;
    if (this._currPage === 1) {
      this._leftArrow.classList.add('arrow__inactive');
    }
  }

  /**
   * Получение списка юзеров для страницы с бэкэнда
   *@param {int} page
   @return {Promise<any>}
   */
  _getPage(page) {
    return Net.get({url: `/users/pages/${page}`})
        .then((resp) => {
          return resp.json();
        });
  }
}
