import MultiPlayerView from '../views/MultiPlayerView/MultiPlayer';
import MultiPlayerModel from '../models/MultiPlayerModel';
import FieldView from '../views/GameView/Field/Field';
import MessageView from '../views/MessageView/Message';
import PlayersListView from '../views/GameView/PlayersList/PlayersList';
import GameActionsView from '../views/GameView/GameActions/GameActions';
/**
 *
 */
class MultiPlayerMV {
  view: typeof MultiPlayerView;
  model: MultiPlayerModel;
  fieldPanel: FieldView;
  messageView: MessageView;
  playersListView: PlayersListView;
  gameActions: GameActionsView;
  /**
   *
   */
  constructor() {
    this.view = MultiPlayerView;
    this.model = new MultiPlayerModel();
    this.playersListView = new PlayersListView();
    this.gameActions = new GameActionsView();
    
  }
}
export default new MultiPlayerMV;