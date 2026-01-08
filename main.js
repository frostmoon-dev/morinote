const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
    // Determine icon path based on environment
    const iconPath = isDev
        ? path.join(__dirname, 'public', 'yume.png')
        : path.join(__dirname, 'dist', 'yume.png');

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: false, // Security: keep false
            contextIsolation: true, // Security: keep true
            preload: path.join(__dirname, 'preload.js'), // logical place for preload
        },
        // Mori-girl vibe: maybe start with a generic frame or frameless later
        backgroundColor: '#f5f5f5', // Neutral background as per rules
    });

    // Load the app
    if (isDev) {
        // In dev, load from vite server
        mainWindow.loadURL('http://localhost:5173');
        // Open DevTools in dev mode
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load the built html
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Setting up SQLite via IPC (Placeholder for now)
// We will implement specific handlers as we build the features
ipcMain.handle('ping', () => 'pong');
