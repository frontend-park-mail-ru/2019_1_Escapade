import MultiplayerView from '../views/MultiPlayerView/MultiPlayer';
import MultiplayerModel from '../models/Multiplayer';

/**
 *
 */
class MultiplayeMV {
  /**
   *
   */
  constructor() {
    this.view = MultiplayerView;
    this.model = new MultiplayerModel();
  }
}

export default new MultiplayeMV;
