import * as fs from 'fs'
import { Elf, Pair } from './elf'

const parseElf = (input: string): Elf => {
  const [min, max]: string[] = input.split('-')
  return {
    minId: +min,
    maxId: +max,
  }
}

const parseData = (fileName: string): Pair[] => {
  const rawInput: string = fs.readFileSync(__dirname + `/${fileName}`, 'utf8')
  const rows: string[] = rawInput.split('\n')
  return rows.map((row: string) => {
    const [left, right]: string[] = row.split(',')
    return {
      left: parseElf(left),
      right: parseElf(right),
    }
  })
}

const isContained = (left: Elf, right: Elf): boolean => {
  return left.maxId <= right.maxId && left.minId >= right.minId
}

const overlaps = (left: Elf, right: Elf): boolean => {
  if (left.maxId < right.minId) {
    return false
  }
  if (left.minId > right.maxId) {
    return false
  }
  return true
}

const calculateOverlaps = (pairs: Pair[]): Pair[] => {
  return pairs.filter(({ left, right }: Pair) => {
    return overlaps(left, right)
  })
}

const calculateContained = (pairs: Pair[]): Pair[] => {
  return pairs.filter(({ left, right }: Pair) => {
    if (isContained(left, right)) {
      return true
    }
    if (isContained(right, left)) {
      return true
    }
    return false
  })
}

export const run = (fileName: string = 'test_input.txt'): void => {
  const pairs: Pair[] = parseData(fileName)
  const contained: Pair[] = calculateContained(pairs)
  const overlaps: Pair[] = calculateOverlaps(pairs)
  console.log(contained.length)
  console.log(overlaps.length)
}
