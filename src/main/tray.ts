import { Tray, Menu } from 'electron'
import path from 'path'
let tray: Tray

export default function initTray(mainWindow: Electron.BrowserWindow, app: Electron.App) {
  tray = new Tray(path.join(__dirname, '../../resources/icon.png'))
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Hide',
      click: () => {
        mainWindow.hide()
      }
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.exit()
      }
    }
  ])

  tray.setContextMenu(trayMenu)
  tray.setToolTip('Electron App')

  tray.on('click', () => {
    if (!mainWindow.isVisible()) mainWindow.show()
  })
}
