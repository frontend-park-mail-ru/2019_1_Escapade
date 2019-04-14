import authorsTemplate from './Rules.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user';

/** */
export class RulesView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, authorsTemplate, true);
  }

  /** */
  render() {
    this.user = User;
    super.render();
  }
}
