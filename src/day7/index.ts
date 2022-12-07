import { readFile } from '../utils/files.utils'
import { Directory, File, LineType } from './types'

const parseLineType = (line: string): LineType => {
  if (line[0] === '$') {
    return LineType.Action
  } else if (line.match(/^dir/)) {
    return LineType.Dir
  }
  return LineType.File
}

const getDirectoryPath = (
  name: string,
  currentDirectory: Directory,
  path: string = ''
): string => {
  if (!currentDirectory) {
    return '/'
  }
  if (!currentDirectory.parentDirectory) {
    return `${path}/${name}`
  }
  return getDirectoryPath(
    name,
    currentDirectory.parentDirectory,
    `${currentDirectory.name}/${path}`
  )
}

const handleCdAction = (
  directories: Directory[],
  currentDirectory: Directory,
  actionLine: string
): Directory => {
  const [, , arg]: string[] = actionLine.split(' ')
  const dirPath: string = getDirectoryPath(arg, currentDirectory)
  if (arg === '..') {
    return currentDirectory.parentDirectory
  }
  const existingDirectory: Directory = directories.find(
    ({ path }: Directory) => path === dirPath
  )
  if (existingDirectory) {
    return existingDirectory
  }
  const newDirectory: Directory = {
    name: arg,
    path: dirPath,
    parentDirectory: currentDirectory,
    files: [],
    directories: [],
  }
  directories.push(newDirectory)
  return newDirectory
}

const isCdAction = (lineType: LineType, line: string): boolean => {
  return lineType === LineType.Action && !!line.match(/\$ cd/)
}

const handleFileLine = (directory: Directory, line: string): void => {
  const [fileSize, fileName]: string[] = line.split(' ')
  if (directory.files.find(({ name }: File) => name === fileName)) {
    return
  }
  directory.files.push({ size: +fileSize, name: fileName })
}

const sumSize = (directory: Directory, iteration: number = 1): number => {
  const fileSizes: number = directory.files.reduce(
    (acc: number, curr: File) => acc + curr.size,
    0
  )
  return directory.directories.reduce((acc: number, curr: Directory) => {
    return acc + sumSize(curr, iteration + 1)
  }, fileSizes)
}

const handleDirLine = (
  directories: Directory[],
  currentDirectory: Directory,
  line: string
): void => {
  const [, dirName]: string[] = line.split(' ')
  const dirPath: string = getDirectoryPath(dirName, currentDirectory)
  const existingSubDirectory: Directory = currentDirectory.directories.find(
    ({ path }: Directory) => path === dirPath
  )
  if (existingSubDirectory) {
    existingSubDirectory.parentDirectory = currentDirectory
    return
  }
  const existingDirectory: Directory = directories.find(
    ({ path }: Directory) => path === dirPath
  )
  if (existingDirectory) {
    const existingSubDirectory: Directory = currentDirectory.directories.find(
      ({ path }: Directory) => path === existingDirectory.path
    )
    existingDirectory.parentDirectory = currentDirectory
    if (!existingSubDirectory) {
      currentDirectory.directories.push(existingDirectory)
    }
    return
  }
  const newDirectory: Directory = {
    name: dirName,
    path: getDirectoryPath(dirName, currentDirectory),
    parentDirectory: currentDirectory,
    files: [],
    directories: [],
  }
  directories.push(newDirectory)
  currentDirectory.directories.push(newDirectory)
}

export const run = (): void => {
  const rawData: string = readFile(7, false)
  const lines: string[] = rawData.split('\n')
  const directories: Directory[] = []
  let currentDirectory: Directory = undefined
  lines.forEach((line: string) => {
    const lineType: LineType = parseLineType(line)
    if (isCdAction(lineType, line)) {
      currentDirectory = handleCdAction(directories, currentDirectory, line)
    }
    if (lineType === LineType.File) {
      handleFileLine(currentDirectory, line)
    }
    if (lineType === LineType.Dir) {
      handleDirLine(directories, currentDirectory, line)
    }
  })
  const sizes: number[] = directories.map((directory: Directory) =>
    sumSize(directory)
  )
  const partOne: number = sizes
    .filter((size: number) => size <= 100000)
    .reduce((acc: number, curr: number) => acc + curr, 0)

  const rootDirectory: Directory = directories.find(
    ({ path }: Directory) => path === '/'
  )
  const totalDiskSpace: number = 70000000
  const spaceNeeded: number = 30000000
  const totalSpaceUsed: number = sumSize(rootDirectory)
  const unusedSpace: number = totalDiskSpace - totalSpaceUsed
  const spaceToBeDeleted: number = Math.abs(spaceNeeded - unusedSpace)
  const [partTwo]: number[] = sizes
    .filter((size: number) => size >= spaceToBeDeleted)
    .sort((a: number, b: number) => a - b)

  console.log(partOne, partTwo)
}
