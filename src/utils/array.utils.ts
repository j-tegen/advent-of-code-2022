export const transpose = (matrix: any[][]): any[][] => {
  const newMatrix: any[][] = []
  for (let i: number = 0; i < matrix.length; i++) {
    newMatrix.push([])
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      newMatrix[j].push(matrix[i][j])
    }
  }

  return newMatrix
}
