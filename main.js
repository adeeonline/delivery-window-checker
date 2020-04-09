const { app, BrowserWindow, ipcMain } = require('electron');
const amazonFreshService = require('./services/amazon.js');
const { exec } = require("child_process");

function createWindow() {

  let win = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg);
  amazonFreshService.run(arg.username, arg.password, arg.contact, arg.refresh);
});

ipcMain.on('test-sms', (event, arg) => {
  console.log(arg);
  const txtMessageToSend = "Testing Message from Delivery Window Checker!";
  exec("osascript -e 'tell application \"Messages\" to send \"" + txtMessageToSend + "\" to buddy \"" + arg + "\"'");
});