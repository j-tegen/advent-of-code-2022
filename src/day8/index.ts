import { transpose } from '../utils/array.utils'
import { readFile } from '../utils/files.utils'

const checkVisibleLine = (
  line: number[],
  i: number,
  treeHeight: number
): boolean => {
  const lineMap = line.map((tree: number, index: number) => ({ tree, index }))
  return (
    !lineMap.find(({ tree, index }) => tree >= treeHeight && index < i) ||
    !lineMap.find(({ tree, index }) => tree >= treeHeight && index > i)
  )
}

const isVisible = (
  row: number[],
  column: number[],
  i: number,
  j: number
): boolean => {
  const treeHeight: number = row[j]
  if (checkVisibleLine(row, j, treeHeight)) {
    return true
  }
  if (checkVisibleLine(column, i, treeHeight)) {
    return true
  }
  return false
}

const getViewDistance = (
  line: number[],
  i: number,
  treeHeight: number
): { left: number; right: number } => {
  let left: number = 0
  for (let n = i - 1; n >= 0; n--) {
    left += 1
    if (line[n] >= treeHeight) {
      break
    }
  }
  let right: number = 0
  for (let n = i + 1; n < line.length; n++) {
    right += 1
    if (line[n] >= treeHeight) {
      break
    }
  }
  return { left, right }
}

const scenicScore = (
  row: number[],
  column: number[],
  i: number,
  j: number
): number => {
  const treeHeight: number = row[j]
  const { left, right } = getViewDistance(row, j, treeHeight)
  const { left: up, right: down } = getViewDistance(column, i, treeHeight)
  return left * right * up * down
}

export const run = (): void => {
  const rawInput: string = readFile(8, false)

  const rows: string[] = rawInput.split('\n')
  const matrix: number[][] = rows.map((row: string) =>
    row.split('').map((val: string) => +val)
  )
  const transposedMatrix: number[][] = transpose(matrix)
  const height: number = matrix.length
  const width: number = matrix[0].length
  let visibleCount: number = height * 2 + (width - 2) * 2
  const scenicScores: number[] = []
  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      if (isVisible(matrix[i], transposedMatrix[j], i, j)) {
        visibleCount += 1
      }
      scenicScores.push(scenicScore(matrix[i], transposedMatrix[j], i, j))
    }
  }
  const [partTwo]: number[] = scenicScores.sort((a: number, b: number) => b - a)
  console.log(visibleCount)
  console.log(partTwo)
}
