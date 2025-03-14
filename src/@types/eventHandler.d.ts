import type { EventHandler } from '@create-figma-plugin/utilities'

declare global {
  interface LoadSettingsFromMain extends EventHandler {
    name: 'LOAD_SETTINGS_FROM_MAIN'
    handler: (settings: Settings) => void
  }

  interface SaveSettingsFromUI extends EventHandler {
    name: 'SAVE_SETTINGS_FROM_UI'
    handler: (settings: Settings) => void
  }

  interface NotifyFromUI extends EventHandler {
    name: 'NOTIFY_FROM_UI'
    handler: (options: {
      message: string
      options?: NotificationOptions
    }) => void
  }

  interface ProcessFinishFromMain extends EventHandler {
    name: 'PROCESS_FINISH_FROM_MAIN'
    handler: (options: {
      message: string
      options?: NotificationOptions
    }) => void
  }

  interface ResizeWindowFromUI extends EventHandler {
    name: 'RESIZE_WINDOW_FROM_UI'
    handler: (windowSize: { width: number; height: number }) => void
  }
}
