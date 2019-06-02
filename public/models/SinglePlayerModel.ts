import Bus from '../utils/bus';
import { Net } from '../utils/net';
/**
 *
 */
export default class SinglePlayerModel {
  /**
   *
   */
  constructor() {
    Bus.on('sendResultsSingleGame', this._sendResults.bind(this), 'singlePlayerModel');
  }

  /**
   * Отправка запроса логина и заполнение объекта User
   * @param {object} data
   */
  _sendResults(data: any) {
    Net.post(data, '/api/game')
      .then((resp) => {
        if (resp.status != 200) {
          console.log('SendResults resp.status: ', resp.status);
        }
      })
      .catch((error) => {
        console.log('Faild SendResults : ', error);
      });
  }
}
