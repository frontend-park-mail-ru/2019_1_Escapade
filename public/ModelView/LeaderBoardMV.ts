import LeaderBoardView from '../views/LeaderBoardView/LeaderBoard';
import LeaderBoardModel from '../models/LeaderBoardModel';

/**
 *
 */
class LeaderBoardMV {
  /**
   *
   */
  constructor() {
    this.view = LeaderBoardView;
    this.model = new LeaderBoardModel();
  }
}

export default new LeaderBoardMV;
