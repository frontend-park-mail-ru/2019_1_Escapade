import Bus from '../utils/bus';
import { Net } from '../utils/net';

export default class LeaderBoardModel {

  constructor() {
    Bus.on('reqPagesAmount', this._getPagesAmount.bind(this), 'leaderboardModel');
    Bus.on('reqPage', this._getPage.bind(this), 'leaderboardModel');
  }


  _getPagesAmount(page: any) {
    Net.get(`/api/users/pages_amount?per_page=${page.per_page}`)
      .then((resp) => {
        return resp.json();
      })
      .then((count) => {
        const amount = count.amount;
        Bus.emit('respPagesAmount', amount);
      })
      .catch((error) => {
        console.log('getPagesAmount error: ', error);
      });
  }


  _getPage(pageStruct: any) {
    Net.get(`/api/users/pages?page=${pageStruct.page}&per_page=${pageStruct.per_page}&difficult=${pageStruct.difficulty}`)
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
