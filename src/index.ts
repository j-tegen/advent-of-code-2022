import {
  calculateScoresRoundOne,
  calculateScoresRoundTwo,
  parseRoundOneInput,
  parseRoundTwoInput,
} from './day2'
import { RoundOne, RoundTwo } from './day2/rounds'

const roundOne: RoundOne[] = parseRoundOneInput('input.txt')
const roundTwo: RoundTwo[] = parseRoundTwoInput('input.txt')
console.log(calculateScoresRoundOne(roundOne))
console.log(calculateScoresRoundTwo(roundTwo))
