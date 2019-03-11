import {BLACKLIST_TAGS, WHITELIST_ATTRS,
  R_TAG, R_ATTRIBUTES, R_EMAIL, R_PASSWORD} from '../utils/constans.js';
/**
   * Валидация email
   * @param {*} email
   * @return {boolean}
   */
export function validateEmail(email) {
  let message = '';
  if (R_EMAIL.test(String(email).toLowerCase()) !== true) {
    message = 'Invalid email format';
    if (email.length === 0) {
      message = 'Fill email field please';
    }
  }
  return message;
};

/**
 * Валидация пароля
 * @param {*} pass
 * @return {boolean}
 */
export function validatePass(pass) {
  return R_PASSWORD.test(pass);
}

/**
 * Проверка на наличие опасных тегов и атрибутов
 * @param {*} unsafeString
 * @return {boolean}
 */
export function makeSafe(unsafeString = '') {
  return unsafeString
      .replace(R_TAG, (match, g1) => {
        return BLACKLIST_TAGS.includes(g1) ? '' : match;
      })
      .replace(R_ATTRIBUTES, (match, g1) => {
        return WHITELIST_ATTRS.includes(g1) ? match : '';
      })
  ;
}
