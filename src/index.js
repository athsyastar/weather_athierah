const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// IPC Communication
ipcMain.on("msg", function (event, data) {
  console.log(data);
  event.reply("reply", "Thank you for the data");
});

// Create the browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// Menu Template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click: () => app.quit(),
      },
    ],
  },
  // Add more menu items as needed
];

// App Events
app.on('ready', () => {
  createWindow();
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

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
