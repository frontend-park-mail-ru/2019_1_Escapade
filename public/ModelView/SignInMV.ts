import SignInView from '../views/SignInView/SignIn';
import SignInModel from '../models/SignInModel';

/**
 *
 */
class SignInMV {
  view: typeof SignInView;
  model: SignInModel;
  /**
   *
   */
  constructor() {
    this.view = SignInView;
    this.model = new SignInModel();
  }
}

export default new SignInMV;
