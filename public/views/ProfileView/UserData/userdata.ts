import BaseComponent from '../../BaseComponent';
import Bus from '../../../utils/bus';
import { User } from '../../../utils/user';

export default class UserDataComponent extends BaseComponent {

  loginField: HTMLElement
  emailField: HTMLElement
  bestScoreField: HTMLElement
  bestTimeField: HTMLElement
  constructor(parent: HTMLElement, template: any) {
    super(parent, template)
    this.user = User
    Bus.on('userUpdate', this.onUserUpdate.bind(this), 'userData');
  }

  render() {
    if (!this._user.bestScore) {
      User.bestScore = '0'
      User.bestTime = '0:00:00:00'
    }
    super.render()
  }

  onUserUpdate() {
    this.render()
  }

}
