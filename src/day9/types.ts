export enum Direction {
  Right = 'R',
  Up = 'U',
  Left = 'L',
  Down = 'D',
}

export interface Move {
  direction: Direction
  steps: number
}

export interface Coordinate {
  x: number
  y: number
}
