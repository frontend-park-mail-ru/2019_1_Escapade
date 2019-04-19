const authorsTemplate = require('./Authors.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';

/** */
export class AuthorsView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, authorsTemplate, true);
  }

  /** */
  render() {
    this.user = User;
    super.render();
  }
}
