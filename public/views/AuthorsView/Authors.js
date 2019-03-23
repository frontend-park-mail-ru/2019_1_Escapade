import authorsTemplate from './Authors.pug';
import BaseView from '../BaseView';

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
    super.render();
  }
}
