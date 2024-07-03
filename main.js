const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let executablePathEs = null;
let executablePathEn = null;
let originalContent = null;
let mainWindow = null;

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

  // Cargar las configuraciones cuando se crea la ventana
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

ipcMain.handle('start-game-es', () => {
  return startGame(executablePathEs, 'español');
});

ipcMain.handle('start-game-en', () => {
  return startGame(executablePathEn, 'English');
});

function startGame(executablePath, language) {
  return new Promise((resolve, reject) => {
    if (executablePath) {
      const indexPath = path.join(path.dirname(executablePath), 'resources', 'app', 'index.html');
      if (fs.existsSync(indexPath)) {
        originalContent = fs.readFileSync(indexPath, 'utf8');
        const modifiedContent = originalContent.replace('</body>', `
          <div style="position: fixed; top: 20px; left: 20px;"><div style="color: rgba(165, 161, 161, 0.6); font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; text-align: center; display: inline;">TeachFeel v1.0.0 (${language})</div></div>
  </body>
        `);
        fs.writeFileSync(indexPath, modifiedContent);

        // Ocultar la ventana principal antes de iniciar el juego
        mainWindow.hide();

        exec(`"${executablePath}"`, (error, stdout, stderr) => {
          // Mostrar la ventana principal después de cerrar el juego
          mainWindow.show();

          // Revertir los cambios en index.html después de cerrar el juego
          fs.writeFileSync(indexPath, originalContent);

          if (error) {
            console.error(`Error al ejecutar el archivo: ${error.message}`);
            resolve(`Error al iniciar el juego en ${language}.`);
          } else if (stderr) {
            console.error(`Error: ${stderr}`);
            resolve(`Error al iniciar el juego en ${language}.`);
          } else {
            console.log(`Salida: ${stdout}`);
            resolve(`Juego iniciado exitosamente en ${language}.`);
          }
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
