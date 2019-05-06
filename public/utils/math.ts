/**
 *
 */
export class MathGame {
  listeners: any;
  /**
   *
   */
  constructor() {
    
  }

  /**
   *
   * @param {*} min
   * @param {*} max
   */
  randomInteger(min: number, max: number) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
}

export default new MathGame;
