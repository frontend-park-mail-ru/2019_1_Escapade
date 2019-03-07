

/** */
export class Net {
  /**
   * Пост запрос, с JSON body
   * @param {string} url
   * @param {object} body
   * @return {Promise<Response>}
   */
  static post({url = '/', body = {}} = {}) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
    });
  }

  /**
   * Гет запрос, с JSON body
   * @param {string} url
   * @return {Promise<Response>}
   */
  static get({url = '/'} = {}) {
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
  }
}
