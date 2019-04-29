import MultiPlayerView from '../views/MultiPlayerView/MultiPlayer';
import MultiPlayerModel from '../models/MultiPlayerModel';
import StatisticsGameView from '../views/GameView/Statistics/Statistics';
import SettingsGameView from '../views/GameView/Settings/Settings';
import FieldView from '../views/GameView/Field/Field';
import UserinfoGameView from '../views/GameView/Userinfo/Userinfo';
import MessageView from '../views/MessageView/Message';
import ButtonsGameView from '../views/GameView/Buttons/Buttons';
/**
 *
 */
class MultiPlayerMV {
  view: typeof MultiPlayerView;
  model: MultiPlayerModel;
  fieldPanel: FieldView;
  messageView: MessageView;
  buttonsGameView: ButtonsGameView;
  /**
   *
   */
  constructor() {
    this.view = MultiPlayerView;
    this.model = new MultiPlayerModel();
    this.fieldPanel = new FieldView();
    this.messageView = new MessageView();
    this.buttonsGameView = new ButtonsGameView();
    
  }
}
export default new MultiPlayerMV;