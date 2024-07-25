const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const RPC = require('discord-rpc');

let executablePathEs = null;
let executablePathEn = null;
let originalContent = null;
let mainWindow = null;

const clientId = '1144080613675106315';
RPC.register(clientId);
const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
  console.log('Discord Rich Presence is ready.');
  setMainActivity();
});

rpc.login({ clientId }).catch(console.error);

function setMainActivity() {
  rpc.setActivity({
    details: 'Using TeachFeel',
    state: 'Idle',
    startTimestamp: new Date(),
    largeImageKey: 'https://github.com/SpanishHgames/teaching-feeling---Launcher/blob/main/.github/img/3f392b5f13227650fd4b39a783ca2c4e.jpg?raw=true',
    largeImageText: 'TeachFeel App',
    smallImageKey: 'small-image-key',
    smallImageText: 'Version 1.0.0',
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'html', 'main.html'));
  mainWindow.setMenu(null);

  loadConfigs();
}

function loadConfigs() {
  const configPathEs = path.join(app.getPath('userData'), 'configEs.json');
  const configPathEn = path.join(app.getPath('userData'), 'configEn.json');

  if (fs.existsSync(configPathEs)) {
    const fileDataEs = fs.readFileSync(configPathEs);
    const configEs = JSON.parse(fileDataEs);
    executablePathEs = configEs.executablePath;
  }

  if (fs.existsSync(configPathEn)) {
    const fileDataEn = fs.readFileSync(configPathEn);
    const configEn = JSON.parse(fileDataEn);
    executablePathEn = configEn.executablePath;
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

ipcMain.handle('open-file-dialog-es', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Ejecutables', extensions: ['exe'] }],
  });

  if (result.canceled) {
    return null;
  } else {
    executablePathEs = result.filePaths[0];
    return executablePathEs;
  }
});

ipcMain.handle('open-file-dialog-en', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe'] }],
  });

  if (result.canceled) {
    return null;
  } else {
    executablePathEn = result.filePaths[0];
    return executablePathEn;
  }
});

ipcMain.handle('save-config-es', async () => {
  if (executablePathEs) {
    const configPathEs = path.join(app.getPath('userData'), 'configEs.json');
    const fileDataEs = { executablePath: executablePathEs };
    fs.writeFileSync(configPathEs, JSON.stringify(fileDataEs, null, 2));
    return 'Configuración guardada exitosamente para la aplicación en español.';
  }
  return 'No se ha seleccionado ningún ejecutable para la aplicación en español.';
});

ipcMain.handle('save-config-en', async () => {
  if (executablePathEn) {
    const configPathEn = path.join(app.getPath('userData'), 'configEn.json');
    const fileDataEn = { executablePath: executablePathEn };
    fs.writeFileSync(configPathEn, JSON.stringify(fileDataEn, null, 2));
    return 'Configuration saved successfully for the application in English.';
  }
  return 'No executable selected for the application in English.';
});

ipcMain.handle('start-game-es', async () => {
  if (!executablePathEs) {
    dialog.showMessageBoxSync(mainWindow, {
      type: 'error',
      title: 'Error',
      message: 'No se ha seleccionado ningún ejecutable para la aplicación en español.'
    });
    return 'No se ha seleccionado ningún ejecutable para la aplicación en español.';
  }
  return startGame(executablePathEs, 'español');
});

ipcMain.handle('start-game-en', async () => {
  if (!executablePathEn) {
    dialog.showMessageBoxSync(mainWindow, {
      type: 'error',
      title: 'Error',
      message: 'No executable selected for the application in English.'
    });
    return 'No executable selected for the application in English.';
  }
  return startGame(executablePathEn, 'English');
});

function startGame(executablePath, language) {
  return new Promise((resolve, reject) => {
    if (executablePath) {
      const indexPath = path.join(path.dirname(executablePath), 'resources', 'app', 'index.html');
      if (fs.existsSync(indexPath)) {
        originalContent = fs.readFileSync(indexPath, 'utf8');
        const modifiedContent = originalContent.replace('</body>', `
          <div style="position: fixed; top: 19px; left: 19px;"><img src="https://github.com/SpanishHgames/teaching-feeling---Launcher/blob/main/src/img/TeachFeel.png?raw=true" width="200px" height="auto"></div>
  </body>
        `);
        fs.writeFileSync(indexPath, modifiedContent);

        mainWindow.hide();

        exec(`"${executablePath}"`, (error, stdout, stderr) => {
          mainWindow.show();

          fs.writeFileSync(indexPath, originalContent);

          if (error) {
            console.error(`Error al ejecutar el archivo: ${error.message}`);
            resolve(`Error al iniciar el juego en ${language}.`);
          } else if (stderr) {
            console.error(`Error: ${stderr}`);
            resolve(`Error when starting the game in ${language}.`);
          } else {
            console.log(`Salida: ${stdout}`);
            resolve(`Game successfully launched in ${language}.`);
          }

          // Reset Discord Rich Presence to main activity
          setMainActivity();
        });

        // Update Discord Rich Presence
        rpc.setActivity({
          details: `Playing TeachFeel in ${language}`,
          state: 'In-Game',
          startTimestamp: new Date(),
          largeImageKey: 'https://github.com/SpanishHgames/teaching-feeling---Launcher/blob/main/.github/img/3f392b5f13227650fd4b39a783ca2c4e.jpg?raw=true',
          largeImageText: 'TeachFeel App',
          smallImageKey: 'small-image-key',
          smallImageText: `Version 1.0.0 (${language})`,
        });
      } else {
        resolve(`Archivo index no encontrado para la aplicación en ${language}.`);
      }
    } else {
      resolve(`Ruta del ejecutable no establecida para la aplicación en ${language}.`);
    }
  });
}

ipcMain.handle('get-executable-path-es', () => {
  return executablePathEs;
});

ipcMain.handle('get-executable-path-en', () => {
  return executablePathEn;
});
