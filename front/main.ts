import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');


// !! TEST
const {ipcMain} = require('electron')
const {download} = require('electron-dl')
const PDFWindow = require('electron-pdf-window')


// !!

ipcMain.on('resize-login', (event, arg) => {
  win.setMinimumSize(500, 800)
  win.setSize(500,800)
  win.setResizable(false)



})


// ipcMain.on('download-btn', (e, args) => {
// 	download(BrowserWindow.getFocusedWindow(), args.url)
// 		.then(dl => console.log(dl.getSavePath()))
// 		.catch(console.error);
// });

ipcMain.on('download-btn', (e, args) => {
  const win = new PDFWindow({
    width: 800,
    height: 600
  })

  win.loadURL(args.url)
});

ipcMain.on('resize-app', (event, arg) => {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  let options = {
    width : 1300,
    height : 750,
    x : 0,
    y : 0
  }
  win.setMinimumSize(1300, 800)
  win.setResizable(true)
  win.setBounds(options);


  // TODO : SET RESiZABLE & Max W/H
})
ipcMain.on('download', (event, info) => {
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
    .then(dl => win.webContents.send('download complete', dl.getSavePath()));
});

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({

    width: 500,
    height: 800,
    center: true,
    resizable: false,
    title: "HouraGantt",
    darkTheme : true
    // maxWidth: 1300,
    // maxHeight:700

  });

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
