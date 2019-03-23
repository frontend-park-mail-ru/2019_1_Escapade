import authorsTemplate from './Authors.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';

/** */
export class AuthorsView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, authorsTemplate);
  }

  /** */
  render() {
    this.data = User;
    super.render();
  }
}
