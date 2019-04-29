import LobbyView from '../views/LobbyView/Lobby';
import LobbyModel from '../models/LobbyModel';
import { WebSocketInterface } from '../utils/webSocket';

/**
 *
 */
class LobbyMV {
  view: typeof LobbyView;
  ws: WebSocketInterface;
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