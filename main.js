// require electron
const { app, BrowserWindow } = require('electron');
// require('electron-reload')(__dirname);
const path = require('path');
const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();


let mainWindow;

function initializeWindow() {
  mainWindow = new BrowserWindow({});
  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, './dist/index.html'));
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
  mainWindow = null;
  });
};

app.on('ready', initializeWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    initializeWindow();
  }
});