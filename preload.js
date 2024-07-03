const { contextBridge, ipcRenderer } = require('electron');

// Define the Spanish API object with methods that use ipcRenderer to communicate with the main process
const electronAPIEs = {
  // Method to get the executable path (Spanish version)
  getExecutablePathEs: () => ipcRenderer.invoke('get-executable-path-es'),
  // Method to open a file dialog (Spanish version)
  openFileDialogEs: () => ipcRenderer.invoke('open-file-dialog-es'),
  // Method to save the configuration (Spanish version)
  saveConfigEs: () => ipcRenderer.invoke('save-config-es'),
  // Method to start the game (Spanish version)
  startGameEs: () => ipcRenderer.invoke('start-game-es'),
};

// Define the English API object with methods that use ipcRenderer to communicate with the main process
const electronAPIEn = {
  // Method to get the executable path (English version)
  getExecutablePathEn: () => ipcRenderer.invoke('get-executable-path-en'),
  // Method to open a file dialog (English version)
  openFileDialogEn: () => ipcRenderer.invoke('open-file-dialog-en'),
  // Method to save the configuration (English version)
  saveConfigEn: () => ipcRenderer.invoke('save-config-en'),
  // Method to start the game (English version)
  startGameEn: () => ipcRenderer.invoke('start-game-en'),
};

// Use contextBridge to expose the API objects in the main world
contextBridge.exposeInMainWorld('electronAPI', {
  ...electronAPIEs,
  ...electronAPIEn,
});
