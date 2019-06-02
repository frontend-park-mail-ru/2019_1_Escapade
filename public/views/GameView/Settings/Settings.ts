import Bus from '../../../utils/bus';
const Template = require('./Settings.pug');
/** */
export default class SettingsGameView {
  infoModeDocElement: any;
  infoWidthDocElement: any;
  infoHeightDocElement: any;
  infoMinesDocElement: any;
  leftClicksCount: number;
  rightClicksCount: number;
  pointsCount: number;
  minesCount: number;
  minesRemainedCount: number;
  difficult: number;
  width: number;
  height: number;
  timerHTMLElement: any;
  clickOnBodyBindThis: any;
  numOfSize: number;
  constructor() {
    this.difficult = 1;
    this.minesCount = 20;
    this.width = 14;
    this.height = 14;
    this.numOfSize = 0;
    Bus.on('addSettingsGame', this._addListeners.bind(this), 'settingsView');
    this.clickOnBodyBindThis = this._clickOnBody.bind(this);
  }

  _addListeners(htmlElementTitle : string) {
    this.timerHTMLElement = document.querySelector(htmlElementTitle);
    this.timerHTMLElement.innerHTML = Template();
    this.infoModeDocElement = document.querySelector('.single_player__settings_info_mode');
    this.infoWidthDocElement = document.querySelector('.single_player__settings_info_width');
    Bus.on('settingsChangeMode', this._modeChange.bind(this), 'settingsView');
    Bus.on('settingsChangeSize',this._sizeChange.bind(this), 'settingsView');
    Bus.on('settingsSetParameters', this._setParameters.bind(this), 'settingsView');
    document.removeEventListener('click', this.clickOnBodyBindThis);
    document.addEventListener('click', this.clickOnBodyBindThis);
    let sizesDom = [].slice.call(document.querySelectorAll('.single_player__submenu_size'));
    let diffDom = [].slice.call(document.querySelectorAll('.single_player__submenu_diff'));

    diffDom[this.difficult].style.color = '#D5B45B'
    sizesDom[this.numOfSize].style.color = '#D5B45B'
  }

  /** */
  _setParameters({difficult = 1, width = 15, height = 15, mines = 20}) {
    const mode = this._getModeByDifficult(difficult);
    this.infoModeDocElement.innerHTML = `${mode}`;
    this.infoWidthDocElement.innerHTML = `${width}x${height}`;
  };

  _getModeByDifficult(difficult : number) {
    let mode : string;
    switch(difficult) {
      case 0 :
        mode = 'Baby';
        break;
      case 1 :
        mode = 'Normal';
        break;
      case 2 :
        mode = 'Hard';
        break;
      case 3 :
        mode = 'God';
        break;
    }
    return mode;
  }

  _clickOnBody(e: any) {
    if (e.target.classList.contains('single_player__submenu_item')) {
      this._changeHard(e);
    }
  }

  _changeHard(e: any) {
    let sizesDom = [].slice.call(document.querySelectorAll('.single_player__submenu_size'));
    let diffDom = [].slice.call(document.querySelectorAll('.single_player__submenu_diff'));
    if (e.target.classList.contains('single_player__submenu_baby')) {
      diffDom[this.difficult].style.color = 'white'
      this.difficult = 0;
      diffDom[this.difficult].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_normal')) {
      diffDom[this.difficult].style.color = 'white'
      this.difficult = 1;
      diffDom[this.difficult].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_hard')) {
      diffDom[this.difficult].style.color = 'white'
      this.difficult = 2;
      diffDom[this.difficult].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_god')) {
      diffDom[this.difficult].style.color = 'white'
      this.difficult = 3;
      diffDom[this.difficult].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_size_0')) {
      this.width = 14;
      sizesDom[this.numOfSize].style.color = 'white'
      this.numOfSize = 0;
      sizesDom[this.numOfSize].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_size_1')) {
      this.width = 20;
      sizesDom[this.numOfSize].style.color = 'white'
      this.numOfSize = 1;
      sizesDom[this.numOfSize].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_size_2')) {
      this.width = 25;
      sizesDom[this.numOfSize].style.color = 'white'
      this.numOfSize = 2;
      sizesDom[this.numOfSize].style.color = '#D5B45B'
    } else if (e.target.classList.contains('single_player__submenu_size_3')) {
      this.width = 30;
      sizesDom[this.numOfSize].style.color = 'white'
      this.numOfSize = 3;
      sizesDom[this.numOfSize].style.color = '#D5B45B'
    }
    
    
    this.height = this.width;
    this._modeChange(this._getModeByDifficult(this.difficult));
    this._sizeChange({width : this.width, height : this.height});
    Bus.emit('settingsChangeHard', {difficult : this.difficult, width : this.width, height : this.height});
  }
  /** */
  _sizeChange({width = 15, height = 15}) {
    this.infoWidthDocElement.innerHTML = `${width}x${height}`;
  }
  /** */
  _modeChange(mode : string) {
    this.infoModeDocElement.innerHTML = `${mode}`;
  }
}