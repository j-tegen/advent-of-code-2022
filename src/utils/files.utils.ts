import * as fs from 'fs'

export const readFile = (day: number, isTest: boolean = true): string => {
  const suffix: string = isTest ? '_test' : ''
  return fs.readFileSync(__dirname + `/../../inputs/day${day}${suffix}`, 'utf8')
}
