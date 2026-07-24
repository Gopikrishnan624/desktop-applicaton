const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFileAs: (content, defaultPath) => ipcRenderer.invoke('dialog:saveFile', content, defaultPath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content)
});
