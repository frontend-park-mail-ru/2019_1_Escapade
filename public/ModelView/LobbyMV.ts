import LobbyView from '../views/LobbyView/LobbyVew';
import Lobby from '../views/LobbyView/Lobby';
import LobbyModel from '../models/LobbyModel';
import LobbyRoomSettings from '../views/LobbyView/LobbyRoomSettings/LobbyRoomSettings';
import { WebSocketInterface } from '../utils/webSocket';

/**
 *
 */
class LobbyMV {
  view: typeof LobbyView;
  ws: WebSocketInterface;
  model: LobbyModel;
  lobby: Lobby;
  lobbyRoomSettings: LobbyRoomSettings;
  /**
   *
   */
  constructor() {
    this.view = LobbyView;
    this.lobbyRoomSettings = new LobbyRoomSettings();
    this.lobby = new Lobby();
    this.model = new LobbyModel();
  }
}
export default new LobbyMV;