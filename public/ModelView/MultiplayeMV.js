import MultiplayerView from '../views/MultiPlayerView/MultiPlayer.js';
import MultiplayerModel from '../models/Multiplayer.js';

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
