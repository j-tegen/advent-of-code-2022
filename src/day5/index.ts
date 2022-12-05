import * as fs from 'fs'
import { Move } from './move'
import { Stack } from './stack'

const parseInput = (fileName: string): { stacks: Stack[]; moves: Move[] } => {
  const rawInput: string = fs.readFileSync(__dirname + `/${fileName}`, 'utf8')
  const [topInput, bottomInput]: string[] = rawInput.split('\n\n')
  const rawInitialStep: string[] = topInput.split('\n')
  const [stackIds]: string[] = rawInitialStep.splice(-1, 1)

  const stacks: Stack[] = stackIds.match(/[1-9]/g).map((id: string) => {
    return {
      id: +id,
      crates: [],
    }
  })
  rawInitialStep.forEach((rawRow: string) => {
    const row: string[] = rawRow.match(/([ ]{3}|\[[A-Z]\])/g)
    stacks.forEach((stack: Stack, index: number) => {
      const crate: string = row[index].trim()
      if (crate) {
        stack.crates.push(crate)
      }
    })
  })

  const moves: Move[] = bottomInput.split('\n').map((row: string) => {
    const [move, from, to] = row.match(/\d+/g)
    return {
      nbr: +move,
      sourceStack: +from,
      targetStack: +to,
    }
  })
  return { stacks, moves }
}

const makeMove = (
  stacks: Stack[],
  { sourceStack, targetStack, nbr }: Move,
  is9001: boolean = false
): void => {
  const target: Stack = stacks.find(({ id }: Stack) => id === targetStack)
  const crates: string[] = stacks
    .find(({ id }: Stack) => id === sourceStack)
    .crates.splice(0, nbr)
  if (!is9001) {
    crates.forEach((crate: string) => target.crates.unshift(crate))
  } else {
    target.crates = [...crates, ...target.crates]
  }
}

const parseResult = (stacks: Stack[]): string => {
  return stacks
    .filter(({ crates }: Stack) => !!crates.length)
    .map(({ crates }: Stack) => crates.shift().match(/[A-Z]/))
    .join('')
}

export const run = (fileName: string = 'test_input.txt'): void => {
  const { moves, stacks } = parseInput(fileName)

  moves.forEach((move: Move) => {
    makeMove(stacks, move, true)
  })
  const result: string = parseResult(stacks)
  console.log(result)
}
