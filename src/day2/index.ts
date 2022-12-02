import * as fs from 'fs'
import { moveMap, Moves } from './moves'
import { Result } from './result'
import { RoundOne, RoundTwo } from './rounds'

const WIN_SCORE: number = 6
const TIE_SCORE: number = 3
const LOSS_SCORE: number = 0

const parseMove = (input: string): Moves => {
  switch (input) {
    case 'A':
    case 'X':
      return Moves.Rock

    case 'B':
    case 'Y':
      return Moves.Paper

    case 'C':
    case 'Z':
      return Moves.Scissors
  }
}

const parseResult = (input: string): Result => {
  switch (input) {
    case 'X':
      return Result.Loss
    case 'Y':
      return Result.Tie
    case 'Z':
      return Result.Win
  }
}

export const parseRoundOneInput = (fileName: string): RoundOne[] => {
  const result: string = fs.readFileSync(__dirname + `/${fileName}`, 'utf8')
  const rows: string[] = result.split('\n')
  return rows.map((row: string) => {
    const [opponent, me]: string[] = row.split(' ')
    return {
      opponent: parseMove(opponent),
      me: parseMove(me),
    }
  })
}

export const parseRoundTwoInput = (fileName: string): RoundTwo[] => {
  const result: string = fs.readFileSync(__dirname + `/${fileName}`, 'utf8')
  const rows: string[] = result.split('\n')
  return rows.map((row: string) => {
    const [opponent, me]: string[] = row.split(' ')
    return {
      opponent: parseMove(opponent),
      me: parseResult(me),
    }
  })
}

const scoreRoundOne = ({ opponent, me }: RoundOne): number => {
  const result: number = +me - +opponent
  switch (result) {
    case -2:
    case 1:
      return WIN_SCORE
    case 0:
      return TIE_SCORE
    case 2:
    case -1:
      return LOSS_SCORE
  }
}

const scoreRoundTwo = ({ opponent, me }: RoundTwo): number => {
  switch (me) {
    case Result.Tie:
      return +opponent + TIE_SCORE
    case Result.Loss:
      return +moveMap[opponent].win + LOSS_SCORE
    case Result.Win:
      return +moveMap[opponent].lose + WIN_SCORE
  }
}

export const calculateScoresRoundOne = (rounds: RoundOne[]): number => {
  return rounds.reduce((acc: number, curr: RoundOne) => {
    return acc + curr.me + scoreRoundOne(curr)
  }, 0)
}

export const calculateScoresRoundTwo = (rounds: RoundTwo[]): number => {
  return rounds.reduce((acc: number, curr: RoundTwo) => {
    return acc + scoreRoundTwo(curr)
  }, 0)
}
