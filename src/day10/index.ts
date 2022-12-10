import { readFile } from '../utils/files.utils'
import { Operation } from './types'

const parseOperations = (rawInput: string): Operation[] => {
  return rawInput.split('\n').map((row: string) => {
    const [type, value]: string[] = row.split(' ')
    if (type === 'noop') {
      return {
        cycles: 1,
      }
    }
    return {
      cycles: 2,
      value: +value,
    }
  })
}

const printImage = (image: string[][]): void => {
  console.log(image.map((row: string[]) => row.join('')).join('\n'))
}

export const run = (): void => {
  const rawInput: string = readFile(10, false)
  const operations: Operation[] = parseOperations(rawInput)
  const signalStrengths: number[] = []
  const instructions: number[] = []
  let registerValue: number = 1
  const image: string[][] = Array(6)
    .fill(0)
    .map(() => Array(40).fill('.'))

  for (let cycle: number = 1; cycle <= 240; cycle++) {
    if ((cycle - 20) % 40 === 0) {
      signalStrengths.push(registerValue * cycle)
    }

    const pixelColumn: number = (cycle - 1) % 40
    const pixelRow: number = Math.floor(cycle / 40)

    if (operations[cycle - 1]) {
      const { cycles, value } = operations[cycle - 1]
      instructions.push(...Array(cycles).fill(0))
      instructions[instructions.length - 1] = value || 0
    }

    if (Math.abs(pixelColumn - registerValue) <= 1) {
      image[pixelRow][pixelColumn] = '#'
    }

    registerValue += instructions.splice(0, 1)[0]
  }
  const partOne: number = signalStrengths.reduce(
    (acc: number, curr: number) => acc + curr,
    0
  )
  console.log(partOne)
  printImage(image)
}
