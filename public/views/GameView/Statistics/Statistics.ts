/* eslint-disable require-jsdoc */
import Bus from '../../../utils/bus';
const Template = require('./Statistics.pug');
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
  HTMLElement: any;

  constructor() {
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.minesCount = 0;
    this.minesRemainedCount = 0;   
    Bus.on('addStatisticsGame', this._addListeners.bind(this), 'statisticsView');
  }

  _addListeners(htmlElementTitle : string) {
    this.HTMLElement = document.querySelector(htmlElementTitle);
    this.HTMLElement.innerHTML = Template();
    this.pointsDocElement = document.querySelector('.single_player__statistics_row_points');
    this.minesDocElement = document.querySelector('.single_player__statistics_row_mines');
    this.leftClicksDocElement = document.querySelector('.single_player__statistics_row_left_click');
    this.rightClicksDocElement = document.querySelector('.single_player__statistics_row_right_click');
    Bus.on('leftClicksStatisticsChange', this._leftClickChange.bind(this), 'statisticsView');
    Bus.on('rightClicksStatisticsChange', this._rightClickChange.bind(this), 'statisticsView');
    Bus.on('pointsStatisticsChange', this._pointsChange.bind(this), 'statisticsView');
    Bus.on('minesStatisticsChange', this._minesChange.bind(this), 'statisticsView');
    Bus.on('statisticsResetParameters', this.resetParameters.bind(this), 'statisticsView');
    this.resetParameters(0);
  }

  /** */
  resetParameters(minesCount : number) {
    this.minesCount = minesCount;
    this.minesRemainedCount = minesCount;
    this.leftClicksCount = 0;
    this.rightClicksCount = 0;
    this.leftClicksDocElement.innerHTML = `0`;
    this.rightClicksDocElement.innerHTML = `0`;
    this.pointsDocElement.innerHTML = `0`;
    this.minesDocElement.innerHTML = `${this.minesRemainedCount}`;
  };

  /** */
  _leftClickChange(number : number) {
    this.leftClicksCount += number;
    this.leftClicksDocElement.innerHTML = `${this.leftClicksCount}`;
  }
  /** */
  _rightClickChange(number : number) {
    this.rightClicksCount += number;
    this.rightClicksDocElement.innerHTML = `${this.rightClicksCount}`;
  }
  /** */
  _pointsChange(number : number) {
    this.pointsDocElement.innerHTML = `${number}`;
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
    this.minesDocElement.innerHTML = `${resultMines}`;
  }
}