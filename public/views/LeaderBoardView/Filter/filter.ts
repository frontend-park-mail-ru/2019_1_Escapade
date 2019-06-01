import BaseComponent from '../../BaseComponent';
import Bus from '../../../utils/bus';

export default class LeaderboardFilterComponent extends BaseComponent {

  ranks: NodeList
  pressedRank: HTMLElement
  pressedColor: string
  ordinaryColor: string
  ranksMap: any
  constructor(parent: HTMLElement, template: any) {
    super(parent, template)
    this.pressedColor = '#8D99A5'
    this.ordinaryColor = '#fff'
    this.ranksMap = {
      'baby': 0,
      'passerby': 1,
      'normal': 2,
      'master': 3
    }
  }

  render() {
    super.render()
    this.pressedRank = this.parent.querySelector('.passerby')
    this.pressedRank.style.backgroundColor = this.pressedColor
    this.ranks = this.parent.querySelectorAll('.leaderboard__filter_rank')
    this._initButtons()
  }

  _initButtons() {
    this.ranks.forEach((rank: HTMLElement, num: number) => {
      rank.onclick = (event: MouseEvent) => {
        this.pressedRank.style.backgroundColor = this.ordinaryColor
        rank.style.backgroundColor = this.pressedColor
        this.pressedRank = rank
        console.log(this.ranksMap[rank.classList.item(1)])
        Bus.emit('leaderboardRankFilter', num)
      }
    })
  }
}