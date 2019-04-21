/**
 *
 */
export class Bus {
  listeners: any;
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
  on(event: string, callback: CallableFunction) { // подписываемся на событие
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
  }

  /**
   *
   * @param {*} event
   * @param {*} callback
   */
  off(event: string | number, callback: CallableFunction) { // отписываемся от события
    this.listeners[event] = this.listeners[event]
      .filter(function (listener: any) {
        return listener !== callback;
      });
  }
  /**
   *
   * @param {*} event
   * @param {*} data
   */
  emit(event: string, data: any = '') { // публикуем (диспатчим, эмитим) событие
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(function (listener: (arg0: object | string) => void) {
      listener(data);
    });
  }
}

export default new Bus;
