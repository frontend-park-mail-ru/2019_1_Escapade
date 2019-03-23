
/**
 *
 */
class Bus {
  /**
   *
   */
  constructor() {
    this.listeners = {};
  }

  /**
   *
   * @param {*} event
   * @param {*} callback
   */
  on(event, callback) { // подписываемся на событие
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
  }

  /**
   *
   * @param {*} event
   * @param {*} callback
   */
  off(event, callback) { // отписываемся от события
    this.listeners[event] = this.listeners[event]
        .filter(function(listener) {
          return listener !== callback;
        });
  }
  /**
   *
   * @param {*} event
   * @param {*} data
   */
  emit(event, data) { // публикуем (диспатчим, эмитим) событие
    this.listeners[event].forEach(function(listener) {
      listener(data);
    });
  }
}

export default new Bus;
