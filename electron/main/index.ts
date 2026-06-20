import { app, BrowserWindow, ipcMain, shell } from 'electron'
import * as path from 'node:path'
import { ipcChannels } from '../../shared/ipc'
import type { GeneratePdfsPayload, GeneratePdfsProgress } from '../../shared/types'
import { detectAppLanguage } from './i18n'
import { selectInputPdfs, selectLetterheadPdf, selectOutputDirectory } from './fileDialogs'
import { generateLetterheadedPdfs } from './pdfProcessor'

let mainWindow: BrowserWindow | null = null

async function openOutputDirectory(directoryPath: string): Promise<void> {
  const error = await shell.openPath(directoryPath)
  if (error) {
    throw new Error(error)
  }
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1100,
    minHeight: 760,
    backgroundColor: '#0d1220',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.resolve(__dirname, '../preload/index.js')
    }
  })

  if (app.isPackaged) {
    const rendererIndex = path.join(process.resourcesPath, 'renderer', 'index.html')
    window.loadFile(rendererIndex)
  } else {
    window.loadURL('http://localhost:3000')
    window.webContents.openDevTools({ mode: 'detach' })
  }

  return window
}

function getWindowFromSender(event: Electron.IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender)
}

app.whenReady().then(() => {
  mainWindow = createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle(ipcChannels.selectLetterheadPdf, async () => selectLetterheadPdf())
ipcMain.handle(ipcChannels.selectInputPdfs, async () => selectInputPdfs())
ipcMain.handle(ipcChannels.selectOutputDirectory, async () => selectOutputDirectory())
ipcMain.handle(ipcChannels.getSystemLanguage, async () => detectAppLanguage(app.getLocale()))
ipcMain.handle(ipcChannels.getDefaultOutputDirectory, async () => ({
  path: app.getPath('desktop'),
  name: 'Desktop'
}))

ipcMain.handle(ipcChannels.openOutputDirectory, async (_event, directoryPath: string) => {
  await openOutputDirectory(directoryPath)
})

ipcMain.handle('window:minimize', async (event) => {
  getWindowFromSender(event)?.minimize()
})

ipcMain.handle('window:toggle-maximize', async (event) => {
  const window = getWindowFromSender(event)
  if (!window) {
    return false
  }

  if (window.isMaximized()) {
    window.unmaximize()
    return false
  }

  window.maximize()
  return true
})

ipcMain.handle('window:close', async (event) => {
  getWindowFromSender(event)?.close()
})

ipcMain.handle(ipcChannels.generatePdfs, async (event, payload: GeneratePdfsPayload) => {
  const reporter = (progress: GeneratePdfsProgress) => {
    event.sender.send(ipcChannels.generatePdfsProgress, progress)
  }

  try {
    return await generateLetterheadedPdfs(payload, reporter)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      successCount: 0,
      failureCount: payload.inputPdfPaths.length,
      fileResults: [],
      outputDirectory: payload.outputDirectory,
      errorCode: 'UNEXPECTED_PROCESSING_ERROR' as const,
      errorMessage: message
    }
  }
})
