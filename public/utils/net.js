const backHost = 'http://localhost:3000';


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
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }

  /**
   * Пост запрос, с JSON body
   * @param {string} url
   * @param {object} body
   * @return {Promise<Response>}
   */
  static postPhoto({host = backHost, url = '/', body = {}} = {}) {
    return fetch(host + url, {
      method: 'POST',
      body: body,
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

  /**
   * Гет запрос, с JSON body
   * @param {string} url
   * @return {Promise<Response>}
   */
  static delete({host = backHost, url = '/'} = {}) {
    return fetch(host + url, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
    });
  }
}
