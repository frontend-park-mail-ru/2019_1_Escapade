import BaseComponent from '../../BaseComponent';
import Bus from '../../../utils/bus';

export default class LeaderboardFilterComponent extends BaseComponent {

  ranks: NodeList
  pressedRank: HTMLElement
  pressedColor: string
  ordinaryColor: string
  constructor(parent: HTMLElement, template: any) {
    super(parent, template)
    this.pressedColor = '#8D99A5'
    this.ordinaryColor = '#fff'
  }

  render() {
    super.render()
    this.pressedRank = this.parent.querySelector('.normal')
    this.pressedRank.style.backgroundColor = this.pressedColor
    this.ranks = this.parent.querySelectorAll('.leaderboard__filter_rank')
    this._initButtons()
  }

  _initButtons() {
    this.ranks.forEach((rank: HTMLElement) => {
      rank.onclick = (event: MouseEvent) => {
        this.pressedRank.style.backgroundColor = this.ordinaryColor
        rank.style.backgroundColor = this.pressedColor
        this.pressedRank = rank
        Bus.emit('leaderboardRankFilter', rank.classList.item(1))
      }
    })
  }
}