import MultiplayerView from '../views/MultiPlayerView/MultiPlayer';
import MultiplayerModel from '../models/Multiplayer';

/**
 *
 */
class MultiplayeMV {
  view: typeof MultiplayerView;
  model: MultiplayerModel;
  /**
   *
   */
  constructor() {
    this.view = MultiplayerView;
    this.model = new MultiplayerModel();
  }
}

export default new MultiplayeMV;
