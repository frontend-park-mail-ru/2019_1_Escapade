import MultiPlayerView from '../views/MultiPlayerView/MultiPlayer';
import MultiPlayerModel from '../models/MultiPlayerModel';
import FieldView from '../views/GameView/Field/Field';
import MessageView from '../views/MessageView/Message';
import PlayersListView from '../views/GameView/PlayersList/PlayersList';
import GameActionsView from '../views/GameView/GameActions/GameActions';
import ChatView from '../views/GameView/Chat/Chat';
import MessageAskView from '../views/MessageAskView/MessageAsk';
import ChatModel from '../models/ChatModel';
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
  gameChat: ChatView;
  chatModel: ChatModel;
  messageViewAsk: MessageAskView;
  /**
   *
   */
  constructor() {
    this.view = MultiPlayerView;
    this.model = new MultiPlayerModel();
    this.chatModel = new ChatModel();
    this.playersListView = new PlayersListView();
    this.gameActions = new GameActionsView();
    this.gameChat = new ChatView();
    this.messageViewAsk = new MessageAskView();
  }
}
export default new MultiPlayerMV;