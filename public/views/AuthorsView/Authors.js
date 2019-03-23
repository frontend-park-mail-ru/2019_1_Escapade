import authorsTemplate from './Authors.pug';
import BaseView from '../BaseView';
import {User} from '../../utils/user.js';
import Bus from '../../utils/bus';

/** */
export class AuthorsView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, authorsTemplate);
    Bus.on('userUpdate', this.render.bind(this));
  }

  /** */
  render() {
    this.data = User;
    super.render();
  }
}
