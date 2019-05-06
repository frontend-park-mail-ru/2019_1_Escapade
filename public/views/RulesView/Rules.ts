const rulesTemplate = require('./Rules.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';

/** */
export class RulesView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, rulesTemplate, true);
  }

  /** */
  render() {
    this.user = User;
    super.render();
  }
}
