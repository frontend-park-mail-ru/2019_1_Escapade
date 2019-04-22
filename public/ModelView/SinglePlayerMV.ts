import SinglePlayerView from '../views/SinglePlayerView/SinglePlayer';
import SinglePlayerModel from '../models/SinglePlayerModel';
import StatisticsGameView from '../views/GameView/Statistics/Statistics';
import SettingsGameView from '../views/GameView/Settings/Settings';
import FieldView from '../views/GameView/Field/Field';
import UserinfoGameView from '../views/GameView/Userinfo/Userinfo';
import MessageView from '../views/MessageView/Message';
import ButtonsGameView from '../views/GameView/Buttons/Buttons';

/**
 *
 */
class SinglePlayerMV {
  model: SinglePlayerModel;
  view: typeof SinglePlayerView;
  statisticsPanel: StatisticsGameView;
  settingsPanel: SettingsGameView;
  fieldPanel: FieldView;
  userGameView: UserinfoGameView;
  messageView: MessageView;
  buttonsGameView: ButtonsGameView;
  /**
   *
   */
  constructor() {
    this.view = SinglePlayerView;
    this.model = new SinglePlayerModel();
    this.statisticsPanel = new StatisticsGameView();
    this.settingsPanel = new SettingsGameView();
    this.fieldPanel = new FieldView();
    this.userGameView = new UserinfoGameView();
    this.messageView = new MessageView();
    this.buttonsGameView = new ButtonsGameView();
  }
}

export default new SinglePlayerMV;