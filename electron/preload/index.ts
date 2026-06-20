import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { ipcChannels } from '../../shared/ipc'
import type {
  AppLanguage,
  GeneratePdfsPayload,
  GeneratePdfsProgress,
  GeneratePdfsResult,
  SelectedDirectory,
  SelectedFile
} from '../../shared/types'

contextBridge.exposeInMainWorld('electronAPI', {
  getPathForFile: (file: File): string => webUtils.getPathForFile(file),
  selectLetterheadPdf: (): Promise<SelectedFile | null> => ipcRenderer.invoke(ipcChannels.selectLetterheadPdf),
  selectInputPdfs: (): Promise<SelectedFile[]> => ipcRenderer.invoke(ipcChannels.selectInputPdfs),
  selectOutputDirectory: (): Promise<SelectedDirectory | null> => ipcRenderer.invoke(ipcChannels.selectOutputDirectory),
  generatePdfs: (payload: GeneratePdfsPayload): Promise<GeneratePdfsResult> => ipcRenderer.invoke(ipcChannels.generatePdfs, payload),
  getSystemLanguage: (): Promise<AppLanguage> => ipcRenderer.invoke(ipcChannels.getSystemLanguage),
  getDefaultOutputDirectory: (): Promise<SelectedDirectory> => ipcRenderer.invoke(ipcChannels.getDefaultOutputDirectory),
  openOutputDirectory: (directoryPath: string): Promise<void> => ipcRenderer.invoke(ipcChannels.openOutputDirectory, directoryPath),
  minimizeWindow: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  toggleMaximizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window:toggle-maximize'),
  closeWindow: (): Promise<void> => ipcRenderer.invoke('window:close'),
  onGeneratePdfsProgress: (listener: (progress: GeneratePdfsProgress) => void): void => {
    const wrapped = (_event: Electron.IpcRendererEvent, progress: GeneratePdfsProgress) => listener(progress)
    ipcRenderer.on(ipcChannels.generatePdfsProgress, wrapped)
  }
})
