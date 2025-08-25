const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let updaterWindow;
let mainWindow;

// Конфигурация автообновления
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createUpdaterWindow() {
  updaterWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  updaterWindow.loadFile(path.join(__dirname, '../public/updater.html'));

  autoUpdater.on('checking-for-update', () => {
    updaterWindow.webContents.send('update-progress', {
      percent: 20,
      message: "Проверка обновлений..."
    });
  });

  autoUpdater.on('update-available', (info) => {
    updaterWindow.webContents.send('update-progress', {
      percent: 40,
      message: `Доступно обновление ${info.version}`
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    updaterWindow.webContents.send('update-progress', {
      percent: Math.floor(progress.percent),
      message: `Загрузка: ${Math.floor(progress.percent)}%`
    });
  });

  autoUpdater.on('update-downloaded', () => {
    updaterWindow.webContents.send('update-progress', {
      percent: 100,
      message: "Обновление готово к установке"
    });
    setTimeout(() => autoUpdater.quitAndInstall(), 1000);
  });

  autoUpdater.on('error', (err) => {
    updaterWindow.webContents.send('update-error', err.message);
  });

  autoUpdater.checkForUpdatesAndNotify();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

  // Обработчики управления окном
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-close', () => app.quit());
}

app.whenReady().then(() => {
  createUpdaterWindow();

  autoUpdater.on('update-not-available', () => {
    updaterWindow.webContents.send('update-progress', {
      percent: 100,
      message: "Лаунчер готов к работе"
    });
    setTimeout(() => {
      if (updaterWindow) updaterWindow.close();
      createMainWindow();
    }, 1500);
  });
});

// Обработчики IPC
ipcMain.handle('select-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return canceled ? null : filePaths[0];
});

ipcMain.on('clear-cache', () => {
  console.log('Очистка кэша...');
});

ipcMain.on('fix-permissions', () => {
  console.log('Исправление прав доступа...');
});

ipcMain.on('verify-files', () => {
  console.log('Проверка файлов игры...');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
