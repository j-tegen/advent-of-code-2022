export enum Moves {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}
export const moveMap = {
  [Moves.Rock]: {
    win: Moves.Scissors,
    lose: Moves.Paper,
  },
  [Moves.Paper]: {
    win: Moves.Rock,
    lose: Moves.Scissors,
  },
  [Moves.Scissors]: {
    win: Moves.Paper,
    lose: Moves.Rock,
  },
}
