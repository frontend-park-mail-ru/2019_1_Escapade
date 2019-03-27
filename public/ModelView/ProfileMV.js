import ProfileView from '../views/ProfileView/Profile';
import ProfileModel from '../models/ProfileModel';

/**
 *
 */
class ProfileMV {
  /**
   *
   */
  constructor() {
    this.view = ProfileView;
    this.model = new ProfileModel();
  }
}

export default new ProfileMV;
