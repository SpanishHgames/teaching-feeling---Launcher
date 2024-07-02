const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveConfig: () => ipcRenderer.invoke('save-config'),
  startGame: () => ipcRenderer.invoke('start-game'),
  getExecutablePath: () => ipcRenderer.invoke('get-executable-path'),
});



window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  replaceText(launcher-version, '1.0.0');
});
