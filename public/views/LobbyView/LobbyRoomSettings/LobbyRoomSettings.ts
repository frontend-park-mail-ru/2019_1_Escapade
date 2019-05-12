import Bus from "../../../utils/bus";

const Template = require('./LobbyRoomSettings.pug');

/** */
export default class LobbyRoomSettings{
  HTMLElement: any;
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
  }

  /** */
  render() {
  }
}
