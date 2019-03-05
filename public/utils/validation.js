/**
   *
   * @param {*} email
   * @return {boolean}
   */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(String(email).toLowerCase());
};

/**
 *
 * @param {*} pass
 * @return {boolean}
 */
export function validatePass(pass) {
  const re = /^[A-Za-z]\w{3,14}$/i;
  return re.test(pass);
}
