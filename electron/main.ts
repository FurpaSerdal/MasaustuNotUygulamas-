import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { setupIpcHandlers } from './ipc/setupIpcHandlers';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    autoHideMenuBar: false,
    frame: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(process.resourcesPath, 'app', 'dist', 'electron', 'preload.js')
        : path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const indexPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app', 'dist', 'browser', 'index.html')
    : path.join(__dirname, '..', 'browser', 'index.html');

  console.log('Yüklenen dosya:', indexPath);
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
