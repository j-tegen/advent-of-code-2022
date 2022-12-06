import * as fs from 'fs'

const parseData = (fileName: string): string[] => {
  return fs.readFileSync(__dirname + `/${fileName}`, 'utf8').split('')
}

const isMarker = (substream: string[]): boolean => {
  return [...new Set(substream)].length === substream.length
}

const findMarker = (stream: string[], markerLength: number): number => {
  for (let index: number = 0; index < stream.length; index++) {
    if (isMarker(stream.slice(index, index + markerLength)))
      return index + markerLength
  }
}

export const run = (fileName: string = 'test_input.txt'): void => {
  const stream: string[] = parseData(fileName)
  const startOfPacket: number = findMarker(stream, 4)
  const startOfMessage: number = findMarker(stream, 14)
  console.log(startOfPacket, startOfMessage)
}
