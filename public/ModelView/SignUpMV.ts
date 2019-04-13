import SignUpView from '../views/SignUpView/SignUp';
import SignUpModel from '../models/SignUpModel';

/**
 *
 */
class SignUpMV {
  view: typeof SignUpView;
  model: SignUpModel;
  /**
   *
   */
  constructor() {
    this.view = SignUpView;
    this.model = new SignUpModel();
  }
}

export default new SignUpMV;
