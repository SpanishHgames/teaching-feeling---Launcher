const { contextBridge, ipcRenderer } = require('electron');

const electronAPIEs = {
  getExecutablePathEs: () => ipcRenderer.invoke('get-executable-path-es'),
  openFileDialogEs: () => ipcRenderer.invoke('open-file-dialog-es'),
  saveConfigEs: () => ipcRenderer.invoke('save-config-es'),
  startGameEs: () => ipcRenderer.invoke('start-game-es'),
};

const electronAPIEn = {
  getExecutablePathEn: () => ipcRenderer.invoke('get-executable-path-en'),
  openFileDialogEn: () => ipcRenderer.invoke('open-file-dialog-en'),
  saveConfigEn: () => ipcRenderer.invoke('save-config-en'),
  startGameEn: () => ipcRenderer.invoke('start-game-en'),
};

contextBridge.exposeInMainWorld('electronAPI', {
  ...electronAPIEs,
  ...electronAPIEn,
});
