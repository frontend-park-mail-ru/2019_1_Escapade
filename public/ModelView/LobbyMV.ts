import LobbyView from '../views/LobbyView/Lobby';
import { WebSocketInterface } from '../utils/webSocket';
/**
 *
 */
class LobbyMV {
  view: typeof LobbyView;
  ws: WebSocketInterface;
  /**
   *
   */
  constructor() {
    this.view = LobbyView;
    
  }
}
export default new LobbyMV;