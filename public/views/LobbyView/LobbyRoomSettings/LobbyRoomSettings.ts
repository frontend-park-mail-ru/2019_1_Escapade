import Bus from "../../../utils/bus";

const Template = require('./LobbyRoomSettings.pug');

/** */
export default class LobbyRoomSettings{
  HTMLElement: any;
  okButton: any;
  rangePlayers: any;
  rangeField: any;
  rangeDiff: any;
  rangeTitle: any;
  minesCounter: any;
  minesCount: number;
  difficult: number;
  size: any;
  players: number;
  roomTitleDefault: string;
  closeButton: any;
  rangeTime: any;
  time: number;
  /**
   *
   * @param {*} parent
   */
  constructor() {
    Bus.on('addRoomSettings', this._addListeners.bind(this), 'lobbyRoomSettings');
  }

  _addListeners(data : any){
    this.HTMLElement = document.querySelector(data);
    this.HTMLElement.innerHTML = Template();
    this.okButton = document.querySelector('.lobby_room_settings_ok_button');
    this.rangePlayers = document.querySelector('.lobby_room_range_people');
    this.rangeField = document.querySelector('.lobby_room_range_field');
    this.rangeDiff = document.querySelector('.lobby_room_range_diff');
    this.rangeTime = document.querySelector('.lobby_room_range_time');
    this.rangeTitle = document.querySelector('.lobby_room_range_titleRoom');
    this.minesCounter = document.querySelector('.lobby_room_mines');
    this.okButton = document.querySelector('.lobby_room_settings_ok_button');
    this.closeButton = document.querySelector('.lobby_room_close_settings');
    this.difficult = 0;
    this.size = 0;
    this._clickOnRangeDiff();
    this._clickOnRangeField();
    this._clickOnRangePlayers();
    this._clickOnRangeTime();
    this.minesCounter.innerHTML = `Mines = ${this.minesCount}`;
    this.okButton.addEventListener('click', this._clickOnOkButton.bind(this));
    this.rangeDiff.addEventListener('click', this._clickOnRangeDiff.bind(this));
    this.rangeTime.addEventListener('click', this._clickOnRangeTime.bind(this));
    this.rangeField.addEventListener('click', this._clickOnRangeField.bind(this));
    this.rangePlayers.addEventListener('click', this._clickOnRangePlayers.bind(this));
    this.closeButton.addEventListener('click', this._clickOnCloseButton.bind(this));
    Bus.on('hideRoomSettingsPanel', this._hideSettingsPanel.bind(this), 'lobbyRoomSettings');
    Bus.on('showRoomSettingsPanel', this._showSettingsPanel.bind(this), 'lobbyRoomSettings');
  }
  _hideSettingsPanel() {
    this.HTMLElement.hidden = true;
  }

  _showSettingsPanel(numberOfRoom : number) {
    this.roomTitleDefault = `room${numberOfRoom + 1}`;
    this.rangeTitle.value = this.roomTitleDefault;
    this.HTMLElement.hidden = false;
  }

  _clickOnRangeDiff() {
    console.log('this.rangeDiff.value', this.rangeDiff.value)
    switch (parseInt(this.rangeDiff.value)) {
      case 1:
        this.difficult = 0.1
        break;
      case 2:
        this.difficult = 0.2;
        break;
      case 3:
        this.difficult = 0.3;
        break;
      case 4:
        this.difficult = 0.4;
        break;
    }
    this.minesCount = Math.round(this.difficult * this.size * this.size);
    console.log(this.size, ' ', this.difficult)
    this.minesCounter.innerHTML = `Mines = ${this.minesCount}`;
  }

  _clickOnRangeTime() {
    switch (parseInt(this.rangeTime.value)) {
      case 1:
        this.time = 60
        break;
      case 2:
        this.time = 90;
        break;
      case 3:
        this.time = 180;
        break;
      case 4:
        this.time = 300;
        break;
    }
  }

  _clickOnRangeField() {
    console.log('this.rangeField.value', this.rangeField.value)
    switch (parseInt(this.rangeField.value)) {
      case 1:
        this.size = 14;
        break;
      case 2:
        this.size = 20;
        break;
      case 3:
        this.size = 25;
        break;
      case 4:
        this.size = 30;
        break;
    }

    this.minesCount = Math.round(this.difficult * this.size * this.size);
    console.log(this.size, ' ', this.difficult)
    this.minesCounter.innerHTML = `Mines = ${this.minesCount}`;
  }

  _clickOnRangePlayers() {
    switch (parseInt(this.rangePlayers.value)) {
      case 1:
        this.players = 2;
        break;
      case 2:
        this.players = 3;
        break;
      case 3:
        this.players = 4;
        break;
      case 4:
        this.players = 6;
        break;
    }
  }

  _clickOnOkButton() {
    let title = this.rangeTitle.value
    if (title === '') {
      title = this.roomTitleDefault;
    }
    const maxLenName = 35;
    if (title.length > maxLenName) {
      title = title.substr(0, maxLenName) + '...';
    }
    Bus.emit('createRoom', {title : title, players : this.players, width : this.size, height : this.size, time : this.time, mines : this.minesCount})
    this._hideSettingsPanel();
  }

  _clickOnCloseButton() {
    this._hideSettingsPanel();
  }

  /** */
  render() {
  }
}
