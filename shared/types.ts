export type AppLanguage = 'en' | 'pl' | 'de'

export type FileStatus = 'waiting' | 'processing' | 'done' | 'error'

export type ProcessingErrorCode =
  | 'NO_LETTERHEAD_SELECTED'
  | 'NO_INPUT_PDFS_SELECTED'
  | 'NO_OUTPUT_DIRECTORY_SELECTED'
  | 'INVALID_PDF_FILE'
  | 'DAMAGED_PDF_FILE'
  | 'UNSUPPORTED_ENCRYPTED_PDF'
  | 'FAILED_TO_READ_FILE'
  | 'FAILED_TO_WRITE_FILE'
  | 'OUTPUT_DIRECTORY_NOT_WRITABLE'
  | 'UNEXPECTED_PROCESSING_ERROR'

export interface SelectedFile {
  path: string
  name: string
}

export interface SelectedDirectory {
  path: string
  name: string
}

export interface StoredSelections {
  letterheadPath?: string
  outputDirectoryPath?: string
}

export interface GeneratePdfsPayload {
  letterheadPath: string
  inputPdfPaths: string[]
  outputDirectory: string
}

export interface FileGenerationResult {
  inputPath: string
  outputPath?: string
  status: 'done' | 'error'
  errorCode?: ProcessingErrorCode
  errorMessage?: string
}

export interface GeneratePdfsProgress {
  kind: 'file-started' | 'file-finished' | 'file-error' | 'all-finished'
  index: number
  total: number
  inputPath?: string
  outputPath?: string
  errorCode?: ProcessingErrorCode
  errorMessage?: string
}

export interface GeneratePdfsResult {
  successCount: number
  failureCount: number
  fileResults: FileGenerationResult[]
  outputDirectory?: string
  errorCode?: ProcessingErrorCode
  errorMessage?: string
}
