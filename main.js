const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

const fs = require('fs');


ipcMain.on('getCredentials', (event, arg) => {
  const homedir = require('os').homedir() +'/.aws/credentials';
  let file = fs.readFileSync(homedir,"utf8");
  file = file.match(/\=(.*)/g);
  file = [file[0].slice(2),file[1].slice(2)];
  event.returnValue = file;
})

let mainWindow;

function initializeWindow() {
  mainWindow = new BrowserWindow({});
  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, './dist/index.html'));
  // mainWindow.webContents.openDevTools();
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