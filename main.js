const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let executablePath = null;
let originalContent = null;

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
  return new Promise((resolve, reject) => {
    if (executablePath) {
      const indexPath = path.join(path.dirname(executablePath), 'resources', 'app', 'index.html');
      if (fs.existsSync(indexPath)) {
        originalContent = fs.readFileSync(indexPath, 'utf8');
        const modifiedContent = originalContent.replace('</body>', `
          <div style="position: fixed; top: 20px; left: 20px;">
            <div style="color: rgba(165, 161, 161, 0.6); font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; text-align: center;">
              TeachFeel v1.0.0
            </div>
          </div>
          </body>
        `);
        fs.writeFileSync(indexPath, modifiedContent);

        exec(`"${executablePath}"`, (error, stdout, stderr) => {
          // Revert changes to index.html after the game closes
          fs.writeFileSync(indexPath, originalContent);

          if (error) {
            console.error(`Error executing file: ${error.message}`);
            resolve('Failed to start the game.');
          } else if (stderr) {
            console.error(`Error: ${stderr}`);
            resolve('Failed to start the game.');
          } else {
            console.log(`Output: ${stdout}`);
            resolve('Game started successfully.');
          }
        });
      } else {
        resolve('Index file not found.');
      }
    } else {
      resolve('Executable path not set.');
    }
  });
});

ipcMain.handle('get-executable-path', () => {
  return executablePath;
});
