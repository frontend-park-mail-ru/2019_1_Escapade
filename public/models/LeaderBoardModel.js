import Bus from '../utils/bus';
import {Net} from '../utils/net';
/**
 *
 */
export default class LeaderBoardModel {
  /**
   *
   */
  constructor() {
    Bus.on('reqPagesAmount', this._getPagesAmount.bind(this));
    Bus.on('reqPage', this._getPage.bind(this));
  }

  /**
   *
   */
  _getPagesAmount() {
    Net.get({url: '/users/pages_amount'})
        .then((resp) => {
          return resp.json();
        })
        .then((count) => {
          const amount = count.amount;
          console.log('Pages amount', amount);
          Bus.emit('respPagesAmount', amount);
        })
        .catch((error) => {
          console.log('getPagesAmount error: ', error);
        });
  }
  /**
   *
   * @param {int} page
   */
  _getPage(page) {
    Net.get({url: `/users/pages/${page}`})
        .then((resp) => {
          return resp.json();
        })
        .then((users) => {
          Bus.emit('respPage', users);
        })
        .catch((error) => {
          console.log('getPage error: ', error);
        });
  }
}
