import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // File operations
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFileAs: (content: string, defaultPath?: string) => ipcRenderer.invoke('dialog:saveFile', content, defaultPath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:writeFile', filePath, content)
})
