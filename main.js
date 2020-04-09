const { app, BrowserWindow, ipcMain } = require('electron');
const amazonFreshService = require('./services/amazon.js');
const { exec } = require("child_process");

function createWindow() {

  let win = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('synchronous-message', (event, arg) => {
  amazonFreshService.run(arg.username, arg.password, arg.contact, arg.refresh, arg.headless);
});

ipcMain.on('test-sms', (event, arg) => {
  const txtMessageToSend = "Testing Message from Delivery Window Checker!";
  exec("osascript -e 'tell application \"Messages\" to send \"" + txtMessageToSend + "\" to buddy \"" + arg + "\"'");
});