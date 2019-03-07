const backHost = '';

/** */
export class Net {
  /**
   * Пост запрос, с JSON body
   * @param {string} url
   * @param {object} body
   * @return {Promise<Response>}
   */
  static post({host = backHost, url = '/', body = {}} = {}) {
    return fetch(host + url, {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'cors',
      credentials: 'include',
    });
  }

  /**
   * Гет запрос, с JSON body
   * @param {string} url
   * @return {Promise<Response>}
   */
  static get({host = backHost, url = '/'} = {}) {
    return fetch(host + url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
  }
}
