const leaderBoardTemplate = require('./LeaderBoard.pug');
const leaderFilterTemplate = require('./Filter/LeaderBoardFilter.pug');
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
import LeaderboardFilterComponent from './Filter/filter';

/** */
export default class LeaderBoardView extends BaseView {
  _currPage: number;
  divisionHeight: number;
  pageStruct: any;
  leaderBoardPageDomElement: any;
  parent: any;
  _pagesCount: any;
  _leftArrow: any;
  _rightArrow: any;
  filter: LeaderboardFilterComponent
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, leaderBoardTemplate, false);
    this._currPage = 1;

    Bus.on('respPagesAmount', this._initBoard.bind(this), 'leaderBoardView');
  }

  /**
   * Отрисовка лидербода и получение необходимой информации с бэкэнда
  */
  _getPageAmount() {
    let devWidth = screen.width * 0.7;
    let devHeight = screen.height * 0.7;

    let fieldHeight = 1;
    if (devWidth < 320) {
      fieldHeight = 80;
    } else if (devWidth < 480) {
      fieldHeight = 60;
    } else if (devWidth < 768) {
      fieldHeight = 70;
    } else if (devWidth < 1200) {
      fieldHeight = 80;
    } else {
      fieldHeight = 90;
    }
    console.log(devHeight, fieldHeight)
    return Math.round(devHeight / fieldHeight);
  }

  /**
   *
   */
  render() {
    Bus.on('respPage', this.renderUsers.bind(this), 'leaderBoardView');
    this.divisionHeight = this._getPageAmount();
    this.pageStruct = { page: 1, per_page: this.divisionHeight };
    Bus.emit('reqPagesAmount', this.pageStruct.per_page);
    Bus.emit('reqPage', this.pageStruct);
  }

  /**
   *
   * @param {*} users
   */
  renderUsers(users: any) {
    const usersStruct = { users: users, page: this._currPage, per_page: this.pageStruct.per_page };
    this.data = usersStruct;
    super.render();
    this.filter = new LeaderboardFilterComponent(this.parent.querySelector('.leaderboard__filter'), leaderFilterTemplate)
    this.filter.render()
    this.leaderBoardPageDomElement = this.parent.querySelector('.leaderboard__footer_page');
    this.leaderBoardPageDomElement.innerHTML = this._currPage;
    this._initButtons();
  }

  /**
   *
   * @param {*} amount
   */
  _initBoard(amount: any) {
    this._pagesCount = amount;
  }

  /**
   * Установка листенеров на кнопки пагинации
   */
  _initButtons() {
    ([this._leftArrow, this._rightArrow] =
      this.parent.querySelectorAll('.leaderboard__arrow'));
    this._leftArrow.addEventListener('click', this._prevPage.bind(this));
    this._rightArrow.addEventListener('click', this._nextPage.bind(this));
    if (this._currPage === 1) {
      this._leftArrow.classList.add('leaderboard__arrow__inactive');
    } else {
      this._leftArrow.classList.remove('leaderboard__arrow__inactive');
    }
    if (this._currPage === this._pagesCount) {
      this._rightArrow.classList.add('leaderboard__arrow__inactive');
    } else {
      this._rightArrow.classList.remove('leaderboard__arrow__inactive');
    }
    if (this._currPage === 1) {
      this.parent.querySelector('.leaderboard__table_number_wrapper').classList.add('bc_winner_num')
      this.parent.querySelector('.leaderboard__table_row_wrapper').classList.add('bc_winner_row')
    }

  }

  /**
   * Переключение на сл.страницу
   */
  _nextPage() {
    if (this._currPage === this._pagesCount) {
      return;
    }

    this.divisionHeight = this._getPageAmount();
    this.pageStruct = { page: ++this._currPage, per_page: this.divisionHeight };
    Bus.emit('reqPage', this.pageStruct);
  }

  /**
   * Переключение на пред.страницу
   */
  _prevPage() {
    if (this._currPage == 1) {
      return;
    }

    this.divisionHeight = this._getPageAmount();
    this.pageStruct = { page: --this._currPage, per_page: this.divisionHeight };
    Bus.emit('reqPage', this.pageStruct);
  }
}
