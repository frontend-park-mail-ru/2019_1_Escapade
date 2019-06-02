import BaseComponent from '../../BaseComponent';
import Bus from '../../../utils/bus';

export default class UserGamesComponent extends BaseComponent {

  constructor(parent: HTMLElement, template: any) {
    super(parent, template)
    Bus.on('updateProfileGames', this.onGamesUpdate.bind(this), 'userGames');
  }

  render() {
    super.render()
  }

  onGamesUpdate(games: any) {
    const id = games.you.id
    interface gameInfo {
      iswin: boolean,
      points: number,
      date: string,
      width: number,
      height: number,
      mines: number,
      duration: string,
    }
    this.data = games.lobby.allRooms.get.map((game: any) => {

      let player = game.players.players.filter((player: any) => {
        return player.ID === id
      })[0]
      const date = new Date(game.date)
      const duration = new Date(game.settings.play * 1000).toISOString().substr(11, 8);
      let res: gameInfo = {
        iswin: !player.Died,
        points: player.Points,
        date: `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`,
        width: game.settings.width,
        height: game.settings.height,
        mines: game.field.mines,
        duration: duration
      }
      return res
    })
    let count = games.lobby.allRooms.capacity
    Bus.emit('profileGamesScroll', count)

    this.render()
  }

}
