const { app, BrowserWindow, TouchBar, ipcMain } = require('electron');

let mainWindow;

const getRandomColor = () => {
  const values = ["#ff0000", "#00ff00", "#0000ff"];
  return values[Math.floor(Math.random() * values.length)];
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 240,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const touchBarButtons = [];

  for (let i = 0; i < 8; ++i) {
    const touchBarButton = new TouchBar.TouchBarButton();
    touchBarButton.backgroundColor = getRandomColor();
    touchBarButtons.push(touchBarButton);
  }

  const levelColors = ["#330000", "#330000", "#550000", "#770000", "#990000", "#bb0000", "#dd0000", "#ff0000"];

  ipcMain.on('visualizer', (event, val) => {
    const max = val * 8;
    for (let i = 0; i < 8; ++i) {
      const touchBarButton = touchBarButtons[i];
      touchBarButton.backgroundColor = i < max ? levelColors[i] : "#000000";
    }
  });
  
  const touchBar = new TouchBar({ items: touchBarButtons });

  mainWindow.setTouchBar(touchBar);
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});