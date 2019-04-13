import SignInView from '../views/SignInView/SignIn';
import SignInModel from '../models/SignInModel';

/**
 *
 */
class SignInMV {
  /**
   *
   */
  constructor() {
    this.view = SignInView;
    this.model = new SignInModel();
  }
}

export default new SignInMV;
