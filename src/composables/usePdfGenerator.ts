import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type {
  FileStatus,
  GeneratePdfsPayload,
  GeneratePdfsProgress,
  GeneratePdfsResult,
  SelectedDirectory,
  SelectedFile
} from '../../shared/types'

export interface ManagedInputFile extends SelectedFile {
  status: FileStatus
  errorCode?: string
}

export function usePdfGenerator() {
  const LETTERHEAD_KEY = 'pdf-letterhead-last-letterhead'
  const OUTPUT_DIR_KEY = 'pdf-letterhead-last-output-directory'

  const letterhead = ref<SelectedFile | null>(null)
  const inputFiles = ref<ManagedInputFile[]>([])
  const outputDirectory = ref<SelectedDirectory | null>(null)
  const isGenerating = ref(false)
  const summary = ref<GeneratePdfsResult | null>(null)
  const statusMessage = ref<string>('')
  const canGenerate = computed(() => Boolean(letterhead.value && inputFiles.value.length && outputDirectory.value && !isGenerating.value))

  function fileNameFromPath(filePath: string): string {
    const parts = filePath.split(/[/\\]/)
    return parts[parts.length - 1] || filePath
  }

  function normalizePath(filePath: string): string {
    return filePath.trim().toLowerCase()
  }

  function directoryNameFromPath(directoryPath: string): string {
    const parts = directoryPath.split(/[/\\]/)
    return parts[parts.length - 1] || directoryPath
  }

  function setLetterheadFromPath(filePath: string | null | undefined): void {
    if (!filePath) {
      letterhead.value = null
      return
    }

    letterhead.value = {
      path: filePath,
      name: fileNameFromPath(filePath)
    }
  }

  function setOutputDirectoryFromPath(directoryPath: string | null | undefined): void {
    if (!directoryPath) {
      outputDirectory.value = null
      return
    }

    outputDirectory.value = {
      path: directoryPath,
      name: directoryNameFromPath(directoryPath)
    }
  }

  function persistLetterhead(filePath: string | null): void {
    if (typeof window === 'undefined') {
      return
    }

    if (filePath) {
      localStorage.setItem(LETTERHEAD_KEY, filePath)
      return
    }

    localStorage.removeItem(LETTERHEAD_KEY)
  }

  function persistOutputDirectory(directoryPath: string | null): void {
    if (typeof window === 'undefined') {
      return
    }

    if (directoryPath) {
      localStorage.setItem(OUTPUT_DIR_KEY, directoryPath)
      return
    }

    localStorage.removeItem(OUTPUT_DIR_KEY)
  }

  async function initializeSelections(): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    const storedLetterhead = localStorage.getItem(LETTERHEAD_KEY)
    const storedOutputDirectory = localStorage.getItem(OUTPUT_DIR_KEY)

    if (storedLetterhead) {
      setLetterheadFromPath(storedLetterhead)
    }

    if (storedOutputDirectory) {
      setOutputDirectoryFromPath(storedOutputDirectory)
      return
    }

    if (window.electronAPI?.getDefaultOutputDirectory) {
      const desktop = await window.electronAPI.getDefaultOutputDirectory()
      outputDirectory.value = desktop
    }
  }

  function setInputFiles(files: SelectedFile[]): void {
    const uniqueFiles = Array.from(new Map(files.map((file) => [normalizePath(file.path), file])).values())

    inputFiles.value = uniqueFiles.map((file) => ({
      ...file,
      status: 'waiting'
    }))
    summary.value = null
    statusMessage.value = ''
  }

  function clearSelection(): void {
    letterhead.value = null
    inputFiles.value = []
    outputDirectory.value = null
    summary.value = null
    statusMessage.value = ''
    persistLetterhead(null)
    persistOutputDirectory(null)
  }

  function clearLetterhead(): void {
    letterhead.value = null
    summary.value = null
    statusMessage.value = ''
    persistLetterhead(null)
  }

  function clearInputs(): void {
    inputFiles.value = []
    summary.value = null
    statusMessage.value = ''
  }

  function removeInputFile(filePath: string): void {
    inputFiles.value = inputFiles.value.filter((file) => file.path !== filePath)
    summary.value = null
    statusMessage.value = ''
  }

  function clearOutputDirectory(): void {
    outputDirectory.value = null
    summary.value = null
    statusMessage.value = ''
    persistOutputDirectory(null)
  }

  function applyProgress(progress: GeneratePdfsProgress): void {
    if (!progress.inputPath) {
      if (progress.kind === 'all-finished') {
        isGenerating.value = false
      }
      return
    }

    const target = inputFiles.value.find((file) => file.path === progress.inputPath)
    if (!target) {
      return
    }

    if (progress.kind === 'file-started') {
      target.status = 'processing'
      target.errorCode = undefined
      return
    }

    if (progress.kind === 'file-finished') {
      target.status = 'done'
      target.errorCode = undefined
      return
    }

    if (progress.kind === 'file-error') {
      target.status = 'error'
      target.errorCode = progress.errorCode
    }
  }

  async function selectLetterhead(): Promise<void> {
    if (!window.electronAPI?.selectLetterheadPdf) {
      return
    }
    const selected = await window.electronAPI.selectLetterheadPdf()
    if (selected) {
      letterhead.value = selected
      summary.value = null
      statusMessage.value = ''
      persistLetterhead(selected.path)
    }
  }

  async function selectInputs(): Promise<void> {
    if (!window.electronAPI?.selectInputPdfs) {
      return
    }
    const selected = await window.electronAPI.selectInputPdfs()
    if (selected.length > 0) {
      setInputFiles(selected)
    }
  }

  async function selectOutput(): Promise<void> {
    if (!window.electronAPI?.selectOutputDirectory) {
      return
    }
    const selected = await window.electronAPI.selectOutputDirectory()
    if (selected) {
      outputDirectory.value = selected
      summary.value = null
      statusMessage.value = ''
      persistOutputDirectory(selected.path)
    }
  }

  function setLetterheadFromDrop(paths: string[]): void {
    const filePath = paths.find((path) => path.toLowerCase().endsWith('.pdf'))
    if (!filePath) {
      return
    }

    setLetterheadFromPath(filePath)
    persistLetterhead(filePath)
    summary.value = null
    statusMessage.value = ''
  }

  function setInputFilesFromDrop(paths: string[]): void {
    const pdfPaths = Array.from(new Map(
      paths
        .filter((path) => path.toLowerCase().endsWith('.pdf'))
        .map((path) => [normalizePath(path), path])
    ).values())
    if (pdfPaths.length === 0) {
      return
    }

    setInputFiles(pdfPaths.map((path) => ({
      path,
      name: fileNameFromPath(path)
    })))
  }

  function setOutputDirectoryFromDrop(paths: string[]): void {
    const droppedPath = paths[0]
    if (!droppedPath || droppedPath.toLowerCase().endsWith('.pdf')) {
      return
    }

    setOutputDirectoryFromPath(droppedPath)
    persistOutputDirectory(droppedPath)
    summary.value = null
    statusMessage.value = ''
  }

  function collectPayload(): GeneratePdfsPayload | null {
    if (!letterhead.value || inputFiles.value.length === 0 || !outputDirectory.value) {
      return null
    }

    return {
      letterheadPath: letterhead.value.path,
      inputPdfPaths: inputFiles.value.map((file) => file.path),
      outputDirectory: outputDirectory.value.path
    }
  }

  async function generate(): Promise<GeneratePdfsResult | null> {
    if (!window.electronAPI?.generatePdfs) {
      return null
    }
    const payload = collectPayload()
    if (!payload) {
      return null
    }

    isGenerating.value = true
    summary.value = null
    statusMessage.value = 'processing'
    inputFiles.value = inputFiles.value.map((file) => ({
      ...file,
      status: 'waiting',
      errorCode: undefined
    }))

    try {
      const result = await window.electronAPI.generatePdfs(payload)
      summary.value = result
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      summary.value = {
        successCount: 0,
        failureCount: inputFiles.value.length,
        fileResults: [],
        outputDirectory: outputDirectory.value?.path,
        errorCode: 'UNEXPECTED_PROCESSING_ERROR',
        errorMessage: message
      }
      return summary.value
    } finally {
      isGenerating.value = false
      statusMessage.value = ''
    }
  }

  async function openOutputDirectory(): Promise<void> {
    if (!outputDirectory.value) {
      return
    }

    if (!window.electronAPI?.openOutputDirectory) {
      return
    }

    await window.electronAPI.openOutputDirectory(outputDirectory.value.path)
  }

  onMounted(() => {
    void initializeSelections()

    if (!window.electronAPI?.onGeneratePdfsProgress) {
      return
    }

    window.electronAPI.onGeneratePdfsProgress((progress) => {
      applyProgress(progress)
      if (progress.kind === 'all-finished') {
        isGenerating.value = false
      }
    })
  })

  onBeforeUnmount(() => {
    isGenerating.value = false
  })

  return {
    letterhead,
    inputFiles,
    outputDirectory,
    summary,
    statusMessage,
    isGenerating,
    canGenerate,
    selectLetterhead,
    selectInputs,
    selectOutput,
    clearSelection,
    clearLetterhead,
    clearInputs,
    removeInputFile,
    clearOutputDirectory,
    initializeSelections,
    setLetterheadFromDrop,
    setInputFilesFromDrop,
    setOutputDirectoryFromDrop,
    generate,
    openOutputDirectory
  }
}
