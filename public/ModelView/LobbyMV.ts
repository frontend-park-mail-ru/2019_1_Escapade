import LobbyView from '../views/LobbyView/LobbyVew';
import Lobby from '../views/LobbyView/Lobby';
import LobbyModel from '../models/LobbyModel';
import { WebSocketInterface } from '../utils/webSocket';

/**
 *
 */
class LobbyMV {
  view: typeof LobbyView;
  ws: WebSocketInterface;
  model: LobbyModel;
  lobby: Lobby;
  /**
   *
   */
  constructor() {
    this.view = LobbyView;
    this.lobby = new Lobby();
    this.model = new LobbyModel();
  }
}
export default new LobbyMV;