import leaderBoardTemplate from './LeaderBoard.pug';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';

/** */
export default class LeaderBoardView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, leaderBoardTemplate, false);
    this._currPage = 1;

    Bus.on('respPagesAmount', this._initBoard.bind(this));
    
  }

  /**
   * Отрисовка лидербода и получение необходимой информации с бэкэнда
  */
  render() {
    Bus.on('respPage', this.renderUsers.bind(this));
    // const leaderboardTableRowDomElement = document.getElementsByClassName('leaderboard__table_row')[0];
    const maxHeight = screen.height;
    console.log(maxHeight, ' ', Math.round(maxHeight / 20) - 1);
    const divisionHeight = Math.round(maxHeight / 20) - 1;
    this.pageStruct = {page: 1, per_page: divisionHeight};
    Bus.emit('reqPagesAmount', this.pageStruct.per_page);
    Bus.emit('reqPage', this.pageStruct);
  }

  /**
   *
   * @param {*} users
   */
  renderUsers(users) {
    console.log(users);
    this.data = users;
    super.render();
  }

  /**
   *
   * @param {*} amount
   */
  _initBoard(amount) {
    this._pagesCount = amount;
    this._initButtons();
    this.board = new BoardComponent(
        this.parent.querySelector('.leaderboard__board'));
    console.log('initBoard');
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
    Bus.emit('reqPage', this._currPage + 1);
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
    Bus.emit('reqPage', this._currPage - 1);
    if (this._currPage === this._pagesCount) {
      this._rightArrow.classList.remove('arrow__inactive');
    }
    this._currPage -= 1;
    if (this._currPage === 1) {
      this._leftArrow.classList.add('arrow__inactive');
    }
  }
}
