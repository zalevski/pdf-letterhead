export const ipcChannels = {
  selectLetterheadPdf: 'dialog:select-letterhead-pdf',
  selectInputPdfs: 'dialog:select-input-pdfs',
  selectOutputDirectory: 'dialog:select-output-directory',
  generatePdfs: 'pdf:generate',
  generatePdfsProgress: 'pdf:generate-progress',
  getSystemLanguage: 'app:get-system-language',
  openOutputDirectory: 'dialog:open-output-directory'
  ,
  getDefaultOutputDirectory: 'app:get-default-output-directory'
} as const
