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
  _getPagesAmount(perPage) {
    Net.get({url: `/users/pages_amount?per_page=${perPage}`})
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
  _getPage(pageStruct) {
    Net.get({url: `/users/pages?page=${pageStruct.page}&per_page=${pageStruct.per_page}`})
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
