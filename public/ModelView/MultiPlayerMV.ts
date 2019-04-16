import MultiPlayerView from '../views/MultiPlayerView/MultiPlayer';
import MultiPlayerModel from '../models/MultiPlayerModel';
/**
 *
 */
class MultiPlayerMV {
  view: typeof MultiPlayerView;
  model: MultiPlayerModel;
  /**
   *
   */
  constructor() {
    this.view = MultiPlayerView;
    this.model = new MultiPlayerModel();
  }
}
export default new MultiPlayerMV;