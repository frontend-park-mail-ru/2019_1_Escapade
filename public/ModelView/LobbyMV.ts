import LobbyView from '../views/LobbyView/Lobby';
import LobbyModel from '../models/LobbyModel';
/**
 *
 */
class LobbyMV {
  view: typeof LobbyView;
  model: LobbyModel;
  /**
   *
   */
  constructor() {
    this.view = LobbyView;
    this.model = new LobbyModel();
  }
}
export default new LobbyMV;