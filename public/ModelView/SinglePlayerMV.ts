import SinglePlayerView from '../views/SinglePlayerView/SinglePlayer';
import SinglePlayerModel from '../models/SinglePlayerModel';

/**
 *
 */
class SinglePlayerMV {
  model: SinglePlayerModel;
  view: typeof SinglePlayerView;
  /**
   *
   */
  constructor() {
    this.view = SinglePlayerView;
    this.model = new SinglePlayerModel();
  }
}

export default new SinglePlayerMV;