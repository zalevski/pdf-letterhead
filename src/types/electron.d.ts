import type {
  AppLanguage,
  GeneratePdfsPayload,
  GeneratePdfsProgress,
  GeneratePdfsResult,
  SelectedDirectory,
  SelectedFile
} from '../../shared/types'

declare global {
  interface Window {
    electronAPI: {
      getPathForFile(file: File): string
      selectLetterheadPdf(): Promise<SelectedFile | null>
      selectInputPdfs(): Promise<SelectedFile[]>
      selectOutputDirectory(): Promise<SelectedDirectory | null>
      generatePdfs(payload: GeneratePdfsPayload): Promise<GeneratePdfsResult>
      getSystemLanguage(): Promise<AppLanguage>
      getDefaultOutputDirectory(): Promise<SelectedDirectory>
      openOutputDirectory(directoryPath: string): Promise<void>
      minimizeWindow(): Promise<void>
      toggleMaximizeWindow(): Promise<boolean>
      closeWindow(): Promise<void>
      onGeneratePdfsProgress(listener: (progress: GeneratePdfsProgress) => void): void
    }
  }
}

export {}
