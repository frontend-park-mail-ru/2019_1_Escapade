const signInTemplate = require('./Chat.pug');
import { User } from '../../utils/user';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';


/** */
export default class ChatView extends BaseView {
  _warnings: any;
  parent: any;
  _form: any;
  _submitButton: any;
  /**
   *
   * @param {*} parent
   */
  constructor(parent: any) {
    super(parent, signInTemplate, false);
  }

  /**
   * Отрисовка формы логина и добавление лисенеров
  */
  render() {
    this.user = User;
    super.render();
 
  }

  
}
