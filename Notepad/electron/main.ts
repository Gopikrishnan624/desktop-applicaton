import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // In Vite dev mode, process.env.VITE_DEV_SERVER_URL is available
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for Window Controls
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window-close', () => mainWindow?.close())

// IPC Handlers for File I/O
ipcMain.handle('dialog:openFile', async () => {
  if (!mainWindow) return null;
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Text Files', extensions: ['txt', 'md', 'json', 'xml', 'js', 'ts', 'html', 'css'] }
    ]
  })
  
  if (canceled || filePaths.length === 0) return null
  const filePath = filePaths[0]
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileName = filePath.split(/[/\\]/).pop() || 'Unknown'
    return { filePath, content, fileName }
  } catch (err) {
    console.error('Failed to read file:', err)
    return null
  }
})

ipcMain.handle('dialog:saveFile', async (_event, content: string, defaultPath?: string) => {
  if (!mainWindow) return null;
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath || 'Untitled.txt',
    filters: [{ name: 'All Files', extensions: ['*'] }]
  })
  
  if (canceled || !filePath) return null
  
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    const fileName = filePath.split(/[/\\]/).pop() || 'Unknown'
    return { filePath, fileName }
  } catch (err) {
    console.error('Failed to save file:', err)
    return null
  }
})

ipcMain.handle('fs:writeFile', async (_event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  } catch (err) {
    console.error('Failed to write file:', err)
    return false
  }
})
