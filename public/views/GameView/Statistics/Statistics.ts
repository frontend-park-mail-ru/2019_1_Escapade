/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
/** */
export default class StatisticsGameView {
  leftClicksDocElement: any;
  config: any;
  rightClicksDocElement: any;
  _updateUserInfo: any;
  pointsDocElement: any;
  minesDocElement: any;
  leftClicksCount: number;
  rightClicksCount: number;
  pointsCount: number;
  minesRemainedCount: number;
  minesCount: number;

  constructor() {
    this.pointsDocElement = document.querySelector('.single_player__statistics_row_points');
    this.minesDocElement = document.querySelector('.single_player__statistics_row_mines');
    this.leftClicksDocElement = document.querySelector('.single_player__statistics_row_left_click');
    this.rightClicksDocElement = document.querySelector('.single_player__statistics_row_right_click');
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.minesCount = 0;
    this.minesRemainedCount = 0;
    this.resetParameters(0);
    Bus.on('leftClicksStatisticsChange', this._leftClickChange.bind(this));
    Bus.on('rightClicksStatisticsChange', this._rightClickChange.bind(this));
    Bus.on('pointsStatisticsChange', this._pointsChange.bind(this));
    Bus.on('minesStatisticsChange', this._minesChange.bind(this));
    Bus.on('statisticsResetParameters', this.resetParameters.bind(this));
  }
  /** */
  resetParameters(minesCount : number) {
    this.minesCount = minesCount;
    this.minesRemainedCount = minesCount;
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.leftClicksDocElement.innerHTML = `0 left clicks`;
    this.rightClicksDocElement.innerHTML = `0 right clicks`;
    this.pointsDocElement.innerHTML = `0 points`;
    this.minesDocElement.innerHTML = `${this.minesRemainedCount} mines left`;
  };

  /** */
  _leftClickChange(number : number) {
    this.leftClicksCount += number;
    this.leftClicksDocElement.innerHTML = `${this.leftClicksCount} left clicks`;
  }
  /** */
  _rightClickChange(number : number) {
    this.rightClicksCount += number;
    this.rightClicksDocElement.innerHTML = `${this.rightClicksCount} right clicks`;
  }
  /** */
  _pointsChange(number : number) {
    this.pointsDocElement.innerHTML = `${number} points`;
  }
  /** */
  _minesChange(number : number) {
    this.minesRemainedCount += number;
    let resultMines;
    if (this.minesRemainedCount < 0) {
      resultMines = 0;
    } else if (this.minesRemainedCount > this.minesCount) {
      resultMines = this.minesCount;
    } else {
      resultMines = this.minesRemainedCount;
    }
    this.minesDocElement.innerHTML = `${resultMines} mines left`;
  }
}