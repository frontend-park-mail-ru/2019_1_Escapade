import * as dataAddress from './../../netconfig.json';

const backHost = dataAddress.backHost;

/** */
export class Net {
  /**
   * Пост запрос, с JSON body
   * @param {string} url
   * @param {object} body
   * @return {Promise<Response>}
   */
  static post(body: object, url = '/', host = backHost) {
    return fetch(host + url, {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }

  /**
    * Put запрос, с JSON body
    * @param {string} url
    * @param {object} body
    * @return {Promise<Response>}
    */
  static put(body: object, url = '/', host = backHost) {
    return fetch(host + url, {
      method: 'PUT',
      body: JSON.stringify(body),
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }

  /**
   * Отправка аватара
   * @param {string} url
   * @param {object} body
   * @return {Promise<Response>}
   */
  static postPhoto(body: FormData, url = '/api/avatar', host = backHost) {
    return fetch(host + url, {
      method: 'POST',
      body: body,
      mode: 'cors',
      credentials: 'include',
    });
  }

  /**
   * Гет запрос
   * @param {string} url
   * @return {Promise<Response>}
   */
  static get(url = '/', host = backHost) {
    return fetch(host + url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
  }

  /**
   * DELETE запрос
   * @param {string} url
   * @return {Promise<Response>}
   */
  static delete(url = '/', host = backHost) {
    return fetch(host + url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
    });
  }
}
