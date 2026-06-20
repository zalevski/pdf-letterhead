import { dialog } from 'electron'
import * as path from 'node:path'
import type { SelectedDirectory, SelectedFile } from '../../shared/types'

function toSelectedFile(filePath: string): SelectedFile {
  return {
    path: filePath,
    name: path.basename(filePath)
  }
}

export async function selectLetterheadPdf(): Promise<SelectedFile | null> {
  const result = await dialog.showOpenDialog({
    title: 'Select letterhead PDF',
    properties: ['openFile'],
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return toSelectedFile(result.filePaths[0])
}

export async function selectInputPdfs(): Promise<SelectedFile[]> {
  const result = await dialog.showOpenDialog({
    title: 'Select input PDFs',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return []
  }

  return result.filePaths.map(toSelectedFile)
}

export async function selectOutputDirectory(): Promise<SelectedDirectory | null> {
  const result = await dialog.showOpenDialog({
    title: 'Select output directory',
    properties: ['openDirectory', 'createDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  const directoryPath = result.filePaths[0]

  return {
    path: directoryPath,
    name: path.basename(directoryPath)
  }
}
