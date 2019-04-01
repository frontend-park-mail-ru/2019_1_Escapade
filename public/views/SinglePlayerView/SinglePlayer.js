import singlePlayerTemplate from './SinglePlayer.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';


/** */
export class SinglePlayerView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, singlePlayerTemplate);
  }

  /**
   * Отрисовка главного меню
  */
  render() {
    this.data = User;
    super.render();
    _showMap(XLen, YLen);
  }
  /** */
  _showMap(XLen, YLen) {
    
    messageElem.appendChild(document.createTextNode(message));
    map = document.getElementsByClassName('map');
    for (let y = 0; y < YLen; y++) {
      for (let x = 0; x < XLen; x++) {
        const cell = document.createElement('div');
        cell.setAttribute('id', 'Div1');
        map.appendChild()
      }
    }
    //.appendChild(messageElem);
  }
}
