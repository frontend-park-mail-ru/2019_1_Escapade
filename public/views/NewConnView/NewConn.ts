const newconnTemplate = require('./MultiPlayerNewConn.pug');
import BaseView from '../BaseView';
import { User } from '../../utils/user';

/** */
export class NewConnView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, newconnTemplate, true);
  }

  /** */
  render() {
    this.user = User;
    super.render();
  }
}