import LeaderBoardView from '../views/LeaderBoardView/LeaderBoard';
import LeaderBoardModel from '../models/LeaderBoardModel';

/**
 *
 */
class LeaderBoardMV {
  view: typeof LeaderBoardView;
  model: LeaderBoardModel;
  /**
   *
   */
  constructor() {
    this.view = LeaderBoardView;
    this.model = new LeaderBoardModel();
  }
}

export default new LeaderBoardMV;
