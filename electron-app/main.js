const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
// const isDev = require('electron-is-dev');

let mainWindow;
app.disableHardwareAcceleration();

app.on("ready", async () => {
  // Set empty menu to disable default shortcuts
  Menu.setApplicationMenu(null);
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      // Disable zoom
      zoomFactor: 1.0,
      // Only include preload if the file exists
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'), // Optional: Add app icon
    show: false, // Keep false initially
    titleBarStyle: 'hidden',
    resizable: false
  });

  // const startUrl = isDev
  //   ? 'http://localhost:5173'
  //   : `file://${path.join(__dirname, './build/index.html')}`;
  // mainWindow.loadURL(startUrl);
  mainWindow.loadFile(path.join("./dist/index.html")).catch((err)=>console.log(err));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // if (isDev) {
    //   mainWindow.webContents.openDevTools();
    // }
  });

  mainWindow.setMenuBarVisibility(false);

  // Prevent zoom shortcuts and reset zoom level
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Block Ctrl+Plus, Ctrl+Minus, Ctrl+0 (zoom shortcuts)
    if (input.control) {
      if (input.key === 'Plus' || input.key === '=' || 
          input.key === 'Minus' || input.key === '-' || 
          input.key === '0') {
        event.preventDefault();
      }
    }
    // Also block Ctrl+Shift+Plus and Ctrl+Shift+Minus
    if (input.control && input.shift) {
      if (input.key === 'Plus' || input.key === '=' || 
          input.key === 'Minus' || input.key === '-') {
        event.preventDefault();
      }
    }
  });

  // Disable zoom via mouse wheel + Ctrl
  mainWindow.webContents.on('zoom-changed', (event, zoomDirection) => {
    event.preventDefault();
    // Reset zoom to 1.0 if it gets changed
    mainWindow.webContents.setZoomFactor(1.0);
  });

  // Force zoom factor to always be 1.0
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.setZoomFactor(1.0);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.removeAllListeners("minimize-window");
  ipcMain.removeAllListeners("maximize-window");
  ipcMain.removeAllListeners("close-window");

  ipcMain.on("minimize-window", () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on("close-window", () => {
    if (mainWindow) mainWindow.close();
  });
};

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    navigationEvent.preventDefault();
  });
});