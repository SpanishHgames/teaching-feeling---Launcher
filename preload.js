const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveConfig: () => ipcRenderer.invoke('save-config'),
  startGame: () => ipcRenderer.invoke('start-game'),
  getExecutablePath: () => ipcRenderer.invoke('get-executable-path'),
});
