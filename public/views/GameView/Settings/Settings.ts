import Bus from '../../../utils/bus';
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
  constructor() {
    this.difficult = 1;
    this.minesCount = 20;
    this.width = 15;
    this.height = 15;
    Bus.on('addListenersSettingsGame', this._addListeners.bind(this));
  }

  _addListeners() {
    this.infoModeDocElement = document.querySelector('.single_player__settings_info_mode');
    this.infoWidthDocElement = document.querySelector('.single_player__settings_info_width');
    this.infoHeightDocElement = document.querySelector('.single_player__settings_info_height');
    this.infoMinesDocElement = document.querySelector('.single_player__settings_info_mines');
    Bus.on('settingsChangeMode', this._modeChange.bind(this));
    Bus.on('settingsChangeMinesCount', this._minesCountChange.bind(this));
    Bus.on('settingsChangeSize',this._sizeChange.bind(this));
    Bus.on('settingsSetParameters', this._setParameters.bind(this));
    document.addEventListener('click', this._clickOnBody.bind(this));
  }

  /** */
  _setParameters({difficult = 1, width = 15, height = 15, mines = 20}) {
    const mode = this._getModeByDifficult(difficult);
    this.infoModeDocElement.innerHTML = `${mode} mode`;
    this.infoMinesDocElement.innerHTML = `${mines} mines`;
    this.infoWidthDocElement.innerHTML = `${width} width`;
    this.infoHeightDocElement.innerHTML = `${height} height`;
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
    if (e.target.classList.contains('single_player__submenu_baby')) {
      this.difficult = 0;
    } else if (e.target.classList.contains('single_player__submenu_normal')) {
      this.difficult = 1;
    } else if (e.target.classList.contains('single_player__submenu_hard')) {
      this.difficult = 2;
    } else if (e.target.classList.contains('single_player__submenu_god')) {
      this.difficult = 3;
    }
    console.log("_changeHard");
    this._modeChange(this._getModeByDifficult(this.difficult));
    Bus.emit('settingsChangeHard', {difficult : this.difficult});
  }
  /** */
  _sizeChange({width = 15, height = 15}) {
    this.infoWidthDocElement.innerHTML = `${width} width`;
    this.infoHeightDocElement.innerHTML = `${height} height`;
  }
  /** */
  _modeChange(mode : string) {
    console.log("_modeChange");
    this.infoModeDocElement.innerHTML = `${mode} mode`;
  }
  /** */
  _minesCountChange(number : number) {
    this.infoMinesDocElement.innerHTML = `${number} mines`;
  }
}