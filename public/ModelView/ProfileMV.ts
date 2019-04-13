import ProfileView from '../views/ProfileView/Profile';
import ProfileModel from '../models/ProfileModel';
import ProfileEditView from '../views/ProfileEditView/ProfileEdit';

/**
 *
 */
class ProfileMV {
  /**
   *
   */
  constructor() {
    this.views = {ProfileView, ProfileEditView};
    this.model = new ProfileModel();
  }
}

export default new ProfileMV;
