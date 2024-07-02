const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let executablePath = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  win.loadFile('src/html/main.html');

  // Load the configuration file when the window is created
  loadConfig();
}

function loadConfig() {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  if (fs.existsSync(configPath)) {
    const fileData = fs.readFileSync(configPath);
    const config = JSON.parse(fileData);
    executablePath = config.executablePath;
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe'] }],
  });

  if (result.canceled) {
    return null;
  } else {
    executablePath = result.filePaths[0];
    return executablePath;
  }
});

ipcMain.handle('save-config', async () => {
  if (executablePath) {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    const fileData = { executablePath };
    fs.writeFileSync(configPath, JSON.stringify(fileData, null, 2));
    return 'Configuration saved successfully.';
  }
  return 'No executable selected.';
});

ipcMain.handle('start-game', () => {
  if (executablePath) {
    exec(`"${executablePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing file: ${error.message}`);
        return 'Failed to start the game.';
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        return 'Failed to start the game.';
      }
      console.log(`Output: ${stdout}`);
      return 'Game started successfully.';
    });
  } else {
    return 'Executable path not set.';
  }
});

ipcMain.handle('get-executable-path', () => {
  return executablePath;
});
