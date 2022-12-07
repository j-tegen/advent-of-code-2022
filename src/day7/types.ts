export interface File {
  name: string
  size: number
}

export interface Directory {
  name: string
  path: string
  directories: Directory[]
  parentDirectory: Directory
  files: File[]
}

export interface Action {
  name: string
  argument: string
}

export enum LineType {
  Dir = 'dir',
  File = 'file',
  Action = 'action',
}

export interface Line {
  type: LineType
  content: Action | File | Directory
}
