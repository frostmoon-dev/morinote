const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = !app.isPackaged;

// Configure auto-updater
autoUpdater.autoDownload = false; // User controls when to download
autoUpdater.autoInstallOnAppQuit = true; // Install when app closes

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

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available!`,
        buttons: ['Download Now', 'Later'],
        defaultId: 0,
        cancelId: 1
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    });
});

autoUpdater.on('update-not-available', () => {
    console.log('App is up to date');
});

autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent);
    console.log(`Download progress: ${percent}%`);
    // You can send this to the renderer process if you want a progress bar
});

autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded');
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: `Version ${info.version} has been downloaded. Restart the app to install the update.`,
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
    createWindow();

    // Check for updates on startup (only in production)
    if (!isDev) {
        setTimeout(() => {
            autoUpdater.checkForUpdates();
        }, 3000); // Wait 3 seconds after app starts
    }

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

// IPC handler to manually check for updates
ipcMain.handle('check-for-updates', async () => {
    if (isDev) {
        return { available: false, message: 'Updates disabled in development mode' };
    }
    try {
        const result = await autoUpdater.checkForUpdates();
        return { available: true, version: result?.updateInfo?.version };
    } catch (error) {
        return { available: false, error: error.message };
    }
});
