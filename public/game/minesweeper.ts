/** */
export class MineSweeper {
  bombsCount: number;
  cellNumbersX: number;
  cellNumbersY: number;
  map: any[];
  mapLabel: any[];
  cellNumbers: any;
  mapLabel3BV: any[];
  /**
   *
   */
  constructor(NumbersX = 20, NumbersY = 20, bombsCount = 10) {
    this.cellNumbersX = NumbersX;
    this.cellNumbersY = NumbersY;
    this.bombsCount = bombsCount;
    this.map = this.
        _createMap(this.cellNumbersX, this.cellNumbersY, this.bombsCount);
    this.mapLabel = new Array(this.cellNumbersY);
    for (let i = 0; i < this.cellNumbersY; i++) {
      this.mapLabel[i] = new Array(this.cellNumbersX).fill(0);
    }
  }

  /** */
  openCels(x: number, y: number, xLen: number, yLen: number) {
    if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || x >= xLen || y < 0 || y >= yLen) {
      return {cellArr: [], points: 0, openCells: 0};
    }
    if (this.mapLabel[x][y] != 0) {
      return {cellArr: [], points: 0, openCells: 0};
    }
    this.mapLabel[x][y] = 1;
    const pointsAndNumOpenCells = {cellArr: [] as number[][], points: 0, openCells: 0};
    if (this.map[x][y] === 0 ) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          let res = this.openCels(x + j, y + i, xLen, yLen);
          pointsAndNumOpenCells.points += res.points;
          pointsAndNumOpenCells.openCells += res.openCells;
          pointsAndNumOpenCells.cellArr =
            pointsAndNumOpenCells.cellArr.concat(res.cellArr);
        }
      }
    } else {
      if (this.map[x][y] < 9) {
        pointsAndNumOpenCells.points += this.map[x][y];
      }
    }
    pointsAndNumOpenCells.cellArr = pointsAndNumOpenCells.cellArr.concat([[x, y]]);
    pointsAndNumOpenCells.openCells += 1;
    return pointsAndNumOpenCells;
  }

  /** */
  putRemoveFlag(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.cellNumbersX || y >= this.cellNumbers) {
      return -1;
    }

    if (this.mapLabel[x][y] === 2) {
      this.mapLabel[x][y] = 0;
    } else if (this.mapLabel[x][y] === 0) {
      this.mapLabel[x][y] = 2;
    }
    return this.mapLabel[x][y]; // 0 - закрыта; 1 - открыта; 2 - флаг
  }
  /** */
  count3BV() {
    let BBBVCount = 0;
    this.mapLabel3BV = new Array(this.cellNumbersY);
    for (let i = 0; i < this.cellNumbersY; i++) {
      this.mapLabel3BV[i] = new Array(this.cellNumbersX).fill(0);
    }
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        if (this.map[x][y] != 0) {
          if (this.map[x][y] == 9) {
            this.mapLabel3BV[x][y] = 1;
          }
          continue;
        }
        if (this.mapLabel3BV[x][y] != 0) {
          continue;
        }
        this._markNeighbor(x, y, this.cellNumbersX, this.cellNumbersY);
        BBBVCount += 1;
      }
    }
    for (let y = 0; y < this.cellNumbersY; y++) {
      for (let x = 0; x < this.cellNumbersX; x++) {
        if (this.mapLabel3BV[x][y] == 0) {
          BBBVCount += 1;
        }
      }
    }

    return BBBVCount;
  }

  /** */
  _markNeighbor(x: number, y: number, xLen: number, yLen: number) {
    // console.log(x, ' ', y, ' ', xLen, ' ', yLen, ' ', mapLabel3BV);
    if (x < 0 || x >= xLen || y < 0 || y >= yLen ||
        this.mapLabel3BV[x][y] != 0) {
      return;
    }
    this.mapLabel3BV[x][y] = 1;
    if ( this.map[x][y] === 0 ) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          this._markNeighbor(x + j, y + i, xLen, yLen);
        }
      }
    }
    return;
  }

  /** */
  _createMap(xLen: number, yLen: number, bombNumber: number) {
    const map = new Array(yLen);

    for (let i = 0; i < yLen; i++) {
      map[i] = new Array(xLen).fill(0);
    }

    for (let i = 0; i < bombNumber; i++) {
      let xBomb = 0;
      let yBomb = 0;
      do {
        xBomb = this.randomInteger(0, xLen - 1);
        yBomb = this.randomInteger(0, yLen - 1);
      } while (map[xBomb][yBomb] === 9);
      map[xBomb][yBomb] = 9;
      this._fillCellsAroundBomb(map, xBomb, yBomb, xLen, yLen);
    }
    return map;
  }

  /** */
  _fillCellsAroundBomb(map: number[][], xBomb: number, yBomb: number, xLen: number, yLen: number) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        if (xBomb + j >= 0 && xBomb + j < xLen && yBomb + i >= 0 && yBomb + i < yLen && map[xBomb + j][yBomb + i] < 9) {
          map[xBomb + j][yBomb + i] += 1;
        }
      }
    }
    return;
  }

  /** */
  randomInteger(min: number, max: number) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
}
