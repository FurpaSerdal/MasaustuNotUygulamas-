import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { setupIpcHandlers } from './ipc/setupIpcHandlers.js';

function createWindow(): void {
 const mainWindow = new BrowserWindow({
  width: 1024,
  height: 768,
  resizable: true,
  autoHideMenuBar: false,
  frame: true, // başlık çubuğu ve pencere kontrolleri gözükür
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  }
});


  const indexPath = path.join(__dirname, '..', 'electronnote', 'browser', 'index.html');
  console.log('Yüklenen dosya:', indexPath);
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  setupIpcHandlers(); // IPC handler'ları başlat
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
