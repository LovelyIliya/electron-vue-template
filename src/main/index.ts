import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdateInit, handleUpdate } from './update'
import initTray from './tray'
import { getLocalData, setLocalData, sleep } from './helper'
import icon from '../../resources/icon.png?asset'
import logger from 'electron-log'

let mainWindow: Electron.BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    event.preventDefault()
    if (getLocalData('minimizeToTray')) {
      return mainWindow.hide()
    }
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['最小化到托盘', '直接退出'],
        title: '提示',
        message: '确定要退出吗？',
        defaultId: 0,
        cancelId: -1,
        checkboxLabel: '默认最小化到托盘',
        checkboxChecked: true
      })
      .then((res) => {
        if (res.response === 0) {
          mainWindow.hide()
          if (res.checkboxChecked) {
            setLocalData('minimizeToTray', true)
          }
        } else {
          app.exit()
        }
      })
  })

  // 监听快捷键 F5 来刷新页面
  mainWindow.on('focus', () => {
    const { Menu } = require('electron')
    const menu = Menu.buildFromTemplate([
      {
        label: 'Refresh',
        accelerator: 'F5',
        click: () => {
          mainWindow.webContents.reload()
        }
      }
    ])
    Menu.setApplicationMenu(menu)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
Object.defineProperty(app, 'isPackaged', {
  get() {
    return true
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('testUpdate', () => handleUpdate())

  createWindow()
  // 系统托盘初始化
  initTray(mainWindow, app)
  // 自动更新检测初始化
  autoUpdateInit(mainWindow)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
