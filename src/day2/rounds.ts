import { Moves } from './moves'
import { Result } from './result'

export interface RoundOne {
  opponent: Moves
  me: Moves
}

export interface RoundTwo {
  opponent: Moves
  me: Result
}
