import leaderBoardTemplate from './LeaderBoard.pug';
import {BoardComponent} from './Board/Board.js';
import {Net} from '../../utils/net.js';

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
    this.template = leaderBoardTemplate;
    this._currPage = 1;
  }

  /**
   * @param {*} d
  */
  set data(d = []) {
    this._data = d;
  }

  /** */
  render() {
    Net.get({url: '/leaderboard/pages/count'})
        .then((resp) => {
          return resp.json();
        })
        .then((count) => {
          this._pagesCount = count.count;
          this.parent.innerHTML = this.template();
          this._initButtons();
          this.board = new BoardComponent({
            el:
            this.parent.querySelector('.leaderboard__wrapper'),
          });
          Net.get({url: '/leaderboard/pages/1'})
              .then((resp) => {
                return resp.json();
              })
              .then((data) => {
                this.board.data = data;
                this.board.render();
              });
        });
  }

  /**
   *
   */
  _initButtons() {
    this._arrows = this.parent.querySelectorAll('.arrow');
    this._arrows[0].addEventListener('click', this._prevPage.bind(this));
    this._arrows[1].addEventListener('click', this._nextPage.bind(this));
    if (this._pagesCount === 1) {
      this._arrows[1].classList.add('arrow__inactive');
    }
  }

  /**
   *
   */
  _nextPage() {
    if (this._currPage === this._pagesCount) {
      return;
    }
    if (this._currPage === 1) {
      this._arrows[0].classList.remove('arrow__inactive');
    }
    this._currPage += 1;
    if (this._currPage === this._pagesCount) {
      this._arrows[1].classList.add('arrow__inactive');
    }
  }

  /**
   *
   */
  _prevPage() {
    if (this._currPage == 1) {
      return;
    }
    if (this._currPage === this._pagesCount) {
      this._arrows[1].classList.remove('arrow__inactive');
    }
    this._currPage -= 1;
    if (this._currPage === 1) {
      this._arrows[0].classList.add('arrow__inactive');
    }
  }
}
