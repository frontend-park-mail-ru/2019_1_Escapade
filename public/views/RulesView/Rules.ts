const rulesTemplate = require('./Rules.pug');
const rusingl = require('./Rules/rules-ru-sing.pug')
const rumult = require('./Rules/rules-ru-mult.pug')
const ensingl = require('./Rules/rules-en-sing.pug')
const enmult = require('./Rules/rules-en-mult.pug')
import BaseView from '../BaseView';
import { User } from '../../utils/user';

/** */
export class RulesView extends BaseView {

  language: string
  mode: string
  rulesMap: any
  rules: any
  modeButton: HTMLElement
  lngButton: HTMLElement
  contentBlock: HTMLElement
  /**
   *
   * @param {*} parent
   */
  constructor(parent: HTMLElement) {
    super(parent, rulesTemplate, true);
    this.language = 'en'
    this.mode = 'singl'
    this.rulesMap = {
      'ru': {
        'singl': rusingl,
        'mult': rumult
      },
      'en': {
        'singl': ensingl,
        'mult': enmult
      },
    }
    this.rules = this.rulesMap[this.language][this.mode]

  }

  /** */
  render() {
    if (!this.rendered) {
      super.render();
      this.modeButton = this.parent.querySelector('.rules__mode')
      this.contentBlock = this.parent.querySelector('.rules__content')

      this.modeButton.onclick = this._onModeChange.bind(this)
    }
    this.contentBlock.innerHTML = this.rules()
  }


  _onModeChange(e: any) {
    if (this.mode == 'singl') {
      this.mode = 'mult'
      e.target.innerHTML = 'Multiplayer'
    } else {
      this.mode = 'singl'
      e.target.innerHTML = 'Singleplayer'
    }
    this.rules = this.rulesMap[this.language][this.mode]
    this.render()
  }
}
