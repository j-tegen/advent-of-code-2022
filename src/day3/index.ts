import * as fs from 'fs'
import { BackPack } from './backpack'
import { Group } from './group'

const parseInput = (fileName: string): string[] => {
  const rawInput: string = fs.readFileSync(__dirname + `/${fileName}`, 'utf8')
  return rawInput.split('\n')
}

const parseBackpacks = (rows: string[]): BackPack[] => {
  return rows.map((row: string) => ({
    firstCompartment: row.slice(0, row.length / 2).split(''),
    secondCompartment: row.slice(row.length / 2).split(''),
  }))
}

const getDuplicates = (backpacks: BackPack[]): string[][] => {
  return backpacks.map(({ firstCompartment, secondCompartment }: BackPack) => {
    return firstCompartment.filter((v: string) => secondCompartment.includes(v))
  })
}

const calculatePriority = (char: string): number => {
  const ascii: number = char.codePointAt(0)
  if (ascii >= 97) {
    return ascii - 96
  }
  return ascii - 38
}

const sumPriority = (duplicates: string[][]): number => {
  return duplicates.reduce((acc: number, row: string[]) => {
    const unique: string[] = [...new Set(row)]
    return (
      acc +
      unique.reduce(
        (acc: number, curr: string) => acc + calculatePriority(curr),
        0
      )
    )
  }, 0)
}

const getGroups = (rows: string[]): Group[] => {
  const groups: Group[] = []

  rows.forEach((row: string, index: number) => {
    if (index % 3 === 0) {
      return groups.push({ backpacks: [row] })
    }
    return groups[groups.length - 1].backpacks.push(row)
  })
  return groups
}

const getBadges = (groups: Group[]): string[] => {
  return groups.map(({ backpacks }: Group) => {
    return backpacks[0]
      .split('')
      .find(
        (item: string) =>
          backpacks[1].indexOf(item) > -1 && backpacks[2].indexOf(item) > -1
      )
  })
}

export const run = (fileName: string = 'test_input.txt'): void => {
  const rows: string[] = parseInput(fileName)
  const backpacks: BackPack[] = parseBackpacks(rows)
  const duplicates: string[][] = getDuplicates(backpacks)
  const sumPrio: number = sumPriority(duplicates)
  const groups: Group[] = getGroups(rows)
  const badges: string[] = getBadges(groups)
  const badgePriority: number = badges.reduce(
    (acc: number, curr: string) => acc + calculatePriority(curr),
    0
  )
  console.log(sumPrio, badgePriority)
}
