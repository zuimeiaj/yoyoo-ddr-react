import Vector from './Vector'

class Matrix {
  _values: number[][]
  constructor(values: number[][]) {
    this._values = values
  }

  static zeros(shape: [number, number]) {
    return new Matrix(new Array(shape[0]).fill(null).map(() => new Array(shape[1]).fill(0)))
  }

  valueOf() {
    return JSON.parse(JSON.stringify(this._values))
  }

  toString() {
    return 'Matrix ( ' + this._values.map((item) => item.join(' ')).join(', ') + ' )'
  }

  rows() {
    return this._values.length
  }

  cols() {
    return this._values[0].length
  }

  rowVector(row: number) {
    return new Vector(this._values[row].slice(0))
  }

  colVector(col: number) {
    const v = new Array(this.rows()).fill(0)
    this._values.forEach((item, index) => {
      v[index] = item[col]
    })
    return new Vector(v)
  }

  dot(v: Vector | Matrix) {
    if (v instanceof Vector && this.cols() === v.length) {
      return new Vector(
        new Array(v.length).fill(null).map((_, index) => {
          return this.rowVector(index).dot(v)
        })
      )
    }
    if (v instanceof Matrix && this.cols() === v.rows()) {
      const cols = v.cols(),
        rows = v.rows()
      const newMatrix = Matrix.zeros([rows, cols])
      let v1
      for (let i = 0; i < cols; i++) {
        v1 = this.dot(v.colVector(i)) as Vector
        for (let j = 0; j < rows; j++) {
          newMatrix._values[j][i] = v1.get(j)
        }
      }
      return newMatrix
    }
    throw Error('expected a Vector or Matrix but got ' + typeof v)
  }

  get(row: number, col: number) {
    return this._values[row][col]
  }

  T() {
    return new Matrix(
      new Array(this.cols()).fill(null).map((_, colIndex) => {
        return new Array(this.rows()).fill(0).map((_, rowIndex) => {
          return this.get(rowIndex, colIndex)
        })
      })
    )
  }
}

export default Matrix
